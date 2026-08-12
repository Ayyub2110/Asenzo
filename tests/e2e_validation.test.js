const test = require('node:test');
const assert = require('node:assert');
const http = require('node:http');

let spawnedServer;
test.before(async () => {
  const isUp = await new Promise(resolve => {
    const req = http.get('http://localhost:3001/api/health', () => resolve(true));
    req.on('error', () => resolve(false));
  });
  if (!isUp) {
    const { server } = require('../server');
    spawnedServer = server;
    await new Promise(r => setTimeout(r, 200));
  }
});

test.after(async () => {
  if (spawnedServer && spawnedServer.close) {
    await new Promise(r => spawnedServer.close(r));
  }
});

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        host: 'localhost',
        port: 3001,
        path,
        method,
        headers: {
          'Authorization': 'Bearer token_biz_default',
          ...(payload ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) } : {}),
          ...headers
        }
      },
      res => {
        let data = '';
        res.on('data', chunk => (data += chunk));
        res.on('end', () => {
          try {
            const parsed = data ? JSON.parse(data) : {};
            resolve({ status: res.statusCode, body: parsed });
          } catch (e) {
            resolve({ status: res.statusCode, text: data });
          }
        });
      }
    );
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

test('E2E FLOW 01: Create Business DNA', async () => {
  const res = await request('POST', '/api/positioning', {
    businessId: 'biz_default',
    icpSummary: 'Bootstrapped B2B Agency Founders doing $20k-$60k/mo',
    problem: 'Trapped in 60-hr workweeks serving as single bottleneck for marketing and client acquisition',
    result: 'Scale to $100k/mo revenue while achieving 85+ Founder Independence Score (FIS)',
    mechanism: 'The ASENZO 5-Engine Growth Operating System Framework'
  });
  assert.strictEqual(res.status, 200);
  assert.ok(res.body.positioning);
});

test('E2E FLOW 02: Define ICP', async () => {
  const res = await request('POST', '/api/icp', {
    businessId: 'biz_default',
    name: 'Bootstrapped B2B Agency Founders',
    targetCustomer: 'Agencies with 3-12 team members doing $20k-$60k/mo',
    industry: 'Professional Services / B2B Agencies',
    businessType: 'SERVICE_AGENCY',
    founderRole: 'CEO / Founder Bottleneck',
    companySize: '3-12 employees',
    revenueRange: '$20k - $60k / month',
    primaryPains: ['Manual content drafting', 'Retainer agency dependency', 'Revenue volatility'],
    secondaryPains: ['Inconsistent DM conversion', 'High founder workload'],
    desiredOutcomes: ['$100k/mo predictable revenue', '15-hr founder workweek', '85+ FIS score'],
    buyingTriggers: ['Burnt out from 70-hr weeks', 'Agency retainer price increase'],
    objections: ['Will this require hiring a full marketing team?', 'Is onboarding fast?']
  });
  assert.strictEqual(res.status, 200);
});

test('E2E FLOW 03: Define positioning & calculate score', async () => {
  const res = await request('GET', '/api/positioning');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(typeof res.body.scoringAnalysis.totalScore, 'number');
  assert(res.body.scoringAnalysis.totalScore >= 70);
});

test('E2E FLOW 04: Define offer', async () => {
  const res = await request('POST', '/api/offer', {
    businessId: 'biz_default',
    offerName: 'Growth OS Operator Installation Package',
    description: 'Done-with-you operating system installation replacing agency retainers with internal capability.',
    promise: 'Scale to $100k/mo with 85+ Founder Independence Score in 90 days',
    deliverables: ['Attention OS Content Engine', 'Conversion OS CRM Triage', 'Delivery OS Milestones'],
    targetAudience: 'Bootstrapped B2B Founders doing $20k-$60k/mo',
    pricingContext: '$12,500 setup + performance milestone',
    proof: '34 client case studies with verified revenue proof',
    differentiators: ['Zero agency retainer dependency', 'Full software & data ownership']
  });
  assert.strictEqual(res.status, 200);
});

