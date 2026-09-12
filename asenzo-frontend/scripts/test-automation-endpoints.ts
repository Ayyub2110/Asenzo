import { NextRequest } from 'next/server';

// Import Route Handlers directly
import { GET as healthGet } from '../src/app/api/automation/health/route';
import { GET as founderContextGet } from '../src/app/api/automation/founder-context/route';
import { GET as audienceContextGet } from '../src/app/api/automation/audience-context/route';
import { GET as contentContextGet } from '../src/app/api/automation/content-context/route';
import { GET as intelligenceCardsGet, POST as intelligenceCardsPost } from '../src/app/api/automation/intelligence-cards/route';
import { GET as researchJobGet } from '../src/app/api/automation/research/jobs/[id]/route';
import { POST as researchJobsPost } from '../src/app/api/automation/research/jobs/route';
import { POST as researchResultsPost } from '../src/app/api/automation/research/results/route';
import { GET as contentIdeaGet } from '../src/app/api/automation/content-ideas/[id]/route';
import { POST as contentIdeasPost } from '../src/app/api/automation/content-ideas/route';
import { GET as contentAssetGet } from '../src/app/api/automation/content-assets/[id]/route';
import { POST as contentAssetsPost } from '../src/app/api/automation/content-assets/route';
import { POST as agentRunsPost } from '../src/app/api/automation/agent-runs/route';
import { GET as agentRunGet } from '../src/app/api/automation/agent-runs/[id]/route';
import { POST as approvalsPost } from '../src/app/api/automation/approvals/route';
import { GET as approvalGet } from '../src/app/api/automation/approvals/[id]/route';
import { POST as approvalDecisionPost } from '../src/app/api/automation/approvals/[id]/decision/route';
import { GET as contentPerformanceGet, POST as contentPerformancePost } from '../src/app/api/automation/content-performance/route';

