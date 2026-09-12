import { NextRequest, NextResponse } from 'next/server';
import { validateAutomationAuth } from '@/lib/automation/auth';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export async function GET(req: NextRequest) {
  const auth = validateAutomationAuth(req);
  if (!auth.success) {
    return auth.response;
  }

  return NextResponse.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    system: 'ASENZO Founder Growth Operating System',
    workspace_id: auth.context.workspaceId,
    supabase_connected: isSupabaseConfigured(),
    auth_status: {
      authenticated: auth.context.authenticated,
      token_source: auth.context.tokenSource
    },
    supported_modules: [
      'ACQUISITION',
      'CONVERSION',
      'REVENUE',
      'DELIVERY',
      'OPERATIONS'
    ]
  });
}