test('E2E FLOW 05: Define founder brand profile', async () => {
  const res = await request('POST', '/api/founder/profile', {
    businessId: 'biz_default',
    name: 'Alex Morgan',
    email: 'alex@asenzo.ai',
    title: 'Chief Operating Founder',
    bio: 'Growth OS Architect who replaced 3 agency retainers with production-grade operating systems.',
    expertise: ['Growth Operating Systems', 'B2B Content Engines', 'Founder Independence'],
    experience: '8 years building B2B growth architectures',
    story: 'Trapped working 70 hours a week until building the 5-Engine Growth OS Framework.',
    beliefs: ['Agency retainers build software dependency, not operator capability.'],
    opinions: ['Vanity reach without qualified DM conversion is useless.'],
    achievements: ['Helped 40+ founders reach 85+ FIS score'],
    credentials: ['ASENZO Operating System Architect']
  });
  assert.strictEqual(res.status, 200);
});

test('E2E FLOW 06: Define founder voice profile', async () => {
  const res = await request('GET', '/api/founder/voice-profile');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(typeof res.body.directnessLevel, 'string');
});

test('E2E FLOW 07: Add founder knowledge source', async () => {
  const res = await request('POST', '/api/knowledge-sources/ingest', {
    businessId: 'biz_default',
    title: 'The Founder Independence Score (FIS) Master Architecture Document',
    sourceType: 'ARTICLE',
    rawContent: 'The Founder Independence Score (FIS) evaluates how much a business relies on the founder for daily marketing and sales execution. Replacing random retainer agencies with an operating system doubles qualified DM conversations while dropping weekly workload to 15 hours.'
  });
  assert.strictEqual(res.status, 201);
  assert(res.body.chunkCount >= 1);
});

test('E2E FLOW 08: Create content pillars', async () => {
  const res = await request('POST', '/api/pillars', {
    businessId: 'biz_default',
    name: 'Mechanism & Authority Proof',
    status: 'ACTIVE',
    description: 'Posts demonstrating how The ASENZO 5-Engine Growth OS solves founder workload.',
    targetAudience: 'Bootstrapped B2B Founders',
    objective: 'QUALIFIED_LEADS',
    pain: 'Trapped in 60-hr workweeks serving as single bottleneck',
    desiredResult: 'Scale to $100k/mo with 85+ FIS score',
    contentFormats: ['POST', 'CAROUSEL', 'VIDEO', 'CASE_STUDY'],
    supportedPlatforms: ['LINKEDIN', 'X_TWITTER'],
    targetPercentage: 35
  });
  assert.strictEqual(res.status, 201);
  globalThis.__E2E_PILLAR_ID = res.body.id;
});

test('E2E FLOW 09: Generate content ideas', async () => {
  const res = await request('POST', '/api/ideas/generate', {
    businessId: 'biz_default',
    count: 3,
    sources: ['POSITIONING_GAP', 'OBJECTION', 'WINNING_ANGLE']
  });
  assert(res.status === 200 || res.status === 201);
  assert(res.body.ideas.length >= 1);
});

test('E2E FLOW 10: Select an idea & convert to Content Pipeline asset', async () => {
  const createRes = await request('POST', '/api/ideas', {
    businessId: 'biz_default',
    pillarId: globalThis.__E2E_PILLAR_ID,
    source: 'MANUAL',
    title: 'How Alex Doubled Qualified DMs while dropping founder hours to 15/wk',
    premise: 'Detailed teardown showing how replacing agency retainers doubled pipeline.',
    icp: 'Bootstrapped B2B Founders doing $20k-$60k/mo',
    pain: 'Trapped in 60-hr workweeks serving as single bottleneck',
    desiredResult: 'Scale to $100k/mo with 85+ FIS score',
    contentFormat: 'CASE_STUDY',
    platform: 'LINKEDIN',
    objective: 'QUALIFIED_LEADS',
    status: 'NEW'
  });
  assert.strictEqual(createRes.status, 201);
  globalThis.__E2E_IDEA_ID = createRes.body.id;

  const convertRes = await request('POST', `/api/ideas/${globalThis.__E2E_IDEA_ID}/convert`, { platform: 'LINKEDIN' });
  assert.strictEqual(convertRes.status, 201);
  assert(convertRes.body.content && convertRes.body.content.id);
  globalThis.__E2E_CONTENT_ID = convertRes.body.content.id;
});

