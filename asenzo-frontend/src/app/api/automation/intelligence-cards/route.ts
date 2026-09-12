import { NextRequest, NextResponse } from 'next/server';
import { validateAutomationAuth } from '@/lib/automation/auth';
import { checkIdempotency, saveIdempotency } from '@/lib/automation/idempotency';
import { createErrorResponse, ErrorCodes } from '@/lib/automation/errors';
import { queryIntelligenceCards, insertIntelligenceCard, CanonicalIntelligenceCard } from '@/lib/automation/db';
import { dispatchAutomationEvent } from '@/lib/automation/events';

const VALID_OBSERVATION_TYPES = [
  'observed_fact',
  'inferred_psychology',
  'ai_hypothesis',
  'human_verified_insight'
];

export async function GET(req: NextRequest) {
  const auth = validateAutomationAuth(req);
  if (!auth.success) {
    return auth.response;
  }

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '50', 10);

  const cards = await queryIntelligenceCards(auth.context.workspaceId, limit);

  return NextResponse.json({
    success: true,
    data: cards,
    total: cards.length
  });
}

export async function POST(req: NextRequest) {
  const auth = validateAutomationAuth(req);
  if (!auth.success) {
    return auth.response;
  }

  // Idempotency check
  const idempotency = await checkIdempotency(req);
  if (idempotency.isDuplicate && idempotency.cachedResponse) {
    return idempotency.cachedResponse;
  }

  try {
    const body = await req.json();

    // Validation
    if (!body.source_type) {
      return createErrorResponse(ErrorCodes.MISSING_FIELD, 'source_type is required', 400);
    }
    if (!body.category) {
      return createErrorResponse(ErrorCodes.MISSING_FIELD, 'category is required', 400);
    }
    if (!body.signal_type) {
      return createErrorResponse(ErrorCodes.MISSING_FIELD, 'signal_type is required', 400);
    }
    if (!body.exact_language) {
      return createErrorResponse(ErrorCodes.MISSING_FIELD, 'exact_language is required', 400);
    }
    if (body.observation_type && !VALID_OBSERVATION_TYPES.includes(body.observation_type)) {
      return createErrorResponse(
        ErrorCodes.VALIDATION_FAILED,
        `observation_type must be one of: ${VALID_OBSERVATION_TYPES.join(', ')}`,
        400
      );
    }

    const cardPayload: CanonicalIntelligenceCard = {
      workspace_id: auth.context.workspaceId,
      source_type: body.source_type,
      source_id: body.source_id,
      source_url: body.source_url,
      recorded_at: body.recorded_at || new Date().toISOString(),
      category: body.category,
      stage: body.stage,
      signal_type: body.signal_type,
      exact_language: body.exact_language,
      context: body.context,
      emotion: body.emotion,
      desire: body.desire,
      fear: body.fear,
      frustration: body.frustration,
      belief: body.belief,
      motivation: body.motivation,
      objection: body.objection,
      aspiration: body.aspiration,
      decision_trigger: body.decision_trigger,
      awareness_level: body.awareness_level,
      ai_interpretation: body.ai_interpretation,
      observation_type: body.observation_type || 'observed_fact',
      confidence: typeof body.confidence === 'number' ? body.confidence : 0.8,
      human_verified: Boolean(body.human_verified),
      verified_by: body.verified_by,
      verified_at: body.verified_at,
      relevant_modules: body.relevant_modules || ['Acquisition'],
      metadata: body.metadata || {}
    };

    const createdCard = await insertIntelligenceCard(cardPayload);

    // Dispatch webhook event
    await dispatchAutomationEvent({
      event: 'intelligence.created',
      entity_type: 'intelligence_card',
      entity_id: createdCard.id!,
      workspace_id: auth.context.workspaceId,
      timestamp: new Date().toISOString(),
      data: createdCard
    });

    const responsePayload = {
      success: true,
      data: createdCard
    };

    // Cache idempotency response
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
