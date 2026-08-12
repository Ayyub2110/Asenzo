'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');
const { initDbPromise } = require('../db');


let serverInstance;
let PORT;

function apiRequest(path, method = 'GET', body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const dataString = body ? JSON.stringify(body) : '';
    const reqHeaders = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer token_biz_default',
      ...headers
    };
    if (body) {
      reqHeaders['Content-Length'] = Buffer.byteLength(dataString);
    }

    const req = http.request(
      {
        hostname: 'localhost',
        port: PORT,
        path: `/api${path}`,
        method,
        headers: reqHeaders
      },
      res => {
        let raw = '';
        res.on('data', chunk => (raw += chunk));
        res.on('end', () => {
          let parsed;
          try {
            parsed = raw ? JSON.parse(raw) : {};
          } catch (e) {
            parsed = { raw };
          }
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        });
      }
    );

    req.on('error', reject);
    if (body) req.write(dataString);
    req.end();
  });
}

test.before(async () => {
  await initDbPromise;
  const { app } = require('../server');
  serverInstance = app.listen(0);
  PORT = serverInstance.address().port;
});

test.after(async () => {
  if (serverInstance) {
    const { scheduledWorker } = require('../server');
    clearInterval(scheduledWorker);
    await new Promise(resolve => serverInstance.close(resolve));
  }
  setImmediate(() => process.exit(0));
});

// ── CONVERSION OS BACKEND UNIT & INTEGRATION TESTS ──────────────────────────

test('GET /api/conversion/dashboard returns executive action metrics & attention question', async () => {
  const res = await apiRequest('/conversion/dashboard');
  assert.equal(res.status, 200);
  assert.ok(res.body.attentionQuestion);
  assert.ok(typeof res.body.attentionQuestion === 'string');
  assert.ok(res.body.pipelineSummary);
  assert.ok(Array.isArray(res.body.priorityDeals));
});

test('GET & POST /api/conversion/vsl manages VSL funnel configuration', async () => {
  const getRes = await apiRequest('/conversion/vsl');
  assert.equal(getRes.status, 200);
  assert.ok(getRes.body.title);

  const postRes = await apiRequest('/conversion/vsl', 'POST', {
    id: 'vsl_default',
    title: 'Updated 5-Engine Growth OS Teardown',
    headline: 'Scale to $100k/mo With 85+ Founder Independence',
    subheadline: 'Eliminate retainer agency dependencies in 90 days.'
  });
  assert.equal(postRes.status, 200);
  assert.equal(postRes.body.title, 'Updated 5-Engine Growth OS Teardown');
});

test('GET & POST /api/conversion/dm-qualifier manages DM qualifier scripts', async () => {
  const getRes = await apiRequest('/conversion/dm-qualifier');
  assert.equal(getRes.status, 200);
  assert.ok(getRes.body.name);

  const postRes = await apiRequest('/conversion/dm-qualifier', 'POST', {
    id: 'dmq_default',
    name: 'Updated B2B DM Qualifier',
    minRevenueThreshold: '$25k/mo',
    bookingTriggerScore: 85
  });
  assert.equal(postRes.status, 200);
  assert.equal(postRes.body.min_revenue_threshold, '$25k/mo');
});

test('GET /api/deals returns deals list and filters by stage/attention', async () => {
  const allRes = await apiRequest('/deals');
  assert.equal(allRes.status, 200);
  assert.ok(Array.isArray(allRes.body));
  assert.ok(allRes.body.length > 0);

  const filterRes = await apiRequest('/deals?founderAttention=true');
  assert.equal(filterRes.status, 200);
  assert.ok(Array.isArray(filterRes.body));
  assert.ok(filterRes.body.every(d => d.founder_attention_required === 1));
});

test('POST /api/deals creates a new deal with Zod validation', async () => {
  const res = await apiRequest('/deals', 'POST', {
    dealName: 'Apex Robotics — Growth OS Setup',
    contactName: 'Daniel Vance',
    contactEmail: 'daniel@apexrobotics.com',
    stage: 'QUALIFIED_LEAD',
    amount: 15000,
    priority: 'HIGH',
    founderAttentionRequired: true,
    attentionReason: 'Inbound high-intent inquiry from LinkedIn VSL'
  });
  assert.equal(res.status, 201);
  assert.equal(res.body.deal_name, 'Apex Robotics — Growth OS Setup');
  assert.equal(res.body.amount, 15000);
});

test('POST /api/sales-calls logs a call transcript and auto-updates deal stage', async () => {
  const dealsRes = await apiRequest('/deals');
  const targetDeal = dealsRes.body[0];

  const res = await apiRequest('/sales-calls', 'POST', {
    dealId: targetDeal.id,
    callType: 'DISCOVERY_DEMO',
    outcome: 'PROPOSAL_REQUESTED',
    founderCallRating: 5,
    isBenchmarkCall: true,
    transcriptText: 'Founder Alex explained the 5-Engine Growth OS mechanism. Prospect asked about agency retainers vs OS setup. Alex reframed $12.5k setup against $72k annual agency bleed.'
  });
  assert.equal(res.status, 201);
  assert.equal(res.body.deal_id, targetDeal.id);
  assert.equal(res.body.is_benchmark_call, 1);
});

