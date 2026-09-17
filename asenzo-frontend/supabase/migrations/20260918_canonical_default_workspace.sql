-- =====================================================================
-- ASENZO Growth Operating System - Canonical Default Workspace
-- Migration: 20260918_canonical_default_workspace.sql
-- Description: Ensures a canonical default workspace exists for slug 'default-workspace'
--              with fixed UUID '00000000-0000-0000-0000-000000000000'
--              to satisfy foreign key constraints across canonical tables.
-- =====================================================================

-- 1. Insert or update the canonical default workspace
INSERT INTO public.workspaces (id, name, slug, settings)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'Primary Workspace',
    'default-workspace',
    '{"is_default": true, "system": true}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    name = EXCLUDED.name;

-- 2. Ensure an index on slug exists for fast lookups
CREATE UNIQUE INDEX IF NOT EXISTS workspaces_slug_idx ON public.workspaces(slug);
