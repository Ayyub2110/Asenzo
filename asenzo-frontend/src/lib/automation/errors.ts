import { NextResponse } from 'next/server';

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown> | unknown[];
  };
}

export function createErrorResponse(
  code: string,
  message: string,
  status = 400,
  details?: Record<string, unknown> | unknown[]
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(details ? { details } : {})
      }
    },
    { status }
  );
}

export const ErrorCodes = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'RESOURCE_NOT_FOUND',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_FIELD: 'MISSING_REQUIRED_FIELD',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  DUPLICATE_RESOURCE: 'DUPLICATE_RESOURCE',
  INTERNAL_ERROR: 'INTERNAL_SERVER_ERROR',
  IDEMPOTENCY_CONFLICT: 'IDEMPOTENCY_CONFLICT'
} as const;
