import { NextRequest } from 'next/server';
import { createErrorResponse, ErrorCodes } from './errors';

export interface AutomationAuthContext {
  workspaceId: string;
  authenticated: boolean;
  tokenSource: 'header_token' | 'bearer_token' | 'dev_fallback';
}

/**
 * Validates backend-to-n8n automation authentication.
 * Checks for `x-automation-token` or `Authorization: Bearer <token>`.
 */
export function validateAutomationAuth(
  req: NextRequest
): { success: true; context: AutomationAuthContext } | { success: false; response: ReturnType<typeof createErrorResponse> } {
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

  // If no configured key in environment (development/test sandbox), allow with a warning or development key
  if (!configuredKey) {
    const isDev = process.env.NODE_ENV !== 'production';
    if (isDev) {
      return {
        success: true,
        context: {
          workspaceId: workspaceHeader || 'default-workspace',
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

  if (!providedToken) {
    return {
      success: false,
      response: createErrorResponse(
        ErrorCodes.UNAUTHORIZED,
        'Missing authentication token. Provide x-automation-token or Authorization: Bearer header.',
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
      workspaceId: workspaceHeader || 'default-workspace',
      authenticated: true,
      tokenSource
    }
  };
}
