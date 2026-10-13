import { NextRequest, NextResponse } from 'next/server';
import { validateAutomationAuth } from '@/lib/automation/auth';
import { getResearchOverview } from '@/lib/automation/db';
import { resolveCanonicalWorkspaceId } from '@/lib/automation/workspace';
import { createErrorResponse, ErrorCodes } from '@/lib/automation/errors';

export async function GET(req: NextRequest) {
  const auth = await validateAutomationAuth(req);
  if (!auth.success) {
    return auth.response;
  }

  try {
    const workspaceId = await resolveCanonicalWorkspaceId(auth.context.workspaceId);
    const overview = await getResearchOverview(workspaceId);
    return NextResponse.json({
      success: true,
      data: overview
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load research overview';
    return createErrorResponse(ErrorCodes.INTERNAL_ERROR, message, 500);
  }
}