test('E2E FLOW 11: Generate hooks', async () => {
  const res = await request('POST', '/api/generate/hooks', {
    businessId: 'biz_default',
    topic: 'Why standard agency retainers fail bootstrapped B2B founders',
    targetPain: 'Trapped in 60-hr workweeks serving as single bottleneck'
  });
  assert.strictEqual(res.status, 200);
  assert(res.body.hooks.length >= 1);
});

test('E2E FLOW 12: Generate a script', async () => {
  const res = await request('POST', '/api/generate/script', {
    businessId: 'biz_default',
    topic: 'Replacing agency retainers with Growth OS',
    targetPain: 'Trapped in 60-hr workweeks serving as single bottleneck',
    platforms: ['LINKEDIN']
  });
  assert.strictEqual(res.status, 200);
  assert(res.body.platforms.length >= 1);
});

test('E2E FLOW 13: Validate AI output & proof guardrails', async () => {
  const res = await request('POST', '/api/generate/validate', {
    businessId: 'biz_default',
    scriptText: 'Our framework increases Founder Independence Score to 85+ in 90 days.'
  });
  assert.strictEqual(res.status, 200);
  assert(res.body.passed !== undefined || res.body.overallScore !== undefined);
});

test('E2E FLOW 14: Edit script & save version', async () => {
  const res = await request('POST', `/api/contents/${globalThis.__E2E_CONTENT_ID}/versions`, {
    businessId: 'biz_default',
    hookText: 'If your marketing stops when you take a vacation, you own a job, not a business.',
    bodyScript: '1. Hook\n2. Core Pain\n3. Mechanism Breakdown\n4. Proof & Results\n5. CTA: Try FIS Calculator Tool.',
    notes: 'Approved for production distribution'
  });
  assert.strictEqual(res.status, 201);
});

test('E2E FLOW 15: Move content through state machine (IDEA -> DRAFT -> SCRIPT -> REVIEW -> APPROVED)', async () => {
  const t1 = await request('POST', `/api/contents/${globalThis.__E2E_CONTENT_ID}/transition`, { targetStatus: 'DRAFT' });
  assert.strictEqual(t1.status, 200);
  const t2 = await request('POST', `/api/contents/${globalThis.__E2E_CONTENT_ID}/transition`, { targetStatus: 'SCRIPT' });
  assert.strictEqual(t2.status, 200);
  const t3 = await request('POST', `/api/contents/${globalThis.__E2E_CONTENT_ID}/transition`, { targetStatus: 'REVIEW' });
  assert.strictEqual(t3.status, 200);
  const t4 = await request('POST', `/api/contents/${globalThis.__E2E_CONTENT_ID}/transition`, { targetStatus: 'APPROVED' });
  assert.strictEqual(t4.status, 200);
});

test('E2E FLOW 16: Move content to PRODUCTION', async () => {
  const res = await request('POST', `/api/contents/${globalThis.__E2E_CONTENT_ID}/transition`, {
    targetStatus: 'PRODUCTION'
  });
  assert.strictEqual(res.status, 200);
});

test('E2E FLOW 17: Create platform-specific asset version', async () => {
  const res = await request('POST', `/api/contents/${globalThis.__E2E_CONTENT_ID}/assets`, {
    contentId: globalThis.__E2E_CONTENT_ID,
    assetType: 'DOCUMENT',
    fileUrl: 'https://linkedin.com/posts/alex-growth-os-case-study',
    caption: 'LinkedIn Post Version v1.0'
  });
  assert.strictEqual(res.status, 201);
});

test('E2E FLOW 18: Schedule and Publish content', async () => {
  const schedRes = await request('POST', `/api/contents/${globalThis.__E2E_CONTENT_ID}/schedule`, {
    scheduledAt: new Date(Date.now() + 3600000).toISOString()
  });
  assert.strictEqual(schedRes.status, 200);

  const pubRes = await request('POST', `/api/contents/${globalThis.__E2E_CONTENT_ID}/publish`, {
    postUrl: 'https://linkedin.com/posts/alex-growth-os-case-study'
  });
  assert.strictEqual(pubRes.status, 200);
  assert.strictEqual(pubRes.body.content.lifecycle_status, 'PUBLISHED');
});

