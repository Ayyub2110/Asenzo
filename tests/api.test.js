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

// ════════════════════════════════════════════════════════════════════════════
// CONTENT STRATEGY & IDEA ENGINE — COMPLETE LIFECYCLE
// ════════════════════════════════════════════════════════════════════════════

const UNIQ = Date.now();

test('9. Content Pillar Lifecycle (Create -> Update -> Archive)', async () => {
  // Create
  const created = await request('POST', '/api/pillars', {
    name: `Lifecycle Pillar ${UNIQ}`,
    description: 'Test pillar for the complete lifecycle',
    targetAudience: 'Bootstrapped B2B Founders doing $15k–$50k/mo',
    objective: 'Prove the mechanism is the only repeatable route',
    pain: 'Trapped in 60-hr workweeks as the single bottleneck',
    desiredResult: 'Founders describe the mechanism in under 60 seconds',
    contentFormats: ['Framework Breakdown', 'Carousel'],
    supportedPlatforms: ['LINKEDIN', 'X_TWITTER'],
    status: 'ACTIVE',
    targetPercentage: 25
  });
  assert.strictEqual(created.status, 201);
  assert.ok(created.body.id);
  assert.ok(Array.isArray(created.body.contentFormats));
  assert.strictEqual(created.body.contentFormats.length, 2);
  assert.ok(Array.isArray(created.body.supportedPlatforms));
  const pillarId = created.body.id;

  // Update
  const updated = await request('PUT', `/api/pillars/${pillarId}`, {
    name: `Lifecycle Pillar ${UNIQ} v2`,
    status: 'PAUSED',
    targetPercentage: 40,
    contentFormats: ['Framework Breakdown', 'Carousel', 'Video']
  });
  assert.strictEqual(updated.status, 200);
  assert.strictEqual(updated.body.name, `Lifecycle Pillar ${UNIQ} v2`);
  assert.strictEqual(updated.body.status, 'PAUSED');
  assert.strictEqual(updated.body.target_percentage, 40);
  assert.strictEqual(updated.body.contentFormats.length, 3);

  // Archive
  const archived = await request('POST', `/api/pillars/${pillarId}/archive`);
  assert.strictEqual(archived.status, 200);
  const list = await request('GET', '/api/pillars');
  assert.ok(!list.body.some(p => p.id === pillarId), 'Archived pillar must be excluded by default');
});

test('10. Manual Idea Creation with Auto-Scoring against Business DNA', async () => {
  const created = await request('POST', '/api/ideas', {
    title: `The 60-hour workweek is a pricing error for bootstrapped founders ${UNIQ}`,
    premise: 'Every extra hour a founder spends closing DMs is a discount they gave away. The ASENZO 5-Engine Growth OS converts founder hours into installed operating capability.',
    source: 'MANUAL',
    pillarId: 'pil_pos',
    icp: 'Bootstrapped B2B Founders doing $15k-$50k/mo',
    pain: 'Trapped in 60-hr workweeks serving as the single bottleneck for marketing & sales',
    desiredResult: 'Scale to $100k/mo while raising Founder Independence Score to 85+',
    contentFormat: 'POST',
    platform: 'LINKEDIN',
    objective: 'Generate qualified inbound DMs',
    cta: 'DM me "FIS" to calculate your score.',
    status: 'NEW'
  });
  assert.strictEqual(created.status, 201);
  const idea = created.body;
  assert.ok(idea.id);
  assert.strictEqual(typeof idea.score, 'number');
  assert.ok(idea.score >= 0 && idea.score <= 100);

  // Scoring must evaluate all 7 required dimensions
  const dims = ['icpRelevance', 'painIntensity', 'novelty', 'authorityPotential', 'proofAvailability', 'commercialRelevance', 'founderExpertise'];
  for (const d of dims) {
    assert.ok(d in idea.scoreBreakdown, `Missing scoring dimension: ${d}`);
    assert.strictEqual(typeof idea.scoreBreakdown[d], 'number');
  }
  assert.ok(['HIGH', 'MEDIUM', 'LOW'].includes(idea.priority));
  globalThis.__IDEA_ID = idea.id;
});

test('11. Idea Re-Scoring Endpoint', async () => {
  const res = await request('POST', `/api/ideas/${globalThis.__IDEA_ID}/score`);
  assert.strictEqual(res.status, 200);
  assert.strictEqual(typeof res.body.score, 'number');
  assert.ok(res.body.explanation);
  assert.ok(Array.isArray(res.body.suggestions));
});

test('12. Idea Update Triggers Re-Scoring', async () => {
  const res = await request('PUT', `/api/ideas/${globalThis.__IDEA_ID}`, {
    title: `Agencies sell activity, not growth: the 60-hour workweek is a pricing error ${UNIQ}`,
    premise: 'Retainer agencies are structured to keep founders dependent. The ASENZO 5-Engine Growth OS installs operating capability instead.',
    reScore: true
  });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(typeof res.body.score, 'number');
  assert.ok(['HIGH', 'MEDIUM', 'LOW'].includes(res.body.priority));
  assert.ok(res.body.scoreBreakdown);
});

