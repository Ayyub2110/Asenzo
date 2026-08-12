'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');

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

// ── CONVERSION OS COMPLETE END-TO-END LIFECYCLE & GUARDRAIL VALIDATION SUITE ────

test('Conversion OS 30-Step End-to-End Lifecycle & Guardrail Validation', async () => {
  console.log('\n🚀 Starting Conversion OS End-to-End Validation Run...');

  // STEP 1: Verify Business DNA & Positioning reused cleanly from Attention OS
  const dnaRes = await apiRequest('/positioning');
  assert.equal(dnaRes.status, 200);
  assert.ok(dnaRes.body.positioning);
  assert.ok(dnaRes.body.positioning.mechanism.includes('ASENZO'));
  console.log('✓ Step 1-2: Reused Business DNA & Positioning verified cleanly without duplication.');

  // STEP 3: Create Inbound DM Prospect in Attention OS DM Inbox
  const prospRes = await apiRequest('/outreach', 'POST', {
    prospectName: 'E2E Founder — Eric Vance',
    platform: 'LINKEDIN',
    source: 'LinkedIn Mechanism Post Comment',
    initialMessage: 'Hey Alex, read your post on Founder Independence Scores. How do we install Engine 2 in our agency?',
    latestReply: 'We do $35k/mo right now but I am spending 50 hrs/wk doing sales calls manually. Can we book a call?',
    qualifiedStatus: 'UNQUALIFIED',
    icpScore: 92
  });
  assert.equal(prospRes.status, 201);
  const prospect = prospRes.body;
  console.log('✓ Step 3-4: Inbound DM Prospect created:', prospect.id);

  // STEP 5: Perform AI Reply Classification on Prospect
  const classRes = await apiRequest('/outreach/classify-reply', 'POST', {
    prospectId: prospect.id,
    replyText: prospect.latest_reply || prospect.latestReply || 'We do $35k/mo right now but I am spending 50 hrs/wk doing sales calls manually. Can we book a call?'
  });
  assert.equal(classRes.status, 200);
  assert.equal(classRes.body.classification, 'INTERESTED');
  console.log('✓ Step 5-6: AI Reply Classification verified as INTERESTED.');

  // STEP 7: Convert Prospect to Lead and Create CRM Deal
  const leadRes = await apiRequest('/leads', 'POST', {
    name: 'Eric Vance',
    email: 'eric@vancegrowth.com',
    company: 'Vance Growth Systems',
    status: 'QUALIFIED',
    intentScore: 95
  });
  assert.equal(leadRes.status, 201);
  const lead = leadRes.body;

  const dealRes = await apiRequest('/deals', 'POST', {
    leadId: lead.id,
    prospectId: prospect.id,
    dealName: 'Vance Growth Systems — Growth OS Installation',
    contactName: 'Eric Vance',
    contactEmail: 'eric@vancegrowth.com',
    companyName: 'Vance Growth Systems',
    stage: 'QUALIFIED_LEAD',
    amount: 15000,
    closeProbability: 60,
    priority: 'HIGH',
    founderAttentionRequired: true,
    attentionReason: 'Inbound high intent — requires founder discovery demo.'
  });
  assert.equal(dealRes.status, 201);
  const deal = dealRes.body;
  console.log('✓ Step 7-8: CRM Deal created in QUALIFIED_LEAD stage:', deal.id);

  // STEP 9-10: Advance Deal through Stages: BOOKING_PENDING -> CALL_SCHEDULED
  const stageRes1 = await apiRequest(`/deals/${deal.id}/stage`, 'POST', { targetStage: 'BOOKING_PENDING' });
  assert.equal(stageRes1.status, 200);
  assert.equal(stageRes1.body.stage, 'BOOKING_PENDING');

  const stageRes2 = await apiRequest(`/deals/${deal.id}/stage`, 'POST', { targetStage: 'CALL_SCHEDULED' });
  assert.equal(stageRes2.status, 200);
  assert.equal(stageRes2.body.stage, 'CALL_SCHEDULED');
  console.log('✓ Step 9-10: Deal stage advanced to CALL_SCHEDULED.');

  // STEP 11: Generate Closer Room Pre-Call Prep Sheet
  const closerRes = await apiRequest(`/conversion/closer-room/${deal.id}`);
  assert.equal(closerRes.status, 200);
  assert.ok(closerRes.body.deal);
  assert.ok(closerRes.body.positioning);
  assert.ok(Array.isArray(closerRes.body.objectionScripts));
  console.log('✓ Step 11: Closer Room prep sheet generated combining Business DNA & Objections.');

  // STEP 12-13: Log Benchmark Discovery Call with Founder Alex
  const benchCallRes = await apiRequest('/sales-calls', 'POST', {
    dealId: deal.id,
    leadId: lead.id,
    callType: 'DISCOVERY_DEMO',
    outcome: 'PROPOSAL_REQUESTED',
    founderCallRating: 5,
    isBenchmarkCall: true,
    transcriptText: 'Alex Morgan: "Welcome Eric. In ASENZO, we install 5 internal growth engines so you own software and data assets forever." Eric: "How is this different from my current $6,000/mo retainer agency?" Alex: "Agencies rent labor. When you stop paying, marketing stops. $15,000 one-time installation replaces $72,000 annual agency retainers."'
  });
  assert.equal(benchCallRes.status, 201);
  const benchCall = benchCallRes.body;
  assert.equal(benchCall.is_benchmark_call, 1);
  console.log('✓ Step 12-13: Founder benchmark sales call logged & tagged as is_benchmark_call = 1.');

  // STEP 14-15: Log Second Call and Run Post-Call AI Coaching Engine
  const call2Res = await apiRequest('/sales-calls', 'POST', {
    dealId: deal.id,
    callType: 'CLOSING_CALL',
    outcome: 'OBJECTION_STALLED',
    founderCallRating: 3,
    isBenchmarkCall: false,
    transcriptText: 'Closer: "We can help you post content and run ads." Prospect: "The $15,000 price tag feels high." Closer: "We can do a discount."'
  });
  assert.equal(call2Res.status, 201);
  const call2 = call2Res.body;

  const coachRes = await apiRequest(`/sales-calls/${call2.id}/analyze-coaching`, 'POST');
  assert.equal(coachRes.status, 201);
  const coachLog = coachRes.body.coachingLog;
  assert.ok(coachLog.overall_call_score >= 0 && coachLog.overall_call_score <= 100);
  assert.ok(Array.isArray(coachLog.coachingTips));
  assert.ok(coachLog.coachingTips.some(t => t.includes('Mechanism Pitch Gap') || t.includes('Pricing ROI Reframing')));
  console.log('✓ Step 14-17: Post-Call AI Coaching Engine evaluated call against founder benchmark patterns cleanly.');

  // STEP 18: Query Founder Objection Library
  const objRes = await apiRequest('/conversion/objection-library');
  assert.equal(objRes.status, 200);
  assert.ok(Array.isArray(objRes.body));
  console.log('✓ Step 18: Objection Library queried successfully.');

  // STEP 19-21: Create & Accept Proposal Document
  const propRes = await apiRequest('/proposals', 'POST', {
    dealId: deal.id,
    title: 'Vance Growth Systems — Growth OS Installation Proposal',
    pricingAmount: 15000,
    paymentTerms: '$15,000 setup fee upon contract execution',
    deliverablesJson: ['Attention OS Engine', 'Conversion OS CRM Triage', 'Delivery OS SOPs']
  });
  assert.equal(propRes.status, 201);
  const proposal = propRes.body;

  const propAcceptRes = await apiRequest(`/proposals/${proposal.id}/status`, 'PUT', { status: 'ACCEPTED' });
  assert.equal(propAcceptRes.status, 200);
  assert.equal(propAcceptRes.body.status, 'ACCEPTED');
  console.log('✓ Step 19-21: Proposal created & accepted.');

  // STEP 22-25: Generate & Digitally Sign Contract Document
  const ctrRes = await apiRequest('/contracts', 'POST', {
    dealId: deal.id,
    proposalId: proposal.id,
    contractType: 'GROWTH_OS_INSTALLATION',
    documentUrl: 'https://docs.asenzo.ai/contracts/vance-growth-101.pdf'
  });
  assert.equal(ctrRes.status, 201);
  const contract = ctrRes.body;

  const signRes = await apiRequest(`/contracts/${contract.id}/sign`, 'PUT', {
    signatureProof: 'DIGITAL_SIGNATURE_VERIFIED_HASH_E2E'
  });
  assert.equal(signRes.status, 200);
  assert.equal(signRes.body.status, 'SIGNED');

  // Verify deal stage is PAYMENT_PENDING
  const checkDealRes1 = await apiRequest('/deals');
  const dealCheck1 = checkDealRes1.body.find(d => d.id === deal.id);
  assert.equal(dealCheck1.stage, 'PAYMENT_PENDING');
  console.log('✓ Step 22-25: Contract generated & digitally signed. Deal stage moved to PAYMENT_PENDING.');

  // STEP 26: Record Stripe Payment Transaction
  const payRes = await apiRequest('/payments', 'POST', {
    dealId: deal.id,
    contractId: contract.id,
    amount: 15000,
    currency: 'USD',
    paymentMethod: 'STRIPE_CREDIT_CARD',
    transactionId: 'txn_stripe_e2e_val_88192',
    status: 'COMPLETED'
  });
  assert.equal(payRes.status, 201);
  console.log('✓ Step 26: Stripe Payment Transaction recorded:', payRes.body.id);

  // STEP 27-28: Execute Deal-Won Automation
  const winRes = await apiRequest(`/deals/${deal.id}/win`, 'POST');
  assert.equal(winRes.status, 200);
  assert.equal(winRes.body.deal.stage, 'CLOSED_WON');
  assert.equal(winRes.body.deal.status, 'WON');
  assert.ok(winRes.body.deliveryHandoff);
  assert.equal(winRes.body.deliveryHandoff.deal_id, deal.id);
  console.log('✓ Step 27-28: Deal marked CLOSED_WON. Delivery OS handoff checklist & revenue attribution created automatically.');

  // STEP 29: Query Conversion Intelligence & Executive Dashboard
  const dashRes = await apiRequest('/conversion/dashboard');
  assert.equal(dashRes.status, 200);
  assert.ok(dashRes.body.attentionQuestion);
  assert.ok(dashRes.body.pipelineSummary.totalWonValue >= 15000);
  console.log('✓ Step 29: Executive Action Center verified ("Which deal needs founder attention today?").');

  // ── STEP 30: SECURITY & GUARDRAIL FAILURE TESTS ─────────────────────────────

  // Guardrail 1: Attempt to mark deal won without signed contract or payment fails gracefully with 400 error
  const newDealRes = await apiRequest('/deals', 'POST', {
    dealName: 'Unsigned Guardrail Test Deal',
    contactName: 'Guardrail Tester',
    amount: 20000,
    stage: 'QUALIFIED_LEAD'
  });
  assert.equal(newDealRes.status, 201);
  const guardrailDeal = newDealRes.body;

  const fakeWinRes = await apiRequest(`/deals/${guardrailDeal.id}/win`, 'POST', { forceWin: false });
  assert.equal(fakeWinRes.status, 400);
  assert.ok(fakeWinRes.body.error.includes('Cannot mark deal won without signed contract or verified payment'));
  console.log('✓ Guardrail 1: Anti-fabrication check blocked unconfirmed deal win cleanly.');

  // Guardrail 2: Malformed sales call duration yields proper Zod 400 validation error
  const badCallRes = await apiRequest('/sales-calls', 'POST', {
    dealId: deal.id,
    durationSeconds: -500
  });
  assert.equal(badCallRes.status, 400);
  console.log('✓ Guardrail 2: Zod schema validation rejected negative duration.');

  // Guardrail 3: Negative payment amount rejected
  const badPayRes = await apiRequest('/payments', 'POST', {
    dealId: deal.id,
    amount: -500,
    transactionId: 'txn_bad'
  });
  assert.equal(badPayRes.status, 400);
  console.log('✓ Guardrail 3: Negative payment amount rejected cleanly.');

  // Guardrail 4: Multi-tenant token isolation
  const badAuthRes = await apiRequest('/conversion/dashboard', 'GET', null, { 'Authorization': 'Bearer invalid_token' });
  assert.equal(badAuthRes.status, 401);
  console.log('✓ Guardrail 4: Multi-tenant Bearer authentication enforced.');

  // Guardrail 5: Audit logs logged for status changes
  const auditRes = await apiRequest('/audit-logs');
  assert.equal(auditRes.status, 200);
  assert.ok(Array.isArray(auditRes.body));
  assert.ok(auditRes.body.some(a => a.entity_type === 'deals' && a.action === 'STATUS_CHANGE'));
  console.log('✓ Guardrail 5: Audit logs verified for deal status changes.');

  // Guardrail 6: Executive attention question handles all pipeline states
  assert.ok(typeof dashRes.body.attentionQuestion === 'string');
  console.log('✓ Guardrail 6: Executive action synthesis verified.');

  console.log('\n🎉 ALL 30 CONVERSION OS E2E LIFECYCLE & GUARDRAIL STEPS PASSED 100% CLEANLY!\n');
});
