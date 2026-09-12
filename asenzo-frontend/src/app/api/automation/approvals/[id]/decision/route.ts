import { NextRequest, NextResponse } from 'next/server';
import { validateAutomationAuth } from '@/lib/automation/auth';
import { checkIdempotency, saveIdempotency } from '@/lib/automation/idempotency';
import { createErrorResponse, ErrorCodes } from '@/lib/automation/errors';
import { resolveApprovalDecision } from '@/lib/automation/db';
import { dispatchAutomationEvent } from '@/lib/automation/events';

const VALID_DECISIONS = ['approved', 'rejected', 'edited', 'cancelled'];

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = validateAutomationAuth(req);
  if (!auth.success) {
    return auth.response;
  }

  const idempotency = await checkIdempotency(req);
  if (idempotency.isDuplicate && idempotency.cachedResponse) {
    return idempotency.cachedResponse;
  }

  try {
    const { id } = await context.params;
    const body = await req.json();

    if (!body.decision || !VALID_DECISIONS.includes(body.decision)) {
      return createErrorResponse(
        ErrorCodes.VALIDATION_FAILED,
        `decision must be one of: ${VALID_DECISIONS.join(', ')}`,
        400
      );
    }

    const updatedApproval = await resolveApprovalDecision(
      id,
      body.decision,
      body.reviewer_id || body.reviewer,
      body.feedback,
      body.resolution_details
    );

    if (!updatedApproval) {
      return createErrorResponse(ErrorCodes.NOT_FOUND, `Approval with id '${id}' not found`, 404);
    }

    // If decision is approved, notify n8n to resume pipeline (e.g., publish, execute outbound)
    if (body.decision === 'approved') {
      await dispatchAutomationEvent({
        event: 'content.approved',
        entity_type: updatedApproval.entity_type,
        entity_id: updatedApproval.entity_id,
        workspace_id: auth.context.workspaceId,
        timestamp: new Date().toISOString(),
        requested_action: updatedApproval.action,
        data: updatedApproval
      });
    }

    const responsePayload = {
      success: true,
      data: updatedApproval
    };

    if (idempotency.key) {
      await saveIdempotency(
        idempotency.key,
        200,
        responsePayload,
        req.nextUrl.pathname,
        auth.context.workspaceId
      );
    }

    return NextResponse.json(responsePayload);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Invalid JSON or server error';
    return createErrorResponse(ErrorCodes.INVALID_INPUT, msg, 400);
  }
}
