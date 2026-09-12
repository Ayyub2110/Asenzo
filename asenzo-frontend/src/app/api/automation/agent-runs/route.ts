import { NextRequest, NextResponse } from 'next/server';
import { validateAutomationAuth } from '@/lib/automation/auth';
import { checkIdempotency, saveIdempotency } from '@/lib/automation/idempotency';
import { createErrorResponse, ErrorCodes } from '@/lib/automation/errors';
import { insertAgentRun, CanonicalAgentRun } from '@/lib/automation/db';

const VALID_STATUSES = ['queued', 'running', 'completed', 'failed', 'cancelled'];

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

    if (!body.agent_id) {
      return createErrorResponse(ErrorCodes.MISSING_FIELD, 'agent_id is required', 400);
    }
    if (!body.task) {
      return createErrorResponse(ErrorCodes.MISSING_FIELD, 'task is required', 400);
    }
    if (body.status && !VALID_STATUSES.includes(body.status)) {
      return createErrorResponse(
        ErrorCodes.VALIDATION_FAILED,
        `status must be one of: ${VALID_STATUSES.join(', ')}`,
        400
      );
    }

    const runPayload: CanonicalAgentRun = {
      workspace_id: auth.context.workspaceId,
      agent_id: body.agent_id,
      workflow_id: body.workflow_id,
      task: body.task,
      input_reference: body.input_reference,
      context_version: body.context_version,
      model: body.model,
      prompt_version: body.prompt_version,
      skill_version: body.skill_version,
      input_payload: body.input_payload || {},
      output_payload: body.output_payload || {},
      score: typeof body.score === 'number' ? body.score : undefined,
      evidence: body.evidence || [],
      status: body.status || 'completed',
      error: body.error,
      duration_ms: typeof body.duration_ms === 'number' ? body.duration_ms : undefined,
      human_decision: body.human_decision,
      final_result: body.final_result || {}
    };

    const createdRun = await insertAgentRun(runPayload);

    const responsePayload = {
      success: true,
      data: createdRun
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
