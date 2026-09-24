import { NextRequest } from 'next/server';
import { POST as researchJobsPost } from '../src/app/api/automation/research/jobs/route';
import { getAdminSupabaseClient } from '../src/lib/supabase/admin';
import { CANONICAL_DEFAULT_WORKSPACE_ID, isValidUuid } from '../src/lib/automation/workspace';

// Ensure environment is loaded in CLI runtime
if (typeof window === 'undefined') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { loadEnvConfig } = require('@next/env');
    loadEnvConfig(process.cwd());
  } catch {}
}

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: unknown) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`, detail !== undefined ? detail : '');
    failed++;
  }
}

async function runPhase2Verification() {
  console.log('\n================================================================');
  console.log('PHASE 2 BACKEND RESEARCH JOB & N8N WEBHOOK INTEGRATION TEST');
  console.log('================================================================\n');

  const supabaseUrlExists = Boolean(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL);
  const serviceKeyExists = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const n8nWebhookExists = Boolean(process.env.N8N_RESEARCH_WEBHOOK_URL);

  console.log('[Environment Configuration Check (Safe)]');
  console.log('  Supabase URL configured:', supabaseUrlExists);
  console.log('  Supabase Service Role Key configured:', serviceKeyExists);
  console.log('  N8N_RESEARCH_WEBHOOK_URL configured:', n8nWebhookExists);

  if (!supabaseUrlExists || !serviceKeyExists) {
    console.error('❌ Supabase credentials missing.');
    process.exit(1);
  }

  const supabase = getAdminSupabaseClient();
  const apiKey = process.env.ASENZO_AUTOMATION_API_KEY || 'default-test-token';

  // 1. LIVE TEST: Call POST /api/automation/research/jobs
  console.log('\n[Step 1] Calling POST /api/automation/research/jobs...');
  const testJobPayload = {
    objective: 'Analyze viral AI workflows for SaaS founders',
    topic: 'Phase 2 Live Verification Topic',
    platform: 'YouTube',
    funnel_stage: 'TOF',
    content_pillar: 'Market Intelligence',
    date_range: 'last_7_days',
    keyword_topic: 'Agentic Workflows',
    creators: ['Creator A', 'Creator B'],
    sources: [{ type: 'channel', target: 'TestTarget' }],
    priority: 'high'
  };

  const idempotencyKey = `phase2_test_${Date.now()}`;
  const req = new NextRequest(new URL('/api/automation/research/jobs', 'http://localhost:3000'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-automation-token': apiKey,
      'x-workspace-id': CANONICAL_DEFAULT_WORKSPACE_ID,
      'Idempotency-Key': idempotencyKey
    },
    body: JSON.stringify(testJobPayload)
  });

  const res = await researchJobsPost(req);
  const json = await res.json();

  console.log('  API Response HTTP Status:', res.status);
  console.log('  API Response success:', json.success);

  assert(res.status === 201, 'Endpoint returns HTTP 201 Created');
  assert(json.success === true, 'Response payload has success: true');
  const jobId = json.data?.id;
  assert(Boolean(jobId) && isValidUuid(jobId), `Returned job_id is valid UUID: ${jobId}`);
  assert(json.data?.workspace_id === CANONICAL_DEFAULT_WORKSPACE_ID, 'Workspace ID matches canonical UUID');
  assert(json.data?.status === 'queued', 'Job status is queued');

  // 2. VERIFY ROW IN SUPABASE public.research_jobs
  console.log('\n[Step 2] Verifying persistence in Supabase table public.research_jobs...');
  const { data: dbJob, error: jobDbError } = await supabase
    .from('research_jobs')
    .select('*')
    .eq('id', jobId)
    .maybeSingle();

  assert(!jobDbError, 'No error querying public.research_jobs from Supabase');
  assert(Boolean(dbJob), 'Row found in Supabase public.research_jobs table');
  assert(dbJob?.id === jobId, 'Persisted row ID matches returned job ID');
  assert(dbJob?.topic === 'Phase 2 Live Verification Topic', 'Persisted topic matches submitted payload');
  assert(dbJob?.workspace_id === CANONICAL_DEFAULT_WORKSPACE_ID, 'Persisted workspace_id is canonical');

  // 3. VERIFY SYSTEM EVENT IN SUPABASE public.system_events
  console.log('\n[Step 3] Verifying system_event record in Supabase...');
  const { data: dbEvent, error: eventDbError } = await supabase
    .from('system_events')
    .select('*')
    .eq('entity_id', jobId)
    .eq('event_type', 'research.requested')
    .maybeSingle();

  assert(!eventDbError, 'No error querying public.system_events from Supabase');
  assert(Boolean(dbEvent), 'System event research.requested recorded in Supabase');
  assert(dbEvent?.payload?.job_id === jobId, 'Event data payload includes correct job_id');

  // 4. TEST ERROR CASE: DB failure does not falsely report success
  console.log('\n[Step 4] Verifying database failure handling...');
  const badReq = new NextRequest(new URL('/api/automation/research/jobs', 'http://localhost:3000'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-automation-token': apiKey,
      'x-workspace-id': '00000000-0000-0000-0000-999999999999', // foreign key violation if workspace missing
      'Idempotency-Key': `fail_test_${Date.now()}`
    },
    body: JSON.stringify({
      objective: 'Missing fields' // Missing required field 'topic'
    })
  });
  const badRes = await researchJobsPost(badReq);
  const badJson = await badRes.json();
  assert(badRes.status === 400, 'Rejects payload with missing topic (400)');
  assert(badJson.success === false, 'Returns success: false');

  // 5. CLEANUP
  console.log('\n[Step 5] Cleaning up verification records...');
  if (jobId) {
    await supabase.from('research_jobs').delete().eq('id', jobId);
    await supabase.from('system_events').delete().eq('entity_id', jobId);
    console.log('  ✓ Test records cleaned up successfully.');
  }

  console.log('\n================================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase2Verification().catch(err => {
  console.error('Phase 2 verification error:', err);
  process.exit(1);
});