test('POST /api/sales-calls/:id/analyze-coaching runs post-call AI coaching engine against benchmark calls', async () => {
  // First log a sales call with a mechanism pitch gap
  const callRes = await apiRequest('/sales-calls', 'POST', {
    dealId: 'deal_1',
    callType: 'CLOSING_CALL',
    outcome: 'OBJECTION_STALLED',
    founderCallRating: 3,
    isBenchmarkCall: false,
    transcriptText: 'Closer talked about marketing features and social media posts. Prospect complained that $12,500 setup price is too expensive compared to monthly freelancer cost.'
  });
  assert.equal(callRes.status, 201);
  const callId = callRes.body.id;

  // Run AI Coaching Engine
  const coachRes = await apiRequest(`/sales-calls/${callId}/analyze-coaching`, 'POST');
  assert.equal(coachRes.status, 201);
  const log = coachRes.body.coachingLog;
  assert.ok(log);
  assert.ok(log.overall_call_score >= 0 && log.overall_call_score <= 100);
  assert.ok(Array.isArray(log.coachingTips));
  assert.ok(log.coachingTips.length >= 1);
  assert.ok(log.coachingTips.some(t => (typeof t === 'string' ? t : t.problem).includes('Mechanism Pitch Gap') || (typeof t === 'string' ? t : t.problem).includes('Pricing ROI Reframing')));
});

test('POST /api/proposals creates proposal and advances deal stage to PROPOSAL_SENT', async () => {
  const res = await apiRequest('/proposals', 'POST', {
    dealId: 'deal_2',
    title: 'Apex Growth OS Installation Proposal',
    pricingAmount: 15000,
    paymentTerms: '$15,000 upfront installation fee',
    deliverablesJson: ['Attention OS Setup', 'Conversion OS Triage', 'Delivery OS SOPs']
  });
  assert.equal(res.status, 201);
  assert.equal(res.body.deal_id, 'deal_2');
  assert.equal(res.body.status, 'DRAFT');

  // Verify deal stage updated
  const dealRes = await apiRequest('/deals');
  const updatedDeal = dealRes.body.find(d => d.id === 'deal_2');
  assert.equal(updatedDeal.stage, 'PROPOSAL_SENT');
});

test('POST /api/contracts and PUT /api/contracts/:id/sign executes contract signature', async () => {
  const ctrRes = await apiRequest('/contracts', 'POST', {
    dealId: 'deal_2',
    contractType: 'GROWTH_OS_INSTALLATION',
    documentUrl: 'https://docs.asenzo.ai/contract-deal2.pdf'
  });
  assert.equal(ctrRes.status, 201);
  const ctrId = ctrRes.body.id;

  const signRes = await apiRequest(`/contracts/${ctrId}/sign`, 'PUT', {
    signatureProof: 'DIGITAL_SIGNATURE_OK_HASH_991'
  });
  assert.equal(signRes.status, 200);
  assert.equal(signRes.body.status, 'SIGNED');

  // Verify deal stage moved to PAYMENT_PENDING
  const dealRes = await apiRequest('/deals');
  const updatedDeal = dealRes.body.find(d => d.id === 'deal_2');
  assert.equal(updatedDeal.stage, 'PAYMENT_PENDING');
});

test('POST /api/deals/:id/win executes deal-won automation & delivery handoff', async () => {
  // Create completed payment first to satisfy verified billing checks
  const payRes = await apiRequest('/payments', 'POST', {
    dealId: 'deal_2',
    contractId: 'ctr_deal_2',
    amount: 15000,
    currency: 'USD',
    paymentMethod: 'STRIPE_CREDIT_CARD',
    transactionId: 'txn_api_test_won_99',
    status: 'COMPLETED'
  });
  assert.equal(payRes.status, 201);

  // Deal 2 has signed contract and completed payment now
  const winRes = await apiRequest('/deals/deal_2/win', 'POST');
  assert.equal(winRes.status, 200);
  assert.equal(winRes.body.deal.stage, 'CLOSED_WON');
  assert.equal(winRes.body.deal.status, 'WON');
  assert.ok(winRes.body.deliveryHandoff);
  assert.equal(winRes.body.deliveryHandoff.deal_id, 'deal_2');
});

test('GET /api/conversion/intelligence returns aggregated conversion analytics', async () => {
  const res = await apiRequest('/conversion/intelligence');
  assert.equal(res.status, 200);
  assert.ok(res.body.totalDealsCount > 0);
  assert.ok(typeof res.body.winRate === 'number');
  assert.ok(typeof res.body.totalWonRevenue === 'number');
});
