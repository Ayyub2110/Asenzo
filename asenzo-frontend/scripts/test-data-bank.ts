import { NextRequest } from 'next/server';

// Route Handlers
import { GET as overviewGet } from '../src/app/api/automation/research/overview/route';
import { GET as jobsGet, POST as jobsPost } from '../src/app/api/automation/research/jobs/route';
import { GET as assignmentsGet, POST as assignmentsPost } from '../src/app/api/automation/research/assignments/route';
import { GET as resultsGet, POST as resultsPost } from '../src/app/api/automation/research/results/route';
import { GET as resultDetailGet } from '../src/app/api/automation/research/results/[id]/route';

const TEST_SECRET = 'test-databank-secret-token';
process.env.ASENZO_AUTOMATION_API_KEY = TEST_SECRET;

const TEST_WORKSPACE = 'test-databank-workspace-' + Date.now();
const ISOLATED_WORKSPACE = 'test-isolated-workspace-' + Date.now();

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

function createReq(url: string, method = 'GET', body?: unknown, headers: Record<string, string> = {}) {
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

async function runDataBankTests() {
  console.log('================================================================');
  console.log('RESEARCH DATA BANK PERSISTENCE & API INTEGRATION TEST SUITE');
  console.log('================================================================\n');

  // [Suite 1] Authentication and Workspace Isolation
  console.log('[Suite 1] Authentication & Workspace Security');
  {
    // Rejects unauthenticated GET /overview
    const unauthReq = new NextRequest(new URL('/api/automation/research/overview', 'http://localhost:3000'));
    const unauthRes = await overviewGet(unauthReq);
    report(unauthRes.status === 401, 'Rejects unauthenticated GET /overview (401)');

    // Rejects unauthenticated GET /jobs
    const unauthJobsReq = new NextRequest(new URL('/api/automation/research/jobs', 'http://localhost:3000'));
    const unauthJobsRes = await jobsGet(unauthJobsReq);
    report(unauthJobsRes.status === 401, 'Rejects unauthenticated GET /jobs (401)');

    // Accepts authenticated GET /overview
    const authReq = createReq('/api/automation/research/overview');
    const authRes = await overviewGet(authReq);
    report(authRes.status === 200, 'Accepts authenticated GET /overview (200)');
    const authBody = await authRes.json();
    report(authBody.success === true, 'Response payload has success: true');
  }

  // [Suite 2] Empty Dataset Handling (No Fabricated Data)
  console.log('\n[Suite 2] Empty Dataset Handling & Real Zero State');
  {
    // Query a brand new isolated workspace with no data
    const emptyOverviewReq = createReq('/api/automation/research/overview', 'GET', undefined, {
      'x-workspace-id': ISOLATED_WORKSPACE
    });
    const emptyOverviewRes = await overviewGet(emptyOverviewReq);
    const emptyOverviewBody = await emptyOverviewRes.json();

    report(emptyOverviewBody.data.total_jobs === 0, 'Empty workspace reports total_jobs = 0 (no fabricated counts)');
    report(emptyOverviewBody.data.total_assignments === 0, 'Empty workspace reports total_assignments = 0');
    report(emptyOverviewBody.data.total_results === 0, 'Empty workspace reports total_results = 0');
    report(emptyOverviewBody.data.jobs_by_status.queued === 0, 'Empty workspace queued jobs = 0');

    // Query jobs for empty workspace
    const emptyJobsReq = createReq('/api/automation/research/jobs', 'GET', undefined, {
      'x-workspace-id': ISOLATED_WORKSPACE
    });
    const emptyJobsRes = await jobsGet(emptyJobsReq);
    const emptyJobsBody = await emptyJobsRes.json();
    report(Array.isArray(emptyJobsBody.data.jobs) && emptyJobsBody.data.jobs.length === 0, 'Empty workspace returns empty jobs array (no mock array fallback)');
    report(emptyJobsBody.data.total === 0, 'Empty workspace reports total = 0');
  }

  // [Suite 3] Persisting and Reading Jobs with Provenance
  console.log('\n[Suite 3] Persisting Research Jobs & Attaching Counts');
  let createdJobId: string = '';
  {
    const jobPayload = {
      objective: 'Discover high-converting client acquisition hooks',
      topic: 'Agency Client Acquisition 2026',
      platform: 'YouTube',
      funnel_stage: 'TOF',
      content_pillar: 'Client Acquisition',
      date_range: 'last_7_days',
      creators: [
        { handle: 'hubermanlab', source_target: 'https://www.instagram.com/hubermanlab/' }
      ],
      sources: [
        { type: 'youtube_search', target: 'https://youtube.com/results?search_query=agency+client+acquisition' }
      ],
      priority: 'high'
    };

    const postJobReq = createReq('/api/automation/research/jobs', 'POST', jobPayload, {
      'idempotency-key': 'idemp-job-' + Date.now()
    });
    const postJobRes = await jobsPost(postJobReq);
    report(postJobRes.status === 201, 'POST /jobs creates job successfully (201)');
    const postJobBody = await postJobRes.json();
    createdJobId = postJobBody.data.id;
    report(Boolean(createdJobId), 'Returns valid created job ID');

    // Query jobs list
    const listJobsReq = createReq('/api/automation/research/jobs');
    const listJobsRes = await jobsGet(listJobsReq);
    report(listJobsRes.status === 200, 'GET /jobs returns 200');
    const listJobsBody = await listJobsRes.json();
    interface QueriedJob {
      id: string;
      topic: string;
      platform: string;
      funnel_stage: string;
      priority: string;
      assignment_count: number;
      result_count: number;
    }
    const foundJob = (listJobsBody.data.jobs as QueriedJob[]).find(j => j.id === createdJobId);
    report(Boolean(foundJob), 'Newly created job appears in GET /jobs');
    report(foundJob?.topic === jobPayload.topic, 'Preserves job topic');
    report(foundJob?.platform === jobPayload.platform, 'Preserves platform');
    report(foundJob?.funnel_stage === jobPayload.funnel_stage, 'Preserves funnel stage');
    report(foundJob?.priority === jobPayload.priority, 'Preserves priority');
    report(typeof foundJob?.assignment_count === 'number', 'Attaches assignment_count');
    report(typeof foundJob?.result_count === 'number', 'Attaches result_count');
  }

  // [Suite 4] Assignments Ingestion & Filtering
  console.log('\n[Suite 4] Research Assignments Ingestion & Querying');
  let createdAssignmentId: string = '';
  {
    const assignPayload = {
      research_job_id: createdJobId,
      assignment_type: 'creator_research',
      platform: 'YouTube',
      creator: 'hubermanlab',
      topic: 'Agency Client Acquisition 2026',
      source_target: 'https://www.instagram.com/hubermanlab/',
      status: 'queued'
    };

    const postAssignReq = createReq('/api/automation/research/assignments', 'POST', assignPayload);
    const postAssignRes = await assignmentsPost(postAssignReq);
    report(postAssignRes.status === 201, 'POST /assignments creates assignment (201)');
    const postAssignBody = await postAssignRes.json();
    createdAssignmentId = postAssignBody.data.id;
    report(Boolean(createdAssignmentId), 'Returns valid assignment ID');

    // Query assignments by job ID
    const listAssignReq = createReq(`/api/automation/research/assignments?research_job_id=${createdJobId}`);
    const listAssignRes = await assignmentsGet(listAssignReq);
    report(listAssignRes.status === 200, 'GET /assignments returns 200');
    const listAssignBody = await listAssignRes.json();
    interface QueriedAssignment {
      id: string;
      assignment_type: string;
      creator: string;
      status: string;
    }
    const foundAssign = (listAssignBody.data.assignments as QueriedAssignment[]).find(a => a.id === createdAssignmentId);
    report(Boolean(foundAssign), 'Assignment appears in GET /assignments for parent job');
    report(foundAssign?.assignment_type === 'creator_research', 'Preserves assignment_type');
    report(foundAssign?.creator === 'hubermanlab', 'Preserves creator handle');
    report(foundAssign?.status === 'queued', 'Preserves status as queued');
  }

  // [Suite 5] Evidence & Results Ingestion, Search, and Provenance
  console.log('\n[Suite 5] Research Results Ingestion & Provenance Detail');
  let createdResultId: string = '';
  {
    const resultPayload = {
      research_job_id: createdJobId,
      research_assignment_id: createdAssignmentId,
      source_url: 'https://youtube.com/watch?v=sample12345',
      source_type: 'video_transcript',
      source_title: 'The Real Reason Agencies Struggle with Inbound',
      platform: 'YouTube',
      creator: 'hubermanlab',
      published_at: new Date().toISOString(),
      topic: 'Agency Client Acquisition 2026',
      hook: 'Most founders confuse consistency with positioning clarity',
      angle: 'Contrarian belief shift',
      claim: 'Publishing more content does not fix unvalidated positioning',
      evidence: {
        transcript_excerpt: 'When an agency posts daily without positioning clarity, reach drops 4x.',
        data_points: ['4x reach drop', 'zero DMs converted'],
        sample_size: 45
      },
      audience_signals: {
        pain: 'Posting consistently with zero leads generated'
      },
      market_signals: {
        trend: 'Shift from volume to high-signal case studies'
      },
      content_patterns: {
        format: 'Dissection narrative'
      },
      evidence_strength: 'verified_dataset',
      classification: 'observed_fact',
      confidence: '0.94',
      raw_source_reference: {
        view_count: 85200,
        like_count: 4200,
        comment_count: 610
      },
      research_agent: 'ACQ-R01'
    };

    const postResultReq = createReq('/api/automation/research/results', 'POST', resultPayload, {
      'idempotency-key': 'idemp-result-' + Date.now()
    });
    const postResultRes = await resultsPost(postResultReq);
    report(postResultRes.status === 201, 'POST /results ingests evidence finding (201)');
    const postResultBody = await postResultRes.json();
    createdResultId = postResultBody.data.id;
    report(Boolean(createdResultId), 'Returns valid result ID');

    // Query results list with search
    const listResReq = createReq(`/api/automation/research/results?search=positioning`);
    const listResRes = await resultsGet(listResReq);
    report(listResRes.status === 200, 'GET /results with search returns 200');
    const listResBody = await listResRes.json();
    interface QueriedResult {
      id: string;
      classification: string;
      source_url: string;
    }
    const foundResult = (listResBody.data.results as QueriedResult[]).find(r => r.id === createdResultId);
    report(Boolean(foundResult), 'Search correctly finds result by claim keyword');
    report(foundResult?.classification === 'observed_fact', 'Preserves classification');
    report(foundResult?.source_url === resultPayload.source_url, 'Preserves safe source URL');

    // Query Result Detail Inspector with Provenance
    const detailReq = createReq(`/api/automation/research/results/${createdResultId}`);
    const detailRes = await resultDetailGet(detailReq, { params: Promise.resolve({ id: createdResultId }) });
    report(detailRes.status === 200, 'GET /results/:id returns 200 for detail inspection');
    const detailBody = await detailRes.json();
    report(detailBody.success === true, 'Detail response has success: true');
    report(detailBody.data.result.id === createdResultId, 'Returns matching result');
    report(detailBody.data.job !== null && detailBody.data.job.id === createdJobId, 'Includes linked parent job provenance');
    report(detailBody.data.assignment !== null && detailBody.data.assignment.id === createdAssignmentId, 'Includes linked assignment provenance');
    report(detailBody.data.result.evidence.sample_size === 45, 'Preserves complex evidence JSON data');
    report(detailBody.data.result.raw_source_reference.view_count === 85200, 'Preserves engagement metrics from raw source reference');
  }

  // [Suite 6] Overview Counts Updated Live
  console.log('\n[Suite 6] Dynamic Overview Counts Verification');
  {
    const overviewReq = createReq('/api/automation/research/overview');
    const overviewRes = await overviewGet(overviewReq);
    const overviewBody = await overviewRes.json();

    report(overviewBody.data.total_jobs >= 1, 'Overview reports total_jobs >= 1 after insert');
    report(overviewBody.data.total_assignments >= 1, 'Overview reports total_assignments >= 1 after insert');
    report(overviewBody.data.total_results >= 1, 'Overview reports total_results >= 1 after insert');
  }

  // [Suite 7] Workspace Isolation Boundary Enforcement
  console.log('\n[Suite 7] Workspace Boundary & Data Leakage Prevention');
  {
    // Try to query the created result using a different workspace ID
    const foreignReq = createReq(`/api/automation/research/results/${createdResultId}`, 'GET', undefined, {
      'x-workspace-id': ISOLATED_WORKSPACE
    });
    const foreignRes = await resultDetailGet(foreignReq, { params: Promise.resolve({ id: createdResultId }) });
    report(foreignRes.status === 404, 'Result cannot be accessed across different workspace ID (404 Not Found)');

    // List results in isolated workspace
    const foreignListReq = createReq('/api/automation/research/results', 'GET', undefined, {
      'x-workspace-id': ISOLATED_WORKSPACE
    });
    const foreignListRes = await resultsGet(foreignListReq);
    const foreignListBody = await foreignListRes.json();
    const leakedResult = (foreignListBody.data.results as { id: string }[]).find(r => r.id === createdResultId);
    report(!leakedResult, 'Zero cross-workspace data leakage in results list');
  }

  console.log('\n================================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runDataBankTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
