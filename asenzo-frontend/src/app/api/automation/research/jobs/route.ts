import { NextRequest, NextResponse } from 'next/server';
import { validateAutomationAuth } from '@/lib/automation/auth';
import { checkIdempotency, saveIdempotency } from '@/lib/automation/idempotency';
import { createErrorResponse, ErrorCodes } from '@/lib/automation/errors';
import { insertResearchJob, CanonicalResearchJob } from '@/lib/automation/db';
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

    if (!body.objective) {
      return createErrorResponse(ErrorCodes.MISSING_FIELD, 'objective is required', 400);
    }
    if (!body.topic) {
      return createErrorResponse(ErrorCodes.MISSING_FIELD, 'topic is required', 400);
    }

    const jobPayload: CanonicalResearchJob = {
      workspace_id: auth.context.workspaceId,
      objective: body.objective,
      topic: body.topic,
      question: body.question,
      platform: body.platform,
      audience: body.audience,
      status: body.status || 'queued',
      priority: body.priority || 'medium',
      assigned_worker: body.assigned_worker || 'ACQ-R01',
      parameters: body.parameters || {}
    };

    const createdJob = await insertResearchJob(jobPayload);

    // Notify n8n research worker
    await dispatchAutomationEvent({
      event: 'research.requested',
      entity_type: 'research_job',
      entity_id: createdJob.id!,
      workspace_id: auth.context.workspaceId,
      timestamp: new Date().toISOString(),
      requested_action: 'execute_research',
      data: createdJob
    });

    const responsePayload = {
      success: true,
      data: createdJob
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
