import { NextRequest, NextResponse } from 'next/server';
import { validateAutomationAuth } from '@/lib/automation/auth';
import { findResearchJob } from '@/lib/automation/db';
import { createErrorResponse, ErrorCodes } from '@/lib/automation/errors';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = validateAutomationAuth(req);
  if (!auth.success) {
    return auth.response;
  }

  const { id } = await context.params;
  const job = await findResearchJob(id);

  if (!job) {
    return createErrorResponse(ErrorCodes.NOT_FOUND, `Research job with id '${id}' not found`, 404);
  }

  return NextResponse.json({
    success: true,
    data: job
  });
}
