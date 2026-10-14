import { NextRequest } from 'next/server';
import { POST as researchJobsPost, GET as researchJobsGet } from '../src/app/api/automation/research/jobs/route';
import { GET as researchAssignmentsGet } from '../src/app/api/automation/research/assignments/route';
import { GET as researchResultsGet } from '../src/app/api/automation/research/results/route';
import { GET as researchOverviewGet } from '../src/app/api/automation/research/overview/route';
import { getAdminSupabaseClient } from '../src/lib/supabase/admin';
import {
  CANONICAL_DEFAULT_WORKSPACE_ID,
  isValidUuid
} from '../src/lib/automation/workspace';
import {
  findResearchJob,
  findResearchAssignmentsByJob,
  insertResearchJob,
  createDefaultAssignmentsForJob
} from '../src/lib/automation/db';
import {
  processResearchJob,
  dispatchResearchJobExecution,
  getResearchDispatchEngine
} from '../src/lib/automation/processor';

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

const API_KEY = process.env.ASENZO_AUTOMATION_API_KEY || 'default-test-token';

function createReq(
  urlPath: string,
  method = 'GET',
  body?: unknown,
  headers: Record<string, string> = {}
) {
  const url = new URL(urlPath, 'http://localhost:3000');
  const reqHeaders: Record<string, string> = {
    'x-automation-token': API_KEY,
    'x-workspace-id': CANONICAL_DEFAULT_WORKSPACE_ID,
    'Content-Type': 'application/json',
    ...headers
  };

  return new NextRequest(url, {
    method,
    headers: reqHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });
}

