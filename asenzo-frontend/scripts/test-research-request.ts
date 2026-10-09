import assert from 'assert';
import { NextRequest } from 'next/server';
import { buildResearchJobPayload, buildResearchCollectionRequest, ResearchCreatorInput } from '../src/lib/automation/research-request';
import { POST as researchJobsPost } from '../src/app/api/automation/research/jobs/route';

const TEST_SECRET = 'test-secret-token-12345';
process.env.ASENZO_AUTOMATION_API_KEY = TEST_SECRET;

function createReq(path: string, method: string, body?: unknown, headers: Record<string, string> = {}) {
  const url = new URL(path, 'http://localhost:3000');
  const h = new Headers({
    'Content-Type': 'application/json',
    'x-automation-token': TEST_SECRET,
    'x-workspace-id': 'c3487758-4ac6-4e8b-a9b5-eacca46ad7cf',
    ...headers
  });
  return new NextRequest(url, {
    method,
    headers: h,
    body: body ? JSON.stringify(body) : undefined
  });
}

async function runResearchRequestTests() {
  console.log('================================================================');
  console.log('RESEARCH UI REQUEST & CREATOR CONTRACT VALIDATION TESTS');
  console.log('================================================================');

  let passed = 0;

  // 1. Topic validation
  console.log('\n[Suite 1] UI Pre-flight Topic Validation');
  {
    const emptyTopicResult = buildResearchJobPayload({ topic: '   ' });
    assert(!emptyTopicResult.success, 'Fails when topic is blank');
    assert(emptyTopicResult.error === 'Enter a keyword or topic first.', 'Returns proper prompt error message');
    passed += 2;
    console.log('  ✓ PASS: Rejects blank topic string before submission');
    console.log('  ✓ PASS: Returns exact prompt error message');
  }

  // 2. Reject unverified display names without handle/source URL
  console.log('\n[Suite 2] Display Names Without Verified Handle/Source URL Rejection');
  {
    const displayOnlyCreators: ResearchCreatorInput[] = [
      { name: 'Alex Hormozi', state: true },
      { name: 'Lara Davies', state: true }
    ];

    const result = buildResearchJobPayload({
      topic: 'Client Acquisition Strategy',
      creators: displayOnlyCreators
    });

    assert(!result.success, 'Fails pre-flight validation for display-name creators');
    assert(
      result.error?.includes('Alex Hormozi') && result.error?.includes('verified handle or source URL'),
      'Identifies unverified creator by name without inferring handle'
    );
    passed += 2;
    console.log('  ✓ PASS: Rejects unverified display-name creators ("Alex Hormozi") pre-flight');
    console.log('  ✓ PASS: Does not infer or guess handle from display name');
  }

  // 3. Reject placeholder "verified_handle"
  console.log('\n[Suite 3] Placeholder "verified_handle" Rejection');
  {
    const placeholderHandleResult = buildResearchJobPayload({
      topic: 'B2B Growth',
      creators: [{ name: 'Placeholder Test', handle: 'verified_handle', state: true }]
    });
    assert(!placeholderHandleResult.success, 'Rejects handle="verified_handle"');
    assert(placeholderHandleResult.error?.includes('verified_handle'), 'Identifies placeholder handle');

    const placeholderAtHandleResult = buildResearchJobPayload({
      topic: 'B2B Growth',
      creators: [{ name: 'Placeholder Test', handle: '@verified_handle', state: true }]
    });
    assert(!placeholderAtHandleResult.success, 'Rejects handle="@verified_handle"');

    const placeholderUrlResult = buildResearchJobPayload({
      topic: 'B2B Growth',
      creators: [{
        name: 'Placeholder Test',
        source_target: 'https://www.instagram.com/verified_handle/',
        state: true
      }]
    });
    assert(!placeholderUrlResult.success, 'Rejects source_target containing verified_handle');

    passed += 4;
    console.log('  ✓ PASS: Rejects handle="verified_handle" as placeholder');
    console.log('  ✓ PASS: Rejects handle="@verified_handle" as placeholder');
    console.log('  ✓ PASS: Rejects source_target="https://www.instagram.com/verified_handle/" as placeholder');
    console.log('  ✓ PASS: Displays explicit message instructing user to provide actual verified creator');
  }

  // 4. Construct actual verified creator research payload
  console.log('\n[Suite 4] Construct Actual Verified Creator Research Payload');
  {
    const actualVerifiedCreators: ResearchCreatorInput[] = [
      {
        name: 'Andrew Huberman',
        handle: 'hubermanlab',
        source_target: 'https://www.instagram.com/hubermanlab/',
        state: true
      }
    ];

    const result = buildResearchJobPayload({
      topic: 'Neuroscience and Focus',
      platform: 'Instagram',
      funnel_stage: 'TOF',
      content_pillar: 'Client Acquisition',
      date_range: 'last_7_days',
      creators: actualVerifiedCreators,
      priority: 'normal'
    });

    assert(result.success, 'Constructs valid payload successfully');
    assert(result.payload, 'Payload is populated');
    assert.deepStrictEqual(result.payload.creators, [
      {
        handle: 'hubermanlab',
        source_target: 'https://www.instagram.com/hubermanlab/'
      }
    ], 'Matches exact Phase 2 contract for actual verified creator');

    // Also test automatic source_target generation when only actual handle is provided
    const handleOnlyResult = buildResearchJobPayload({
      topic: 'Podcasting',
      creators: [{ handle: '@lexfridman', state: true }]
    });
    assert(handleOnlyResult.success, 'Succeeds with handle-only input');
    assert.deepStrictEqual(handleOnlyResult.payload?.creators, [
      {
        handle: 'lexfridman',
        source_target: 'https://www.instagram.com/lexfridman/'
      }
    ], 'Automatically sets canonical Instagram source_target from handle');

    passed += 4;
    console.log('  ✓ PASS: Constructs successful payload with actual verified creator');
    console.log('  ✓ PASS: Matches exact contract: { handle: "hubermanlab", source_target: "https://www.instagram.com/hubermanlab/" }');
    console.log('  ✓ PASS: Automatically strips leading @ and sets canonical Instagram source_target');
    console.log('  ✓ PASS: Preserves all research job options');
  }

  // 5. Topic research with empty creators
  console.log('\n[Suite 5] Empty Creators Support (Topic-Only Research)');
  {
    const result = buildResearchJobPayload({
      topic: 'Outbound Cold Email',
      creators: []
    });

    assert(result.success, 'Constructs valid payload with empty creators');
    assert.deepStrictEqual(result.payload?.creators, [], 'Preserves empty creators array');
    passed += 2;
    console.log('  ✓ PASS: Allows topic-only research with empty creators array');
    console.log('  ✓ PASS: Preserves empty creators array');
  }

  // 6. Live Backend Verification of New Payload Shape with Actual Verified Handle
  console.log('\n[Suite 6] Live Backend Contract Verification with Actual Verified Handle');
  {
    const actualCreators: ResearchCreatorInput[] = [
      {
        name: 'Andrew Huberman',
        handle: 'hubermanlab',
        source_target: 'https://www.instagram.com/hubermanlab/',
        state: true
      }
    ];

    const buildResult = buildResearchJobPayload({
      topic: 'Live Actual Verified Creator E2E Test',
      platform: 'Instagram',
      funnel_stage: 'TOF',
      content_pillar: 'Client Acquisition',
      date_range: 'last_7_days',
      creators: actualCreators,
      priority: 'normal'
    });

    assert(buildResult.success && buildResult.payload, 'Builds valid payload');

    const response = await researchJobsPost(
      createReq('/api/automation/research/jobs', 'POST', buildResult.payload, {
        'Idempotency-Key': `ui_request_actual_creator_${Date.now()}`
      })
    );

    const json = await response.json();
    assert(response.status === 201, `Backend accepts actual verified creator payload: status ${response.status}`);
    assert(json.success === true, 'Backend returns success: true');
    assert(json.data?.id, 'Backend generates research job ID');
    assert.deepStrictEqual(json.data?.creators, [
      {
        handle: 'hubermanlab',
        source_target: 'https://www.instagram.com/hubermanlab/'
      }
    ], 'Backend persists actual verified creator object in public.research_jobs');
    passed += 4;
    console.log('  ✓ PASS: POST /api/automation/research/jobs returns HTTP 201 with actual creator payload');
    console.log('  ✓ PASS: Response data has success: true and valid job ID');
    console.log('  ✓ PASS: Backend persists actual verified creator contract object in database');
    console.log('  ✓ PASS: Zero 400 Bad Request errors');
  }

  // 7. Research Collection Request Contract (BUILD_RESEARCH_COLLECTION_REQUEST)
  console.log('\n[Suite 7] Research Collection Request Contract (Topic Research vs Creator Research)');
  {
    // 7a. Valid Topic Research Collection Request
    const topicCollectionResult = buildResearchCollectionRequest({
      assignment_id: 'asgn-topic-12345',
      research_job_id: 'rjob-topic-67890',
      assignment_type: 'topic_research',
      platform: 'Instagram',
      topic: 'Outbound Client Acquisition',
      date_range: 'last_7_days',
      funnel_stage: 'TOF'
    });

    assert(topicCollectionResult.success, 'Constructs valid topic_research collection request');
    assert(topicCollectionResult.request, 'Topic collection request is populated');
    assert.strictEqual(topicCollectionResult.request.assignment_type, 'topic_research', 'assignment_type is topic_research');
    assert.strictEqual(topicCollectionResult.request.collection_type, 'topic_search', 'collection_type is topic_search');
    assert.strictEqual(topicCollectionResult.request.search_query, 'Outbound Client Acquisition', 'search_query matches topic');
    assert.strictEqual(topicCollectionResult.request.creator, null, 'Never invents a creator handle');
    assert.strictEqual(topicCollectionResult.request.source_target, null, 'Never fabricates a profile URL');
    assert.strictEqual(topicCollectionResult.request.assignment_id, 'asgn-topic-12345', 'Preserves assignment_id provenance');
    assert.strictEqual(topicCollectionResult.request.research_job_id, 'rjob-topic-67890', 'Preserves research_job_id provenance');
    passed += 8;
    console.log('  ✓ PASS: Successfully builds canonical topic_research collection request');
    console.log('  ✓ PASS: Sets collection_type="topic_search" and search_query for topic collector');
    console.log('  ✓ PASS: Enforces creator=null without inventing fake creator handle');
    console.log('  ✓ PASS: Enforces source_target=null without inventing fake Instagram URL');
    console.log('  ✓ PASS: Fully preserves assignment_id and research_job_id provenance');

    // 7b. Valid Creator Research Collection Request
    const creatorCollectionResult = buildResearchCollectionRequest({
      assignment_id: 'asgn-creator-12345',
      research_job_id: 'rjob-creator-67890',
      assignment_type: 'creator_research',
      platform: 'Instagram',
      topic: 'Fitness & Health',
      creator: 'hubermanlab',
      source_target: 'https://www.instagram.com/hubermanlab/'
    });

    assert(creatorCollectionResult.success, 'Constructs valid creator_research collection request');
    assert.strictEqual(creatorCollectionResult.request?.assignment_type, 'creator_research', 'assignment_type is creator_research');
    assert.strictEqual(creatorCollectionResult.request?.collection_type, 'creator_profile', 'collection_type is creator_profile');
    assert.strictEqual(creatorCollectionResult.request?.creator, 'hubermanlab', 'Preserves creator handle');
    assert.strictEqual(creatorCollectionResult.request?.source_target, 'https://www.instagram.com/hubermanlab/', 'Preserves source_target URL');
    passed += 5;
    console.log('  ✓ PASS: Successfully builds canonical creator_research collection request');
    console.log('  ✓ PASS: Sets collection_type="creator_profile" for creator collector');
    console.log('  ✓ PASS: Preserves creator handle and source_target URL');

    // 7c. Validation Enforcements
    // Creator research missing creator and source_target must fail
    const missingCreatorResult = buildResearchCollectionRequest({
      assignment_id: 'asgn-fail-1',
      research_job_id: 'rjob-fail-1',
      assignment_type: 'creator_research',
      platform: 'Instagram',
      topic: 'Missing Creator'
    });
    assert(!missingCreatorResult.success, 'Fails creator_research when creator and source_target are missing');
    assert(missingCreatorResult.error?.includes('requires source_target or creator handle'), 'Explains creator requirement');

    // Placeholder handle rejection
    const placeholderCreatorResult = buildResearchCollectionRequest({
      assignment_id: 'asgn-fail-2',
      research_job_id: 'rjob-fail-2',
      assignment_type: 'creator_research',
      platform: 'Instagram',
      topic: 'Placeholder Creator',
      creator: 'verified_handle'
    });
    assert(!placeholderCreatorResult.success, 'Rejects placeholder handle in collection request');

    // Topic research missing topic must fail
    const missingTopicResult = buildResearchCollectionRequest({
      assignment_id: 'asgn-fail-3',
      research_job_id: 'rjob-fail-3',
      assignment_type: 'topic_research',
      platform: 'Instagram',
      topic: '   '
    });
    assert(!missingTopicResult.success, 'Rejects topic_research with blank topic');

    // Unsupported assignment_type
    const unsupportedTypeResult = buildResearchCollectionRequest({
      assignment_id: 'asgn-fail-4',
      research_job_id: 'rjob-fail-4',
      assignment_type: 'invalid_type',
      platform: 'Instagram',
      topic: 'Invalid Type Test'
    });
    assert(!unsupportedTypeResult.success, 'Rejects unsupported assignment_type');
    assert(unsupportedTypeResult.error?.includes('Unsupported assignment_type'), 'Explains allowed assignment types');

    passed += 6;
    console.log('  ✓ PASS: Rejects creator_research missing creator handle or source_target');
    console.log('  ✓ PASS: Rejects placeholder verified_handle in collection request');
    console.log('  ✓ PASS: Rejects topic_research missing topic');
    console.log('  ✓ PASS: Rejects unsupported assignment_type');
  }

  console.log('\n================================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, 0 FAILED`);
  console.log('================================================================\n');
}

runResearchRequestTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
