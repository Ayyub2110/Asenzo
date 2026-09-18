import { getAdminSupabaseClient } from '../supabase/admin';
import { resolveCanonicalWorkspaceId, isValidUuid } from './workspace';
import {
  mockFoundation,
  mockAttention,
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
  question?: string;
  platform?: string;
  audience?: string;
  status?: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assigned_worker?: string;
  parameters?: Record<string, unknown>;
  error?: string;
  created_at?: string;
  completed_at?: string;
}

export interface CanonicalResearchResult {
  id?: string;
  job_id?: string;
  workspace_id?: string;
  topic: string;
  angle?: string;
  format?: string;
  platform?: string;
  creator_source?: string;
  source_url?: string;
  evidence?: Record<string, unknown>;
  audience?: string;
  awareness?: string;
  psychological_trigger?: string;
  founder_similarity?: number;
  competitor_similarity?: number;
  dna_match?: number;
  score?: number;
  classification?: 'proven' | 'experimental' | 'outlier';
  metadata?: Record<string, unknown>;
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
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('research_jobs')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) return data;
    } catch {
      // Fallback
    }
  }

  return fallbackStore.researchJobs.find(j => j.id === id) || null;
}

export async function insertResearchJob(job: CanonicalResearchJob): Promise<CanonicalResearchJob> {
  const newJob: CanonicalResearchJob = {
    ...job,
    id: job.id || `rjob_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    status: job.status || 'queued',
    created_at: new Date().toISOString()
  };

  const supabase = getAdminSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('research_jobs')
        .insert(newJob)
        .select()
        .single();

      if (!error && data) return data;
    } catch {
      // Fallback
    }
  }

  fallbackStore.researchJobs.unshift(newJob);
  return newJob;
}

export async function insertResearchResult(result: CanonicalResearchResult): Promise<CanonicalResearchResult> {
  const newResult: CanonicalResearchResult = {
    ...result,
    id: result.id || `rres_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    created_at: new Date().toISOString()
  };

  const supabase = getAdminSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('research_results')
        .insert(newResult)
        .select()
        .single();

      if (!error && data) return data;
    } catch {
      // Fallback
    }
  }

  fallbackStore.researchResults.unshift(newResult);
  return newResult;
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
