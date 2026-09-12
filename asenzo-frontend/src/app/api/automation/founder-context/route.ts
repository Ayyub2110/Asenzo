import { NextRequest, NextResponse } from 'next/server';
import { validateAutomationAuth } from '@/lib/automation/auth';
import { fetchFounderContext } from '@/lib/automation/db';

export async function GET(req: NextRequest) {
  const auth = validateAutomationAuth(req);
  if (!auth.success) {
    return auth.response;
  }

  const context = await fetchFounderContext(auth.context.workspaceId);

  return NextResponse.json({
    success: true,
    data: context
  });
}
