import { NextRequest, NextResponse } from 'next/server';
import { validateAutomationAuth } from '@/lib/automation/auth';
import { checkIdempotency, saveIdempotency } from '@/lib/automation/idempotency';
import { createErrorResponse, ErrorCodes } from '@/lib/automation/errors';
import { insertAudienceDna, fetchLatestAudienceDna, AudienceDnaPayload } from '@/lib/automation/db';
import { dispatchAutomationEvent } from '@/lib/automation/events';

export async function GET(req: NextRequest) {
  const auth = await validateAutomationAuth(req);
  if (!auth.success) {
    return auth.response;
  }

  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspace_id') || auth.context.workspaceId;

    const dna = await fetchLatestAudienceDna(workspaceId);

    if (!dna) {
      return createErrorResponse(ErrorCodes.NOT_FOUND, 'No Audience DNA found for workspace', 404);
    }

    return NextResponse.json({
      success: true,
      data: dna
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal server error';
    return createErrorResponse(ErrorCodes.INTERNAL_ERROR, msg, 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = await validateAutomationAuth(req);
  if (!auth.success) {
    return auth.response;
  }

  // Idempotency check
  const idempotency = await checkIdempotency(req);
  if (idempotency.isDuplicate && idempotency.cachedResponse) {
    return idempotency.cachedResponse;
  }

  try {
    const body: AudienceDnaPayload = await req.json();

    // 1. Validate workspace_id
    if (!body.workspace_id || typeof body.workspace_id !== 'string' || !body.workspace_id.trim()) {
      return createErrorResponse(ErrorCodes.MISSING_FIELD, 'workspace_id is required', 400);
    }

    // 2. Validate audience_dna
    if (!body.audience_dna) {
      return createErrorResponse(ErrorCodes.MISSING_FIELD, 'audience_dna is required', 400);
    }
    if (typeof body.audience_dna !== 'object' || body.audience_dna === null || Array.isArray(body.audience_dna)) {
      return createErrorResponse(ErrorCodes.VALIDATION_FAILED, 'audience_dna must be an object', 400);
    }

    // 3. Validate category/type values if provided
    if (body.category && body.category.toUpperCase() !== 'AUDIENCE') {
      return createErrorResponse(ErrorCodes.VALIDATION_FAILED, 'category must be AUDIENCE', 400);
    }
    if (body.dna_type && body.dna_type.toUpperCase() !== 'AUDIENCE') {
      return createErrorResponse(ErrorCodes.VALIDATION_FAILED, 'dna_type must be AUDIENCE', 400);
    }

    // 4. Validate all categories inside audience_dna are arrays of strings
    for (const [key, value] of Object.entries(body.audience_dna)) {
      if (!Array.isArray(value)) {
        return createErrorResponse(
          ErrorCodes.VALIDATION_FAILED,
          `audience_dna.${key} must be an array`,
          400
        );
      }
      for (let i = 0; i < value.length; i++) {
        if (typeof value[i] !== 'string') {
          return createErrorResponse(
            ErrorCodes.VALIDATION_FAILED,
            `All items in audience_dna.${key} must be strings`,
            400
          );
        }
      }
    }

    // 5. Validate evidence is array if provided
    if (body.evidence !== undefined && !Array.isArray(body.evidence)) {
      return createErrorResponse(ErrorCodes.VALIDATION_FAILED, 'evidence must be an array', 400);
    }

    // 6. Persist to database
    const savedDna = await insertAudienceDna(body);

    // 7. Dispatch automation event
    await dispatchAutomationEvent({
      event: 'audience.dna.created',
      entity_type: 'audience_dna',
      entity_id: savedDna.id || 'adna_latest',
      workspace_id: body.workspace_id,
      timestamp: new Date().toISOString(),
      data: savedDna
    });

    const responsePayload = {
      success: true,
      data: savedDna
    };

    // 8. Cache idempotency response if key was supplied
    if (idempotency.key) {
      await saveIdempotency(
        idempotency.key,
        201,
        responsePayload,
        req.nextUrl.pathname,
        body.workspace_id
      );
    }

    return NextResponse.json(responsePayload, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Invalid JSON or internal server error';
    if (
      msg.includes('Database error') ||
      msg.includes('Database client unavailable') ||
      msg.includes('Supabase') ||
      msg.includes('credentials')
    ) {
      return createErrorResponse(ErrorCodes.INTERNAL_ERROR, msg, 500);
    }
    return createErrorResponse(ErrorCodes.INVALID_INPUT, msg, 400);
  }
}
