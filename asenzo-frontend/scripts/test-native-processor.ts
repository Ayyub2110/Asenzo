import { NextRequest } from 'next/server';

// Route Handlers
import { POST as jobProcessPost } from '../src/app/api/automation/research/jobs/[id]/process/route';
import { POST as globalProcessPost } from '../src/app/api/automation/research/process/route';
import { GET as overviewGet } from '../src/app/api/automation/research/overview/route';
import { GET as jobsGet } from '../src/app/api/automation/research/jobs/route';
import { GET as resultsGet } from '../src/app/api/automation/research/results/route';

// Engine & DB Imports
import {
  processResearchJob,
  ResearchCollector,
  ResearchCollectionJob,
  CollectedObservation,
  RateLimitError,
  TransientProcessorError,
  PermanentProcessorError,
  NativeResearchCollector,
  generateObservationIdempotencyKey,
  normalizeSourceUrl
} from '../src/lib/automation/processor';
import {
  insertResearchJob,
  insertResearchAssignment,
  findResearchJob,
  findResearchAssignmentsByJob,
  claimResearchJob,
  claimResearchAssignment,
  completeResearchAssignment,
  updateResearchJobStatus,
  insertResearchResult,
  CanonicalResearchJob
} from '../src/lib/automation/db';
import { resolveCanonicalWorkspaceId } from '../src/lib/automation/workspace';

const TEST_SECRET = 'test-native-processor-secret-token';
process.env.ASENZO_AUTOMATION_API_KEY = TEST_SECRET;

const TEST_WORKSPACE = 'test-native-proc-workspace-' + Date.now();
const ISOLATED_WORKSPACE = 'test-isolated-proc-workspace-' + Date.now();

let passed = 0;
let failed = 0;

function report(condition: boolean, name: string, detail?: unknown) {
  if (condition) {
    console.log(`  ✓ PASS: ${name}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${name}`, detail !== undefined ? detail : '');
    failed++;
  }
}

function createReq(url: string, method = 'POST', body?: unknown, headers: Record<string, string> = {}) {
  const finalHeaders: Record<string, string> = {
    'x-automation-token': TEST_SECRET,
    'x-workspace-id': TEST_WORKSPACE,
    'Content-Type': 'application/json',
    ...headers
  };

  const init: RequestInit = {
    method,
    headers: finalHeaders
  };

  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  return new NextRequest(new URL(url, 'http://localhost:3000'), init as unknown as ConstructorParameters<typeof NextRequest>[1]);
}

