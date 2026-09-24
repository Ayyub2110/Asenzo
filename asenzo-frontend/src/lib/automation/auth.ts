import { NextRequest } from 'next/server';
import { createErrorResponse, ErrorCodes } from './errors';
import { createClient } from '../supabase/server';
import { CANONICAL_DEFAULT_WORKSPACE_ID } from './workspace';

export interface AutomationAuthContext {
  workspaceId: string;
  authenticated: boolean;
  tokenSource: 'header_token' | 'bearer_token' | 'dev_fallback' | 'browser_session';
  userId?: string;
}

/**
 * Validates authentication for both callers:
 * 1. n8n / automation scripts via `x-automation-token` or `Authorization: Bearer <token>`
 * 2. ASENZO browser/frontend via authenticated Supabase session or same-origin browser session
 */
export async function validateAutomationAuth(
  req: NextRequest
): Promise<
  | { success: true; context: AutomationAuthContext }
  | { success: false; response: ReturnType<typeof createErrorResponse> }
> {
  const configuredKey = process.env.ASENZO_AUTOMATION_API_KEY || process.env.AUTOMATION_SECRET_KEY;

  const authHeader = req.headers.get('authorization');
  const customHeader = req.headers.get('x-automation-token');
  const workspaceHeader = req.headers.get('x-workspace-id');

  let providedToken: string | null = null;
  let tokenSource: AutomationAuthContext['tokenSource'] = 'header_token';

  if (customHeader) {
    providedToken = customHeader.trim();
    tokenSource = 'header_token';
  } else if (authHeader && authHeader.startsWith('Bearer ')) {
    providedToken = authHeader.substring(7).trim();
    tokenSource = 'bearer_token';
  }

  // 1. If an automation token is provided, validate machine-to-machine authentication
  if (providedToken) {
    if (!configuredKey) {
      const isDev = process.env.NODE_ENV !== 'production';
      if (isDev) {
        return {
          success: true,
          context: {
            workspaceId: workspaceHeader || CANONICAL_DEFAULT_WORKSPACE_ID,
            authenticated: true,
            tokenSource: 'dev_fallback'
          }
        };
      }

      return {
        success: false,
        response: createErrorResponse(
          ErrorCodes.UNAUTHORIZED,
          'Server automation API key is not configured.',
          401
        )
      };
    }

    if (providedToken !== configuredKey) {
      return {
        success: false,
        response: createErrorResponse(
          ErrorCodes.UNAUTHORIZED,
          'Invalid automation token.',
          401
        )
      };
    }

    return {
      success: true,
      context: {
        workspaceId: workspaceHeader || CANONICAL_DEFAULT_WORKSPACE_ID,
        authenticated: true,
        tokenSource
      }
    };
  }

  // 2. If NO automation token is provided, check for browser authentication
  // a) Check Supabase Auth session via cookies
  try {
    const supabase = await createClient();
    if (supabase) {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (!error && user) {
        return {
          success: true,
          context: {
            workspaceId: workspaceHeader || CANONICAL_DEFAULT_WORKSPACE_ID,
            authenticated: true,
            tokenSource: 'browser_session',
            userId: user.id
          }
        };
      }
    }
  } catch (err) {
    console.warn('[Automation Auth] Supabase session check notice:', err instanceof Error ? err.message : String(err));
  }

  // b) Check same-origin browser request from the ASENZO UI
  const secFetchSite = req.headers.get('sec-fetch-site');
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');
  const host = req.headers.get('host');

  const isSameOriginBrowser =
    secFetchSite === 'same-origin' ||
    (origin && host && origin.includes(host)) ||
    (referer && host && referer.includes(host));

  if (isSameOriginBrowser) {
    return {
      success: true,
      context: {
        workspaceId: workspaceHeader || CANONICAL_DEFAULT_WORKSPACE_ID,
        authenticated: true,
        tokenSource: 'browser_session'
      }
    };
  }

  // c) In development with no configured key, allow dev fallback
  if (!configuredKey && process.env.NODE_ENV !== 'production') {
    return {
      success: true,
      context: {
        workspaceId: workspaceHeader || CANONICAL_DEFAULT_WORKSPACE_ID,
        authenticated: true,
        tokenSource: 'dev_fallback'
      }
    };
  }

  // 3. Otherwise: reject unauthenticated external requests
  return {
    success: false,
    response: createErrorResponse(
      ErrorCodes.UNAUTHORIZED,
      'Missing authentication token. Provide x-automation-token or Authorization: Bearer header.',
      401
    )
  };
}

