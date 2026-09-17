import { createClient, SupabaseClient } from '@supabase/supabase-js';

let adminClient: SupabaseClient | null = null;

/**
 * Returns a privileged Supabase client for backend/automation operations.
 * Requires SUPABASE_SERVICE_ROLE_KEY and SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL).
 * 
 * In production: throws an error immediately if credentials are missing to prevent silent fallback.
 * In development/test: logs a warning and returns null if credentials are absent.
 */
export function getAdminSupabaseClient(): SupabaseClient | null {
  if (adminClient) {
    return adminClient;
  }

  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    if (process.env.NODE_ENV === 'production') {
      const errorMsg =
        '[Supabase Admin] Database client unavailable: Required credentials missing in production. ' +
        'SUPABASE_SERVICE_ROLE_KEY and SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) must be set.';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    return null;
  }

  adminClient = createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  return adminClient;
}

/**
 * Allows overriding or resetting the admin client (primarily for testing).
 */
export function setAdminSupabaseClient(client: SupabaseClient | null): void {
  adminClient = client;
}