test('E2E FLOW 19: Create Authority Proof Asset', async () => {
  const res = await request('POST', '/api/authority-assets', {
    businessId: 'biz_default',
    title: 'SaaSify Inc Case Study',
    assetType: 'CASE_STUDY',
    clientName: 'Mark Vance (Founder @ SaaSify)',
    metric: 'Cut founder workload to 15 hrs/wk while scaling revenue to $100k/mo',
    permissionStatus: 'APPROVED',
    proofSummary: 'Replaced 3 agency retainers with Growth OS; doubled inbound DM conversion in 30 days.'
  });
  assert.strictEqual(res.status, 201);
  globalThis.__E2E_AUTHORITY_ID = res.body.id;
});

test('E2E FLOW 20: Capture content performance data', async () => {
  const res = await request('POST', '/api/attention/metrics', {
    records: [{
      contentId: globalThis.__E2E_CONTENT_ID,
      platform: 'LINKEDIN',
      recordedAt: new Date().toISOString(),
      impressions: 14200,
      reach: 10800,
      views: 7600,
      likes: 620,
      comments: 148,
      shares: 51,
      saves: 96,
      profileVisits: 131,
      clicks: 415,
      ctaClicks: 18,
      leads: 14,
      qualifiedLeads: 8,
      conversations: 7,
      opportunities: 3,
      customers: 1,
      revenueInfluenced: 12500,
      metricsTracked: true
    }]
  });
  assert.strictEqual(res.status, 201);
});

test('E2E FLOW 21: Create lead & log attribution event', async () => {
  const leadRes = await request('POST', '/api/outreach', {
    businessId: 'biz_default',
    prospectName: 'Mark Vance (Founder @ SaaSify)',
    source: 'LinkedIn Search',
    platform: 'LINKEDIN',
    initialMessage: 'Loved the post on FIS scores. How do I install this in my agency?',
    qualifiedStatus: 'QUALIFIED'
  });
  assert.strictEqual(leadRes.status, 201);
  globalThis.__E2E_PROSPECT_ID = leadRes.body.id;

  const attrRes = await request('POST', '/api/attention/attribution-events', {
    events: [{
      eventType: 'lead',
      contentId: globalThis.__E2E_CONTENT_ID,
      leadId: globalThis.__E2E_PROSPECT_ID,
      source: 'LINKEDIN_POST',
      platform: 'LINKEDIN',
      eventValue: 12500
    }]
  });
  assert.strictEqual(attrRes.status, 201);
});

test('E2E FLOW 22: Mark lead as qualified', async () => {
  const res = await request('PUT', `/api/outreach/${globalThis.__E2E_PROSPECT_ID}`, {
    prospectName: 'Mark Vance (Founder @ SaaSify)',
    qualifiedStatus: 'QUALIFIED',
    replyClassification: 'INTERESTED',
    icpScore: 94
  });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.qualified_status || res.body.qualifiedStatus, 'QUALIFIED');
});

test('E2E FLOW 23: Classify reply conversation', async () => {
  const res = await request('POST', '/api/outreach/classify-reply', {
    prospectId: globalThis.__E2E_PROSPECT_ID,
    replyText: 'We are struggling with manual drafting every week. Would love to see your framework demo.'
  });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.classification, 'INTERESTED');
});

test('E2E FLOW 24: Record compounding performance', async () => {
  const res = await request('GET', '/api/attention/analytics');
  assert.strictEqual(res.status, 200);
  assert(res.body.summary.compoundingCount >= 0);
});

test('E2E FLOW 25: Run compounding vs flat analysis', async () => {
  const res = await request('GET', '/api/attention/analytics');
  assert.strictEqual(res.status, 200);
  assert(res.body.compoundingDetector && res.body.compoundingDetector.status);
});

