import { createClient, SupabaseClient } from '@supabase/supabase-js';

let adminClient: SupabaseClient | null | undefined = undefined;

// Ensure environment variables are loaded in CLI/script runtimes if missing
if (!process.env.SUPABASE_SERVICE_ROLE_KEY && typeof window === 'undefined') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { loadEnvConfig } = require('@next/env');
    loadEnvConfig(process.cwd());
  } catch {
    // Ignore in non-Node or bundled browser environments
  }
}

/**
 * Returns a privileged Supabase client for backend/automation operations.
 * Requires SUPABASE_SERVICE_ROLE_KEY and SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL).
 * 
 * Throws an error immediately if credentials are missing to prevent silent fallback across all runtime environments.
 */
export function getAdminSupabaseClient(): SupabaseClient | null {
  if (adminClient !== undefined) {
    return adminClient;
  }

  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    const errorMsg =
      '[Supabase Admin] Database client unavailable: Required credentials missing. ' +
      'SUPABASE_SERVICE_ROLE_KEY and SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) must be set.';
    console.error(errorMsg);
    throw new Error(errorMsg);
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
export function setAdminSupabaseClient(client: SupabaseClient | null | undefined): void {
  adminClient = client;
}
