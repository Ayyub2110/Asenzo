import {
  ResearchProcessorOptions,
  JobExecutionSummary,
  AssignmentExecutionResult,
  JobExecutionStatus,
  ResearchCollector,
  ResearchCollectionJob
} from './types';
import {
  PermanentProcessorError,
  RateLimitError,
  isTransientError,
  sanitizeErrorMessage
} from './errors';
import { NativeResearchCollector } from './collector';
import { generateObservationIdempotencyKey } from './idempotency';
import {
  findResearchJob,
  findResearchAssignmentsByJob,
  claimResearchJob,
  updateResearchJobStatus,
  claimResearchAssignment,
  completeResearchAssignment,
  failResearchAssignment,
  createDefaultAssignmentsForJob,
  insertResearchResult,
  CanonicalResearchJob,
  CanonicalResearchAssignment,
  CanonicalResearchResult
} from '../db';
import { resolveCanonicalWorkspaceId } from '../workspace';

export * from './types';
export * from './errors';
export * from './collector';
export * from './idempotency';
export * from './dispatcher';

// In-memory tracker for active running jobs on this server process
const activeJobs = new Set<string>();

export function isJobActiveInMemory(jobId: string): boolean {
  return activeJobs.has(jobId);
}

/**
 * Native Research Processor
 * Executes research jobs natively with verified atomic claims, bounded retries,
 * stable content-addressed deduplication, and failure isolation.
 */
