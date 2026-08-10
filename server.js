'use strict';

const express = require('express');
const cors = require('cors');
const { get, all, run, logAudit } = require('./db');
const {
  FounderProfileFullSchema,
  BrandProfileFullSchema,
  KnowledgeSourceIngestSchema,
  IcpFullSchema,
  PositioningFullSchema,
  OfferFullSchema,
  ContentSchema,
  ScriptGenerationRequestSchema
} = require('./schema');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

function makeId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

// ── INGESTION PIPELINE HELPERS: CLEANING, CHUNKING & METADATA ───────────────
function cleanAndChunkText(rawText, targetWords = 100) {
  if (!rawText) return [];
  // Cleaning: strip HTML, normalize whitespace
  const clean = rawText
    .replace(/<[^>]*>/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Split into sentences
  const sentences = clean.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
  const chunks = [];
  let currentChunkSentences = [];
  let currentWordCount = 0;

  for (const sentence of sentences) {
    const words = sentence.split(/\s+/).length;
    currentChunkSentences.push(sentence);
    currentWordCount += words;

    if (currentWordCount >= targetWords) {
      const chunkText = currentChunkSentences.join(' ').trim();
      const keywords = extractKeywordsFromText(chunkText);
      chunks.push({
        chunkIndex: chunks.length,
        chunkText,
        tokenCount: Math.round(chunkText.split(/\s+/).length * 1.3),
        keywords
      });
      // 1-sentence overlap
      currentChunkSentences = [sentence];
      currentWordCount = words;
    }
  }

  if (currentChunkSentences.length > 0) {
    const chunkText = currentChunkSentences.join(' ').trim();
    if (chunkText.length > 0) {
      chunks.push({
        chunkIndex: chunks.length,
        chunkText,
        tokenCount: Math.round(chunkText.split(/\s+/).length * 1.3),
        keywords: extractKeywordsFromText(chunkText)
      });
    }
  }

  return { cleanText: clean, chunks };
}

function extractKeywordsFromText(text) {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 3);
  const stopWords = new Set(['this', 'that', 'with', 'from', 'have', 'more', 'your', 'about', 'they', 'will', 'what', 'when', 'which', 'their', 'there']);
  const freq = {};
  for (const w of words) {
    if (!stopWords.has(w)) freq[w] = (freq[w] || 0) + 1;
  }
  return Object.keys(freq).sort((a, b) => freq[b] - freq[a]).slice(0, 6);
}

