import os from 'os';
import crypto from 'crypto';
import {
  WorkerConfig,
  WorkerHealth,
  WorkerExecutionState,
  StructuredLogEvent
} from './types';
import {
  claimNextQueuedResearchJob,
  heartbeatResearchJob,
  rescheduleResearchJob,
  CanonicalResearchJob
} from '../db';
import { processResearchJob, JobExecutionSummary } from '../processor';
import { ResearchCollector } from '../processor/types';
import { isTransientError, sanitizeErrorMessage } from '../processor/errors';

export class ResearchWorker {
  public readonly workerId: string;
  private readonly config: {
    workerId: string;
    workspaceId: string;
    pollIntervalMs: number;
    maxConcurrency: number;
    staleTimeoutMs: number;
    heartbeatIntervalMs: number;
    maxRetries: number;
    backoffBaseMs: number;
    maxBackoffMs: number;
    drainTimeoutMs: number;
    once: boolean;
    collector?: ResearchCollector;
    logFormat: 'json' | 'pretty';
  };
  private state: WorkerExecutionState = 'idle';
  private startedAt = 0;
  private activeJobs = new Map<string, CanonicalResearchJob>();
  private jobsProcessed = 0;
  private jobsSucceeded = 0;
  private jobsFailed = 0;
  private lastPollAt: string | null = null;
  private lastHeartbeatAt: string | null = null;
  private lastClaimedJobId: string | null = null;

  private pollTimeout: NodeJS.Timeout | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private stopPromiseResolve: (() => void) | null = null;
  private isShuttingDown = false;

  constructor(options: WorkerConfig = {}) {
    const rawHostname = os.hostname().replace(/[^a-zA-Z0-9-]/g, '') || 'worker-host';
    const randSuffix = crypto.randomBytes(4).toString('hex');
    this.workerId = options.workerId || `research-worker-${rawHostname}-${process.pid}-${randSuffix}`;

    this.config = {
      workerId: this.workerId,
      workspaceId: options.workspaceId || '',
      pollIntervalMs: Math.max(250, options.pollIntervalMs ?? 2000),
      maxConcurrency: Math.max(1, Math.min(options.maxConcurrency ?? 2, 5)),
      staleTimeoutMs: Math.max(10000, options.staleTimeoutMs ?? 5 * 60 * 1000),
      heartbeatIntervalMs: Math.max(1000, options.heartbeatIntervalMs ?? 10000),
      maxRetries: Math.max(1, Math.min(options.maxRetries ?? 3, 10)),
      backoffBaseMs: Math.max(500, options.backoffBaseMs ?? 2000),
      maxBackoffMs: Math.max(5000, options.maxBackoffMs ?? 60000),
      drainTimeoutMs: Math.max(1000, options.drainTimeoutMs ?? 15000),
      once: Boolean(options.once),
      collector: options.collector,
      logFormat: options.logFormat || 'pretty'
    };
  }

  /**
   * Starts the worker processing loop and background heartbeat timer.
   */
  public async start(): Promise<void> {
    if (this.state !== 'idle' && this.state !== 'stopped') {
      throw new Error(`Worker ${this.workerId} cannot start while in state "${this.state}".`);
    }

    this.state = 'polling';
    this.startedAt = Date.now();
    this.isShuttingDown = false;

    this.log({
      level: 'info',
      event: 'worker_started',
      details: {
        workerId: this.workerId,
        workspaceId: this.config.workspaceId || 'all_workspaces',
        maxConcurrency: this.config.maxConcurrency,
        pollIntervalMs: this.config.pollIntervalMs,
        heartbeatIntervalMs: this.config.heartbeatIntervalMs,
        maxRetries: this.config.maxRetries,
        mode: this.config.once ? 'run_once_drain' : 'continuous_daemon'
      }
    });

    // Start lease heartbeat interval
    this.startHeartbeatLoop();

    // Start primary poll loop
    await this.runLoop();
  }