export async function processResearchJob(
  jobId: string,
  workspaceId: string,
  options: ResearchProcessorOptions = {}
): Promise<JobExecutionSummary> {
  const startTime = Date.now();
  const resolvedWorkspaceId = await resolveCanonicalWorkspaceId(workspaceId);

  // 1. Load and validate job
  const job = await findResearchJob(jobId);
  if (!job || job.workspace_id !== resolvedWorkspaceId) {
    throw new PermanentProcessorError(`Research job "${jobId}" not found in workspace "${workspaceId}".`, 404);
  }

  if (job.status === 'cancelled') {
    throw new PermanentProcessorError(`Research job "${jobId}" is cancelled and cannot be executed.`, 400);
  }

  // Idempotency: If already completed and not forced, return existing state
  if (job.status === 'completed' && !options.force) {
    console.log(`[Native Processor] Job ${jobId} is already completed. Returning idempotent summary.`);
    const existingAssignments = await findResearchAssignmentsByJob(jobId, resolvedWorkspaceId);
    return {
      jobId,
      workspaceId: resolvedWorkspaceId,
      initialStatus: job.status,
      finalStatus: 'completed',
      assignmentsTotal: existingAssignments.length,
      assignmentsCompleted: existingAssignments.filter(a => a.status === 'completed').length,
      assignmentsFailed: existingAssignments.filter(a => a.status === 'failed').length,
      resultsCreated: 0,
      durationMs: Date.now() - startTime,
      errors: []
    };
  }

  // 2. Atomic Job Claim
  let claimedJob: CanonicalResearchJob | null = null;
  const isPreClaimed = Boolean(
    options.skipJobClaim ||
    (options.workerId && (job.assigned_worker === options.workerId || job.locked_by === options.workerId))
  );

  if (isPreClaimed) {
    claimedJob = job;
  } else {
    claimedJob = await claimResearchJob(jobId, resolvedWorkspaceId, options.staleJobTimeoutMs);
  }

  if (!claimedJob) {
    console.warn(`[Native Processor] Job ${jobId} could not be claimed (already running or actively claimed).`);
    const currentJob = await findResearchJob(jobId);
    return {
      jobId,
      workspaceId: resolvedWorkspaceId,
      initialStatus: job.status || 'queued',
      finalStatus: (currentJob?.status as JobExecutionStatus) || 'running',
      assignmentsTotal: 0,
      assignmentsCompleted: 0,
      assignmentsFailed: 0,
      resultsCreated: 0,
      durationMs: Date.now() - startTime,
      errors: [{ assignmentId: 'job_claim', error: 'Concurrent claim conflict: job already claimed by another active process' }]
    };
  }

  activeJobs.add(jobId);

  try {
    console.log(`[Native Processor] Claimed job ${jobId}. Beginning execution.`);

    // 3. Discover or generate assignments
    let assignments = await findResearchAssignmentsByJob(jobId, resolvedWorkspaceId);
    if (assignments.length === 0) {
      console.log(`[Native Processor] No assignments exist for job ${jobId}. Generating default assignments.`);
      assignments = await createDefaultAssignmentsForJob(job);
    }

    if (assignments.length === 0) {
      // Empty assignment set
      console.log(`[Native Processor] Empty assignment set for job ${jobId}. Completing job.`);
      await updateResearchJobStatus(jobId, resolvedWorkspaceId, {
        status: 'completed',
        completed_at: new Date().toISOString(),
        error: null
      });

      return {
        jobId,
        workspaceId: resolvedWorkspaceId,
        initialStatus: job.status || 'queued',
        finalStatus: 'completed',
        assignmentsTotal: 0,
        assignmentsCompleted: 0,
        assignmentsFailed: 0,
        resultsCreated: 0,
        durationMs: Date.now() - startTime,
        errors: []
      };
    }

    // 4. Bounded Concurrency Worker Pool
    const concurrency = Math.max(1, Math.min(options.concurrency || 2, 5));
    const collector = options.collector || new NativeResearchCollector();

    const eligibleAssignments = assignments.filter(a => a.status === 'queued' || a.status === 'failed' || options.force);
    const assignmentResults: AssignmentExecutionResult[] = [];
    const errors: Array<{ assignmentId: string; error: string }> = [];

    let queueIndex = 0;
    const workers = Array.from({ length: concurrency }, async (_, workerId) => {
      while (queueIndex < eligibleAssignments.length) {
        const assignment = eligibleAssignments[queueIndex++];
        if (!assignment) break;

        console.log(`[Native Processor] [Worker ${workerId}] Processing assignment ${assignment.id} (${assignment.assignment_type}).`);
        const result = await executeAssignment(assignment, job, resolvedWorkspaceId, collector, options);
        assignmentResults.push(result);

        if (!result.success && result.error) {
          errors.push({ assignmentId: assignment.id!, error: result.error });
        }
      }
    });

    await Promise.all(workers);

    // 5. Finalize outcomes safely from database truth
    const allAssignments = await findResearchAssignmentsByJob(jobId, resolvedWorkspaceId);
    const totalCount = allAssignments.length;
    const completedCount = allAssignments.filter(a => a.status === 'completed').length;
    const failedCount = allAssignments.filter(a => a.status === 'failed').length;
    const stillRunningCount = allAssignments.filter(a => a.status === 'running' || a.status === 'queued').length;

    let finalJobStatus: JobExecutionStatus = 'running';
    let jobErrorMessage: string | null = null;

    if (stillRunningCount > 0) {
      // Safety guard: Do not mark completed if assignments are still running or queued
      console.log(`[Native Processor] Job ${jobId} has ${stillRunningCount} assignments still in progress. Retaining status = running.`);
      finalJobStatus = 'running';
    } else if (failedCount > 0 && completedCount === 0) {
      finalJobStatus = 'failed';
      jobErrorMessage = `All ${failedCount} assignments failed.`;
    } else if (failedCount > 0 && completedCount > 0) {
      finalJobStatus = 'completed';
      jobErrorMessage = `Partial failure: ${failedCount} of ${totalCount} assignments failed.`;
    } else {
      finalJobStatus = 'completed';
      jobErrorMessage = null;
    }

    if (finalJobStatus !== 'running') {
      const updated = await updateResearchJobStatus(
        jobId,
        resolvedWorkspaceId,
        {
          status: finalJobStatus,
          completed_at: new Date().toISOString(),
          error: jobErrorMessage
        },
        { allowOverwriteCompleted: options.force, workerId: options.workerId }
      );
      if (!updated && options.workerId) {
        console.warn(`[Native Processor] Lease fencing: Job ${jobId} was reclaimed by another worker or already finalized. Discarding final status update.`);
      }
    }

    const totalResultsCreated = assignmentResults.reduce((sum, r) => sum + r.resultsCount, 0);
    const duration = Date.now() - startTime;

    console.log(`[Native Processor] Finished job ${jobId} in ${duration}ms. Final status: ${finalJobStatus}. Results created: ${totalResultsCreated}.`);

    return {
      jobId,
      workspaceId: resolvedWorkspaceId,
      initialStatus: job.status || 'queued',
      finalStatus: finalJobStatus,
      assignmentsTotal: totalCount,
      assignmentsCompleted: completedCount,
      assignmentsFailed: failedCount,
      resultsCreated: totalResultsCreated,
      durationMs: duration,
      errors
    };
  } catch (err: unknown) {
    const rawMsg = err instanceof Error ? err.message : String(err);
    const sanitizedMsg = sanitizeErrorMessage(rawMsg);
    console.error(`[Native Processor] Catastrophic failure executing job ${jobId}:`, sanitizedMsg);
    try {
      await updateResearchJobStatus(
        jobId,
        resolvedWorkspaceId,
        {
          status: 'failed',
          completed_at: new Date().toISOString(),
          error: `Native processor error: ${sanitizedMsg}`
        },
        { allowOverwriteCompleted: true, workerId: options.workerId }
      );
    } catch (statusErr) {
      console.error(`[Native Processor] Failed to record failure status for job ${jobId}:`, statusErr);
    }
    throw err;
  } finally {
    activeJobs.delete(jobId);
  }
}

/**
 * Executes a single research assignment with atomic concurrency claims, bounded retries, and failure isolation.
 */
