const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = process.env.NODE_ENV === 'test' ? ':memory:' : path.join(dataDir, 'asenzo.db');
const db = new sqlite3.Database(dbPath);
db.configure('busyTimeout', 10000);

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
        if (process.env.RESET_DB === 'true') {
          const tablesToDrop = [
            'businesses', 'founders', 'icps', 'positionings', 'positioning_versions', 'offers', 'brand_profiles',
            'brand_voices', 'founder_knowledge_sources', 'founder_knowledge_chunks', 'founder_voice_profiles',
            'content_pillars', 'content_ideas', 'contents', 'content_versions', 'content_assets', 'platforms',
            'platform_accounts', 'distributions', 'integration_logs', 'lead_magnets', 'leads', 'outreach_prospects',
            'outreach_messages', 'outreach_replies', 'authority_assets', 'content_performances', 'attribution_events',
            'ai_interactions', 'recommendations', 'market_intel', 'audit_logs', 'lead_campaigns', 'landing_surfaces',
            'landing_forms', 'lead_ctas', 'conversion_vsl_funnels', 'dm_qualifiers', 'story_sequences', 'deals',
            'sales_calls', 'founder_sales_patterns', 'post_call_coaching_logs', 'objection_library', 'proposals',
            'contracts', 'payments', 'delivery_handoffs'
          ];

          for (const tbl of tablesToDrop) {
            await run(`DROP TABLE IF EXISTS ${tbl}`);
          }
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

        // 13b. Market Intelligence (Signals & Niche Observations)
        await run(`CREATE TABLE IF NOT EXISTS market_intel (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, title TEXT NOT NULL, signal_type TEXT DEFAULT 'MARKET_CONVERSATION', source TEXT DEFAULT 'Niche Observation', signal_date TEXT DEFAULT '', relevance TEXT DEFAULT 'HIGH', icp_relevance TEXT DEFAULT '', topic TEXT DEFAULT '', summary TEXT DEFAULT '', potential_content_angle TEXT DEFAULT '', is_converted_to_idea INTEGER DEFAULT 0, converted_idea_id TEXT DEFAULT '', insight TEXT DEFAULT '', viral_factor TEXT DEFAULT 'Medium', is_archived INTEGER DEFAULT 0, created_at TEXT, updated_at TEXT
        )`);

        // 21. OutreachProspect (Attention OS Lightweight Outreach Tracker)
        await run(`CREATE TABLE IF NOT EXISTS outreach_prospects (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, prospect_name TEXT NOT NULL, source TEXT DEFAULT 'LinkedIn Search', platform TEXT DEFAULT 'LINKEDIN', initial_message TEXT DEFAULT '', contact_date TEXT DEFAULT '', follow_up_date TEXT DEFAULT '', latest_reply TEXT DEFAULT '', reply_classification TEXT DEFAULT 'UNKNOWN', conversation_history TEXT DEFAULT '[]', qualified_status TEXT DEFAULT 'UNQUALIFIED', icp_score INTEGER DEFAULT 50, status TEXT DEFAULT 'NEW', is_archived INTEGER DEFAULT 0, created_at TEXT, updated_at TEXT
        )`);

        // 22. OutreachMessage
        await run(`CREATE TABLE IF NOT EXISTS outreach_messages (
          id TEXT PRIMARY KEY, prospect_id TEXT NOT NULL, message_text TEXT NOT NULL, status TEXT DEFAULT 'QUEUED', sent_at TEXT DEFAULT ''
        )`);

        // 23. OutreachReply
        await run(`CREATE TABLE IF NOT EXISTS outreach_replies (
          id TEXT PRIMARY KEY, message_id TEXT NOT NULL, reply_text TEXT NOT NULL, sentiment TEXT DEFAULT 'NEUTRAL', received_at TEXT
        )`);

        // 24. AuthorityAsset (Approved Proof Library — Strict Anti-Fabrication Engine Source)
        await run(`CREATE TABLE IF NOT EXISTS authority_assets (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, title TEXT NOT NULL, asset_type TEXT NOT NULL DEFAULT 'CASE_STUDY', source TEXT DEFAULT 'Client Case Study', asset_date TEXT DEFAULT '', client_name TEXT DEFAULT '', problem TEXT DEFAULT '', result TEXT DEFAULT '', metric TEXT DEFAULT '', tags TEXT DEFAULT '[]', permission_status TEXT DEFAULT 'APPROVED', expiration_date TEXT DEFAULT '', proof_summary TEXT DEFAULT '', file_url TEXT DEFAULT '#', is_archived INTEGER DEFAULT 0, created_at TEXT, updated_at TEXT
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

        // 17. Platform (Distribution Platform Catalog)
        await run(`CREATE TABLE IF NOT EXISTS platforms (
          id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE, handle TEXT DEFAULT '', is_connected INTEGER DEFAULT 0, updated_at TEXT
        )`);

        // 17b. PlatformAccount (OAuth/Token-Managed Social Account Connection)
        await run(`CREATE TABLE IF NOT EXISTS platform_accounts (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, platform_id TEXT NOT NULL, platform_name TEXT DEFAULT '', account_name TEXT NOT NULL, handle TEXT DEFAULT '', display_name TEXT DEFAULT '', profile_image_url TEXT DEFAULT '', access_token TEXT DEFAULT '', refresh_token TEXT DEFAULT '', token_type TEXT DEFAULT 'Bearer', scope TEXT DEFAULT '', token_expires_at TEXT DEFAULT '', token_status TEXT DEFAULT 'ACTIVE', is_primary INTEGER DEFAULT 0, is_active INTEGER DEFAULT 1, rate_limit_reset_at TEXT DEFAULT '', last_sync_at TEXT DEFAULT '', created_at TEXT, updated_at TEXT
        )`);

        // 18. Distribution (Publishing Workflow — Content → Version → Platform → External Post)
        await run(`CREATE TABLE IF NOT EXISTS distributions (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL DEFAULT 'biz_default', content_id TEXT NOT NULL, content_version_id TEXT DEFAULT '', platform_id TEXT NOT NULL, platform_account_id TEXT DEFAULT '', campaign_id TEXT DEFAULT '', status TEXT DEFAULT 'DRAFT', scheduled_at TEXT DEFAULT '', published_at TEXT DEFAULT '', external_post_id TEXT DEFAULT '', external_url TEXT DEFAULT '', error_details TEXT DEFAULT '', retry_count INTEGER DEFAULT 0, max_retries INTEGER DEFAULT 3, idempotency_key TEXT DEFAULT '', note TEXT DEFAULT '', cancelled_at TEXT DEFAULT '', last_attempt_at TEXT DEFAULT '', created_at TEXT, updated_at TEXT
        )`);

        // 18b. IntegrationLog (Auditable trail for external gateway calls)
        await run(`CREATE TABLE IF NOT EXISTS integration_logs (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, entity_type TEXT DEFAULT 'distribution', entity_id TEXT DEFAULT '', event TEXT NOT NULL, level TEXT DEFAULT 'INFO', message TEXT DEFAULT '', metadata_json TEXT DEFAULT '{}', created_at TEXT
        )`);

        // 19. LeadMagnet (Lead Magnet Library)
        await run(`CREATE TABLE IF NOT EXISTS lead_magnets (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, title TEXT NOT NULL, description TEXT DEFAULT '', asset_url TEXT DEFAULT '#', file_type TEXT DEFAULT '', image_url TEXT DEFAULT '', optin_count INTEGER DEFAULT 0, qualified_lead_count INTEGER DEFAULT 0, is_active INTEGER DEFAULT 1, is_archived INTEGER DEFAULT 0, created_at TEXT, updated_at TEXT
        )`);

        // 19b. LeadCampaign (Campaign Tracking for Distribution & Lead Attribution)
        await run(`CREATE TABLE IF NOT EXISTS lead_campaigns (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, name TEXT NOT NULL, description TEXT DEFAULT '', platform TEXT DEFAULT 'LINKEDIN', status TEXT DEFAULT 'ACTIVE', start_at TEXT DEFAULT '', end_at TEXT DEFAULT '', created_at TEXT, updated_at TEXT
        )`);

        // 19c. LandingSurface (Where attention converts — content/distribution/campaign metadata)
        await run(`CREATE TABLE IF NOT EXISTS landing_surfaces (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, name TEXT NOT NULL, surface_type TEXT DEFAULT 'LINKEDIN_POST', url TEXT DEFAULT '', content_id TEXT DEFAULT '', distribution_id TEXT DEFAULT '', campaign_id TEXT DEFAULT '', lead_magnet_id TEXT DEFAULT '', is_active INTEGER DEFAULT 1, created_at TEXT, updated_at TEXT
        )`);

        // 19d. LandingForm (Capture form bound to a surface + lead magnet)
        await run(`CREATE TABLE IF NOT EXISTS landing_forms (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, name TEXT NOT NULL, surface_id TEXT DEFAULT '', lead_magnet_id TEXT DEFAULT '', campaign_id TEXT DEFAULT '', fields_json TEXT DEFAULT '{}', submit_cta TEXT DEFAULT 'Get the guide', success_message TEXT DEFAULT 'Thanks! Check your inbox.', is_active INTEGER DEFAULT 1, created_at TEXT, updated_at TEXT
        )`);

        // 19e. LeadCta (Trackable CTAs pointing content → capture surface)
        await run(`CREATE TABLE IF NOT EXISTS lead_ctas (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, name TEXT NOT NULL, cta_type TEXT DEFAULT 'COMMENT', cta_text TEXT DEFAULT '', content_id TEXT DEFAULT '', distribution_id TEXT DEFAULT '', surface_id TEXT DEFAULT '', campaign_id TEXT DEFAULT '', lead_magnet_id TEXT DEFAULT '', target_url TEXT DEFAULT '', created_at TEXT, updated_at TEXT
        )`);

        // 20. Lead (Attribution-Rich Lead Capture — strictly Attention OS scoped)
        await run(`CREATE TABLE IF NOT EXISTS leads (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, lead_magnet_id TEXT DEFAULT '', campaign_id TEXT DEFAULT '', campaign_name TEXT DEFAULT '', landing_surface_id TEXT DEFAULT '', form_id TEXT DEFAULT '', cta_id TEXT DEFAULT '', content_id TEXT DEFAULT '', distribution_id TEXT DEFAULT '', platform TEXT DEFAULT 'LINKEDIN', channel TEXT DEFAULT 'web', subchannel TEXT DEFAULT '', source TEXT DEFAULT 'FORM', source_url TEXT DEFAULT '', name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT DEFAULT '', company TEXT DEFAULT '', message TEXT DEFAULT '', intent_score INTEGER DEFAULT 0, status TEXT DEFAULT 'NEW', notes TEXT DEFAULT '', tags_json TEXT DEFAULT '[]', custom_fields_json TEXT DEFAULT '{}', utm_source TEXT DEFAULT '', utm_medium TEXT DEFAULT '', utm_campaign TEXT DEFAULT '', utm_content TEXT DEFAULT '', utm_term TEXT DEFAULT '', captured_at TEXT, created_at TEXT, updated_at TEXT, deleted_at TEXT
        )`);

        // 25. ContentPerformance — Attention OS measurement layer.
        // Tracks the 5 attention categories separately from business impact so
        // reach can never masquerade as revenue:
        //   Reach:      impressions, reach, views
        //   Engagement: likes, comments, shares, saves
        //   Intent:     profile_visits, clicks, cta_clicks
        //   Acquisition: leads, qualified_leads, conversations
        //   Commercial: opportunities, customers, revenue_influenced
        await run(`CREATE TABLE IF NOT EXISTS content_performances (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, content_id TEXT NOT NULL, distribution_id TEXT DEFAULT '',
          platform TEXT DEFAULT '', recorded_at TEXT,
          impressions INTEGER DEFAULT 0, reach INTEGER DEFAULT 0, views INTEGER DEFAULT 0,
          likes INTEGER DEFAULT 0, comments INTEGER DEFAULT 0, shares INTEGER DEFAULT 0, saves INTEGER DEFAULT 0,
          profile_visits INTEGER DEFAULT 0, clicks INTEGER DEFAULT 0, cta_clicks INTEGER DEFAULT 0,
          leads INTEGER DEFAULT 0, qualified_leads INTEGER DEFAULT 0, conversations INTEGER DEFAULT 0,
          opportunities INTEGER DEFAULT 0, customers INTEGER DEFAULT 0, revenue_influenced REAL DEFAULT 0,
          metrics_tracked INTEGER DEFAULT 0
        )`);

        // 26. AttributionEvent — the attention -> business impact event chain.
        // Content -> Interaction -> Visitor -> Lead -> Qualified Lead ->
        // Conversation -> Opportunity -> Customer -> Revenue.
        // Every event carries the provenance needed to answer "what content,
        // from which source/platform/campaign, produced this outcome".
        await run(`CREATE TABLE IF NOT EXISTS attribution_events (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, event_type TEXT NOT NULL,
          content_id TEXT, distribution_id TEXT DEFAULT '', lead_id TEXT, campaign_id TEXT DEFAULT '',
          source TEXT DEFAULT '', platform TEXT DEFAULT '',
          event_value REAL DEFAULT 0, revenue_amount REAL DEFAULT 0,
          metadata_json TEXT DEFAULT '{}', timestamp TEXT
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

        // 29b. Authority Assets
        await run(`CREATE TABLE IF NOT EXISTS authority_assets (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, title TEXT NOT NULL, asset_type TEXT DEFAULT 'CASE_STUDY', proof_summary TEXT NOT NULL, client_name TEXT DEFAULT '', quantified_metric TEXT DEFAULT '', problem_addressed TEXT DEFAULT '', result_delivered TEXT DEFAULT '', asset_url TEXT DEFAULT '', permission_status TEXT DEFAULT 'APPROVED', is_archived INTEGER DEFAULT 0, created_at TEXT, updated_at TEXT
        )`);

        // 29c. Outreach Prospects
        await run(`CREATE TABLE IF NOT EXISTS outreach_prospects (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, prospect_name TEXT NOT NULL, source TEXT DEFAULT '', platform TEXT DEFAULT 'LINKEDIN', initial_message TEXT DEFAULT '', contact_date TEXT DEFAULT '', follow_up_date TEXT DEFAULT '', latest_reply TEXT DEFAULT '', reply_classification TEXT DEFAULT 'NEUTRAL', conversation_history TEXT DEFAULT '[]', qualified_status TEXT DEFAULT 'UNQUALIFIED', icp_score INTEGER DEFAULT 85, status TEXT DEFAULT 'NEW', is_archived INTEGER DEFAULT 0, created_at TEXT, updated_at TEXT
        )`);

        // 30. Conversion VSL Funnels
        await run(`CREATE TABLE IF NOT EXISTS conversion_vsl_funnels (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, title TEXT NOT NULL, headline TEXT NOT NULL, subheadline TEXT DEFAULT '', video_url TEXT DEFAULT '', duration_seconds INTEGER DEFAULT 1140, pitch_summary TEXT DEFAULT '', cta_button_text TEXT DEFAULT '', booking_url TEXT DEFAULT '', proof_asset_ids TEXT DEFAULT '[]', is_active INTEGER DEFAULT 1, created_at TEXT, updated_at TEXT
        )`);

        // 31. DM Qualifiers
        await run(`CREATE TABLE IF NOT EXISTS dm_qualifiers (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, name TEXT NOT NULL, questions TEXT DEFAULT '[]', min_revenue_threshold TEXT DEFAULT '', disqualification_criteria TEXT DEFAULT '[]', objection_responses TEXT DEFAULT '{}', booking_trigger_score INTEGER DEFAULT 80, is_active INTEGER DEFAULT 1, created_at TEXT, updated_at TEXT
        )`);

        // 32. Story Sequences
        await run(`CREATE TABLE IF NOT EXISTS story_sequences (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, name TEXT NOT NULL, trigger_event TEXT DEFAULT 'QUALIFIED_LEAD_CAPTURED', steps TEXT DEFAULT '[]', is_active INTEGER DEFAULT 1, created_at TEXT, updated_at TEXT
        )`);

        // 33. CRM Deals / Opportunities
        await run(`CREATE TABLE IF NOT EXISTS deals (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, lead_id TEXT DEFAULT '', prospect_id TEXT DEFAULT '', deal_name TEXT NOT NULL, contact_name TEXT NOT NULL, company_name TEXT DEFAULT '', contact_email TEXT DEFAULT '', stage TEXT DEFAULT 'QUALIFIED_LEAD', amount REAL DEFAULT 12500, close_probability INTEGER DEFAULT 50, priority TEXT DEFAULT 'HIGH', founder_attention_required INTEGER DEFAULT 0, attention_reason TEXT DEFAULT '', next_action TEXT DEFAULT '', next_action_due_at TEXT DEFAULT '', status TEXT DEFAULT 'OPEN', won_at TEXT DEFAULT '', lost_at TEXT DEFAULT '', lost_reason TEXT DEFAULT '', notes TEXT DEFAULT '', created_at TEXT, updated_at TEXT
        )`);

        // 34. Sales Calls
        await run(`CREATE TABLE IF NOT EXISTS sales_calls (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, deal_id TEXT NOT NULL, lead_id TEXT DEFAULT '', scheduled_at TEXT DEFAULT '', completed_at TEXT DEFAULT '', recording_url TEXT DEFAULT '', transcript_text TEXT NOT NULL, duration_seconds INTEGER DEFAULT 1800, call_type TEXT DEFAULT 'DISCOVERY_DEMO', outcome TEXT DEFAULT 'ADVANCED', founder_call_rating INTEGER DEFAULT 4, is_benchmark_call INTEGER DEFAULT 0, created_at TEXT, updated_at TEXT
        )`);

        // 35. Founder Sales Patterns
        await run(`CREATE TABLE IF NOT EXISTS founder_sales_patterns (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, pattern_type TEXT NOT NULL, trigger_phrase TEXT NOT NULL, founder_response_technique TEXT NOT NULL, effectiveness_score INTEGER DEFAULT 90, sample_transcripts_json TEXT DEFAULT '[]', updated_at TEXT
        )`);

        // 36. Post Call Coaching Logs
        await run(`CREATE TABLE IF NOT EXISTS post_call_coaching_logs (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, sales_call_id TEXT NOT NULL, deal_id TEXT NOT NULL, benchmark_call_id TEXT DEFAULT '', trust_score INTEGER DEFAULT 85, mechanism_clarity_score INTEGER DEFAULT 88, objection_handling_score INTEGER DEFAULT 82, overall_call_score INTEGER DEFAULT 85, benchmark_comparison_json TEXT DEFAULT '{}', founder_pattern_matches_json TEXT DEFAULT '{}', coaching_tips_json TEXT DEFAULT '[]', objections_detected_json TEXT DEFAULT '[]', human_reviewed INTEGER DEFAULT 0, created_at TEXT
        )`);

        // 37. Objection Library
        await run(`CREATE TABLE IF NOT EXISTS objection_library (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, objection_text TEXT NOT NULL, category TEXT DEFAULT 'PRICING', founder_response_script TEXT NOT NULL, winning_angle TEXT DEFAULT '', frequency_count INTEGER DEFAULT 1, success_rate REAL DEFAULT 80, created_at TEXT, updated_at TEXT
        )`);

        // 38. Proposals
        await run(`CREATE TABLE IF NOT EXISTS proposals (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, deal_id TEXT NOT NULL, title TEXT NOT NULL, deliverables_json TEXT DEFAULT '[]', pricing_amount REAL DEFAULT 12500, payment_terms TEXT DEFAULT '', custom_terms TEXT DEFAULT '', status TEXT DEFAULT 'DRAFT', sent_at TEXT DEFAULT '', accepted_at TEXT DEFAULT '', created_at TEXT, updated_at TEXT
        )`);

        // 39. Contracts
        await run(`CREATE TABLE IF NOT EXISTS contracts (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, deal_id TEXT NOT NULL, proposal_id TEXT DEFAULT '', contract_type TEXT DEFAULT 'GROWTH_OS_INSTALLATION', document_url TEXT DEFAULT '', signature_proof TEXT DEFAULT '', status TEXT DEFAULT 'DRAFT', sent_at TEXT DEFAULT '', signed_at TEXT DEFAULT '', created_at TEXT, updated_at TEXT
        )`);

        // 40. Payments
        await run(`CREATE TABLE IF NOT EXISTS payments (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, deal_id TEXT NOT NULL, contract_id TEXT DEFAULT '', amount REAL NOT NULL, currency TEXT DEFAULT 'USD', payment_method TEXT DEFAULT 'STRIPE_CREDIT_CARD', transaction_id TEXT NOT NULL, status TEXT DEFAULT 'COMPLETED', paid_at TEXT DEFAULT '', created_at TEXT
        )`);

        // 41. Delivery Handoffs
        await run(`CREATE TABLE IF NOT EXISTS delivery_handoffs (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, deal_id TEXT NOT NULL, client_name TEXT NOT NULL, onboarding_checklist_json TEXT DEFAULT '[]', assigned_owner TEXT DEFAULT 'Alex Morgan', status TEXT DEFAULT 'PENDING', created_at TEXT, updated_at TEXT
        )`);

        // 42. Sales Pipelines & Configurable Stages
        await run(`CREATE TABLE IF NOT EXISTS sales_pipelines (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, name TEXT NOT NULL, description TEXT DEFAULT '', is_default INTEGER DEFAULT 1, is_active INTEGER DEFAULT 1, created_at TEXT, updated_at TEXT
        )`);

        await run(`CREATE TABLE IF NOT EXISTS pipeline_stages (
          id TEXT PRIMARY KEY, pipeline_id TEXT NOT NULL, business_id TEXT NOT NULL, name TEXT NOT NULL, order_index INTEGER NOT NULL, stage_type TEXT DEFAULT 'QUALIFICATION', description TEXT DEFAULT '', is_active INTEGER DEFAULT 1, created_at TEXT, updated_at TEXT
        )`);

        await run(`CREATE TABLE IF NOT EXISTS deal_stage_histories (
          id TEXT PRIMARY KEY, deal_id TEXT NOT NULL, business_id TEXT NOT NULL, from_stage_id TEXT DEFAULT '', to_stage_id TEXT NOT NULL, transition_reason TEXT DEFAULT '', moved_by_user TEXT DEFAULT 'HUMAN_OPERATOR', created_at TEXT
        )`);

        await run(`CREATE TABLE IF NOT EXISTS lead_qualifications (
          id TEXT PRIMARY KEY, lead_id TEXT NOT NULL, deal_id TEXT DEFAULT '', business_id TEXT NOT NULL, score INTEGER DEFAULT 85, budget_qualified INTEGER DEFAULT 1, authority_qualified INTEGER DEFAULT 1, need_qualified INTEGER DEFAULT 1, timeline_qualified INTEGER DEFAULT 1, disqualification_reason TEXT DEFAULT '', qualifier_notes TEXT DEFAULT '', created_at TEXT, updated_at TEXT
        )`);

        await run(`CREATE TABLE IF NOT EXISTS dm_conversations (
          id TEXT PRIMARY KEY, prospect_id TEXT DEFAULT '', deal_id TEXT DEFAULT '', business_id TEXT NOT NULL, platform TEXT DEFAULT 'LINKEDIN', participant_handle TEXT NOT NULL, status TEXT DEFAULT 'ACTIVE', created_at TEXT, updated_at TEXT
        )`);

        await run(`CREATE TABLE IF NOT EXISTS dm_messages (
          id TEXT PRIMARY KEY, conversation_id TEXT NOT NULL, business_id TEXT NOT NULL, sender_type TEXT DEFAULT 'PROSPECT', message_text TEXT NOT NULL, sent_at TEXT
        )`);

        await run(`CREATE TABLE IF NOT EXISTS sales_call_participants (
          id TEXT PRIMARY KEY, sales_call_id TEXT NOT NULL, name TEXT NOT NULL, role TEXT DEFAULT 'PROSPECT', email TEXT DEFAULT ''
        )`);

        await run(`CREATE TABLE IF NOT EXISTS sales_call_transcripts (
          id TEXT PRIMARY KEY, sales_call_id TEXT NOT NULL, transcript_text TEXT NOT NULL, speaker_turns_json TEXT DEFAULT '[]', created_at TEXT
        )`);

        await run(`CREATE TABLE IF NOT EXISTS sales_call_notes (
          id TEXT PRIMARY KEY, sales_call_id TEXT NOT NULL, note_text TEXT NOT NULL, author_name TEXT DEFAULT 'Alex Morgan', created_at TEXT
        )`);

        await run(`CREATE TABLE IF NOT EXISTS sales_call_outcomes (
          id TEXT PRIMARY KEY, sales_call_id TEXT NOT NULL, deal_id TEXT NOT NULL, outcome_type TEXT NOT NULL, next_step_action TEXT DEFAULT '', next_step_due_at TEXT DEFAULT '', created_at TEXT
        )`);

        await run(`CREATE TABLE IF NOT EXISTS sales_methods (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, name TEXT NOT NULL, framework_summary TEXT NOT NULL, key_questions_json TEXT DEFAULT '[]', is_active INTEGER DEFAULT 1, created_at TEXT, updated_at TEXT
        )`);

        await run(`CREATE TABLE IF NOT EXISTS top_performing_calls (
          id TEXT PRIMARY KEY, sales_call_id TEXT NOT NULL, business_id TEXT NOT NULL, benchmark_category TEXT DEFAULT 'MECHANISM_PITCH', why_top_performing TEXT NOT NULL, created_at TEXT
        )`);

        await run(`CREATE TABLE IF NOT EXISTS closers (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL, role TEXT DEFAULT 'FOUNDER', quota_amount REAL DEFAULT 50000, is_active INTEGER DEFAULT 1, created_at TEXT, updated_at TEXT
        )`);

        await run(`CREATE TABLE IF NOT EXISTS closer_performances (
          id TEXT PRIMARY KEY, closer_id TEXT NOT NULL, business_id TEXT NOT NULL, period TEXT DEFAULT '2026-Q3', calls_taken INTEGER DEFAULT 0, deals_won INTEGER DEFAULT 0, revenue_closed REAL DEFAULT 0, win_rate REAL DEFAULT 0, avg_call_score REAL DEFAULT 85, created_at TEXT, updated_at TEXT
        )`);

        await run(`CREATE TABLE IF NOT EXISTS follow_up_messages (
          id TEXT PRIMARY KEY, sequence_id TEXT NOT NULL, deal_id TEXT NOT NULL, business_id TEXT NOT NULL, step_index INTEGER DEFAULT 1, message_subject TEXT NOT NULL, message_text TEXT NOT NULL, status TEXT DEFAULT 'PENDING', sent_at TEXT
        )`);

        await run(`CREATE TABLE IF NOT EXISTS objection_occurrences (
          id TEXT PRIMARY KEY, objection_id TEXT NOT NULL, sales_call_id TEXT DEFAULT '', deal_id TEXT NOT NULL, business_id TEXT NOT NULL, detected_in_text TEXT DEFAULT '', handling_success INTEGER DEFAULT 1, created_at TEXT
        )`);

        await run(`CREATE TABLE IF NOT EXISTS objection_patterns (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, pattern_name TEXT NOT NULL, objection_ids_json TEXT DEFAULT '[]', best_counter_strategy TEXT NOT NULL, success_rate REAL DEFAULT 85, created_at TEXT
        )`);

        await run(`CREATE TABLE IF NOT EXISTS deal_automations (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, trigger_event TEXT NOT NULL, condition_json TEXT DEFAULT '{}', action_type TEXT NOT NULL, action_payload_json TEXT DEFAULT '{}', is_active INTEGER DEFAULT 1, created_at TEXT, updated_at TEXT
        )`);

        await run(`CREATE TABLE IF NOT EXISTS sales_activities (
          id TEXT PRIMARY KEY, deal_id TEXT NOT NULL, business_id TEXT NOT NULL, activity_type TEXT NOT NULL, description TEXT NOT NULL, performed_by TEXT DEFAULT 'Alex Morgan', timestamp TEXT
        )`);

        await run(`CREATE TABLE IF NOT EXISTS conversion_events (
          id TEXT PRIMARY KEY, deal_id TEXT DEFAULT '', business_id TEXT NOT NULL, event_name TEXT NOT NULL, value REAL DEFAULT 0, metadata_json TEXT DEFAULT '{}', timestamp TEXT
        )`);

        await run(`CREATE TABLE IF NOT EXISTS sales_recommendations (
          id TEXT PRIMARY KEY, deal_id TEXT NOT NULL, business_id TEXT NOT NULL, category TEXT DEFAULT 'PIPELINE_TRIAGE', observation TEXT NOT NULL, rationale TEXT NOT NULL, proposed_action TEXT NOT NULL, confidence_score REAL DEFAULT 90, status TEXT DEFAULT 'PENDING', created_at TEXT, updated_at TEXT
        )`);

        await run(`CREATE TABLE IF NOT EXISTS ai_coaching_sessions (
          id TEXT PRIMARY KEY, sales_call_id TEXT NOT NULL, deal_id TEXT NOT NULL, business_id TEXT NOT NULL, closer_id TEXT DEFAULT '', trust_score INTEGER DEFAULT 85, mechanism_clarity_score INTEGER DEFAULT 88, objection_handling_score INTEGER DEFAULT 82, overall_score INTEGER DEFAULT 85, coaching_tips_json TEXT DEFAULT '[]', human_reviewed INTEGER DEFAULT 0, created_at TEXT
        )`);

        // 43. Profile Funnel & VSL System
        await run(`CREATE TABLE IF NOT EXISTS profile_funnels (
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, title TEXT NOT NULL, slug TEXT DEFAULT 'growth-os-audit', publishing_status TEXT DEFAULT 'DRAFT', headline TEXT NOT NULL, target_icp_summary TEXT DEFAULT '', core_problem TEXT DEFAULT '', desired_outcome TEXT DEFAULT '', unique_mechanism TEXT DEFAULT '', vsl_title TEXT NOT NULL, vsl_video_url TEXT DEFAULT '', vsl_hook TEXT NOT NULL, vsl_problem TEXT NOT NULL, vsl_mechanism TEXT NOT NULL, vsl_proof_summary TEXT DEFAULT '', vsl_cta_text TEXT NOT NULL, booking_url TEXT DEFAULT '', authority_asset_ids_json TEXT DEFAULT '[]', objection_ids_json TEXT DEFAULT '[]', version INTEGER DEFAULT 1, is_active INTEGER DEFAULT 1, created_at TEXT, updated_at TEXT
        )`);

        await run(`CREATE TABLE IF NOT EXISTS funnel_versions (
          id TEXT PRIMARY KEY, funnel_id TEXT NOT NULL, business_id TEXT NOT NULL, version_number INTEGER NOT NULL, snapshot_json TEXT DEFAULT '{}', created_by TEXT DEFAULT 'Alex Morgan', change_summary TEXT NOT NULL, created_at TEXT
        )`);

        await run(`CREATE TABLE IF NOT EXISTS funnel_analytics_events (
          id TEXT PRIMARY KEY, funnel_id TEXT NOT NULL, business_id TEXT NOT NULL, event_type TEXT NOT NULL, visitor_id TEXT DEFAULT '', source_content_id TEXT DEFAULT '', environment TEXT DEFAULT 'PRODUCTION', metadata_json TEXT DEFAULT '{}', timestamp TEXT
        )`);

        // Indexes
        await run(`CREATE INDEX IF NOT EXISTS idx_chunks_source ON founder_knowledge_chunks (source_id)`);
        await run(`CREATE INDEX IF NOT EXISTS idx_chunks_biz ON founder_knowledge_chunks (business_id)`);
        await run(`CREATE INDEX IF NOT EXISTS idx_contents_biz_status ON contents (business_id, lifecycle_status)`);
        await run(`CREATE INDEX IF NOT EXISTS idx_distributions_content ON distributions (content_id)`);
        await run(`CREATE INDEX IF NOT EXISTS idx_distributions_status ON distributions (status)`);
        await run(`CREATE INDEX IF NOT EXISTS idx_leads_biz_attr ON leads (business_id, campaign_id, landing_surface_id, lead_magnet_id)`);
        await run(`CREATE INDEX IF NOT EXISTS idx_deals_biz_stage ON deals (business_id, stage)`);
        await run(`CREATE INDEX IF NOT EXISTS idx_deals_attention ON deals (business_id, founder_attention_required)`);
        await run(`CREATE INDEX IF NOT EXISTS idx_sales_calls_deal ON sales_calls (deal_id)`);
        await run(`CREATE INDEX IF NOT EXISTS idx_stages_pipeline ON pipeline_stages (pipeline_id, order_index)`);
        await run(`CREATE INDEX IF NOT EXISTS idx_deal_hist_deal ON deal_stage_histories (deal_id)`);
        await run(`CREATE INDEX IF NOT EXISTS idx_activities_deal ON sales_activities (deal_id)`);
        await run(`CREATE INDEX IF NOT EXISTS idx_funnel_analytics ON funnel_analytics_events (funnel_id, environment, event_type)`);

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

        // Market Intelligence Seeds (Signal Radar)
        const marketIntelSeeds = [
          { id: 'mi_seed_1', title: 'Competitor X VSL angle leans hard on time-savings, not independence', signalType: 'COMPETITOR_ACTIVITY', source: 'YouTube Competitor Audit', relevance: 'HIGH', icpRelevance: 'Direct competitor target audience overlap', topic: 'Agency Retainer Myths', summary: 'Gurus monetize save-time promises with zero underlying operating system — leaves a clear independence & mechanism gap to own.', potentialContentAngle: 'Why software & retainer time-saving promises leave founders trapped as bottlenecks.' },
          { id: 'mi_seed_2', title: 'LinkedIn comments show founders burned after agency retainers', signalType: 'CUSTOMER_QUESTION', source: 'LinkedIn Comments', relevance: 'HIGH', icpRelevance: 'Bootstrapped founders expressing frustration', topic: 'Founder Burnout', summary: 'Recurring pattern: "spent $5k/mo on retainers, still doing every sales call myself." Strong proof-gap content opportunity.', potentialContentAngle: 'The $5,000/month Agency Retainer Trap: How to transition to OS ownership.' }
        ];
        for (const mi of marketIntelSeeds) {
          await run(
            `INSERT OR IGNORE INTO market_intel (id, business_id, title, signal_type, source, signal_date, relevance, icp_relevance, topic, summary, potential_content_angle, is_converted_to_idea, converted_idea_id, insight, viral_factor, is_archived, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, '', ?, 'High', 0, ?, ?)`,
            [mi.id, 'biz_default', mi.title, mi.signalType, mi.source, now, mi.relevance, mi.icpRelevance, mi.topic, mi.summary, mi.potentialContentAngle, mi.summary, now, now]
          );
        }

        // Seed Authority Proof Assets (Strict Approved Source for AI Guardrails)
        const authorityAssetSeeds = [
          { id: 'auth_seed_1', title: 'Apex Logistics Pipeline Growth Case Study', assetType: 'CASE_STUDY', source: 'Client Case Study', clientName: 'Apex Logistics', problem: 'Single bottleneck founder working 65 hrs/week with stagnant $22k/mo revenue', result: 'Scaled pipeline 2.4x in 90 days while dropping founder workload to 15 hrs/week', metric: '2.4x pipeline growth', tags: JSON.stringify(['Case Study', '2.4x', 'Pipeline', 'Founder Autonomy']), permissionStatus: 'APPROVED', proofSummary: 'Apex Logistics grown pipeline 2.4x in 90 days using ASENZO Growth OS framework.' },
          { id: 'auth_seed_2', title: 'Vortex Media 3.4x Qualified DM Triaging Result', assetType: 'CLIENT_RESULT', source: 'DM Inbox Audit', clientName: 'Vortex Media', problem: 'Manual un-qualified DMs cluttering founder schedule', result: 'Tripled qualified DM volume in less than 30 days', metric: '3.4x DM volume', tags: JSON.stringify(['DM Triage', '3.4x', 'Qualified Leads']), permissionStatus: 'APPROVED', proofSummary: 'Vortex Media qualified DM volume tripled in less than 30 days.' }
        ];
        for (const auth of authorityAssetSeeds) {
          await run(
            `INSERT OR IGNORE INTO authority_assets (id, business_id, title, asset_type, source, asset_date, client_name, problem, result, metric, tags, permission_status, expiration_date, proof_summary, file_url, is_archived, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', ?, '#', 0, ?, ?)`,
            [auth.id, 'biz_default', auth.title, auth.assetType, auth.source, now, auth.clientName, auth.problem, auth.result, auth.metric, auth.tags, auth.permissionStatus, auth.proofSummary, now, now]
          );
        }

        // Seed Outreach Prospects (Attention Outreach Tracker)
        const outreachSeeds = [
          { id: 'prosp_seed_1', prospectName: 'Mark Vance (Founder @ SaaSify)', source: 'LinkedIn Search', platform: 'LINKEDIN', initialMessage: 'Hey Mark, saw your post on founder scaling bottlenecks. How are you handling content drafting?', contactDate: now, reply: 'We are struggling with manual drafting every week. Would love to see your framework.', replyClassification: 'INTERESTED', qualifiedStatus: 'QUALIFIED' },
          { id: 'prosp_seed_2', prospectName: 'Sarah Jenkins (CEO @ Lumina)', source: 'X / Twitter DM', platform: 'X', initialMessage: 'Hi Sarah, loved your thread on agency retainers. Are you open to comparing Growth OS metrics?', contactDate: now, reply: 'Not interested at this moment thanks.', replyClassification: 'NOT_NOW', qualifiedStatus: 'UNQUALIFIED' }
        ];
        for (const op of outreachSeeds) {
          await run(
            `INSERT OR IGNORE INTO outreach_prospects (id, business_id, prospect_name, source, platform, initial_message, contact_date, follow_up_date, latest_reply, reply_classification, conversation_history, qualified_status, icp_score, status, is_archived, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, '', ?, ?, '[]', ?, 85, 'NEW', 0, ?, ?)`,
            [op.id, 'biz_default', op.prospectName, op.source, op.platform, op.initialMessage, op.contactDate, op.reply, op.replyClassification, op.qualifiedStatus, now, now]
          );
        }

        // Seed Platform Catalog (Distribution configuration — not production data)
        const platformSeeds = [
          { id: 'pl_linkedin', name: 'LINKEDIN', handle: 'linkedin.com/feed' },
          { id: 'pl_x', name: 'X_TWITTER', handle: 'x.com/home' },
          { id: 'pl_instagram', name: 'INSTAGRAM', handle: 'instagram.com' },
          { id: 'pl_youtube', name: 'YOUTUBE', handle: 'youtube.com' },
          { id: 'pl_newsletter', name: 'NEWSLETTER', handle: 'newsletter' },
          { id: 'pl_podcast', name: 'PODCAST', handle: 'podcast' },
          { id: 'pl_email', name: 'EMAIL', handle: 'email' }
        ];
        for (const p of platformSeeds) {
          await run(
            `INSERT OR IGNORE INTO platforms (id, name, handle, is_connected, updated_at) VALUES (?, ?, ?, 0, ?)`,
            [p.id, p.name, p.handle, now]
          );
        }

        // ── ATTENTION OS MEASUREMENT SEEDS ────────────────────────────────────
        // Time-series content performance across the 5 tracked categories.
        // `metrics_tracked = 1` marks records where acquisition/commercial
        // columns were deliberately measured (even when zero) — this is what
        // lets the intelligence layer distinguish "measured flat" from
        // "unmeasured / insufficient data".
        const perfSeeds = [
          // cnt_1 — Positioning pillar: high reach, zero business outcome.
          { id: 'perf_cnt1_d1', contentId: 'cnt_1', platform: 'LINKEDIN', recordedAt: new Date(Date.now() - 3 * 86400000).toISOString(), impressions: 8800, reach: 6100, views: 4100, likes: 410, comments: 86, shares: 22, saves: 31, profileVisits: 14, clicks: 38, ctaClicks: 3, leads: 0, qualifiedLeads: 0, conversations: 0, opportunities: 0, customers: 0, revenue: 0, tracked: 1 },
          { id: 'perf_cnt1_d2', contentId: 'cnt_1', platform: 'LINKEDIN', recordedAt: new Date(Date.now() - 1 * 86400000).toISOString(), impressions: 5200, reach: 4100, views: 2400, likes: 268, comments: 41, shares: 9, saves: 18, profileVisits: 8, clicks: 21, ctaClicks: 2, leads: 0, qualifiedLeads: 0, conversations: 0, opportunities: 0, customers: 0, revenue: 0, tracked: 1 },
          // cnt_2 — Mechanism pillar: compounding qualified attention + commercial.
          { id: 'perf_cnt2_d1', contentId: 'cnt_2', platform: 'X_TWITTER', recordedAt: new Date(Date.now() - 3 * 86400000).toISOString(), impressions: 7400, reach: 5300, views: 3900, likes: 182, comments: 64, shares: 71, saves: 22, profileVisits: 66, clicks: 310, ctaClicks: 9, leads: 11, qualifiedLeads: 6, conversations: 5, opportunities: 2, customers: 0, revenue: 0, tracked: 1 },
          { id: 'perf_cnt2_d2', contentId: 'cnt_2', platform: 'X_TWITTER', recordedAt: new Date(Date.now() - 1 * 86400000).toISOString(), impressions: 9300, reach: 6900, views: 5100, likes: 241, comments: 97, shares: 118, saves: 35, profileVisits: 102, clicks: 470, ctaClicks: 15, leads: 13, qualifiedLeads: 8, conversations: 7, opportunities: 3, customers: 1, revenue: 12500, tracked: 1 },
          // cnt_3 — Proof pillar: the strongest business impact per unit attention.
          { id: 'perf_cnt3_d1', contentId: 'cnt_3', platform: 'LINKEDIN', recordedAt: new Date(Date.now() - 3 * 86400000).toISOString(), impressions: 21000, reach: 15700, views: 11200, likes: 940, comments: 210, shares: 96, saves: 140, profileVisits: 205, clicks: 680, ctaClicks: 26, leads: 19, qualifiedLeads: 11, conversations: 9, opportunities: 4, customers: 1, revenue: 12500, tracked: 1 },
          { id: 'perf_cnt3_d2', contentId: 'cnt_3', platform: 'LINKEDIN', recordedAt: new Date(Date.now() - 1 * 86400000).toISOString(), impressions: 14200, reach: 10800, views: 7600, likes: 620, comments: 148, shares: 51, saves: 96, profileVisits: 131, clicks: 415, ctaClicks: 18, leads: 14, qualifiedLeads: 8, conversations: 7, opportunities: 3, customers: 1, revenue: 12500, tracked: 1 }
        ];
        for (const p of perfSeeds) {
          await run(
            `INSERT OR IGNORE INTO content_performances (id, business_id, content_id, distribution_id, platform, recorded_at, impressions, reach, views, likes, comments, shares, saves, profile_visits, clicks, cta_clicks, leads, qualified_leads, conversations, opportunities, customers, revenue_influenced, metrics_tracked)
             VALUES (?, 'biz_default', ?, '', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [p.id, p.contentId, p.platform, p.recordedAt, p.impressions, p.reach, p.views, p.likes, p.comments, p.shares, p.saves, p.profileVisits, p.clicks, p.ctaClicks, p.leads, p.qualifiedLeads, p.conversations, p.opportunities, p.customers, p.revenue, p.tracked]
          );
        }

        // ── ATTRIBUTION EVENT CHAIN SEEDS ─────────────────────────────────────
        // Content -> Interaction -> Visitor -> Lead -> Qualified Lead ->
        // Conversation -> Opportunity -> Customer -> Revenue.
        // Each event carries source / platform / campaign / content / lead so
        // every business outcome can be traced back to the content that earned it.
        const daysAgo = (d) => new Date(Date.now() - d * 86400000).toISOString();
        const chainSeeds = [
          { id: 'attr_cnt1_int', contentId: 'cnt_1', eventType: 'interaction', source: 'ORGANIC', platform: 'LINKEDIN', campaignId: 'cmp_q1_authority', ts: daysAgo(2) },
          { id: 'attr_cnt1_vis', contentId: 'cnt_1', eventType: 'visitor', source: 'ORGANIC', platform: 'LINKEDIN', campaignId: 'cmp_q1_authority', ts: daysAgo(2) },
          { id: 'attr_cnt2_vis', contentId: 'cnt_2', eventType: 'visitor', source: 'ORGANIC', platform: 'X_TWITTER', campaignId: 'cmp_q1_mechanism', ts: daysAgo(2) },
          { id: 'attr_cnt2_lead1', contentId: 'cnt_2', leadId: 'lead_m', eventType: 'lead', source: 'CTA_CLICK', platform: 'X_TWITTER', campaignId: 'cmp_q1_mechanism', ts: daysAgo(2) },
          { id: 'attr_cnt2_ql1', contentId: 'cnt_2', leadId: 'lead_m', eventType: 'qualified_lead', source: 'CTA_CLICK', platform: 'X_TWITTER', campaignId: 'cmp_q1_mechanism', ts: daysAgo(1) },
          { id: 'attr_cnt2_con1', contentId: 'cnt_2', leadId: 'lead_m', eventType: 'conversation', source: 'CTA_CLICK', platform: 'X_TWITTER', campaignId: 'cmp_q1_mechanism', ts: daysAgo(1) },
          { id: 'attr_cnt2_opp1', contentId: 'cnt_2', leadId: 'lead_m', eventType: 'opportunity', source: 'CTA_CLICK', platform: 'X_TWITTER', campaignId: 'cmp_q1_mechanism', eventValue: 12500, ts: daysAgo(1) },
          { id: 'attr_cnt2_cust1', contentId: 'cnt_2', leadId: 'lead_m', eventType: 'customer', source: 'CTA_CLICK', platform: 'X_TWITTER', campaignId: 'cmp_q1_mechanism', ts: daysAgo(1) },
          { id: 'attr_cnt2_rev1', contentId: 'cnt_2', leadId: 'lead_m', eventType: 'revenue', source: 'CTA_CLICK', platform: 'X_TWITTER', campaignId: 'cmp_q1_mechanism', revenueAmount: 12500, ts: daysAgo(1) },
          { id: 'attr_cnt2_lead2', contentId: 'cnt_2', leadId: 'lead_v', eventType: 'lead', source: 'ORGANIC', platform: 'X_TWITTER', campaignId: 'cmp_q1_mechanism', ts: daysAgo(1) },
          { id: 'attr_cnt2_ql2', contentId: 'cnt_2', leadId: 'lead_v', eventType: 'qualified_lead', source: 'ORGANIC', platform: 'X_TWITTER', campaignId: 'cmp_q1_mechanism', ts: daysAgo(0) },
          { id: 'attr_cnt3_vis', contentId: 'cnt_3', eventType: 'visitor', source: 'ORGANIC', platform: 'LINKEDIN', campaignId: 'cmp_q1_proof', ts: daysAgo(2) },
          { id: 'attr_cnt3_lead1', contentId: 'cnt_3', leadId: 'lead_a', eventType: 'lead', source: 'DM', platform: 'LINKEDIN', campaignId: 'cmp_q1_proof', ts: daysAgo(2) },
          { id: 'attr_cnt3_ql1', contentId: 'cnt_3', leadId: 'lead_a', eventType: 'qualified_lead', source: 'DM', platform: 'LINKEDIN', campaignId: 'cmp_q1_proof', ts: daysAgo(1) },
          { id: 'attr_cnt3_con1', contentId: 'cnt_3', leadId: 'lead_a', eventType: 'conversation', source: 'DM', platform: 'LINKEDIN', campaignId: 'cmp_q1_proof', ts: daysAgo(1) },
          { id: 'attr_cnt3_opp1', contentId: 'cnt_3', leadId: 'lead_a', eventType: 'opportunity', source: 'DM', platform: 'LINKEDIN', campaignId: 'cmp_q1_proof', eventValue: 12500, ts: daysAgo(1) },
          { id: 'attr_cnt3_cust1', contentId: 'cnt_3', leadId: 'lead_a', eventType: 'customer', source: 'DM', platform: 'LINKEDIN', campaignId: 'cmp_q1_proof', ts: daysAgo(1) },
          { id: 'attr_cnt3_rev1', contentId: 'cnt_3', leadId: 'lead_a', eventType: 'revenue', source: 'DM', platform: 'LINKEDIN', campaignId: 'cmp_q1_proof', revenueAmount: 12500, ts: daysAgo(1) },
          { id: 'attr_cnt1_rev0', contentId: 'cnt_1', leadId: null, eventType: 'visitor', source: 'ORGANIC', platform: 'LINKEDIN', campaignId: 'cmp_q1_authority', ts: daysAgo(0) }
        ];
        for (const e of chainSeeds) {
          await run(
            `INSERT OR IGNORE INTO attribution_events (id, business_id, event_type, content_id, distribution_id, lead_id, campaign_id, source, platform, event_value, revenue_amount, metadata_json, timestamp)
             VALUES (?, 'biz_default', ?, ?, '', ?, ?, ?, ?, ?, ?, '{}', ?)`,
            [e.id, e.eventType, e.contentId || '', e.leadId || '', e.campaignId || '', e.source || '', e.platform || '', e.eventValue || 0, e.revenueAmount || 0, e.ts]
          );
        }

        // ── CONVERSION OS SEEDS ───────────────────────────────────────────────
        await run(
          `INSERT OR IGNORE INTO conversion_vsl_funnels (id, business_id, title, headline, subheadline, video_url, duration_seconds, pitch_summary, cta_button_text, booking_url, proof_asset_ids, is_active, created_at, updated_at)
           VALUES ('vsl_default', 'biz_default', 'The ASENZO 5-Engine Growth OS Mechanism Breakdown', 'How Bootstrapped B2B Founders Scale to $100k/mo With 85+ Founder Independence', 'Replace retainer agencies with an internal growth operating system in 90 days.', 'https://vimeo.com/asenzo-growth-os-vsl', 1140, 'Detailed teardown showing how Engine 1 Attention OS and Engine 2 Conversion OS eliminate founder acquisition bottlenecks.', 'Book Your Founder Growth OS Audit', 'https://cal.com/asenzo/growth-audit', '[]', 1, ?, ?)`,
          [now, now]
        );

        await run(
          `INSERT OR IGNORE INTO dm_qualifiers (id, business_id, name, questions, min_revenue_threshold, disqualification_criteria, objection_responses, booking_trigger_score, is_active, created_at, updated_at)
           VALUES ('dmq_default', 'biz_default', 'B2B Agency Founder DM Qualifier', ?, '$20k/mo', ?, '{}', 80, 1, ?, ?)`,
          [
            JSON.stringify(['What is your current monthly revenue range?', 'How many hours per week do you spend on marketing & sales?', 'What is your primary bottleneck right now?']),
            JSON.stringify(['Pre-revenue', 'Looking for cheap outsourced DMs']),
            now,
            now
          ]
        );

        await run(
          `INSERT OR IGNORE INTO story_sequences (id, business_id, name, trigger_event, steps, is_active, created_at, updated_at)
           VALUES ('seq_default', 'biz_default', '5-Day Founder Independence Story Nurture', 'QUALIFIED_LEAD_CAPTURED', ?, 1, ?, ?)`,
          [
            JSON.stringify([
              { day: 1, subject: 'Why 60-hr workweeks kill agency valuation', storyAngle: 'The single bottleneck trap', ctaText: 'Read the FIS architecture breakdown' },
              { day: 2, subject: 'How Mark doubled inbound qualified DMs in 30 days', storyAngle: 'SaaSify case study teardown', ctaText: 'Watch VSL Teardown' },
              { day: 3, subject: 'Agency retainers vs Growth OS installation', storyAngle: 'Total cost of ownership math', ctaText: 'Audit your growth stack' },
              { day: 4, subject: 'The 5-Engine Growth Operating Framework', storyAngle: 'Mechanism overview', ctaText: 'Book Strategy Call' }
            ]),
            now,
            now
          ]
        );

        await run(
          `INSERT OR IGNORE INTO sales_pipelines (id, business_id, name, description, is_default, is_active, created_at, updated_at)
           VALUES ('pipe_default', 'biz_default', 'Core Founder Sales Pipeline', 'Default configurable B2B founder growth operating pipeline', 1, 1, ?, ?)`,
          [now, now]
        );

        const defaultStages = [
          { id: 'stage_1', name: 'New Lead', index: 1, type: 'QUALIFICATION' },
          { id: 'stage_2', name: 'Qualified', index: 2, type: 'QUALIFICATION' },
          { id: 'stage_3', name: 'Call Booked', index: 3, type: 'BOOKING' },
          { id: 'stage_4', name: 'Call Done', index: 4, type: 'CALL' },
          { id: 'stage_5', name: 'Follow-up', index: 5, type: 'FOLLOWUP' },
          { id: 'stage_6', name: 'Proposal & Contract', index: 6, type: 'CLOSING' },
          { id: 'stage_7', name: 'Payment Pending', index: 7, type: 'CLOSING' },
          { id: 'stage_8', name: 'Closed Won', index: 8, type: 'WON' },
          { id: 'stage_9', name: 'Closed Lost', index: 9, type: 'LOST' }
        ];

        for (const stg of defaultStages) {
          await run(
            `INSERT OR IGNORE INTO pipeline_stages (id, pipeline_id, business_id, name, order_index, stage_type, description, is_active, created_at, updated_at)
             VALUES (?, 'pipe_default', 'biz_default', ?, ?, ?, ?, 1, ?, ?)`,
            [stg.id, stg.name, stg.index, stg.type, `Configurable stage: ${stg.name}`, now, now]
          );
        }

        await run(
          `INSERT OR IGNORE INTO closers (id, business_id, name, email, role, quota_amount, is_active, created_at, updated_at)
           VALUES ('closer_default', 'biz_default', 'Alex Morgan', 'alex@asenzo.ai', 'FOUNDER', 100000, 1, ?, ?)`,
          [now, now]
        );

        await run(
          `INSERT OR IGNORE INTO sales_methods (id, business_id, name, framework_summary, key_questions_json, is_active, created_at, updated_at)
           VALUES ('method_default', 'biz_default', 'ASENZO Founder-Led Mechanism Selling', 'Diagnoses 60-hr founder bottleneck, quantifies revenue gap, and demonstrates FIS growth OS mechanism.', ?, 1, ?, ?)`,
          [
            JSON.stringify(['What is your current monthly revenue and average deal size?', 'How many hours per week do you spend on sales calls manually?', 'What happens if you take 2 weeks off next month?']),
            now,
            now
          ]
        );
        await run(
          `INSERT OR IGNORE INTO profile_funnels (id, business_id, title, slug, publishing_status, headline, target_icp_summary, core_problem, desired_outcome, unique_mechanism, vsl_title, vsl_video_url, vsl_hook, vsl_problem, vsl_mechanism, vsl_proof_summary, vsl_cta_text, booking_url, authority_asset_ids_json, objection_ids_json, version, is_active, created_at, updated_at)
           VALUES ('pfunnel_default', 'biz_default', 'ASENZO Founder Growth OS Audit', 'growth-os-audit', 'PUBLISHED', 'Turn Qualified Organic Attention into High-ARR Sales Calls without Agency Retainers', 'Bootstrapped B2B Founders & Agencies doing $15k–$50k/mo', 'Trapped in 60-hr workweeks serving as single bottleneck for marketing & sales', 'Scale to $100k/mo while increasing Founder Independence Score from 30 to 85+', 'The ASENZO 5-Engine Growth OS Architecture', 'How Founders Build a Self-Compounding Growth Engine in 90 Days', 'https://vimeo.com/765432109', 'If you are spending 20+ hours a week repeating the same sales pitch, your growth system is broken.', 'Most founders rely on random organic posting and brute-force 1:1 calls, leading to unpredictable revenue stalls.', 'ASENZO embeds Attention OS and Conversion OS directly into your brand, capturing your sales behavior as reusable intelligence.', 'Case study: SaaSify scaled from $25k to $60k/mo ARR in 90 days with 68% close rate.', 'Book Your 1:1 Founder Growth Audit', 'https://cal.com/asenzo/growth-audit', ?, ?, 1, 1, ?, ?)`,
          [
            JSON.stringify(['asset_case_1', 'asset_review_1']),
            JSON.stringify(['obj_price_1', 'obj_time_1']),
            now,
            now
          ]
        );

        await run(
          `INSERT OR IGNORE INTO funnel_versions (id, funnel_id, business_id, version_number, snapshot_json, created_by, change_summary, created_at)
           VALUES ('fver_1', 'pfunnel_default', 'biz_default', 1, '{}', 'Alex Morgan', 'Initial published VSL Profile Funnel compiled from Business DNA', ?)`,
          [now]
        );

        const dealSeeds = [
          {
            id: 'deal_1',
            leadId: 'lead_a',
            prospectId: 'prosp_1',
            dealName: 'SaaSify Inc — Growth OS Installation',
            contactName: 'Mark Vance',
            companyName: 'SaaSify Inc',
            contactEmail: 'mark@saasify.com',
            stage: 'PROPOSAL_SENT',
            amount: 12500,
            closeProbability: 75,
            priority: 'HIGH',
            founderAttentionRequired: 1,
            attentionReason: 'Proposal sent 3 days ago; client requested custom payment term review.',
            nextAction: 'Follow up on proposal terms',
            nextActionDueAt: new Date(Date.now() + 86400000).toISOString(),
            status: 'OPEN'
          },
          {
            id: 'deal_2',
            leadId: 'lead_b',
            prospectId: 'prosp_2',
            dealName: 'Apex Logistics — Growth OS Implementation',
            contactName: 'Sarah Jenkins',
            companyName: 'Apex Logistics',
            contactEmail: 'sarah@apexlogistics.com',
            stage: 'CALL_SCHEDULED',
            amount: 15000,
            closeProbability: 60,
            priority: 'HIGH',
            founderAttentionRequired: 1,
            attentionReason: 'Sales call scheduled today at 2:00 PM; review Closer Room prep sheet.',
            nextAction: 'Conduct Discovery Demo Call',
            nextActionDueAt: new Date().toISOString(),
            status: 'OPEN'
          },
          {
            id: 'deal_3',
            leadId: 'lead_c',
            prospectId: 'prosp_3',
            dealName: 'Vanguard B2B — Operating System Architecture',
            contactName: 'David Ross',
            companyName: 'Vanguard B2B',
            contactEmail: 'david@vanguardb2b.com',
            stage: 'CLOSED_WON',
            amount: 12500,
            closeProbability: 100,
            priority: 'MEDIUM',
            founderAttentionRequired: 0,
            attentionReason: 'Deal completed and onboarded cleanly.',
            nextAction: 'Execute Delivery OS Handoff',
            nextActionDueAt: new Date().toISOString(),
            status: 'WON',
            wonAt: new Date(Date.now() - 2 * 86400000).toISOString()
          }
        ];

        for (const d of dealSeeds) {
          await run(
            `INSERT OR IGNORE INTO deals (id, business_id, lead_id, prospect_id, deal_name, contact_name, company_name, contact_email, stage, amount, close_probability, priority, founder_attention_required, attention_reason, next_action, next_action_due_at, status, won_at, notes, created_at, updated_at)
             VALUES (?, 'biz_default', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', ?, ?)`,
            [d.id, d.leadId, d.prospectId, d.dealName, d.contactName, d.companyName, d.contactEmail, d.stage, d.amount, d.closeProbability, d.priority, d.founderAttentionRequired, d.attentionReason, d.nextAction, d.nextActionDueAt, d.status, d.wonAt || '', now, now]
          );
        }

        const patternSeeds = [
          {
            id: 'pat_1',
            patternType: 'MECHANISM_EXPLANATION',
            triggerPhrase: 'How is this different from hiring another agency retainer?',
            founderResponseTechnique: 'Frame retainer agencies as temporary labor rent vs ASENZO as internal capability building. Show FIS score progression from 30 to 85+.',
            effectivenessScore: 94
          },
          {
            id: 'pat_2',
            patternType: 'PRICING_ROI',
            triggerPhrase: 'Is $12,500 a high upfront investment for setup?',
            founderResponseTechnique: 'Compare $12,500 one-time installation against $6,000/mo recurring agency retainer cost ($72,000/yr). Demonstrates 4.8x ROI in 90 days.',
            effectivenessScore: 91
          },
          {
            id: 'pat_3',
            patternType: 'OBJECTION_REFRAMING',
            triggerPhrase: 'Will this require too much of my weekly founder time?',
            founderResponseTechnique: 'Show 90-day workload reduction curve: 60 hrs/wk -> 15 hrs/wk once Engines 1 & 2 operate.',
            effectivenessScore: 89
          }
        ];

        for (const p of patternSeeds) {
          await run(
            `INSERT OR IGNORE INTO founder_sales_patterns (id, business_id, pattern_type, trigger_phrase, founder_response_technique, effectiveness_score, sample_transcripts_json, updated_at)
             VALUES (?, 'biz_default', ?, ?, ?, ?, '[]', ?)`,
            [p.id, p.patternType, p.triggerPhrase, p.founderResponseTechnique, p.effectivenessScore, now]
          );
        }

        const objSeeds = [
          {
            id: 'obj_1',
            objectionText: 'We already have a retainer marketing agency.',
            category: 'COMPETITION',
            founderResponseScript: 'Agency retainers rent labor; they do not build internal capability. When you stop paying, marketing stops. Growth OS builds software & data assets you own forever.',
            winningAngle: 'Asset ownership vs labor dependency',
            frequencyCount: 14,
            successRate: 85
          },
          {
            id: 'obj_2',
            objectionText: 'The $12,500 setup price is higher than our budget.',
            category: 'PRICING',
            founderResponseScript: 'Compare one-time $12,500 installation to $6,000/mo agency retainer. In 3 months, Growth OS costs less than retainer services while giving you full autonomy.',
            winningAngle: 'Pay once for system installation vs perpetual retainer bleed',
            frequencyCount: 18,
            successRate: 82
          }
        ];

        for (const o of objSeeds) {
          await run(
            `INSERT OR IGNORE INTO objection_library (id, business_id, objection_text, category, founder_response_script, winning_angle, frequency_count, success_rate, created_at, updated_at)
             VALUES (?, 'biz_default', ?, ?, ?, ?, ?, ?, ?, ?)`,
            [o.id, o.objectionText, o.category, o.founderResponseScript, o.winningAngle, o.frequencyCount, o.successRate, now, now]
          );
        }

        resolve();
      } catch (err) {
        reject(err);
      }
    });
  });
}

const initDbPromise = initDb().catch(console.error);

module.exports = {
  db,
  run,
  get,
  all,
  logAudit,
  initDbPromise
};
