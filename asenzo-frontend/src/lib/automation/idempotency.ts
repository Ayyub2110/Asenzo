import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '../supabase/admin';

interface CachedResponse {
  statusCode: number;
  body: unknown;
  createdAt: string;
}

// In-memory fallback cache
const memoryIdempotencyStore = new Map<string, CachedResponse>();

/**
 * Checks if an Idempotency-Key has already been processed.
 */
export async function checkIdempotency(
  req: NextRequest
): Promise<{ isDuplicate: boolean; cachedResponse?: NextResponse; key?: string }> {
  const key = req.headers.get('idempotency-key')?.trim();
  if (!key) {
    return { isDuplicate: false };
  }

  // 1. Check in-memory first
  if (memoryIdempotencyStore.has(key)) {
    const cached = memoryIdempotencyStore.get(key)!;
    return {
      isDuplicate: true,
      cachedResponse: NextResponse.json(cached.body, { status: cached.statusCode }),
      key
    };
  }

  // 2. Check Supabase
  const supabase = getAdminSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('idempotency_records')
        .select('*')
        .eq('idempotency_key', key)
        .single();

      if (!error && data) {
        // Cache in memory
        memoryIdempotencyStore.set(key, {
          statusCode: data.response_code,
          body: data.response_body,
          createdAt: data.created_at
        });

        return {
          isDuplicate: true,
          cachedResponse: NextResponse.json(data.response_body, { status: data.response_code }),
          key
        };
      }
    } catch {
      // Supabase table may not exist yet in dev; fallback cleanly
    }
  }

  return { isDuplicate: false, key };
}

/**
 * Persists an Idempotency-Key and its response payload.
 */
export async function saveIdempotency(
  key: string | undefined,
  statusCode: number,
  body: unknown,
  requestPath: string,
  workspaceId?: string
): Promise<void> {
  if (!key) return;

  // Save to memory cache
  memoryIdempotencyStore.set(key, {
    statusCode,
    body,
    createdAt: new Date().toISOString()
  });

  // Save to Supabase
  const supabase = getAdminSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('idempotency_records').upsert({
        idempotency_key: key,
        workspace_id: workspaceId || null,
        request_path: requestPath,
        response_code: statusCode,
        response_body: body,
        created_at: new Date().toISOString()
      });
    } catch {
      // Silent catch for resilience
    }
  }
}
