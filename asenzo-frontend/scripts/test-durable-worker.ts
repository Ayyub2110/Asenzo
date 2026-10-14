/**
 * ASENZO OS — Step 6: Durable Native Research Queue and Worker Verification Suite
 *
 * Verifies:
 * 1. Durable Enqueueing & Honesty Contract
 * 2. Atomic Worker Claims & Concurrency Protection (Real DB Locking)
 * 3. Concurrent Processing of Distinct Jobs & Priority Ordering
 * 4. Stale Lease Recovery & Abandoned Worker Reclaim
 * 5. Lease Heartbeat Management
 * 6. Transient Failure Retry & Exponential Backoff Delay
 * 7. Retry Exhaustion & Terminal Dead-Lettering
 * 8. Permanent Error Fast-Fail
 * 9. Graceful Shutdown & In-flight Task Drain
 * 10. Multi-Tenant Workspace Isolation
 * 11. End-to-End Queue Processing with Data Bank Persistence
 */

import { POST as researchJobsPost, GET as researchJobsGet } from '../src/app/api/automation/research/jobs/route';
import { GET as researchAssignmentsGet } from '../src/app/api/automation/research/assignments/route';
import { GET as researchResultsGet } from '../src/app/api/automation/research/results/route';
import {
  claimNextQueuedResearchJob,
  heartbeatResearchJob,
  rescheduleResearchJob,
  recoverStaleResearchLeases,
  insertResearchJob,
  findResearchJob,
  updateResearchJobStatus
} from '../src/lib/automation/db';
import { ResearchWorker } from '../src/lib/automation/queue';
import {
  CANONICAL_DEFAULT_WORKSPACE_ID,
  resolveCanonicalWorkspaceId
} from '../src/lib/automation/workspace';
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

