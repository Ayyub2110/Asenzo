export type AssignmentExecutionStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
export type JobExecutionStatus = 'queued' | 'planning' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface ResearchProcessorOptions {
  /**
   * Maximum simultaneous assignment executions per job.
   * Conservative default: 2.
   */
  concurrency?: number;

  /**
   * Maximum retry attempts for transient failures.
   * Default: 2 (total 3 attempts).
   */
  maxRetries?: number;

  /**
   * Base exponential backoff delay in milliseconds.
   * Default: 500ms.
   */
  baseBackoffMs?: number;

  /**
   * Request timeout per assignment in milliseconds.
   * Default: 15000ms.
   */
  timeoutMs?: number;

  /**
   * Stale job lease timeout in milliseconds (default 15 minutes = 900000ms).
   * A job still marked 'running' past this threshold is considered abandoned and eligible for recovery.
   */
  staleJobTimeoutMs?: number;

  /**
   * Stale assignment lease timeout in milliseconds (default 5 minutes = 300000ms).
   */
  staleAssignmentTimeoutMs?: number;

  /**
   * Pluggable collector implementation for custom providers or deterministic tests.
   */
  collector?: ResearchCollector;

  /**
   * If true, forces reprocessing even if already marked completed.
   */
  force?: boolean;
}

export interface ResearchCollectionJob {
  assignmentId: string;
  jobId: string;
  workspaceId: string;
  assignmentType: 'creator_research' | 'topic_research';
  platform: string;
  topic: string;
  creator?: string | null;
  sourceTarget?: string | null;
  dateRange?: string;
  funnelStage?: string;
  timeoutMs?: number;
}

export interface CollectedObservation {
  source_url: string;
  source_type: string;
  source_title?: string;
  platform: string;
  creator?: string | null;
  published_at?: string | null;
  topic: string;
  hook?: string | null;
  angle?: string | null;
  claim: string;
  evidence: Record<string, unknown>;
  audience_signals?: Record<string, unknown>;
  market_signals?: Record<string, unknown>;
  content_patterns?: Record<string, unknown>;
  evidence_strength: 'low' | 'medium' | 'high';
  classification: 'observed_fact' | 'inferred_pattern' | 'ai_hypothesis';
  confidence: 'low' | 'medium' | 'high' | number;
  raw_source_reference?: Record<string, unknown>;
  research_agent: string;
}

export interface ResearchCollector {
  collect(job: ResearchCollectionJob): Promise<CollectedObservation[]>;
}

export interface AssignmentExecutionResult {
  assignmentId: string;
  assignmentType: string;
  success: boolean;
  attempts: number;
  resultsCount: number;
  error?: string | null;
  durationMs: number;
}

export interface JobExecutionSummary {
  jobId: string;
  workspaceId: string;
  initialStatus: string;
  finalStatus: JobExecutionStatus;
  assignmentsTotal: number;
  assignmentsCompleted: number;
  assignmentsFailed: number;
  resultsCreated: number;
  durationMs: number;
  errors: Array<{ assignmentId: string; error: string }>;
}
