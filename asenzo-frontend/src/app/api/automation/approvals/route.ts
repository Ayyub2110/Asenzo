import { NextRequest, NextResponse } from 'next/server';
import { validateAutomationAuth } from '@/lib/automation/auth';
import { checkIdempotency, saveIdempotency } from '@/lib/automation/idempotency';
import { createErrorResponse, ErrorCodes } from '@/lib/automation/errors';
import { insertApproval, CanonicalApproval } from '@/lib/automation/db';
import { dispatchAutomationEvent } from '@/lib/automation/events';

export async function POST(req: NextRequest) {
  const auth = validateAutomationAuth(req);
  if (!auth.success) {
    return auth.response;
  }

  const idempotency = await checkIdempotency(req);
  if (idempotency.isDuplicate && idempotency.cachedResponse) {
    return idempotency.cachedResponse;
  }

  try {
    const body = await req.json();

    if (!body.entity_type) {
      return createErrorResponse(ErrorCodes.MISSING_FIELD, 'entity_type is required', 400);
    }
    if (!body.entity_id) {
      return createErrorResponse(ErrorCodes.MISSING_FIELD, 'entity_id is required', 400);
    }
    if (!body.action) {
      return createErrorResponse(ErrorCodes.MISSING_FIELD, 'action is required', 400);
    }

    const approvalPayload: CanonicalApproval = {
      workspace_id: auth.context.workspaceId,
      entity_type: body.entity_type,
      entity_id: body.entity_id,
      action: body.action,
      status: body.status || 'pending',
      requested_by: body.requested_by || 'ACQ-C05',
      reviewer_id: body.reviewer_id,
      feedback: body.feedback,
      proposed_changes: body.proposed_changes || {},
      resolution_details: body.resolution_details || {}
    };

    const createdApproval = await insertApproval(approvalPayload);

    // Notify n8n or admin of new approval requirement
    await dispatchAutomationEvent({
      event: 'content.approval.requested',
      entity_type: body.entity_type,
      entity_id: body.entity_id,
      workspace_id: auth.context.workspaceId,
      timestamp: new Date().toISOString(),
      requested_action: body.action,
      data: createdApproval
    });

    const responsePayload = {
      success: true,
      data: createdApproval
    };

    if (idempotency.key) {
      await saveIdempotency(
        idempotency.key,
        201,
        responsePayload,
        req.nextUrl.pathname,
        auth.context.workspaceId
      );
    }

    return NextResponse.json(responsePayload, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Invalid JSON or server error';
    return createErrorResponse(ErrorCodes.INVALID_INPUT, msg, 400);
  }
}
