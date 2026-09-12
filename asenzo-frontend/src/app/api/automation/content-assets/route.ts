import { NextRequest, NextResponse } from 'next/server';
import { validateAutomationAuth } from '@/lib/automation/auth';
import { checkIdempotency, saveIdempotency } from '@/lib/automation/idempotency';
import { createErrorResponse, ErrorCodes } from '@/lib/automation/errors';
import { insertContentAsset, CanonicalContentAsset } from '@/lib/automation/db';
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

    if (!body.topic) {
      return createErrorResponse(ErrorCodes.MISSING_FIELD, 'topic is required', 400);
    }
    if (!body.script_body && !body.script) {
      return createErrorResponse(ErrorCodes.MISSING_FIELD, 'script_body is required', 400);
    }

    const assetPayload: CanonicalContentAsset = {
      workspace_id: auth.context.workspaceId,
      idea_id: body.idea_id,
      topic: body.topic,
      angle: body.angle,
      format: body.format || 'Post',
      platform: body.platform || 'LinkedIn',
      hook: body.hook,
      script_body: body.script_body || body.script,
      cta: body.cta,
      status: body.status || 'draft',
      version: typeof body.version === 'number' ? body.version : 1,
      evaluation: body.evaluation || {},
      approval_status: body.approval_status || 'pending',
      approved_by: body.approved_by,
      approved_at: body.approved_at,
      published_url: body.published_url,
      metadata: body.metadata || {}
    };

    const createdAsset = await insertContentAsset(assetPayload);

    // If review required or approval pending, dispatch event
    if (createdAsset.status === 'review_required' || createdAsset.approval_status === 'pending') {
      await dispatchAutomationEvent({
        event: 'content.approval.requested',
        entity_type: 'content_asset',
        entity_id: createdAsset.id!,
        workspace_id: auth.context.workspaceId,
        timestamp: new Date().toISOString(),
        requested_action: 'review_content',
        data: createdAsset
      });
    }

    const responsePayload = {
      success: true,
      data: createdAsset
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