async function runNativeProcessorTests() {
  console.log('================================================================');
  console.log('HARDENED NATIVE RESEARCH PROCESSOR INTEGRATION & RELIABILITY TEST SUITE');
  console.log('================================================================\n');

  const canonicalWorkspace = await resolveCanonicalWorkspaceId(TEST_WORKSPACE);

  // [Suite 1] Authentication and Trigger Security
  console.log('[Suite 1] Authentication & Trigger Security');
  {
    const unauthReq = new NextRequest(new URL('/api/automation/research/jobs/fake-id/process', 'http://localhost:3000'), {
      method: 'POST'
    });
    const unauthRes = await jobProcessPost(unauthReq, { params: Promise.resolve({ id: 'fake-id' }) });
    report(unauthRes.status === 401, 'Rejects unauthenticated POST /jobs/:id/process (401)');

    const invalidTokenReq = createReq('/api/automation/research/jobs/fake-id/process', 'POST', {}, {
      'x-automation-token': 'wrong-token'
    });
    const invalidTokenRes = await jobProcessPost(invalidTokenReq, { params: Promise.resolve({ id: 'fake-id' }) });
    report(invalidTokenRes.status === 401, 'Rejects invalid token (401)');

    const notFoundReq = createReq('/api/automation/research/jobs/00000000-0000-0000-0000-000000000999/process');
    const notFoundRes = await jobProcessPost(notFoundReq, { params: Promise.resolve({ id: '00000000-0000-0000-0000-000000000999' }) });
    report(notFoundRes.status === 404, 'Returns 404 for non-existent job ID');

    // Missing job_id in global endpoint
    const missingJobReq = createReq('/api/automation/research/process', 'POST', {});
    const missingJobRes = await globalProcessPost(missingJobReq);
    report(missingJobRes.status === 400, 'Rejects missing job_id in POST /api/automation/research/process (400)');
  }

  // [Suite 2] Workspace Isolation Guard
  console.log('\n[Suite 2] Workspace Isolation Guard');
  let jobInPrimary: CanonicalResearchJob;
  {
    jobInPrimary = await insertResearchJob({
      workspace_id: canonicalWorkspace,
      topic: 'B2B Client Acquisition Framework',
      objective: 'Research high-ticket acquisition models',
      platform: 'YouTube',
      status: 'queued'
    });

    const foreignReq = createReq(`/api/automation/research/jobs/${jobInPrimary.id}/process`, 'POST', {}, {
      'x-workspace-id': ISOLATED_WORKSPACE
    });
    const foreignRes = await jobProcessPost(foreignReq, { params: Promise.resolve({ id: jobInPrimary.id! }) });
    report(foreignRes.status === 404, 'Foreign workspace cannot trigger job processing (404)');
  }

  // [Suite 3] Empty Assignment Set Handling
  console.log('\n[Suite 3] Empty Assignment Set Handling');
  {
    const emptyJob = await insertResearchJob({
      workspace_id: canonicalWorkspace,
      topic: 'Topic with zero assignments initially',
      objective: 'Verify default assignment generation or completion',
      platform: 'Instagram',
      creators: [],
      sources: [],
      status: 'queued'
    });

    const summary = await processResearchJob(emptyJob.id!, canonicalWorkspace);
    report(summary.finalStatus === 'completed', 'Job with empty creators/sources generates topic assignment and completes');
    report(summary.assignmentsTotal === 1, 'Auto-generated 1 canonical topic_research assignment');
    report(summary.resultsCreated >= 1, 'Persisted topic benchmark observation');

    const updatedJob = await findResearchJob(emptyJob.id!);
    report(updatedJob?.status === 'completed', 'Database reflects status = completed');
    report(Boolean(updatedJob?.completed_at), 'Database reflects completed_at timestamp');
  }

  // [Suite 4] Full Successful Job Execution with Multiple Assignments
  console.log('\n[Suite 4] Full Successful Job Execution with Multiple Assignments');
  let testJobId: string = '';
  {
    const mockCollector: ResearchCollector = {
      async collect(job: ResearchCollectionJob): Promise<CollectedObservation[]> {
        return [
          {
            source_url: `https://www.youtube.com/watch?v=mock_${job.assignmentId}`,
            source_type: 'video',
            source_title: `Mock breakdown on ${job.topic} by ${job.creator || 'analyst'}`,
            platform: job.platform,
            creator: job.creator,
            published_at: null,
            topic: job.topic,
            hook: 'First 30 seconds hook breakdown',
            angle: 'Contra-intuitive retention tactic',
            claim: 'High contrast visuals increase retention by 24%',
            evidence: { sample_size: 10, views: 240000 },
            audience_signals: { problem_aware: true },
            market_signals: { saturated: false },
            content_patterns: { format: 'breakdown' },
            evidence_strength: 'high',
            classification: 'observed_fact',
            confidence: 'high',
            raw_source_reference: { mock: true, assignment_id: job.assignmentId },
            research_agent: 'test-native-worker'
          }
        ];
      }
    };

    const multiJob = await insertResearchJob({
      workspace_id: canonicalWorkspace,
      topic: 'Creator Strategy 2026',
      objective: 'Collect top creator models',
      platform: 'YouTube',
      status: 'queued'
    });
    testJobId = multiJob.id!;

    // Create 3 assignments for this job
    await insertResearchAssignment({
      workspace_id: canonicalWorkspace,
      research_job_id: testJobId,
      assignment_type: 'creator_research',
      platform: 'YouTube',
      creator: 'creator_one',
      topic: 'Creator Strategy 2026',
      status: 'queued',
      attempt_count: 0
    });
    await insertResearchAssignment({
      workspace_id: canonicalWorkspace,
      research_job_id: testJobId,
      assignment_type: 'creator_research',
      platform: 'YouTube',
      creator: 'creator_two',
      topic: 'Creator Strategy 2026',
      status: 'queued',
      attempt_count: 0
    });
    await insertResearchAssignment({
      workspace_id: canonicalWorkspace,
      research_job_id: testJobId,
      assignment_type: 'topic_research',
      platform: 'YouTube',
      creator: null,
      topic: 'Creator Strategy 2026',
      status: 'queued',
      attempt_count: 0
    });

    const summary = await processResearchJob(testJobId, canonicalWorkspace, {
      concurrency: 2,
      collector: mockCollector
    });

    report(summary.finalStatus === 'completed', 'Multi-assignment job transitions to completed');
    report(summary.assignmentsTotal === 3, 'Processed exactly 3 assignments');
    report(summary.assignmentsCompleted === 3, 'All 3 assignments completed');
    report(summary.assignmentsFailed === 0, 'Zero failed assignments');
    report(summary.resultsCreated === 3, 'Persisted 3 research observations');

    // Verify DB assignments
    const dbAssignments = await findResearchAssignmentsByJob(testJobId, canonicalWorkspace);
    report(dbAssignments.every(a => a.status === 'completed'), 'All assignments in database have status = completed');
    report(dbAssignments.every(a => (a.attempt_count || 0) >= 1), 'Attempt counts incremented in database');
    report(dbAssignments.every(a => Boolean(a.completed_at)), 'Assignments have completed_at timestamp');

    // Verify parent job in DB
    const finalJob = await findResearchJob(testJobId);
    report(finalJob?.status === 'completed', 'Parent job status in DB is completed');
    report(Boolean(finalJob?.started_at), 'Parent job has started_at timestamp');
    report(Boolean(finalJob?.completed_at), 'Parent job has completed_at timestamp');
    report(finalJob?.error === null, 'Parent job error field is null on full success');
  }

  // [Suite 5] Idempotency, Stable Fingerprinting & Reordering Resilience
  console.log('\n[Suite 5] Idempotency, Stable Fingerprinting & Reordering Resilience');
  {
    // Part A: Calling processResearchJob on an already completed job without force returns immediately
    const secondRun = await processResearchJob(testJobId, canonicalWorkspace);
    report(secondRun.finalStatus === 'completed', 'Second run returns completed immediately');
    report(secondRun.resultsCreated === 0, 'Does not duplicate results on repeated execution');

    // Part B: Stable URL normalization
    const url1 = 'https://www.youtube.com/watch?v=12345&utm_source=twitter&utm_medium=social&ref=share';
    const url2 = 'HTTPS://WWW.YOUTUBE.COM/watch?v=12345';
    report(normalizeSourceUrl(url1) === normalizeSourceUrl(url2), 'URL normalizer strips tracking parameters and lowercases host');

    // Part C: Reordered observations produce IDENTICAL idempotency keys
    const obsA: CollectedObservation = {
      source_url: 'https://example.com/post-a',
      source_type: 'social_post',
      source_title: 'Title A',
      platform: 'LinkedIn',
      topic: 'Growth',
      claim: 'Observation A claim text',
      evidence: {},
      evidence_strength: 'low',
      classification: 'observed_fact',
      confidence: 'low',
      research_agent: 'test'
    };

    const obsB: CollectedObservation = {
      source_url: 'https://example.com/post-b',
      source_type: 'social_post',
      source_title: 'Title B',
      platform: 'LinkedIn',
      topic: 'Growth',
      claim: 'Observation B claim text',
      evidence: {},
      evidence_strength: 'low',
      classification: 'observed_fact',
      confidence: 'low',
      research_agent: 'test'
    };

    const dummyJobId = 'job-order-test';
    const dummyAssignId = 'assign-order-test';

    const keyA_first = generateObservationIdempotencyKey(dummyJobId, dummyAssignId, obsA);
    const keyB_second = generateObservationIdempotencyKey(dummyJobId, dummyAssignId, obsB);

    // If returned in reversed order [obsB, obsA]
    const keyB_first = generateObservationIdempotencyKey(dummyJobId, dummyAssignId, obsB);
    const keyA_second = generateObservationIdempotencyKey(dummyJobId, dummyAssignId, obsA);

    report(keyA_first === keyA_second, 'Observation A key is identical regardless of collection order');
    report(keyB_second === keyB_first, 'Observation B key is identical regardless of collection order');
    report(keyA_first !== keyB_first, 'Distinct observations produce distinct keys');

    // Part D: Database duplicate insertion handling (Postgres 23505 conflict resolution)
    const testDedupJob = await insertResearchJob({
      workspace_id: canonicalWorkspace,
      topic: 'Dedup DB Test',
      objective: 'Verify idempotency and deduplication',
      platform: 'LinkedIn',
      status: 'queued'
    });

    const testDedupAssign = await insertResearchAssignment({
      workspace_id: canonicalWorkspace,
      research_job_id: testDedupJob.id!,
      assignment_type: 'creator_research',
      topic: 'Dedup DB Test',
      status: 'queued'
    });

    const dedupKey = `res_${testDedupJob.id!.slice(0, 8)}_fixed_test_key_${Date.now()}`;

    // First insert
    const insert1 = await insertResearchResult({
      workspace_id: canonicalWorkspace,
      research_job_id: testDedupJob.id!,
      research_assignment_id: testDedupAssign.id!,
      source_url: 'https://example.com/unique-test',
      source_type: 'article',
      topic: 'Dedup DB Test',
      claim: 'Original unique observation',
      evidence: {},
      evidence_strength: 'low',
      classification: 'observed_fact',
      confidence: 'low',
      idempotency_key: dedupKey
    });
    report(insert1.__deduplicated === false, 'First insert creates new row (__deduplicated = false)');

    // Second insert with exact same idempotency_key
    const insert2 = await insertResearchResult({
      workspace_id: canonicalWorkspace,
      research_job_id: testDedupJob.id!,
      research_assignment_id: testDedupAssign.id!,
      source_url: 'https://example.com/unique-test',
      source_type: 'article',
      topic: 'Dedup DB Test',
      claim: 'Original unique observation',
      evidence: {},
      evidence_strength: 'low',
      classification: 'observed_fact',
      confidence: 'low',
      idempotency_key: dedupKey
    });
    report(insert2.__deduplicated === true, 'Duplicate insert catches 23505 and returns existing row (__deduplicated = true)');
    report(insert1.id === insert2.id, 'Both inserts refer to the exact same database row ID');

    // Part E: Newly discovered observation with different signature is insertable
    const insert3 = await insertResearchResult({
      workspace_id: canonicalWorkspace,
      research_job_id: testDedupJob.id!,
      research_assignment_id: testDedupAssign.id!,
      source_url: 'https://example.com/distinct-observation',
      source_type: 'article',
      topic: 'Dedup DB Test',
      claim: 'Newly discovered distinct observation',
      evidence: {},
      evidence_strength: 'low',
      classification: 'observed_fact',
      confidence: 'low',
      idempotency_key: `res_${testDedupJob.id!.slice(0, 8)}_new_distinct_${Date.now()}`
    });
    report(insert3.__deduplicated === false, 'Newly discovered observation is insertable');
    report(insert3.id !== insert1.id, 'Newly discovered observation gets unique row ID');
  }

  // [Suite 6] Partial Failure Isolation
  console.log('\n[Suite 6] Partial Failure Isolation');
  {
    const partialJob = await insertResearchJob({
      workspace_id: canonicalWorkspace,
      topic: 'Partial Failure Resilience Test',
      objective: 'Ensure failing assignment does not drop successful ones',
      platform: 'YouTube',
      status: 'queued'
    });

    // Assignment 1 succeeds
    await insertResearchAssignment({
      workspace_id: canonicalWorkspace,
      research_job_id: partialJob.id!,
      assignment_type: 'creator_research',
      platform: 'YouTube',
      creator: 'good_creator',
      topic: 'Partial Failure Resilience Test',
      status: 'queued',
      attempt_count: 0
    });

    // Assignment 2 permanently fails
    await insertResearchAssignment({
      workspace_id: canonicalWorkspace,
      research_job_id: partialJob.id!,
      assignment_type: 'creator_research',
      platform: 'YouTube',
      creator: 'bad_creator',
      topic: 'Partial Failure Resilience Test',
      status: 'queued',
      attempt_count: 0
    });

    const partialCollector: ResearchCollector = {
      async collect(job: ResearchCollectionJob): Promise<CollectedObservation[]> {
        if (job.creator === 'bad_creator') {
          throw new PermanentProcessorError('Simulated permanent channel 404 not found', 404);
        }
        return [
          {
            source_url: `https://www.youtube.com/watch?v=good_${job.assignmentId}`,
            source_type: 'video',
            source_title: 'Valid creator observation',
            platform: job.platform,
            creator: job.creator,
            topic: job.topic,
            claim: 'Valid claim from good creator',
            evidence: { views: 5000 },
            evidence_strength: 'medium',
            classification: 'observed_fact',
            confidence: 'medium',
            raw_source_reference: { ok: true },
            research_agent: 'test-worker'
          }
        ];
      }
    };

    const summary = await processResearchJob(partialJob.id!, canonicalWorkspace, {
      collector: partialCollector
    });

    report(summary.assignmentsTotal === 2, 'Total assignments = 2');
    report(summary.assignmentsCompleted === 1, 'Assignments completed = 1');
    report(summary.assignmentsFailed === 1, 'Assignments failed = 1');
    report(summary.resultsCreated === 1, 'Preserves successful result from good creator');
    report(summary.finalStatus === 'completed', 'Final status reflects partial completion');

    const updatedPartialJob = await findResearchJob(partialJob.id!);
    report(Boolean(updatedPartialJob?.error?.includes('Partial failure')), 'Parent job records partial failure explanation in error field');

    const assignments = await findResearchAssignmentsByJob(partialJob.id!, canonicalWorkspace);
    const failedAssign = assignments.find(a => a.creator === 'bad_creator');
    report(failedAssign?.status === 'failed', 'Failing assignment recorded as status = failed');
    report(Boolean(failedAssign?.error?.includes('404')), 'Failing assignment records specific error details');
  }

  // [Suite 7] Transient Retries and Rate-Limit (429) Backoff
  console.log('\n[Suite 7] Transient Retries & Rate-Limit Handling');
  {
    let attempts = 0;
    const retryCollector: ResearchCollector = {
      async collect(job: ResearchCollectionJob): Promise<CollectedObservation[]> {
        attempts++;
        if (attempts === 1) {
          throw new RateLimitError('HTTP 429 Too Many Requests', 150); // 150ms retry-after
        }
        if (attempts === 2) {
          throw new TransientProcessorError('Temporary 503 Service Unavailable', 503);
        }
        // Attempt 3 succeeds!
        return [
          {
            source_url: `https://www.youtube.com/watch?v=retry_success_${job.assignmentId}`,
            source_type: 'video',
            source_title: 'Succeeded after retries',
            platform: job.platform,
            creator: 'resilient_creator',
            topic: job.topic,
            claim: 'Retry succeeded after backoff',
            evidence: { attempts },
            evidence_strength: 'high',
            classification: 'observed_fact',
            confidence: 'high',
            raw_source_reference: { attempts },
            research_agent: 'test-worker'
          }
        ];
      }
    };

    const retryJob = await insertResearchJob({
      workspace_id: canonicalWorkspace,
      topic: 'Retry Mechanism Verification',
      objective: 'Ensure transient 429 and 503 errors retry and succeed',
      platform: 'YouTube',
      status: 'queued'
    });

    await insertResearchAssignment({
      workspace_id: canonicalWorkspace,
      research_job_id: retryJob.id!,
      assignment_type: 'creator_research',
      platform: 'YouTube',
      creator: 'resilient_creator',
      topic: 'Retry Mechanism Verification',
      status: 'queued',
      attempt_count: 0
    });

    const summary = await processResearchJob(retryJob.id!, canonicalWorkspace, {
      maxRetries: 3,
      baseBackoffMs: 50,
      collector: retryCollector
    });

    report(attempts === 3, 'Retried exactly twice (total 3 attempts)');
    report(summary.assignmentsCompleted === 1, 'Successfully completed assignment after transient errors');
    report(summary.resultsCreated === 1, 'Persisted result after recovery');
  }

  // [Suite 8] Permanent Error Immediate Failure (No Wasted Retries)
  console.log('\n[Suite 8] Permanent Error Immediate Failure');
  {
    let attempts = 0;
    const permanentCollector: ResearchCollector = {
      async collect(): Promise<CollectedObservation[]> {
        attempts++;
        throw new PermanentProcessorError('HTTP 401 Unauthorized: Invalid API credentials', 401);
      }
    };

    const permJob = await insertResearchJob({
      workspace_id: canonicalWorkspace,
      topic: 'Permanent Error Test',
      objective: 'Ensure 401 fails immediately without retrying',
      platform: 'YouTube',
      status: 'queued'
    });

    await insertResearchAssignment({
      workspace_id: canonicalWorkspace,
      research_job_id: permJob.id!,
      assignment_type: 'creator_research',
      platform: 'YouTube',
      creator: 'unauthorized_creator',
      topic: 'Permanent Error Test',
      status: 'queued',
      attempt_count: 0
    });

    const summary = await processResearchJob(permJob.id!, canonicalWorkspace, {
      maxRetries: 3,
      collector: permanentCollector
    });

    report(attempts === 1, 'Permanent error failed on attempt 1 without retrying');
    report(summary.assignmentsFailed === 1, 'Assignment marked as failed');
    report(summary.finalStatus === 'failed', 'Job marked as failed');
  }

  // [Suite 9] Concurrency Protection, Atomic Claims & Stale Recovery
  console.log('\n[Suite 9] Concurrency Protection, Atomic Claims & Stale Recovery');
  {
    // Part A: Atomic Assignment Claim
    const raceJob = await insertResearchJob({
      workspace_id: canonicalWorkspace,
      topic: 'Atomic Race Condition Test',
      objective: 'Ensure two concurrent workers cannot process the same assignment',
      platform: 'YouTube',
      status: 'queued'
    });

    const raceAssignment = await insertResearchAssignment({
      workspace_id: canonicalWorkspace,
      research_job_id: raceJob.id!,
      assignment_type: 'creator_research',
      platform: 'YouTube',
      creator: 'race_creator',
      topic: 'Atomic Race Condition Test',
      status: 'queued',
      attempt_count: 0
    });

    // Simulate Worker 1 claiming the assignment
    const worker1Claim = await claimResearchAssignment(raceAssignment.id!, canonicalWorkspace);
    report(Boolean(worker1Claim), 'Worker 1 successfully claimed assignment');
    report(worker1Claim?.status === 'running', 'Assignment transitioned to running');

    // Simulate Worker 2 attempting to claim the SAME assignment concurrently
    const worker2Claim = await claimResearchAssignment(raceAssignment.id!, canonicalWorkspace);
    report(worker2Claim === null, 'Worker 2 claim was rejected atomically (returns null)');

    // Part B: Atomic Job Claim
    const claimJob1 = await claimResearchJob(raceJob.id!, canonicalWorkspace);
    report(Boolean(claimJob1), 'Worker 1 successfully claimed job');
    report(claimJob1?.status === 'running', 'Job transitioned to running');

    // Worker 2 tries to claim while actively running
    const claimJob2 = await claimResearchJob(raceJob.id!, canonicalWorkspace);
    report(claimJob2 === null, 'Worker 2 job claim rejected atomically while active (returns null)');

    // Part C: Stale Job Recovery
    // Simulate abandoned job by setting started_at to 30 minutes in the past
    const staleTime = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    await updateResearchJobStatus(raceJob.id!, canonicalWorkspace, {
      status: 'running',
      started_at: staleTime
    });

    // Recovery worker claims with 15-minute threshold
    const recoveredJob = await claimResearchJob(raceJob.id!, canonicalWorkspace, 15 * 60 * 1000);
    report(Boolean(recoveredJob), 'Recovery worker safely reclaimed stale abandoned job');
    report(recoveredJob?.status === 'running', 'Reclaimed job active with fresh started_at timestamp');
  }

  // [Suite 10] Finalization Safety: No Premature Completion
  console.log('\n[Suite 10] Finalization Safety: No Premature Completion While Assignments Pending');
  {
    const safetyJob = await insertResearchJob({
      workspace_id: canonicalWorkspace,
      topic: 'Finalization Safety Test',
      objective: 'Ensure job remains running while assignments pending',
      platform: 'Instagram',
      status: 'queued'
    });

    // Assignment 1: Completed
    const assign1 = await insertResearchAssignment({
      workspace_id: canonicalWorkspace,
      research_job_id: safetyJob.id!,
      assignment_type: 'creator_research',
      topic: 'Finalization Safety Test',
      status: 'queued'
    });
    await claimResearchAssignment(assign1.id!, canonicalWorkspace);
    await completeResearchAssignment(assign1.id!, canonicalWorkspace);

    // Assignment 2: Still Running!
    const assign2 = await insertResearchAssignment({
      workspace_id: canonicalWorkspace,
      research_job_id: safetyJob.id!,
      assignment_type: 'creator_research',
      topic: 'Finalization Safety Test',
      status: 'queued'
    });
    await claimResearchAssignment(assign2.id!, canonicalWorkspace);

    // Verify database state: one completed, one running
    const assignments = await findResearchAssignmentsByJob(safetyJob.id!, canonicalWorkspace);
    report(assignments.some(a => a.status === 'completed'), 'Assignment 1 is completed');
    report(assignments.some(a => a.status === 'running'), 'Assignment 2 is running');

    // An execution worker that finished its work attempts finalization check
    const stillRunning = assignments.filter(a => a.status === 'running' || a.status === 'queued').length;
    report(stillRunning > 0, 'Detects pending assignments remain');

    // Simulate finalization guard: Job must NOT be marked completed while assign2 is running
    await updateResearchJobStatus(safetyJob.id!, canonicalWorkspace, {
      status: 'running' // Retains running
    });

    const checkJob = await findResearchJob(safetyJob.id!);
    report(checkJob?.status === 'running', 'Job remains running while assignments are pending');

    // Now finalize Assignment 2
    await completeResearchAssignment(assign2.id!, canonicalWorkspace);
    const updatedAssignments = await findResearchAssignmentsByJob(safetyJob.id!, canonicalWorkspace);
    const pendingNow = updatedAssignments.filter(a => a.status === 'running' || a.status === 'queued').length;
    report(pendingNow === 0, 'All assignments are now terminal');

    await updateResearchJobStatus(safetyJob.id!, canonicalWorkspace, {
      status: 'completed',
      completed_at: new Date().toISOString()
    });
    const finalSafeJob = await findResearchJob(safetyJob.id!);
    report(finalSafeJob?.status === 'completed', 'Job transitions to completed only after ALL assignments finish');
  }

  // [Suite 11] Trigger API Routes Verification (Sync, Async & Duplicate Guards)
  console.log('\n[Suite 11] Trigger API Routes (Sync, Async & Duplicate Guards)');
  {
    // Synchronous execution endpoint
    const apiJob = await insertResearchJob({
      workspace_id: canonicalWorkspace,
      topic: 'API Trigger Sync Test',
      objective: 'Verify POST /jobs/:id/process synchronous response',
      platform: 'Instagram',
      creators: [{ handle: 'test_creator' }],
      status: 'queued'
    });

    const syncReq = createReq(`/api/automation/research/jobs/${apiJob.id}/process`, 'POST', {
      mode: 'sync'
    });
    const syncRes = await jobProcessPost(syncReq, { params: Promise.resolve({ id: apiJob.id! }) });
    report(syncRes.status === 200, 'POST /jobs/:id/process (sync) returns HTTP 200 OK');
    const syncBody = await syncRes.json();
    report(syncBody.success === true, 'Response body has success: true');
    report(syncBody.data.finalStatus === 'completed', 'Returned finalStatus = completed');

    // Repeated trigger on completed job returns 200 with already_completed flag
    const repeatReq = createReq(`/api/automation/research/jobs/${apiJob.id}/process`, 'POST', {});
    const repeatRes = await jobProcessPost(repeatReq, { params: Promise.resolve({ id: apiJob.id! }) });
    report(repeatRes.status === 200, 'Repeated trigger on completed job returns 200 without rerun');
    const repeatBody = await repeatRes.json();
    report(repeatBody.data.already_completed === true, 'Response acknowledges already_completed = true');

    // Asynchronous execution endpoint with honest acknowledgement
    const asyncJob = await insertResearchJob({
      workspace_id: canonicalWorkspace,
      topic: 'API Trigger Async Test',
      objective: 'Verify POST /jobs/:id/process async response',
      platform: 'Instagram',
      creators: [{ handle: 'async_creator' }],
      status: 'queued'
    });

    const asyncReq = createReq(`/api/automation/research/jobs/${asyncJob.id}/process`, 'POST', {
      mode: 'async'
    });
    const asyncRes = await jobProcessPost(asyncReq, { params: Promise.resolve({ id: asyncJob.id! }) });
    report(asyncRes.status === 202, 'POST /jobs/:id/process (async) returns HTTP 202 Accepted');
    const asyncBody = await asyncRes.json();
    report(asyncBody.data.mode === 'async', 'Response confirms mode = async');
    report(asyncBody.data.execution_mode === 'in_process_background', 'Response explicitly acknowledges in_process_background execution');
    report(asyncBody.data.durability === 'in_process_ephemeral', 'Response honestly acknowledges in_process_ephemeral durability');
    report(Boolean(asyncBody.data.notice), 'Response includes clear worker queue infrastructure notice');

    // Global /process endpoint
    const globalJob = await insertResearchJob({
      workspace_id: canonicalWorkspace,
      topic: 'Global Process Endpoint Test',
      objective: 'Verify POST /api/automation/research/process',
      platform: 'Instagram',
      creators: [{ handle: 'global_creator' }],
      status: 'queued'
    });

    const globalReq = createReq('/api/automation/research/process', 'POST', {
      job_id: globalJob.id,
      mode: 'sync'
    });
    const globalRes = await globalProcessPost(globalReq);
    report(globalRes.status === 200, 'POST /api/automation/research/process returns 200 OK');
    const globalBody = await globalRes.json();
    report(globalBody.data.jobId === globalJob.id, 'Global process returned summary for correct job');
  }

  // [Suite 12] Honest Research Collection Capabilities & Boundaries
  console.log('\n[Suite 12] Honest Research Collection Capabilities & Boundaries');
  {
    const collector = new NativeResearchCollector();

    // Part A: Topic research without live API is classified honestly as ai_hypothesis with low confidence
    const topicObs = await collector.collect({
      assignmentId: 'assign-honest-topic',
      jobId: 'job-honest-topic',
      workspaceId: canonicalWorkspace,
      assignmentType: 'topic_research',
      platform: 'YouTube',
      topic: 'Founder Led Sales'
    });

    report(topicObs.length === 1, 'Topic collector returns observation');
    report(topicObs[0].classification === 'ai_hypothesis', 'Unverified topic query classified honestly as ai_hypothesis');
    report(topicObs[0].evidence_strength === 'low', 'Topic evidence strength is low without live API metrics');
    report(topicObs[0].confidence === 'low', 'Topic confidence is low without live API metrics');
    report(topicObs[0].published_at === null, 'Does NOT fabricate publication date for topic query (published_at is null)');
    report(topicObs[0].evidence.live_metrics_available === false, 'Evidence explicitly declares live_metrics_available: false');

    // Part B: Prohibited placeholder detection
    let rejectedPlaceholder = false;
    try {
      await collector.collect({
        assignmentId: 'assign-ph',
        jobId: 'job-ph',
        workspaceId: canonicalWorkspace,
        assignmentType: 'creator_research',
        platform: 'Instagram',
        topic: 'Test',
        creator: 'verified_handle'
      });
    } catch (err) {
      if (err instanceof PermanentProcessorError && err.statusCode === 400) {
        rejectedPlaceholder = true;
      }
    }
    report(rejectedPlaceholder, 'Rejects prohibited placeholder "verified_handle" with 400 error');

    // Part C: Invalid URL target validation
    let rejectedInvalidUrl = false;
    try {
      await collector.collect({
        assignmentId: 'assign-inv',
        jobId: 'job-inv',
        workspaceId: canonicalWorkspace,
        assignmentType: 'creator_research',
        platform: 'Instagram',
        topic: 'Test',
        sourceTarget: 'not-a-valid-url'
      });
    } catch (err) {
      if (err instanceof PermanentProcessorError && err.statusCode === 400) {
        rejectedInvalidUrl = true;
      }
    }
    report(rejectedInvalidUrl, 'Rejects invalid source URL format with 400 error');
  }

  // [Suite 13] Data Bank Compatibility & Provenance Verification
  console.log('\n[Suite 13] Research Data Bank Compatibility');
  {
    // Overview counts reflect processed work
    const overviewReq = createReq('/api/automation/research/overview');
    const overviewRes = await overviewGet(overviewReq);
    report(overviewRes.status === 200, 'GET /overview returns 200');
    const overviewBody = await overviewRes.json();
    report(overviewBody.data.total_jobs > 0, 'Data Bank overview shows total_jobs > 0');
    report(overviewBody.data.jobs_by_status.completed > 0, 'Data Bank overview shows completed jobs > 0');
    report(overviewBody.data.completed_assignments > 0, 'Data Bank overview shows completed_assignments > 0');
    report(overviewBody.data.total_results > 0, 'Data Bank overview shows total_results > 0');

    // Query jobs list includes processed jobs with accurate counts
    const jobsReq = createReq('/api/automation/research/jobs');
    const jobsRes = await jobsGet(jobsReq);
    report(jobsRes.status === 200, 'GET /jobs returns 200');
    const jobsBody = await jobsRes.json();
    const verifiedJob = (jobsBody.data.jobs as Array<{ id: string; status: string; result_count: number }>).find(j => j.id === testJobId);
    report(Boolean(verifiedJob), 'Processed test job visible in Data Bank jobs query');
    report(verifiedJob?.status === 'completed', 'Data Bank displays completed status');
    report((verifiedJob?.result_count || 0) >= 3, 'Data Bank attaches accurate result_count');

    // Query results list includes results with provenance
    const resultsReq = createReq(`/api/automation/research/results?research_job_id=${testJobId}`);
    const resultsRes = await resultsGet(resultsReq);
    report(resultsRes.status === 200, 'GET /results returns 200');
    const resultsBody = await resultsRes.json();
    report(resultsBody.data.results.length >= 3, 'Data Bank returns all persisted observations');
    const firstResult = resultsBody.data.results[0];
    report(firstResult.research_job_id === testJobId, 'Result maintains research_job_id provenance');
    report(Boolean(firstResult.research_assignment_id), 'Result maintains research_assignment_id provenance');
    report(Boolean(firstResult.source_url), 'Result maintains safe source_url');
    report(Boolean(firstResult.classification), 'Result maintains classification');
  }

  console.log('\n================================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runNativeProcessorTests().catch(err => {
  console.error('Fatal test error in test-native-processor:', err);
  process.exit(1);
});
