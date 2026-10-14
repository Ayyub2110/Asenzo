import { getAdminSupabaseClient } from '../supabase/admin';
import { resolveCanonicalWorkspaceId, isValidUuid } from './workspace';
import {
  mockFoundation,
  mockCreators,
  mockCreatorChannels,
  mockContentPatterns,
  mockResearchSignals
} from '../mock/data';

// ==========================================
// CANONICAL DATA TYPES FOR AUTOMATION
// ==========================================

export interface CanonicalIntelligenceCard {
  id?: string;
  workspace_id?: string;
  user_id?: string;
  source_type: string;
  source_id?: string;
  source_url?: string;
  recorded_at?: string;
  category: string;
  stage?: string;
  signal_type: string;
  exact_language: string;
  context?: string;
  emotion?: string;
  desire?: string;
  fear?: string;
  frustration?: string;
  belief?: string;
  motivation?: string;
  objection?: string;
  aspiration?: string;
  decision_trigger?: string;
  awareness_level?: string;
  ai_interpretation?: string;
  observation_type: 'observed_fact' | 'inferred_psychology' | 'ai_hypothesis' | 'human_verified_insight';
  confidence?: number;
  human_verified?: boolean;
  verified_by?: string;
  verified_at?: string;
  relevant_modules?: string[];
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export interface CanonicalResearchJob {
  id?: string;
  workspace_id?: string;
  objective: string;
  topic: string;
  platform?: string;
  funnel_stage?: string;
  content_pillar?: string;
  date_range?: string;
  keyword_topic?: string;
  creators?: Array<{ handle?: string; source_target?: string }>;
  sources?: Array<{ type: string; target: string }>;
  idempotency_key?: string;
  status?: 'queued' | 'planning' | 'running' | 'completed' | 'failed' | 'cancelled';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  assigned_worker?: string | null;
  locked_by?: string | null;
  locked_at?: string | null;
  last_heartbeat_at?: string | null;
  next_run_at?: string | null;
  attempt_count?: number;
  max_retries?: number;
  parameters?: Record<string, unknown>;
  error?: string | null;
  created_at?: string;
  started_at?: string;
  completed_at?: string;
}

export interface CanonicalResearchAssignment {
  id?: string;
  workspace_id?: string;
  research_job_id: string;
  assignment_type: string;
  platform?: string;
  creator?: string | null;
  topic: string;
  source_target?: string | null;
  status?: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  attempt_count?: number;
  locked_by?: string | null;
  locked_at?: string | null;
  max_retries?: number;
  next_run_at?: string | null;
  started_at?: string;
  completed_at?: string;
  error?: string | null;
  created_at?: string;
}

export interface CanonicalResearchResult {
  id?: string;
  workspace_id?: string;
  research_job_id: string;
  research_assignment_id: string;
  source_url: string;
  source_type: string;
  source_title?: string;
  platform?: string;
  creator?: string | null;
  published_at?: string | null;
  topic: string;
  hook?: string | null;
  angle?: string | null;
  claim: string;
  evidence?: Record<string, unknown>;
  audience_signals?: Record<string, unknown>;
  market_signals?: Record<string, unknown>;
  content_patterns?: Record<string, unknown>;
  evidence_strength?: string;
  classification?: 'observed_fact' | 'inferred_pattern' | 'ai_hypothesis';
  confidence?: string | number;
  raw_source_reference?: Record<string, unknown>;
  research_agent?: string;
  idempotency_key?: string;
  created_at?: string;
}

export interface CanonicalContentIdea {
  id?: string;
  workspace_id?: string;
  topic: string;
  angle?: string;
  audience?: string;
  platform?: string;
  awareness?: string;
  psychological_trigger?: string;
  score?: number;
  scoring_dimensions?: Record<string, unknown>;
  evidence?: unknown[];
  reasoning?: string;
  status?: 'draft' | 'scored' | 'selected' | 'in_production' | 'archived';
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export interface CanonicalContentAsset {
  id?: string;
  idea_id?: string;
  workspace_id?: string;
  topic: string;
  angle?: string;
  format?: string;
  platform?: string;
  hook?: string;
  script_body: string;
  cta?: string;
  status?: 'draft' | 'review_required' | 'approved' | 'scheduled' | 'published' | 'rejected';
  version?: number;
  evaluation?: Record<string, unknown>;
  approval_status?: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approved_at?: string;
  published_url?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export interface CanonicalAgentRun {
  id?: string;
  workspace_id?: string;
  agent_id: string;
  workflow_id?: string;
  task: string;
  input_reference?: string;
  context_version?: string;
  model?: string;
  prompt_version?: string;
  skill_version?: string;
  input_payload?: Record<string, unknown>;
  output_payload?: Record<string, unknown>;
  score?: number;
  evidence?: unknown[];
  status?: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  error?: string;
  duration_ms?: number;
  human_decision?: string;
  final_result?: Record<string, unknown>;
  created_at?: string;
}

export interface CanonicalApproval {
  id?: string;
  workspace_id?: string;
  entity_type: string;
  entity_id: string;
  action: string;
  status?: 'pending' | 'approved' | 'rejected' | 'edited' | 'cancelled';
  requested_by: string;
  reviewer_id?: string;
  feedback?: string;
  proposed_changes?: Record<string, unknown>;
  resolution_details?: Record<string, unknown>;
  created_at?: string;
  resolved_at?: string;
}

export interface CanonicalContentPerformance {
  id?: string;
  content_id: string;
  workspace_id?: string;
  platform: string;
  published_at?: string;
  views?: number;
  reach?: number;
  engagements?: number;
  comments?: number;
  shares?: number;
  saves?: number;
  clicks?: number;
  ctr?: number;
  leads?: number;
  conversions?: number;
  revenue_influenced?: number;
  source_provenance?: string;
  collected_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CanonicalAudienceDna {
  id?: string;
  workspace_id: string;
  situation?: Record<string, unknown> | unknown[];
  pain?: string[];
  triggers?: string[];
  objections?: string[];
  fears?: string[];
  natural_language?: string[];
  journey?: Record<string, unknown>;
  desired_future?: Record<string, unknown> | string[];
  emotions?: string[];
  beliefs?: string[];
  awareness?: Record<string, unknown> | string[];
  decision_criteria?: string[];
  buying_triggers?: string[];
  evidence?: unknown[];
  version?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AudienceDnaPayload {
  workspace_id: string;
  source_type?: string;
  category?: string;
  dna_type?: string;
  audience_dna: {
    core_pains?: string[];
    core_desires?: string[];
    fears?: string[];
    frustrations?: string[];
    beliefs?: string[];
    motivations?: string[];
    aspirations?: string[];
    objections?: string[];
    decision_triggers?: string[];
    awareness_patterns?: string[];
    natural_language?: string[];
    behaviors?: string[];
    relevant_audience_behaviors?: string[];
    decision_criteria?: string[];
    emotions?: string[];
    journey?: Record<string, unknown>;
    pain?: string[];
    triggers?: string[];
    buying_triggers?: string[];
    [key: string]: unknown;
  };
  evidence?: unknown[];
  generated_at?: string;
  metadata?: Record<string, unknown>;
  version?: number;
  status?: string;
}

// In-memory stores remain only for non-canonical mock-backed workflows.
const fallbackStore = {
  researchJobs: [] as CanonicalResearchJob[],
  researchResults: [] as CanonicalResearchResult[],
  contentIdeas: [] as CanonicalContentIdea[],
  contentAssets: [] as CanonicalContentAsset[],
  agentRuns: [] as CanonicalAgentRun[],
  approvals: [] as CanonicalApproval[],
  performanceRecords: [] as CanonicalContentPerformance[]
};

// ==========================================
// CONTEXT RESOLVERS
// ==========================================

export async function fetchFounderContext(workspaceId: string) {
  const supabase = getAdminSupabaseClient();
  if (supabase) {
    try {
      const { data } = await supabase
        .from('founder_dna')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('version', { ascending: false })
        .limit(1)
        .single();

      if (data) return data;
    } catch {
      // Fallback
    }
  }

  // Return formatted founder context from foundation mock
  return {
    workspace_id: workspaceId,
    core_dna: mockFoundation.coreDna,
    founder_voice: mockFoundation.founderVoice,
    brand_voice: mockFoundation.brandVoice,
    positioning: mockFoundation.coreDna.positioning,
    differentiation: mockFoundation.coreDna.differentiation,
    strategic_preferences: {
      preferred_formats: ['LinkedIn Post', 'Short Video Script', 'Deep Dive Breakdown'],
      avoid_words: mockFoundation.brandVoice.avoidWords,
      key_phrases: mockFoundation.founderVoice.phrases
    },
    version: 1,
    status: 'active'
  };
}

export async function fetchAudienceContext(workspaceId: string) {
  const resolvedWorkspaceId = await resolveCanonicalWorkspaceId(workspaceId);
  const supabase = getAdminSupabaseClient();
  if (supabase) {
    try {
      const { data } = await supabase
        .from('audience_dna')
        .select('*')
        .eq('workspace_id', resolvedWorkspaceId)
        .order('version', { ascending: false })
        .limit(1)
        .single();

      if (data) return data;
    } catch {
      // Fallback
    }
  }

  return {
    workspace_id: workspaceId,
    icp: mockFoundation.icp,
    pains: mockFoundation.icp.painPoints,
    desired_outcomes: mockFoundation.icp.desiredOutcomes,
    disqualifiers: mockFoundation.icp.disqualifiers,
    awareness_stages: ['Unaware', 'Problem-aware', 'Solution-aware', 'Product-aware', 'Most-aware'],
    buying_triggers: [
      'Stagnant growth despite high effort',
      'Over-reliance on founder time for delivery and acquisition',
      'Need for systematized pipeline automation'
    ],
    natural_language_snippets: [
      "I'm spending 20 hours a week writing posts that get zero qualified leads.",
      "Our sales calls feel like starting from scratch every time.",
      "I need a growth operating system, not another 20-tab spreadsheet."
    ],
    version: 1,
    status: 'active'
  };
}

export async function fetchContentContext(workspaceId: string) {
  const supabase = getAdminSupabaseClient();
  if (supabase) {
    try {
      const { data } = await supabase
        .from('content_dna')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('version', { ascending: false })
        .limit(1)
        .single();

      if (data) return data;
    } catch {
      // Fallback
    }
  }

  return {
    workspace_id: workspaceId,
    winning_patterns: mockContentPatterns,
    creators_benchmarked: mockCreators,
    channels: mockCreatorChannels,
    research_signals: mockResearchSignals,
    frameworks: [
      { name: 'Contrarian Breakdown', structure: 'Hook -> Enemy -> Counter-Intuitive Truth -> Proof -> Action' },
      { name: 'Founder Operating Model', structure: 'Bottleneck -> System Architecture -> Execution Metrics' },
      { name: 'Transformation Case Study', structure: 'Before State -> The Breaking Point -> The Method -> The After' }
    ],
    version: 1,
    status: 'active'
  };
}

// ==========================================
// INTELLIGENCE CARDS
// ==========================================

export async function queryIntelligenceCards(workspaceId: string, limit = 50) {
  const resolvedWorkspaceId = await resolveCanonicalWorkspaceId(workspaceId);
  const supabase = getAdminSupabaseClient();

  if (supabase) {
    const { data, error } = await supabase
      .from('intelligence_cards')
      .select('*')
      .eq('workspace_id', resolvedWorkspaceId)
      .order('recorded_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[queryIntelligenceCards] Supabase query failed:', error);
      throw new Error(`Database error querying intelligence cards: ${error.message}`);
    }

    return (data || []) as CanonicalIntelligenceCard[];
  }

  throw new Error('Database client unavailable: Supabase credentials are not configured or client failed to initialize.');
}

export async function insertIntelligenceCard(card: CanonicalIntelligenceCard): Promise<CanonicalIntelligenceCard> {
  const resolvedWorkspaceId = await resolveCanonicalWorkspaceId(card.workspace_id);
  const now = new Date().toISOString();
  const supabase = getAdminSupabaseClient();

  if (!supabase) {
    const errorMsg = 'Database client unavailable: Supabase credentials are not configured or client failed to initialize.';
    console.error('[insertIntelligenceCard]', errorMsg);
    throw new Error(errorMsg);
  }

  const dbRecord: Record<string, unknown> = {
    workspace_id: resolvedWorkspaceId,
    source_type: card.source_type,
    source_id: card.source_id,
    source_url: card.source_url,
    recorded_at: card.recorded_at || now,
    category: card.category,
    stage: card.stage,
    signal_type: card.signal_type,
    exact_language: card.exact_language,
    context: card.context,
    emotion: card.emotion,
    desire: card.desire,
    fear: card.fear,
    frustration: card.frustration,
    belief: card.belief,
    motivation: card.motivation,
    objection: card.objection,
    aspiration: card.aspiration,
    decision_trigger: card.decision_trigger,
    awareness_level: card.awareness_level,
    ai_interpretation: card.ai_interpretation,
    observation_type: card.observation_type || 'observed_fact',
    confidence: typeof card.confidence === 'number' ? card.confidence : 0.8,
    human_verified: Boolean(card.human_verified),
    verified_by: card.verified_by,
    verified_at: card.verified_at,
    relevant_modules: card.relevant_modules || ['Acquisition'],
    metadata: card.metadata || {},
    created_at: now,
    updated_at: now
  };

  // If caller provided a valid UUID, use it; otherwise omit id to let PostgreSQL uuid_generate_v4() generate it
  if (card.id && isValidUuid(card.id)) {
    dbRecord.id = card.id;
  }

  const { data, error } = await supabase
    .from('intelligence_cards')
    .insert(dbRecord)
    .select()
    .single();

  // Print safe diagnostics (no secrets printed)
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  let resolvedHostname = 'unknown';
  try {
    if (supabaseUrl) resolvedHostname = new URL(supabaseUrl).hostname;
  } catch {}

  console.log('[Automation Diagnostics] Intelligence Card Persistence Execution:', {
    NODE_ENV: process.env.NODE_ENV,
    hasSupabaseUrl: Boolean(supabaseUrl),
    hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    resolvedHostname,
    hasRealAdminClient: Boolean(supabase),
    resolvedWorkspaceId,
    isExecutingInsert: true,
    supabaseInsertSuccess: !error && Boolean(data?.id),
    supabaseInsertError: error ? (error.message || JSON.stringify(error)) : null,
    persistedId: data?.id || null
  });

  if (error) {
    console.error('[insertIntelligenceCard] Supabase insert failed:', error);
    throw new Error(`Database error inserting intelligence card: ${error.message || JSON.stringify(error)}`);
  }

  if (!data || !data.id) {
    throw new Error('Database insert confirmation failed: Supabase did not return persisted row.');
  }

  return data as CanonicalIntelligenceCard;
}

// ==========================================
// AUDIENCE DNA PERSISTENCE & RESOLUTION
// ==========================================

export async function fetchLatestAudienceDna(workspaceId: string): Promise<CanonicalAudienceDna | null> {
  const resolvedWorkspaceId = await resolveCanonicalWorkspaceId(workspaceId);
  const supabase = getAdminSupabaseClient();

  if (!supabase) {
    throw new Error('Database client unavailable: Supabase credentials are not configured or client failed to initialize.');
  }

  const { data, error } = await supabase
    .from('audience_dna')
    .select('*')
    .eq('workspace_id', resolvedWorkspaceId)
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('[fetchLatestAudienceDna] Supabase error:', error);
    throw new Error(`Database error fetching latest Audience DNA: ${error.message || JSON.stringify(error)}`);
  }

  return data as CanonicalAudienceDna | null;
}

export async function queryAudienceDna(workspaceId: string, limit = 10): Promise<CanonicalAudienceDna[]> {
  const resolvedWorkspaceId = await resolveCanonicalWorkspaceId(workspaceId);
  const supabase = getAdminSupabaseClient();

  if (!supabase) {
    throw new Error('Database client unavailable: Supabase credentials are not configured or client failed to initialize.');
  }

  const { data, error } = await supabase
    .from('audience_dna')
    .select('*')
    .eq('workspace_id', resolvedWorkspaceId)
    .order('version', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[queryAudienceDna] Supabase error:', error);
    throw new Error(`Database error querying Audience DNA: ${error.message || JSON.stringify(error)}`);
  }

  return (data || []) as CanonicalAudienceDna[];
}

export async function insertAudienceDna(payload: AudienceDnaPayload): Promise<CanonicalAudienceDna> {
  if (!payload.workspace_id) {
    throw new Error('workspace_id is required');
  }
  if (!payload.audience_dna || typeof payload.audience_dna !== 'object') {
    throw new Error('audience_dna must be an object');
  }

  const dna = payload.audience_dna;
  const now = new Date().toISOString();
  const resolvedWorkspaceId = await resolveCanonicalWorkspaceId(payload.workspace_id);
  const supabase = getAdminSupabaseClient();

  if (!supabase) {
    const errorMsg = 'Database client unavailable: Supabase credentials are not configured or client failed to initialize.';
    console.error('[insertAudienceDna]', errorMsg);
    throw new Error(errorMsg);
  }

  // 1. Determine next version from existing records
  let nextVersion = 1;
  const { data: latestRecord, error: versionErr } = await supabase
    .from('audience_dna')
    .select('version')
    .eq('workspace_id', resolvedWorkspaceId)
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (versionErr) {
    console.error('[insertAudienceDna] Error resolving version:', versionErr);
    throw new Error(`Database error resolving Audience DNA version: ${versionErr.message || JSON.stringify(versionErr)}`);
  }

  if (latestRecord && typeof latestRecord.version === 'number') {
    nextVersion = latestRecord.version + 1;
  }

  // 2. Strict mapping to public.audience_dna schema columns
  const dbRecord: Record<string, unknown> = {
    workspace_id: resolvedWorkspaceId,
    situation: {
      behaviors: dna.behaviors || [],
      relevant_audience_behaviors: dna.relevant_audience_behaviors || [],
      frustrations: dna.frustrations || []
    },
    pain: dna.core_pains || dna.pain || [],
    triggers: dna.decision_triggers || dna.triggers || [],
    objections: dna.objections || [],
    fears: dna.fears || [],
    natural_language: dna.natural_language || [],
    journey: (dna.journey as Record<string, unknown>) || {},
    desired_future: {
      core_desires: dna.core_desires || [],
      aspirations: dna.aspirations || [],
      motivations: dna.motivations || []
    },
    emotions: dna.emotions || dna.motivations || [],
    beliefs: dna.beliefs || [],
    awareness: {
      patterns: dna.awareness_patterns || []
    },
    decision_criteria: dna.decision_criteria || [],
    buying_triggers: dna.decision_triggers || dna.buying_triggers || [],
    evidence: payload.evidence || [],
    version: typeof payload.version === 'number' ? payload.version : nextVersion,
    status: payload.status || 'active',
    created_at: now,
    updated_at: now
  };

  // 3. Write to public.audience_dna and surface any database errors
  const { data, error: insertErr } = await supabase
    .from('audience_dna')
    .insert(dbRecord)
    .select()
    .single();

  // Print safe diagnostics (no secrets printed)
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  let resolvedHostname = 'unknown';
  try {
    if (supabaseUrl) resolvedHostname = new URL(supabaseUrl).hostname;
  } catch {}

  console.log('[Automation Diagnostics] Audience DNA Persistence Execution:', {
    NODE_ENV: process.env.NODE_ENV,
    hasSupabaseUrl: Boolean(supabaseUrl),
    hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    resolvedHostname,
    hasRealAdminClient: Boolean(supabase),
    resolvedWorkspaceId,
    isExecutingInsert: true,
    supabaseInsertSuccess: !insertErr && Boolean(data?.id),
    supabaseInsertError: insertErr ? (insertErr.message || JSON.stringify(insertErr)) : null,
    persistedId: data?.id || null
  });

  if (insertErr) {
    console.error('[insertAudienceDna] Supabase insert failed:', insertErr);
    throw new Error(`Database error persisting Audience DNA: ${insertErr.message || JSON.stringify(insertErr)}`);
  }

  if (!data || !data.id) {
    throw new Error('Database insert confirmation failed: Supabase did not return persisted row.');
  }

  return data as CanonicalAudienceDna;
}

// ==========================================
// RESEARCH JOBS & RESULTS
// ==========================================

export async function findResearchJob(id: string): Promise<CanonicalResearchJob | null> {
  const supabase = getAdminSupabaseClient();
  const { data, error } = await supabase.from('research_jobs').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(`Database error reading research job: ${error.message}`);
  return data as CanonicalResearchJob | null;
}

export async function insertResearchJob(job: CanonicalResearchJob): Promise<CanonicalResearchJob> {
  const jobParams = (job.parameters && typeof job.parameters === 'object') ? job.parameters : {};
  const queueParams: Record<string, unknown> = {
    ...((jobParams as { queue?: Record<string, unknown> }).queue || {})
  };
  if (job.attempt_count !== undefined) queueParams.attempt_count = job.attempt_count;
  if (job.max_retries !== undefined) queueParams.max_retries = job.max_retries;
  if (job.next_run_at !== undefined) queueParams.next_run_at = job.next_run_at;
  if (job.locked_by !== undefined) queueParams.locked_by = job.locked_by;
  if (job.locked_at !== undefined) queueParams.locked_at = job.locked_at;

  const newJob: Record<string, unknown> = {
    ...job,
    status: job.status || 'queued',
    priority: job.priority || 'normal',
    creators: job.creators || [],
    sources: job.sources || [],
    parameters: {
      ...jobParams,
      ...(Object.keys(queueParams).length > 0 ? { queue: queueParams } : {})
    }
  };

  const supabase = getAdminSupabaseClient();
  if (!supabase) throw new Error('Database client unavailable');

  let { data, error } = await supabase.from('research_jobs').insert(newJob).select().single();

  if (error && (error.code === '42703' || error.message?.includes('schema cache') || error.message?.includes('column'))) {
    // Strip non-core columns and retry
    delete newJob.attempt_count;
    delete newJob.max_retries;
    delete newJob.next_run_at;
    delete newJob.locked_by;
    delete newJob.locked_at;
    delete newJob.last_heartbeat_at;

    const retryRes = await supabase.from('research_jobs').insert(newJob).select().single();
    data = retryRes.data;
    error = retryRes.error;
  }

  if (error || !data) {
    if (error?.code === '23505' && job.idempotency_key) {
      const existing = await supabase.from('research_jobs').select('*').eq('workspace_id', job.workspace_id!).eq('idempotency_key', job.idempotency_key).single();
      if (!existing.error && existing.data) return existing.data as CanonicalResearchJob;
    }
    throw new Error(`Database error creating research job: ${error?.message || 'no row returned'}`);
  }
  return data as CanonicalResearchJob;
}

export async function findResearchAssignment(id: string): Promise<CanonicalResearchAssignment | null> {
  const supabase = getAdminSupabaseClient();
  const { data, error } = await supabase.from('research_assignments').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(`Database error reading research assignment: ${error.message}`);
  return data as CanonicalResearchAssignment | null;
}

export async function insertResearchAssignment(assignment: CanonicalResearchAssignment): Promise<CanonicalResearchAssignment> {
  const supabase = getAdminSupabaseClient();
  const { data, error } = await supabase.from('research_assignments').insert(assignment).select().single();
  if (error || !data) throw new Error(`Database error creating research assignment: ${error?.message || 'no row returned'}`);
  return data as CanonicalResearchAssignment;
}

export async function findResearchAssignmentsByJob(jobId: string, workspaceId: string): Promise<CanonicalResearchAssignment[]> {
  const resolvedWorkspaceId = await resolveCanonicalWorkspaceId(workspaceId);
  const supabase = getAdminSupabaseClient();
  if (!supabase) throw new Error('Database client unavailable');
  const { data, error } = await supabase
    .from('research_assignments')
    .select('*')
    .eq('research_job_id', jobId)
    .eq('workspace_id', resolvedWorkspaceId)
    .order('created_at', { ascending: true });
  if (error) throw new Error(`Database error reading research assignments: ${error.message}`);
  return (data || []) as CanonicalResearchAssignment[];
}

export async function claimResearchAssignment(
  assignmentId: string,
  workspaceId: string,
  staleTimeoutMs = 5 * 60 * 1000
): Promise<CanonicalResearchAssignment | null> {
  const resolvedWorkspaceId = await resolveCanonicalWorkspaceId(workspaceId);
  const supabase = getAdminSupabaseClient();
  if (!supabase) throw new Error('Database client unavailable');

  const { data: current, error: getErr } = await supabase
    .from('research_assignments')
    .select('*')
    .eq('id', assignmentId)
    .eq('workspace_id', resolvedWorkspaceId)
    .maybeSingle();

  if (getErr || !current) return null;

  const now = new Date();
  const nowIso = now.toISOString();
  const staleThresholdIso = new Date(now.getTime() - staleTimeoutMs).toISOString();

  const isEligible =
    ['queued', 'failed'].includes(current.status) ||
    (current.status === 'running' && current.started_at && current.started_at < staleThresholdIso);

  if (!isEligible) return null;

  const nextAttempt = (current.attempt_count || 0) + 1;

  let query = supabase
    .from('research_assignments')
    .update({
      status: 'running',
      attempt_count: nextAttempt,
      started_at: nowIso,
      error: null
    })
    .eq('id', assignmentId)
    .eq('workspace_id', resolvedWorkspaceId);

  if (['queued', 'failed'].includes(current.status)) {
    query = query.in('status', ['queued', 'failed']);
  } else {
    query = query.eq('status', 'running').lt('started_at', staleThresholdIso);
  }

  const { data, error } = await query.select().maybeSingle();

  if (error) throw new Error(`Database error claiming research assignment: ${error.message}`);
  return data as CanonicalResearchAssignment | null;
}

export async function completeResearchAssignment(assignmentId: string, workspaceId: string): Promise<CanonicalResearchAssignment | null> {
  const resolvedWorkspaceId = await resolveCanonicalWorkspaceId(workspaceId);
  const supabase = getAdminSupabaseClient();
  if (!supabase) throw new Error('Database client unavailable');

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('research_assignments')
    .update({
      status: 'completed',
      completed_at: now,
      error: null
    })
    .eq('id', assignmentId)
    .eq('workspace_id', resolvedWorkspaceId)
    .select()
    .maybeSingle();

  if (error) throw new Error(`Database error completing research assignment: ${error.message}`);
  return data as CanonicalResearchAssignment | null;
}

export async function failResearchAssignment(assignmentId: string, workspaceId: string, errorMessage: string): Promise<CanonicalResearchAssignment | null> {
  const resolvedWorkspaceId = await resolveCanonicalWorkspaceId(workspaceId);
  const supabase = getAdminSupabaseClient();
  if (!supabase) throw new Error('Database client unavailable');

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('research_assignments')
    .update({
      status: 'failed',
      completed_at: now,
      error: errorMessage
    })
    .eq('id', assignmentId)
    .eq('workspace_id', resolvedWorkspaceId)
    .select()
    .maybeSingle();

  if (error) throw new Error(`Database error failing research assignment: ${error.message}`);
  return data as CanonicalResearchAssignment | null;
}

export async function claimResearchJob(
  jobId: string,
  workspaceId: string,
  staleTimeoutMs = 15 * 60 * 1000
): Promise<CanonicalResearchJob | null> {
  const resolvedWorkspaceId = await resolveCanonicalWorkspaceId(workspaceId);
  const supabase = getAdminSupabaseClient();
  if (!supabase) throw new Error('Database client unavailable');

  const now = new Date();
  const nowIso = now.toISOString();
  const staleThresholdIso = new Date(now.getTime() - staleTimeoutMs).toISOString();

  // Primary attempt: atomic claim on queued or failed jobs
  const { data: primaryClaim, error: primaryErr } = await supabase
    .from('research_jobs')
    .update({
      status: 'running',
      started_at: nowIso,
      error: null
    })
    .eq('id', jobId)
    .eq('workspace_id', resolvedWorkspaceId)
    .in('status', ['queued', 'failed'])
    .select()
    .maybeSingle();

  if (primaryErr) throw new Error(`Database error claiming research job: ${primaryErr.message}`);
  if (primaryClaim) return primaryClaim as CanonicalResearchJob;

  // Stale recovery attempt: atomic recovery of abandoned running job
  const { data: staleClaim, error: staleErr } = await supabase
    .from('research_jobs')
    .update({
      status: 'running',
      started_at: nowIso,
      error: null
    })
    .eq('id', jobId)
    .eq('workspace_id', resolvedWorkspaceId)
    .eq('status', 'running')
    .lt('started_at', staleThresholdIso)
    .select()
    .maybeSingle();

  if (staleErr) throw new Error(`Database error claiming stale research job: ${staleErr.message}`);
  return (staleClaim || null) as CanonicalResearchJob | null;
}

export interface ClaimNextJobOptions {
  workspaceId?: string;
  staleTimeoutMs?: number;
}

/**
 * Atomically claims the next eligible queued or stale research job.
 * Prioritizes urgent/high priority jobs first, followed by creation order.
 * Safe against concurrent workers: exactly one worker receives each claimed row.
 */
export async function claimNextQueuedResearchJob(
  workerId: string,
  options: ClaimNextJobOptions = {}
): Promise<CanonicalResearchJob | null> {
  const staleTimeoutMs = options.staleTimeoutMs ?? 5 * 60 * 1000;
  const resolvedWorkspaceId = options.workspaceId
    ? await resolveCanonicalWorkspaceId(options.workspaceId)
    : undefined;
  const supabase = getAdminSupabaseClient();
  if (!supabase) throw new Error('Database client unavailable');

  // Attempt 1: Call RPC function if available in database
  try {
    const { data: rpcData, error: rpcErr } = await supabase.rpc('claim_next_research_job', {
      p_worker_id: workerId,
      p_workspace_id: resolvedWorkspaceId || null,
      p_stale_timeout_seconds: Math.floor(staleTimeoutMs / 1000)
    });

    if (!rpcErr && rpcData) {
      if (Array.isArray(rpcData) && rpcData.length > 0) {
        return rpcData[0] as CanonicalResearchJob;
      }
      if (!Array.isArray(rpcData) && typeof rpcData === 'object' && (rpcData as { id?: string }).id) {
        return rpcData as CanonicalResearchJob;
      }
      return null;
    }
  } catch {
    // Graceful fallback to resilient conditional UPDATE
  }

  // Attempt 2: Resilient atomic claim via conditional UPDATE
  const now = new Date();
  const nowIso = now.toISOString();
  const staleThresholdIso = new Date(now.getTime() - staleTimeoutMs).toISOString();

  let query = supabase
    .from('research_jobs')
    .select('*')
    .in('status', ['queued', 'running']);

  if (resolvedWorkspaceId) {
    query = query.eq('workspace_id', resolvedWorkspaceId);
  }

  const { data: candidates, error: selectErr } = await query;
  if (selectErr || !candidates || candidates.length === 0) return null;

  // Filter candidates eligible for claiming
  const eligible = (candidates as CanonicalResearchJob[]).filter(job => {
    if (job.status === 'queued') {
      const jobParams = (job.parameters && typeof job.parameters === 'object') ? job.parameters : {};
      const nextRunAt = job.next_run_at || (jobParams as { queue?: { next_run_at?: string } }).queue?.next_run_at;
      if (nextRunAt && nextRunAt > nowIso) return false;
      return true;
    }
    if (job.status === 'running') {
      const jobParams = (job.parameters && typeof job.parameters === 'object') ? job.parameters : {};
      const leaseTime = job.locked_at || (jobParams as { queue?: { locked_at?: string } }).queue?.locked_at || job.started_at;
      return Boolean(leaseTime && leaseTime < staleThresholdIso);
    }
    return false;
  });

  if (eligible.length === 0) return null;

  // Sort by priority (urgent > high > normal/medium > low) then created_at ASC
  const priorityWeight: Record<string, number> = {
    urgent: 1,
    high: 2,
    normal: 3,
    medium: 3,
    low: 4
  };

  eligible.sort((a, b) => {
    const wA = priorityWeight[a.priority || 'normal'] || 3;
    const wB = priorityWeight[b.priority || 'normal'] || 3;
    if (wA !== wB) return wA - wB;
    const tA = new Date(a.created_at || 0).getTime();
    const tB = new Date(b.created_at || 0).getTime();
    return tA - tB;
  });

  // Atomically claim the first eligible candidate
  for (const candidate of eligible) {
    if (!candidate.id || !candidate.workspace_id) continue;
    const currentParams = (candidate.parameters && typeof candidate.parameters === 'object')
      ? candidate.parameters
      : {};
    const nextAttempt = (candidate.attempt_count || (currentParams as { queue?: { attempt_count?: number } }).queue?.attempt_count || 0) + 1;

    const updatedParams = {
      ...currentParams,
      queue: {
        ...((currentParams as { queue?: Record<string, unknown> }).queue || {}),
        locked_by: workerId,
        locked_at: nowIso,
        last_heartbeat_at: nowIso,
        attempt_count: nextAttempt
      }
    };

    // Try including dedicated columns first
    const fullPayload: Record<string, unknown> = {
      status: 'running',
      assigned_worker: workerId,
      locked_by: workerId,
      locked_at: nowIso,
      last_heartbeat_at: nowIso,
      started_at: nowIso,
      attempt_count: nextAttempt,
      parameters: updatedParams,
      error: null
    };

    let updateQuery = supabase
      .from('research_jobs')
      .update(fullPayload)
      .eq('id', candidate.id)
      .eq('workspace_id', candidate.workspace_id);

    if (candidate.status === 'queued') {
      updateQuery = updateQuery.eq('status', 'queued');
    } else {
      updateQuery = updateQuery.eq('status', 'running').lt('started_at', staleThresholdIso);
    }

    let { data: claimed, error: updateErr } = await updateQuery.select().maybeSingle();

    // If column missing error (e.g. 42703), fallback with core columns only
    if (updateErr && (updateErr.code === '42703' || updateErr.message?.includes('column'))) {
      const fallbackPayload: Record<string, unknown> = {
        status: 'running',
        assigned_worker: workerId,
        started_at: nowIso,
        parameters: updatedParams,
        error: null
      };

      let fallbackQuery = supabase
        .from('research_jobs')
        .update(fallbackPayload)
        .eq('id', candidate.id)
        .eq('workspace_id', candidate.workspace_id);

      if (candidate.status === 'queued') {
        fallbackQuery = fallbackQuery.eq('status', 'queued');
      } else {
        fallbackQuery = fallbackQuery.eq('status', 'running').lt('started_at', staleThresholdIso);
      }

      const fallbackRes = await fallbackQuery.select().maybeSingle();
      claimed = fallbackRes.data;
      updateErr = fallbackRes.error;
    }

    if (updateErr) {
      console.warn(`[claimNextQueuedResearchJob] Claim conflict or warning on ${candidate.id}:`, updateErr.message);
      continue;
    }

    if (claimed) {
      return claimed as CanonicalResearchJob;
    }
  }

  return null;
}

/**
 * Renews the active worker lease heartbeat timestamp.
 */
export async function heartbeatResearchJob(
  jobId: string,
  workerId: string,
  workspaceId?: string
): Promise<boolean> {
  const supabase = getAdminSupabaseClient();
  if (!supabase) throw new Error('Database client unavailable');

  // Try RPC
  try {
    const { data: rpcRes, error: rpcErr } = await supabase.rpc('heartbeat_research_job', {
      p_job_id: jobId,
      p_worker_id: workerId
    });
    if (!rpcErr && typeof rpcRes === 'boolean') {
      return rpcRes;
    }
  } catch {}

  const nowIso = new Date().toISOString();
  let query = supabase
    .from('research_jobs')
    .update({
      started_at: nowIso,
      locked_at: nowIso,
      last_heartbeat_at: nowIso
    })
    .eq('id', jobId)
    .eq('status', 'running');

  if (workspaceId) {
    const resolvedWorkspaceId = await resolveCanonicalWorkspaceId(workspaceId);
    query = query.eq('workspace_id', resolvedWorkspaceId);
  }

  const { data, error } = await query.select('id').maybeSingle();
  if (error && (error.code === '42703' || error.message?.includes('column'))) {
    const { data: retryData } = await supabase
      .from('research_jobs')
      .update({ started_at: nowIso })
      .eq('id', jobId)
      .eq('status', 'running')
      .select('id')
      .maybeSingle();
    return Boolean(retryData);
  }

  return Boolean(data);
}

export interface RescheduleOptions {
  error?: string;
  backoffMs?: number;
  maxRetries?: number;
}

/**
 * Reschedules a job for retry with exponential backoff, or transitions to terminal failure
 * if maxRetries has been exhausted.
 */
export async function rescheduleResearchJob(
  jobId: string,
  workerId: string,
  workspaceId: string,
  options: RescheduleOptions = {}
): Promise<{ status: 'queued' | 'failed'; deadLettered: boolean; nextRunAt?: string }> {
  const resolvedWorkspaceId = await resolveCanonicalWorkspaceId(workspaceId);
  const supabase = getAdminSupabaseClient();
  if (!supabase) throw new Error('Database client unavailable');

  const maxRetries = options.maxRetries ?? 3;
  const backoffMs = options.backoffMs ?? 5000;
  const now = new Date();
  const nowIso = now.toISOString();

  // Try RPC if available
  try {
    const { data: rpcRes, error: rpcErr } = await supabase.rpc('reschedule_research_job', {
      p_job_id: jobId,
      p_worker_id: workerId,
      p_error: options.error || 'Execution failure',
      p_backoff_seconds: Math.floor(backoffMs / 1000),
      p_max_retries: maxRetries
    });
    if (!rpcErr && rpcRes && Array.isArray(rpcRes) && rpcRes.length > 0) {
      const rRow = rpcRes[0] as CanonicalResearchJob;
      return {
        status: rRow.status === 'failed' ? 'failed' : 'queued',
        deadLettered: rRow.status === 'failed',
        nextRunAt: rRow.next_run_at || undefined
      };
    }
  } catch {}

  const current = await findResearchJob(jobId);
  const currentParams = (current?.parameters && typeof current.parameters === 'object') ? current.parameters : {};
  const currentAttempts = (current?.attempt_count || (currentParams as { queue?: { attempt_count?: number } }).queue?.attempt_count || 1);

  if (currentAttempts >= maxRetries) {
    // Dead-letter: terminal failure
    await updateResearchJobStatus(jobId, resolvedWorkspaceId, {
      status: 'failed',
      completed_at: nowIso,
      error: options.error || 'Max retries exhausted'
    });
    return { status: 'failed', deadLettered: true };
  }

  // Reschedule with backoff
  const nextRunAt = new Date(now.getTime() + backoffMs).toISOString();
  const updatedParams = {
    ...currentParams,
    queue: {
      ...((currentParams as { queue?: Record<string, unknown> }).queue || {}),
      locked_by: null,
      next_run_at: nextRunAt,
      last_error: options.error || null
    }
  };

  const updatePayload: Record<string, unknown> = {
    status: 'queued',
    parameters: updatedParams,
    error: options.error || null,
    locked_by: null,
    next_run_at: nextRunAt
  };

  const { error: updateErr } = await supabase
    .from('research_jobs')
    .update(updatePayload)
    .eq('id', jobId)
    .eq('workspace_id', resolvedWorkspaceId);

  if (updateErr && (updateErr.code === '42703' || updateErr.message?.includes('column'))) {
    delete updatePayload.locked_by;
    delete updatePayload.next_run_at;
    await supabase
      .from('research_jobs')
      .update(updatePayload)
      .eq('id', jobId)
      .eq('workspace_id', resolvedWorkspaceId);
  }

  return { status: 'queued', deadLettered: false, nextRunAt };
}

/**
 * Scans for abandoned running job leases and safely recovers them back to 'queued'.
 */
export async function recoverStaleResearchLeases(
  staleTimeoutMs = 5 * 60 * 1000,
  workspaceId?: string
): Promise<number> {
  const supabase = getAdminSupabaseClient();
  if (!supabase) throw new Error('Database client unavailable');

  const staleThresholdIso = new Date(Date.now() - staleTimeoutMs).toISOString();
  let query = supabase
    .from('research_jobs')
    .select('*')
    .eq('status', 'running');

  if (workspaceId) {
    const resolvedWorkspaceId = await resolveCanonicalWorkspaceId(workspaceId);
    query = query.eq('workspace_id', resolvedWorkspaceId);
  }

  const { data: runningJobs, error } = await query;
  if (error || !runningJobs || runningJobs.length === 0) return 0;

  let recoveredCount = 0;
  for (const job of runningJobs) {
    const jobParams = (job as { parameters?: { queue?: { locked_at?: string } } }).parameters;
    const leaseTime = (job as { locked_at?: string }).locked_at || jobParams?.queue?.locked_at || (job as { started_at?: string }).started_at;
    if (leaseTime && leaseTime < staleThresholdIso) {
      const updatePayload: Record<string, unknown> = {
        status: 'queued',
        assigned_worker: null,
        error: 'Recovered from abandoned worker lease'
      };

      let { error: resetErr } = await supabase
        .from('research_jobs')
        .update({ ...updatePayload, locked_by: null })
        .eq('id', (job as { id: string }).id)
        .eq('status', 'running');

      if (resetErr && (resetErr.code === '42703' || resetErr.message?.includes('column') || resetErr.message?.includes('schema cache'))) {
        const fallbackReset = await supabase
          .from('research_jobs')
          .update(updatePayload)
          .eq('id', (job as { id: string }).id)
          .eq('status', 'running');
        resetErr = fallbackReset.error;
      }

      if (!resetErr) {
        recoveredCount++;
      }
    }
  }

  return recoveredCount;
}

/**
 * Returns count of currently queued jobs.
 */
export async function findQueuedResearchJobsCount(workspaceId?: string): Promise<number> {
  const supabase = getAdminSupabaseClient();
  if (!supabase) return 0;

  let query = supabase
    .from('research_jobs')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'queued');

  if (workspaceId) {
    const resolvedWorkspaceId = await resolveCanonicalWorkspaceId(workspaceId);
    query = query.eq('workspace_id', resolvedWorkspaceId);
  }

  const { count } = await query;
  return count || 0;
}

export async function updateResearchJobStatus(
  jobId: string,
  workspaceId: string,
  updates: { status?: string; started_at?: string; completed_at?: string; error?: string | null },
  options: { allowOverwriteCompleted?: boolean } = {}
): Promise<CanonicalResearchJob | null> {
  const resolvedWorkspaceId = await resolveCanonicalWorkspaceId(workspaceId);
  const supabase = getAdminSupabaseClient();
  if (!supabase) throw new Error('Database client unavailable');

  // Preserve existing completed state if job was already finalized and overwrite not requested
  if (!options.allowOverwriteCompleted && (updates.status === 'completed' || updates.status === 'failed')) {
    const { data: current } = await supabase
      .from('research_jobs')
      .select('status, completed_at')
      .eq('id', jobId)
      .eq('workspace_id', resolvedWorkspaceId)
      .maybeSingle();

    if (current?.status === 'completed') {
      const { data } = await supabase
        .from('research_jobs')
        .select('*')
        .eq('id', jobId)
        .eq('workspace_id', resolvedWorkspaceId)
        .single();
      return data as CanonicalResearchJob | null;
    }
  }

  const { data, error } = await supabase
    .from('research_jobs')
    .update(updates)
    .eq('id', jobId)
    .eq('workspace_id', resolvedWorkspaceId)
    .select()
    .maybeSingle();

  if (error) throw new Error(`Database error updating research job: ${error.message}`);
  return data as CanonicalResearchJob | null;
}

export async function createDefaultAssignmentsForJob(job: CanonicalResearchJob): Promise<CanonicalResearchAssignment[]> {
  if (!job.id || !job.workspace_id) return [];
  const resolvedWorkspaceId = await resolveCanonicalWorkspaceId(job.workspace_id);
  const supabase = getAdminSupabaseClient();
  if (!supabase) throw new Error('Database client unavailable');

  const creators = Array.isArray(job.creators) ? job.creators : [];
  const sources = Array.isArray(job.sources) ? job.sources : [];

  const createdAssignments: CanonicalResearchAssignment[] = [];

  if (creators.length > 0) {
    for (const c of creators) {
      const handle = typeof c.handle === 'string' ? c.handle.trim().replace(/^@/, '') : null;
      const sourceTarget = typeof c.source_target === 'string' ? c.source_target.trim() : (handle ? `https://www.instagram.com/${handle}/` : null);

      const assignment: CanonicalResearchAssignment = {
        workspace_id: resolvedWorkspaceId,
        research_job_id: job.id,
        assignment_type: 'creator_research',
        platform: job.platform || 'Instagram',
        creator: handle,
        source_target: sourceTarget,
        topic: job.topic,
        status: 'queued',
        attempt_count: 0
      };

      const inserted = await insertResearchAssignment(assignment);
      createdAssignments.push(inserted);
    }
  } else if (sources.length > 0) {
    for (const s of sources) {
      const assignment: CanonicalResearchAssignment = {
        workspace_id: resolvedWorkspaceId,
        research_job_id: job.id,
        assignment_type: 'creator_research',
        platform: job.platform || 'General',
        creator: null,
        source_target: s.target,
        topic: job.topic,
        status: 'queued',
        attempt_count: 0
      };
      const inserted = await insertResearchAssignment(assignment);
      createdAssignments.push(inserted);
    }
  } else {
    const assignment: CanonicalResearchAssignment = {
      workspace_id: resolvedWorkspaceId,
      research_job_id: job.id,
      assignment_type: 'topic_research',
      platform: job.platform || 'Instagram',
      creator: null,
      source_target: null,
      topic: job.topic,
      status: 'queued',
      attempt_count: 0
    };
    const inserted = await insertResearchAssignment(assignment);
    createdAssignments.push(inserted);
  }

  return createdAssignments;
}

export async function insertResearchResult(result: CanonicalResearchResult): Promise<CanonicalResearchResult & { __deduplicated?: boolean }> {
  const supabase = getAdminSupabaseClient();
  const { data, error } = await supabase.from('research_results').insert({
    ...result,
    job_id: result.research_job_id,
    creator_source: result.creator
  }).select().single();

  if (error || !data) {
    if (error?.code === '23505' && result.idempotency_key) {
      const existing = await supabase
        .from('research_results')
        .select('*')
        .eq('workspace_id', result.workspace_id!)
        .eq('idempotency_key', result.idempotency_key)
        .maybeSingle();
      if (!existing.error && existing.data) {
        return { ...(existing.data as CanonicalResearchResult), __deduplicated: true };
      }
    }
    throw new Error(`Database error creating research result: ${error?.message || 'no row returned'}`);
  }
  return { ...(data as CanonicalResearchResult), __deduplicated: false };
}

export async function getResearchJobCounts(id: string, workspaceId: string) {
  const supabase = getAdminSupabaseClient();
  const [assignments, results] = await Promise.all([
    supabase.from('research_assignments').select('status').eq('research_job_id', id).eq('workspace_id', workspaceId),
    supabase.from('research_results').select('id', { count: 'exact', head: true }).eq('research_job_id', id).eq('workspace_id', workspaceId)
  ]);
  if (assignments.error) throw new Error(`Database error reading research assignments: ${assignments.error.message}`);
  if (results.error) throw new Error(`Database error reading research results: ${results.error.message}`);
  const statuses = assignments.data || [];
  return {
    assignment_count: statuses.length,
    completed_assignment_count: statuses.filter(a => a.status === 'completed').length,
    failed_assignment_count: statuses.filter(a => a.status === 'failed').length,
    result_count: results.count || 0
  };
}

export interface ResearchOverviewCounts {
  total_jobs: number;
  jobs_by_status: Record<string, number>;
  total_assignments: number;
  completed_assignments: number;
  failed_assignments: number;
  running_assignments: number;
  queued_assignments: number;
  total_results: number;
}

export async function getResearchOverview(workspaceId: string): Promise<ResearchOverviewCounts> {
  const resolvedWorkspaceId = await resolveCanonicalWorkspaceId(workspaceId);
  const supabase = getAdminSupabaseClient();
  if (!supabase) throw new Error('Database client unavailable');

  const [jobsRes, assignmentsRes, resultsRes] = await Promise.all([
    supabase.from('research_jobs').select('status').eq('workspace_id', resolvedWorkspaceId),
    supabase.from('research_assignments').select('status').eq('workspace_id', resolvedWorkspaceId),
    supabase.from('research_results').select('id', { count: 'exact', head: true }).eq('workspace_id', resolvedWorkspaceId)
  ]);

  if (jobsRes.error) throw new Error(`Database error reading research jobs: ${jobsRes.error.message}`);
  if (assignmentsRes.error) throw new Error(`Database error reading research assignments: ${assignmentsRes.error.message}`);
  if (resultsRes.error) throw new Error(`Database error reading research results: ${resultsRes.error.message}`);

  const jobs = jobsRes.data || [];
  const assignments = assignmentsRes.data || [];

  const jobsByStatus: Record<string, number> = {
    queued: 0,
    planning: 0,
    running: 0,
    completed: 0,
    failed: 0,
    cancelled: 0
  };

  for (const j of jobs) {
    if (j.status) {
      jobsByStatus[j.status] = (jobsByStatus[j.status] || 0) + 1;
    }
  }

  return {
    total_jobs: jobs.length,
    jobs_by_status: jobsByStatus,
    total_assignments: assignments.length,
    completed_assignments: assignments.filter(a => a.status === 'completed').length,
    failed_assignments: assignments.filter(a => a.status === 'failed').length,
    running_assignments: assignments.filter(a => a.status === 'running').length,
    queued_assignments: assignments.filter(a => a.status === 'queued').length,
    total_results: resultsRes.count || 0
  };
}

export interface QueryResearchJobsOptions {
  search?: string;
  status?: string;
  platform?: string;
  funnel_stage?: string;
  content_pillar?: string;
  limit?: number;
  offset?: number;
}

export async function queryResearchJobs(
  workspaceId: string,
  options: QueryResearchJobsOptions = {}
): Promise<{ jobs: Array<CanonicalResearchJob & { assignment_count: number; result_count: number }>; total: number }> {
  const resolvedWorkspaceId = await resolveCanonicalWorkspaceId(workspaceId);
  const supabase = getAdminSupabaseClient();
  if (!supabase) throw new Error('Database client unavailable');

  let query = supabase
    .from('research_jobs')
    .select('*', { count: 'exact' })
    .eq('workspace_id', resolvedWorkspaceId);

  if (options.status && options.status !== 'all') {
    query = query.eq('status', options.status);
  }
  if (options.platform && options.platform !== 'all') {
    query = query.eq('platform', options.platform);
  }
  if (options.funnel_stage && options.funnel_stage !== 'all') {
    query = query.eq('funnel_stage', options.funnel_stage);
  }
  if (options.content_pillar && options.content_pillar !== 'all') {
    query = query.eq('content_pillar', options.content_pillar);
  }
  if (options.search?.trim()) {
    const s = options.search.trim();
    query = query.or(`topic.ilike.%${s}%,objective.ilike.%${s}%`);
  }

  query = query.order('created_at', { ascending: false });

  const limit = Math.max(1, Math.min(options.limit || 20, 100));
  const offset = Math.max(0, options.offset || 0);
  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;
  if (error) throw new Error(`Database error querying research jobs: ${error.message}`);

  const jobs = (data || []) as CanonicalResearchJob[];

  const jobIds = jobs.map(j => j.id).filter(Boolean) as string[];
  const assignmentCountsByJob: Record<string, number> = {};
  const resultCountsByJob: Record<string, number> = {};

  if (jobIds.length > 0) {
    const [assignmentsRes, resultsRes] = await Promise.all([
      supabase.from('research_assignments').select('research_job_id').in('research_job_id', jobIds).eq('workspace_id', resolvedWorkspaceId),
      supabase.from('research_results').select('research_job_id').in('research_job_id', jobIds).eq('workspace_id', resolvedWorkspaceId)
    ]);

    if (!assignmentsRes.error && assignmentsRes.data) {
      for (const a of assignmentsRes.data) {
        if (a.research_job_id) {
          assignmentCountsByJob[a.research_job_id] = (assignmentCountsByJob[a.research_job_id] || 0) + 1;
        }
      }
    }

    if (!resultsRes.error && resultsRes.data) {
      for (const r of resultsRes.data) {
        if (r.research_job_id) {
          resultCountsByJob[r.research_job_id] = (resultCountsByJob[r.research_job_id] || 0) + 1;
        }
      }
    }
  }

  const enhancedJobs = jobs.map(j => ({
    ...j,
    assignment_count: assignmentCountsByJob[j.id!] || 0,
    result_count: resultCountsByJob[j.id!] || 0
  }));

  return { jobs: enhancedJobs, total: count || 0 };
}

export interface QueryResearchAssignmentsOptions {
  research_job_id?: string;
  status?: string;
  assignment_type?: string;
  limit?: number;
  offset?: number;
}

export async function queryResearchAssignments(
  workspaceId: string,
  options: QueryResearchAssignmentsOptions = {}
): Promise<{ assignments: CanonicalResearchAssignment[]; total: number }> {
  const resolvedWorkspaceId = await resolveCanonicalWorkspaceId(workspaceId);
  const supabase = getAdminSupabaseClient();
  if (!supabase) throw new Error('Database client unavailable');

  let query = supabase
    .from('research_assignments')
    .select('*', { count: 'exact' })
    .eq('workspace_id', resolvedWorkspaceId);

  if (options.research_job_id) {
    query = query.eq('research_job_id', options.research_job_id);
  }
  if (options.status && options.status !== 'all') {
    query = query.eq('status', options.status);
  }
  if (options.assignment_type && options.assignment_type !== 'all') {
    query = query.eq('assignment_type', options.assignment_type);
  }

  query = query.order('created_at', { ascending: false });

  const limit = Math.max(1, Math.min(options.limit || 50, 200));
  const offset = Math.max(0, options.offset || 0);
  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;
  if (error) throw new Error(`Database error querying research assignments: ${error.message}`);

  return { assignments: (data || []) as CanonicalResearchAssignment[], total: count || 0 };
}

export interface QueryResearchResultsOptions {
  research_job_id?: string;
  research_assignment_id?: string;
  classification?: string;
  platform?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export async function queryResearchResults(
  workspaceId: string,
  options: QueryResearchResultsOptions = {}
): Promise<{ results: CanonicalResearchResult[]; total: number }> {
  const resolvedWorkspaceId = await resolveCanonicalWorkspaceId(workspaceId);
  const supabase = getAdminSupabaseClient();
  if (!supabase) throw new Error('Database client unavailable');

  let query = supabase
    .from('research_results')
    .select('*', { count: 'exact' })
    .eq('workspace_id', resolvedWorkspaceId);

  if (options.research_job_id) {
    query = query.eq('research_job_id', options.research_job_id);
  }
  if (options.research_assignment_id) {
    query = query.eq('research_assignment_id', options.research_assignment_id);
  }
  if (options.classification && options.classification !== 'all') {
    query = query.eq('classification', options.classification);
  }
  if (options.platform && options.platform !== 'all') {
    query = query.eq('platform', options.platform);
  }
  if (options.search?.trim()) {
    const s = options.search.trim();
    query = query.or(`claim.ilike.%${s}%,topic.ilike.%${s}%,source_url.ilike.%${s}%,creator.ilike.%${s}%`);
  }

  query = query.order('created_at', { ascending: false });

  const limit = Math.max(1, Math.min(options.limit || 50, 200));
  const offset = Math.max(0, options.offset || 0);
  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;
  if (error) throw new Error(`Database error querying research results: ${error.message}`);

  return { results: (data || []) as CanonicalResearchResult[], total: count || 0 };
}

export async function findResearchResultWithProvenance(
  id: string,
  workspaceId: string
): Promise<{
  result: CanonicalResearchResult;
  job: CanonicalResearchJob | null;
  assignment: CanonicalResearchAssignment | null;
} | null> {
  const resolvedWorkspaceId = await resolveCanonicalWorkspaceId(workspaceId);
  const supabase = getAdminSupabaseClient();
  if (!supabase) throw new Error('Database client unavailable');

  const { data: result, error } = await supabase
    .from('research_results')
    .select('*')
    .eq('id', id)
    .eq('workspace_id', resolvedWorkspaceId)
    .maybeSingle();

  if (error) throw new Error(`Database error reading research result: ${error.message}`);
  if (!result) return null;

  let job: CanonicalResearchJob | null = null;
  let assignment: CanonicalResearchAssignment | null = null;

  if (result.research_job_id) {
    const { data: jobData } = await supabase
      .from('research_jobs')
      .select('*')
      .eq('id', result.research_job_id)
      .eq('workspace_id', resolvedWorkspaceId)
      .maybeSingle();
    job = jobData as CanonicalResearchJob | null;
  }

  if (result.research_assignment_id) {
    const { data: assignmentData } = await supabase
      .from('research_assignments')
      .select('*')
      .eq('id', result.research_assignment_id)
      .eq('workspace_id', resolvedWorkspaceId)
      .maybeSingle();
    assignment = assignmentData as CanonicalResearchAssignment | null;
  }

  return {
    result: result as CanonicalResearchResult,
    job,
    assignment
  };
}

// ==========================================
// CONTENT IDEAS & ASSETS
// ==========================================

export async function findContentIdea(id: string): Promise<CanonicalContentIdea | null> {
  const supabase = getAdminSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('content_ideas')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) return data;
    } catch {
      // Fallback
    }
  }

