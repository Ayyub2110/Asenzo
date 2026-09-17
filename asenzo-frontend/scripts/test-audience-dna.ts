import { NextRequest } from 'next/server';
import { POST as audienceDnaPost, GET as audienceDnaGet } from '../src/app/api/automation/audience-dna/route';
import { fetchAudienceContext, insertAudienceDna } from '../src/lib/automation/db';

const TEST_SECRET = 'test-secret-token-12345';
process.env.ASENZO_AUTOMATION_API_KEY = TEST_SECRET;

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: any) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`, detail ? detail : '');
    failed++;
  }
}

function createReq(url: string, method = 'POST', body?: any, headers: Record<string, string> = {}) {
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

  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  return new NextRequest(new URL(url, 'http://localhost:3000'), init as any);
}

const SAMPLE_N8N_AUDIENCE_DNA = {
  workspace_id: 'test-workspace-dna',
  source_type: 'audience_dna',
  category: 'AUDIENCE',
  dna_type: 'AUDIENCE',
  audience_dna: {
    core_pains: [
      'Founder calendar completely blocked by sales calls with unqualified prospects',
      'High client churn caused by misaligned expectations during sales'
    ],
    core_desires: [
      'Scale business revenue without founder being delivery bottleneck',
      'Systematize organic lead flow into predictable pipeline'
    ],
    fears: [
      'Hiring an agency that burns cash with zero qualified deals'
    ],
    frustrations: [
      'Spending 15 hours a week creating content that yields zero inbound leads'
    ],
    beliefs: [
      'Believes high-ticket B2B deals require founder-led trust'
    ],
    motivations: [
      'Wants to transition from operator to true owner'
    ],
    aspirations: [
      'Build a $100k/mo automated client acquisition engine'
    ],
    objections: [
      'Our niche is too unique for automated qualification'
    ],
    decision_triggers: [
      'Founder capacity ceiling hit at 60 hours per week'
    ],
    awareness_patterns: [
      'Problem-aware but unaware that pipeline architecture is the bottleneck'
    ],
    natural_language: [
      "I feel like I'm running on a treadmill that gets faster every month."
    ],
    behaviors: [
      'Consistently posts on LinkedIn but has no lead capture mechanism'
    ],
    relevant_audience_behaviors: [
      'Attends webinars and downloads templates but rarely books calls'
    ],
    decision_criteria: [
      'Must integrate with existing CRM and calendar without complex custom code'
    ]
  },
  evidence: [
    {
      source_id: 'interview_rec_42',
      quote: "I'm working 60 hours a week and cannot take another sales call.",
      verified: true
    }
  ],
  generated_at: new Date().toISOString(),
  metadata: {
    module: 'ACQUISITION',
    component: 'C03_AUDIENCE_DNA',
    version: 'v1'
  }
};

async function runAudienceDnaTests() {
  console.log('\n======================================================');
  console.log('AUDIENCE DNA PERSISTENCE & AUTOMATION ENDPOINT TESTS');
  console.log('======================================================\n');

  // TEST 1: Valid Audience DNA POST
  console.log('[Test 1] Valid Audience DNA POST');
  {
    const req = createReq('/api/automation/audience-dna', 'POST', SAMPLE_N8N_AUDIENCE_DNA);
    const res = await audienceDnaPost(req);
    const json = await res.json();

    assert(res.status === 201, 'POST /api/automation/audience-dna returns 201 Created');
    assert(json.success === true, 'Response contains success: true');
    assert(Boolean(json.data?.id), 'Canonical saved record has generated ID');
    assert(Boolean(json.data?.workspace_id) && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(json.data.workspace_id), 'Resolves workspace_id to canonical UUID');
    assert(json.data?.version === 1, 'Initial saved record has version 1');
    assert(Array.isArray(json.data?.pain) && json.data.pain.length === 2, 'Maps core_pains to canonical pain column');
    assert(Array.isArray(json.data?.fears) && json.data.fears.length === 1, 'Maps fears to canonical fears column');
    assert(Array.isArray(json.data?.objections), 'Maps objections to canonical objections column');
    assert(Array.isArray(json.data?.evidence) && json.data.evidence.length === 1, 'Persists evidence array');
  }

  // TEST 2: Missing workspace_id
  console.log('\n[Test 2] Missing workspace_id Validation');
  {
    const invalidPayload = { ...SAMPLE_N8N_AUDIENCE_DNA, workspace_id: '' };
    const req = createReq('/api/automation/audience-dna', 'POST', invalidPayload);
    const res = await audienceDnaPost(req);
    const json = await res.json();

    assert(res.status === 400, 'Rejects payload with missing workspace_id (400)');
    assert(json.error?.code === 'MISSING_REQUIRED_FIELD', 'Returns MISSING_REQUIRED_FIELD error code');
    assert(json.error?.message?.includes('workspace_id'), 'Error message specifies workspace_id is required');
  }

  // TEST 3: Missing audience_dna
  console.log('\n[Test 3] Missing audience_dna Validation');
  {
    const invalidPayload = { workspace_id: 'test-workspace' };
    const req = createReq('/api/automation/audience-dna', 'POST', invalidPayload);
    const res = await audienceDnaPost(req);
    const json = await res.json();

    assert(res.status === 400, 'Rejects payload with missing audience_dna (400)');
    assert(json.error?.code === 'MISSING_REQUIRED_FIELD', 'Returns MISSING_REQUIRED_FIELD error code');
    assert(json.error?.message?.includes('audience_dna'), 'Error message specifies audience_dna is required');
  }

  // TEST 4: Invalid audience_dna structure
  console.log('\n[Test 4] Invalid audience_dna Structure Validation');
  {
    // Not an object
    const notObjReq = createReq('/api/automation/audience-dna', 'POST', {
      workspace_id: 'test-workspace',
      audience_dna: 'invalid-string'
    });
    const notObjRes = await audienceDnaPost(notObjReq);
    const notObjJson = await notObjRes.json();
    assert(notObjRes.status === 400, 'Rejects non-object audience_dna (400)');
    assert(notObjJson.error?.code === 'VALIDATION_FAILED', 'Returns VALIDATION_FAILED error code');

    // Category not an array
    const notArrReq = createReq('/api/automation/audience-dna', 'POST', {
      workspace_id: 'test-workspace',
      audience_dna: {
        core_pains: 'not-an-array'
      }
    });
    const notArrRes = await audienceDnaPost(notArrReq);
    const notArrJson = await notArrRes.json();
    assert(notArrRes.status === 400, 'Rejects non-array category in audience_dna (400)');
    assert(notArrJson.error?.message?.includes('must be an array'), 'Error explains category must be an array');

    // Category item not a string
    const notStrReq = createReq('/api/automation/audience-dna', 'POST', {
      workspace_id: 'test-workspace',
      audience_dna: {
        core_pains: [123, 456]
      }
    });
    const notStrRes = await audienceDnaPost(notStrReq);
    const notStrJson = await notStrRes.json();
    assert(notStrRes.status === 400, 'Rejects non-string item in category array (400)');
    assert(notStrJson.error?.message?.includes('must be strings'), 'Error explains items must be strings');
  }

  // TEST 5: Invalid authentication token
  console.log('\n[Test 5] Authentication & Security Guard');
  {
    const reqNoAuth = new NextRequest(new URL('/api/automation/audience-dna', 'http://localhost:3000'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(SAMPLE_N8N_AUDIENCE_DNA)
    });
    const resNoAuth = await audienceDnaPost(reqNoAuth);
    assert(resNoAuth.status === 401, 'Rejects request missing x-automation-token (401)');

    const reqWrongAuth = createReq('/api/automation/audience-dna', 'POST', SAMPLE_N8N_AUDIENCE_DNA, {
      'x-automation-token': 'bad-token'
    });
    const resWrongAuth = await audienceDnaPost(reqWrongAuth);
    assert(resWrongAuth.status === 401, 'Rejects request with invalid x-automation-token (401)');
  }

  // TEST 6: Database Failure Handling
  console.log('\n[Test 6] Database Failure & Error Surfacing');
  {
    // Pass malformed payload that triggers internal DB error
    try {
      await insertAudienceDna({
        workspace_id: '',
        audience_dna: {} as any
      });
      assert(false, 'insertAudienceDna throws when input is invalid');
    } catch (err: any) {
      assert(Boolean(err?.message), 'insertAudienceDna throws and surfaces error: ' + err?.message);
    }
  }

  // TEST 7: Version Behavior (Auto-Incrementing & Context Resolver)
  console.log('\n[Test 7] Versioning Behavior & Context Resolution');
  {
    const versionWorkspace = 'version-test-workspace';

    // First save -> version 1
    const resV1 = await audienceDnaPost(createReq('/api/automation/audience-dna', 'POST', {
      ...SAMPLE_N8N_AUDIENCE_DNA,
      workspace_id: versionWorkspace
    }));
    const jsonV1 = await resV1.json();
    assert(resV1.status === 201, 'First save returns 201');
    assert(jsonV1.data?.version === 1, 'First record assigned version = 1');

    // Second save -> version 2
    const resV2 = await audienceDnaPost(createReq('/api/automation/audience-dna', 'POST', {
      ...SAMPLE_N8N_AUDIENCE_DNA,
      workspace_id: versionWorkspace,
      audience_dna: {
        ...SAMPLE_N8N_AUDIENCE_DNA.audience_dna,
        core_pains: ['Updated pain point in version 2']
      }
    }));
    const jsonV2 = await resV2.json();
    assert(resV2.status === 201, 'Second save returns 201');
    assert(jsonV2.data?.version === 2, 'Second record automatically increments version = 2');

    // fetchAudienceContext resolves the latest version
    const resolvedContext = await fetchAudienceContext(versionWorkspace);
    assert(resolvedContext.version === 2, 'fetchAudienceContext retrieves latest version (v2)');
    assert(
      Array.isArray((resolvedContext as any).pain) &&
      (resolvedContext as any).pain[0] === 'Updated pain point in version 2',
      'fetchAudienceContext retrieves the updated latest audience DNA data'
    );
  }

  // TEST 8: Successful Response Shape & GET Endpoint
  console.log('\n[Test 8] Response Shape & GET /audience-dna Endpoint');
  {
    const resGet = await audienceDnaGet(createReq('/api/automation/audience-dna?workspace_id=version-test-workspace', 'GET'));
    const jsonGet = await resGet.json();

    assert(resGet.status === 200, 'GET /api/automation/audience-dna returns 200 OK');
    assert(jsonGet.success === true, 'Response has success: true');
    assert(jsonGet.data?.version === 2, 'Returns latest version (v2)');
    assert(Boolean(jsonGet.data?.id), 'Response includes canonical id');
    assert(Boolean(jsonGet.data?.created_at), 'Response includes created_at timestamp');
    assert(Boolean(jsonGet.data?.updated_at), 'Response includes updated_at timestamp');
    assert(jsonGet.data?.status === 'active', 'Response includes status = active');
  }

  console.log('\n======================================================');
  console.log(`AUDIENCE DNA TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runAudienceDnaTests().catch(err => {
  console.error('Test run failed with error:', err);
  process.exit(1);
});
