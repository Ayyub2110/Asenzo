import { NextRequest, NextResponse } from 'next/server';
import { validateAutomationAuth } from '@/lib/automation/auth';
import { findApproval } from '@/lib/automation/db';
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
  const approval = await findApproval(id);

  if (!approval) {
    return createErrorResponse(ErrorCodes.NOT_FOUND, `Approval with id '${id}' not found`, 404);
  }

  return NextResponse.json({
    success: true,
    data: approval
  });
}
