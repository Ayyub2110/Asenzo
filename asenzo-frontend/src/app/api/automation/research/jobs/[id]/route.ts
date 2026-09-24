import { NextRequest, NextResponse } from 'next/server';
import { validateAutomationAuth } from '@/lib/automation/auth';
import { findResearchJob, getResearchJobCounts } from '@/lib/automation/db';
import { createErrorResponse, ErrorCodes } from '@/lib/automation/errors';
import { resolveCanonicalWorkspaceId } from '@/lib/automation/workspace';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = validateAutomationAuth(req);
  if (!auth.success) {
    return auth.response;
  }

  const { id } = await context.params;
  const workspaceId = await resolveCanonicalWorkspaceId(auth.context.workspaceId);
  const job = await findResearchJob(id);

  if (!job || job.workspace_id !== workspaceId) {
    return createErrorResponse(ErrorCodes.NOT_FOUND, `Research job with id '${id}' not found`, 404);
  }

  const counts = await getResearchJobCounts(id, workspaceId);
  return NextResponse.json({
    success: true,
    data: { job, status: job.status, ...counts, timestamps: { created_at: job.created_at, started_at: job.started_at, completed_at: job.completed_at }, error: job.error || null }
  });
}