  return fallbackStore.contentIdeas.find(i => i.id === id) || null;
}

export async function insertContentIdea(idea: CanonicalContentIdea): Promise<CanonicalContentIdea> {
  const newIdea: CanonicalContentIdea = {
    ...idea,
    id: idea.id || `idea_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    status: idea.status || 'draft',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const supabase = getAdminSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('content_ideas')
        .insert(newIdea)
        .select()
        .single();

      if (!error && data) return data;
    } catch {
      // Fallback
    }
  }

  fallbackStore.contentIdeas.unshift(newIdea);
  return newIdea;
}

export async function findContentAsset(id: string): Promise<CanonicalContentAsset | null> {
  const supabase = getAdminSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('content_assets')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) return data;
    } catch {
      // Fallback
    }
  }

  return fallbackStore.contentAssets.find(a => a.id === id) || null;
}

export async function insertContentAsset(asset: CanonicalContentAsset): Promise<CanonicalContentAsset> {
  const newAsset: CanonicalContentAsset = {
    ...asset,
    id: asset.id || `asset_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    version: asset.version || 1,
    status: asset.status || 'draft',
    approval_status: asset.approval_status || 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const supabase = getAdminSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('content_assets')
        .insert(newAsset)
        .select()
        .single();

      if (!error && data) return data;
    } catch {
      // Fallback
    }
  }

  fallbackStore.contentAssets.unshift(newAsset);
  return newAsset;
}

