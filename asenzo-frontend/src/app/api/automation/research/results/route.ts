import { NextRequest, NextResponse } from 'next/server';
import { validateAutomationAuth } from '@/lib/automation/auth';
import { checkIdempotency, saveIdempotency } from '@/lib/automation/idempotency';
import { createErrorResponse, ErrorCodes } from '@/lib/automation/errors';
import { insertResearchResult, CanonicalResearchResult } from '@/lib/automation/db';
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

    const resultPayload: CanonicalResearchResult = {
      workspace_id: auth.context.workspaceId,
      job_id: body.job_id,
      topic: body.topic,
      angle: body.angle,
      format: body.format,
      platform: body.platform,
      creator_source: body.creator_source,
      source_url: body.source_url,
      evidence: body.evidence || {},
      audience: body.audience,
      awareness: body.awareness,
      psychological_trigger: body.psychological_trigger,
      founder_similarity: typeof body.founder_similarity === 'number' ? body.founder_similarity : 0,
      competitor_similarity: typeof body.competitor_similarity === 'number' ? body.competitor_similarity : 0,
      dna_match: typeof body.dna_match === 'number' ? body.dna_match : 0,
      score: typeof body.score === 'number' ? body.score : 0,
      classification: body.classification || 'experimental',
      metadata: body.metadata || {}
    };

    const createdResult = await insertResearchResult(resultPayload);

    // Dispatch completion event
    await dispatchAutomationEvent({
      event: 'research.completed',
      entity_type: 'research_result',
      entity_id: createdResult.id!,
      workspace_id: auth.context.workspaceId,
      timestamp: new Date().toISOString(),
      data: createdResult
    });

    const responsePayload = {
      success: true,
      data: createdResult
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
