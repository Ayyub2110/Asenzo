import { NextRequest, NextResponse } from 'next/server';
import { validateAutomationAuth } from '@/lib/automation/auth';
import { createErrorResponse, ErrorCodes } from '@/lib/automation/errors';
import { findResearchJob, insertResearchAssignment, CanonicalResearchAssignment } from '@/lib/automation/db';
import { resolveCanonicalWorkspaceId } from '@/lib/automation/workspace';

export async function POST(req: NextRequest) {
  const auth = await validateAutomationAuth(req);
  if (!auth.success) return auth.response;

  try {
    const body = await req.json();
    const required = ['research_job_id', 'assignment_type', 'topic'];
    const missing = required.find(field => typeof body[field] !== 'string' || !body[field].trim());
    if (missing) return createErrorResponse(ErrorCodes.MISSING_FIELD, `${missing} is required`, 400);
    if (body.status && !['queued', 'running', 'completed', 'failed', 'cancelled'].includes(body.status)) {
      return createErrorResponse(ErrorCodes.VALIDATION_FAILED, 'invalid assignment status', 400);
    }

    const workspaceId = await resolveCanonicalWorkspaceId(auth.context.workspaceId);
    const job = await findResearchJob(body.research_job_id);
    if (!job || job.workspace_id !== workspaceId) return createErrorResponse(ErrorCodes.NOT_FOUND, 'research job not found', 404);

    const assignment: CanonicalResearchAssignment = {
      workspace_id: workspaceId,
      research_job_id: job.id!,
      assignment_type: body.assignment_type,
      platform: body.platform,
      creator: body.creator,
      topic: body.topic,
      source_target: body.source_target,
      status: body.status || 'queued',
      attempt_count: 0
    };
    const created = await insertResearchAssignment(assignment);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid JSON or server error';
    return createErrorResponse(ErrorCodes.INVALID_INPUT, message, 400);
  }
}