async function runNativeDispatchVerification() {
  console.log('\n================================================================');
  console.log('ASENZO OS — STEP 5: NATIVE RESEARCH DISPATCH CUTOVER TEST SUITE');
  console.log('================================================================\n');

  const supabase = getAdminSupabaseClient();
  if (!supabase) {
    console.error('❌ Supabase admin client is required for test execution.');
    process.exit(1);
  }

  // [Suite 1] Normal Job Creation with Native Execution by Default
  console.log('[Suite 1] Default Job Creation with Native Execution');
  let defaultJobId = '';
  {
    const payload = {
      objective: 'Analyze viral hook structures for SaaS founders',
      topic: 'SaaS Viral Hooks Cutover Test',
      platform: 'Instagram',
      funnel_stage: 'TOF',
      content_pillar: 'Client Acquisition',
      date_range: 'last_7_days',
      creators: [
        { handle: 'hubermanlab', source_target: 'https://www.instagram.com/hubermanlab/' }
      ],
      priority: 'high'
    };

    const req = createReq('/api/automation/research/jobs', 'POST', payload, {
      'Idempotency-Key': `cutover_suite1_${Date.now()}`
    });

    const res = await researchJobsPost(req);
    const json = await res.json();

    assert(res.status === 201, 'POST /jobs returns HTTP 201 Created');
    assert(json.success === true, 'Response payload has success: true');
    defaultJobId = json.data?.id;
    assert(Boolean(defaultJobId) && isValidUuid(defaultJobId), `Returns valid created job UUID: ${defaultJobId}`);
    assert(json.data?.status === 'queued', 'Initial returned job status is queued');
    assert(json.data?.assignment_count === 1, 'Response immediately attaches assignment_count: 1');

    // Execution acknowledgment
    assert(Boolean(json.execution), 'Response includes execution metadata');
    assert(json.execution?.engine === 'native', 'Default execution engine is native');
    assert(json.execution?.status === 'queued', 'Execution status is queued');
    assert(json.execution?.mode === 'async', 'Default mode is async');
    assert(json.execution?.execution_mode === 'durable_worker_queue', 'Accurately acknowledges durable_worker_queue');
    assert(json.execution?.durability === 'postgres_persisted', 'Accurately declares postgres_persisted durability');
    assert(typeof json.execution?.notice === 'string', 'Includes explicit queue notice for serverless / durable execution');

    // Verify row in DB
    const dbJob = await findResearchJob(defaultJobId);
    assert(Boolean(dbJob), 'Research job row found in database');
    assert(dbJob?.topic === payload.topic, 'Database row has correct topic');

    // Verify assignments provisioned in DB
    const assignments = await findResearchAssignmentsByJob(defaultJobId, CANONICAL_DEFAULT_WORKSPACE_ID);
    assert(assignments.length === 1, 'Assignments provisioned immediately in database');
    assert(assignments[0].assignment_type === 'creator_research', 'Provisioned assignment type is creator_research');
    assert(assignments[0].creator === 'hubermanlab', 'Provisioned assignment creator matches payload');
  }

  // [Suite 2] Ensuring n8n Webhook is NOT Called during Native Execution
  console.log('\n[Suite 2] Ensuring n8n Webhook is NOT Dispatched for Native Jobs');
  {
    // Check system_events table: research.requested is recorded for telemetry, but n8n was skipped
    const { data: eventRow, error: eventErr } = await supabase
      .from('system_events')
      .select('*')
      .eq('entity_id', defaultJobId)
      .eq('event_type', 'research.requested')
      .maybeSingle();

    assert(!eventErr, 'No error querying public.system_events');
    assert(Boolean(eventRow), 'System event research.requested recorded in Supabase for audit trail');
    assert(eventRow?.payload?.job_id === defaultJobId, 'Telemetry event payload contains correct job_id');
    assert(eventRow?.payload?.engine === 'native', 'Telemetry payload declares engine: native');
  }

  // [Suite 3] Synchronous Execution & Data Bank Live Reflection
  console.log('\n[Suite 3] Synchronous Native Execution & Data Bank Live Reflection');
  let syncJobId = '';
  {
    const syncPayload = {
      objective: 'Evaluate B2B offer clarity and positioning',
      topic: 'B2B Positioning Sync Cutover',
      platform: 'Instagram',
      funnel_stage: 'MOF',
      execution_mode: 'sync',
      creators: [
        { handle: 'marketingpro', source_target: 'https://www.instagram.com/marketingpro/' }
      ]
    };

    const req = createReq('/api/automation/research/jobs', 'POST', syncPayload, {
      'Idempotency-Key': `cutover_sync_${Date.now()}`
    });

    const res = await researchJobsPost(req);
    const json = await res.json();

    assert(res.status === 201, 'POST /jobs (sync) returns HTTP 201 Created');
    syncJobId = json.data?.id;
    assert(Boolean(syncJobId), `Returns sync job ID: ${syncJobId}`);
    assert(json.execution?.engine === 'native', 'Engine is native');
    assert(json.execution?.mode === 'sync', 'Mode is sync');
    assert(json.execution?.status === 'completed', 'Execution status is completed');
    assert(Boolean(json.execution?.summary), 'Returns complete execution summary');
    assert(json.execution?.summary?.resultsCreated >= 1, 'Created and persisted research results');

    // Query Data Bank endpoints to verify live data reflection
    const dataBankJobsRes = await researchJobsGet(createReq(`/api/automation/research/jobs?search=${encodeURIComponent('B2B Positioning Sync')}`));
    const dataBankJobsJson = await dataBankJobsRes.json();
    assert(dataBankJobsRes.status === 200, 'GET /jobs returns 200');
    const matchedJob = dataBankJobsJson.data?.jobs?.find((j: { id: string }) => j.id === syncJobId);
    assert(Boolean(matchedJob), 'Processed job is visible in Data Bank jobs query');
    assert(matchedJob?.status === 'completed', 'Data Bank displays status: completed');
    assert(matchedJob?.result_count >= 1, 'Data Bank displays accurate result_count >= 1');

    // Query Data Bank assignments
    const assignRes = await researchAssignmentsGet(createReq(`/api/automation/research/assignments?research_job_id=${syncJobId}`));
    const assignJson = await assignRes.json();
    assert(assignRes.status === 200, 'GET /assignments returns 200');
    assert(assignJson.data?.assignments?.length === 1, 'Data Bank retrieves 1 assignment');
    assert(assignJson.data?.assignments?.[0]?.status === 'completed', 'Data Bank assignment status is completed');

    // Query Data Bank results
    const resultsRes = await researchResultsGet(createReq(`/api/automation/research/results?research_job_id=${syncJobId}`));
    const resultsJson = await resultsRes.json();
    assert(resultsRes.status === 200, 'GET /results returns 200');
    assert(resultsJson.data?.results?.length >= 1, 'Data Bank returns persisted research observation');
    const firstResult = resultsJson.data?.results?.[0];
    assert(firstResult?.research_job_id === syncJobId, 'Observation maintains research_job_id provenance');
    assert(Boolean(firstResult?.research_assignment_id), 'Observation maintains research_assignment_id provenance');
    assert(Boolean(firstResult?.claim), 'Observation maintains extracted claim');

    // Data Bank Overview
    const overviewRes = await researchOverviewGet(createReq('/api/automation/research/overview'));
    const overviewJson = await overviewRes.json();
    assert(overviewRes.status === 200, 'GET /overview returns 200');
    assert(overviewJson.data?.jobs_by_status?.completed >= 1, 'Overview reports completed jobs count');
    assert(overviewJson.data?.total_results >= 1, 'Overview reports total_results count');
  }

  // [Suite 4] Idempotency & Duplicate Prevention
  console.log('\n[Suite 4] Idempotency & Duplicate Request Protection');
  {
    const idemKey = `idemp_cutover_guard_${Date.now()}`;
    const payload = {
      objective: 'Prevent duplicate job dispatches',
      topic: 'Duplicate Guard Topic',
      platform: 'Instagram'
    };

    const req1 = createReq('/api/automation/research/jobs', 'POST', payload, {
      'Idempotency-Key': idemKey
    });
    const res1 = await researchJobsPost(req1);
    const json1 = await res1.json();
    assert(res1.status === 201, 'First request creates job (201)');

    const req2 = createReq('/api/automation/research/jobs', 'POST', payload, {
      'Idempotency-Key': idemKey
    });
    const res2 = await researchJobsPost(req2);
    const json2 = await res2.json();
    assert(res2.status === 201, 'Second request with same Idempotency-Key returns cached 201');
    assert(json1.data?.id === json2.data?.id, 'Returned job ID is identical (no duplicate job created)');

    // Repeated trigger on completed job returns 200 with already_completed flag
    const completedJob = await findResearchJob(syncJobId);
    assert(Boolean(completedJob), 'Completed job exists');
    const repeatResult = await dispatchResearchJobExecution(completedJob!);
    assert(repeatResult.already_completed === true, 'Repeated dispatch on completed job safely returns already_completed');
    assert(repeatResult.initiated === false, 'Did not re-initiate execution on completed job');
  }

  // [Suite 5] Native Dispatch Failure & Falsely Running Prevention
  console.log('\n[Suite 5] Native Failure Handling & Falsely Running Prevention');
  {
    // Create a job in DB
    const failedTestJob = await insertResearchJob({
      workspace_id: CANONICAL_DEFAULT_WORKSPACE_ID,
      objective: 'Test failure handling',
      topic: 'Failure Guard Topic',
      platform: 'Instagram',
      status: 'queued'
    });

    assert(Boolean(failedTestJob.id), 'Inserted test job for failure verification');

    // Simulate catastrophic collector failure with an impossible collector
    const failingCollector = {
      collect: async () => {
        throw new Error('Fatal network connection refused by external provider');
      }
    };

    // Execute through processResearchJob with failing collector
    const summary = await processResearchJob(failedTestJob.id!, CANONICAL_DEFAULT_WORKSPACE_ID, {
      collector: failingCollector,
      maxRetries: 0
    });

    assert(summary.finalStatus === 'failed', 'Job finalized with status = failed');
    assert(summary.assignmentsFailed >= 1, 'Assignments recorded as failed');

    // Verify DB state is NOT falsely running
    const updatedDbJob = await findResearchJob(failedTestJob.id!);
    assert(updatedDbJob?.status === 'failed', 'Database row is terminal failed (NOT stuck in running)');
    assert(Boolean(updatedDbJob?.error), 'Database row has error message recorded');
    assert(Boolean(updatedDbJob?.completed_at), 'Database row has completed_at recorded');
  }

  // [Suite 6] Partial Failure Isolation
  console.log('\n[Suite 6] Partial Failure Isolation');
  {
    const partialJob = await insertResearchJob({
      workspace_id: CANONICAL_DEFAULT_WORKSPACE_ID,
      objective: 'Partial failure test',
      topic: 'Partial Failure Topic',
      platform: 'Instagram',
      creators: [
        { handle: 'working_creator', source_target: 'https://www.instagram.com/working_creator/' },
        { handle: 'broken_creator', source_target: 'https://www.instagram.com/broken_creator/' }
      ],
      status: 'queued'
    });

    // Create assignments
    await createDefaultAssignmentsForJob(partialJob);

    // Mixed collector: succeeds for working_creator, throws for broken_creator
    const mixedCollector = {
      collect: async (collectionJob: { creator?: string | null }) => {
        if (collectionJob.creator === 'broken_creator') {
          throw new Error('Simulated 404 channel deleted');
        }
        return [
          {
            source_url: 'https://www.instagram.com/p/working1/',
            source_type: 'instagram_post',
            platform: 'Instagram',
            creator: 'working_creator',
            topic: 'Partial Failure Topic',
            claim: 'Working creator observed proof',
            classification: 'observed_fact' as const,
            confidence: 'high' as const,
            evidence_strength: 'high' as const,
            evidence: { test: true },
            research_agent: 'NativeResearchCollector'
          }
        ];
      }
    };

    const summary = await processResearchJob(partialJob.id!, CANONICAL_DEFAULT_WORKSPACE_ID, {
      collector: mixedCollector,
      maxRetries: 0
    });

    assert(summary.assignmentsCompleted === 1, 'Exactly 1 assignment completed');
    assert(summary.assignmentsFailed === 1, 'Exactly 1 assignment failed');
    assert(summary.resultsCreated === 1, 'Successful assignment persisted its evidence');
    assert(summary.finalStatus === 'completed', 'Job marked completed with partial explanation');

    const dbJob = await findResearchJob(partialJob.id!);
    assert(dbJob?.error?.includes('Partial failure') === true, 'Parent job error records partial failure explanation');
  }

  // [Suite 7] Controlled Fallback Behavior (Mutual Exclusivity)
  console.log('\n[Suite 7] Controlled Fallback Behavior (n8n Engine Selection)');
  {
    // Temporarily switch engine via environment variable
    const originalEnv = process.env.RESEARCH_DISPATCH_ENGINE;
    try {
      process.env.RESEARCH_DISPATCH_ENGINE = 'n8n';
      assert(getResearchDispatchEngine() === 'n8n', 'Engine dynamically switches to n8n when configured by operator');

      const fallbackPayload = {
        objective: 'Test controlled fallback to n8n',
        topic: 'Operator Fallback Test Topic',
        platform: 'YouTube',
        creators: [{ handle: 'n8ncreator', source_target: 'https://www.youtube.com/@n8ncreator' }]
      };

      const fallbackReq = createReq('/api/automation/research/jobs', 'POST', fallbackPayload, {
        'Idempotency-Key': `fallback_test_${Date.now()}`
      });

      const fallbackRes = await researchJobsPost(fallbackReq);
      const fallbackJson = await fallbackRes.json();

      assert(fallbackRes.status === 201, 'POST /jobs (fallback) returns 201 Created');
      assert(fallbackJson.execution?.engine === 'n8n', 'Execution engine acknowledges n8n');
      assert(fallbackJson.execution?.mode === 'webhook', 'Mode acknowledges webhook');
      assert(fallbackJson.execution?.execution_mode === 'n8n_orchestration', 'Execution mode is n8n_orchestration');
      assert(fallbackJson.execution?.durability === 'external_n8n_queue', 'Durability is external_n8n_queue');

      // Crucial assertion: native processor must NOT execute this job
      const fallbackJobId = fallbackJson.data?.id;
      const dbJob = await findResearchJob(fallbackJobId);
      assert(dbJob?.status === 'queued', 'Job remains queued in database (NOT touched by native processor)');
    } finally {
      process.env.RESEARCH_DISPATCH_ENGINE = originalEnv;
    }

    assert(getResearchDispatchEngine() === 'native', 'Engine restored to default native');
  }

  // [Suite 8] Security: Reject Request Tampering on Privileged Execution Path
  console.log('\n[Suite 8] Security: Arbitrary Request Body Cannot Override Engine');
  {
    // Attacker tries to force engine: n8n via JSON body while server default is native
    const tamperingPayload = {
      objective: 'Tampering test',
      topic: 'Tampering Topic',
      platform: 'Instagram',
      engine: 'n8n', // Arbitrary unprivileged parameter
      engineOverride: 'n8n'
    };

    const req = createReq('/api/automation/research/jobs', 'POST', tamperingPayload, {
      'Idempotency-Key': `tamper_${Date.now()}`
    });

    const res = await researchJobsPost(req);
    const json = await res.json();

    assert(res.status === 201, 'POST /jobs returns 201');
    assert(json.execution?.engine === 'native', 'Server enforces native execution (body override ignored)');

    // Rejects unauthenticated request
    const unauthReq = new NextRequest(new URL('/api/automation/research/jobs', 'http://localhost:3000'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tamperingPayload)
    });
    const unauthRes = await researchJobsPost(unauthReq);
    assert(unauthRes.status === 401, 'Rejects unauthenticated request with 401');
  }

  // [Suite 9] Workspace Isolation & Tenant Boundaries
  console.log('\n[Suite 9] Workspace Isolation & Tenant Boundaries');
  {
    // Create job in secondary workspace
    const secPayload = {
      objective: 'Isolated secondary workspace test',
      topic: 'Secondary Workspace Topic',
      platform: 'Instagram'
    };

    const secReq = createReq('/api/automation/research/jobs', 'POST', secPayload, {
      'x-workspace-id': 'secondary-workspace-test',
      'Idempotency-Key': `sec_ws_${Date.now()}`
    });

    const secRes = await researchJobsPost(secReq);
    const secJson = await secRes.json();
    assert(secRes.status === 201, 'Creates job in secondary workspace');
    const secJobId = secJson.data?.id;

    // Primary workspace cannot see secondary job in its GET /jobs query
    const primaryJobsRes = await researchJobsGet(createReq('/api/automation/research/jobs', 'GET', undefined, {
      'x-workspace-id': CANONICAL_DEFAULT_WORKSPACE_ID
    }));
    const primaryJobsJson = await primaryJobsRes.json();
    const leaked = primaryJobsJson.data?.jobs?.some((j: { id: string }) => j.id === secJobId);
    assert(leaked === false, 'Zero cross-workspace data leakage in jobs list');

    // Native processor throws 404 if called with mismatched workspace ID
    let crossWorkspaceRejected = false;
    try {
      await processResearchJob(secJobId, CANONICAL_DEFAULT_WORKSPACE_ID);
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('not found in workspace')) {
        crossWorkspaceRejected = true;
      }
    }
    assert(crossWorkspaceRejected, 'Native processor rejects job from different workspace (404)');
  }

  // [Suite 10] Honest Deployment Guarantees
  console.log('\n[Suite 10] Deployment Guarantees & Durability Honesty');
  {
    const req = createReq('/api/automation/research/jobs', 'POST', {
      objective: 'Check durability disclosures',
      topic: 'Deployment Guarantees Check',
      platform: 'Instagram'
    }, {
      'Idempotency-Key': `guarantee_${Date.now()}`
    });

    const res = await researchJobsPost(req);
    const json = await res.json();

    assert(json.execution?.durability === 'postgres_persisted', 'Durably persisted in PostgreSQL queue');
    assert(json.execution?.execution_mode === 'durable_worker_queue', 'Accurately declares durable_worker_queue execution mode');
    assert(json.execution?.status === 'queued', 'Honestly returns status: queued rather than claiming started');
    assert(json.data?.status === 'queued', 'Job row in database has status: queued');
    assert(json.execution?.notice?.includes('PostgreSQL queue') === true, 'Explicitly declares durable PostgreSQL queue storage');
  }

  console.log('\n================================================================');
  console.log(`CUTOVER TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runNativeDispatchVerification().catch(err => {
  console.error('Fatal cutover test error:', err);
  process.exit(1);
});
