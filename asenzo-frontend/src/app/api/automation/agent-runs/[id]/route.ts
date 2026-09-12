import { NextRequest, NextResponse } from 'next/server';
import { validateAutomationAuth } from '@/lib/automation/auth';
import { findAgentRun } from '@/lib/automation/db';
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
  const run = await findAgentRun(id);

  if (!run) {
    return createErrorResponse(ErrorCodes.NOT_FOUND, `Agent run with id '${id}' not found`, 404);
  }

  return NextResponse.json({
    success: true,
    data: run
  });
}
