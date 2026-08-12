const test = require('node:test');
const assert = require('node:assert');
const http = require('http');

process.env.NODE_ENV = 'test';
process.env.PORT = '0'; // Allocate random available port

let serverInstance;
let PORT;
let baseUrl;

function apiRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const apiPath = path.startsWith('/api') ? path : `/api${path}`;
    const url = new URL(apiPath, baseUrl);
    const dataString = body ? JSON.stringify(body) : null;

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token_biz_default'
      }
    };

    if (dataString) {
      options.headers['Content-Length'] = Buffer.byteLength(dataString);
    }

    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let parsed = {};
        try {
          parsed = data ? JSON.parse(data) : {};
        } catch (e) {
          parsed = { raw: data };
        }
        resolve({ status: res.statusCode, body: parsed });
      });
    });

    req.on('error', reject);
    if (body) req.write(dataString);
    req.end();
  });
}

const { initDbPromise } = require('../db');

test.before(async () => {
  await initDbPromise;
  const { app } = require('../server');
  serverInstance = app.listen(0);
  PORT = serverInstance.address().port;
  baseUrl = `http://localhost:${PORT}`;
});

test.after(async () => {
  if (serverInstance) {
    const { scheduledWorker } = require('../server');
    clearInterval(scheduledWorker);
    await new Promise(resolve => serverInstance.close(resolve));
  }
  setImmediate(() => process.exit(0));
});