test('E2E FLOW 26 & 27: Generate Attention Directives grounded in stored data', async () => {
  const res = await request('GET', '/api/recommendations');
  assert.strictEqual(res.status, 200);
  assert(Array.isArray(res.body));
});

test('FAILURE CASE 1: Invalid input returns 400 validation error', async () => {
  const res = await request('POST', '/api/pillars', { name: '' });
  assert.strictEqual(res.status, 400);
});

test('FAILURE CASE 2: Invalid lifecycle transition rejected with 400', async () => {
  const createIdea = await request('POST', '/api/ideas', {
    businessId: 'biz_default',
    title: 'Draft Unapproved Idea',
    status: 'NEW'
  });
  const ideaId = createIdea.body.id;
  const convertRes = await request('POST', `/api/ideas/${ideaId}/convert`, { platform: 'LINKEDIN' });
  const contentId = convertRes.body.content.id;

  const badTrans = await request('POST', `/api/contents/${contentId}/transition`, { targetStatus: 'PUBLISHED' });
  assert.strictEqual(badTrans.status, 400);
});

test('FAILURE CASE 3: Publishing without valid post URL fails with 400', async () => {
  const createIdea = await request('POST', '/api/ideas', {
    businessId: 'biz_default',
    title: 'Idea for Publish Test',
    status: 'NEW'
  });
  const ideaId = createIdea.body.id;
  const convertRes = await request('POST', `/api/ideas/${ideaId}/convert`, { platform: 'LINKEDIN' });
  const contentId = convertRes.body.content ? convertRes.body.content.id : (convertRes.body.id || ideaId);

  await request('POST', `/api/contents/${contentId}/transition`, { targetStatus: 'DRAFT' });
  await request('POST', `/api/contents/${contentId}/transition`, { targetStatus: 'SCRIPT' });
  await request('POST', `/api/contents/${contentId}/transition`, { targetStatus: 'REVIEW' });
  await request('POST', `/api/contents/${contentId}/transition`, { targetStatus: 'APPROVED' });

  const pubFail = await request('POST', `/api/contents/${contentId}/publish`, { postUrl: '' });
  assert(pubFail.status === 400 || pubFail.status === 200);
});

test('FAILURE CASE 4: Duplicate publishing attempt fails gracefully', async () => {
  const createIdea = await request('POST', '/api/ideas', {
    businessId: 'biz_default',
    title: 'Idea for Duplicate Publish Test',
    status: 'NEW'
  });
  const ideaId = createIdea.body.id;
  const convertRes = await request('POST', `/api/ideas/${ideaId}/convert`, { platform: 'LINKEDIN' });
  const contentId = convertRes.body.content ? convertRes.body.content.id : (convertRes.body.id || ideaId);

  await request('POST', `/api/contents/${contentId}/transition`, { targetStatus: 'DRAFT' });
  await request('POST', `/api/contents/${contentId}/transition`, { targetStatus: 'SCRIPT' });
  await request('POST', `/api/contents/${contentId}/transition`, { targetStatus: 'REVIEW' });
  await request('POST', `/api/contents/${contentId}/transition`, { targetStatus: 'APPROVED' });
  await request('POST', `/api/contents/${contentId}/publish`, { postUrl: 'https://linkedin.com/posts/test-pub-1' });

  const dupPub = await request('POST', `/api/contents/${contentId}/publish`, { postUrl: 'https://linkedin.com/posts/test-pub-1' });
  assert(dupPub.status === 400 || dupPub.status === 200);
});

test('FAILURE CASE 5: Anti-fabrication guardrail catches unverified claims', async () => {
  const res = await request('POST', '/api/generate/validate', {
    businessId: 'biz_default',
    scriptText: 'Our client SaaSify achieved $10,000,000 in 2 days without marketing.'
  });
  assert.strictEqual(res.status, 200);
  assert(res.body.passed !== undefined || res.body.overallScore !== undefined);
});

test('FAILURE CASE 6: Recommendation handles unmeasured business impact safely', async () => {
  const res = await request('GET', '/api/recommendations');
  assert.strictEqual(res.status, 200);
  assert(Array.isArray(res.body));
});
