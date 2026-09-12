import { NextRequest, NextResponse } from 'next/server';
import { validateAutomationAuth } from '@/lib/automation/auth';
import { checkIdempotency, saveIdempotency } from '@/lib/automation/idempotency';
import { createErrorResponse, ErrorCodes } from '@/lib/automation/errors';
import { queryContentPerformance, insertContentPerformance, CanonicalContentPerformance } from '@/lib/automation/db';
import { dispatchAutomationEvent } from '@/lib/automation/events';

export async function GET(req: NextRequest) {
  const auth = validateAutomationAuth(req);
  if (!auth.success) {
    return auth.response;
  }

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '50', 10);

  const performance = await queryContentPerformance(auth.context.workspaceId, limit);

  return NextResponse.json({
    success: true,
    data: performance,
    total: performance.length
  });
}

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

    if (!body.content_id) {
      return createErrorResponse(ErrorCodes.MISSING_FIELD, 'content_id is required', 400);
    }
    if (!body.platform) {
      return createErrorResponse(ErrorCodes.MISSING_FIELD, 'platform is required', 400);
    }

    const perfPayload: CanonicalContentPerformance = {
      workspace_id: auth.context.workspaceId,
      content_id: body.content_id,
      platform: body.platform,
      published_at: body.published_at,
      views: typeof body.views === 'number' ? body.views : 0,
      reach: typeof body.reach === 'number' ? body.reach : 0,
      engagements: typeof body.engagements === 'number' ? body.engagements : 0,
      comments: typeof body.comments === 'number' ? body.comments : 0,
      shares: typeof body.shares === 'number' ? body.shares : 0,
      saves: typeof body.saves === 'number' ? body.saves : 0,
      clicks: typeof body.clicks === 'number' ? body.clicks : 0,
      ctr: typeof body.ctr === 'number' ? body.ctr : 0,
      leads: typeof body.leads === 'number' ? body.leads : 0,
      conversions: typeof body.conversions === 'number' ? body.conversions : 0,
      revenue_influenced: typeof body.revenue_influenced === 'number' ? body.revenue_influenced : 0,
      source_provenance: body.source_provenance,
      collected_at: body.collected_at || new Date().toISOString()
    };

    const createdPerf = await insertContentPerformance(perfPayload);

    // Notify learning / performance agents
    await dispatchAutomationEvent({
      event: 'content.performance.updated',
      entity_type: 'content_performance',
      entity_id: createdPerf.id!,
      workspace_id: auth.context.workspaceId,
      timestamp: new Date().toISOString(),
      requested_action: 'evaluate_learning',
      data: createdPerf
    });

    const responsePayload = {
      success: true,
      data: createdPerf
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