const TEST_SECRET = 'test-secret-token-12345';
process.env.ASENZO_AUTOMATION_API_KEY = TEST_SECRET;

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail?: any) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`, detail ? detail : '');
    failedTests++;
  }
}

function createReq(url: string, method = 'GET', body?: any, headers: Record<string, string> = {}) {
  const finalHeaders: Record<string, string> = {
    'x-automation-token': TEST_SECRET,
    'x-workspace-id': 'test-workspace',
    'Content-Type': 'application/json',
    ...headers
  };

  const init: RequestInit = {
    method,
    headers: finalHeaders
  };

  if (body) {
    init.body = JSON.stringify(body);
  }

  return new NextRequest(new URL(url, 'http://localhost:3000'), init);
}

async function runTests() {
  console.log('\n======================================================');
  console.log('RUNNING AUTOMATED TESTS FOR ASENZO AUTOMATION APIS');
  console.log('======================================================\n');

  // TEST 1: Authentication Guard
  console.log('[Suite 1] Authentication & Authorization Guard');
  {
    const reqMissing = new NextRequest(new URL('/api/automation/health', 'http://localhost:3000'), {
      method: 'GET',
      headers: {}
    });
    const resMissing = await healthGet(reqMissing);
    const jsonMissing = await resMissing.json();
    assert(resMissing.status === 401, 'Rejects request with missing token (401)');
    assert(jsonMissing.error?.code === 'UNAUTHORIZED', 'Returns UNAUTHORIZED error code');

    const reqInvalid = new NextRequest(new URL('/api/automation/health', 'http://localhost:3000'), {
      method: 'GET',
      headers: { 'x-automation-token': 'wrong-token' }
    });
    const resInvalid = await healthGet(reqInvalid);
    assert(resInvalid.status === 401, 'Rejects request with invalid token (401)');

    const reqValid = createReq('/api/automation/health');
    const resValid = await healthGet(reqValid);
    const jsonValid = await resValid.json();
    assert(resValid.status === 200, 'Accepts request with valid token (200)');
    assert(jsonValid.success === true, 'Health check returns success: true');
    assert(jsonValid.workspace_id === 'test-workspace', 'Extracts workspace ID from header');
  }

  // TEST 2: Context Endpoints
  console.log('\n[Suite 2] Context Endpoints (Founder / Audience / Content)');
  {
    const resFounder = await founderContextGet(createReq('/api/automation/founder-context'));
    const jsonFounder = await resFounder.json();
    assert(resFounder.status === 200, 'GET /founder-context returns 200');
    assert(Boolean(jsonFounder.data?.core_dna), 'Returns core_dna in founder context');

    const resAudience = await audienceContextGet(createReq('/api/automation/audience-context'));
    const jsonAudience = await resAudience.json();
    assert(resAudience.status === 200, 'GET /audience-context returns 200');
    assert(Array.isArray(jsonAudience.data?.pains), 'Returns pains list in audience context');

    const resContent = await contentContextGet(createReq('/api/automation/content-context'));
    const jsonContent = await resContent.json();
    assert(resContent.status === 200, 'GET /content-context returns 200');
    assert(Array.isArray(jsonContent.data?.winning_patterns), 'Returns winning_patterns in content context');
  }

  // TEST 3: Intelligence Cards
  console.log('\n[Suite 3] Intelligence Cards & Observation Types');
  {
    // Invalid observation type
    const resInvalidType = await intelligenceCardsPost(createReq('/api/automation/intelligence-cards', 'POST', {
      source_type: 'sales_call',
      category: 'objection',
      signal_type: 'pricing',
      exact_language: 'Too expensive',
      observation_type: 'invalid_type_test'
    }));
    assert(resInvalidType.status === 400, 'Rejects invalid observation_type (400)');

    // Valid card creation
    const resCard = await intelligenceCardsPost(createReq('/api/automation/intelligence-cards', 'POST', {
      source_type: 'sales_call',
      source_id: 'call_99',
      category: 'objection',
      stage: 'BOF',
      signal_type: 'trust_gap',
      exact_language: 'How do I know this works for bootstrapped founders?',
      context: 'Live demo with founder prospect',
      emotion: 'Skepticism',
      observation_type: 'observed_fact',
      confidence: 0.95,
      human_verified: false
    }));
    const jsonCard = await resCard.json();
    assert(resCard.status === 201, 'Creates valid intelligence card (201)');
    assert(jsonCard.data?.exact_language === 'How do I know this works for bootstrapped founders?', 'Preserves exact language');
    assert(jsonCard.data?.observation_type === 'observed_fact', 'Preserves observation_type');

    // Query cards
    const resList = await intelligenceCardsGet(createReq('/api/automation/intelligence-cards'));
    const jsonList = await resList.json();
    assert(resList.status === 200, 'GET /intelligence-cards returns 200');
    assert(jsonList.data.length >= 1, 'Returns list of intelligence cards');
  }

  // TEST 4: Idempotency & Duplicate Prevention
  console.log('\n[Suite 4] Idempotency Engine & Duplicate Prevention');
  {
    const idemKey = `idem_${Date.now()}_test`;
    const payload = {
      objective: 'Analyze viral AI hooks on LinkedIn',
      topic: 'AI Automation',
      platform: 'LinkedIn'
    };

    const req1 = createReq('/api/automation/research/jobs', 'POST', payload, { 'Idempotency-Key': idemKey });
    const res1 = await researchJobsPost(req1);
    const json1 = await res1.json();
    assert(res1.status === 201, 'First request with Idempotency-Key creates job (201)');

    const req2 = createReq('/api/automation/research/jobs', 'POST', payload, { 'Idempotency-Key': idemKey });
    const res2 = await researchJobsPost(req2);
    const json2 = await res2.json();
    assert(res2.status === 201, 'Second request with same Idempotency-Key returns cached response (201)');
    assert(json1.data?.id === json2.data?.id, 'Returned ID is identical without creating duplicate');
  }

  // TEST 5: Research Jobs & Results Ingestion
  console.log('\n[Suite 5] Research Jobs & Results Ingestion');
  let createdJobId = '';
  {
    const resJob = await researchJobsPost(createReq('/api/automation/research/jobs', 'POST', {
      objective: 'Scrape competitor positioning',
      topic: 'Competitor Intelligence',
      platform: 'YouTube'
    }));
    const jsonJob = await resJob.json();
    createdJobId = jsonJob.data.id;
    assert(Boolean(createdJobId), 'Created research job and received ID');

    // Get job by ID
    const resGetJob = await researchJobGet(createReq(`/api/automation/research/jobs/${createdJobId}`), {
      params: Promise.resolve({ id: createdJobId })
    });
    assert(resGetJob.status === 200, 'GET /research/jobs/:id returns 200');

    // Ingest research result
    const resResult = await researchResultsPost(createReq('/api/automation/research/results', 'POST', {
      job_id: createdJobId,
      topic: 'Competitor Intelligence',
      angle: 'Why Competitor X fails at onboarding',
      format: 'Short Video',
      platform: 'YouTube',
      creator_source: 'TechReviewer',
      source_url: 'https://youtube.com/watch?v=123',
      evidence: { views: 50000 },
      score: 85,
      classification: 'proven'
    }));
    const jsonResult = await resResult.json();
    assert(resResult.status === 201, 'POST /research/results returns 201');
    assert(jsonResult.data.classification === 'proven', 'Preserves classification');
  }

  // TEST 6: Content Ideas & Assets
  console.log('\n[Suite 6] Content Ideas & Assets Pipeline');
  let createdIdeaId = '';
  let createdAssetId = '';
  {
    const resIdea = await contentIdeasPost(createReq('/api/automation/content-ideas', 'POST', {
      topic: 'Why Automation Fails Without Strategy',
      angle: 'Automating a broken process just gives you faster mess',
      audience: 'Founders',
      score: 93,
      scoring_dimensions: { virality: 9, relevance: 9.5 }
    }));
    const jsonIdea = await resIdea.json();
    createdIdeaId = jsonIdea.data.id;
    assert(resIdea.status === 201, 'POST /content-ideas returns 201');

    const resGetIdea = await contentIdeaGet(createReq(`/api/automation/content-ideas/${createdIdeaId}`), {
      params: Promise.resolve({ id: createdIdeaId })
    });
    assert(resGetIdea.status === 200, 'GET /content-ideas/:id returns 200');

    // Create Content Asset (Draft / Script)
    const resAsset = await contentAssetsPost(createReq('/api/automation/content-assets', 'POST', {
      idea_id: createdIdeaId,
      topic: 'Why Automation Fails Without Strategy',
      hook: 'Automating a broken process just produces broken outcomes 10x faster.',
      script_body: 'Step 1: Map the canonical workflow.\nStep 2: Install human quality gates.\nStep 3: Orchestrate with n8n.',
      status: 'review_required',
      approval_status: 'pending'
    }));
    const jsonAsset = await resAsset.json();
    createdAssetId = jsonAsset.data.id;
    assert(resAsset.status === 201, 'POST /content-assets returns 201');
    assert(jsonAsset.data.approval_status === 'pending', 'Sets initial approval status to pending');

    const resGetAsset = await contentAssetGet(createReq(`/api/automation/content-assets/${createdAssetId}`), {
      params: Promise.resolve({ id: createdAssetId })
    });
    assert(resGetAsset.status === 200, 'GET /content-assets/:id returns 200');
  }

  // TEST 7: Agent Runs Telemetry
  console.log('\n[Suite 7] Agent Runs & Telemetry Persistence');
  {
    const resRun = await agentRunsPost(createReq('/api/automation/agent-runs', 'POST', {
      agent_id: 'ACQ-C05',
      workflow_id: 'wf_script_drafting_01',
      task: 'Generate script draft from idea',
      model: 'gemini-1.5-pro',
      prompt_version: 'v1.2',
      duration_ms: 2400,
      status: 'completed',
      score: 91,
      input_payload: { idea_id: createdIdeaId },
      output_payload: { asset_id: createdAssetId }
    }));
    const jsonRun = await resRun.json();
    const runId = jsonRun.data.id;
    assert(resRun.status === 201, 'POST /agent-runs returns 201');

    const resGetRun = await agentRunGet(createReq(`/api/automation/agent-runs/${runId}`), {
      params: Promise.resolve({ id: runId })
    });
    assert(resGetRun.status === 200, 'GET /agent-runs/:id returns 200');
  }

  // TEST 8: Human Approvals & Decision Flow
  console.log('\n[Suite 8] Human Approvals & Decision Lifecycles');
  {
    const resAppr = await approvalsPost(createReq('/api/automation/approvals', 'POST', {
      entity_type: 'content_asset',
      entity_id: createdAssetId,
      action: 'publish_post',
      requested_by: 'ACQ-C05'
    }));
    const jsonAppr = await resAppr.json();
    const approvalId = jsonAppr.data.id;
    assert(resAppr.status === 201, 'POST /approvals registers pending approval (201)');

    const resGetAppr = await approvalGet(createReq(`/api/automation/approvals/${approvalId}`), {
      params: Promise.resolve({ id: approvalId })
    });
    assert(resGetAppr.status === 200, 'GET /approvals/:id returns 200');

    // Submit Approval Decision
    const resDecision = await approvalDecisionPost(createReq(`/api/automation/approvals/${approvalId}/decision`, 'POST', {
      decision: 'approved',
      reviewer_id: 'founder_mark',
      feedback: 'Approved for posting on LinkedIn.'
    }), {
      params: Promise.resolve({ id: approvalId })
    });
    const jsonDecision = await resDecision.json();
    assert(resDecision.status === 200, 'POST /approvals/:id/decision resolves approval (200)');
    assert(jsonDecision.data.status === 'approved', 'State updated to approved');
    assert(jsonDecision.data.reviewer_id === 'founder_mark', 'Records reviewer identity');
  }

  // TEST 9: Content Performance & Learning Loop Ingestion
  console.log('\n[Suite 9] Content Performance & Feedback Ingestion');
  {
    const resPerf = await contentPerformancePost(createReq('/api/automation/content-performance', 'POST', {
      content_id: createdAssetId,
      platform: 'LinkedIn',
      views: 15400,
      engagements: 420,
      comments: 65,
      leads: 12,
      revenue_influenced: 3000,
      source_provenance: 'LinkedIn API Webhook'
    }));
    const jsonPerf = await resPerf.json();
    assert(resPerf.status === 201, 'POST /content-performance ingests metrics (201)');
    assert(jsonPerf.data.leads === 12, 'Accurately records pipeline metrics');

    const resGetPerf = await contentPerformanceGet(createReq('/api/automation/content-performance'));
    const jsonGetPerf = await resGetPerf.json();
    assert(resGetPerf.status === 200, 'GET /content-performance returns 200');
    assert(jsonGetPerf.data.length >= 1, 'Returns list of performance records');
  }

  console.log('\n======================================================');
  console.log(`TEST SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log('======================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