// ==========================================
// AGENT RUNS
// ==========================================

export async function insertAgentRun(run: CanonicalAgentRun): Promise<CanonicalAgentRun> {
  const newRun: CanonicalAgentRun = {
    ...run,
    id: run.id || `run_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    status: run.status || 'queued',
    created_at: new Date().toISOString()
  };

  const supabase = getAdminSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('agent_runs')
        .insert(newRun)
        .select()
        .single();

      if (!error && data) return data;
    } catch {
      // Fallback
    }
  }

  fallbackStore.agentRuns.unshift(newRun);
  return newRun;
}

export async function findAgentRun(id: string): Promise<CanonicalAgentRun | null> {
  const supabase = getAdminSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('agent_runs')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) return data;
    } catch {
      // Fallback
    }
  }

  return fallbackStore.agentRuns.find(r => r.id === id) || null;
}

// ==========================================
// APPROVALS
// ==========================================

export async function insertApproval(approval: CanonicalApproval): Promise<CanonicalApproval> {
  const newApproval: CanonicalApproval = {
    ...approval,
    id: approval.id || `appr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    status: approval.status || 'pending',
    created_at: new Date().toISOString()
  };

  const supabase = getAdminSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('approvals')
        .insert(newApproval)
        .select()
        .single();

      if (!error && data) return data;
    } catch {
      // Fallback
    }
  }

  fallbackStore.approvals.unshift(newApproval);
  return newApproval;
}

