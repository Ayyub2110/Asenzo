import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { getAdminSupabaseClient } from '../src/lib/supabase/admin';

async function auditLiveDb() {
  console.log('--- SUPABASE LIVE DATABASE AUDIT ---');
  const supabase = getAdminSupabaseClient();
  if (!supabase) {
    console.error('FAIL: No Supabase admin client configured.');
    process.exit(1);
  }

  // 1. Check research_jobs schema
  const { data: jobRows, error: jobErr } = await supabase.from('research_jobs').select('*').limit(1);
  if (jobErr) {
    console.error('Error querying research_jobs:', jobErr);
  } else {
    const cols = jobRows && jobRows.length > 0 ? Object.keys(jobRows[0]) : [];
    console.log('Columns in public.research_jobs:', cols);
    const queueCols = ['attempt_count', 'max_retries', 'next_run_at', 'locked_by', 'locked_at', 'last_heartbeat_at', 'dead_lettered'];
    const missingQueueCols = queueCols.filter(c => !cols.includes(c));
    console.log('Dedicated queue columns status:', missingQueueCols.length === 0 ? 'ALL PRESENT' : `MISSING: ${missingQueueCols.join(', ')}`);
  }

  // 2. Check RPC claim_next_research_job
  const { data: rpcClaimData, error: rpcClaimErr } = await supabase.rpc('claim_next_research_job', {
    p_worker_id: 'audit-test-worker',
    p_workspace_id: null,
    p_stale_threshold_seconds: 300
  });
  if (rpcClaimErr) {
    console.log('claim_next_research_job RPC check: FAILED/NOT FOUND ->', {
      message: rpcClaimErr.message,
      code: rpcClaimErr.code,
      details: rpcClaimErr.details
    });
  } else {
    console.log('claim_next_research_job RPC check: EXISTS AND CALLABLE (returned:', rpcClaimData, ')');
  }

  // 3. Check RPC heartbeat_research_job
  const { data: rpcHbData, error: rpcHbErr } = await supabase.rpc('heartbeat_research_job', {
    p_job_id: '00000000-0000-0000-0000-000000000000',
    p_worker_id: 'audit-test-worker'
  });
  if (rpcHbErr) {
    console.log('heartbeat_research_job RPC check: FAILED/NOT FOUND ->', {
      message: rpcHbErr.message,
      code: rpcHbErr.code
    });
  } else {
    console.log('heartbeat_research_job RPC check: EXISTS AND CALLABLE (returned:', rpcHbData, ')');
  }

  // 4. Check RPC reschedule_research_job
  const { data: rpcReschedData, error: rpcReschedErr } = await supabase.rpc('reschedule_research_job', {
    p_job_id: '00000000-0000-0000-0000-000000000000',
    p_worker_id: 'audit-test-worker',
    p_error_message: 'audit test',
    p_delay_seconds: 5,
    p_is_dead_letter: false
  });
  if (rpcReschedErr) {
    console.log('reschedule_research_job RPC check: FAILED/NOT FOUND ->', {
      message: rpcReschedErr.message,
      code: rpcReschedErr.code
    });
  } else {
    console.log('reschedule_research_job RPC check: EXISTS AND CALLABLE (returned:', rpcReschedData, ')');
  }

  // 5. Check RPC complete_research_job
  const { data: rpcCompData, error: rpcCompErr } = await supabase.rpc('complete_research_job', {
    p_job_id: '00000000-0000-0000-0000-000000000000',
    p_worker_id: 'audit-test-worker',
    p_error: null
  });
  if (rpcCompErr) {
    console.log('complete_research_job RPC check: FAILED/NOT FOUND ->', {
      message: rpcCompErr.message,
      code: rpcCompErr.code
    });
  } else {
    console.log('complete_research_job RPC check: EXISTS AND CALLABLE (returned:', rpcCompData, ')');
  }

  process.exit(0);
}

auditLiveDb().catch(e => {
  console.error('Audit script fatal error:', e);
  process.exit(1);
});
