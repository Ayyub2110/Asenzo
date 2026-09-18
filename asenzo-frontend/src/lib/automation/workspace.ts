import { createHash } from 'crypto';
import { getAdminSupabaseClient } from '../supabase/admin';

export const CANONICAL_DEFAULT_WORKSPACE_ID = '00000000-0000-0000-0000-000000000000';
export const CANONICAL_DEFAULT_WORKSPACE_SLUG = 'default-workspace';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Validates whether a string is a valid UUID.
 */
export function isValidUuid(val?: string | null): boolean {
  if (!val || typeof val !== 'string') return false;
  return UUID_REGEX.test(val.trim());
}

/**
 * Deterministically maps a string slug to a consistent UUID format.
 */
function slugToUuid(slug: string): string {
  if (slug === CANONICAL_DEFAULT_WORKSPACE_SLUG) {
    return CANONICAL_DEFAULT_WORKSPACE_ID;
  }
  const hash = createHash('md5').update(slug).digest('hex');
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
}

// In-memory cache for resolved workspace IDs to avoid redundant DB lookups
const workspaceResolutionCache = new Map<string, string>();

/**
 * Resolves a workspace identifier (slug or UUID) to a canonical UUID in public.workspaces.
 * - If already a valid UUID, returns it directly.
 * - If "default-workspace" or empty, maps to the canonical default workspace UUID.
 * - Looks up or ensures existence in public.workspaces through Supabase.
 * Database failures are surfaced instead of being converted into an in-memory or synthetic workspace.
 */
export async function resolveCanonicalWorkspaceId(
  workspaceInput?: string | null
): Promise<string> {
  const input = (workspaceInput || CANONICAL_DEFAULT_WORKSPACE_SLUG).trim();

  // 1. If it's already a valid UUID, return it
  if (isValidUuid(input)) {
    return input;
  }

  // 2. Check in-memory resolution cache
  if (workspaceResolutionCache.has(input)) {
    return workspaceResolutionCache.get(input)!;
  }

  // 3. Resolve the workspace through Supabase. Missing credentials or database errors are fatal.
  const supabase = getAdminSupabaseClient();
  const { data: existingWorkspace, error: lookupErr } = await supabase
    .from('workspaces')
    .select('id')
    .eq('slug', input)
    .maybeSingle();

  if (lookupErr) {
    throw new Error(`Database error resolving workspace: ${lookupErr.message}`);
  }

  if (existingWorkspace?.id) {
    workspaceResolutionCache.set(input, existingWorkspace.id);
    return existingWorkspace.id;
  }

  // If resolving default-workspace, ensure the canonical UUID row exists.
  if (input === CANONICAL_DEFAULT_WORKSPACE_SLUG) {
    const { data: ensured, error: ensureErr } = await supabase
      .from('workspaces')
      .upsert(
        {
          id: CANONICAL_DEFAULT_WORKSPACE_ID,
          name: 'Primary Workspace',
          slug: CANONICAL_DEFAULT_WORKSPACE_SLUG,
          settings: { is_default: true, system: true }
        },
        { onConflict: 'id' }
      )
      .select('id')
      .single();

    if (ensureErr || !ensured?.id) {
      throw new Error(`Database error ensuring canonical workspace: ${ensureErr?.message || 'no workspace returned'}`);
    }
    workspaceResolutionCache.set(input, ensured.id);
    return ensured.id;
  }

  // Auto-provision non-default workspace slugs so foreign key constraints succeed in Supabase.
  const customUuid = slugToUuid(input);
  const { data: createdWs, error: createWsErr } = await supabase
    .from('workspaces')
    .upsert(
      { id: customUuid, name: input, slug: input, settings: { dynamic: true } },
      { onConflict: 'slug' }
    )
    .select('id')
    .maybeSingle();

  if (createWsErr || !createdWs?.id) {
    throw new Error(`Database error creating workspace: ${createWsErr?.message || 'no workspace returned'}`);
  }

  workspaceResolutionCache.set(input, createdWs.id);
  return createdWs.id;
}

/**
 * Resets resolution cache (useful for test isolation).
 */
export function clearWorkspaceResolutionCache(): void {
  workspaceResolutionCache.clear();
}