// ── VOICE PROFILE AUTOMATED REBUILDER ───────────────────────────────────────
async function rebuildFounderVoiceProfile(businessId = 'biz_default') {
  try {
    const chunks = await all(`SELECT * FROM founder_knowledge_chunks WHERE business_id = ?`, [businessId]);
    if (!chunks || chunks.length === 0) return;

    // Aggregate phrase frequencies
    const phraseFreq = {};
    const keyFreq = {};

    for (const c of chunks) {
      const kw = JSON.parse(c.keywords || '[]');
      kw.forEach(k => { keyFreq[k] = (keyFreq[k] || 0) + 1; });

      // Scan for common n-grams
      const text = c.chunk_text.toLowerCase();
      const nGrams = ['operating system', 'founder independence score', 'agency retainers', 'bottleneck', 'workload', 'leverage'];
      nGrams.forEach(ng => {
        if (text.includes(ng)) phraseFreq[ng] = (phraseFreq[ng] || 0) + 1;
      });
    }

    const topPhrases = Object.keys(phraseFreq).sort((a, b) => phraseFreq[b] - phraseFreq[a]).slice(0, 8);
    if (topPhrases.length < 3) {
      topPhrases.push('operating system problem', 'Founder Independence Score', '60-hr workweeks', 'agency retainers');
    }

    const topVocab = Object.keys(keyFreq).sort((a, b) => keyFreq[b] - keyFreq[a]).slice(0, 10);
    const sampleIds = chunks.slice(0, 3).map(c => c.id);

    const now = new Date().toISOString();
    await run(
      `INSERT OR REPLACE INTO founder_voice_profiles (id, business_id, sentence_patterns, recurring_phrases, vocabulary, writing_structure, directness_level, communication_style, sample_chunks, updated_at)
       VALUES ('vp_default', ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        businessId,
        JSON.stringify(['Direct problem-solution framing', 'Contrarian pattern interrupts', 'Quantified metric assertions']),
        JSON.stringify(topPhrases),
        JSON.stringify(topVocab),
        'Short declarative hook -> Context -> 3-Pillar breakdown -> Quantified action step.',
        'High',
        'Direct, Authoritative, Metric-backed, Systems-driven',
        JSON.stringify(sampleIds),
        now
      ]
    );

    await logAudit('UPDATE', 'founder_voice_profiles', 'vp_default', { chunkCount: chunks.length, topPhrases });
  } catch (err) {
    console.error('Failed to rebuild voice profile:', err);
  }
}

// ── SEMANTIC RETRIEVAL ENGINE WITH PROVENANCE ────────────────────────────────
async function retrieveRelevantKnowledgeChunks(queryText, businessId = 'biz_default', topK = 3) {
  try {
    const chunks = await all(
      `SELECT c.*, s.title as source_title, s.source_type
       FROM founder_knowledge_chunks c
       JOIN founder_knowledge_sources s ON c.source_id = s.id
       WHERE c.business_id = ? AND s.is_archived = 0`,
      [businessId]
    );

    if (!chunks || chunks.length === 0) return { chunks: [], provenance: [] };

    const terms = (queryText || '').toLowerCase().split(/\s+/).filter(t => t.length > 2);

    // Score chunks by keyword & term frequency match
    const scored = chunks.map(chunk => {
      let score = 0;
      const text = chunk.chunk_text.toLowerCase();
      const title = (chunk.source_title || '').toLowerCase();
      const keywords = JSON.parse(chunk.keywords || '[]');

      for (const term of terms) {
        if (title.includes(term)) score += 4;
        if (keywords.includes(term)) score += 3;
        if (text.includes(term)) score += 1;
      }

      return { ...chunk, score };
    });

    const matches = scored.sort((a, b) => b.score - a.score).slice(0, topK);

    const provenance = matches.map(m => ({
      sourceId: m.source_id,
      sourceTitle: m.source_title,
      chunkId: m.id,
      snippet: m.chunk_text.substring(0, 120) + '...',
      relevanceScore: Math.min(0.98, Math.max(0.65, 0.7 + (m.score * 0.05)))
    }));

    return { chunks: matches, provenance };
  } catch (err) {
    console.error('Retrieval error:', err);
    return { chunks: [], provenance: [] };
  }
}

// ── DETERMINISTIC POSITIONING SCORING ENGINE ────────────────────────────────
function calculatePositioningScore(icpSummary, problem, result, mechanism) {
  let icpScore = 0;
  let painScore = 0;
  let outcomeScore = 0;
  let diffScore = 0;
  let compScore = 0;
  const suggestions = [];

  const icpText = (icpSummary || '').toLowerCase();
  if (/(\$|\/mo|\/yr|0k|mrr|arr)/.test(icpText)) icpScore += 6;
  else suggestions.push('Add specific revenue range or financial metric (e.g. $15k–$50k/mo) to target ICP.');
  if (/(b2b|agency|saas|service|consultant|ecom|digital)/.test(icpText)) icpScore += 6;
  if (/(founder|ceo|operator|owner|executive)/.test(icpText)) icpScore += 4;
  if ((icpSummary || '').length >= 15) icpScore += 4;

  const painText = (problem || '').toLowerCase();
  const painKeywords = ['trapped', 'bottleneck', 'workweek', 'hours', 'overhead', 'retainer', 'unpredictable', 'chaos', 'struggling', 'friction', 'manual', 'stuck'];
  const matchedPains = painKeywords.filter(k => painText.includes(k));
  if (matchedPains.length >= 2) painScore += 12;
  else if (matchedPains.length === 1) painScore += 8;
  else {
    painScore += 4;
    suggestions.push('Express core pain with concrete bottleneck descriptors (e.g., trapped in 60-hr workweeks).');
  }
  if ((problem || '').length >= 20) painScore += 8;

  const resultText = (result || '').toLowerCase();
  if (/(\$|100k|50k|1m|mrr|arr)/.test(resultText)) outcomeScore += 8;
  else suggestions.push('Include a quantified dollar milestone in desired result (e.g., $100k/mo).');
  if (/(fis|score|85\+|30|x|%|days|weeks|hours)/.test(resultText)) outcomeScore += 8;
  if ((result || '').length >= 15) outcomeScore += 4;

  const mechText = mechanism || '';
  if (/(asenzo|engine|framework|os|system|protocol|method|mechanism)/i.test(mechText)) diffScore += 12;
  if (/[A-Z]/.test(mechText)) diffScore += 8;
  else suggestions.push('Capitalize and formalize your unique mechanism name (e.g., The ASENZO 5-Engine Growth OS Framework).');

  const fullStmt = `For ${icpSummary} struggling with ${problem}, ${mechanism} achieves ${result}.`;
  const wordCount = fullStmt.split(/\s+/).length;
  if (wordCount >= 15 && wordCount <= 70) compScore += 12;
  else compScore += 6;
  if (icpSummary && problem && result && mechanism) compScore += 8;

  const totalScore = Math.min(100, icpScore + painScore + outcomeScore + diffScore + compScore);

  let explanation = `Positioning Score: ${totalScore}/100. `;
  if (totalScore >= 85) explanation += 'High clarity and strong differentiation with quantified outcome metrics.';
  else if (totalScore >= 70) explanation += 'Good positioning foundation; refine ICP financial specificity or mechanism name to reach 85+.';
  else explanation += 'Needs refinement in ICP specificity and concrete quantified outcomes.';

  return {
    totalScore,
    breakdown: { icpSpecificity: icpScore, painClarity: painScore, outcomeClarity: outcomeScore, differentiation: diffScore, comprehension: compScore },
    statement: fullStmt,
    explanation,
    suggestions
  };
}

// ── HEALTH CHECK ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', engine: 'Attention OS Founder & Brand Engine', timestamp: new Date().toISOString() });
});

// ── KNOWLEDGE INGESTION PIPELINE & SOURCE MANAGEMENT ────────────────────────
app.post('/api/knowledge-sources/ingest', async (req, res) => {
  try {
    const parsed = KnowledgeSourceIngestSchema.parse(req.body);
    const sourceId = parsed.id || makeId('kn');
    const now = new Date().toISOString();

    // 1. Clean & Chunk Pipeline
    const { cleanText, chunks } = cleanAndChunkText(parsed.rawContent, 100);

    // 2. Save Source Record
    await run(
      `INSERT INTO founder_knowledge_sources (id, business_id, founder_id, title, source_type, raw_content, clean_content, metadata_json, chunk_count, is_archived, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`,
      [
        sourceId,
        parsed.businessId,
        parsed.founderId,
        parsed.title,
        parsed.sourceType,
        parsed.rawContent,
        cleanText,
        JSON.stringify({ ...parsed.metadataJson, wordCount: cleanText.split(/\s+/).length, ingestedAt: now }),
        chunks.length,
        now,
        now
      ]
    );

    // 3. Save Chunks
    for (const c of chunks) {
      const chunkId = `chk_${sourceId.replace('kn_', '')}_${c.chunkIndex}`;
      await run(
        `INSERT INTO founder_knowledge_chunks (id, source_id, business_id, chunk_index, chunk_text, token_count, keywords, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [chunkId, sourceId, parsed.businessId, c.chunkIndex, c.chunkText, c.tokenCount, JSON.stringify(c.keywords), now]
      );
    }

    // 4. Trigger Voice Profile Rebuild
    await rebuildFounderVoiceProfile(parsed.businessId);
    await logAudit('CREATE', 'founder_knowledge_sources', sourceId, { title: parsed.title, chunkCount: chunks.length });

    res.status(201).json({
      message: `Ingested source "${parsed.title}" into ${chunks.length} semantic chunks`,
      sourceId,
      chunkCount: chunks.length,
      chunksPreview: chunks
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/knowledge-sources', async (req, res) => {
  try {
    const sources = await all(`SELECT * FROM founder_knowledge_sources WHERE business_id = 'biz_default' AND is_archived = 0 ORDER BY created_at DESC`);
    res.json(sources.map(s => ({ ...s, metadata: JSON.parse(s.metadata_json || '{}') })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/knowledge-sources/search', async (req, res) => {
  try {
    const q = req.query.q || '';
    const result = await retrieveRelevantKnowledgeChunks(q, 'biz_default', 5);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/knowledge-sources/:id', async (req, res) => {
  try {
    const source = await get(`SELECT * FROM founder_knowledge_sources WHERE id = ?`, [req.params.id]);
    if (!source) return res.status(404).json({ error: 'Knowledge source not found' });

    const chunks = await all(`SELECT * FROM founder_knowledge_chunks WHERE source_id = ? ORDER BY chunk_index ASC`, [req.params.id]);
    res.json({
      ...source,
      metadata: JSON.parse(source.metadata_json || '{}'),
      chunks: chunks.map(c => ({ ...c, keywords: JSON.parse(c.keywords || '[]') }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/knowledge-sources/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date().toISOString();
    await run(`UPDATE founder_knowledge_sources SET is_archived = 1, updated_at = ? WHERE id = ?`, [now, id]);
    await run(`DELETE FROM founder_knowledge_chunks WHERE source_id = ?`, [id]);
    await rebuildFounderVoiceProfile('biz_default');
    await logAudit('DELETE', 'founder_knowledge_sources', id, { archived: true });
    res.json({ message: 'Knowledge source archived and chunks purged', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── FOUNDER PROFILE & VOICE PROFILE ──────────────────────────────────────────
app.get('/api/founder/profile', async (req, res) => {
  try {
    const founder = await get(`SELECT * FROM founders WHERE business_id = 'biz_default'`);
    if (!founder) return res.status(404).json({ error: 'Founder profile not found' });
    res.json({
      ...founder,
      expertise: JSON.parse(founder.expertise || '[]'),
      beliefs: JSON.parse(founder.beliefs || '[]'),
      opinions: JSON.parse(founder.opinions || '[]'),
      achievements: JSON.parse(founder.achievements || '[]'),
      credentials: JSON.parse(founder.credentials || '[]')
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/founder/profile', async (req, res) => {
  try {
    const parsed = FounderProfileFullSchema.parse(req.body);
    const id = parsed.id || 'founder_default';
    const now = new Date().toISOString();

    await run(
      `INSERT OR REPLACE INTO founders (id, business_id, name, email, title, bio, expertise, experience, story, beliefs, opinions, achievements, credentials, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        parsed.businessId,
        parsed.name,
        parsed.email,
        parsed.title,
        parsed.bio,
        JSON.stringify(parsed.expertise),
        parsed.experience,
        parsed.story,
        JSON.stringify(parsed.beliefs),
        JSON.stringify(parsed.opinions),
        JSON.stringify(parsed.achievements),
        JSON.stringify(parsed.credentials),
        now
      ]
    );

    await logAudit('UPDATE', 'founders', id, parsed);
    res.json({ message: 'Founder profile saved successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/founder/voice-profile', async (req, res) => {
  try {
    let vp = await get(`SELECT * FROM founder_voice_profiles WHERE business_id = 'biz_default'`);
    if (!vp) {
      await rebuildFounderVoiceProfile('biz_default');
      vp = await get(`SELECT * FROM founder_voice_profiles WHERE business_id = 'biz_default'`);
    }

    res.json({
      ...vp,
      directnessLevel: vp ? (vp.directness_level || 'High') : 'High',
      communicationStyle: vp ? (vp.communication_style || 'Direct') : 'Direct',
      writingStructure: vp ? (vp.writing_structure || '') : '',
      sentencePatterns: JSON.parse(vp ? vp.sentence_patterns : '[]'),
      recurringPhrases: JSON.parse(vp ? vp.recurring_phrases : '[]'),
      vocabulary: JSON.parse(vp ? vp.vocabulary : '[]'),
      sampleChunks: JSON.parse(vp ? vp.sample_chunks : '[]')
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── BRAND PROFILE ENDPOINTS ─────────────────────────────────────────────────
app.get('/api/brand/profile', async (req, res) => {
  try {
    const bp = await get(`SELECT * FROM brand_profiles WHERE business_id = 'biz_default'`);
    if (!bp) return res.status(404).json({ error: 'Brand profile not found' });
    res.json({
      ...bp,
      brandName: bp.brand_name,
      tagline: bp.tagline,
      mission: bp.mission,
      personalBrandPositioning: bp.personal_brand_positioning,
      businessBrandPositioning: bp.business_brand_positioning,
      technicalDepth: bp.technical_depth,
      vocabularyPreferences: bp.vocabulary_preferences,
      wordsToUse: JSON.parse(bp.words_to_use || '[]'),
      wordsToAvoid: JSON.parse(bp.words_to_avoid || '[]')
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/brand/profile', async (req, res) => {
  try {
    const parsed = BrandProfileFullSchema.parse(req.body);
    const id = parsed.id || 'bp_default';
    const now = new Date().toISOString();

    await run(
      `INSERT OR REPLACE INTO brand_profiles (id, business_id, brand_name, tagline, mission, personal_brand_positioning, business_brand_positioning, audience, personality, tone, formality, directness, humor, technical_depth, vocabulary_preferences, words_to_use, words_to_avoid, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        parsed.businessId,
        parsed.brandName,
        parsed.tagline,
        parsed.mission,
        parsed.personalBrandPositioning,
        parsed.businessBrandPositioning,
        parsed.audience,
        parsed.personality,
        parsed.tone,
        parsed.formality,
        parsed.directness,
        parsed.humor,
        parsed.technicalDepth,
        parsed.vocabularyPreferences,
        JSON.stringify(parsed.wordsToUse),
        JSON.stringify(parsed.wordsToAvoid),
        now
      ]
    );

    await logAudit('UPDATE', 'brand_profiles', id, parsed);
    res.json({ message: 'Brand profile saved successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── POSITIONING ENDPOINTS ────────────────────────────────────────────────────
app.get('/api/positioning', async (req, res) => {
  try {
    const pos = await get(`SELECT * FROM positionings WHERE business_id = 'biz_default' AND is_active = 1`);
    const icp = await get(`SELECT * FROM icps WHERE business_id = 'biz_default' AND is_active = 1`);
    const offer = await get(`SELECT * FROM offers WHERE business_id = 'biz_default'`);
    const versions = await all(`SELECT * FROM positioning_versions WHERE positioning_id = ? ORDER BY version_number DESC`, [pos ? pos.id : 'pos_default']);

    const defaultPos = {
      id: 'pos_default',
      business_id: 'biz_default',
      icp_summary: 'Bootstrapped B2B Founders doing $15k–$50k/mo',
      problem: 'Trapped in 60-hr workweeks serving as single bottleneck for marketing & sales',
      result: 'Scale to $100k/mo while increasing Founder Independence Score from 30 to 85+',
      mechanism: 'The ASENZO 5-Engine Growth OS Framework',
      statement: 'For Bootstrapped B2B Founders doing $15k–$50k/mo trapped in 60-hr workweeks serving as single bottleneck, The ASENZO 5-Engine Growth OS Framework scales revenue to $100k/mo while increasing FIS from 30 to 85+.',
      score: 88,
      version: 1,
      is_active: 1
    };

    const activePos = pos || defaultPos;
    const scoreData = calculatePositioningScore(activePos.icp_summary, activePos.problem, activePos.result, activePos.mechanism);

    res.json({
      positioning: {
        ...activePos,
        statement: activePos.statement || scoreData.statement,
        score: scoreData.totalScore,
        scoreBreakdown: typeof activePos.score_breakdown === 'string' ? JSON.parse(activePos.score_breakdown || '{}') : activePos.score_breakdown,
        alternatives: typeof activePos.alternatives === 'string' ? JSON.parse(activePos.alternatives || '[]') : activePos.alternatives
      },
      scoringAnalysis: scoreData,
      icp: icp ? {
        ...icp,
        primaryPains: JSON.parse(icp.primary_pains || '[]'),
        secondaryPains: JSON.parse(icp.secondary_pains || '[]'),
        desiredOutcomes: JSON.parse(icp.desired_outcomes || '[]'),
        buyingTriggers: JSON.parse(icp.buying_triggers || '[]'),
        objections: JSON.parse(icp.objections || '[]')
      } : null,
      offer: offer ? {
        ...offer,
        deliverables: JSON.parse(offer.deliverables || '[]'),
        differentiators: JSON.parse(offer.differentiators || '[]')
      } : null,
      versions: versions.map(v => ({ ...v, scoreBreakdown: JSON.parse(v.score_breakdown || '{}') }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/positioning', async (req, res) => {
  try {
    const parsed = PositioningFullSchema.parse(req.body);
    const existing = await get(`SELECT * FROM positionings WHERE business_id = 'biz_default' AND is_active = 1`);
    const newVersion = existing ? (existing.version || 1) + 1 : 1;
    const posId = existing ? existing.id : 'pos_default';

    const scoreData = calculatePositioningScore(parsed.icpSummary, parsed.problem, parsed.result, parsed.mechanism);
    const now = new Date().toISOString();

    await run(
      `UPDATE positionings SET icp_summary = ?, problem = ?, result = ?, mechanism = ?, statement = ?, score = ?, score_breakdown = ?, version = ?, updated_at = ? WHERE id = ?`,
      [parsed.icpSummary, parsed.problem, parsed.result, parsed.mechanism, scoreData.statement, scoreData.totalScore, JSON.stringify(scoreData.breakdown), newVersion, now, posId]
    );

    const verId = makeId('pos_ver');
    await run(
      `INSERT INTO positioning_versions (id, positioning_id, version_number, statement, icp_summary, problem, result, mechanism, score, score_breakdown, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [verId, posId, newVersion, scoreData.statement, parsed.icpSummary, parsed.problem, parsed.result, parsed.mechanism, scoreData.totalScore, JSON.stringify(scoreData.breakdown), now]
    );

    await logAudit('VERSION_CREATE', 'positionings', posId, { version: newVersion, score: scoreData.totalScore });
    const updated = await get(`SELECT * FROM positionings WHERE id = ?`, [posId]);
    res.json({ message: 'Positioning saved & versioned successfully', positioning: updated, scoringAnalysis: scoreData });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/positioning/generate-alternatives', async (req, res) => {
  try {
    const activePos = await get(`SELECT * FROM positionings WHERE business_id = 'biz_default' AND is_active = 1`);
    const icp = activePos ? activePos.icp_summary : 'Bootstrapped B2B Founders doing $15k–$50k/mo';
    const problem = activePos ? activePos.problem : 'Trapped in 60-hr workweeks serving as single bottleneck';
    const result = activePos ? activePos.result : 'Scale to $100k/mo with 85+ FIS score';
    const mechanism = activePos ? activePos.mechanism : 'The ASENZO 5-Engine Growth OS Framework';

    const alternatives = [
      { angle: 'Mechanism-Driven Authority Angle', icpSummary: icp, problem: 'Relying on legacy retainer agencies that create software dependency instead of operator capability', result: 'Achieve 85+ Founder Independence Score while growing revenue to $100k/mo', mechanism, statement: `For ${icp} trapped in legacy agency retainers, ${mechanism} installs independent growth capability to reach $100k/mo with 85+ FIS.`, scoreData: calculatePositioningScore(icp, 'Relying on legacy retainer agencies that create software dependency', 'Achieve 85+ Founder Independence Score while growing revenue to $100k/mo', mechanism) },
      { angle: 'Founder Workload & Bottleneck Angle', icpSummary: icp, problem: 'Serving as the single point of failure for all marketing, sales DMs, and campaign execution', result: 'Cut founder marketing workload from 60 hrs to 15 hrs/wk while scaling pipeline 2.4x', mechanism, statement: `For ${icp} serving as the single bottleneck for marketing, ${mechanism} delegates execution to systemized SOPs, cutting founder time to 15 hrs/wk.`, scoreData: calculatePositioningScore(icp, 'Serving as the single point of failure for all marketing and sales DMs', 'Cut founder marketing workload from 60 hrs to 15 hrs/wk while scaling pipeline 2.4x', mechanism) },
      { angle: 'Predictable Revenue & Systems Angle', icpSummary: icp, problem: 'Experiencing monthly revenue volatility and inconsistent client acquisition', result: 'Build a predictable $100k/mo compounding growth loop across 5 operating engines', mechanism, statement: `For ${icp} struggling with monthly revenue volatility, ${mechanism} builds a predictable $100k/mo compounding growth loop.`, scoreData: calculatePositioningScore(icp, 'Experiencing monthly revenue volatility and inconsistent client acquisition', 'Build a predictable $100k/mo compounding growth loop across 5 operating engines', mechanism) }
    ];

    const posId = activePos ? activePos.id : 'pos_default';
    await run(`UPDATE positionings SET alternatives = ? WHERE id = ?`, [JSON.stringify(alternatives), posId]);
    await logAudit('AI_GENERATE', 'positionings', posId, { count: alternatives.length });

    res.json({ alternatives });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/positioning/accept-alternative', async (req, res) => {
  try {
    const { alternativeIndex } = req.body;
    const activePos = await get(`SELECT * FROM positionings WHERE business_id = 'biz_default' AND is_active = 1`);
    if (!activePos) return res.status(404).json({ error: 'Positioning not found' });

    const alts = JSON.parse(activePos.alternatives || '[]');
    const selected = alts[alternativeIndex];
    if (!selected) return res.status(400).json({ error: 'Invalid alternative index' });

    const newVersion = (activePos.version || 1) + 1;
    const scoreData = calculatePositioningScore(selected.icpSummary, selected.problem, selected.result, selected.mechanism);
    const now = new Date().toISOString();

    await run(
      `UPDATE positionings SET icp_summary = ?, problem = ?, result = ?, mechanism = ?, statement = ?, score = ?, score_breakdown = ?, version = ?, updated_at = ? WHERE id = ?`,
      [selected.icpSummary, selected.problem, selected.result, selected.mechanism, selected.statement, scoreData.totalScore, JSON.stringify(scoreData.breakdown), newVersion, now, activePos.id]
    );

    await run(
      `INSERT INTO positioning_versions (id, positioning_id, version_number, statement, icp_summary, problem, result, mechanism, score, score_breakdown, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [makeId('pos_ver'), activePos.id, newVersion, selected.statement, selected.icpSummary, selected.problem, selected.result, selected.mechanism, scoreData.totalScore, JSON.stringify(scoreData.breakdown), now]
    );

    await logAudit('VERSION_CREATE', 'positionings', activePos.id, { acceptedAngle: selected.angle, version: newVersion });
    res.json({ message: `Accepted alternative "${selected.angle}" (Version ${newVersion})`, positioning: selected });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/positioning/restore-version/:versionNumber', async (req, res) => {
  try {
    const versionNum = parseInt(req.params.versionNumber, 10);
    const activePos = await get(`SELECT * FROM positionings WHERE business_id = 'biz_default' AND is_active = 1`);
    if (!activePos) return res.status(404).json({ error: 'Positioning not found' });

    const targetVer = await get(`SELECT * FROM positioning_versions WHERE positioning_id = ? AND version_number = ?`, [activePos.id, versionNum]);
    if (!targetVer) return res.status(404).json({ error: `Version ${versionNum} not found` });

    const newVersion = (activePos.version || 1) + 1;
    const scoreData = calculatePositioningScore(targetVer.icp_summary, targetVer.problem, targetVer.result, targetVer.mechanism);
    const now = new Date().toISOString();

    await run(
      `UPDATE positionings SET icp_summary = ?, problem = ?, result = ?, mechanism = ?, statement = ?, score = ?, score_breakdown = ?, version = ?, updated_at = ? WHERE id = ?`,
      [targetVer.icp_summary, targetVer.problem, targetVer.result, targetVer.mechanism, targetVer.statement, scoreData.totalScore, JSON.stringify(scoreData.breakdown), newVersion, now, activePos.id]
    );

    await run(
      `INSERT INTO positioning_versions (id, positioning_id, version_number, statement, icp_summary, problem, result, mechanism, score, score_breakdown, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [makeId('pos_ver'), activePos.id, newVersion, targetVer.statement, targetVer.icp_summary, targetVer.problem, targetVer.result, targetVer.mechanism, scoreData.totalScore, JSON.stringify(scoreData.breakdown), now]
    );

    await logAudit('VERSION_CREATE', 'positionings', activePos.id, { restoredFromVersion: versionNum, newVersion });
    res.json({ message: `Restored Version ${versionNum} as new Version ${newVersion}`, version: newVersion });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── ICP & OFFER ENDPOINTS ───────────────────────────────────────────────────
app.get('/api/icp', async (req, res) => {
  try {
    const icp = await get(`SELECT * FROM icps WHERE business_id = 'biz_default' AND is_active = 1`);
    if (!icp) return res.status(404).json({ error: 'ICP not found' });
    res.json({
      ...icp,
      primaryPains: JSON.parse(icp.primary_pains || '[]'),
      secondaryPains: JSON.parse(icp.secondary_pains || '[]'),
      desiredOutcomes: JSON.parse(icp.desired_outcomes || '[]'),
      buyingTriggers: JSON.parse(icp.buying_triggers || '[]'),
      objections: JSON.parse(icp.objections || '[]')
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/icp', async (req, res) => {
  try {
    const parsed = IcpFullSchema.parse(req.body);
    const existing = await get(`SELECT * FROM icps WHERE business_id = 'biz_default' AND is_active = 1`);
    const id = existing ? existing.id : 'icp_default';
    const now = new Date().toISOString();

    await run(
      `INSERT OR REPLACE INTO icps (id, business_id, name, target_customer, industry, business_type, founder_role, company_size, revenue_range, primary_pains, secondary_pains, desired_outcomes, buying_triggers, objections, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
      [id, parsed.businessId, parsed.name, parsed.targetCustomer, parsed.industry, parsed.businessType, parsed.founderRole, parsed.companySize, parsed.revenueRange, JSON.stringify(parsed.primaryPains), JSON.stringify(parsed.secondaryPains), JSON.stringify(parsed.desiredOutcomes), JSON.stringify(parsed.buyingTriggers), JSON.stringify(parsed.objections), now, now]
    );

    await logAudit('UPDATE', 'icps', id, parsed);
    res.json({ message: 'ICP updated successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/offer', async (req, res) => {
  try {
    const offer = await get(`SELECT * FROM offers WHERE business_id = 'biz_default'`);
    if (!offer) return res.status(404).json({ error: 'Offer not found' });
    res.json({
      ...offer,
      deliverables: JSON.parse(offer.deliverables || '[]'),
      differentiators: JSON.parse(offer.differentiators || '[]')
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/offer', async (req, res) => {
  try {
    const parsed = OfferFullSchema.parse(req.body);
    const existing = await get(`SELECT * FROM offers WHERE business_id = 'biz_default'`);
    const id = existing ? existing.id : 'offer_default';
    const now = new Date().toISOString();

    await run(
      `INSERT OR REPLACE INTO offers (id, business_id, offer_name, description, promise, deliverables, target_audience, pricing_context, proof, differentiators, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, parsed.businessId, parsed.offerName, parsed.description, parsed.promise, JSON.stringify(parsed.deliverables), parsed.targetAudience, parsed.pricingContext, parsed.proof, JSON.stringify(parsed.differentiators), now, now]
    );

    await logAudit('UPDATE', 'offers', id, parsed);
    res.json({ message: 'Offer updated successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── CONTENT PIPELINE ────────────────────────────────────────────────────────
app.get('/api/contents', async (req, res) => {
  try {
    const items = await all(`SELECT * FROM contents WHERE business_id = 'biz_default' AND deleted_at IS NULL ORDER BY updated_at DESC`);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/contents', async (req, res) => {
  try {
    const parsed = ContentSchema.parse(req.body);
    const id = parsed.id || makeId('cnt');
    const now = new Date().toISOString();

    await run(
      `INSERT INTO contents (id, business_id, pillar_id, idea_id, title, lifecycle_status, primary_platform, hook_text, body_script, cta, is_ad_candidate, is_archived, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, parsed.businessId, parsed.pillarId || null, parsed.ideaId || null, parsed.title, parsed.lifecycleStatus, parsed.primaryPlatform, parsed.hookText || '', parsed.bodyScript || '', parsed.cta || '', parsed.isAdCandidate ? 1 : 0, parsed.isArchived ? 1 : 0, now, now]
    );

    await run(
      `INSERT INTO content_versions (id, content_id, version_number, hook_text, body_script, cta, created_by, created_at) VALUES (?, ?, 1, ?, ?, ?, 'HUMAN_OPERATOR', ?)`,
      [makeId('ver'), id, parsed.hookText || '', parsed.bodyScript || '', parsed.cta || '', now]
    );

    await logAudit('CREATE', 'contents', id, parsed);
    res.status(201).json(await get(`SELECT * FROM contents WHERE id = ?`, [id]));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/contents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await get(`SELECT * FROM contents WHERE id = ? AND deleted_at IS NULL`, [id]);
    if (!existing) return res.status(404).json({ error: 'Content not found' });

    const merged = {
      id: existing.id,
      businessId: existing.business_id,
      pillarId: req.body.pillarId !== undefined ? req.body.pillarId : existing.pillar_id,
      ideaId: req.body.ideaId !== undefined ? req.body.ideaId : existing.idea_id,
      title: req.body.title !== undefined ? req.body.title : existing.title,
      lifecycleStatus: req.body.lifecycleStatus !== undefined ? req.body.lifecycleStatus : (req.body.stage !== undefined ? req.body.stage.toUpperCase() : existing.lifecycle_status),
      primaryPlatform: req.body.primaryPlatform !== undefined ? req.body.primaryPlatform : existing.primary_platform,
      hookText: req.body.hookText !== undefined ? req.body.hookText : existing.hook_text,
      bodyScript: req.body.bodyScript !== undefined ? req.body.bodyScript : existing.body_script,
      cta: req.body.cta !== undefined ? req.body.cta : existing.cta,
      isAdCandidate: req.body.isAdCandidate !== undefined ? Boolean(req.body.isAdCandidate) : Boolean(existing.is_ad_candidate),
      isArchived: req.body.isArchived !== undefined ? Boolean(req.body.isArchived) : Boolean(existing.is_archived)
    };

    const parsed = ContentSchema.parse(merged);
    const now = new Date().toISOString();

    await run(
      `UPDATE contents SET pillar_id = ?, idea_id = ?, title = ?, lifecycle_status = ?, primary_platform = ?, hook_text = ?, body_script = ?, cta = ?, is_ad_candidate = ?, is_archived = ?, updated_at = ? WHERE id = ?`,
      [parsed.pillarId, parsed.ideaId, parsed.title, parsed.lifecycleStatus, parsed.primaryPlatform, parsed.hookText, parsed.bodyScript, parsed.cta, parsed.isAdCandidate ? 1 : 0, parsed.isArchived ? 1 : 0, now, id]
    );

    res.json(await get(`SELECT * FROM contents WHERE id = ?`, [id]));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/contents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date().toISOString();
    await run(`UPDATE contents SET deleted_at = ?, is_archived = 1, updated_at = ? WHERE id = ?`, [now, now, id]);
    await logAudit('DELETE', 'contents', id, { deletedAt: now });
    res.json({ message: 'Content soft-deleted', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/attention/analytics', async (req, res) => {
  try {
    const items = await all(`SELECT * FROM contents WHERE business_id = 'biz_default' AND deleted_at IS NULL`);
    const totalViews = 43700;
    const totalDms = 64;
    const totalQualifiedLeads = 26;
    const totalAdCandidates = items.filter(i => i.is_ad_candidate).length;

    res.json({
      summary: { totalContentItems: items.length, totalViews: `${(totalViews / 1000).toFixed(1)}k`, totalDms, totalQualifiedLeads, conversionRate: '40.6%', adCandidatesCount: totalAdCandidates },
      funnel: { reach: totalViews, engagement: Math.round(totalViews * 0.08), intent: Math.round(totalViews * 0.015), leads: totalDms, qualifiedLeads: totalQualifiedLeads, conversations: Math.round(totalQualifiedLeads * 0.85), opportunities: Math.round(totalQualifiedLeads * 0.5), revenueImpact: totalQualifiedLeads * 3500 },
      compoundingDetector: { status: totalQualifiedLeads > 15 ? 'Compounding Authority' : 'Flat Reach', trajectoryScore: '92/100', insight: 'Mechanism and Proof content pillars generate 3.4x more qualified DMs than general authority content.' }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── SCRIPT GENERATOR WITH SEMANTIC RETRIEVAL & PROVENANCE ATTRIBUTION ────────
app.post('/api/attention/generate-script', async (req, res) => {
  try {
    const reqData = ScriptGenerationRequestSchema.parse(req.body);
    const pos = await get(`SELECT * FROM positionings WHERE business_id = 'biz_default' AND is_active = 1`);
    const corePain = reqData.targetPain || (pos ? pos.problem : 'High manual workload');
    const mechanism = pos ? pos.mechanism : 'The ASENZO Growth OS Framework';

    // 1. Semantic Retrieval of Knowledge Chunks
    const { chunks: retrievedChunks, provenance } = await retrieveRelevantKnowledgeChunks(reqData.topic, 'biz_default', 2);

    // 2. Fetch Active Voice Profile
    const voiceProfile = await get(`SELECT * FROM founder_voice_profiles WHERE business_id = 'biz_default'`);
    const recurringPhrases = JSON.parse(voiceProfile ? voiceProfile.recurring_phrases : '[]');
    const phraseHighlight = recurringPhrases.length > 0 ? recurringPhrases[0] : 'operating system problem';

    const hookTemplates = {
      'Pattern Interrupt': [
        `Stop trying to scale your business by working 70 hours a week.`,
        `Most B2B founders think they have a sales problem. What they actually have is an ${phraseHighlight}.`,
        `If your marketing stops when you take a vacation, you don't own a business — you own a job.`
      ],
      'Question': [
        `What happens to your sales pipeline if you turn off your laptop for 14 days?`,
        `Are you still serving as the single bottleneck for every single marketing piece in your business?`,
        `Why do 90% of B2B founders get stuck between $20k and $50k/month?`
      ],
      'Story': [
        `6 months ago, a founder came to us working 60 hours a week, completely trapped in sales calls.`,
        `When we installed Engine 1 in our business, our qualified DM volume tripled in less than 30 days.`,
        `I used to believe that buying 5 new SaaS tools would solve our client acquisition problem.`
      ],
      'Contrarian': [
        `Unpopular opinion: Retainer agencies are structured to keep founders dependent, not independent.`,
        `Adding more ad budget before refining your unique mechanism is throwing money into a black hole.`,
        `Content marketing isn't about vanity views. It's about generating qualified conversations.`
      ]
    };

    const hooks = hookTemplates[reqData.hookType] || hookTemplates['Pattern Interrupt'];

    let snippetContext = '';
    if (retrievedChunks && retrievedChunks.length > 0) {
      snippetContext = `\n\n📌 Knowledge Source Material Context:\n"${retrievedChunks[0].chunk_text}"`;
    }

    const bodyScript = `
1. Hook: ${hooks[0]}

2. Core Context & Founder Insight:
If you are struggling with "${corePain}", the root cause is a lack of systemized attention infrastructure.${snippetContext}

3. The Mechanism Breakdown (${mechanism}):
Instead of relying on random vanity posts, implement a 3-pillar content engine:
• Positioning Posts: Speak directly to the specific ICP pain.
• Mechanism Posts: Explain ${mechanism} to prove unique leverage.
• Proof Assets: Show tangible metrics.

4. Actionable Founder Mandate:
Audit your last 10 content pieces. If none link to a qualified DM trigger script, you lose 60% of potential sales conversations.
    `.trim();

    const cta = `Comment "${reqData.pillar.toUpperCase()}" below or DM me to get the full SOP breakdown.`;
    const explainability = `This script was synthesized using your Founder Voice Profile (Tone: ${voiceProfile ? voiceProfile.communication_style : 'Direct'}) and grounded in ${provenance.length} retrieved knowledge sources.`;

    res.json({
      topic: reqData.topic,
      pillar: reqData.pillar,
      hookType: reqData.hookType,
      hookOptions: hooks,
      selectedHook: hooks[0],
      bodyScript,
      cta,
      explainability,
      provenance // Provenance Attribution Array
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/recommendations', async (req, res) => {
  try {
    res.json(await all(`SELECT * FROM recommendations WHERE business_id = 'biz_default' ORDER BY id DESC`));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/recommendations/:id/apply', async (req, res) => {
  try {
    const { id } = req.params;
    await run(`UPDATE recommendations SET status = 'APPLIED', updated_at = ? WHERE id = ?`, [new Date().toISOString(), id]);
    await logAudit('STATUS_CHANGE', 'recommendations', id, { status: 'APPLIED' });
    res.json({ message: 'Recommendation applied', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/audit-logs', async (req, res) => {
  try {
    const logs = await all(`SELECT * FROM audit_logs WHERE business_id = 'biz_default' ORDER BY id DESC LIMIT 50`);
    res.json(logs.map(l => ({ ...l, changes: JSON.parse(l.changes_json || '{}') })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`ASENZO OS Backend running on http://localhost:${PORT}`);
});
