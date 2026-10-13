import { NextRequest, NextResponse } from 'next/server';
import { validateAutomationAuth } from '@/lib/automation/auth';
import { findResearchResultWithProvenance } from '@/lib/automation/db';
import { createErrorResponse, ErrorCodes } from '@/lib/automation/errors';
import { resolveCanonicalWorkspaceId } from '@/lib/automation/workspace';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await validateAutomationAuth(req);
  if (!auth.success) {
    return auth.response;
  }

  try {
    const { id } = await context.params;
    const workspaceId = await resolveCanonicalWorkspaceId(auth.context.workspaceId);

    const detailedResult = await findResearchResultWithProvenance(id, workspaceId);

    if (!detailedResult) {
      return createErrorResponse(ErrorCodes.NOT_FOUND, `Research result with id '${id}' not found`, 404);
    }

    return NextResponse.json({
      success: true,
      data: detailedResult
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Server error retrieving research result';
    return createErrorResponse(ErrorCodes.INTERNAL_ERROR, msg, 500);
  }
}
