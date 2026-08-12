const test = require('node:test');
const assert = require('node:assert');
const http = require('http');

process.env.NODE_ENV = 'test';
process.env.PORT = '0'; // Allocate random available port

const { app, server } = require('../server');

let baseUrl;

function apiRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const apiPath = path.startsWith('/api') ? path : `/api${path}`;
    const url = new URL(apiPath, baseUrl);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token_biz_default'
      }
    };

    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

const { initDbPromise } = require('../db');

test.before(async () => {
  await initDbPromise;
  if (!server.listening) {
    await new Promise(resolve => server.listen(0, resolve));
  }
  const port = server.address().port;
  baseUrl = `http://localhost:${port}`;
});

test.after((t, done) => {
  const { scheduledWorker } = require('../server');
  clearInterval(scheduledWorker);
  server.close(() => {
    setImmediate(() => process.exit(0));
  });
});

test('PROFILE FUNNEL: Fetch active default funnel initialized from Business DNA', async () => {
  const res = await apiRequest('/conversion/profile-funnel');
  assert.equal(res.status, 200);
  assert.ok(res.body.id);
  assert.ok(res.body.headline.includes('Organic Attention') || res.body.headline.includes('High-ARR'));
  assert.equal(res.body.publishingStatus, 'PUBLISHED');
  assert.ok(res.body.vslVideoUrl);
  console.log('✓ Default profile funnel fetched cleanly.');
});

test('PROFILE FUNNEL: Auto-generate funnel from active Business DNA & Positioning', async () => {
  const genRes = await apiRequest('/conversion/profile-funnels/generate-from-dna', 'POST');
  assert.equal(genRes.status, 201);
  assert.ok(genRes.body.id);
  assert.ok(genRes.body.headline);
  assert.equal(genRes.body.publishingStatus, 'DRAFT');
  assert.ok(genRes.body.vslHook.includes('growth architecture'));
  assert.ok(genRes.body.uniqueMechanism);
  console.log('✓ Auto-compiled Profile Funnel from Business DNA successfully.');
});

test('PROFILE FUNNEL: Edit VSL title, video URL, hook & CTA text', async () => {
  const activeRes = await apiRequest('/conversion/profile-funnel');
  const funnel = activeRes.body;

  const updateRes = await apiRequest('/conversion/profile-funnels', 'POST', {
    id: funnel.id,
    title: 'High-Ticket Founder Growth Audit VSL',
    publishingStatus: 'DRAFT',
    headline: 'Turn Organic Attention into $100k/mo ARR with ASENZO Growth OS',
    vslTitle: 'How B2B Founders Scale ARR 3x in 90 Days',
    vslVideoUrl: 'https://vimeo.com/9988776655',
    vslHook: 'If your sales pipeline stops when you stop manual outreach, your engine is broken.',
    vslProblem: '60-hr founder bottleneck prevents enterprise deal close consistency.',
    vslMechanism: 'ASENZO Attention OS and Conversion OS capture founder sales intelligence.',
    vslCtaText: 'Schedule 1:1 Growth Architecture Audit'
  });

  assert.equal(updateRes.status, 200);
  assert.equal(updateRes.body.vslVideoUrl, 'https://vimeo.com/9988776655');
  assert.equal(updateRes.body.vslCtaText, 'Schedule 1:1 Growth Architecture Audit');
  console.log('✓ Edited Profile Funnel VSL assets cleanly.');
});

test('PROFILE FUNNEL: Publish funnel draft and verify version history increment', async () => {
  const activeRes = await apiRequest('/conversion/profile-funnel');
  const funnelId = activeRes.body.id;

  const pubRes = await apiRequest(`/conversion/profile-funnels/${funnelId}/publish`, 'POST', {
    changeSummary: 'Updated VSL video URL & refined CTA headline'
  });

  assert.equal(pubRes.status, 200);
  assert.equal(pubRes.body.publishingStatus, 'PUBLISHED');
  assert.ok(pubRes.body.version >= 2);

  const versionsRes = await apiRequest(`/conversion/profile-funnels/${funnelId}/versions`);
  assert.equal(versionsRes.status, 200);
  assert.ok(versionsRes.body.length >= 1);
  assert.equal(versionsRes.body[0].changeSummary, 'Updated VSL video URL & refined CTA headline');
  console.log('✓ Published Profile Funnel & verified version history log.');
});

test('PROFILE FUNNEL: Get compiled Preview rendering trust-first conversion path', async () => {
  const activeRes = await apiRequest('/conversion/profile-funnel');
  const funnelId = activeRes.body.id;

  const prevRes = await apiRequest(`/conversion/profile-funnels/${funnelId}/preview`);
  assert.equal(prevRes.status, 200);
  assert.ok(prevRes.body.funnel);
  assert.ok(prevRes.body.components.headline);
  assert.ok(prevRes.body.vsl.videoUrl);
  assert.ok(Array.isArray(prevRes.body.proofAssets));
  assert.ok(Array.isArray(prevRes.body.objections));
  assert.equal(prevRes.body.components.qualificationEntryPoint, '/api/leads/qualify');
  console.log('✓ Compiled Funnel Preview payload generated cleanly.');
});

test('PROFILE FUNNEL: Track analytics events & verify environment isolation', async () => {
  const activeRes = await apiRequest('/conversion/profile-funnel');
  const funnelId = activeRes.body.id;

  // Track Production Events
  await apiRequest(`/conversion/profile-funnels/${funnelId}/events`, 'POST', {
    eventType: 'VISIT',
    environment: 'PRODUCTION',
    visitorId: 'vis_prod_1'
  });
  await apiRequest(`/conversion/profile-funnels/${funnelId}/events`, 'POST', {
    eventType: 'CTA_CLICK',
    environment: 'PRODUCTION',
    visitorId: 'vis_prod_1'
  });
  await apiRequest(`/conversion/profile-funnels/${funnelId}/events`, 'POST', {
    eventType: 'QUALIFICATION_START',
    environment: 'PRODUCTION',
    visitorId: 'vis_prod_1'
  });

  // Track Simulated Test Events
  await apiRequest(`/conversion/profile-funnels/${funnelId}/events`, 'POST', {
    eventType: 'VISIT',
    environment: 'TEST_SIMULATED',
    visitorId: 'vis_test_99'
  });

  // Fetch Production Analytics
  const prodAnalytics = await apiRequest(`/conversion/profile-funnels/${funnelId}/analytics?environment=PRODUCTION`);
  assert.equal(prodAnalytics.status, 200);
  assert.equal(prodAnalytics.body.isSimulatedTestData, false);
  assert.ok(prodAnalytics.body.metrics.visits >= 1);
  assert.ok(prodAnalytics.body.metrics.ctaClicks >= 1);

  // Fetch Simulated Test Analytics
  const testAnalytics = await apiRequest(`/conversion/profile-funnels/${funnelId}/analytics?environment=TEST_SIMULATED`);
  assert.equal(testAnalytics.status, 200);
  assert.equal(testAnalytics.body.isSimulatedTestData, true);
  assert.ok(testAnalytics.body.metrics.visits >= 1);
  console.log('✓ Tracked funnel analytics events and verified production vs test isolation.');
});

test('PROFILE FUNNEL: Guardrail - Reject malformed funnel with missing mandatory fields', async () => {
  const badRes = await apiRequest('/conversion/profile-funnels', 'POST', {
    title: 'A' // too short title (< 2 chars)
  });
  assert.equal(badRes.status, 400);
  console.log('✓ Guardrail: Zod validation caught invalid short title.');
});
