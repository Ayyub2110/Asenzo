const test = require('node:test');
const assert = require('node:assert');
const http = require('node:http');

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        host: 'localhost',
        port: 3001,
        path,
        method,
        headers: payload ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) } : {}
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

test('1. API Health Check', async () => {
  const res = await request('GET', '/api/health');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.status, 'ok');
});

test('2. Founder & Brand Profile CRUD', async () => {
  const fpRes = await request('GET', '/api/founder/profile');
  assert.strictEqual(fpRes.status, 200);
  assert.strictEqual(fpRes.body.name, 'Alex Morgan');

  const updateFp = await request('POST', '/api/founder/profile', {
    name: 'Alex Morgan',
    email: 'alex@asenzo.ai',
    title: 'Chief Operating Founder',
    expertise: ['B2B Systems', 'Growth Engineering'],
    story: 'Engineered the 5-Engine Growth OS after 6 years of agency friction.'
  });
  assert.strictEqual(updateFp.status, 200);

  const bpRes = await request('GET', '/api/brand/profile');
  assert.strictEqual(bpRes.status, 200);
  assert.strictEqual(bpRes.body.brandName, 'ASENZO Growth OS');
});

test('3. Knowledge Ingestion Pipeline (Source -> Validation -> Cleaning -> Chunking -> Metadata -> Storage)', async () => {
  const rawText = `
    In our 90-day growth sprint, we analyze why B2B founders suffer from predictable pipeline drop-offs.
    First, founders rely on manual DM triage without SOP delegation. This creates an immediate sales bottleneck.
    Second, content output is erratic because there is no structured positioning source of truth.
    When you implement Engine 1 Attention OS, your qualified lead conversation volume increases by 3.4x while founder time drops to 15 hours per week.
  `.trim();

  const ingestRes = await request('POST', '/api/knowledge-sources/ingest', {
    title: 'Transcript: 90-Day Growth Sprint Bottleneck Analysis',
    sourceType: 'TRANSCRIPT',
    rawContent: rawText
  });

  assert.strictEqual(ingestRes.status, 201);
  assert.ok(ingestRes.body.sourceId);
  assert.ok(ingestRes.body.chunkCount >= 1);
  assert.ok(Array.isArray(ingestRes.body.chunksPreview));
});

test('4. Chunk Retrieval & Semantic Keyword Search', async () => {
  const searchRes = await request('GET', '/api/knowledge-sources/search?q=pipeline');
  assert.strictEqual(searchRes.status, 200);
  assert.ok(Array.isArray(searchRes.body.chunks));
  assert.ok(searchRes.body.chunks.length > 0);
  assert.ok(Array.isArray(searchRes.body.provenance));
  assert.ok(searchRes.body.provenance[0].sourceTitle);
});

test('5. Founder Voice Profile Aggregation', async () => {
  const vpRes = await request('GET', '/api/founder/voice-profile');
  assert.strictEqual(vpRes.status, 200);
  assert.ok(Array.isArray(vpRes.body.recurringPhrases));
  assert.strictEqual(vpRes.body.directnessLevel, 'High');
});

test('6. Script Generation with Context Retrieval & Provenance Attribution', async () => {
  const scriptRes = await request('POST', '/api/attention/generate-script', {
    pillar: 'Mechanism',
    hookType: 'Pattern Interrupt',
    topic: 'pipeline bottleneck'
  });

  assert.strictEqual(scriptRes.status, 200);
  assert.ok(scriptRes.body.bodyScript);
  assert.ok(Array.isArray(scriptRes.body.provenance));
  assert.ok(scriptRes.body.provenance.length > 0);
  assert.ok(scriptRes.body.provenance[0].sourceTitle);
  assert.ok(scriptRes.body.provenance[0].chunkId);
});

test('7. Knowledge Source Management & Archiving', async () => {
  const sourcesRes = await request('GET', '/api/knowledge-sources');
  assert.strictEqual(sourcesRes.status, 200);
  const targetId = sourcesRes.body[0].id;

  const delRes = await request('DELETE', `/api/knowledge-sources/${targetId}`);
  assert.strictEqual(delRes.status, 200);
  assert.strictEqual(delRes.body.id, targetId);
});

test('8. Audit Log Verification', async () => {
  const auditRes = await request('GET', '/api/audit-logs');
  assert.strictEqual(auditRes.status, 200);
  assert.ok(Array.isArray(auditRes.body));
  assert.ok(auditRes.body.some(a => a.entity_type === 'founder_knowledge_sources'));
});
