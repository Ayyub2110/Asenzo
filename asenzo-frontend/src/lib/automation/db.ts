import { getAdminSupabaseClient } from '../supabase/admin';
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

// In-memory fallback stores for test/offline resilience
const fallbackStore = {
  intelligenceCards: [] as CanonicalIntelligenceCard[],
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
  const supabase = getAdminSupabaseClient();
  if (supabase) {
    try {
      const { data } = await supabase
        .from('audience_dna')
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
  const supabase = getAdminSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('intelligence_cards')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('recorded_at', { ascending: false })
        .limit(limit);

      if (!error && data && data.length > 0) return data;
    } catch {
      // Fallback
    }
  }

  return fallbackStore.intelligenceCards.filter(c => !c.workspace_id || c.workspace_id === workspaceId);
}

export async function insertIntelligenceCard(card: CanonicalIntelligenceCard): Promise<CanonicalIntelligenceCard> {
  const newCard: CanonicalIntelligenceCard = {
    ...card,
    id: card.id || `intel_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    recorded_at: card.recorded_at || new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const supabase = getAdminSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('intelligence_cards')
        .insert(newCard)
        .select()
        .single();

      if (!error && data) return data;
    } catch {
      // Fallback
    }
  }

  fallbackStore.intelligenceCards.unshift(newCard);
  return newCard;
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