test('13. Duplicate Detection (no false positives on shared common words)', async () => {
  // True duplicate: identical title to the updated idea from test 12
  const same = await request('POST', '/api/ideas/check-duplicate', {
    title: `Agencies sell activity, not growth: the 60-hour workweek is a pricing error ${UNIQ}`,
    premise: 'Retainer agencies are structured to keep founders dependent. The ASENZO 5-Engine Growth OS installs operating capability instead.'
  });
  assert.strictEqual(same.status, 200);
  assert.strictEqual(same.body.isDuplicate, true);
  assert.ok(same.body.matches.some(m => m.id === globalThis.__IDEA_ID));

  // Distinct idea sharing only filler words -> must NOT be flagged
  const distinct = await request('POST', '/api/ideas/check-duplicate', {
    title: `The founder should think about product pricing for the new year ${UNIQ}`,
    premise: 'A generic observation about how founders approach yearly planning.'
  });
  assert.strictEqual(distinct.status, 200);
  assert.strictEqual(distinct.body.isDuplicate, false);
});

test('14. Idea Search, Filtering & Prioritization Sorting', async () => {
  const q = `pricing error ${UNIQ}`;
  const searched = await request('GET', `/api/ideas?q=${encodeURIComponent(q)}`);
  assert.strictEqual(searched.status, 200);
  assert.ok(searched.body.some(i => i.id === globalThis.__IDEA_ID));

  const byStatus = await request('GET', '/api/ideas?status=NEW');
  assert.strictEqual(byStatus.status, 200);
  assert.ok(byStatus.body.every(i => i.status === 'NEW'));

  const sorted = await request('GET', '/api/ideas?sort=score_desc');
  assert.strictEqual(sorted.status, 200);
  const scores = sorted.body.map(i => i.score);
  for (let i = 1; i < scores.length; i++) {
    assert.ok(scores[i - 1] >= scores[i], 'score_desc must sort descending');
  }
});

test('15. AI Generation Across All Idea Sources (grounded, non-generic, unique titles)', async () => {
  const sources = ['AI_GENERATED', 'CUSTOMER_QUESTION', 'OBJECTION', 'SALES_CONVERSATION', 'CASE_STUDY', 'MARKET_INTEL', 'SUCCESSFUL_CONTENT'];
  for (const src of sources) {
    const res = await request('POST', '/api/ideas/generate', { source: src, count: 3, pillarId: 'pil_mech' });
    assert.strictEqual(res.status, 201, `Generate failed for ${src}: ${JSON.stringify(res.body)}`);
    assert.strictEqual(res.body.ideas.length, 3);
    const titles = new Set();
    for (const idea of res.body.ideas) {
      assert.ok(idea.title.length >= 5);
      assert.strictEqual(typeof idea.score, 'number');
      assert.ok(idea.score >= 0 && idea.score <= 100);
      assert.ok(idea.notes, 'Generated idea must carry provenance notes');
      assert.ok(idea.pillar_id === 'pil_mech');
      titles.add(idea.title);
    }
    assert.strictEqual(titles.size, 3, `${src} produced duplicate titles within the batch`);
  }
});

test('16. Convert Idea to Content Pipeline Asset', async () => {
  const conv = await request('POST', `/api/ideas/${globalThis.__IDEA_ID}/convert`, { platform: 'LINKEDIN' });
  assert.strictEqual(conv.status, 201);
  assert.ok(conv.body.content.id);
  assert.strictEqual(conv.body.content.lifecycle_status, 'IDEA');
  assert.strictEqual(conv.body.content.idea_id, globalThis.__IDEA_ID);
  assert.strictEqual(conv.body.idea.status, 'CONVERTED');
  assert.strictEqual(conv.body.idea.converted_content_id, conv.body.content.id);

  const contents = await request('GET', '/api/contents');
  assert.ok(contents.body.some(c => c.id === conv.body.content.id));
});

test('17. Archive Idea (excluded by default, visible with includeArchived)', async () => {
  const arch = await request('POST', `/api/ideas/${globalThis.__IDEA_ID}/archive`);
  assert.strictEqual(arch.status, 200);

  const active = await request('GET', '/api/ideas');
  assert.ok(!active.body.some(i => i.id === globalThis.__IDEA_ID));

  const all = await request('GET', '/api/ideas?includeArchived=true');
  const found = all.body.find(i => i.id === globalThis.__IDEA_ID);
  assert.ok(found);
  assert.strictEqual(found.status, 'ARCHIVED');
});

test('18. Idea Soft-Delete', async () => {
  const created = await request('POST', '/api/ideas', {
    title: `Temporary delete-me idea ${UNIQ}`,
    premise: 'A throwaway idea used to verify the delete endpoint.',
    source: 'MANUAL',
    status: 'NEW'
  });
  assert.strictEqual(created.status, 201);
  const id = created.body.id;

  const del = await request('DELETE', `/api/ideas/${id}`);
  assert.strictEqual(del.status, 200);

  const active = await request('GET', '/api/ideas');
  assert.ok(!active.body.some(i => i.id === id));
  const all = await request('GET', '/api/ideas?includeArchived=true');
  assert.ok(!all.body.some(i => i.id === id), 'Deleted idea must be fully excluded');
});
