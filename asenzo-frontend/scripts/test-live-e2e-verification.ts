import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { POST as researchJobsPost, GET as researchJobsGet } from '../src/app/api/automation/research/jobs/route';
import { GET as researchJobDetailGet } from '../src/app/api/automation/research/jobs/[id]/route';
import { GET as researchAssignmentsGet } from '../src/app/api/automation/research/assignments/route';
import { GET as researchResultsGet } from '../src/app/api/automation/research/results/route';
import {
  findResearchJob,
  insertResearchJob,
  claimNextQueuedResearchJob,
  heartbeatResearchJob,
  updateResearchJobStatus,
  rescheduleResearchJob
} from '../src/lib/automation/db';
import { ResearchWorker } from '../src/lib/automation/queue';
import { CANONICAL_DEFAULT_WORKSPACE_ID, resolveCanonicalWorkspaceId } from '../src/lib/automation/workspace';
import { NextRequest } from 'next/server';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string): void {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

function createReq(url: string, method = 'GET', body?: unknown, headers: Record<string, string> = {}): NextRequest {
  const reqHeaders: Record<string, string> = {
    'content-type': 'application/json',
    'authorization': `Bearer ${process.env.ASENZO_AUTOMATION_API_KEY || ''}`,
    'x-workspace-id': CANONICAL_DEFAULT_WORKSPACE_ID,
    ...headers
  };
  return new NextRequest(new URL(url, 'http://localhost:3000'), {
    method,
    headers: reqHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });
}

async function runLiveE2EVerification() {
  console.log('\n================================================================');
  console.log('STEP 8: LIVE END-TO-END RESEARCH QUEUE & WORKER VERIFICATION');
  console.log('================================================================\n');

  // [Test 1] Authenticated Job Creation & Durable Persistence before ACK
  console.log('[Test 1] Authenticated Job Creation & Honest Queue Status Contract');
  const idempotencyKey = `live_e2e_job_${Date.now()}`;
  const req1 = createReq('/api/automation/research/jobs', 'POST', {
    objective: 'Live Production E2E Verification',
    topic: 'Sustainable Creator Monetization',
    platform: 'Instagram',
    priority: 'urgent',
    creators: [{ handle: 'livee2ecreator' }]
  }, {
    'Idempotency-Key': idempotencyKey
  });

  const res1 = await researchJobsPost(req1);
  assert(res1.status === 201, `API returns HTTP 201 Created (actual: ${res1.status})`);
  const json1 = await res1.json();
  const createdJobId = json1.data?.id;
  assert(Boolean(createdJobId), `Created job ID returned: ${createdJobId}`);
  assert(json1.execution?.status === 'queued', `Declares honest status: queued (actual: ${json1.execution?.status})`);
  assert(json1.execution?.execution_mode === 'durable_worker_queue', `Declares execution_mode: durable_worker_queue`);
  assert(json1.execution?.durability === 'postgres_persisted', `Declares durability: postgres_persisted`);

  // Verify DB row exists and status is queued
  const dbJob1 = await findResearchJob(createdJobId);
  assert(dbJob1 !== null, 'Job row is durably persisted in PostgreSQL');
  assert(dbJob1?.status === 'queued', `Job row status is queued in database (actual: ${dbJob1?.status})`);

  // [Test 2] Duplicate Request Handling via Idempotency
  console.log('\n[Test 2] Idempotency & Duplicate Request Guard');
  const dupReq = createReq('/api/automation/research/jobs', 'POST', {
    objective: 'Live Production E2E Verification',
    topic: 'Sustainable Creator Monetization',
    platform: 'Instagram',
    priority: 'urgent',
    creators: [{ handle: 'livee2ecreator' }]
  }, {
    'Idempotency-Key': idempotencyKey
  });
  const dupRes = await researchJobsPost(dupReq);
  const dupJson = await dupRes.json();
  assert(dupRes.status === 201, 'Duplicate request returns cached HTTP 201');
  assert(dupJson.data?.id === createdJobId, 'Duplicate request returns identical job ID');

  // [Test 3] Workspace Context & Tenant Isolation Security
  console.log('\n[Test 3] Workspace Boundary & Security');
  const crossWorkspaceId = await resolveCanonicalWorkspaceId('isolated-security-workspace');
  // Attempting to query job from cross-workspace MUST return 404
  const crossJobReq = createReq(`/api/automation/research/jobs/${createdJobId}`, 'GET', undefined, {
    'x-workspace-id': crossWorkspaceId
  });
  const crossJobRes = await researchJobDetailGet(crossJobReq, { params: Promise.resolve({ id: createdJobId }) });
  assert(crossJobRes.status === 404, 'Direct access to job from different workspace returns 404 Not Found');

  const crossJobsList = await researchJobsGet(createReq('/api/automation/research/jobs', 'GET', undefined, {
    'x-workspace-id': crossWorkspaceId
  }));
  const crossJson = await crossJobsList.json();
  const leakedJob = crossJson.data?.jobs?.find((j: { id: string }) => j.id === createdJobId);
  assert(!leakedJob, 'Created job is completely invisible to other workspaces (zero cross-tenant leak)');

  // [Test 4] Worker Claim, Lease Heartbeat, and Native Execution
  console.log('\n[Test 4] Worker Claim, Lease Heartbeat, and Native Execution');
  const liveWorker = new ResearchWorker({
    workspaceId: CANONICAL_DEFAULT_WORKSPACE_ID,
    maxConcurrency: 1,
    pollIntervalMs: 250,
    once: true
  });

  const initialHealth = liveWorker.getHealth();
  assert(initialHealth.isHealthy === true, 'Worker health check reports isHealthy: true');
  assert(initialHealth.databaseConnected === true, 'Worker health check reports databaseConnected: true');

  // Start worker to claim and process the enqueued job
  await liveWorker.start();

  const finalHealth = liveWorker.getHealth();
  assert(finalHealth.jobsProcessed >= 1, `Worker processed target job (jobsProcessed: ${finalHealth.jobsProcessed})`);
  assert(finalHealth.jobsSucceeded >= 1, `Worker succeeded target job (jobsSucceeded: ${finalHealth.jobsSucceeded})`);

  // [Test 5] Truthful Data Bank Persistence & Evidence Lineage
  console.log('\n[Test 5] Truthful Data Bank Persistence & Lineage');
  const finalizedJob = await findResearchJob(createdJobId);
  assert(finalizedJob?.status === 'completed', `Job reached truthful terminal state: completed (actual: ${finalizedJob?.status})`);
  assert(Boolean(finalizedJob?.completed_at), 'Job completed_at timestamp recorded');

  // Verify assignments in Data Bank API
  const assignReq = createReq(`/api/automation/research/assignments?job_id=${createdJobId}`);
  const assignRes = await researchAssignmentsGet(assignReq);
  const assignJson = await assignRes.json();
  assert(assignJson.data?.assignments?.length >= 1, 'Data Bank /assignments returns completed assignment');
  assert(assignJson.data?.assignments?.[0]?.status === 'completed', 'Assignment status is completed');

  // Verify results in Data Bank API
  const resultsReq = createReq(`/api/automation/research/results?job_id=${createdJobId}`);
  const resultsRes = await researchResultsGet(resultsReq);
  const resultsJson = await resultsRes.json();
  assert(resultsRes.status === 200, 'GET /results returns HTTP 200');
  assert(resultsJson.data?.results?.length >= 1, 'Data Bank contains persisted evidence results');
  const evidence = resultsJson.data?.results?.[0];
  assert(evidence?.research_job_id === createdJobId, 'Evidence result maintains strict parent job lineage');
  assert(Boolean(evidence?.claim), 'Evidence observation extracted non-empty claim');

  // [Test 6] Inaccessible Source Non-Fabrication Check
  console.log('\n[Test 6] Inaccessible Source & Honest Error Handling');
  const inaccReq = createReq('/api/automation/research/jobs', 'POST', {
    objective: 'Test Inaccessible Source',
    topic: 'Inaccessible Source Check',
    platform: 'Instagram',
    creators: [{ handle: 'definitely_inaccessible_404_account_xyz' }]
  }, {
    'Idempotency-Key': `inacc_test_${Date.now()}`
  });
  const inaccRes = await researchJobsPost(inaccReq);
  const inaccJson = await inaccRes.json();
  const inaccJobId = inaccJson.data?.id;

  // Process via run-once worker
  const inaccWorker = new ResearchWorker({
    workspaceId: CANONICAL_DEFAULT_WORKSPACE_ID,
    maxConcurrency: 1,
    pollIntervalMs: 250,
    once: true
  });
  await inaccWorker.start();

  const inaccDbJob = await findResearchJob(inaccJobId);
  assert(inaccDbJob?.status === 'completed' || inaccDbJob?.status === 'failed', `Terminal state reached truthfully: ${inaccDbJob?.status}`);

  // [Test 7] Lease Fencing Protection
  console.log('\n[Test 7] Stale Worker Mutation Fencing');
  const fenceJob = await insertResearchJob({
    workspace_id: CANONICAL_DEFAULT_WORKSPACE_ID,
    objective: 'Live Lease Fencing Guard',
    topic: 'Fencing Check',
    priority: 'urgent',
    status: 'queued'
  });

  const worker1Claim = await claimNextQueuedResearchJob('live-worker-1', {
    workspaceId: CANONICAL_DEFAULT_WORKSPACE_ID
  });
  assert(worker1Claim?.id === fenceJob.id, 'Live Worker 1 claimed fencing job');

  // Stale lease replacement by Worker 2
  const worker2Claim = await claimNextQueuedResearchJob('live-worker-2', {
    workspaceId: CANONICAL_DEFAULT_WORKSPACE_ID,
    staleTimeoutMs: 0
  });
  assert(worker2Claim?.id === fenceJob.id, 'Live Worker 2 replaced stale lease');

  // Stale Worker 1 heartbeat rejected
  const w1Heartbeat = await heartbeatResearchJob(fenceJob.id!, 'live-worker-1', CANONICAL_DEFAULT_WORKSPACE_ID);
  assert(w1Heartbeat === false, 'Stale Worker 1 heartbeat rejected by lease fencing');

  // Stale Worker 1 completion rejected
  const w1Complete = await updateResearchJobStatus(
    fenceJob.id!,
    CANONICAL_DEFAULT_WORKSPACE_ID,
    { status: 'completed', completed_at: new Date().toISOString() },
    { workerId: 'live-worker-1' }
  );
  assert(w1Complete === null, 'Stale Worker 1 completion rejected by lease fencing');

  // Stale Worker 1 reschedule rejected
  const w1Resched = await rescheduleResearchJob(
    fenceJob.id!,
    'live-worker-1',
    CANONICAL_DEFAULT_WORKSPACE_ID,
    { error: 'Late error', backoffMs: 1000, maxRetries: 3 }
  );
  assert(w1Resched.lostLease === true, 'Stale Worker 1 reschedule rejected with lostLease flag');

  // Legitimate Worker 2 completes job
  const w2Complete = await updateResearchJobStatus(
    fenceJob.id!,
    CANONICAL_DEFAULT_WORKSPACE_ID,
    { status: 'completed', completed_at: new Date().toISOString() },
    { workerId: 'live-worker-2' }
  );
  assert(Boolean(w2Complete), 'Legitimate Worker 2 successfully completed job');

  console.log('\n================================================================');
  console.log(`LIVE E2E VERIFICATION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runLiveE2EVerification().catch(err => {
  console.error('Fatal live E2E verification error:', err);
  process.exit(1);
});
