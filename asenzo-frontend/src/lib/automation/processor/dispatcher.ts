import {
  CanonicalResearchJob,
  CanonicalResearchAssignment,
  findResearchAssignmentsByJob,
  createDefaultAssignmentsForJob
} from '../db';
import { resolveCanonicalWorkspaceId } from '../workspace';
import { dispatchAutomationEvent } from '../events';
import {
  processResearchJob,
  isJobActiveInMemory,
  JobExecutionSummary,
  ResearchProcessorOptions
} from './index';
import { PermanentProcessorError } from './errors';

export type ResearchDispatchEngine = 'native' | 'n8n';

export interface ResearchDispatchOptions {
  mode?: 'sync' | 'async';
  concurrency?: number;
  maxRetries?: number;
  timeoutMs?: number;
  force?: boolean;
  engineOverride?: ResearchDispatchEngine;
}

export interface ResearchDispatchResult {
  engine: ResearchDispatchEngine;
  initiated: boolean;
  status: string;
  mode: 'sync' | 'async' | 'webhook';
  execution_mode: 'in_process_background' | 'synchronous_process' | 'n8n_orchestration' | 'none';
  durability: 'in_process_ephemeral' | 'persisted' | 'external_n8n_queue';
  notice?: string;
  duplicate_trigger?: boolean;
  already_completed?: boolean;
  summary?: JobExecutionSummary;
  error?: string;
}

/**
 * Returns the currently configured research dispatch engine.
 * Defaults to 'native'. Controlled operator fallback can set RESEARCH_DISPATCH_ENGINE=n8n.
 */
export function getResearchDispatchEngine(): ResearchDispatchEngine {
  const env = (process.env.RESEARCH_DISPATCH_ENGINE || process.env.RESEARCH_EXECUTION_ENGINE || '').trim().toLowerCase();
  if (env === 'n8n') {
    return 'n8n';
  }
  return 'native';
}

/**
 * Provisions or derives assignments for a research job using established native processor logic.
 * If assignments already exist in the database, returns them directly.
 * Otherwise creates default assignments matching creator, source, or topic criteria.
 */
export async function provisionJobAssignments(
  job: CanonicalResearchJob
): Promise<CanonicalResearchAssignment[]> {
  if (!job.id || !job.workspace_id) return [];
  const resolvedWorkspaceId = await resolveCanonicalWorkspaceId(job.workspace_id);

  const existingAssignments = await findResearchAssignmentsByJob(job.id, resolvedWorkspaceId);
  if (existingAssignments.length > 0) {
    return existingAssignments;
  }

  return await createDefaultAssignmentsForJob(job);
}

/**
 * Reusable server-side service to initiate research job execution.
 * Respects deployment constraints:
 * - When engine is 'native': executes via the native processor (in-process background or synchronous).
 *   Records audit telemetry in system_events with skipWebhook: true to avoid dual execution.
 * - When engine is 'n8n': dispatches to the n8n webhook and does NOT invoke the native processor.
 * - Enforces mutual exclusivity: only one execution path owns a given job.
 */
