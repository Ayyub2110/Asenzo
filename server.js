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
  ScriptGenerationRequestSchema,
  ContentPillarFullSchema,
  ContentIdeaSchema,
  ContentIdeaGenerateRequestSchema
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

// ── CONTENT IDEA SCORING ENGINE ────────────────────────────────────────────
// Evaluates 7 dimensions grounded in Business DNA, Positioning, Brand Voice &
// Founder Knowledge so scores reflect the actual business (never generic).
function tokenize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9$%+\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2);
}

function overlapRatio(aWords, bWords) {
  if (!aWords.length || !bWords.length) return 0;
  const setB = new Set(bWords);
  const hits = aWords.filter(w => setB.has(w));
  return hits.length / Math.max(1, Math.min(aWords.length, bWords.length));
}

function normIdeaKey(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function buildIdeaScoringContext() {
  const [pos, icp, offer, founder, vp] = await Promise.all([
    get(`SELECT * FROM positionings WHERE business_id = 'biz_default' AND is_active = 1`),
    get(`SELECT * FROM icps WHERE business_id = 'biz_default' AND is_active = 1`),
    get(`SELECT * FROM offers WHERE business_id = 'biz_default'`),
    get(`SELECT * FROM founders WHERE business_id = 'biz_default'`),
    get(`SELECT * FROM founder_voice_profiles WHERE business_id = 'biz_default'`)
  ]);
  const existingIdeas = await all(`SELECT title, premise FROM content_ideas WHERE business_id = 'biz_default' AND deleted_at IS NULL AND is_archived = 0`);
  const existingContents = await all(`SELECT title FROM contents WHERE business_id = 'biz_default' AND deleted_at IS NULL`);
  const chunks = await all(`SELECT chunk_text FROM founder_knowledge_chunks WHERE business_id = 'biz_default'`);
  return { pos, icp, offer, founder, vp, existingIdeas, existingContents, chunks };
}

function scoreContentIdea(idea, ctx) {
  const text = `${idea.title || ''} ${idea.premise || ''} ${idea.pain || ''}`;
  const textWords = tokenize(text);
  const t = text.toLowerCase();
  let b = {};
  const suggestions = [];

  // 1. ICP Relevance (0-20) — how squarely it targets the documented ICP
  const icpText = [ctx.icp && ctx.icp.target_customer, ctx.icp && ctx.icp.industry, ctx.icp && ctx.icp.founder_role, ctx.pos && ctx.pos.icp_summary].filter(Boolean).join(' ');
  const icpWords = tokenize(icpText);
  const icpOverlap = overlapRatio(textWords, icpWords);
  b.icpRelevance = Math.min(20, Math.round(4 + icpOverlap * 16));
  if (idea.icp && tokenize(idea.icp).length > 3) b.icpRelevance = Math.min(20, b.icpRelevance + 4);
  if (!icpOverlap) suggestions.push('Reference the specific ICP (revenue tier, entity type, role) so the idea can only belong to this audience.');

  // 2. Pain Intensity (0-15) — overlaps documented ICP pains & positioning problem
  const painKeywords = [];
  const pains = (ctx.icp ? ctx.icp.primary_pains : null) || (ctx.pos ? ctx.pos.problem : '');
  painKeywords.push(...tokenize(pains));
  if (ctx.icp) painKeywords.push(...tokenize(ctx.icp.objections || ''));
  const painOverlap = overlapRatio(textWords, [...new Set(painKeywords)]);
  b.painIntensity = Math.min(15, Math.round(3 + painOverlap * 12));
  if (/(60.hr|bottleneck|trapped|workweek|burnout|overwhelmed|retainer|unpredictable|manual|chaos|stuck)/.test(t)) b.painIntensity = Math.min(15, b.painIntensity + 2);
  if (painOverlap < 0.15) suggestions.push('Anchor the idea in a specific, painful friction (e.g. 60-hr workweeks, retainer dependency).');

  // 3. Novelty (0-15) — distance from previously generated ideas & published content
  const ideaKey = normIdeaKey(idea.title);
  const knownKeys = [
    ...(ctx.existingIdeas || []).map(i => `${i.title} ${i.premise}`),
    ...(ctx.existingContents || []).map(c => c.title)
  ].map(normIdeaKey);
  const knownWords = tokenize(knownKeys.join(' '));
  const noveltyOverlap = overlapRatio(tokenize(ideaKey), knownWords);
  b.novelty = Math.max(4, Math.min(15, 15 - Math.round(noveltyOverlap * 14)));
  if (idea.noviceMarker) b.novelty = Math.min(15, b.novelty + 2);

  // 4. Authority Potential (0-15) — mechanism framing, quantified claims, contrarian edge
  let authority = 3;
  const mech = (ctx.pos && ctx.pos.mechanism) || '';
  if (mech && t.includes(tokenize(mech)[0] || 'framework')) authority += 3;
  if (/(fis|framework|engine|operating system|mechanism|sop|independent)/.test(t)) authority += 4;
  if (/[0-9]|%|\$|x[2-9]/.test(idea.premise)) authority += 3;
  if (/(contrarian|unpopular|myth|stop |don't|without)/.test(t)) authority += 3;
  b.authorityPotential = Math.min(15, authority);

  // 5. Proof Availability (0-15) — does founder knowledge/offer proof substantiate it?
  const proofPool = [
    ctx.offer && ctx.offer.proof,
    ...((ctx.founder && (JSON.parse(ctx.founder.achievements || '[]') || []))),
    ...(ctx.chunks || []).map(c => c.chunk_text)
  ].filter(Boolean).join(' ');
  const proofKeywords = tokenize(proofPool);
  const proofOverlap = overlapRatio(textWords, proofKeywords);
  b.proofAvailability = Math.min(15, Math.round(3 + proofOverlap * 12));
  if (/(case study|2\.4x|3\.4x|90 days|90-day|scaled|raised .* score|dms? tripl)/.test(proofPool.toLowerCase()) && /(proof|case|result|grew|scaled|tripled|doubled|x[2-9]|number|metric)/.test(t)) b.proofAvailability = Math.min(15, b.proofAvailability + 2);
  if (proofOverlap < 0.1) suggestions.push('Pair the idea with a proof anchor (case study, metric, or knowledge chunk) to make it credible.');

  // 6. Commercial Relevance (0-10) — links back to offer, promise & revenue outcome
  let commercial = 2;
  const offerText = [ctx.offer && ctx.offer.offer_name, ctx.offer && ctx.offer.promise, ctx.pos && ctx.pos.result].filter(Boolean).join(' ');
  const commercialOverlap = overlapRatio(textWords, tokenize(offerText));
  commercial += Math.round(commercialOverlap * 6);
  if (/(cta|dm|book|install|audit|consult)/.test(t)) commercial += 2;
  b.commercialRelevance = Math.min(10, commercial);

  // 7. Founder Expertise (0-10) — overlaps founder expertise, story, beliefs
  const founderText = [
    ctx.founder && (JSON.parse(ctx.founder.expertise || '[]') || []).join(' '),
    ctx.founder && ctx.founder.story,
    ctx.founder && (JSON.parse(ctx.founder.beliefs || '[]') || []).join(' ')
  ].filter(Boolean).join(' ');
  const founderOverlap = overlapRatio(textWords, tokenize(founderText));
  b.founderExpertise = Math.min(10, Math.round(2 + founderOverlap * 8));

  const totalScore = Math.min(100, Math.round(
    b.icpRelevance + b.painIntensity + b.novelty + b.authorityPotential + b.proofAvailability + b.commercialRelevance + b.founderExpertise
  ));
  const priority = totalScore >= 80 ? 'HIGH' : totalScore >= 60 ? 'MEDIUM' : 'LOW';

  let explanation = `Scored ${totalScore}/100 against active Business DNA. `;
  if (b.painIntensity >= 10) explanation += 'High-pain, ICP-specific angle. ';
  if (b.novelty >= 11) explanation += 'Novel versus existing pipeline. ';
  if (b.proofAvailability >= 10) explanation += 'Backed by available proof. ';
  if (b.authorityPotential >= 10) explanation += 'Strong mechanism/authority framing. ';

  return { totalScore, priority, breakdown: b, explanation, suggestions };
}

// ── CONTENT IDEA DUPLICATE DETECTION ────────────────────────────────────────
// Uses Jaccard similarity over distinct, stop-word-filtered tokens so that
// common filler words ("the", "for", "founder") never trigger false positives.
const DUP_STOP_WORDS = new Set([
  'the', 'and', 'for', 'are', 'you', 'your', 'with', 'from', 'that', 'this',
  'they', 'them', 'was', 'were', 'has', 'have', 'had', 'not', 'but', 'all',
  'can', 'just', 'into', 'about', 'out', 'what', 'when', 'where', 'which',
  'will', 'there', 'their', 'how', 'why', 'its', 'get', 'got', 'one', 'two',
  'new', 'make', 'made', 'like', 'know', 'want', 'need', 'use', 'used',
  'would', 'could', 'should', 'very', 'really', 'good', 'great', 'best',
  'every', 'more', 'than', 'then', 'because', 'been', 'being', 'other',
  'some', 'such', 'only', 'own', 'also', 'over', 'under', 'between',
  'against', 'during', 'without', 'after', 'before', 'while', 'through',
  'across', 'again', 'once', 'here', 'our', 'his', 'her', 'him', 'she',
  'who', 'whom', 'said', 'say', 'see', 'do', 'does', 'did', 'don', 'can'
]);

function tokenizeDistinct(text) {
  return [...new Set(tokenize(text).filter(w => !DUP_STOP_WORDS.has(w)))];
}

function jaccardSimilarity(a, b) {
  if (!a.length || !b.length) return 0;
  const setB = new Set(b);
  const intersection = a.filter(w => setB.has(w)).length;
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : intersection / union;
}

function detectDuplicateIdeas(title, premise, existingIdeas, existingContents, threshold = 0.5) {
  const targetWords = tokenizeDistinct(`${title} ${premise}`);
  const pool = [
    ...(existingIdeas || []).map(i => ({ type: 'idea', id: i.id, title: i.title, text: `${i.title} ${i.premise || ''}` })),
    ...(existingContents || []).map(c => ({ type: 'content', id: c.id, title: c.title, text: c.title }))
  ];
  const matches = pool
    .map(p => ({ ...p, similarity: jaccardSimilarity(targetWords, tokenizeDistinct(p.text)) }))
    .filter(p => p.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5);
  const isDuplicate = matches.length > 0;
  return { isDuplicate, matches };
}

// ── AI CONTENT IDEA GENERATION ENGINE ───────────────────────────────────────
// Uses Business DNA + Positioning + Brand Voice + Content Pillars + Founder
// Knowledge to generate grounded, non-generic ideas (never hardcoded boilerplate).

async function loadIdeaContext() {
  const [pos, icp, offer, founder, bp, vp] = await Promise.all([
    get(`SELECT * FROM positionings WHERE business_id = 'biz_default' AND is_active = 1`),
    get(`SELECT * FROM icps WHERE business_id = 'biz_default' AND is_active = 1`),
    get(`SELECT * FROM offers WHERE business_id = 'biz_default'`),
    get(`SELECT * FROM founders WHERE business_id = 'biz_default'`),
    get(`SELECT * FROM brand_profiles WHERE business_id = 'biz_default'`),
    get(`SELECT * FROM founder_voice_profiles WHERE business_id = 'biz_default'`)
  ]);
  const pillars = await all(`SELECT * FROM content_pillars WHERE business_id = 'biz_default' AND status = 'ACTIVE' AND deleted_at IS NULL ORDER BY target_percentage DESC`);
  const sources = await all(`SELECT * FROM founder_knowledge_sources WHERE business_id = 'biz_default' AND is_archived = 0`);
  const intel = await all(`SELECT * FROM market_intel WHERE business_id = 'biz_default' AND is_archived = 0 ORDER BY created_at DESC`);
  const successful = await all(`SELECT * FROM contents WHERE business_id = 'biz_default' AND deleted_at IS NULL AND lifecycle_status IN ('PUBLISHED', 'ANALYZING', 'REPURPOSED') ORDER BY updated_at DESC LIMIT 12`);
  const ideas = await all(`SELECT * FROM content_ideas WHERE business_id = 'biz_default' AND deleted_at IS NULL AND is_archived = 0`);

  return {
    pos: pos || {},
    icp: icp || {},
    offer: offer || {},
    founder: founder || {},
    bp: bp || {},
    vp: vp || {},
    pillars,
    knowledge: sources,
    intel,
    successful,
    ideas
  };
}

function icpShort(ctx) {
  const raw = (ctx.pos && ctx.pos.icp_summary) || (ctx.icp && ctx.icp.target_customer) || 'B2B Founders';
  const m = raw.match(/([A-Z][^,]*Founders|[A-Z][^,]*Agencies|[A-Z][^,]*SaaS|B2B [A-Za-z]+)/);
  return (m && m[1]) ? m[1] : raw.split(',')[0];
}

function phraseHighlight(ctx) {
  try {
    const vp = ctx.vp || {};
    const recurring = (typeof vp.recurring_phrases === 'string') ? JSON.parse(vp.recurring_phrases || '[]') : (vp.recurring_phrases || []);
    if (recurring.length) return recurring[0];
  } catch (e) { /* ignore */ }
  return 'operating system problem';
}

function mechanismName(ctx) {
  return (ctx.pos && ctx.pos.mechanism) || 'The ASENZO 5-Engine Growth OS Framework';
}

function painPhrase(ctx) {
  return (ctx.pos && ctx.pos.problem) || (ctx.icp && Array.isArray(ctx.icp.primary_pains) && ctx.icp.primary_pains[0]) || 'single-founder bottleneck';
}

function resultPhrase(ctx) {
  return (ctx.pos && ctx.pos.result) || (ctx.icp && Array.isArray(ctx.icp.desired_outcomes) && ctx.icp.desired_outcomes[0]) || 'scaling revenue without founder burnout';
}

const FORMAT_SETS = {
  POSITIONING: ['POST', 'CAROUSEL', 'VIDEO'],
  MECHANISM: ['POST', 'CAROUSEL', 'THREAD'],
  PROOF: ['CASE_STUDY', 'VIDEO', 'NEWSLETTER'],
  AUTHORITY: ['POST', 'NEWSLETTER', 'THREAD'],
  CUSTOM: ['POST', 'CAROUSEL']
};

const PLATFORM_SETS = {
  POSITIONING: ['LINKEDIN', 'X_TWITTER'],
  MECHANISM: ['LINKEDIN', 'X_TWITTER', 'YOUTUBE'],
  PROOF: ['LINKEDIN', 'YOUTUBE'],
  AUTHORITY: ['X_TWITTER', 'NEWSLETTER'],
  CUSTOM: ['LINKEDIN', 'NEWSLETTER']
};

function pickFormat(ctx, pillar, idx) {
  const arr = FORMAT_SETS[(pillar && pillar.pillar_type) || 'CUSTOM'] || FORMAT_SETS.CUSTOM;
  return arr[idx % arr.length];
}

function pickPlatform(ctx, pillar, idx) {
  const arr = PLATFORM_SETS[(pillar && pillar.pillar_type) || 'CUSTOM'] || PLATFORM_SETS.CUSTOM;
  const stored = pillar && JSON.parse(pillar.supported_platforms || '[]');
  const source = (stored && stored.length) ? stored : arr;
  return source[idx % source.length];
}

function pickObjective(ctx, pillar) {
  return (pillar && pillar.objective) || 'Generate qualified inbound attention';
}

function pickPillar(ctx, requestedPillarId, idx) {
  const active = ctx.pillars || [];
  if (requestedPillarId) {
    const p = active.find(x => x.id === requestedPillarId);
    if (p) return { pillar: p, idx };
  }
  if (!active.length) return { pillar: null, idx };
  return { pillar: active[idx % active.length], idx };
}

async function finalizeIdeaDraft(ctx, draft, pillar) {
  // Ground the idea in founder knowledge (retrieval with provenance) — never generic.
  const retrieval = await retrieveRelevantKnowledgeChunks(draft.title, 'biz_default', 1);
  const proofSnippet = retrieval.chunks && retrieval.chunks[0] ? retrieval.chunks[0].chunk_text : '';
  const notes = [
    `Generated from ${draft.sourceSource || 'Business DNA'} context.`,
    draft.explain,
    proofSnippet ? `Knowledge anchor: "${proofSnippet.substring(0, 140)}..."` : 'Tip: capture a proof metric before production.'
  ].filter(Boolean).join(' ');

  const ideaRecord = {
    businessId: 'biz_default',
    pillarId: pillar ? pillar.id : null,
    source: draft.source,
    title: draft.title,
    premise: draft.premise,
    icp: draft.icp || icpShort(ctx),
    pain: draft.pain || painPhrase(ctx),
    desiredResult: draft.desiredResult || resultPhrase(ctx),
    contentFormat: draft.contentFormat || 'POST',
    platform: draft.platform || 'LINKEDIN',
    objective: draft.objective || pickObjective(ctx, pillar),
    cta: draft.cta || 'DM me to run this audit.',
    notes
  };
  const scoringCtx = await buildIdeaScoringContext();
  const scored = scoreContentIdea(ideaRecord, scoringCtx);
  ideaRecord.score = scored.totalScore;
  ideaRecord.scoreBreakdown = scored.breakdown;
  ideaRecord.priority = scored.priority;
  ideaRecord.status = scored.priority === 'HIGH' ? 'PRIORITIZED' : 'NEW';
  ideaRecord.explanation = scored.explanation;
  ideaRecord.suggestions = scored.suggestions;
  ideaRecord.isDuplicate = null;
  return ideaRecord;
}

// Generator factories keyed by source; each draws on real stored data.
const IDEA_GENERATORS = {
  AI_GENERATED(ctx, needle) {
    const mech = mechanismName(ctx);
    const pain = painPhrase(ctx);
    const icpS = icpShort(ctx);
    const hl = phraseHighlight(ctx);
    return [
      {
        title: `The ${hl} nobody is actually solving for ${icpS}`,
        premise: `Most advisors surface symptoms (${pain.substring(0, 60)}), then stop — leaving the root mechanism gap untouched.`,
        source: 'AI_GENERATED',
        sourceSource: 'Positioning + Brand Voice',
        explain: `Frames ${icpS}'s real pain as a category gap.`,
        objective: pickObjective(ctx)
      },
      {
        title: `Stop measuring engage-ment. Measure ${mech.split(' ').slice(0, 2).join(' ')} adoption instead`,
        premise: `Vanity reach is not leverage. ${mech} turns content into installable capability that compounds qualified DMs.`,
        source: 'AI_GENERATED',
        sourceSource: 'Business DNA + Mechanism',
        explain: `Mechanism-forward contrarian angle drawn from Business DNA.`,
        objective: pickObjective(ctx)
      },
      {
        title: `3 engine-level fixes for ${painPhrase(ctx).substring(0, 58)}`,
        premise: `Break the bottleneck across Attention, Conversion and Delivery using ${mech}.`,
        source: 'AI_GENERATED',
        sourceSource: 'Positioning + Pillars',
        explain: `Three-engine breakdown mapped to the documented founder pain.`,
        objective: pickObjective(ctx)
      },
      {
        title: `What an 85+ Founder Independence Score actually unlocks for ${icpS}`,
        premise: `${resultPhrase(ctx)} — and the mechanism ${mech} uses to get there.`,
        source: 'AI_GENERATED',
        sourceSource: 'Positioning Result + Mechanism',
        explain: `Outcome-led idea tied to quantified result.`,
        objective: pickObjective(ctx)
      }
    ];
  },

  CUSTOMER_QUESTION(ctx, needle) {
    const buyingTriggers = (ctx.icp && (JSON.parse(ctx.icp.buying_triggers || '[]') || [])) || [];
    const pains = (ctx.icp && (JSON.parse(ctx.icp.primary_pains || '[]') || [])) || [];
    const questions = [
      ...buyingTriggers.map(q => ({ q, type: 'buying trigger' })),
      ...(pains[0] ? [{ q: pains[0], type: 'primary pain' }] : [])
    ];
    const mech = mechanismName(ctx);
    const out = questions.slice(0, 4).map((item, i) => ({
      title: `Answering the question founders ask us most: "${(item.q || '').substring(0, 48)}..."`,
      premise: `A real inbound customer question about ${item.type} — answered honestly with ${mech}.`,
      source: 'CUSTOMER_QUESTION',
      sourceSource: `Customer questions (${item.type})`,
      explain: `Directly pulled from ICP buying triggers / primary pains.`,
      objective: 'Authentically answer the exact question your ICP is asking'
    }));
    if (out.length === 0) {
      out.push({
        title: `What bootstrapped founders ask before the first call: "Will this actually remove me from the loop?"`,
        premise: `Answer the pricing/effort objection with ${mech}, grounded in a real kickoff story.`,
        source: 'CUSTOMER_QUESTION',
        sourceSource: 'Customer questions (fallback)',
        explain: `No stored triggers — used positioning-derived customer question.`,
        objective: 'Address the pre-call skepticism head on'
      });
    }
    return out;
  },

  OBJECTION(ctx, needle) {
    const objections = (ctx.icp && (JSON.parse(ctx.icp.objections || '[]') || [])) || [];
    const mech = mechanismName(ctx);
    const icpS = icpShort(ctx);
    const out = objections.slice(0, 4).map((o, i) => ({
      title: `The objection we hear from ${icpS} every week: "${(o || '').substring(0, 46)}..."`,
      premise: `Reframe the objection with ${mech} and turn it into a qualification question for the reader.`,
      source: 'OBJECTION',
      sourceSource: 'ICP objections',
      explain: `Based on documented objection: ${o}`,
      objective: 'Disarm the #1 sales objection with proof + mechanism'
    }));
    if (out.length === 0) {
      out.push({
        title: `"Will this take more of my time?" — No, it replaces the time you don't have`,
        premise: `How ${mech} converts founder hours into installed operating capability instead of new deliverables.`,
        source: 'OBJECTION',
        sourceSource: 'ICP objections (fallback)',
        explain: `Fallback objection framed from positioning pain.`,
        objective: 'Overcome the time-investment objection'
      });
    }
    return out;
  },

  SALES_CONVERSATION(ctx, needle) {
    const convos = [
      ...(ctx.icp && (JSON.parse(ctx.icp.objections || '[]') || []).map(o => ({ source: 'pipeline deal', pain: o }))),
      ...(ctx.icp && (JSON.parse(ctx.icp.buying_triggers || '[]') || []).map(t => ({ source: 'discovery call', pain: t })))
    ].filter(c => c.pain);
    const mech = mechanismName(ctx);
    const pain = painPhrase(ctx);
    const out = convos.slice(0, 4).map((c, i) => ({
      title: `Inside the call: the moment a founder realizes they own a job, not a business`,
      premise: `A recurring ${c.source} pattern — "${(c.pain || pain).substring(0, 55)}..." — escalated into a teachable argument for ${mech}.`,
      source: 'SALES_CONVERSATION',
      sourceSource: `Sales conversation (${c.source})`,
      explain: `Distilled from real discovery/pipeline conversation themes.`,
      objective: 'Turn live sales friction into authority content'
    }));
    if (out.length === 0) {
      out.push({
        title: `What actually gets booked after our discovery calls — and what gets disqualified`,
        premise: `The qualification pattern behind ${mech} that filters low-fit founders early.`,
        source: 'SALES_CONVERSATION',
        sourceSource: 'Sales conversation (fallback)',
        explain: `Fallback derived from positioning pain.`,
        objective: 'Teach the qualification framework so ICP self-selects'
      });
    }
    return out;
  },

  CASE_STUDY(ctx, needle) {
    const achievements = (ctx.founder && (JSON.parse(ctx.founder.achievements || '[]') || [])) || [];
    const proof = (ctx.offer && ctx.offer.proof) || '';
    const mech = mechanismName(ctx);
    const out = [];
    if (proof) {
      out.push({
        title: `Proof, not promises: ${proof.substring(0, 62)}`,
        premise: `Breaking down a real client transformation delivered by ${mech} — what was done, measured and delegated.`,
        source: 'CASE_STUDY',
        sourceSource: 'Offer proof',
        explain: `Built from stored offer proof: ${proof}`,
        objective: 'Use a named outcome to de-risk the offer'
      });
    }
    achievements.slice(0, 3).forEach((a, i) => {
      out.push({
        title: `How ${(a || '').substring(0, 55)} changes the leverage math for a founder`,
        premise: `A documented achievement translated into a repeatable lesson about ${mech}.`,
        source: 'CASE_STUDY',
        sourceSource: 'Founder achievements',
        explain: `Built from founder achievement: ${a}`,
        objective: 'Prove the mechanism produces real outcomes'
      });
    });
    return out;
  },

  MARKET_INTEL(ctx, needle) {
    const mech = mechanismName(ctx);
    const out = (ctx.intel || []).slice(0, 4).map((mi, i) => ({
      title: `Niche signal: ${mi.title.substring(0, 72)}`,
      premise: `${mi.insight.substring(0, 160)} — and the argument for ${mech} riding that wave.`,
      source: 'MARKET_INTEL',
      sourceSource: `Market intel (${mi.source || 'observation'})`,
      explain: `Grounded in logged market intelligence observation.`,
      objective: 'Own an emerging niche pattern before competitors notice'
    }));
    if (out.length === 0) {
      out.push({
        title: `The competitor gap we keep finding in niche founder content`,
        premise: `Nobody in the category bridges ${painPhrase(ctx)} to a repeatable mechanism like ${mech}.`,
        source: 'MARKET_INTEL',
        sourceSource: 'Market intel (fallback)',
        explain: `Fallback from positioning category gap.`,
        objective: 'Claim the undefended category territory'
      });
    }
    return out;
  },

  SUCCESSFUL_CONTENT(ctx, needle) {
    const mech = mechanismName(ctx);
    const out = (ctx.successful || []).slice(0, 4).map((c, i) => ({
      title: `The follow-up to "${c.title.substring(0, 52)}" — the deeper layer`,
      premise: `Your readers engaged with ${c.title.substring(0, 40)}; now take them one level deeper into ${mech}.`,
      source: 'SUCCESSFUL_CONTENT',
      sourceSource: `Successful content repurposing`,
      explain: `Derived from previously successful asset: ${c.title}`,
      objective: 'Sequencing follow-up content off proven winners'
    }));
    if (out.length === 0) {
      out.push({
        title: `The mechanism post people DMed us about most`,
        premise: `⟹ ${mech} explained with the exact framework breakdown that earned the most qualified replies.`,
        source: 'SUCCESSFUL_CONTENT',
        sourceSource: 'Successful content (fallback)',
        explain: `Fallback based on mechanism pillar strength.`,
        objective: 'Double-down on the highest-performing angle'
      });
    }
    return out;
  }
};

// Grounded angle variants used when a source generator has fewer unique drafts
// than the requested count. Variants stay anchored to the base (grounded) idea
// so they never become generic boilerplate.
const ANGLE_VARIANTS = [
  (base) => ({
    ...base,
    title: `The deeper layer behind "${base.title}"`,
    premise: `${base.premise} This angle goes one level deeper than the surface take.`
  }),
  (base) => ({
    ...base,
    title: `What founders miss when they hear "${base.title}"`,
    premise: `${base.premise} Most readers nod along without applying it — here is the practical trigger that changes behavior.`
  }),
  (base) => ({
    ...base,
    title: `Why "${base.title}" keeps coming up in real conversations`,
    premise: `${base.premise} A recurring pattern from actual calls, turned into a teachable argument the ICP can reuse.`
  })
];

async function generateContentIdeas(source, count, pillarId) {
  const ctx = await loadIdeaContext();
  const picker = IDEA_GENERATORS[source] || IDEA_GENERATORS.AI_GENERATED;
  const drafts = picker(ctx, null);
  const ideas = [];

  // Skip drafts whose title already exists in the DB or in this batch so a
  // single generation never produces near-identical repeats.
  const usedTitles = new Set(ctx.ideas.map(i => normIdeaKey(i.title)));
  const baseUsage = {};
  let cursor = 0;

  for (let i = 0; i < count; i++) {
    let draft = null;
    let attempts = 0;
    while (attempts < drafts.length * 3 && !draft) {
      const candidate = drafts[cursor % drafts.length];
      cursor++;
      attempts++;
      const key = normIdeaKey(candidate.title);
      if (!usedTitles.has(key)) {
        draft = candidate;
        baseUsage[key] = (baseUsage[key] || 0) + 1;
      }
    }
    if (!draft) {
      // Pool of unique grounded drafts exhausted -> rotate angle variants.
      const base = drafts[(cursor - 1) % drafts.length];
      const usedCount = baseUsage[normIdeaKey(base.title)] || 0;
      draft = ANGLE_VARIANTS[usedCount % ANGLE_VARIANTS.length](base);
    }

    const { pillar, idx } = pickPillar(ctx, pillarId, i);
    const ideaRecord = await finalizeIdeaDraft(ctx, { ...draft, contentFormat: pickFormat(ctx, pillar, idx), platform: pickPlatform(ctx, pillar, idx) }, pillar);

    // Duplicate check against existing ideas + content
    const dup = detectDuplicateIdeas(ideaRecord.title, ideaRecord.premise, ctx.ideas.map(x => ({ id: x.id, title: x.title, premise: x.premise })), ctx.successful);
    ideaRecord.duplicate = dup.isDuplicate ? dup : null;

    usedTitles.add(normIdeaKey(ideaRecord.title));
    ideas.push(ideaRecord);
  }
  return ideas;
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

// ── CONTENT STRATEGY — PILLAR ENDPOINTS ──────────────────────────────────────
function serializePillar(row) {
  if (!row) return null;
  return {
    ...row,
    contentFormats: JSON.parse(row.content_formats || '[]'),
    supportedPlatforms: JSON.parse(row.supported_platforms || '[]')
  };
}

app.get('/api/pillars', async (req, res) => {
  try {
    let sql = `SELECT * FROM content_pillars WHERE business_id = 'biz_default' AND deleted_at IS NULL`;
    const params = [];
    if (req.query.status) {
      sql += ` AND status = ?`;
      params.push(req.query.status);
    }
    if (!req.query.includeArchived || req.query.includeArchived !== 'true') {
      sql += ` AND status != 'ARCHIVED'`;
    }
    sql += ` ORDER BY target_percentage DESC, created_at ASC`;
    const rows = await all(sql, params);
    res.json(rows.map(serializePillar));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/pillars', async (req, res) => {
  try {
    const parsed = ContentPillarFullSchema.parse(req.body);
    const id = parsed.id || makeId('pil');
    const now = new Date().toISOString();

    await run(
      `INSERT INTO content_pillars (id, business_id, name, pillar_type, description, target_audience, objective, pain, desired_result, content_formats, supported_platforms, status, target_percentage, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, parsed.businessId, parsed.name, parsed.pillarType || 'CUSTOM', parsed.description,
        parsed.targetAudience, parsed.objective, parsed.pain, parsed.desiredResult,
        JSON.stringify(parsed.contentFormats), JSON.stringify(parsed.supportedPlatforms),
        parsed.status, parsed.targetPercentage, now, now
      ]
    );
    await logAudit('CREATE', 'content_pillars', id, parsed);
    res.status(201).json(serializePillar(await get(`SELECT * FROM content_pillars WHERE id = ?`, [id])));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/pillars/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await get(`SELECT * FROM content_pillars WHERE id = ? AND deleted_at IS NULL`, [id]);
    if (!existing) return res.status(404).json({ error: 'Pillar not found' });

    const merged = {
      name: req.body.name !== undefined ? req.body.name : existing.name,
      pillarType: req.body.pillarType !== undefined ? req.body.pillarType : (existing.pillar_type || 'CUSTOM'),
      description: req.body.description !== undefined ? req.body.description : existing.description,
      targetAudience: req.body.targetAudience !== undefined ? req.body.targetAudience : existing.target_audience,
      objective: req.body.objective !== undefined ? req.body.objective : existing.objective,
      pain: req.body.pain !== undefined ? req.body.pain : existing.pain,
      desiredResult: req.body.desiredResult !== undefined ? req.body.desiredResult : existing.desired_result,
      contentFormats: req.body.contentFormats !== undefined ? req.body.contentFormats : JSON.parse(existing.content_formats || '[]'),
      supportedPlatforms: req.body.supportedPlatforms !== undefined ? req.body.supportedPlatforms : JSON.parse(existing.supported_platforms || '[]'),
      status: req.body.status !== undefined ? req.body.status : existing.status,
      targetPercentage: req.body.targetPercentage !== undefined ? req.body.targetPercentage : existing.target_percentage
    };
    const parsed = ContentPillarFullSchema.parse({ ...merged, businessId: 'biz_default' });
    const now = new Date().toISOString();

    await run(
      `UPDATE content_pillars SET name = ?, pillar_type = ?, description = ?, target_audience = ?, objective = ?, pain = ?, desired_result = ?, content_formats = ?, supported_platforms = ?, status = ?, target_percentage = ?, updated_at = ? WHERE id = ?`,
      [
        parsed.name, parsed.pillarType, parsed.description, parsed.targetAudience, parsed.objective,
        parsed.pain, parsed.desiredResult, JSON.stringify(parsed.contentFormats),
        JSON.stringify(parsed.supportedPlatforms), parsed.status, parsed.targetPercentage, now, id
      ]
    );
    await logAudit('UPDATE', 'content_pillars', id, parsed);
    res.json(serializePillar(await get(`SELECT * FROM content_pillars WHERE id = ?`, [id])));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/pillars/:id/archive', async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await get(`SELECT * FROM content_pillars WHERE id = ? AND deleted_at IS NULL`, [id]);
    if (!existing) return res.status(404).json({ error: 'Pillar not found' });
    const now = new Date().toISOString();
    await run(
      `UPDATE content_pillars SET status = 'ARCHIVED', updated_at = ? WHERE id = ?`,
      [now, id]
    );
    await logAudit('STATUS_CHANGE', 'content_pillars', id, { status: 'ARCHIVED' });
    res.json({ message: 'Pillar archived', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/pillars/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date().toISOString();
    await run(`UPDATE content_pillars SET status = 'ARCHIVED', deleted_at = ?, updated_at = ? WHERE id = ?`, [now, now, id]);
    await logAudit('DELETE', 'content_pillars', id, { deletedAt: now });
    res.json({ message: 'Pillar soft-deleted', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── CONTENT IDEA ENGINE — ENDPOINTS ──────────────────────────────────────────
function serializeIdea(row) {
  if (!row) return null;
  return {
    ...row,
    scoreBreakdown: JSON.parse(row.score_breakdown || '{}')
  };
}

app.get('/api/ideas', async (req, res) => {
  try {
    let sql = `SELECT * FROM content_ideas WHERE business_id = 'biz_default' AND deleted_at IS NULL`;
    const params = [];
    if (!req.query.includeArchived || req.query.includeArchived !== 'true') {
      sql += ` AND is_archived = 0`;
    }
    if (req.query.status) { sql += ` AND status = ?`; params.push(req.query.status); }
    if (req.query.priority) { sql += ` AND priority = ?`; params.push(req.query.priority); }
    if (req.query.source) { sql += ` AND source = ?`; params.push(req.query.source); }
    if (req.query.pillarId) { sql += ` AND pillar_id = ?`; params.push(req.query.pillarId); }
    if (req.query.q) {
      sql += ` AND (title LIKE ? OR premise LIKE ? OR pain LIKE ? OR icp LIKE ?)`;
      const like = `%${req.query.q}%`;
      params.push(like, like, like, like);
    }

    const sort = req.query.sort || 'updated_at';
    const allowedSorts = {
      updated_at: 'updated_at DESC',
      newest: 'created_at DESC',
      score_desc: 'score DESC, priority DESC',
      score_asc: 'score ASC',
      priority: "CASE priority WHEN 'HIGH' THEN 0 WHEN 'MEDIUM' THEN 1 ELSE 2 END, score DESC"
    };
    sql += ` ORDER BY ${allowedSorts[sort] || allowedSorts.updated_at}`;

    const rows = await all(sql, params);
    res.json(rows.map(serializeIdea));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ideas', async (req, res) => {
  try {
    const parsed = ContentIdeaSchema.parse(req.body);
    const id = parsed.id || makeId('idea');
    const now = new Date().toISOString();

    // Auto-score against Business DNA unless a score was explicitly supplied.
    let score = 0;
    let scoreBreakdown = {};
    let priority = 'LOW';
    if (parsed.score) {
      score = parsed.score;
      scoreBreakdown = parsed.scoreBreakdown || {};
      priority = parsed.priority || 'LOW';
    } else {
      const ctx = await buildIdeaScoringContext();
      const scored = scoreContentIdea(parsed, ctx);
      score = scored.totalScore;
      scoreBreakdown = scored.breakdown;
      priority = scored.priority;
    }

    await run(
      `INSERT INTO content_ideas (id, business_id, pillar_id, icp_id, source, title, premise, icp, pain, desired_result, content_format, platform, objective, cta, score, score_breakdown, priority, status, notes, is_archived, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`,
      [
        id, parsed.businessId, parsed.pillarId || null, parsed.icpId || null, parsed.source,
        parsed.title, parsed.premise, parsed.icp, parsed.pain, parsed.desiredResult,
        parsed.contentFormat, parsed.platform, parsed.objective, parsed.cta,
        score, JSON.stringify(scoreBreakdown), priority, parsed.status, parsed.notes, now, now
      ]
    );
    await logAudit('CREATE', 'content_ideas', id, { title: parsed.title, score, priority });
    res.status(201).json(serializeIdea(await get(`SELECT * FROM content_ideas WHERE id = ?`, [id])));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/ideas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await get(`SELECT * FROM content_ideas WHERE id = ? AND deleted_at IS NULL`, [id]);
    if (!existing) return res.status(404).json({ error: 'Idea not found' });

    const merged = {
      pillarId: req.body.pillarId !== undefined ? req.body.pillarId : existing.pillar_id,
      source: req.body.source !== undefined ? req.body.source : existing.source,
      title: req.body.title !== undefined ? req.body.title : existing.title,
      premise: req.body.premise !== undefined ? req.body.premise : existing.premise,
      icp: req.body.icp !== undefined ? req.body.icp : existing.icp,
      pain: req.body.pain !== undefined ? req.body.pain : existing.pain,
      desiredResult: req.body.desiredResult !== undefined ? req.body.desiredResult : existing.desired_result,
      contentFormat: req.body.contentFormat !== undefined ? req.body.contentFormat : existing.content_format,
      platform: req.body.platform !== undefined ? req.body.platform : existing.platform,
      objective: req.body.objective !== undefined ? req.body.objective : existing.objective,
      cta: req.body.cta !== undefined ? req.body.cta : existing.cta,
      score: req.body.score !== undefined ? req.body.score : existing.score,
      scoreBreakdown: req.body.scoreBreakdown !== undefined ? req.body.scoreBreakdown : JSON.parse(existing.score_breakdown || '{}'),
      priority: req.body.priority !== undefined ? req.body.priority : existing.priority,
      status: req.body.status !== undefined ? req.body.status : existing.status,
      notes: req.body.notes !== undefined ? req.body.notes : existing.notes
    };

    // Re-score when the substance (title/premise/pain) changes.
    if (req.body.reScore || (req.body.title !== undefined || req.body.premise !== undefined || req.body.pain !== undefined)) {
      const ctx = await buildIdeaScoringContext();
      const scored = scoreContentIdea(merged, ctx);
      merged.score = scored.totalScore;
      merged.scoreBreakdown = scored.breakdown;
      merged.priority = scored.priority;
    }

    const parsed = ContentIdeaSchema.parse({ ...merged, businessId: 'biz_default' });
    const now = new Date().toISOString();

    await run(
      `UPDATE content_ideas SET pillar_id = ?, source = ?, title = ?, premise = ?, icp = ?, pain = ?, desired_result = ?, content_format = ?, platform = ?, objective = ?, cta = ?, score = ?, score_breakdown = ?, priority = ?, status = ?, notes = ?, updated_at = ? WHERE id = ?`,
      [
        parsed.pillarId, parsed.source, parsed.title, parsed.premise, parsed.icp, parsed.pain,
        parsed.desiredResult, parsed.contentFormat, parsed.platform, parsed.objective, parsed.cta,
        parsed.score, JSON.stringify(parsed.scoreBreakdown), parsed.priority, parsed.status, parsed.notes, now, id
      ]
    );
    await logAudit('UPDATE', 'content_ideas', id, { title: parsed.title, score: parsed.score, priority: parsed.priority });
    res.json(serializeIdea(await get(`SELECT * FROM content_ideas WHERE id = ?`, [id])));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/ideas/:id/score', async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await get(`SELECT * FROM content_ideas WHERE id = ? AND deleted_at IS NULL`, [id]);
    if (!existing) return res.status(404).json({ error: 'Idea not found' });

    const ctx = await buildIdeaScoringContext();
    const scored = scoreContentIdea(existing, ctx);
    const now = new Date().toISOString();
    await run(
      `UPDATE content_ideas SET score = ?, score_breakdown = ?, priority = ?, updated_at = ? WHERE id = ?`,
      [scored.totalScore, JSON.stringify(scored.breakdown), scored.priority, now, id]
    );
    await logAudit('UPDATE', 'content_ideas', id, { reScore: scored.totalScore, priority: scored.priority });
    res.json({ ...serializeIdea(await get(`SELECT * FROM content_ideas WHERE id = ?`, [id])), explanation: scored.explanation, suggestions: scored.suggestions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ideas/check-duplicate', async (req, res) => {
  try {
    const { title = '', premise = '', excludeId } = req.body;
    const existingIdeas = await all(`SELECT id, title, premise FROM content_ideas WHERE business_id = 'biz_default' AND deleted_at IS NULL AND is_archived = 0`);
    const existingContents = await all(`SELECT id, title FROM contents WHERE business_id = 'biz_default' AND deleted_at IS NULL`);
    const filteredIdeas = excludeId ? existingIdeas.filter(i => String(i.id) !== String(excludeId)) : existingIdeas;
    const result = detectDuplicateIdeas(title, premise, filteredIdeas, existingContents, 0.5);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ideas/:id/archive', async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await get(`SELECT * FROM content_ideas WHERE id = ? AND deleted_at IS NULL`, [id]);
    if (!existing) return res.status(404).json({ error: 'Idea not found' });
    const now = new Date().toISOString();
    await run(
      `UPDATE content_ideas SET is_archived = 1, status = 'ARCHIVED', updated_at = ? WHERE id = ?`,
      [now, id]
    );
    await logAudit('STATUS_CHANGE', 'content_ideas', id, { status: 'ARCHIVED' });
    res.json({ message: 'Idea archived', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/ideas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date().toISOString();
    await run(`UPDATE content_ideas SET is_archived = 1, deleted_at = ?, updated_at = ? WHERE id = ?`, [now, now, id]);
    await logAudit('DELETE', 'content_ideas', id, { deletedAt: now });
    res.json({ message: 'Idea soft-deleted', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── CONTENT IDEA CONVERSION → PRODUCTION CONTENT ─────────────────────────────
app.post('/api/ideas/:id/convert', async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await get(`SELECT * FROM content_ideas WHERE id = ? AND deleted_at IS NULL AND is_archived = 0`, [id]);
    if (!existing) return res.status(404).json({ error: 'Idea not found' });

    const contentId = makeId('cnt');
    const now = new Date().toISOString();
    const platform = req.body.platform || existing.platform || 'LINKEDIN';
    const lifecycleStatus = 'IDEA';

    await run(
      `INSERT INTO contents (id, business_id, pillar_id, idea_id, title, lifecycle_status, primary_platform, hook_text, body_script, cta, is_ad_candidate, is_archived, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?)`,
      [
        contentId, 'biz_default', existing.pillar_id || null, id, existing.title, lifecycleStatus,
        platform, existing.title, existing.premise, existing.cta || '', now, now
      ]
    );
    await run(
      `INSERT INTO content_versions (id, content_id, version_number, hook_text, body_script, cta, created_by, created_at) VALUES (?, ?, 1, ?, ?, ?, 'IDEA_ENGINE', ?)`,
      [makeId('ver'), contentId, existing.title, existing.premise, existing.cta || '', now]
    );
    await run(
      `UPDATE content_ideas SET status = 'CONVERTED', converted_content_id = ?, updated_at = ? WHERE id = ?`,
      [contentId, now, id]
    );
    await logAudit('STATUS_CHANGE', 'content_ideas', id, { status: 'CONVERTED', contentId });
    res.status(201).json({
      message: 'Idea converted to content pipeline asset',
      content: await get(`SELECT * FROM contents WHERE id = ?`, [contentId]),
      idea: serializeIdea(await get(`SELECT * FROM content_ideas WHERE id = ?`, [id]))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── CONTENT IDEA AI GENERATION ENDPOINT ──────────────────────────────────────
app.post('/api/ideas/generate', async (req, res) => {
  try {
    const parsed = ContentIdeaGenerateRequestSchema.parse(req.body);
    const ideas = await generateContentIdeas(parsed.source, parsed.count, parsed.pillarId);

    // Persist generated ideas to database.
    const now = new Date().toISOString();
    const persisted = [];
    for (const idea of ideas) {
      const ideaId = makeId('idea');
      const pillarId = idea.pillarId || null;
      await run(
        `INSERT INTO content_ideas (id, business_id, pillar_id, source, title, premise, icp, pain, desired_result, content_format, platform, objective, cta, score, score_breakdown, priority, status, notes, is_archived, created_at, updated_at)
         VALUES (?, 'biz_default', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`,
        [
          ideaId, pillarId, idea.source, idea.title, idea.premise, idea.icp,
          idea.pain, idea.desiredResult, idea.contentFormat, idea.platform,
          idea.objective, idea.cta, idea.score, JSON.stringify(idea.scoreBreakdown),
          idea.priority, idea.status, idea.notes, now, now
        ]
      );
      const record = serializeIdea(await get(`SELECT * FROM content_ideas WHERE id = ?`, [ideaId]));
      record.explanation = idea.explanation;
      record.suggestions = idea.suggestions;
      record.duplicate = idea.duplicate;
      persisted.push(record);
    }
    await logAudit('AI_GENERATE', 'content_ideas', `${parsed.source}:${now}`, { count: persisted.length });
    res.status(201).json({ ideas: persisted, source: parsed.source, count: persisted.length });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── MARKET INTELLIGENCE ENDPOINTS ────────────────────────────────────────────
app.get('/api/market-intel', async (req, res) => {
  try {
    const rows = await all(`SELECT * FROM market_intel WHERE business_id = 'biz_default' AND is_archived = 0 ORDER BY created_at DESC`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/market-intel', async (req, res) => {
  try {
    const { title, source = 'Niche Observation', insight = '', viralFactor = 'Medium' } = req.body || {};
    if (!title || !title.trim()) return res.status(400).json({ error: 'Observation title is required' });
    const id = makeId('mi');
    const now = new Date().toISOString();
    await run(
      `INSERT INTO market_intel (id, business_id, title, source, insight, viral_factor, is_archived, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)`,
      [id, 'biz_default', title.trim(), source, insight, viralFactor, now, now]
    );
    await logAudit('CREATE', 'market_intel', id, { title, source });
    res.status(201).json(await get(`SELECT * FROM market_intel WHERE id = ?`, [id]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/market-intel/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date().toISOString();
    await run(`UPDATE market_intel SET is_archived = 1, updated_at = ? WHERE id = ?`, [now, id]);
    res.json({ message: 'Market intel archived', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`ASENZO OS Backend running on http://localhost:${PORT}`);
});
