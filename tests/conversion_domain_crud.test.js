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

test('CONVERSION DOMAIN MODEL: Configurable Pipelines & Stages CRUD & Order Indexing', async () => {
  // 1. Fetch default pipeline
  const pipesRes = await apiRequest('/pipelines');
  assert.equal(pipesRes.status, 200);
  assert(Array.isArray(pipesRes.body));
  assert(pipesRes.body.length >= 1);
  const defaultPipe = pipesRes.body[0];
  assert(defaultPipe.stages.length >= 8);

  // 2. Create custom founder pipeline
  const newPipeRes = await apiRequest('/pipelines', 'POST', {
    name: 'High-Ticket Enterprise OS Pipeline',
    description: 'Custom founder sales pipeline with bespoke enterprise stages',
    isDefault: false
  });
  assert.equal(newPipeRes.status, 201);
  const pipeId = newPipeRes.body.id;

  // 3. Add custom stages in founder's own vocabulary
  const s1 = await apiRequest(`/pipelines/${pipeId}/stages`, 'POST', {
    name: '1. Inbound DM Teardown',
    orderIndex: 1,
    stageType: 'QUALIFICATION',
    description: 'Initial DM diagnostic'
  });
  assert.equal(s1.status, 201);

  const s2 = await apiRequest(`/pipelines/${pipeId}/stages`, 'POST', {
    name: '2. Founder Strategy Audit',
    orderIndex: 2,
    stageType: 'CALL',
    description: '60-minute strategy call'
  });
  assert.equal(s2.status, 201);

  const s3 = await apiRequest(`/pipelines/${pipeId}/stages`, 'POST', {
    name: '3. Custom Architecture Review',
    orderIndex: 3,
    stageType: 'CLOSING',
    description: 'Proposal & contract presentation'
  });
  assert.equal(s3.status, 201);

  // 4. Update custom stage name
  const updateStageRes = await apiRequest(`/pipelines/stages/${s2.body.id}`, 'PUT', {
    name: '2. Founder Growth Audit (Live)',
    orderIndex: 2
  });
  assert.equal(updateStageRes.status, 200);
  assert.equal(updateStageRes.body.name, '2. Founder Growth Audit (Live)');

  // 5. Delete / Archive custom stage
  const delStageRes = await apiRequest(`/pipelines/stages/${s3.body.id}`, 'DELETE');
  assert.equal(delStageRes.status, 200);
});

test('CONVERSION DOMAIN MODEL: Lead Qualification Breakdown', async () => {
  const leadRes = await apiRequest('/leads', 'POST', {
    name: 'Jordan Miller',
    email: 'jordan@scaleops.io',
    company: 'ScaleOps IO',
    intentScore: 90
  });
  assert.equal(leadRes.status, 201);
  const leadId = leadRes.body.id;

  const qualRes = await apiRequest(`/leads/${leadId}/qualification`, 'POST', {
    score: 94,
    budgetQualified: true,
    authorityQualified: true,
    needQualified: true,
    timelineQualified: true,
    qualifierNotes: 'Verifiable ARR $45k/mo, single founder bottleneck in sales calls.'
  });
  assert.equal(qualRes.status, 200);
  assert.equal(qualRes.body.score, 94);

  const getQualRes = await apiRequest(`/leads/${leadId}/qualification`);
  assert.equal(getQualRes.status, 200);
  assert.equal(getQualRes.body.qualifier_notes, 'Verifiable ARR $45k/mo, single founder bottleneck in sales calls.');
});

test('CONVERSION DOMAIN MODEL: DM Conversation & Thread Message Log', async () => {
  const convRes = await apiRequest('/dm-conversations', 'POST', {
    platform: 'LINKEDIN',
    participantHandle: '@jordan_scaleops',
    status: 'ACTIVE'
  });
  assert.equal(convRes.status, 201);
  const convId = convRes.body.id;

  const msg1 = await apiRequest(`/dm-conversations/${convId}/messages`, 'POST', {
    senderType: 'PROSPECT',
    messageText: 'Saw your post on FIS architecture. What is the installation timeframe?'
  });
  assert.equal(msg1.status, 201);

  const msg2 = await apiRequest(`/dm-conversations/${convId}/messages`, 'POST', {
    senderType: 'FOUNDER',
    messageText: '30 days to full autonomy. We set up Attention OS & Conversion OS in parallel.'
  });
  assert.equal(msg2.status, 201);

  const listMsgs = await apiRequest(`/dm-conversations/${convId}/messages`);
  assert.equal(listMsgs.status, 200);
  assert.equal(listMsgs.body.length, 2);
});