export async function dispatchResearchJobExecution(
  job: CanonicalResearchJob,
  options: ResearchDispatchOptions = {}
): Promise<ResearchDispatchResult> {
  if (!job.id || !job.workspace_id) {
    throw new PermanentProcessorError('Valid job ID and workspace ID are required for research dispatch.', 400);
  }

  const resolvedWorkspaceId = await resolveCanonicalWorkspaceId(job.workspace_id);
  const engine = options.engineOverride || getResearchDispatchEngine();

  // Bounded processor options
  const processorOptions: ResearchProcessorOptions = {
    concurrency: Math.max(1, Math.min(options.concurrency || 2, 5)),
    maxRetries: Math.max(0, Math.min(options.maxRetries ?? 2, 5)),
    timeoutMs: Math.max(1000, Math.min(options.timeoutMs || 15000, 60000)),
    force: Boolean(options.force)
  };

  if (engine === 'n8n') {
    // Controlled fallback: dispatch to n8n webhook and do NOT run native processor
    console.log(`[Research Dispatch] Controlled fallback active: Dispatching job ${job.id} to n8n webhook.`);
    const eventResult = await dispatchAutomationEvent(
      {
        event: 'research.requested',
        entity_type: 'research_job',
        entity_id: job.id,
        workspace_id: resolvedWorkspaceId,
        timestamp: new Date().toISOString(),
        requested_action: 'execute_research',
        data: {
          job_id: job.id,
          objective: job.objective,
          topic: job.topic,
          platform: job.platform,
          funnel_stage: job.funnel_stage,
          content_pillar: job.content_pillar,
          creators: job.creators,
          sources: job.sources
        }
      },
      { skipWebhook: false }
    );

    return {
      engine: 'n8n',
      initiated: eventResult.dispatched,
      status: eventResult.dispatched ? 'dispatched_n8n' : 'n8n_dispatch_failed',
      mode: 'webhook',
      execution_mode: 'n8n_orchestration',
      durability: 'external_n8n_queue',
      notice: eventResult.dispatched
        ? 'Dispatched to external n8n workflow orchestrator via webhook.'
        : `n8n webhook dispatch warning: ${eventResult.error || 'Failed to deliver webhook'}`,
      error: eventResult.error
    };
  }

  // Native execution path (DEFAULT)
  // 1. Record system event for telemetry/audit without triggering n8n webhook
  await dispatchAutomationEvent(
    {
      event: 'research.requested',
      entity_type: 'research_job',
      entity_id: job.id,
      workspace_id: resolvedWorkspaceId,
      timestamp: new Date().toISOString(),
      requested_action: 'execute_research',
      data: {
        job_id: job.id,
        objective: job.objective,
        topic: job.topic,
        platform: job.platform,
        funnel_stage: job.funnel_stage,
        content_pillar: job.content_pillar,
        creators: job.creators,
        sources: job.sources,
        engine: 'native'
      }
    },
    { skipWebhook: true }
  );

  // 2. Cancellation check
  if (job.status === 'cancelled') {
    throw new PermanentProcessorError(`Cannot execute cancelled research job ${job.id}.`, 400);
  }

  // 3. Completed check
  if (job.status === 'completed' && !options.force) {
    return {
      engine: 'native',
      initiated: false,
      already_completed: true,
      status: 'completed',
      mode: options.mode || 'async',
      execution_mode: 'none',
      durability: 'persisted',
      notice: 'Job is already completed.'
    };
  }

  // 4. In-process duplicate trigger check
  if (isJobActiveInMemory(job.id) || (job.status === 'running' && !options.force)) {
    return {
      engine: 'native',
      initiated: false,
      duplicate_trigger: true,
      status: 'running',
      mode: options.mode || 'async',
      execution_mode: 'in_process_background',
      durability: 'in_process_ephemeral',
      notice: 'Research job is already executing in background.'
    };
  }

  // 5. Execution mode
  const mode = options.mode === 'sync' ? 'sync' : 'async';

  if (mode === 'async') {
    // In-process background execution (honest ephemeral durability notice)
    processResearchJob(job.id, resolvedWorkspaceId, processorOptions).catch(err => {
      console.error(`[Native Processor Background] Error processing job ${job.id}:`, err);
    });

    return {
      engine: 'native',
      initiated: true,
      status: 'initiated',
      mode: 'async',
      execution_mode: 'in_process_background',
      durability: 'in_process_ephemeral',
      notice: 'Executing in active Node.js server process. Durable background execution across process restarts or serverless environments requires an external worker queue.'
    };
  }

  // Synchronous execution
  const summary = await processResearchJob(job.id, resolvedWorkspaceId, processorOptions);

  return {
    engine: 'native',
    initiated: true,
    status: summary.finalStatus,
    mode: 'sync',
    execution_mode: 'synchronous_process',
    durability: 'persisted',
    summary
  };
}
