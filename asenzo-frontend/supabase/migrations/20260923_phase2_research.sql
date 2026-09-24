-- ASENZO Phase 2: canonical research data bank.
-- Additive migration for installations that already have the foundation tables.

ALTER TABLE public.research_jobs
  ADD COLUMN IF NOT EXISTS funnel_stage TEXT,
  ADD COLUMN IF NOT EXISTS content_pillar TEXT,
  ADD COLUMN IF NOT EXISTS date_range TEXT,
  ADD COLUMN IF NOT EXISTS keyword_topic TEXT,
  ADD COLUMN IF NOT EXISTS creators JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS sources JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS started_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS idempotency_key TEXT;

UPDATE public.research_results
SET classification = 'ai_hypothesis'
WHERE classification IS NULL OR classification NOT IN ('observed_fact', 'inferred_pattern', 'ai_hypothesis');

CREATE UNIQUE INDEX IF NOT EXISTS research_jobs_workspace_idempotency_idx
  ON public.research_jobs (workspace_id, idempotency_key)
  WHERE idempotency_key IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.research_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  research_job_id UUID NOT NULL REFERENCES public.research_jobs(id) ON DELETE CASCADE,
  assignment_type TEXT NOT NULL,
  platform TEXT,
  creator TEXT,
  topic TEXT NOT NULL,
  source_target TEXT,
  status TEXT NOT NULL DEFAULT 'queued',
  attempt_count INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT research_assignments_status_check CHECK (status IN ('queued', 'running', 'completed', 'failed', 'cancelled'))
);

ALTER TABLE public.research_results
  ADD COLUMN IF NOT EXISTS research_job_id UUID REFERENCES public.research_jobs(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS research_assignment_id UUID REFERENCES public.research_assignments(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS source_type TEXT,
  ADD COLUMN IF NOT EXISTS source_title TEXT,
  ADD COLUMN IF NOT EXISTS creator TEXT,
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS hook TEXT,
  ADD COLUMN IF NOT EXISTS claim TEXT,
  ADD COLUMN IF NOT EXISTS audience_signals JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS market_signals JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS content_patterns JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS evidence_strength TEXT,
  ADD COLUMN IF NOT EXISTS confidence TEXT,
  ADD COLUMN IF NOT EXISTS raw_source_reference JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS research_agent TEXT,
  ADD COLUMN IF NOT EXISTS idempotency_key TEXT;

ALTER TABLE public.research_results
  DROP CONSTRAINT IF EXISTS research_results_classification_check;
ALTER TABLE public.research_results
  ADD CONSTRAINT research_results_classification_check
  CHECK (classification IS NULL OR classification IN ('observed_fact', 'inferred_pattern', 'ai_hypothesis'));

ALTER TABLE public.research_results
  ADD CONSTRAINT research_results_workspace_job_check
  CHECK (research_job_id IS NOT NULL OR job_id IS NOT NULL);

CREATE UNIQUE INDEX IF NOT EXISTS research_results_workspace_idempotency_idx
  ON public.research_results (workspace_id, idempotency_key)
  WHERE idempotency_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS research_assignments_job_idx
  ON public.research_assignments (workspace_id, research_job_id);
CREATE INDEX IF NOT EXISTS research_results_job_idx
  ON public.research_results (workspace_id, research_job_id);

ALTER TABLE public.research_jobs
  DROP CONSTRAINT IF EXISTS research_jobs_status_check;
ALTER TABLE public.research_jobs
  ADD CONSTRAINT research_jobs_status_check
  CHECK (status IN ('queued', 'planning', 'running', 'completed', 'failed', 'cancelled'));

CREATE INDEX IF NOT EXISTS research_jobs_workspace_created_idx
  ON public.research_jobs (workspace_id, created_at DESC);