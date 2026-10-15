-- =====================================================================
-- ASENZO Step 6: Durable Native Research Queue & Worker
-- Additive migration for atomic locking, lease tracking, bounded retries,
-- and worker concurrency across distributed node environments.
-- =====================================================================

-- 1. Queue and lease tracking columns on public.research_jobs
ALTER TABLE public.research_jobs
  ADD COLUMN IF NOT EXISTS locked_by TEXT,
  ADD COLUMN IF NOT EXISTS locked_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS next_run_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  ADD COLUMN IF NOT EXISTS attempt_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS max_retries INTEGER NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS last_heartbeat_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS dead_lettered BOOLEAN NOT NULL DEFAULT false;

-- 2. Lease and retry columns on public.research_assignments
ALTER TABLE public.research_assignments
  ADD COLUMN IF NOT EXISTS locked_by TEXT,
  ADD COLUMN IF NOT EXISTS locked_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS max_retries INTEGER NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS next_run_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- 3. Queue Performance & Locking Indexes
CREATE INDEX IF NOT EXISTS research_jobs_durable_queue_idx
  ON public.research_jobs (status, next_run_at, priority, created_at)
  WHERE status IN ('queued', 'running');

CREATE INDEX IF NOT EXISTS research_jobs_locked_lease_idx
  ON public.research_jobs (status, locked_at)
  WHERE status = 'running';

CREATE INDEX IF NOT EXISTS research_assignments_durable_queue_idx
  ON public.research_assignments (workspace_id, research_job_id, status);

-- 4. Atomic Job Claim Function with FOR UPDATE SKIP LOCKED
CREATE OR REPLACE FUNCTION public.claim_next_research_job(
  p_worker_id TEXT,
  p_workspace_id UUID DEFAULT NULL,
  p_stale_timeout_seconds INTEGER DEFAULT 300
)
RETURNS SETOF public.research_jobs
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_job_id UUID;
  v_stale_threshold TIMESTAMP WITH TIME ZONE;
BEGIN
  v_stale_threshold := timezone('utc'::text, now()) - (p_stale_timeout_seconds || ' seconds')::interval;

  -- Atomically select the next highest priority eligible job and lock it
  SELECT id INTO v_job_id
  FROM public.research_jobs
  WHERE (
    (status = 'queued' AND (next_run_at IS NULL OR next_run_at <= timezone('utc'::text, now())))
    OR
    (status = 'running' AND (
      (locked_at IS NOT NULL AND locked_at < v_stale_threshold)
      OR
      (locked_at IS NULL AND started_at IS NOT NULL AND started_at < v_stale_threshold)
    ))
  )
  AND (p_workspace_id IS NULL OR workspace_id = p_workspace_id)
  ORDER BY
    CASE priority
      WHEN 'urgent' THEN 1
      WHEN 'high' THEN 2
      WHEN 'normal' THEN 3
      WHEN 'medium' THEN 3
      WHEN 'low' THEN 4
      ELSE 5
    END,
    created_at ASC
  LIMIT 1
  FOR UPDATE SKIP LOCKED;

  IF v_job_id IS NULL THEN
    RETURN;
  END IF;

  -- Atomically claim and mark running with worker lease
  RETURN QUERY
  UPDATE public.research_jobs
  SET
    status = 'running',
    locked_by = p_worker_id,
    assigned_worker = p_worker_id,
    locked_at = timezone('utc'::text, now()),
    last_heartbeat_at = timezone('utc'::text, now()),
    started_at = COALESCE(started_at, timezone('utc'::text, now())),
    attempt_count = COALESCE(attempt_count, 0) + 1,
    error = NULL
  WHERE id = v_job_id
  RETURNING *;
END;
$$;

-- 5. Worker Lease Heartbeat Function
CREATE OR REPLACE FUNCTION public.heartbeat_research_job(
  p_job_id UUID,
  p_worker_id TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_updated INTEGER;
BEGIN
  UPDATE public.research_jobs
  SET
    locked_at = timezone('utc'::text, now()),
    last_heartbeat_at = timezone('utc'::text, now())
  WHERE id = p_job_id
    AND status = 'running'
    AND (locked_by = p_worker_id OR assigned_worker = p_worker_id);

  GET DIAGNOSTICS v_updated = ROW_COUNT;
  RETURN v_updated > 0;
END;
$$;

-- 6. Reschedule Job with Exponential Backoff or Terminal Dead-Letter
CREATE OR REPLACE FUNCTION public.reschedule_research_job(
  p_job_id UUID,
  p_worker_id TEXT,
  p_error TEXT,
  p_backoff_seconds INTEGER DEFAULT 30,
  p_max_retries INTEGER DEFAULT 3
)
RETURNS SETOF public.research_jobs
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_attempts INTEGER;
  v_max_attempts INTEGER;
BEGIN
  SELECT COALESCE(attempt_count, 1), COALESCE(max_retries, p_max_retries)
  INTO v_current_attempts, v_max_attempts
  FROM public.research_jobs
  WHERE id = p_job_id;

  IF v_current_attempts >= v_max_attempts THEN
    -- Dead-letter: terminal failure (fenced to current worker)
    RETURN QUERY
    UPDATE public.research_jobs
    SET
      status = 'failed',
      locked_by = NULL,
      completed_at = timezone('utc'::text, now()),
      error = p_error
    WHERE id = p_job_id
      AND status = 'running'
      AND (locked_by = p_worker_id OR assigned_worker = p_worker_id)
    RETURNING *;
  ELSE
    -- Retry with exponential backoff (fenced to current worker)
    RETURN QUERY
    UPDATE public.research_jobs
    SET
      status = 'queued',
      locked_by = NULL,
      assigned_worker = NULL,
      next_run_at = timezone('utc'::text, now()) + (p_backoff_seconds || ' seconds')::interval,
      error = p_error
    WHERE id = p_job_id
      AND status = 'running'
      AND (locked_by = p_worker_id OR assigned_worker = p_worker_id)
    RETURNING *;
  END IF;
END;
$$;

-- 7. Complete Research Job with Lease Fencing
CREATE OR REPLACE FUNCTION public.complete_research_job(
  p_job_id UUID,
  p_worker_id TEXT,
  p_error TEXT DEFAULT NULL
)
RETURNS SETOF public.research_jobs
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  UPDATE public.research_jobs
  SET
    status = 'completed',
    locked_by = NULL,
    completed_at = timezone('utc'::text, now()),
    error = p_error
  WHERE id = p_job_id
    AND status = 'running'
    AND (locked_by = p_worker_id OR assigned_worker = p_worker_id)
  RETURNING *;
END;
$$;
