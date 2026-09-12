import { NextRequest, NextResponse } from 'next/server';
import { validateAutomationAuth } from '@/lib/automation/auth';
import { checkIdempotency, saveIdempotency } from '@/lib/automation/idempotency';
import { createErrorResponse, ErrorCodes } from '@/lib/automation/errors';
import { insertContentIdea, CanonicalContentIdea } from '@/lib/automation/db';
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

    const ideaPayload: CanonicalContentIdea = {
      workspace_id: auth.context.workspaceId,
      topic: body.topic,
      angle: body.angle,
      audience: body.audience,
      platform: body.platform || 'LinkedIn',
      awareness: body.awareness,
      psychological_trigger: body.psychological_trigger,
      score: typeof body.score === 'number' ? body.score : 0,
      scoring_dimensions: body.scoring_dimensions || {},
      evidence: body.evidence || [],
      reasoning: body.reasoning,
      status: body.status || 'draft',
      metadata: body.metadata || {}
    };

    const createdIdea = await insertContentIdea(ideaPayload);

    // Dispatch event
    await dispatchAutomationEvent({
      event: 'content.idea.created',
      entity_type: 'content_idea',
      entity_id: createdIdea.id!,
      workspace_id: auth.context.workspaceId,
      timestamp: new Date().toISOString(),
      data: createdIdea
    });

    const responsePayload = {
      success: true,
      data: createdIdea
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