  /**
   * Requests graceful worker shutdown:
   * 1. Stops claiming new work.
   * 2. Waits for active in-flight jobs to complete within drainTimeoutMs.
   * 3. Cleans up timers and transitions to stopped.
   */
  public async stop(signal = 'MANUAL'): Promise<void> {
    if (this.isShuttingDown || this.state === 'stopped') {
      return;
    }

    this.isShuttingDown = true;
    this.state = 'stopping';

    this.log({
      level: 'info',
      event: 'worker_stopping',
      details: {
        signal,
        activeJobs: this.activeJobs.size,
        drainTimeoutMs: this.config.drainTimeoutMs
      }
    });

    if (this.pollTimeout) {
      clearTimeout(this.pollTimeout);
      this.pollTimeout = null;
    }

    // Wait for in-flight jobs to drain, with safety timeout
    if (this.activeJobs.size > 0) {
      await Promise.race([
        new Promise<void>(resolve => {
          this.stopPromiseResolve = resolve;
        }),
        new Promise<void>(resolve => {
          setTimeout(() => {
            if (this.activeJobs.size > 0) {
              this.log({
                level: 'warn',
                event: 'drain_timeout_exceeded',
                details: { activeJobsRemaining: this.activeJobs.size }
              });
            }
            resolve();
          }, this.config.drainTimeoutMs);
        })
      ]);
    }

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    this.state = 'stopped';
    this.log({
      level: 'info',
      event: 'worker_stopped',
      details: {
        jobsProcessed: this.jobsProcessed,
        jobsSucceeded: this.jobsSucceeded,
        jobsFailed: this.jobsFailed,
        uptimeSeconds: Math.floor((Date.now() - this.startedAt) / 1000)
      }
    });
  }

  /**
   * Returns current health and diagnostic metrics for observability.
   */
  public getHealth(): WorkerHealth {
    const uptimeSeconds = this.startedAt > 0 ? Math.floor((Date.now() - this.startedAt) / 1000) : 0;
    return {
      status: this.state,
      workerId: this.workerId,
      workspaceId: this.config.workspaceId || null,
      uptimeSeconds,
      activeJobs: this.activeJobs.size,
      maxConcurrency: this.config.maxConcurrency,
      jobsProcessed: this.jobsProcessed,
      jobsSucceeded: this.jobsSucceeded,
      jobsFailed: this.jobsFailed,
      lastPollAt: this.lastPollAt,
      lastHeartbeatAt: this.lastHeartbeatAt,
      lastClaimedJobId: this.lastClaimedJobId
    };
  }

