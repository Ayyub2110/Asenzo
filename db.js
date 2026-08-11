const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'asenzo.db');
const db = new sqlite3.Database(dbPath);

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function logAudit(action, entityType, entityId, changes, businessId = 'biz_default', userId = 'HUMAN_OPERATOR') {
  try {
    const id = `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    await run(
      `INSERT INTO audit_logs (id, business_id, action, entity_type, entity_id, changes_json, user_id, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, businessId, action, entityType, String(entityId), JSON.stringify(changes), userId, new Date().toISOString()]
    );
  } catch (err) {
    console.error('Failed to log audit event:', err);
  }
}

async function initDb() {
  return new Promise((resolve, reject) => {
    db.serialize(async () => {
      try {
        const tablesToDrop = [
          'businesses', 'founders', 'icps', 'positionings', 'positioning_versions', 'offers', 'brand_profiles',
          'brand_voices', 'founder_knowledge_sources', 'founder_knowledge_chunks', 'founder_voice_profiles',
          'content_pillars', 'content_ideas', 'contents', 'content_versions', 'content_assets', 'platforms',
          'distributions', 'lead_magnets', 'leads', 'outreach_prospects', 'outreach_messages', 'outreach_replies',
          'authority_assets', 'content_performances', 'attribution_events', 'ai_interactions',
          'recommendations', 'market_intel', 'audit_logs'
        ];

        for (const tbl of tablesToDrop) {
          await run(`DROP TABLE IF EXISTS ${tbl}`);
        }

        // 1. Business
        await run(`CREATE TABLE IF NOT EXISTS businesses (
          id TEXT PRIMARY KEY, name TEXT NOT NULL, domain TEXT, created_at TEXT, updated_at TEXT
        )`);

        // 2. Founder (Expanded)
        await run(`CREATE TABLE IF NOT EXISTS founders (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL, title TEXT, bio TEXT, expertise TEXT DEFAULT '[]', experience TEXT DEFAULT '', story TEXT DEFAULT '', beliefs TEXT DEFAULT '[]', opinions TEXT DEFAULT '[]', achievements TEXT DEFAULT '[]', credentials TEXT DEFAULT '[]', created_at TEXT, updated_at TEXT
        )`);

        // 3. ICP
        await run(`CREATE TABLE IF NOT EXISTS icps (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, name TEXT NOT NULL, target_customer TEXT, industry TEXT, business_type TEXT, founder_role TEXT, company_size TEXT, revenue_range TEXT, primary_pains TEXT DEFAULT '[]', secondary_pains TEXT DEFAULT '[]', desired_outcomes TEXT DEFAULT '[]', buying_triggers TEXT DEFAULT '[]', objections TEXT DEFAULT '[]', is_active INTEGER DEFAULT 1, created_at TEXT, updated_at TEXT
        )`);

        // 4. Positioning
        await run(`CREATE TABLE IF NOT EXISTS positionings (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, icp_id TEXT, icp_summary TEXT NOT NULL, problem TEXT NOT NULL, result TEXT NOT NULL, mechanism TEXT NOT NULL, statement TEXT, score INTEGER DEFAULT 0, score_breakdown TEXT DEFAULT '{}', alternatives TEXT DEFAULT '[]', version INTEGER DEFAULT 1, is_active INTEGER DEFAULT 1, created_at TEXT, updated_at TEXT
        )`);

        // 5. Positioning Versions
        await run(`CREATE TABLE IF NOT EXISTS positioning_versions (
          id TEXT PRIMARY KEY, positioning_id TEXT NOT NULL, version_number INTEGER NOT NULL, statement TEXT NOT NULL, icp_summary TEXT NOT NULL, problem TEXT NOT NULL, result TEXT NOT NULL, mechanism TEXT NOT NULL, score INTEGER DEFAULT 0, score_breakdown TEXT DEFAULT '{}', created_at TEXT
        )`);

        // 6. Offer
        await run(`CREATE TABLE IF NOT EXISTS offers (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, offer_name TEXT NOT NULL, description TEXT, promise TEXT, deliverables TEXT DEFAULT '[]', target_audience TEXT, pricing_context TEXT, proof TEXT, differentiators TEXT DEFAULT '[]', created_at TEXT, updated_at TEXT
        )`);

        // 7. BrandProfile (Expanded)
        await run(`CREATE TABLE IF NOT EXISTS brand_profiles (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, brand_name TEXT NOT NULL, tagline TEXT, mission TEXT, personal_brand_positioning TEXT DEFAULT '', business_brand_positioning TEXT DEFAULT '', audience TEXT DEFAULT '', personality TEXT DEFAULT '', tone TEXT DEFAULT 'Direct, Authoritative', formality TEXT DEFAULT 'Professional Casual', directness TEXT DEFAULT 'High', humor TEXT DEFAULT 'Subtle', technical_depth TEXT DEFAULT 'High', vocabulary_preferences TEXT DEFAULT '', words_to_use TEXT DEFAULT '[]', words_to_avoid TEXT DEFAULT '[]', created_at TEXT, updated_at TEXT
        )`);

        // 8. BrandVoice
        await run(`CREATE TABLE IF NOT EXISTS brand_voices (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, tone_keywords TEXT NOT NULL, founder_bio TEXT, prohibited_words TEXT NOT NULL, story_arcs TEXT DEFAULT '[]', updated_at TEXT
        )`);

        // 9. FounderKnowledgeSource (Expanded for Ingestion Pipeline)
        await run(`CREATE TABLE IF NOT EXISTS founder_knowledge_sources (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, founder_id TEXT, title TEXT NOT NULL, source_type TEXT DEFAULT 'ARTICLE', raw_content TEXT NOT NULL, clean_content TEXT NOT NULL, metadata_json TEXT DEFAULT '{}', chunk_count INTEGER DEFAULT 0, is_archived INTEGER DEFAULT 0, created_at TEXT, updated_at TEXT
        )`);

        // 10. FounderKnowledgeChunk (NEW - For Vector/Keyword Semantic Retrieval)
        await run(`CREATE TABLE IF NOT EXISTS founder_knowledge_chunks (
          id TEXT PRIMARY KEY, source_id TEXT NOT NULL, business_id TEXT NOT NULL, chunk_index INTEGER NOT NULL, chunk_text TEXT NOT NULL, token_count INTEGER DEFAULT 0, keywords TEXT DEFAULT '[]', created_at TEXT
        )`);

        // 11. FounderVoiceProfile (NEW - Aggregated Voice Traits)
        await run(`CREATE TABLE IF NOT EXISTS founder_voice_profiles (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, sentence_patterns TEXT DEFAULT '[]', recurring_phrases TEXT DEFAULT '[]', vocabulary TEXT DEFAULT '[]', writing_structure TEXT DEFAULT '', directness_level TEXT DEFAULT 'High', communication_style TEXT DEFAULT 'Direct, Systems-driven, Metric-backed', sample_chunks TEXT DEFAULT '[]', updated_at TEXT
        )`);

        // 12. ContentPillar (Content Strategy Pillars)
        await run(`CREATE TABLE IF NOT EXISTS content_pillars (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, name TEXT NOT NULL, pillar_type TEXT, description TEXT DEFAULT '', target_audience TEXT DEFAULT '', objective TEXT DEFAULT '', pain TEXT DEFAULT '', desired_result TEXT DEFAULT '', content_formats TEXT DEFAULT '[]', supported_platforms TEXT DEFAULT '[]', status TEXT DEFAULT 'ACTIVE', target_percentage INTEGER DEFAULT 25, created_at TEXT, updated_at TEXT, deleted_at TEXT
        )`);

        // 13. ContentIdea (Content Idea Engine)
        await run(`CREATE TABLE IF NOT EXISTS content_ideas (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, pillar_id TEXT, icp_id TEXT, source TEXT DEFAULT 'MANUAL', title TEXT NOT NULL, premise TEXT DEFAULT '', icp TEXT DEFAULT '', pain TEXT DEFAULT '', desired_result TEXT DEFAULT '', content_format TEXT DEFAULT 'POST', platform TEXT DEFAULT 'LINKEDIN', objective TEXT DEFAULT '', cta TEXT DEFAULT '', score INTEGER DEFAULT 0, score_breakdown TEXT DEFAULT '{}', priority TEXT DEFAULT 'LOW', status TEXT DEFAULT 'NEW', notes TEXT DEFAULT '', is_archived INTEGER DEFAULT 0, converted_content_id TEXT, created_at TEXT, updated_at TEXT, deleted_at TEXT
        )`);

        // 13b. Market Intelligence (Niche & Competitor Observations → Idea Source)
        await run(`CREATE TABLE IF NOT EXISTS market_intel (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, title TEXT NOT NULL, source TEXT DEFAULT 'Niche Observation', insight TEXT DEFAULT '', viral_factor TEXT DEFAULT 'Medium', is_archived INTEGER DEFAULT 0, created_at TEXT, updated_at TEXT
        )`);

        // 14. Content (11-Stage Lifecycle)
        await run(`CREATE TABLE IF NOT EXISTS contents (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, pillar_id TEXT, idea_id TEXT, title TEXT NOT NULL, lifecycle_status TEXT DEFAULT 'DRAFT', primary_platform TEXT DEFAULT 'LINKEDIN', hook_text TEXT DEFAULT '', body_script TEXT DEFAULT '', cta TEXT DEFAULT '', owner TEXT DEFAULT 'Alex Morgan', deadline TEXT DEFAULT '', scheduled_at TEXT DEFAULT '', published_at TEXT DEFAULT '', score INTEGER DEFAULT 85, performance_json TEXT DEFAULT '{}', is_ad_candidate INTEGER DEFAULT 0, is_archived INTEGER DEFAULT 0, created_at TEXT, updated_at TEXT, deleted_at TEXT
        )`);

        // 15. ContentVersion
        await run(`CREATE TABLE IF NOT EXISTS content_versions (
          id TEXT PRIMARY KEY, content_id TEXT NOT NULL, version_number INTEGER NOT NULL, hook_text TEXT DEFAULT '', body_script TEXT DEFAULT '', cta TEXT DEFAULT '', created_by TEXT DEFAULT 'HUMAN_OPERATOR', created_at TEXT
        )`);

        // 16. ContentAsset
        await run(`CREATE TABLE IF NOT EXISTS content_assets (
          id TEXT PRIMARY KEY, content_id TEXT NOT NULL, asset_type TEXT NOT NULL, file_url TEXT NOT NULL, caption TEXT DEFAULT '', created_at TEXT
        )`);

        // 17. Platform
        await run(`CREATE TABLE IF NOT EXISTS platforms (
          id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE, handle TEXT DEFAULT '', is_connected INTEGER DEFAULT 1, updated_at TEXT
        )`);

        // 18. Distribution
        await run(`CREATE TABLE IF NOT EXISTS distributions (
          id TEXT PRIMARY KEY, content_id TEXT NOT NULL, platform_id TEXT NOT NULL, status TEXT DEFAULT 'DRAFT', scheduled_at TEXT DEFAULT '', published_at TEXT DEFAULT '', post_url TEXT DEFAULT '', created_at TEXT, updated_at TEXT
        )`);

        // 19. LeadMagnet
        await run(`CREATE TABLE IF NOT EXISTS lead_magnets (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, title TEXT NOT NULL, asset_url TEXT DEFAULT '#', optin_count INTEGER DEFAULT 0, qualified_lead_count INTEGER DEFAULT 0, created_at TEXT, updated_at TEXT
        )`);

        // 20. Lead
        await run(`CREATE TABLE IF NOT EXISTS leads (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, lead_magnet_id TEXT, source_content_id TEXT, name TEXT NOT NULL, email TEXT NOT NULL, status TEXT DEFAULT 'NEW', intent_score INTEGER DEFAULT 0, created_at TEXT, updated_at TEXT
        )`);

        // 21. OutreachProspect
        await run(`CREATE TABLE IF NOT EXISTS outreach_prospects (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, name TEXT NOT NULL, handle TEXT NOT NULL, platform TEXT DEFAULT 'LINKEDIN', icp_score INTEGER DEFAULT 50, status TEXT DEFAULT 'NEW', created_at TEXT, updated_at TEXT
        )`);

        // 22. OutreachMessage
        await run(`CREATE TABLE IF NOT EXISTS outreach_messages (
          id TEXT PRIMARY KEY, prospect_id TEXT NOT NULL, message_text TEXT NOT NULL, status TEXT DEFAULT 'QUEUED', sent_at TEXT DEFAULT ''
        )`);

        // 23. OutreachReply
        await run(`CREATE TABLE IF NOT EXISTS outreach_replies (
          id TEXT PRIMARY KEY, message_id TEXT NOT NULL, reply_text TEXT NOT NULL, sentiment TEXT DEFAULT 'NEUTRAL', received_at TEXT
        )`);

        // 24. AuthorityAsset
        await run(`CREATE TABLE IF NOT EXISTS authority_assets (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, title TEXT NOT NULL, asset_type TEXT NOT NULL, proof_summary TEXT NOT NULL, link TEXT DEFAULT '#', is_archived INTEGER DEFAULT 0, created_at TEXT, updated_at TEXT
        )`);

        // 25. ContentPerformance
        await run(`CREATE TABLE IF NOT EXISTS content_performances (
          id TEXT PRIMARY KEY, content_id TEXT NOT NULL, distribution_id TEXT, views INTEGER DEFAULT 0, engagements INTEGER DEFAULT 0, intent_clicks INTEGER DEFAULT 0, dms_generated INTEGER DEFAULT 0, qualified_leads INTEGER DEFAULT 0, revenue_influenced REAL DEFAULT 0, recorded_at TEXT
        )`);

        // 26. AttributionEvent
        await run(`CREATE TABLE IF NOT EXISTS attribution_events (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, content_id TEXT, lead_id TEXT, event_type TEXT NOT NULL, revenue_amount REAL DEFAULT 0, timestamp TEXT
        )`);

        // 27. AIInteraction
        await run(`CREATE TABLE IF NOT EXISTS ai_interactions (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, prompt_type TEXT NOT NULL, input_context TEXT NOT NULL, output_json TEXT NOT NULL, user_action TEXT DEFAULT 'SAVED', created_at TEXT
        )`);

        // 28. Recommendation
        await run(`CREATE TABLE IF NOT EXISTS recommendations (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, category TEXT NOT NULL, observation TEXT NOT NULL, rationale TEXT NOT NULL, proposed_action TEXT NOT NULL, confidence_score TEXT NOT NULL, status TEXT DEFAULT 'PENDING', created_at TEXT, updated_at TEXT
        )`);

        // 29. AuditLog
        await run(`CREATE TABLE IF NOT EXISTS audit_logs (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, action TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id TEXT NOT NULL, changes_json TEXT NOT NULL, user_id TEXT DEFAULT 'HUMAN_OPERATOR', timestamp TEXT
        )`);

        // Indexes
        await run(`CREATE INDEX IF NOT EXISTS idx_chunks_source ON founder_knowledge_chunks (source_id)`);
        await run(`CREATE INDEX IF NOT EXISTS idx_chunks_biz ON founder_knowledge_chunks (business_id)`);
        await run(`CREATE INDEX IF NOT EXISTS idx_contents_biz_status ON contents (business_id, lifecycle_status)`);

        const now = new Date().toISOString();

        // Seed Business & Founder
        await run(`INSERT OR IGNORE INTO businesses (id, name, domain, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`, [
          'biz_default',
          'ASENZO Growth OS Tenant',
          'asenzo.ai',
          now,
          now
        ]);

        await run(
          `INSERT OR IGNORE INTO founders (id, business_id, name, email, title, bio, expertise, experience, story, beliefs, opinions, achievements, credentials, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            'founder_default',
            'biz_default',
            'Alex Morgan',
            'alex@asenzo.ai',
            'Founder & Growth Operator',
            'Building founder-independent growth infrastructure for bootstrapped B2B founders.',
            JSON.stringify(['B2B Positioning', 'Growth Operating Systems', 'Founder Autonomy', 'Systemized Client Acquisition']),
            '12+ years in B2B SaaS & Growth Operations',
            'Spent 6 years trapped in 60-hour workweeks running manual agency services before building the 5-Engine Growth OS framework.',
            JSON.stringify(['Software dependency without positioning leverage creates chaos.', 'Founders must build operating systems, not just hire agencies.', 'Direct, metric-driven communication builds genuine authority.']),
            JSON.stringify(['Retainer agencies keep founders dependent.', 'Vanity views mean nothing without qualified DM pipeline conversions.']),
            JSON.stringify(['Scaled 4 B2B businesses past $100k/mo MRR', 'Raised average Founder Independence Score from 32 to 86']),
            JSON.stringify(['BS Computer Science', 'Growth Operator Practitioner']),
            now,
            now
          ]
        );

        // Seed Brand Profile
        await run(
          `INSERT OR IGNORE INTO brand_profiles (id, business_id, brand_name, tagline, mission, personal_brand_positioning, business_brand_positioning, audience, personality, tone, formality, directness, humor, technical_depth, vocabulary_preferences, words_to_use, words_to_avoid, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            'bp_default',
            'biz_default',
            'ASENZO Growth OS',
            'The Founder Growth Operating System',
            'Transform founders from single-point-of-failure bottlenecks into independent growth operators.',
            'Systems-driven growth operator sharing transparent frameworks.',
            'Production-grade founder growth operating system for bootstrapped B2B founders.',
            'Bootstrapped B2B Founders doing $15k–$50k/mo MRR',
            'Authoritative, direct, systems-oriented, no-nonsense',
            'Direct, Authoritative',
            'Professional Casual',
            'High',
            'Subtle',
            'High',
            'Systems, engines, leverage, bottlenecks, FIS score, operating capability',
            JSON.stringify(['operating system', 'leverage', 'framework', 'bottleneck', 'compounding', 'FIS score']),
            JSON.stringify(['hack', 'guru', 'overnight', 'secret', 'magic bullet', 'passive income']),
            now,
            now
          ]
        );

        // Seed Initial Founder Knowledge Source & Chunks (Ingestion Pipeline Seed)
        const sampleContent1 = `
Most bootstrapped B2B founders think they have a sales problem. They don't. They have an operating system problem.
When a founder spends 60 hours a week running every sales call, writing every post, and closing every DM, they are not operating a business — they are running a high-stress job.

In our growth framework, we evaluate Founder Independence Score (FIS) on a 0 to 100 scale:
1. Engine 1 Attention OS: Does your content pipeline run predictably without requiring 4 hours of manual drafting every day?
2. Engine 2 Conversion OS: Are your incoming lead conversations triaged by structured SOP playbooks?
3. Engine 3 Delivery OS: Can client onboarding happen smoothly without founder intervention?

When you replace random agency retainers with a production-grade Growth Operating System, your qualified DM pipeline doubles while your weekly workload drops from 60 hours to 15 hours.
        `.trim();

        const srcId = 'kn_seed_1';
        await run(
          `INSERT OR IGNORE INTO founder_knowledge_sources (id, business_id, founder_id, title, source_type, raw_content, clean_content, metadata_json, chunk_count, is_archived, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`,
          [
            srcId,
            'biz_default',
            'founder_default',
            'Founder Independence Framework & Agency Myths Article',
            'ARTICLE',
            sampleContent1,
            sampleContent1,
            JSON.stringify({ wordCount: 145, readingTimeMinutes: 1 }),
            2,
            now,
            now
          ]
        );

        // Seed Chunks
        await run(
          `INSERT OR IGNORE INTO founder_knowledge_chunks (id, source_id, business_id, chunk_index, chunk_text, token_count, keywords, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            'chk_seed_1_0',
            srcId,
            'biz_default',
            0,
            'Most bootstrapped B2B founders think they have a sales problem. They don\'t. They have an operating system problem. When a founder spends 60 hours a week running sales calls, posts, and DMs, they run a high-stress job.',
            48,
            JSON.stringify(['sales problem', 'operating system problem', '60 hours a week', 'high-stress job']),
            now
          ]
        );

        await run(
          `INSERT OR IGNORE INTO founder_knowledge_chunks (id, source_id, business_id, chunk_index, chunk_text, token_count, keywords, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            'chk_seed_1_1',
            srcId,
            'biz_default',
            1,
            'In our growth framework, we evaluate Founder Independence Score (FIS) on a 0 to 100 scale across Engine 1 Attention OS, Engine 2 Conversion OS, and Engine 3 Delivery OS. Replacing random agency retainers with a production-grade OS doubles qualified DM pipeline while dropping weekly workload to 15 hours.',
            52,
            JSON.stringify(['Founder Independence Score', 'FIS', 'Attention OS', 'agency retainers', '15 hours']),
            now
          ]
        );

        // Seed Founder Voice Profile
        await run(
          `INSERT OR IGNORE INTO founder_voice_profiles (id, business_id, sentence_patterns, recurring_phrases, vocabulary, writing_structure, directness_level, communication_style, sample_chunks, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            'vp_default',
            'biz_default',
            JSON.stringify(['Direct problem-solution framing', 'Contrarian pattern interrupts', 'Quantified metric assertions']),
            JSON.stringify(['operating system problem', 'Founder Independence Score', 'agency retainers vs operating capability', '60-hr workweeks']),
            JSON.stringify(['infrastructure', 'leverage', 'bottleneck', 'compounding', 'SOP delegation']),
            'Short declarative hook -> Context -> 3-Pillar breakdown -> Quantified action step.',
            'High',
            'Direct, Authoritative, Metric-backed, Systems-driven',
            JSON.stringify(['chk_seed_1_0', 'chk_seed_1_1']),
            now
          ]
        );

        // Seed Positioning & ICP
        await run(
          `INSERT OR IGNORE INTO icps (id, business_id, name, target_customer, industry, business_type, founder_role, company_size, revenue_range, primary_pains, secondary_pains, desired_outcomes, buying_triggers, objections, is_active, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
          [
            'icp_default',
            'biz_default',
            'Bootstrapped B2B Agency Founders',
            'Bootstrapped B2B Founders',
            'B2B SaaS & Digital Agencies',
            'Service & SaaS Hybrid',
            'CEO / Founder Operator',
            '3–15 Team Members',
            '$15k–$50k/mo',
            JSON.stringify(['Trapped in 60-hr workweeks serving as single bottleneck for marketing & sales', 'Unpredictable client acquisition']),
            JSON.stringify(['Low team autonomy', 'SaaS tool overload']),
            JSON.stringify(['Scale to $100k/mo MRR', 'Increase Founder Independence Score to 85+']),
            JSON.stringify(['Retainer agency failure', 'Burnout from 60hr weeks']),
            JSON.stringify(['Will this take more of my time?']),
            now,
            now
          ]
        );

        const initialStatement = 'For Bootstrapped B2B Founders doing $15k–$50k/mo trapped in 60-hr workweeks serving as single bottleneck, The ASENZO 5-Engine Growth OS Framework scales revenue to $100k/mo while increasing Founder Independence Score from 30 to 85+.';
        const initialBreakdown = JSON.stringify({ icpSpecificity: 18, painClarity: 18, outcomeClarity: 18, differentiation: 18, comprehension: 16 });

        await run(
          `INSERT OR IGNORE INTO positionings (id, business_id, icp_id, icp_summary, problem, result, mechanism, statement, score, score_breakdown, alternatives, version, is_active, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 88, ?, '[]', 1, 1, ?, ?)`,
          [
            'pos_default',
            'biz_default',
            'icp_default',
            'Bootstrapped B2B Founders doing $15k–$50k/mo',
            'Trapped in 60-hr workweeks serving as single bottleneck for marketing & sales',
            'Scale to $100k/mo while increasing Founder Independence Score from 30 to 85+',
            'The ASENZO 5-Engine Growth OS Framework',
            initialStatement,
            initialBreakdown,
            now,
            now
          ]
        );

        await run(
          `INSERT OR IGNORE INTO positioning_versions (id, positioning_id, version_number, statement, icp_summary, problem, result, mechanism, score, score_breakdown, created_at)
           VALUES (?, ?, 1, ?, ?, ?, ?, ?, 88, ?, ?)`,
          ['pos_ver_1', 'pos_default', initialStatement, 'Bootstrapped B2B Founders doing $15k–$50k/mo', 'Trapped in 60-hr workweeks serving as single bottleneck', 'Scale to $100k/mo', 'The ASENZO 5-Engine Growth OS Framework', initialBreakdown, now]
        );

        await run(
          `INSERT OR IGNORE INTO offers (id, business_id, offer_name, description, promise, deliverables, target_audience, pricing_context, proof, differentiators, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            'offer_default',
            'biz_default',
            'ASENZO Founder Growth Operating System Installation',
            'Complete growth infrastructure installation & founder capability training across 5 operating engines.',
            'Scale to $100k/mo revenue while raising Founder Independence Score to 85+.',
            JSON.stringify(['Attention OS Content Engine', 'Conversion OS CRM Triage', 'Delivery OS Milestones']),
            'Bootstrapped B2B Founders doing $15k–$50k/mo',
            '$12,500 One-time OS Installation Sprint',
            'Case Study: Apex Logistics grown pipeline 2.4x in 90 days.',
            JSON.stringify(['We install operating capability, not SaaS subscription dependency']),
            now,
            now
          ]
        );

        // Content Pillars & Seed Contents
        const pillars = [
          {
            id: 'pil_pos', name: 'Positioning & ICP Pain', type: 'POSITIONING', pct: 30,
            desc: 'Put the specific ICP bottleneck on the table and frame the category so the founder stops buying activity and starts buying outcomes.',
            audience: 'Bootstrapped B2B Founders doing $15k–$50k/mo trapped as the single bottleneck',
            objective: 'Qualify prospects who recognize the painful bottleneck and install desire for the quantified result',
            pain: 'Trapped in 60-hr workweeks serving as the single bottleneck for marketing & sales',
            desired: 'Scale to $100k/mo while raising Founder Independence Score from 30 to 85+',
            formats: ['Hook Post', 'Contrarian Post', 'Story Post', 'Carousel'],
            platforms: ['LINKEDIN', 'X_TWITTER', 'NEWSLETTER']
          },
          {
            id: 'pil_mech', name: 'Unique Mechanism', type: 'MECHANISM', pct: 35,
            desc: 'Prove the ASENZO 5-Engine Growth OS framework is the only repeatable route from bottleneck to operating system owner.',
            audience: 'Founders already aware of the pain but skeptical of agency/SaaS stopgaps',
            objective: 'Build proprietary leverage and make the mechanism the memorable category-defining asset',
            pain: 'Retainer agency dependency, scattered SaaS tools and no single operating source of truth',
            desired: 'Founders can describe and reapply the mechanism in under 60 seconds',
            formats: ['Framework Breakdown', 'Step-by-Step', 'Walkthrough Video', 'Carousel'],
            platforms: ['LINKEDIN', 'X_TWITTER', 'YOUTUBE', 'NEWSLETTER']
          },
          {
            id: 'pil_proof', name: 'Proof & Case Studies', type: 'PROOF', pct: 20,
            desc: 'Show real before/after outcomes (FIS scores, pipeline multipliers, revenue) to convert attention into qualified inbound conversations.',
            audience: 'Decision-stage founders comparing installers or rebuilding internal capability',
            objective: 'Dramatically reduce perceived risk so qualified founders DM or book a call',
            pain: 'Past agency/SaaS investments produced activity but no measurable founder independence',
            desired: 'Prospects request the same quantified transformation for their own business',
            formats: ['Case Study', 'Client Breakdown', 'Testimonial', 'Screen-recording'],
            platforms: ['LINKEDIN', 'YOUTUBE', 'NEWSLETTER']
          },
          {
            id: 'pil_auth', name: 'Authority & Industry Insight', type: 'AUTHORITY', pct: 15,
            desc: 'Publish sharp macro-observations and data-driven opinions on agency retainers, FIS and founder leverage to establish category authority.',
            audience: 'Niche audiences & adjacent founders who amplify contrarian evidence-backed views',
            objective: 'Become the default trusted voice so attention compounds beyond individual posts',
            pain: 'Unpredictable reach and zero compounding because nobody owns a defensible point of view',
            desired: 'Consistent inbound from people who repost, quote and mail the founder',
            formats: ['POV Post', 'Data Deep Dive', 'Industry Insight', 'Manifesto'],
            platforms: ['X_TWITTER', 'LINKEDIN', 'NEWSLETTER']
          }
        ];
        for (const p of pillars) {
          await run(
            `INSERT OR IGNORE INTO content_pillars (id, business_id, name, pillar_type, description, target_audience, objective, pain, desired_result, content_formats, supported_platforms, status, target_percentage, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', ?, ?, ?)`,
            [p.id, 'biz_default', p.name, p.type, p.desc, p.audience, p.objective, p.pain, p.desired, JSON.stringify(p.formats), JSON.stringify(p.platforms), p.pct, now, now]
          );
        }

        const initialContents = [
          { id: 'cnt_1', title: 'Why 90% of Agencies Fail Founders', pillar_id: 'pil_pos', lifecycle_status: 'IDEA', primary_platform: 'LINKEDIN', hook_text: 'Most agencies don\'t sell growth. They sell activity.', body_script: 'Here is why relying on standard agency retainers creates dependency...', cta: 'Comment "OS" for the breakdown.', owner: 'Alex Morgan', score: 88, perf: JSON.stringify({ views: 4200, dms: 12, qualifiedLeads: 5 }) },
          { id: 'cnt_2', title: 'The Founder Independence Score Framework', pillar_id: 'pil_mech', lifecycle_status: 'SCRIPT', primary_platform: 'X_TWITTER', hook_text: 'What happens to your revenue if you take 30 days completely offline?', body_script: 'If the answer is a drop in sales, you don\'t have a business — you have a job...', cta: 'DM "FIS" to calculate your score.', owner: 'Alex Morgan', score: 94, perf: JSON.stringify({ views: 8900, dms: 24, qualifiedLeads: 11 }) },
          { id: 'cnt_3', title: 'Apex Logistics 2.4x Growth Case Study Breakdown', pillar_id: 'pil_proof', lifecycle_status: 'PUBLISHED', primary_platform: 'LINKEDIN', hook_text: 'How Apex Logistics scaled pipeline 2.4x in 90 days.', body_script: 'Complete breakdown of the 5-Engine Growth OS installation...', cta: 'DM "APEX" for case study access.', owner: 'Alex Morgan', score: 96, published_at: now, perf: JSON.stringify({ views: 14500, dms: 38, qualifiedLeads: 18 }) }
        ];
        for (const item of initialContents) {
          await run(
            `INSERT OR IGNORE INTO contents (id, business_id, pillar_id, title, lifecycle_status, primary_platform, hook_text, body_script, cta, owner, deadline, scheduled_at, published_at, score, performance_json, is_ad_candidate, is_archived, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?)`,
            [item.id, 'biz_default', item.pillar_id, item.title, item.lifecycle_status, item.primary_platform, item.hook_text, item.body_script, item.cta, item.owner || 'Alex Morgan', item.deadline || '', item.scheduled_at || '', item.published_at || '', item.score || 85, item.perf || '{}', now, now]
          );
        }

        // Market Intelligence Seeds (Idea Sources)
        const marketIntelSeeds = [
          { title: 'Competitor X VSL angle leans hard on time-savings, not independence', source: 'YouTube Competitor Audit', insight: 'Gurus monetize save-time promises with zero underlying operating system — leaves a clear independence & mechanism gap to own.', viralFactor: 'High' },
          { title: 'LinkedIn comments show founders burned after agency retainers', source: 'LinkedIn Comments', insight: 'Recurring pattern: "spent $5k/mo on retainers, still doing every sales call myself." Strong proof-gap content opportunity.', viralFactor: 'High' }
        ];
        for (let miIdx = 0; miIdx < marketIntelSeeds.length; miIdx++) {
          const mi = marketIntelSeeds[miIdx];
          await run(
            `INSERT OR IGNORE INTO market_intel (id, business_id, title, source, insight, viral_factor, is_archived, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)`,
            [(`mi_seed_${Date.now()}_${miIdx}`), 'biz_default', mi.title, mi.source, mi.insight, mi.viralFactor, now, now]
          );
        }

        resolve();
      } catch (err) {
        reject(err);
      }
    });
  });
}

initDb().catch(console.error);

module.exports = {
  db,
  run,
  get,
  all,
  logAudit
};
