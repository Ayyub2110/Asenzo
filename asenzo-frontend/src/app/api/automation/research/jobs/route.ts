import { NextRequest, NextResponse } from 'next/server';
import { validateAutomationAuth } from '@/lib/automation/auth';
import { checkIdempotency, saveIdempotency } from '@/lib/automation/idempotency';
import { createErrorResponse, ErrorCodes } from '@/lib/automation/errors';
import { insertResearchJob, queryResearchJobs, CanonicalResearchJob } from '@/lib/automation/db';
import { resolveCanonicalWorkspaceId } from '@/lib/automation/workspace';
import {
  dispatchResearchJobExecution,
  provisionJobAssignments
} from '@/lib/automation/processor';

const PLATFORMS = ['Instagram', 'YouTube', 'TikTok', 'LinkedIn', 'X', 'Reddit', 'Substack'];
const FUNNEL_STAGES = ['TOF', 'MOF', 'BOF', 'RETENTION'];
const DATE_RANGES = ['last_7_days', 'last_30_days', 'last_90_days'];

function isValidHandle(value: unknown): value is string {
  return typeof value === 'string' && /^@?[A-Za-z0-9._-]+$/.test(value.trim());
}

function isValidSourceTarget(value: unknown): value is string {
  if (typeof value !== 'string' || !value.trim()) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function isCreatorArray(value: unknown): value is Array<{ handle?: string; source_target?: string }> {
  return Array.isArray(value) && value.every(item => {
    if (typeof item !== 'object' || item === null || Array.isArray(item)) return false;
    const creator = item as { handle?: unknown; source_target?: unknown };
    return isValidHandle(creator.handle) || isValidSourceTarget(creator.source_target);
  });
}

function isSourceArray(value: unknown): value is Array<{ type: string; target: string }> {
  return Array.isArray(value) && value.every(item => (
    typeof item === 'object' && item !== null &&
    typeof (item as { type?: unknown }).type === 'string' &&
    typeof (item as { target?: unknown }).target === 'string'
  ));
}

export async function GET(req: NextRequest) {
  const auth = await validateAutomationAuth(req);
  if (!auth.success) {
    return auth.response;
  }

  try {
    const workspaceId = await resolveCanonicalWorkspaceId(auth.context.workspaceId);
    const { searchParams } = new URL(req.url);

    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;
    const platform = searchParams.get('platform') || undefined;
    const funnelStage = searchParams.get('funnel_stage') || undefined;
    const contentPillar = searchParams.get('content_pillar') || undefined;
    const limit = searchParams.has('limit') ? parseInt(searchParams.get('limit')!, 10) : 20;
    const offset = searchParams.has('offset') ? parseInt(searchParams.get('offset')!, 10) : 0;

    const result = await queryResearchJobs(workspaceId, {
      search,
      status,
      platform,
      funnel_stage: funnelStage,
      content_pillar: contentPillar,
      limit,
      offset
    });

    return NextResponse.json({
      success: true,
      data: {
        jobs: result.jobs,
        total: result.total,
        limit,
        offset
      }
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Server error querying research jobs';
    return createErrorResponse(ErrorCodes.INTERNAL_ERROR, msg, 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = await validateAutomationAuth(req);
  if (!auth.success) {
    return auth.response;
  }

  if (!req.headers.get('idempotency-key')?.trim()) {
    return createErrorResponse(ErrorCodes.MISSING_FIELD, 'Idempotency-Key header is required', 400);
  }

  const idempotency = await checkIdempotency(req);
  if (idempotency.isDuplicate && idempotency.cachedResponse) {
    return idempotency.cachedResponse;
  }

  try {
    const body = await req.json();

    if (typeof body.objective !== 'string' || !body.objective.trim()) {
      return createErrorResponse(ErrorCodes.MISSING_FIELD, 'objective is required', 400);
    }
    if (typeof body.topic !== 'string' || !body.topic.trim()) {
      return createErrorResponse(ErrorCodes.MISSING_FIELD, 'topic is required', 400);
    }
    if (body.platform && !PLATFORMS.includes(body.platform)) return createErrorResponse(ErrorCodes.VALIDATION_FAILED, 'invalid platform', 400);
    if (body.funnel_stage && !FUNNEL_STAGES.includes(body.funnel_stage)) return createErrorResponse(ErrorCodes.VALIDATION_FAILED, 'invalid funnel_stage', 400);
    if (body.date_range && !DATE_RANGES.includes(body.date_range)) return createErrorResponse(ErrorCodes.VALIDATION_FAILED, 'invalid date_range', 400);
    if (body.creators !== undefined && !isCreatorArray(body.creators)) {
      return createErrorResponse(
        ErrorCodes.VALIDATION_FAILED,
        'creator research requires each creator to include a verified handle or explicit source URL in source_target',
        400
      );
    }
    if (body.sources !== undefined && !isSourceArray(body.sources)) return createErrorResponse(ErrorCodes.VALIDATION_FAILED, 'sources must contain type and target', 400);
    if (body.priority && !['low', 'normal', 'high', 'urgent'].includes(body.priority)) return createErrorResponse(ErrorCodes.VALIDATION_FAILED, 'invalid priority', 400);

    const workspaceId = await resolveCanonicalWorkspaceId(auth.context.workspaceId);

    const jobPayload: CanonicalResearchJob = {
      workspace_id: workspaceId,
      objective: body.objective,
      topic: body.topic,
      platform: body.platform,
      funnel_stage: body.funnel_stage,
      content_pillar: body.content_pillar,
      date_range: body.date_range,
      keyword_topic: body.keyword_topic,
      creators: body.creators || [],
      sources: body.sources || [],
      idempotency_key: idempotency.key,
      priority: body.priority || 'normal',
      status: 'queued'
    };

    const createdJob = await insertResearchJob(jobPayload);

    // 2. Provision or derive assignments using established native processor logic
    const assignments = await provisionJobAssignments(createdJob);

    // 3. Initiate research execution through reusable server-side service
    const executionMode = body.execution_mode === 'sync' ? 'sync' : 'async';
    const dispatchResult = await dispatchResearchJobExecution(createdJob, {
      mode: executionMode
    });

    if (dispatchResult.engine === 'n8n' && !dispatchResult.initiated) {
      console.error(
        `[Research Job] Safe warning: n8n research webhook delivery failed for job ${createdJob.id}: ${dispatchResult.error || 'Unknown error'}`
      );
    }

    const responsePayload = {
      success: true,
      data: {
        ...createdJob,
        assignment_count: assignments.length
      },
      execution: dispatchResult
    };

    if (idempotency.key) {
      await saveIdempotency(
        idempotency.key,
        201,
        responsePayload,
        req.nextUrl.pathname,
        workspaceId
      );
    }

    return NextResponse.json(responsePayload, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Invalid JSON or server error';
    if (
      msg.includes('Database error') ||
      msg.includes('Database client unavailable') ||
      msg.includes('Supabase') ||
      msg.includes('credentials')
    ) {
      return createErrorResponse(ErrorCodes.INTERNAL_ERROR, msg, 500);
    }
    return createErrorResponse(ErrorCodes.INVALID_INPUT, msg, 400);
  }
}