  /**
   * Primary polling and scheduling loop.
   */
  private async runLoop(): Promise<void> {
    while (!this.isShuttingDown) {
      try {
        // Can we claim work?
        if (this.activeJobs.size < this.config.maxConcurrency) {
          this.lastPollAt = new Date().toISOString();
          const claimedJob = await claimNextQueuedResearchJob(this.workerId, {
            workspaceId: this.config.workspaceId || undefined,
            staleTimeoutMs: this.config.staleTimeoutMs
          });

          if (claimedJob && claimedJob.id) {
            this.lastClaimedJobId = claimedJob.id;
            this.activeJobs.set(claimedJob.id, claimedJob);
            this.state = 'processing';

            this.log({
              level: 'info',
              event: 'job_claimed',
              job_id: claimedJob.id,
              workspace_id: claimedJob.workspace_id,
              details: {
                priority: claimedJob.priority || 'normal',
                topic: claimedJob.topic,
                activeJobs: this.activeJobs.size
              }
            });

            // Execute job asynchronously in worker slot
            this.executeJob(claimedJob).catch(err => {
              this.log({
                level: 'error',
                event: 'job_execution_fatal_throw',
                job_id: claimedJob.id,
                workspace_id: claimedJob.workspace_id,
                error: sanitizeErrorMessage(err)
              });
            });

            // Immediately loop to see if concurrency slots remain
            continue;
          }
        }

        // Run-once mode check: if queue is empty and active work is 0, we can stop
        if (this.config.once && this.activeJobs.size === 0) {
          this.log({
            level: 'info',
            event: 'run_once_drained',
            details: { message: 'Queue is empty and active tasks drained.' }
          });
          await this.stop('ONCE_DRAINED');
          return;
        }

        // Idle delay before next poll
        if (this.activeJobs.size === 0) {
          this.state = 'idle';
        }

        await new Promise<void>(resolve => {
          this.pollTimeout = setTimeout(() => {
            this.pollTimeout = null;
            resolve();
          }, this.config.pollIntervalMs);
        });
      } catch (loopErr: unknown) {
        this.log({
          level: 'error',
          event: 'worker_poll_loop_error',
          error: sanitizeErrorMessage(loopErr)
        });

        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  /**
   * Executes a claimed job using the established native research processor.
   */
  private async executeJob(job: CanonicalResearchJob): Promise<void> {
    const startTime = Date.now();
    const jobId = job.id!;
    const workspaceId = job.workspace_id!;

    try {
      const summary: JobExecutionSummary = await processResearchJob(jobId, workspaceId, {
        concurrency: 2,
        maxRetries: 2,
        collector: this.config.collector,
        workerId: this.workerId,
        skipJobClaim: true,
        force: false
      });

      const durationMs = Date.now() - startTime;

      if (summary.finalStatus === 'completed') {
        this.jobsProcessed++;
        this.jobsSucceeded++;

        this.log({
          level: 'info',
          event: 'job_completed',
          job_id: jobId,
          workspace_id: workspaceId,
          duration_ms: durationMs,
          details: {
            assignmentsCompleted: summary.assignmentsCompleted,
            assignmentsFailed: summary.assignmentsFailed,
            resultsCreated: summary.resultsCreated
          }
        });
      } else {
        // Job status is 'failed'
        await this.handleJobFailure(job, summary.errors?.[0]?.error || 'Assignment processing failure');
      }
    } catch (err: unknown) {
      await this.handleJobFailure(job, sanitizeErrorMessage(err));
    } finally {
      this.activeJobs.delete(jobId);

      // If shutting down and active jobs reached zero, notify graceful shutdown
      if (this.isShuttingDown && this.activeJobs.size === 0 && this.stopPromiseResolve) {
        this.stopPromiseResolve();
      }
    }
  }

  /**
   * Handles failure with transient detection, exponential backoff, and dead-lettering.
   */
  private async handleJobFailure(job: CanonicalResearchJob, rawError: string): Promise<void> {
    const jobId = job.id!;
    const workspaceId = job.workspace_id!;
    const sanitizedError = sanitizeErrorMessage(rawError);
    const isTransient = isTransientError(new Error(sanitizedError));

    const jobParams = (job.parameters && typeof job.parameters === 'object') ? job.parameters : {};
    const attemptCount = (job.attempt_count || (jobParams as { queue?: { attempt_count?: number } }).queue?.attempt_count || 1);

    if (isTransient && attemptCount < this.config.maxRetries) {
      // Exponential backoff with jitter
      const exponential = this.config.backoffBaseMs * Math.pow(2, attemptCount - 1);
      const jitter = Math.floor(Math.random() * 500);
      const backoffMs = Math.min(this.config.maxBackoffMs, exponential + jitter);

      const rescheduleResult = await rescheduleResearchJob(jobId, this.workerId, workspaceId, {
        error: sanitizedError,
        backoffMs,
        maxRetries: this.config.maxRetries
      });

      this.log({
        level: 'warn',
        event: 'job_rescheduled',
        job_id: jobId,
        workspace_id: workspaceId,
        attempt: attemptCount,
        error: sanitizedError,
        details: {
          nextRunAt: rescheduleResult.nextRunAt,
          backoffMs,
          maxRetries: this.config.maxRetries
        }
      });
    } else {
      // Terminal failure / dead-letter
      this.jobsProcessed++;
      this.jobsFailed++;

      await rescheduleResearchJob(jobId, this.workerId, workspaceId, {
        error: sanitizedError,
        backoffMs: 0,
        maxRetries: attemptCount // forces terminal failure
      });

      this.log({
        level: 'error',
        event: 'job_dead_lettered',
        job_id: jobId,
        workspace_id: workspaceId,
        attempt: attemptCount,
        error: sanitizedError,
        details: {
          reason: isTransient ? 'max_retries_exhausted' : 'permanent_processor_error',
          maxRetries: this.config.maxRetries
        }
      });
    }
  }

  /**
   * Background lease heartbeat loop to prevent long-running jobs from being marked stale.
   */
  private startHeartbeatLoop(): void {
    if (this.heartbeatInterval) return;

    this.heartbeatInterval = setInterval(async () => {
      if (this.activeJobs.size === 0) return;

      const nowIso = new Date().toISOString();
      this.lastHeartbeatAt = nowIso;

      for (const [jobId, job] of this.activeJobs.entries()) {
        try {
          await heartbeatResearchJob(jobId, this.workerId, job.workspace_id);
        } catch (hbErr) {
          this.log({
            level: 'warn',
            event: 'worker_heartbeat_failed',
            job_id: jobId,
            error: sanitizeErrorMessage(hbErr)
          });
        }
      }
    }, this.config.heartbeatIntervalMs);
  }

  /**
   * Structured logging output respecting production JSON or local human-readable formats.
   */
  private log(event: Omit<StructuredLogEvent, 'timestamp' | 'worker_id'>): void {
    const payload: StructuredLogEvent = {
      timestamp: new Date().toISOString(),
      worker_id: this.workerId,
      ...event
    };

    if (this.config.logFormat === 'json') {
      console.log(JSON.stringify(payload));
      return;
    }

    const levelTag = `[${payload.level.toUpperCase()}]`;
    const eventName = `[${payload.event}]`;
    const jobTag = payload.job_id ? `[Job: ${payload.job_id}]` : '';
    const detailsStr = payload.details ? ` ${JSON.stringify(payload.details)}` : '';
    const errorStr = payload.error ? ` Error: ${payload.error}` : '';

    const msg = `[Research Worker] ${levelTag} ${eventName} ${jobTag}${detailsStr}${errorStr}`.trim();
    if (payload.level === 'error') {
      console.error(msg);
    } else if (payload.level === 'warn') {
      console.warn(msg);
    } else {
      console.log(msg);
    }
  }
}