test('Sales OS Compounding Intelligence Loop', async (t) => {
  console.log('🚀 Starting Compounding Sales Intelligence Learning Loop Test...');

  // 1. Create Qualified Lead in Attention OS
  const leadRes = await apiRequest('/leads', 'POST', {
    email: 'marcus@saasboost.com',
    name: 'Marcus Brody',
    company: 'SaaS Boost Ltd',
    source: 'FORM',
    status: 'QUALIFIED'
  });
  assert.equal(leadRes.status, 201);
  const lead = leadRes.body.lead;
  assert.ok(lead.id);
  console.log('✓ Step 1: Lead created:', lead.id);

  // 2. Create CRM Deal in Conversion OS
  const dealRes = await apiRequest('/deals', 'POST', {
    dealName: 'SaaS Boost — Conversion Integration',
    contactName: 'Marcus Brody',
    companyName: 'SaaS Boost Ltd',
    contactEmail: 'marcus@saasboost.com',
    leadId: lead.id,
    stage: 'QUALIFIED_LEAD',
    amount: 15000,
    priority: 'HIGH',
    owner: 'Alex Morgan',
    source: 'CONVERSION_OS',
    risk: 'Low',
    whatIsHappening: 'Ingested qualified lead; awaiting audit booking.'
  });
  assert.equal(dealRes.status, 201);
  const deal = dealRes.body;
  assert.ok(deal.id);
  console.log('✓ Step 2: CRM Deal created:', deal.id);

  // 3. Book calendar slot (moves deal to CALL_SCHEDULED)
  const bookRes = await apiRequest('/conversion/calendar/book', 'POST', {
    dealId: deal.id,
    slotTime: '09:00 AM',
    date: '2026-08-15'
  });
  assert.equal(bookRes.status, 200);
  console.log('✓ Step 3: Calendar slot booked.');

  // 4. Log sales call transcript containing objection and mark as benchmark call
  const callTranscript = 'I like the Growth OS, but $15,000 is too expensive for our agency right now.';
  const callLogRes = await apiRequest('/sales-calls', 'POST', {
    dealId: deal.id,
    leadId: lead.id,
    transcriptText: callTranscript,
    durationSeconds: 1800,
    outcome: 'ADVANCED',
    isBenchmarkCall: true
  });
  assert.equal(callLogRes.status, 201);
  const salesCall = callLogRes.body;
  assert.ok(salesCall.id);
  console.log('✓ Step 4: Benchmark sales call logged:', salesCall.id);

  // 5. Run AI Objection Detection endpoint
  const detectRes = await apiRequest('/conversion/objections/detect', 'POST', {
    text: callTranscript,
    dealId: deal.id
  });
  assert.equal(detectRes.status, 200);
  assert.equal(detectRes.body.detected, true);
  assert.equal(detectRes.body.category, 'PRICING');
  console.log('✓ Step 5: AI Objection Detection successfully identified pricing objection:', detectRes.body.detectedObjection);

  // 6. Run Human Confirmation/Normalization endpoint
  const confirmRes = await apiRequest('/conversion/objections/confirm', 'POST', {
    dealId: deal.id,
    salesCallId: salesCall.id,
    originalObjection: detectRes.body.originalObjection,
    normalizedObjection: 'VALUE / ROI CONCERN',
    category: detectRes.body.category,
    founderResponse: detectRes.body.founderResponse,
    winningAngle: detectRes.body.winningAngle,
    confidence: detectRes.body.confidence
  });
  assert.equal(confirmRes.status, 201);
  assert.ok(confirmRes.body.objectionId);
  console.log('✓ Step 6: Human verified & normalized objection to "VALUE / ROI CONCERN".');

  // 7. Run Sales Pattern Extraction
  const extractRes = await apiRequest('/conversion/sales-patterns/extract', 'POST', {
    salesCallId: salesCall.id
  });
  assert.equal(extractRes.status, 201);
  assert.ok(extractRes.body.pattern.id);
  console.log('✓ Step 7: Founder sales pattern extracted from benchmark call.');

  // 8. Verify Future Pre-Call Intelligence Brief receives compiling updates
  // Create second deal
  const deal2Res = await apiRequest('/deals', 'POST', {
    dealName: 'Vortex Inc — Scaling OS Sprint',
    contactName: 'Sarah Conner',
    companyName: 'Vortex Inc',
    contactEmail: 'sarah@vortex.com',
    stage: 'QUALIFIED_LEAD',
    amount: 25000,
    priority: 'HIGH'
  });
  assert.equal(deal2Res.status, 201);
  const deal2 = deal2Res.body;

  // Retrieve Closer Prep brief for second deal
  const roomRes = await apiRequest(`/conversion/closer-room/${deal2.id}`);
  assert.equal(roomRes.status, 200);
  const brief = roomRes.body.preCallBrief;
  assert.ok(brief);

  // Verify that the learned pattern is successfully injected into the likely objections
  const containsLearnedPattern = brief.likelyObjections.some(o => o.objectionText === 'Too expensive / Pricing');
  assert.ok(containsLearnedPattern, 'Learned founder pattern must be present in future pre-call intelligence briefs');
  console.log('✓ Step 8: Compounding intelligence validated. Future pre-call brief successfully includes the learned objection pattern.');

  // 9. Generate Follow-up Sequence for first deal
  const genFollowUpRes = await apiRequest('/conversion/follow-ups/generate', 'POST', {
    dealId: deal.id
  });
  assert.equal(genFollowUpRes.status, 201);
  console.log('✓ Step 9: Follow-up sequence generated.');

  // Retrieve follow-ups
  const getFollowUpsRes = await apiRequest(`/conversion/follow-ups/${deal.id}`);
  assert.equal(getFollowUpsRes.status, 200);
  assert.equal(getFollowUpsRes.body.length, 3);
  const step1 = getFollowUpsRes.body[0];
  assert.equal(step1.status, 'PENDING');
  console.log('✓ Step 10: Retreived follow-up sequence with 3 custom delays & variants.');

  // Approve first step
  const approveRes = await apiRequest(`/conversion/follow-ups/${step1.id}/approve`, 'POST');
  assert.equal(approveRes.status, 200);
  
  // Verify sent status
  const checkFollowUpsRes = await apiRequest(`/conversion/follow-ups/${deal.id}`);
  assert.equal(checkFollowUpsRes.body[0].status, 'SENT');
  console.log('✓ Step 11: First step approved and marked as SENT.');

  // Stop sequence
  const stopAllRes = await apiRequest('/conversion/follow-ups/stop-all', 'POST', {
    dealId: deal.id
  });
  assert.equal(stopAllRes.status, 200);

  // Verify remaining are cancelled
  const finalFollowUpsRes = await apiRequest(`/conversion/follow-ups/${deal.id}`);
  assert.equal(finalFollowUpsRes.body[1].status, 'CANCELLED');
  assert.equal(finalFollowUpsRes.body[2].status, 'CANCELLED');
  console.log('✓ Step 12: Remaining steps successfully stopped / cancelled.');

  console.log('🎉 ALL COMPOUNDING SALES INTELLIGENCE TESTS PASSED 100% CLEANLY!');
});