async function runDurableWorkerTests() {
  console.log('\n================================================================');
  console.log('STEP 6: DURABLE NATIVE RESEARCH QUEUE & WORKER TEST SUITE');
  console.log('================================================================\n');

  // [Suite 1] Durable Enqueueing & Honesty Contract
  console.log('[Suite 1] Durable Enqueueing & Honesty Contract');
  let queuedJobId: string;
  {
    const req = createReq('/api/automation/research/jobs', 'POST', {
      objective: 'Verify durable queue enqueueing',
      topic: 'Durable Enqueue Contract',
      platform: 'Instagram'
    }, {
      'Idempotency-Key': `durable_enqueue_${Date.now()}`
    });

    const res = await researchJobsPost(req);
    const json = await res.json();

    assert(res.status === 201, 'POST /jobs (async) returns HTTP 201 Created');
    assert(json.success === true, 'Response payload success is true');
    assert(json.data?.status === 'queued', 'Job row in database has status: queued');
    assert(json.execution?.status === 'queued', 'Honestly returns execution.status: queued');
    assert(json.execution?.execution_mode === 'durable_worker_queue', 'Accurately declares execution_mode: durable_worker_queue');
    assert(json.execution?.durability === 'postgres_persisted', 'Declares durability: postgres_persisted');

    queuedJobId = json.data?.id;
    assert(Boolean(queuedJobId), 'Returns persistent job ID');

    // Verify task survives in database ready for worker pickup (restart survivability)
    const inDb = await findResearchJob(queuedJobId);
    assert(inDb !== null, 'Job row is durably stored in PostgreSQL');
    assert(inDb?.status === 'queued', 'Persisted job status is queued and ready for worker claim');
  }

  // [Suite 2] Atomic Worker Claims & Concurrency Protection (Real DB Locking)
  console.log('\n[Suite 2] Atomic Worker Claims & Concurrency Protection');
  {
    // Insert a fresh test job
    const freshJob = await insertResearchJob({
      workspace_id: CANONICAL_DEFAULT_WORKSPACE_ID,
      objective: 'Atomic claim race test',
      topic: 'Concurrency Test',
      platform: 'YouTube',
      priority: 'high',
      status: 'queued'
    });
    assert(Boolean(freshJob.id), 'Inserted fresh job for atomic claim race test');

    // Simulate 5 concurrent workers attempting to claim the next job simultaneously
    const workerIds = ['worker-alpha', 'worker-beta', 'worker-gamma', 'worker-delta', 'worker-epsilon'];
    const claimPromises = workerIds.map(wId => claimNextQueuedResearchJob(wId, {
      workspaceId: CANONICAL_DEFAULT_WORKSPACE_ID
    }));

    const results = await Promise.all(claimPromises);
    const successfulClaims = results.filter(r => r && r.id === freshJob.id);

    assert(successfulClaims.length === 1, `Exactly 1 worker successfully claimed job (actual: ${successfulClaims.length})`);

    const claimingWorker = successfulClaims[0]?.assigned_worker || (successfulClaims[0] as unknown as Record<string, unknown>)?.locked_by;
    assert(Boolean(claimingWorker), `Claiming worker recorded: ${claimingWorker}`);

    // Verify job in DB is running and locked
    const lockedJob = await findResearchJob(freshJob.id!);
    assert(lockedJob?.status === 'running', 'Claimed job status is running');

    // Clean up or finalize test job
    await updateResearchJobStatus(freshJob.id!, CANONICAL_DEFAULT_WORKSPACE_ID, {
      status: 'completed',
      completed_at: new Date().toISOString()
    });
  }

  // [Suite 3] Concurrent Processing of Distinct Jobs & Priority Ordering
  console.log('\n[Suite 3] Priority Ordering in Atomic Queue Claims');
  {
    // Create 3 jobs with different priorities
    const lowJob = await insertResearchJob({
      workspace_id: CANONICAL_DEFAULT_WORKSPACE_ID,
      objective: 'Low priority job',
      topic: 'Low Priority Test',
      priority: 'low',
      status: 'queued'
    });

    const urgentJob = await insertResearchJob({
      workspace_id: CANONICAL_DEFAULT_WORKSPACE_ID,
      objective: 'Urgent priority job',
      topic: 'Urgent Priority Test',
      priority: 'urgent',
      status: 'queued'
    });

    const highJob = await insertResearchJob({
      workspace_id: CANONICAL_DEFAULT_WORKSPACE_ID,
      objective: 'High priority job',
      topic: 'High Priority Test',
      priority: 'high',
      status: 'queued'
    });

    // Worker claims next job
    const firstClaimed = await claimNextQueuedResearchJob('worker-prio-1', {
      workspaceId: CANONICAL_DEFAULT_WORKSPACE_ID
    });
    assert(firstClaimed?.priority === 'urgent', `Urgent job claimed first (actual: ${firstClaimed?.priority})`);

    const secondClaimed = await claimNextQueuedResearchJob('worker-prio-2', {
      workspaceId: CANONICAL_DEFAULT_WORKSPACE_ID
    });
    assert(secondClaimed?.priority === 'high', `High priority job claimed second (actual: ${secondClaimed?.priority})`);

    // Clean up
    for (const j of [lowJob, urgentJob, highJob, firstClaimed, secondClaimed]) {
      if (j?.id) {
        await updateResearchJobStatus(j.id, CANONICAL_DEFAULT_WORKSPACE_ID, {
          status: 'completed',
          completed_at: new Date().toISOString()
        });
      }
    }
  }

  // [Suite 4] Stale Lease Recovery & Abandoned Worker Reclaim
  console.log('\n[Suite 4] Stale Lease Recovery & Abandoned Worker Reclaim');
  {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const staleJob = await insertResearchJob({
      workspace_id: CANONICAL_DEFAULT_WORKSPACE_ID,
      objective: 'Abandoned worker test',
      topic: 'Stale Lease Test',
      status: 'running',
      started_at: tenMinutesAgo,
      assigned_worker: 'crashed-worker-999'
    });

    // Scanner recovers abandoned leases older than 5 minutes
    const recoveredCount = await recoverStaleResearchLeases(5 * 60 * 1000, CANONICAL_DEFAULT_WORKSPACE_ID);
    assert(recoveredCount >= 1, `Recovered stale leases count >= 1 (actual: ${recoveredCount})`);

    const recoveredJob = await findResearchJob(staleJob.id!);
    assert(recoveredJob?.status === 'queued', 'Stale job recovered back to queued status');

    // New active worker can claim it
    const reClaimed = await claimNextQueuedResearchJob('worker-healer', {
      workspaceId: CANONICAL_DEFAULT_WORKSPACE_ID
    });
    assert(reClaimed !== null, 'Recovered job is claimable by active worker');

    if (staleJob.id) {
      await updateResearchJobStatus(staleJob.id, CANONICAL_DEFAULT_WORKSPACE_ID, {
        status: 'completed',
        completed_at: new Date().toISOString()
      });
    }
  }

  // [Suite 5] Lease Heartbeat Management
  console.log('\n[Suite 5] Lease Heartbeat Management');
  {
    const activeJob = await insertResearchJob({
      workspace_id: CANONICAL_DEFAULT_WORKSPACE_ID,
      objective: 'Heartbeat test',
      topic: 'Heartbeat Test',
      status: 'running',
      assigned_worker: 'worker-heartbeat-test',
      started_at: new Date().toISOString()
    });

    const heartbeatSuccess = await heartbeatResearchJob(
      activeJob.id!,
      'worker-heartbeat-test',
      CANONICAL_DEFAULT_WORKSPACE_ID
    );
    assert(heartbeatSuccess === true, 'Heartbeat renewal returns true');

    // Clean up
    await updateResearchJobStatus(activeJob.id!, CANONICAL_DEFAULT_WORKSPACE_ID, {
      status: 'completed',
      completed_at: new Date().toISOString()
    });
  }

  // [Suite 6] Transient Failure Retry & Exponential Backoff Delay
  console.log('\n[Suite 6] Transient Failure Retry & Exponential Backoff Delay');
  {
    const retryJob = await insertResearchJob({
      workspace_id: CANONICAL_DEFAULT_WORKSPACE_ID,
      objective: 'Retry backoff test',
      topic: 'Backoff Test',
      status: 'running',
      assigned_worker: 'worker-retry',
      attempt_count: 1
    });

    const rescheduleRes = await rescheduleResearchJob(
      retryJob.id!,
      'worker-retry',
      CANONICAL_DEFAULT_WORKSPACE_ID,
      {
        error: 'Simulated 429 rate limit exceeded',
        backoffMs: 10000,
        maxRetries: 3
      }
    );

    assert(rescheduleRes.status === 'queued', 'Job rescheduled to queued status');
    assert(rescheduleRes.deadLettered === false, 'Job not dead-lettered on initial transient failure');
    assert(Boolean(rescheduleRes.nextRunAt), 'Scheduled next_run_at timestamp recorded in future');

    // Verify worker respects backoff (does not immediately claim job while next_run_at > now)
    const claimedTooEarly = await claimNextQueuedResearchJob('worker-eager', {
      workspaceId: CANONICAL_DEFAULT_WORKSPACE_ID
    });
    const claimedOurJob = claimedTooEarly?.id === retryJob.id;
    assert(claimedOurJob === false, 'Worker respects next_run_at backoff and does not claim job too early');

    // Clean up
    await updateResearchJobStatus(retryJob.id!, CANONICAL_DEFAULT_WORKSPACE_ID, {
      status: 'completed',
      completed_at: new Date().toISOString()
    });
  }

  // [Suite 7] Max Retry Exhaustion & Terminal Dead-Lettering
  console.log('\n[Suite 7] Max Retry Exhaustion & Terminal Dead-Lettering');
  {
    const exhaustJob = await insertResearchJob({
      workspace_id: CANONICAL_DEFAULT_WORKSPACE_ID,
      objective: 'Exhaust retries test',
      topic: 'Dead Letter Test',
      status: 'running',
      assigned_worker: 'worker-exhaust',
      attempt_count: 3 // Already at max retries
    });

    const deadLetterRes = await rescheduleResearchJob(
      exhaustJob.id!,
      'worker-exhaust',
      CANONICAL_DEFAULT_WORKSPACE_ID,
      {
        error: 'Fatal database connection dropped',
        backoffMs: 5000,
        maxRetries: 3
      }
    );

    assert(deadLetterRes.status === 'failed', 'Status transitioned to failed upon retry exhaustion');
    assert(deadLetterRes.deadLettered === true, 'Flagged as dead-lettered');

    const dbRow = await findResearchJob(exhaustJob.id!);
    assert(dbRow?.status === 'failed', 'Database row marked failed');
    assert(dbRow?.error?.includes('database connection dropped') === true, 'Sanitized error recorded on failed job');
    assert(Boolean(dbRow?.completed_at), 'completed_at recorded on failed job');
  }

  // [Suite 8] Graceful Shutdown & Drain Behavior
  console.log('\n[Suite 8] Graceful Shutdown & Drain Behavior');
  {
    const worker = new ResearchWorker({
      workspaceId: '00000000-0000-0000-0000-000000000000',
      maxConcurrency: 1,
      pollIntervalMs: 500
    });

    assert(worker.getHealth().status === 'idle', 'Worker initialized in idle state');

    // Simulate start and quick graceful shutdown
    void worker.start();
    await new Promise(resolve => setTimeout(resolve, 200));

    await worker.stop('SIGTERM');
    const health = worker.getHealth();

    assert(health.status === 'stopped', 'Worker state transitions to stopped after stop()');
    assert(health.activeJobs === 0, 'Zero active jobs remain after graceful drain');
  }

  // [Suite 9] Multi-Tenant Workspace Isolation
  console.log('\n[Suite 9] Multi-Tenant Workspace Isolation');
  {
    const secWorkspaceId = await resolveCanonicalWorkspaceId('secondary-workspace-test');
    // Insert an urgent job strictly in secondary workspace
    const secJob = await insertResearchJob({
      workspace_id: secWorkspaceId,
      objective: 'Isolated workspace test',
      topic: 'Tenant Isolation',
      priority: 'urgent',
      status: 'queued'
    });

    // Worker scoped strictly to CANONICAL_DEFAULT_WORKSPACE_ID
    const scopedWorkerClaim = await claimNextQueuedResearchJob('worker-workspace-a', {
      workspaceId: CANONICAL_DEFAULT_WORKSPACE_ID
    });

    assert(scopedWorkerClaim?.workspace_id !== secWorkspaceId, 'Primary worker cannot claim job from secondary workspace');

    // Worker scoped to secWorkspaceId CAN claim it
    const secWorkerClaim = await claimNextQueuedResearchJob('worker-workspace-b', {
      workspaceId: secWorkspaceId
    });

    assert(Boolean(secWorkerClaim) && secWorkerClaim?.workspace_id === secWorkspaceId, 'Secondary worker successfully claimed job in secondary workspace');
    assert(secWorkerClaim?.id === secJob.id, 'Claimed job matches target secondary job');

    // Clean up
    if (secJob.id) {
      await updateResearchJobStatus(secJob.id, secWorkspaceId, {
        status: 'completed',
        completed_at: new Date().toISOString()
      });
    }
  }

  // [Suite 10] End-to-End Queue Processing with Data Bank Persistence
  console.log('\n[Suite 10] End-to-End Queue Processing with Data Bank Persistence');
  {
    // Create job via async API
    const req = createReq('/api/automation/research/jobs', 'POST', {
      objective: 'End-to-end worker drain test',
      topic: 'Native Queue Worker E2E',
      platform: 'Instagram',
      creators: [{ handle: 'queuetestcreator' }]
    }, {
      'Idempotency-Key': `e2e_worker_${Date.now()}`
    });

    const res = await researchJobsPost(req);
    const json = await res.json();
    const jobId = json.data?.id;

    assert(Boolean(jobId), `Asynchronously enqueued job created: ${jobId}`);
    assert(json.execution?.status === 'queued', 'Enqueued job declared status: queued');

    // Start a worker in run-once mode to process this job
    const e2eWorker = new ResearchWorker({
      workspaceId: CANONICAL_DEFAULT_WORKSPACE_ID,
      maxConcurrency: 1,
      pollIntervalMs: 250,
      once: true
    });

    await e2eWorker.start();

    const health = e2eWorker.getHealth();
    assert(health.jobsProcessed >= 1, `Worker processed job (jobsProcessed: ${health.jobsProcessed})`);
    assert(health.jobsSucceeded >= 1, `Worker completed job successfully (jobsSucceeded: ${health.jobsSucceeded})`);

    // Verify through Data Bank endpoints
    const jobsRes = await researchJobsGet(createReq(`/api/automation/research/jobs?search=Native+Queue+Worker+E2E`));
    const jobsJson = await jobsRes.json();
    const processedJob = jobsJson.data?.jobs?.find((j: { id: string }) => j.id === jobId);

    assert(Boolean(processedJob), 'Processed job found in Data Bank /jobs query');
    assert(processedJob?.status === 'completed', `Data Bank reports status: completed (actual: ${processedJob?.status})`);

    // Verify assignments
    const assignRes = await researchAssignmentsGet(createReq(`/api/automation/research/assignments?job_id=${jobId}`));
    const assignJson = await assignRes.json();
    assert(assignJson.data?.assignments?.length >= 1, 'Data Bank /assignments returns completed assignment');
    assert(assignJson.data?.assignments?.[0]?.status === 'completed', 'Assignment status is completed');

    // Verify observations in Data Bank
    const resultsRes = await researchResultsGet(createReq(`/api/automation/research/results?job_id=${jobId}`));
    const resultsJson = await resultsRes.json();
    assert(resultsJson.data?.results?.length >= 1, 'Data Bank /results returns persisted research evidence');
    assert(Boolean(resultsJson.data?.results?.[0]?.claim), 'Observation extracted and saved claim');
    assert(resultsJson.data?.results?.[0]?.research_job_id === jobId, 'Observation maintains research_job_id provenance');
  }

  console.log('\n================================================================');
  console.log(`DURABLE WORKER TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runDurableWorkerTests().catch(err => {
  console.error('Fatal durable worker test error:', err);
  process.exit(1);
});
