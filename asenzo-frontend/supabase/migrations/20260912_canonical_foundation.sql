-- =====================================================================
-- ASENZO Growth Operating System - Canonical Database Foundation
-- Migration: 20260912_canonical_foundation.sql
-- Description: Extends existing foundation tables with canonical domains:
--              Core, Intelligence, DNA, Research, Content, Agents, Approvals, Learning
-- =====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================================
-- DOMAIN 1: CORE (Workspaces, Members, Events, Approvals)
-- =====================================================================

-- Workspaces
CREATE TABLE IF NOT EXISTS public.workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Workspace Members
CREATE TABLE IF NOT EXISTS public.workspace_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member', -- owner, admin, member, agent
    permissions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(workspace_id, user_id)
);

-- System Events Log
CREATE TABLE IF NOT EXISTS public.system_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    actor_id TEXT,
    payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Approvals (Human-in-the-loop Governance)
CREATE TABLE IF NOT EXISTS public.approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL, -- content_asset, founder_dna, audience_dna, skill_version, pricing, offer, sales_outcome
    entity_id TEXT NOT NULL,
    action TEXT NOT NULL, -- publish, outbound, apply_dna_change, activate_skill, send_proposal
    status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected, edited, cancelled
    requested_by TEXT NOT NULL, -- agent_id or user_id
    reviewer_id TEXT,
    feedback TEXT,
    proposed_changes JSONB DEFAULT '{}'::jsonb,
    resolution_details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================================
-- DOMAIN 2: INTELLIGENCE & CANONICAL DNA
-- =====================================================================

-- Intelligence Cards (Atomic psychological & market observations)
CREATE TABLE IF NOT EXISTS public.intelligence_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    source_type TEXT NOT NULL, -- sales_call, social_post, competitor_analysis, customer_interview, research_paper
    source_id TEXT,
    source_url TEXT,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    category TEXT NOT NULL, -- pain, objection, belief, desire, trigger, pattern
    stage TEXT, -- TOF, MOF, BOF, RETENTION
    signal_type TEXT NOT NULL, -- buyer_intent, market_shift, language_resonance
    exact_language TEXT NOT NULL,
    context TEXT,
    emotion TEXT,
    desire TEXT,
    fear TEXT,
    frustration TEXT,
    belief TEXT,
    motivation TEXT,
    objection TEXT,
    aspiration TEXT,
    decision_trigger TEXT,
    awareness_level TEXT, -- unaware, problem_aware, solution_aware, product_aware, most_aware
    ai_interpretation TEXT,
    observation_type TEXT NOT NULL DEFAULT 'observed_fact', -- observed_fact, inferred_psychology, ai_hypothesis, human_verified_insight
    confidence NUMERIC DEFAULT 0.8,
    human_verified BOOLEAN DEFAULT false,
    verified_by TEXT,
    verified_at TIMESTAMP WITH TIME ZONE,
    relevant_modules JSONB DEFAULT '["Acquisition"]'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Psychological Signals
CREATE TABLE IF NOT EXISTS public.psychological_signals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    signal_name TEXT NOT NULL,
    pattern_summary TEXT NOT NULL,
    frequency INT DEFAULT 1,
    strength NUMERIC DEFAULT 0.5,
    evidence_ids JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Founder DNA (Canonical founder voice, beliefs, and strategic guidelines)