export async function findApproval(id: string): Promise<CanonicalApproval | null> {
  const supabase = getAdminSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('approvals')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) return data;
    } catch {
      // Fallback
    }
  }

  return fallbackStore.approvals.find(a => a.id === id) || null;
}

export async function resolveApprovalDecision(
  id: string,
  decision: 'approved' | 'rejected' | 'edited' | 'cancelled',
  reviewerId?: string,
  feedback?: string,
  resolutionDetails?: Record<string, unknown>
): Promise<CanonicalApproval | null> {
  const resolvedAt = new Date().toISOString();

  const supabase = getAdminSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('approvals')
        .update({
          status: decision,
          reviewer_id: reviewerId || 'system_reviewer',
          feedback: feedback || null,
          resolution_details: resolutionDetails || {},
          resolved_at: resolvedAt
        })
        .eq('id', id)
        .select()
        .single();

      if (!error && data) return data;
    } catch {
      // Fallback
    }
  }

  const existing = fallbackStore.approvals.find(a => a.id === id);
  if (existing) {
    existing.status = decision;
    existing.reviewer_id = reviewerId;
    existing.feedback = feedback;
    existing.resolution_details = resolutionDetails;
    existing.resolved_at = resolvedAt;
    return existing;
  }

  return null;
}

// ==========================================
// CONTENT PERFORMANCE
// ==========================================

export async function queryContentPerformance(workspaceId: string, limit = 50) {
  const supabase = getAdminSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('content_performance')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('collected_at', { ascending: false })
        .limit(limit);

      if (!error && data && data.length > 0) return data;
    } catch {
      // Fallback
    }
  }

  return fallbackStore.performanceRecords.filter(p => !p.workspace_id || p.workspace_id === workspaceId);
}

export async function insertContentPerformance(perf: CanonicalContentPerformance): Promise<CanonicalContentPerformance> {
  const newPerf: CanonicalContentPerformance = {
    ...perf,
    id: perf.id || `perf_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    collected_at: perf.collected_at || new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const supabase = getAdminSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('content_performance')
        .insert(newPerf)
        .select()
        .single();

      if (!error && data) return data;
    } catch {
      // Fallback
    }
  }

  fallbackStore.performanceRecords.unshift(newPerf);
  return newPerf;
}
