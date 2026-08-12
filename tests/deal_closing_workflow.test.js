'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');
const { initDbPromise, get: dbGet } = require('../db');

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

test('Deal Closing Workflow state machine: end-to-end execution', async () => {
  // 1. Create a deal
  const dealRes = await apiRequest('/deals', 'POST', {
    dealName: 'Workflow Test Deal',
    contactName: 'Closing Tester',
    amount: 15000,
    stage: 'QUALIFIED_LEAD'
  });
  assert.equal(dealRes.status, 201);
  const dealId = dealRes.body.id;

  // 2. Initiate Workflow
  const initRes = await apiRequest(`/deals/${dealId}/closing-workflow/initiate`, 'POST');
  assert.equal(initRes.status, 200);
  assert.equal(initRes.body.status, 'INITIATED');
  assert.equal(initRes.body.next_action, 'Create Proposal');

  // 3. Step 1: Execute next -> Moves to PROPOSAL_CREATED
  const exec1 = await apiRequest(`/deals/${dealId}/closing-workflow/execute-next`, 'POST');
  assert.equal(exec1.status, 200);
  assert.equal(exec1.body.status, 'PROPOSAL_CREATED');
  assert.ok(exec1.body.proposal_id);
  const proposalId = exec1.body.proposal_id;

  // Verify proposal exists in DB
  const foundProp = await dbGet('SELECT * FROM proposals WHERE id = ?', [proposalId]);
  assert.ok(foundProp);
  assert.equal(foundProp.pricing_amount, 15000);

  // Idempotency: executing again at same stage does not create another proposal
  const exec1Idemp = await apiRequest(`/deals/${dealId}/closing-workflow/execute-next`, 'POST');
  assert.equal(exec1Idemp.body.proposal_id, proposalId);

  // 4. Step 2: Accept Proposal & moves to CONTRACT_CREATED
  const acceptRes = await apiRequest(`/proposals/${proposalId}/status`, 'PUT', { status: 'ACCEPTED' });
  assert.equal(acceptRes.status, 200);

  const exec2 = await apiRequest(`/deals/${dealId}/closing-workflow/execute-next`, 'POST');
  assert.equal(exec2.status, 200);
  assert.equal(exec2.body.status, 'CONTRACT_CREATED');
  assert.ok(exec2.body.contract_id);
  const contractId = exec2.body.contract_id;

  // 5. Step 3: Try to execute next -> Remains paused at CONTRACT_CREATED (awaiting signature)
  const exec3 = await apiRequest(`/deals/${dealId}/closing-workflow/execute-next`, 'POST');
  assert.equal(exec3.status, 200);
  assert.equal(exec3.body.status, 'CONTRACT_CREATED');
  assert.ok(exec3.body.failure_reason.includes('signature'));

  // 6. Digitally Sign Contract -> Moves to CONTRACT_SIGNED
  const signRes = await apiRequest(`/contracts/${contractId}/sign`, 'PUT', {
    signatureProof: 'SIG_DIGITAL_FLOW_E2E_OK_11'
  });
  assert.equal(signRes.status, 200);

  const exec4 = await apiRequest(`/deals/${dealId}/closing-workflow/execute-next`, 'POST');
  assert.equal(exec4.status, 200);
  assert.equal(exec4.body.status, 'INVOICE_SENT');
  assert.ok(exec4.body.payment_id);
  const paymentId = exec4.body.payment_id;

  // Verify payment is pending in DB
  const foundPay = await dbGet('SELECT * FROM payments WHERE id = ?', [paymentId]);
  assert.ok(foundPay);
  assert.equal(foundPay.status, 'PENDING');
  const transactionId = foundPay.transaction_id;

  // 7. Step 5: Try to execute next -> Remains paused at INVOICE_SENT (awaiting stripe transaction confirmation)
  const exec5 = await apiRequest(`/deals/${dealId}/closing-workflow/execute-next`, 'POST');
  assert.equal(exec5.status, 200);
  assert.equal(exec5.body.status, 'INVOICE_SENT');
  assert.ok(exec5.body.failure_reason.includes('webhook'));

  // 8. Stripe Webhook Callback confirmation -> Confirms payment and auto-advances workflow
  const stripeConfirm = await apiRequest('/payments/confirm', 'POST', { transactionId });
  assert.equal(stripeConfirm.status, 200);
  assert.equal(stripeConfirm.body.payment.status, 'COMPLETED');

  // Verify closing workflow advanced to PAYMENT_CONFIRMED
  const wfGet = await apiRequest(`/deals/${dealId}/closing-workflow`);
  assert.equal(wfGet.body.status, 'PAYMENT_CONFIRMED');

  // 9. Step 6: Onboarding checklist handoff -> ONBOARDING_HANDOFF
  const exec6 = await apiRequest(`/deals/${dealId}/closing-workflow/execute-next`, 'POST');
  assert.equal(exec6.status, 200);
  assert.equal(exec6.body.status, 'ONBOARDING_HANDOFF');
  assert.ok(exec6.body.handoff_id);
  const handoffId = exec6.body.handoff_id;

  // 10. Step 7: Complete Closing Stage -> Marks Deal Won
  const exec7 = await apiRequest(`/deals/${dealId}/closing-workflow/execute-next`, 'POST');
  assert.equal(exec7.status, 200);
  assert.equal(exec7.body.status, 'COMPLETED');

  // Verify deal status is Won
  const dealsRes = await apiRequest('/deals');
  const finalDeal = dealsRes.body.find(d => d.id === dealId);
  assert.equal(finalDeal.stage, 'CLOSED_WON');
  assert.equal(finalDeal.status, 'WON');
});

test('Deal Closing Workflow: manual overrides & retry capability', async () => {
  // 1. Create a deal
  const dealRes = await apiRequest('/deals', 'POST', {
    dealName: 'Override Test Deal',
    contactName: 'Override Tester',
    amount: 25000,
    stage: 'QUALIFIED_LEAD'
  });
  const dealId = dealRes.body.id;

  // 2. Initiate Workflow
  await apiRequest(`/deals/${dealId}/closing-workflow/initiate`, 'POST');

  // 3. Manual Override to PAYMENT_CONFIRMED
  const overrideRes = await apiRequest(`/deals/${dealId}/closing-workflow/override`, 'POST', {
    stage: 'PAYMENT_CONFIRMED',
    notes: 'Bypassed payments via direct bank transfer validation'
  });
  assert.equal(overrideRes.status, 200);
  assert.equal(overrideRes.body.status, 'PAYMENT_CONFIRMED');
  assert.ok(overrideRes.body.proposal_id);
  assert.ok(overrideRes.body.contract_id);
  assert.ok(overrideRes.body.payment_id);
  assert.ok(overrideRes.body.audit_trail_json.toLowerCase().includes('override'));

  // 4. Retry Capability
  const retryRes = await apiRequest(`/deals/${dealId}/closing-workflow/retry`, 'POST');
  assert.equal(retryRes.status, 200);
  assert.equal(retryRes.body.status, 'ONBOARDING_HANDOFF');
  assert.equal(retryRes.body.retry_count, 1);
});
