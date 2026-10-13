import { NextRequest, NextResponse } from 'next/server';
import { validateAutomationAuth } from '@/lib/automation/auth';
import { createErrorResponse, ErrorCodes } from '@/lib/automation/errors';
import { resolveCanonicalWorkspaceId } from '@/lib/automation/workspace';
import { findResearchJob } from '@/lib/automation/db';
import {
  dispatchResearchJobExecution,
  PermanentProcessorError
} from '@/lib/automation/processor';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await validateAutomationAuth(req);
  if (!auth.success) {
    return auth.response;
  }

  try {
    const { id } = await params;
    if (!id || !id.trim()) {
      return createErrorResponse(ErrorCodes.MISSING_FIELD, 'job id parameter is required', 400);
    }

    const workspaceId = await resolveCanonicalWorkspaceId(auth.context.workspaceId);

    // Verify job exists and belongs to workspace
    const job = await findResearchJob(id);
    if (!job || job.workspace_id !== workspaceId) {
      return createErrorResponse(ErrorCodes.NOT_FOUND, `Research job "${id}" not found`, 404);
    }

    let body: Record<string, unknown> = {};
    try {
      body = await req.json();
    } catch {
      // Defaults will be used if body is empty or not JSON
    }

    const force = Boolean(body.force);
    const mode = body.mode === 'async' ? 'async' : 'sync';
    const rawConcurrency = typeof body.concurrency === 'number' ? body.concurrency : 2;
    const rawMaxRetries = typeof body.max_retries === 'number' ? body.max_retries : 2;
    const rawTimeoutMs = typeof body.timeout_ms === 'number' ? body.timeout_ms : 15000;

    const dispatchResult = await dispatchResearchJobExecution(job, {
      mode,
      concurrency: rawConcurrency,
      maxRetries: rawMaxRetries,
      timeoutMs: rawTimeoutMs,
      force,
      engineOverride: 'native'
    });

    if (dispatchResult.already_completed) {
      return NextResponse.json({
        success: true,
        message: 'Job is already completed',
        data: {
          job_id: id,
          status: 'completed',
          already_completed: true
        }
      });
    }

    if (dispatchResult.duplicate_trigger) {
      return NextResponse.json(
        {
          success: true,
          message: 'Research job is already executing in background',
          data: {
            job_id: id,
            status: 'running',
            duplicate_trigger: true,
            execution_mode: 'in_process_background',
            durability: 'in_process_ephemeral'
          }
        },
        { status: 200 }
      );
    }

    if (mode === 'async') {
      return NextResponse.json(
        {
          success: true,
          message: 'Research job execution initiated in server background',
          data: {
            job_id: id,
            status: 'in_progress',
            mode: 'async',
            execution_mode: 'in_process_background',
            durability: 'in_process_ephemeral',
            notice: 'Executing in active Node.js server process. Durable background execution across process restarts or serverless environments requires an external worker queue.'
          }
        },
        { status: 202 }
      );
    }

    return NextResponse.json({
      success: true,
      data: dispatchResult.summary
    });
  } catch (err: unknown) {
    if (err instanceof PermanentProcessorError && err.statusCode) {
      return createErrorResponse(ErrorCodes.VALIDATION_FAILED, err.message, err.statusCode);
    }

    const msg = err instanceof Error ? err.message : 'Server error processing research job';
    return createErrorResponse(ErrorCodes.INTERNAL_ERROR, msg, 500);
  }
}