test('CONVERSION DOMAIN MODEL: Sales Call Transcript, Participants, Notes & Outcome', async () => {
  // Create deal first
  const dealRes = await apiRequest('/deals', 'POST', {
    dealName: 'ScaleOps IO — Growth OS',
    contactName: 'Jordan Miller',
    contactEmail: 'jordan@scaleops.io',
    amount: 15000,
    stage: 'CALL_SCHEDULED'
  });
  const dealId = dealRes.body.id;

  // Log sales call
  const callRes = await apiRequest('/sales-calls', 'POST', {
    dealId,
    durationSeconds: 2100,
    callType: 'DISCOVERY_DEMO'
  });
  assert.equal(callRes.status, 201);
  const callId = callRes.body.id;

  // 1. Attach transcript
  const trRes = await apiRequest(`/sales-calls/${callId}/transcript`, 'POST', {
    transcriptText: 'Founder Alex: Welcome Jordan. Tell me about your current sales call volume. Prospect Jordan: We take 15 calls a week.',
    speakerTurnsJson: [
      { speaker: 'Alex Morgan', text: 'Welcome Jordan. Tell me about your current sales call volume.' },
      { speaker: 'Jordan Miller', text: 'We take 15 calls a week.' }
    ]
  });
  assert.equal(trRes.status, 201);

  // 2. Add Participant
  const partRes = await apiRequest(`/sales-calls/${callId}/participants`, 'POST', {
    name: 'Jordan Miller',
    role: 'PROSPECT',
    email: 'jordan@scaleops.io'
  });
  assert.equal(partRes.status, 201);

  // 3. Add Note
  const noteRes = await apiRequest(`/sales-calls/${callId}/notes`, 'POST', {
    noteText: 'Strong buying intent. Main bottleneck is founder capacity on custom proposals.',
    authorName: 'Alex Morgan'
  });
  assert.equal(noteRes.status, 201);

  // 4. Record Outcome
  const outRes = await apiRequest(`/sales-calls/${callId}/outcome`, 'POST', {
    dealId,
    outcomeType: 'PROPOSAL_REQUESTED',
    nextStepAction: 'Send customized Growth OS Proposal',
    nextStepDueAt: new Date(Date.now() + 86400000).toISOString()
  });
  assert.equal(outRes.status, 201);
});

test('CONVERSION DOMAIN MODEL: Sales Methods & Top Performing Benchmark Calls', async () => {
  const methodRes = await apiRequest('/sales-methods', 'POST', {
    name: 'B2B Enterprise Mechanism Pitch',
    frameworkSummary: '5-step diagnostic framework mapping founder bottlenecks to systemized engines.',
    keyQuestionsJson: ['What is your current win rate?', 'How long does proposal drafting take?']
  });
  assert.equal(methodRes.status, 201);

  // Log benchmark top performing call
  const dealRes = await apiRequest('/deals', 'POST', {
    dealName: 'Benchmark Enterprise Deal',
    contactName: 'Elena Vance',
    contactEmail: 'elena@enterprise.org',
    amount: 25000,
    stage: 'CALL_COMPLETED'
  });

  const callRes = await apiRequest('/sales-calls', 'POST', {
    dealId: dealRes.body.id,
    durationSeconds: 2700,
    callType: 'CLOSING'
  });

  const topCallRes = await apiRequest('/top-performing-calls', 'POST', {
    salesCallId: callRes.body.id,
    benchmarkCategory: 'CLOSING_OBJECTION_HANDLING',
    whyTopPerforming: 'Flawless execution of the custom ROI mechanism objection breakdown.'
  });
  assert.equal(topCallRes.status, 201);
});

test('CONVERSION DOMAIN MODEL: Closers & Performance Tracking', async () => {
  const closerRes = await apiRequest('/closers', 'POST', {
    name: 'Rachel Green',
    email: 'rachel@asenzo.ai',
    role: 'SENIOR_CLOSER',
    quotaAmount: 75000
  });
  assert.equal(closerRes.status, 201);

  const perfRes = await apiRequest(`/closers/${closerRes.body.id}/performance`);
  assert.equal(perfRes.status, 200);
});

test('CONVERSION DOMAIN MODEL: Sales Activity Audit Trail per Deal', async () => {
  const dealRes = await apiRequest('/deals', 'POST', {
    dealName: 'Activity Trail Test Deal',
    contactName: 'Chris Paul',
    contactEmail: 'chris@cp.com',
    amount: 10000,
    stage: 'QUALIFIED_LEAD'
  });
  const dealId = dealRes.body.id;

  const actRes = await apiRequest(`/deals/${dealId}/activities`, 'POST', {
    activityType: 'CALL_COMPLETED',
    description: 'Completed 30-min discovery call; qualified lead for proposal.',
    performedBy: 'Alex Morgan'
  });
  assert.equal(actRes.status, 201);

  const listActRes = await apiRequest(`/deals/${dealId}/activities`);
  assert.equal(listActRes.status, 200);
  assert.equal(listActRes.body.length, 1);
  assert.equal(listActRes.body[0].activity_type, 'CALL_COMPLETED');
});
