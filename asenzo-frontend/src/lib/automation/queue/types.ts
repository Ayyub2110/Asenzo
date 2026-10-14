import { ResearchCollector } from '../processor/types';

export interface WorkerConfig {
  workerId?: string;
  workspaceId?: string;
  pollIntervalMs?: number;
  maxConcurrency?: number;
  staleTimeoutMs?: number;
  heartbeatIntervalMs?: number;
  maxRetries?: number;
  backoffBaseMs?: number;
  maxBackoffMs?: number;
  drainTimeoutMs?: number;
  once?: boolean;
  collector?: ResearchCollector;
  logFormat?: 'json' | 'pretty';
}

export type WorkerExecutionState = 'idle' | 'polling' | 'processing' | 'stopping' | 'stopped';

export interface WorkerHealth {
  status: WorkerExecutionState;
  isHealthy: boolean;
  databaseConnected: boolean;
  workerId: string;
  workspaceId: string | null;
  uptimeSeconds: number;
  activeJobs: number;
  activeJobIds: string[];
  maxConcurrency: number;
  jobsProcessed: number;
  jobsSucceeded: number;
  jobsFailed: number;
  consecutivePollErrors: number;
  lastPollError: string | null;
  lastPollAt: string | null;
  lastHeartbeatAt: string | null;
  lastClaimedJobId: string | null;
}

export interface JobQueueMetadata {
  attempt_count?: number;
  max_retries?: number;
  next_run_at?: string;
  locked_by?: string | null;
  locked_at?: string | null;
  last_heartbeat_at?: string | null;
}

export interface StructuredLogEvent {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  event: string;
  worker_id: string;
  job_id?: string;
  workspace_id?: string;
  attempt?: number;
  duration_ms?: number;
  error?: string;
  details?: Record<string, unknown>;
}