async function executeAssignment(
  assignment: CanonicalResearchAssignment,
  job: CanonicalResearchJob,
  workspaceId: string,
  collector: ResearchCollector,
  options: ResearchProcessorOptions
): Promise<AssignmentExecutionResult> {
  const assignmentStartTime = Date.now();
  const maxRetries = Math.max(0, Math.min(options.maxRetries ?? 2, 5));
  const baseBackoff = Math.max(100, Math.min(options.baseBackoffMs || 500, 5000));
  const timeoutMs = Math.max(1000, Math.min(options.timeoutMs || 15000, 60000));

  // 1. Atomic Concurrency Protection: Claim assignment
  const claimed = await claimResearchAssignment(assignment.id!, workspaceId, options.staleAssignmentTimeoutMs);
  if (!claimed) {
    console.warn(`[Native Processor] Assignment ${assignment.id} was already claimed or running. Skipping duplicate execution.`);
    return {
      assignmentId: assignment.id!,
      assignmentType: assignment.assignment_type,
      success: false,
      attempts: 0,
      resultsCount: 0,
      error: 'Skipped duplicate trigger: assignment already claimed',
      durationMs: Date.now() - assignmentStartTime
    };
  }

  let attempt = 1;
  let lastError: unknown = null;

  const collectionJob: ResearchCollectionJob = {
    assignmentId: assignment.id!,
    jobId: job.id!,
    workspaceId,
    assignmentType: assignment.assignment_type as 'creator_research' | 'topic_research',
    platform: assignment.platform || job.platform || 'Instagram',
    topic: assignment.topic || job.topic,
    creator: assignment.creator,
    sourceTarget: assignment.source_target,
    dateRange: job.date_range,
    funnelStage: job.funnel_stage,
    timeoutMs
  };

  while (attempt <= maxRetries + 1) {
    try {
      console.log(`[Native Processor] Assignment ${assignment.id} attempt ${attempt} started.`);
      const observations = await collector.collect(collectionJob);

      let persistedResults = 0;
      for (const obs of observations) {
        const idempotencyKey = generateObservationIdempotencyKey(job.id!, assignment.id!, obs);

        const canonicalResult: CanonicalResearchResult = {
          workspace_id: workspaceId,
          research_job_id: job.id!,
          research_assignment_id: assignment.id!,
          source_url: obs.source_url,
          source_type: obs.source_type,
          source_title: obs.source_title,
          platform: obs.platform,
          creator: obs.creator,
          published_at: obs.published_at || undefined,
          topic: obs.topic,
          hook: obs.hook || undefined,
          angle: obs.angle || undefined,
          claim: obs.claim,
          evidence: obs.evidence,
          audience_signals: obs.audience_signals || {},
          market_signals: obs.market_signals || {},
          content_patterns: obs.content_patterns || {},
          evidence_strength: obs.evidence_strength,
          classification: obs.classification,
          confidence: obs.confidence,
          raw_source_reference: obs.raw_source_reference || {},
          research_agent: obs.research_agent,
          idempotency_key: idempotencyKey
        };

        const inserted = await insertResearchResult(canonicalResult);
        if (!inserted.__deduplicated) {
          persistedResults++;
        }
      }

      // Mark assignment completed
      await completeResearchAssignment(assignment.id!, workspaceId);
      console.log(`[Native Processor] Assignment ${assignment.id} completed successfully in ${Date.now() - assignmentStartTime}ms (${persistedResults} new results).`);

      return {
        assignmentId: assignment.id!,
        assignmentType: assignment.assignment_type,
        success: true,
        attempts: attempt,
        resultsCount: persistedResults,
        durationMs: Date.now() - assignmentStartTime
      };
    } catch (err: unknown) {
      lastError = err;
      const isTransient = isTransientError(err);
      const sanitized = sanitizeErrorMessage(err);

      console.warn(`[Native Processor] Assignment ${assignment.id} attempt ${attempt} failed: ${sanitized} (isTransient: ${isTransient})`);

      if (isTransient && attempt <= maxRetries) {
        let backoffMs = baseBackoff * Math.pow(2, attempt - 1) + Math.floor(Math.random() * 100);
        if (err instanceof RateLimitError && err.retryAfterMs) {
          backoffMs = err.retryAfterMs;
        }

        console.log(`[Native Processor] Retrying assignment ${assignment.id} in ${backoffMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, backoffMs));
        attempt++;
        continue;
      }

      // Permanent error or max retries exceeded
      break;
    }
  }

  // Mark assignment failed
  const finalErrorMsg = sanitizeErrorMessage(lastError);
  await failResearchAssignment(assignment.id!, workspaceId, finalErrorMsg);

  return {
    assignmentId: assignment.id!,
    assignmentType: assignment.assignment_type,
    success: false,
    attempts: attempt,
    resultsCount: 0,
    error: finalErrorMsg,
    durationMs: Date.now() - assignmentStartTime
  };
}