CREATE TABLE IF NOT EXISTS public.founder_dna (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    beliefs JSONB DEFAULT '[]'::jsonb,
    convictions JSONB DEFAULT '[]'::jsonb,
    preferences JSONB DEFAULT '{}'::jsonb,
    likes JSONB DEFAULT '[]'::jsonb,
    dislikes JSONB DEFAULT '[]'::jsonb,
    communication_style JSONB DEFAULT '{}'::jsonb,
    decision_preferences JSONB DEFAULT '{}'::jsonb,
    content_preferences JSONB DEFAULT '{}'::jsonb,
    strategic_preferences JSONB DEFAULT '{}'::jsonb,
    positioning JSONB DEFAULT '{}'::jsonb,
    examples_evidence JSONB DEFAULT '[]'::jsonb,
    version INT DEFAULT 1 NOT NULL,
    status TEXT DEFAULT 'active', -- active, draft, archived
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Audience DNA (Canonical audience profile, psychology, and buying patterns)
CREATE TABLE IF NOT EXISTS public.audience_dna (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    situation JSONB DEFAULT '{}'::jsonb,
    pain JSONB DEFAULT '[]'::jsonb,
    triggers JSONB DEFAULT '[]'::jsonb,
    objections JSONB DEFAULT '[]'::jsonb,
    fears JSONB DEFAULT '[]'::jsonb,
    natural_language JSONB DEFAULT '[]'::jsonb,
    journey JSONB DEFAULT '{}'::jsonb,
    desired_future JSONB DEFAULT '{}'::jsonb,
    emotions JSONB DEFAULT '[]'::jsonb,
    beliefs JSONB DEFAULT '[]'::jsonb,
    awareness JSONB DEFAULT '{}'::jsonb,
    decision_criteria JSONB DEFAULT '[]'::jsonb,
    buying_triggers JSONB DEFAULT '[]'::jsonb,
    evidence JSONB DEFAULT '[]'::jsonb,
    version INT DEFAULT 1 NOT NULL,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Content DNA (High-resonance angles, formulas, frameworks, winning patterns)
CREATE TABLE IF NOT EXISTS public.content_dna (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    topics JSONB DEFAULT '[]'::jsonb,
    angles JSONB DEFAULT '[]'::jsonb,
    hooks JSONB DEFAULT '[]'::jsonb,
    scripts JSONB DEFAULT '[]'::jsonb,
    stories JSONB DEFAULT '[]'::jsonb,
    formats JSONB DEFAULT '[]'::jsonb,
    frameworks JSONB DEFAULT '[]'::jsonb,
    ctas JSONB DEFAULT '[]'::jsonb,
    emotions JSONB DEFAULT '[]'::jsonb,
    winning_patterns JSONB DEFAULT '[]'::jsonb,
    failed_patterns JSONB DEFAULT '[]'::jsonb,
    platform_patterns JSONB DEFAULT '{}'::jsonb,
    evidence JSONB DEFAULT '[]'::jsonb,
    version INT DEFAULT 1 NOT NULL,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Sales DNA (Objections, winning arguments, trust language, conversion triggers)
CREATE TABLE IF NOT EXISTS public.sales_dna (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    objections JSONB DEFAULT '[]'::jsonb,
    buying_triggers JSONB DEFAULT '[]'::jsonb,
    positive_reactions JSONB DEFAULT '[]'::jsonb,
    conversion_moments JSONB DEFAULT '[]'::jsonb,
    lost_reasons JSONB DEFAULT '[]'::jsonb,
    winning_arguments JSONB DEFAULT '[]'::jsonb,
    trust_language JSONB DEFAULT '[]'::jsonb,
    evidence JSONB DEFAULT '[]'::jsonb,
    version INT DEFAULT 1 NOT NULL,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================================
-- DOMAIN 3: RESEARCH (Jobs, Results, Evidence)
-- =====================================================================

-- Research Jobs
CREATE TABLE IF NOT EXISTS public.research_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    objective TEXT NOT NULL,
    topic TEXT NOT NULL,
    question TEXT,
    platform TEXT, -- LinkedIn, YouTube, X, Reddit, Substack
    audience TEXT,
    status TEXT NOT NULL DEFAULT 'queued', -- queued, running, completed, failed, cancelled
    priority TEXT DEFAULT 'medium', -- low, medium, high, urgent
    assigned_worker TEXT DEFAULT 'ACQ-R01',
    parameters JSONB DEFAULT '{}'::jsonb,
    error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Research Results
CREATE TABLE IF NOT EXISTS public.research_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES public.research_jobs(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    angle TEXT,
    format TEXT,
    platform TEXT,
    creator_source TEXT,
    source_url TEXT,
    evidence JSONB DEFAULT '{}'::jsonb,
    audience TEXT,
    awareness TEXT,
    psychological_trigger TEXT,
    founder_similarity NUMERIC DEFAULT 0,
    competitor_similarity NUMERIC DEFAULT 0,
    dna_match NUMERIC DEFAULT 0,
    score NUMERIC DEFAULT 0,
    classification TEXT DEFAULT 'experimental', -- proven, experimental, outlier
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Evidence (Atomic proof, quotes, transcripts, metrics)
CREATE TABLE IF NOT EXISTS public.evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    source_type TEXT NOT NULL,
    source_url TEXT,
    source_title TEXT,
    content_snippet TEXT NOT NULL,
    author TEXT,
    metrics JSONB DEFAULT '{}'::jsonb,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================================
-- DOMAIN 4: CONTENT (Ideas, Assets, Performance)
-- =====================================================================

-- Content Ideas
CREATE TABLE IF NOT EXISTS public.content_ideas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    angle TEXT,
    audience TEXT,
    platform TEXT DEFAULT 'LinkedIn',
    awareness TEXT, -- unaware, problem_aware, solution_aware, product_aware, most_aware
    psychological_trigger TEXT,
    score NUMERIC DEFAULT 0,
    scoring_dimensions JSONB DEFAULT '{}'::jsonb, -- virality, relevance, ICP fit, novelty
    evidence JSONB DEFAULT '[]'::jsonb,
    reasoning TEXT,
    status TEXT NOT NULL DEFAULT 'draft', -- draft, scored, selected, in_production, archived
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Content Assets (Drafts, Scripts, Hooks, Final Copy)
CREATE TABLE IF NOT EXISTS public.content_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    idea_id UUID REFERENCES public.content_ideas(id) ON DELETE SET NULL,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    angle TEXT,
    format TEXT DEFAULT 'Post', -- Post, Thread, Short Video, Newsletter, Lead Magnet
    platform TEXT DEFAULT 'LinkedIn',
    hook TEXT,
    script_body TEXT NOT NULL,
    cta TEXT,
    status TEXT NOT NULL DEFAULT 'draft', -- draft, review_required, approved, scheduled, published, rejected
    version INT DEFAULT 1 NOT NULL,
    evaluation JSONB DEFAULT '{}'::jsonb, -- critic score, clarity, hook power, retention estimate
    approval_status TEXT DEFAULT 'pending', -- pending, approved, rejected
    approved_by TEXT,
    approved_at TIMESTAMP WITH TIME ZONE,
    published_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Content Performance
CREATE TABLE IF NOT EXISTS public.content_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID REFERENCES public.content_assets(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE,
    views INT DEFAULT 0,
    reach INT DEFAULT 0,
    engagements INT DEFAULT 0,
    comments INT DEFAULT 0,
    shares INT DEFAULT 0,
    saves INT DEFAULT 0,
    clicks INT DEFAULT 0,
    ctr NUMERIC DEFAULT 0,
    leads INT DEFAULT 0,
    conversions INT DEFAULT 0,
    revenue_influenced NUMERIC DEFAULT 0,
    source_provenance TEXT,
    collected_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================================
-- DOMAIN 5: AGENTS & SKILLS
-- =====================================================================

-- Agent Registry
CREATE TABLE IF NOT EXISTS public.agent_registry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_code TEXT UNIQUE NOT NULL, -- e.g. ACQ-C01, ACQ-C02
    agent_name TEXT NOT NULL,
    module TEXT NOT NULL, -- Acquisition, Conversion, Revenue, Delivery, Operations
    purpose TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'planned', -- planned, active, paused, deprecated
    version TEXT DEFAULT '1.0.0',
    model TEXT DEFAULT 'gemini-1.5-pro',
    system_prompt_reference TEXT,
    skill_version TEXT,
    input_schema JSONB DEFAULT '{}'::jsonb,
    output_schema JSONB DEFAULT '{}'::jsonb,
    requires_human_approval BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Agent Runs (Execution telemetry persisted from n8n)
CREATE TABLE IF NOT EXISTS public.agent_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    agent_id TEXT NOT NULL, -- Reference to agent_code or UUID
    workflow_id TEXT,
    task TEXT NOT NULL,
    input_reference TEXT,
    context_version TEXT,
    model TEXT,
    prompt_version TEXT,
    skill_version TEXT,
    input_payload JSONB DEFAULT '{}'::jsonb,
    output_payload JSONB DEFAULT '{}'::jsonb,
    score NUMERIC,
    evidence JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'queued', -- queued, running, completed, failed, cancelled
    error TEXT,
    duration_ms INT,
    human_decision TEXT, -- approved, rejected, edited
    final_result JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Agent Skills
CREATE TABLE IF NOT EXISTS public.agent_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    description TEXT NOT NULL,
    current_version INT DEFAULT 1 NOT NULL,
    status TEXT DEFAULT 'active', -- active, draft, deprecated
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Skill Versions (Immutable version history)
CREATE TABLE IF NOT EXISTS public.skill_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    skill_id UUID REFERENCES public.agent_skills(id) ON DELETE CASCADE,
    version INT NOT NULL,
    instructions TEXT NOT NULL,
    evaluation_criteria JSONB DEFAULT '[]'::jsonb,
    examples JSONB DEFAULT '[]'::jsonb,
    known_failures JSONB DEFAULT '[]'::jsonb,
    improvements TEXT,
    performance_score NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'active', -- active, deprecated, candidate
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(skill_id, version)
);

-- =====================================================================
-- DOMAIN 6: LEARNING & EXPERIMENTS
-- =====================================================================

-- Experiments
CREATE TABLE IF NOT EXISTS public.experiments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    hypothesis TEXT NOT NULL,
    variable_tested TEXT NOT NULL, -- hook_type, cta, angle, posting_time
    variant_a JSONB DEFAULT '{}'::jsonb,
    variant_b JSONB DEFAULT '{}'::jsonb,
    winner TEXT,
    confidence NUMERIC,
    status TEXT DEFAULT 'active', -- planned, active, concluded
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    concluded_at TIMESTAMP WITH TIME ZONE
);

-- Human Feedback
CREATE TABLE IF NOT EXISTS public.human_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    target_entity_type TEXT NOT NULL,
    target_entity_id TEXT NOT NULL,
    rating INT, -- 1 to 5
    critique TEXT,
    correction TEXT,
    submitted_by TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Idempotency Records
CREATE TABLE IF NOT EXISTS public.idempotency_records (
    idempotency_key TEXT PRIMARY KEY,
    workspace_id UUID,
    request_path TEXT NOT NULL,
    request_hash TEXT,
    response_code INT NOT NULL,
    response_body JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now() + INTERVAL '24 hours') NOT NULL
);

-- =====================================================================
-- SEED INITIAL ACQUISITION AGENTS
-- =====================================================================

INSERT INTO public.agent_registry (agent_code, agent_name, module, purpose, status, version, model, requires_human_approval)
VALUES
    ('ACQ-C01', 'Context Intelligence Agent', 'Acquisition', 'Extracts and indexes market context, signals, and founder directives.', 'planned', '1.0.0', 'gemini-1.5-pro', false),
    ('ACQ-C02', 'Audience Intelligence Agent', 'Acquisition', 'Synthesizes audience psychology, pains, triggers, and language patterns.', 'planned', '1.0.0', 'gemini-1.5-pro', false),
    ('ACQ-R01', 'Research Worker Agent', 'Acquisition', 'Scrapes, monitors, and aggregates competitor/market evidence and outlier patterns.', 'planned', '1.0.0', 'gemini-1.5-flash', false),
    ('ACQ-C04', 'Idea Scoring Agent', 'Acquisition', 'Evaluates content opportunities across virality, authority, ICP fit, and novelty.', 'planned', '1.0.0', 'gemini-1.5-pro', false),
    ('ACQ-C05', 'Script Writer Agent', 'Acquisition', 'Drafts high-converting scripts, hooks, and posts matching Founder DNA voice.', 'planned', '1.0.0', 'gemini-1.5-pro', false),
    ('ACQ-C06', 'Script Critic/Judge Agent', 'Acquisition', 'Adversarially critiques drafts against rigorous psychological & structural benchmarks.', 'planned', '1.0.0', 'gemini-1.5-pro', false),
    ('ACQ-C07', 'Story Agent', 'Acquisition', 'Translates founder experiences into narrative frameworks with emotional resonance.', 'planned', '1.0.0', 'gemini-1.5-pro', false),
    ('ACQ-L01', 'Performance & Learning Agent', 'Acquisition', 'Analyzes published content metrics to update Content DNA and skill versions.', 'planned', '1.0.0', 'gemini-1.5-pro', false)
ON CONFLICT (agent_code) DO NOTHING;

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intelligence_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psychological_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.founder_dna ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audience_dna ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_dna ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_dna ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.human_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idempotency_records ENABLE ROW LEVEL SECURITY;

-- Allow unrestricted access for service role and public dev mode
DO $$ 
DECLARE
    tbl text;
    tables text[] := ARRAY[
        'workspaces', 'workspace_members', 'system_events', 'approvals',
        'intelligence_cards', 'psychological_signals', 'founder_dna',
        'audience_dna', 'content_dna', 'sales_dna', 'research_jobs',
        'research_results', 'evidence', 'content_ideas', 'content_assets',
        'content_performance', 'agent_registry', 'agent_runs',
        'agent_skills', 'skill_versions', 'experiments', 'human_feedback', 'idempotency_records'
    ];
BEGIN
    FOREACH tbl IN ARRAY tables LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Allow select on %I" ON public.%I', tbl, tbl);
        EXECUTE format('DROP POLICY IF EXISTS "Allow insert on %I" ON public.%I', tbl, tbl);
        EXECUTE format('DROP POLICY IF EXISTS "Allow update on %I" ON public.%I', tbl, tbl);
        EXECUTE format('DROP POLICY IF EXISTS "Allow delete on %I" ON public.%I', tbl, tbl);

        EXECUTE format('CREATE POLICY "Allow select on %I" ON public.%I FOR SELECT USING (true)', tbl, tbl);
        EXECUTE format('CREATE POLICY "Allow insert on %I" ON public.%I FOR INSERT WITH CHECK (true)', tbl, tbl);
        EXECUTE format('CREATE POLICY "Allow update on %I" ON public.%I FOR UPDATE USING (true)', tbl, tbl);
        EXECUTE format('CREATE POLICY "Allow delete on %I" ON public.%I FOR DELETE USING (true)', tbl, tbl);
    END LOOP;
END $$;
