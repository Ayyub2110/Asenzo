'use strict';

// ══════════════════════════════════════════════════════════════
// ASENZO GROWTH OPERATING SYSTEM — CORE STATE ENGINE
// ══════════════════════════════════════════════════════════════

let CURRENT_PAGE = 'overview';
let CHART_TIMEFRAME = 'Monthly';
let ATTENTION_SUB_TAB = 'strategy'; // 'strategy', 'ideas', 'pipeline', 'attribution', 'knowledge', 'market', 'recommendations'

// Content Strategy & Idea Engine State
let CONTENT_PILLARS = [];
let CONTENT_IDEAS = [];
let IDEA_FILTERS = { q: '', status: '', priority: '', pillarId: '', source: '', sort: 'priority' };

// ── BUSINESS DNA & POSITIONING ──────────────────────────────────────────────
let POSITIONING = {
  icp: 'Bootstrapped B2B Founders doing $15k–$50k/mo',
  problem: 'Trapped in 60-hr workweeks serving as the single bottleneck for marketing & sales',
  result: 'Scale to $100k/mo while increasing Founder Independence Score from 30 to 85+',
  mechanism: 'The ASENZO 5-Engine Growth OS Framework',
  version: 1
};

// ── ENGINE DATA STORES ──────────────────────────────────────────────────────

// Engine 1 — Attention OS Data Stores
let CONTENT_ITEMS = [];
let KNOWLEDGE_ITEMS = [];
let MARKET_INTEL_ITEMS = [];
let AUTHORITY_ASSET_ITEMS = [];
let OUTREACH_PROSPECT_ITEMS = [];
let ATTENTION_ANALYTICS = null;
let AI_RECOMMENDATIONS = [];

// Script Generator Temporary State
let GENERATED_SCRIPT_DATA = null;
let SELECTED_HOOK_TEXT = '';

// Engine 2 — Conversion (CRM Pipeline Kanban & DM Triage)
let DEALS = [
  { id: 1, name: 'SaaSify Inc — Founder Mark', stage: 'Lead In', val: 12500, objection: 'Needs clarity on onboarding speed' },
  { id: 2, name: 'Vortex Media — Founder Sarah', stage: 'VSL Watched', val: 18000, objection: 'Reviewing budget with co-founder' },
  { id: 3, name: 'Apex Logistics — Founder Dave', stage: 'Call Booked', val: 24000, objection: 'Wants 1:1 strategy session' },
  { id: 4, name: 'Lumina Tech — Founder Elena', stage: 'Proposal Sent', val: 32000, objection: 'Finalizing payment link' },
  { id: 5, name: 'Nexus Growth — Founder Tom', stage: 'Closed Won', val: 15000, objection: 'None — Onboarded' }
];

let DM_INBOUNDS = [
  { id: 1, name: '@founder_alex', score: '94%', msg: 'Hey! Loved the post on FIS scores. How do I install this in my agency?', status: 'High Qualified' },
  { id: 2, name: '@agency_dan', score: '88%', msg: 'Can ASENZO replace our 3 marketing retainers?', status: 'Qualified' },
  { id: 3, name: '@ecom_john', score: '42%', msg: 'Do you sell a course on Facebook Ads?', status: 'Disqualified' }
];

// Engine 3 — Delivery (Client Milestones)
let CLIENTS = [
  { id: 1, name: 'Apex Logistics', progress: 85, status: 'On Track', milestone: 'Engine 3 Installed' },
  { id: 2, name: 'Nexus Growth', progress: 40, status: 'Needs Input', milestone: 'Positioning Intake' },
  { id: 3, name: 'Lumina Tech', progress: 95, status: 'On Track', milestone: 'Full OS Delegated' }
];

// Engine 4 — Intelligence (Directives & Revenue Leaks)
let DIRECTIVES = [
  { obs: 'Leak Detected in Conversion Stage 2', why: '34% of VSL watchers drop off before booking because qualification call length is unspecified.', act: 'Add 15-min explicit timer to Calendly embed', conf: '94% Confidence' },
  { obs: 'Attraction Engine Content Spike', why: 'Mechanism content pillar is outperforming general authority posts by 3.2x in qualified DM output.', act: 'Replicate Mechanism Script format 2x this week', conf: '89% Confidence' },
  { obs: 'Founder Capability Threshold Reached', why: 'DM Triage SOP has executed 50 times with 98% accuracy. Ready to delegate to assistant.', act: 'Generate Hiring Brief for Freelance Growth Assistant', conf: '96% Confidence' }
];

// Engine 5 — Operator (SOPs & Playbooks)
let SOPS = [
  { id: 1, title: 'DM Triage & ICP Qualification SOP', engine: 'Conversion', steps: ['Audit ICP score in DM Inbox', 'Apply Story Sequence trigger script', 'Route qualified lead to Calendly'] },
  { id: 2, title: 'Content Scripting & Pillar Audit SOP', engine: 'Attention', steps: ['Review Business DNA mechanism statement', 'Draft 3 hooks matching ICP pain', 'Publish to Content Kanban'] },
  { id: 3, title: 'Client Automated Onboarding SOP', engine: 'Delivery', steps: ['Send Welcome Brief within 5 mins', 'Trigger Business DNA intake form', 'Schedule Strategy Session'] }
];

// Growth Calendar Events
let CALENDAR_EVENTS = [
  { day: 'MON', date: '13', events: [
    { time: '09:00', text: 'Weekly Growth Directive Audit', type: 'grey' },
    { time: '14:00', text: 'Discovery Call — SaaSify Inc', type: 'green' }
  ]},
  { day: 'TUE', date: '14', events: [
    { time: '11:30', text: 'Content Scripting Sprint', type: 'yellow' },
    { time: '15:00', text: 'Onboarding Session — Nexus Growth', type: 'orange' }
  ]},
  { day: 'WED', date: '15', events: [
    { time: '10:00', text: 'Sales Call — Apex Logistics', type: 'green' },
    { time: '14:30', text: 'VSL Script Optimization', type: 'yellow' }
  ]},
  { day: 'THU', date: '16', events: [
    { time: '09:00', text: 'Discovery Call — Lumina Tech', type: 'green' },
    { time: '16:00', text: 'SOP Delegation Review', type: 'grey' }
  ]},
  { day: 'FRI', date: '17', events: [
    { time: '10:30', text: 'Client Check-in & Review', type: 'orange' },
    { time: '15:30', text: 'Weekly FIS Score Calculation', type: 'grey' }
  ]},
  { day: 'SAT', date: '18', events: [
    { time: '11:00', text: 'Market Intel Audit', type: 'yellow' }
  ]},
  { day: 'SUN', date: '19', events: [] }
];

// ── INITIALIZATION & DATA SYNC ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initAppData();
  seedChat();

  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openPalette();
    }
    if (e.key === 'Escape') {
      closePalette();
      closePanel();
      closePositioningModal();
      closeDealModal();
      closeSopModal();
      closeEventModal();
      closeScriptGeneratorModal();
      closeProductionWorkspaceModal();
      closeKnowledgeModal();
      closeMarketIntelModal();
    }
  });
});

async function initAppData() {
  try {
    if (window.ASENZO_API) {
      const dnaData = await window.ASENZO_API.getPositioning();
      if (dnaData && dnaData.positioning) {
        POSITIONING = dnaData.positioning;
        POSITIONING_SUITE_DATA = dnaData;
      }

      CONTENT_ITEMS = await window.ASENZO_API.getContents();
      KNOWLEDGE_ITEMS = await window.ASENZO_API.getKnowledgeSources();
      MARKET_INTEL_ITEMS = await window.ASENZO_API.getMarketIntel();
      ATTENTION_ANALYTICS = await window.ASENZO_API.getAnalytics();
      AI_RECOMMENDATIONS = await window.ASENZO_API.getRecommendations();
    }
  } catch (err) {
    console.warn('Backend API connection warning (using offline state):', err.message);
  } finally {
    renderOverview();
  }
}

// ── ROUTER & PAGE NAVIGATION ────────────────────────────────────────────────
function go(page, el) {
  CURRENT_PAGE = page;
  document.querySelectorAll('.sb-item').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');

  const pageTitles = {
    overview: 'ASENZO Overview — Founder Growth OS',
    attention: 'Engine 1 — Attention OS (Growth Marketing)',
    conversion: 'Engine 2 — Conversion OS (Sales & Pipeline)',
    delivery: 'Engine 3 — Delivery OS (Client Success & Milestones)',
    intelligence: 'Engine 4 — Intelligence OS (Decisions & Leaks)',
    operator: 'Engine 5 — Operator OS (Capability & SOPs)',
    calendar: 'Growth Schedule & Calendar'
  };

  document.getElementById('topbar-title').textContent = pageTitles[page] || 'Overview Dashboard';

  const renderMap = {
    overview: renderOverview,
    attention: renderAttention,
    conversion: renderConversion,
    delivery: renderDelivery,
    intelligence: renderIntelligence,
    operator: renderOperator,
    calendar: renderCalendar
  };

  (renderMap[page] || renderOverview)();
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('collapsed');
}

// ── 1. RENDER OVERVIEW (FOUNDER COMMAND DASHBOARD) ────────────────────────
function renderOverview() {
  const ca = document.getElementById('content-area');
  ca.innerHTML = `
    <!-- Header -->
    <div class="pg-header">
      <div>
        <h1 class="pg-title">Founder Growth Command</h1>
        <p class="pg-sub">Operating infrastructure active. Business is 84% founder-independent.</p>
      </div>
      <div class="pg-actions">
        <button class="btn btn-secondary" onclick="openPositioningModal()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          Business DNA
        </button>
        <button class="btn btn-primary" onclick="openPanel()">
          ⚡ Run Intelligence Audit
        </button>
      </div>
    </div>

    <!-- 4 Stat Cards Row -->
    <div class="stat-grid">
      <div class="stat-card">
        <div class="sc-top">
          <div class="sc-icon-box green"><span>🎯</span></div>
          <span class="sc-delta-pill">84 / 100 ↗</span>
        </div>
        <div class="sc-main">
          <div class="sc-label">Founder Independence Score</div>
          <div class="sc-value">High System</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="sc-top">
          <div class="sc-icon-box purple"><span>💰</span></div>
          <span class="sc-delta-pill">+18.4% ↗</span>
        </div>
        <div class="sc-main">
          <div class="sc-label">Pipeline Contract Value</div>
          <div class="sc-value">$101,500</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="sc-top">
          <div class="sc-icon-box orange"><span>⚡</span></div>
          <span class="sc-delta-pill">94% Match</span>
        </div>
        <div class="sc-main">
          <div class="sc-label">DM ICP Triage Accuracy</div>
          <div class="sc-value">24 Leads</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="sc-top">
          <div class="sc-icon-box cyan"><span>📚</span></div>
          <span class="sc-delta-pill">3 Published</span>
        </div>
        <div class="sc-main">
          <div class="sc-label">Operator SOP Capability</div>
          <div class="sc-value">12 Playbooks</div>
        </div>
      </div>
    </div>

    <!-- ASENZO Loop Visualization Strip -->
    <div style="margin-top:10px">
      <div style="font-size:12px;font-weight:700;color:#64748B;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px">The ASENZO Compounding Loop</div>
      <div class="loop-strip">
        <div class="loop-step active" onclick="go('attention', document.getElementById('nav-attention'))">
          <span>1. Acquire</span>
        </div>
        <span class="loop-arrow">→</span>
        <div class="loop-step active" onclick="go('conversion', document.getElementById('nav-conversion'))">
          <span>2. Convert</span>
        </div>
        <span class="loop-arrow">→</span>
        <div class="loop-step active" onclick="go('delivery', document.getElementById('nav-delivery'))">
          <span>3. Deliver</span>
        </div>
        <span class="loop-arrow">→</span>
        <div class="loop-step active" onclick="go('intelligence', document.getElementById('nav-intelligence'))">
          <span>4. Retain & Expand</span>
        </div>
        <span class="loop-arrow">→</span>
        <div class="loop-step active" onclick="go('operator', document.getElementById('nav-operator'))">
          <span>5. Optimize & Compound</span>
        </div>
      </div>
    </div>

    <!-- Dual Dashboard Grid: Revenue Line Chart + Engine Distribution Donut -->
    <div class="dashboard-grid">
      
      <!-- Growth Performance Chart Card -->
      <div class="dash-card">
        <div class="dash-card-header">
          <div>
            <div class="dash-card-title">Growth & Revenue Trajectory</div>
            <div class="dash-card-sub">Compounding revenue vs founder time invested</div>
          </div>
          <div class="time-pills">
            <div class="time-pill ${CHART_TIMEFRAME==='Daily'?'active':''}" onclick="setChartTimeframe('Daily')">Daily</div>
            <div class="time-pill ${CHART_TIMEFRAME==='Weekly'?'active':''}" onclick="setChartTimeframe('Weekly')">Weekly</div>
            <div class="time-pill ${CHART_TIMEFRAME==='Monthly'?'active':''}" onclick="setChartTimeframe('Monthly')">Monthly</div>
          </div>
        </div>
        <div class="chart-container" id="performance-chart-wrap">
          ${renderSVGLineChart(CHART_TIMEFRAME)}
        </div>
      </div>

      <!-- Engine Health Donut Chart Card -->
      <div class="dash-card">
        <div class="dash-card-header">
          <div class="dash-card-title">Engine Health Breakdown</div>
        </div>
        
        <div class="donut-container">
          <div class="donut-svg-wrap">
            ${renderSVGDonutChart()}
            <div class="donut-center-text">
              <div class="donut-center-val">92%</div>
              <div class="donut-center-lbl">Overall Health</div>
            </div>
          </div>

          <div class="legend-list">
            ${[
              { name: 'Attention Engine', pct: '95%', val: 'Optimal', color: 'stocks' },
              { name: 'Conversion Engine', pct: '88%', val: 'Healthy', color: 'crypto' },
              { name: 'Delivery Engine', pct: '92%', val: 'Optimal', color: 'cash' },
              { name: 'Operator Capability', pct: '94%', val: 'Systemized', color: 'realestate' }
            ].map(a => `
              <div class="legend-item">
                <div class="legend-left">
                  <div class="legend-dot ${a.color}"></div>
                  <span class="legend-name">${a.name}</span>
                </div>
                <div>
                  <span class="legend-pct">${a.pct}</span>
                  <span class="legend-val" style="margin-left:8px">${a.val}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

    </div>
  `;
}

// ── 2. ENGINE 1 — ATTENTION OS (PRODUCTION ENGINE) ────────────────────────
async function renderAttention() {
  // Sync fresh data from API if available
  if (window.ASENZO_API) {
    try {
      CONTENT_ITEMS = await window.ASENZO_API.getContentItems();
      ATTENTION_ANALYTICS = await window.ASENZO_API.getAnalytics();
      KNOWLEDGE_ITEMS = await window.ASENZO_API.getKnowledge();
      MARKET_INTEL_ITEMS = await window.ASENZO_API.getMarketIntel();
      AUTHORITY_ASSET_ITEMS = await window.ASENZO_API.getAuthorityAssets();
      OUTREACH_PROSPECT_ITEMS = await window.ASENZO_API.getOutreachProspects();
      AI_RECOMMENDATIONS = await window.ASENZO_API.getRecommendations();
      CONTENT_PILLARS = await window.ASENZO_API.getPillars();
      CONTENT_IDEAS = await window.ASENZO_API.getIdeas({ sort: IDEA_FILTERS.sort });
    } catch (e) {
      console.warn('API sync warning:', e.message);
    }
  }

  const ca = document.getElementById('content-area');
  ca.innerHTML = `
    <!-- Header -->
    <div class="pg-header">
      <div>
        <h1 class="pg-title">Engine 1 — Attention OS (Growth Marketing)</h1>
        <p class="pg-sub">Generate qualified attention consistently through authority positioning, content pipeline & feedback loops.</p>
      </div>
      <div class="pg-actions">
        <button class="btn btn-secondary" onclick="openPositioningModal()">Edit Business DNA</button>
        <button class="btn btn-primary" onclick="openScriptGeneratorModal()">⚡ AI Hook + Script Generator</button>
      </div>
    </div>

    <!-- Engine 1 Sub-System Tab Bar -->
    <div class="engine-tab-bar" style="overflow-x:auto">
      <div class="engine-tab ${ATTENTION_SUB_TAB === 'strategy' ? 'active' : ''}" onclick="switchAttentionTab('strategy')">
        🎯 Content Strategy (${CONTENT_PILLARS.length})
      </div>
      <div class="engine-tab ${ATTENTION_SUB_TAB === 'ideas' ? 'active' : ''}" onclick="switchAttentionTab('ideas')">
        💡 Content Ideas (${CONTENT_IDEAS.length})
      </div>
      <div class="engine-tab ${ATTENTION_SUB_TAB === 'pipeline' ? 'active' : ''}" onclick="switchAttentionTab('pipeline')">
        📋 Content Pipeline & Workspace (${CONTENT_ITEMS.length})
      </div>
      <div class="engine-tab ${ATTENTION_SUB_TAB === 'authority' ? 'active' : ''}" onclick="switchAttentionTab('authority')">
        🏆 Authority Proof Library (${AUTHORITY_ASSET_ITEMS.length})
      </div>
      <div class="engine-tab ${ATTENTION_SUB_TAB === 'market' ? 'active' : ''}" onclick="switchAttentionTab('market')">
        📡 Market Intelligence Radar (${MARKET_INTEL_ITEMS.length})
      </div>
      <div class="engine-tab ${ATTENTION_SUB_TAB === 'outreach' ? 'active' : ''}" onclick="switchAttentionTab('outreach')">
        💬 Outreach Tracker (${OUTREACH_PROSPECT_ITEMS.length})
      </div>
      <div class="engine-tab ${ATTENTION_SUB_TAB === 'attribution' ? 'active' : ''}" onclick="switchAttentionTab('attribution')">
        📈 Attribution Funnel & Analytics
      </div>
      <div class="engine-tab ${ATTENTION_SUB_TAB === 'knowledge' ? 'active' : ''}" onclick="switchAttentionTab('knowledge')">
        📚 Founder Voice & Vault (${KNOWLEDGE_ITEMS.length})
      </div>
      <div class="engine-tab ${ATTENTION_SUB_TAB === 'recommendations' ? 'active' : ''}" onclick="switchAttentionTab('recommendations')">
        ⚡ AI Recommendations (${AI_RECOMMENDATIONS.filter(r => r.status === 'pending').length})
      </div>
    </div>

    <!-- Sub-tab Body Container -->
    <div id="attention-tab-content">
      ${renderAttentionSubTabContent()}
    </div>
  `;
}

function switchAttentionTab(tab) {
  ATTENTION_SUB_TAB = tab;
  renderAttention();
}

function renderAttentionSubTabContent() {
  if (ATTENTION_SUB_TAB === 'strategy') {
    return renderContentStrategyTab();
  } else if (ATTENTION_SUB_TAB === 'ideas') {
    return renderContentIdeasTab();
  } else if (ATTENTION_SUB_TAB === 'authority') {
    return renderAuthorityTab();
  } else if (ATTENTION_SUB_TAB === 'market') {
    return renderMarketIntelTab();
  } else if (ATTENTION_SUB_TAB === 'outreach') {
    return renderOutreachTab();
  } else if (ATTENTION_SUB_TAB === 'attribution') {
    return renderAttributionTab();
  } else if (ATTENTION_SUB_TAB === 'knowledge') {
    return renderKnowledgeTab();
  } else if (ATTENTION_SUB_TAB === 'recommendations') {
    return renderRecommendationsTab();
  } else {
    return renderPipelineTab();
  }
}

// ── ATTENTION SUB-TAB 0: CONTENT STRATEGY (PILLARS) ─────────────────────────
function renderContentStrategyTab() {
  const active = CONTENT_PILLARS.filter(p => p.status !== 'ARCHIVED');
  const totalPct = active.reduce((s, p) => s + (Number(p.target_percentage) || 0), 0);

  return `
    <div class="dash-card" style="background:linear-gradient(135deg,#0F172A 0%,#1E293B 100%);color:#FFF">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-size:11px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:0.5px">Content Strategy Engine</div>
          <div style="font-size:16px;font-weight:800;color:#F8FAFC;margin-top:2px">${active.length} Active Pillars • ${totalPct}% Target Mix Allocated</div>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-primary btn-sm" onclick="openPillarModal()">+ New Pillar</button>
          <button class="btn btn-secondary btn-sm" style="background:rgba(255,255,255,0.1);color:#FFF;border-color:rgba(255,255,255,0.2)" onclick="go('ideas', document.getElementById('nav-attention'))">💡 Open Idea Engine</button>
        </div>
      </div>
      <p style="font-size:12px;color:#CBD5E1;margin-top:6px">Each pillar is a strategic lane with its own audience, pain, objective and proof of success. Ideas inherit these pillars as their strategic home.</p>
    </div>

    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-top:14px">
      ${active.length === 0 ? `<div class="dash-card" style="grid-column:span 2;text-align:center;color:#94A3B8;padding:30px">No content pillars yet. Click "+ New Pillar" to define your first strategic lane.</div>` : ''}
      ${active.map((p, i) => `
        <div class="dash-card" style="border-top:3px solid ${['#8B5CF6','#10B981','#F97316','#06B6D4'][i % 4]}">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div style="font-size:15px;font-weight:800;color:#0F172A">${p.name}</div>
            <div style="display:flex;gap:6px">
              <span class="sb-badge green" style="font-size:9px">${p.pillar_type || 'CUSTOM'}</span>
              <span class="sb-badge" style="background:#E2E8F0;color:#334155;font-size:9px">${p.target_percentage || 0}% Mix</span>
            </div>
          </div>
          <div style="font-size:12px;color:#64748B;margin-top:6px;line-height:1.45">${p.description || 'No description set.'}</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px">
            <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:8px 10px">
              <div style="font-size:10px;font-weight:700;color:#64748B">TARGET AUDIENCE</div>
              <div style="font-size:11.5px;font-weight:600;color:#0F172A;margin-top:2px">${p.target_audience || '—'}</div>
            </div>
            <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:8px 10px">
              <div style="font-size:10px;font-weight:700;color:#64748B">ASSOCIATED PAIN</div>
              <div style="font-size:11.5px;font-weight:600;color:#0F172A;margin-top:2px">${p.pain || '—'}</div>
            </div>
            <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:8px 10px">
              <div style="font-size:10px;font-weight:700;color:#64748B">OBJECTIVE</div>
              <div style="font-size:11.5px;font-weight:600;color:#0F172A;margin-top:2px">${p.objective || '—'}</div>
            </div>
            <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:8px 10px">
              <div style="font-size:10px;font-weight:700;color:#64748B">DESIRED RESULT</div>
              <div style="font-size:11.5px;font-weight:600;color:#0F172A;margin-top:2px">${p.desired_result || '—'}</div>
            </div>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:10px">
            ${(p.contentFormats || []).map(f => `<span style="font-size:10px;font-weight:600;background:#EFF6FF;color:#1D4ED8;padding:2px 8px;border-radius:10px">${f}</span>`).join('')}
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">
            ${(p.supportedPlatforms || []).map(pl => `<span style="font-size:10px;font-weight:600;background:#F0FDF4;color:#047857;padding:2px 8px;border-radius:10px">${pl.replace(/_/g,' ')}</span>`).join('')}
          </div>
          <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:10px;padding-top:8px;border-top:1px solid #F1F5F9">
            <button class="btn btn-secondary btn-sm" onclick="openPillarModal('${p.id}')">✏️ Edit</button>
            <button class="btn btn-secondary btn-sm" style="color:#EF4444;border-color:#FCA5A5" onclick="handleArchivePillar('${p.id}')">🗑 Archive</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// ── ATTENTION SUB-TAB 1: CONTENT IDEA ENGINE ────────────────────────────────
function renderContentIdeasTab() {
  let ideas = CONTENT_IDEAS.slice();
  const f = IDEA_FILTERS;

  if (f.q) {
    const q = f.q.toLowerCase();
    ideas = ideas.filter(i => (i.title + ' ' + (i.premise || '') + ' ' + (i.pain || '')).toLowerCase().includes(q));
  }
  if (f.status) ideas = ideas.filter(i => i.status === f.status);
  if (f.priority) ideas = ideas.filter(i => i.priority === f.priority);
  if (f.source) ideas = ideas.filter(i => i.source === f.source);
  if (f.pillarId) ideas = ideas.filter(i => String(i.pillar_id) === String(f.pillarId));

  const high = ideas.filter(i => i.priority === 'HIGH').length;
  const med = ideas.filter(i => i.priority === 'MEDIUM').length;

  return `
    <!-- Idea Engine Header Card -->
    <div class="dash-card" style="background:linear-gradient(135deg,#0F172A 0%,#1E293B 100%);color:#FFF">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-size:11px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:0.5px">Content Idea Engine</div>
          <div style="font-size:16px;font-weight:800;color:#F8FAFC;margin-top:2px">${ideas.length} Ideas • ${high} High Priority • ${med} Medium Priority</div>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-secondary btn-sm" style="background:rgba(255,255,255,0.1);color:#FFF;border-color:rgba(255,255,255,0.2)" onclick="openIdeaGeneratorModal()">⚡ AI Generate</button>
          <button class="btn btn-primary btn-sm" onclick="openIdeaModal()">+ New Idea</button>
        </div>
      </div>
      <p style="font-size:12px;color:#CBD5E1;margin-top:6px">Ideas are scored against your Business DNA (ICP relevance, pain intensity, novelty, authority, proof, commercial relevance, founder expertise), prioritized, then converted into pipeline content.</p>
    </div>

    <!-- Filter Bar -->
    <div style="display:flex;gap:10px;align-items:center;margin-top:14px;flex-wrap:wrap">
      <input id="idea-search-input" value="${f.q}" placeholder="🔍 Search ideas, premises, pains..." style="padding:9px 14px;border-radius:8px;border:1px solid #CBD5E1;font:inherit;font-size:12.5px;flex:1;min-width:220px" oninput="setIdeaFilter('q', this.value)" />
      <select style="padding:9px 12px;border-radius:8px;border:1px solid #CBD5E1;font:inherit;font-size:12.5px" onchange="setIdeaFilter('status', this.value)">
        <option value="">All Statuses</option>
        ${['NEW','PRIORITIZED','PLANNED','IN_PRODUCTION','PUBLISHED','CONVERTED'].map(s => `<option value="${s}" ${f.status === s ? 'selected' : ''}>${s.replace(/_/g,' ')}</option>`).join('')}
      </select>
      <select style="padding:9px 12px;border-radius:8px;border:1px solid #CBD5E1;font:inherit;font-size:12.5px" onchange="setIdeaFilter('priority', this.value)">
        <option value="">All Priorities</option>
        ${['HIGH','MEDIUM','LOW'].map(p => `<option value="${p}" ${f.priority === p ? 'selected' : ''}>${p}</option>`).join('')}
      </select>
      <select style="padding:9px 12px;border-radius:8px;border:1px solid #CBD5E1;font:inherit;font-size:12.5px" onchange="setIdeaFilter('source', this.value)">
        <option value="">All Sources</option>
        ${['MANUAL','AI_GENERATED','CUSTOMER_QUESTION','OBJECTION','SALES_CONVERSATION','CASE_STUDY','MARKET_INTEL','SUCCESSFUL_CONTENT'].map(s => `<option value="${s}" ${f.source === s ? 'selected' : ''}>${s.replace(/_/g,' ')}</option>`).join('')}
      </select>
      <select style="padding:9px 12px;border-radius:8px;border:1px solid #CBD5E1;font:inherit;font-size:12.5px" onchange="setIdeaFilter('pillarId', this.value)">
        <option value="">All Pillars</option>
        ${CONTENT_PILLARS.filter(p => p.status !== 'ARCHIVED').map(p => `<option value="${p.id}" ${f.pillarId === p.id ? 'selected' : ''}>${p.name}</option>`).join('')}
      </select>
      <select style="padding:9px 12px;border-radius:8px;border:1px solid #CBD5E1;font:inherit;font-size:12.5px" onchange="setIdeaFilter('sort', this.value)">
        <option value="priority" ${f.sort === 'priority' ? 'selected' : ''}>Sort: Priority</option>
        <option value="score_desc" ${f.sort === 'score_desc' ? 'selected' : ''}>Sort: Score ↓</option>
        <option value="score_asc" ${f.sort === 'score_asc' ? 'selected' : ''}>Sort: Score ↑</option>
        <option value="newest" ${f.sort === 'newest' ? 'selected' : ''}>Sort: Newest</option>
      </select>
    </div>

    <!-- Ideas Grid -->
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-top:14px">
      ${ideas.length === 0 ? `<div class="dash-card" style="grid-column:span 2;text-align:center;color:#94A3B8;padding:30px">No ideas match. Try "⚡ AI Generate" or clear filters.</div>` : ''}
      ${ideas.map(i => `
        <div class="dash-card" style="border-left:4px solid ${i.priority === 'HIGH' ? '#10B981' : i.priority === 'MEDIUM' ? '#F97316' : '#94A3B8'}">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
            <div style="font-size:13.5px;font-weight:800;color:#0F172A;line-height:1.35">${i.title}</div>
            <div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0">
              <div style="width:40px;height:40px;border-radius:50%;background:${i.score >= 80 ? '#10B981' : i.score >= 60 ? '#F97316' : '#E2E8F0'};color:#FFF;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px">${i.score || '–'}</div>
              <span style="font-size:9px;font-weight:700;color:#64748B;margin-top:2px">${i.priority || 'LOW'}</span>
            </div>
          </div>
          <div style="font-size:12px;color:#475569;line-height:1.45;margin-top:6px">${(i.premise || '').substring(0, 150)}${(i.premise || '').length > 150 ? '…' : ''}</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">
            <span class="sb-badge" style="background:#EFF6FF;color:#1D4ED8">${i.pillar_id ? (CONTENT_PILLARS.find(p => p.id === i.pillar_id)?.name || 'Pillar') : 'Unassigned'}</span>
            <span class="sb-badge" style="background:#F5F3FF;color:#6D28D9">${(i.content_format || 'POST').replace(/_/g,' ')}</span>
            <span class="sb-badge" style="background:#ECFDF5;color:#047857">${(i.platform || 'LINKEDIN').replace(/_/g,' ')}</span>
            <span class="sb-badge" style="background:#FFF7ED;color:#9A3412">${(i.source || 'MANUAL').replace(/_/g,' ')}</span>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
            <span style="font-size:10.5px;font-weight:700;color:${i.status === 'CONVERTED' ? '#047857' : '#64748B'}">● ${(i.status || 'NEW').replace(/_/g,' ')}</span>
            <div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end">
              <button class="btn btn-secondary btn-sm" onclick="handleScoreIdea('${i.id}')">🔢 Re-score</button>
              <button class="btn btn-secondary btn-sm" onclick="handleCheckIdeaDuplicate('${i.id}')">🔍 Dup Check</button>
              <button class="btn btn-secondary btn-sm" onclick="openIdeaModal('${i.id}')">✏️ Edit</button>
              <button class="btn btn-primary btn-sm" onclick="handleConvertIdea('${i.id}')">➡️ Convert</button>
              <button class="btn btn-secondary btn-sm" style="color:#EF4444;border-color:#FCA5A5" onclick="handleArchiveIdea('${i.id}')">🗑 Archive</button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// ── CONTENT STRATEGY — PILLAR MODAL LOGIC ───────────────────────────────────
function openPillarModal(id) {
  document.getElementById('pillar-modal-title').textContent = id ? 'Edit Content Pillar' : 'Create Content Pillar';
  document.getElementById('pillar-id').value = id || '';
  document.getElementById('pillar-name').value = '';
  document.getElementById('pillar-status').value = 'ACTIVE';
  document.getElementById('pillar-description').value = '';
  document.getElementById('pillar-audience').value = '';
  document.getElementById('pillar-objective').value = '';
  document.getElementById('pillar-pain').value = '';
  document.getElementById('pillar-result').value = '';
  document.getElementById('pillar-formats').value = '';
  document.getElementById('pillar-platforms').value = '';
  document.getElementById('pillar-pct').value = 20;

  if (id) {
    const p = CONTENT_PILLARS.find(x => String(x.id) === String(id));
    if (p) {
      document.getElementById('pillar-name').value = p.name;
      document.getElementById('pillar-status').value = p.status || 'ACTIVE';
      document.getElementById('pillar-description').value = p.description || '';
      document.getElementById('pillar-audience').value = p.target_audience || '';
      document.getElementById('pillar-objective').value = p.objective || '';
      document.getElementById('pillar-pain').value = p.pain || '';
      document.getElementById('pillar-result').value = p.desired_result || '';
      document.getElementById('pillar-formats').value = (p.contentFormats || []).join(', ');
      document.getElementById('pillar-platforms').value = (p.supportedPlatforms || []).join(', ');
      document.getElementById('pillar-pct').value = p.target_percentage || 20;
    }
  }
  document.getElementById('pillar-modal').classList.remove('hidden');
}

function closePillarModal() {
  document.getElementById('pillar-modal').classList.add('hidden');
}

async function handleSavePillar(e) {
  e.preventDefault();
  const id = document.getElementById('pillar-id').value;
  const payload = {
    name: document.getElementById('pillar-name').value.trim(),
    status: document.getElementById('pillar-status').value,
    description: document.getElementById('pillar-description').value.trim(),
    targetAudience: document.getElementById('pillar-audience').value.trim(),
    objective: document.getElementById('pillar-objective').value.trim(),
    pain: document.getElementById('pillar-pain').value.trim(),
    desiredResult: document.getElementById('pillar-result').value.trim(),
    contentFormats: document.getElementById('pillar-formats').value.split(',').map(s => s.trim()).filter(Boolean),
    supportedPlatforms: document.getElementById('pillar-platforms').value.split(',').map(s => s.trim().replace(/\s*\/\s*|\s+/, '_').toUpperCase()).filter(Boolean),
    targetPercentage: Number(document.getElementById('pillar-pct').value) || 20
  };

  try {
    let saved;
    if (id) {
      saved = await window.ASENZO_API.updatePillar(id, payload);
    } else {
      saved = await window.ASENZO_API.createPillar(payload);
    }
    const idx = CONTENT_PILLARS.findIndex(p => String(p.id) === String(saved.id));
    if (idx !== -1) CONTENT_PILLARS[idx] = saved; else CONTENT_PILLARS.push(saved);
    closePillarModal();
    showToast(id ? 'Pillar updated' : 'Pillar created');
    if (CURRENT_PAGE === 'attention') renderAttention();
  } catch (err) {
    showToast(`Pillar Error: ${err.message}`);
  }
}

async function handleArchivePillar(id) {
  if (!confirm('Archive this content pillar?')) return;
  try {
    await window.ASENZO_API.archivePillar(id);
    showToast('Pillar archived');
    if (CURRENT_PAGE === 'attention') renderAttention();
  } catch (err) {
    showToast(`Archive Error: ${err.message}`);
  }
}

// ── CONTENT IDEA ENGINE — MODAL LOGIC ───────────────────────────────────────
function populatePillarSelects() {
  const opts = CONTENT_PILLARS.filter(p => p.status !== 'ARCHIVED').map(p => `<option value="${p.id}">${p.name}</option>`).join('');
  const sel1 = document.getElementById('idea-pillar');
  const sel2 = document.getElementById('gen-idea-pillar');
  if (sel1) sel1.innerHTML = `<option value="">— Unassigned —</option>` + opts;
  if (sel2) sel2.innerHTML = `<option value="">All Active Pillars</option>` + opts;
}

function openIdeaModal(id) {
  populatePillarSelects();
  document.getElementById('idea-modal-title').textContent = id ? 'Edit Content Idea' : 'New Content Idea';
  document.getElementById('idea-id').value = id || '';
  document.getElementById('idea-title').value = '';
  document.getElementById('idea-premise').value = '';
  document.getElementById('idea-pillar').value = '';
  document.getElementById('idea-source').value = 'MANUAL';
  document.getElementById('idea-icp').value = POSITIONING.icp_summary || POSITIONING.icp || '';
  document.getElementById('idea-pain').value = '';
  document.getElementById('idea-result').value = '';
  document.getElementById('idea-objective').value = '';
  document.getElementById('idea-format').value = 'POST';
  document.getElementById('idea-platform').value = 'LINKEDIN';
  document.getElementById('idea-status').value = 'NEW';
  document.getElementById('idea-cta').value = '';
  document.getElementById('idea-notes').value = '';
  document.getElementById('idea-duplicate-warning').classList.add('hidden');
  document.getElementById('idea-delete-btn').style.display = 'none';

  if (id) {
    const i = CONTENT_IDEAS.find(x => String(x.id) === String(id));
    if (i) {
      document.getElementById('idea-title').value = i.title;
      document.getElementById('idea-premise').value = i.premise || '';
      document.getElementById('idea-pillar').value = i.pillar_id || '';
      document.getElementById('idea-source').value = i.source || 'MANUAL';
      document.getElementById('idea-icp').value = i.icp || '';
      document.getElementById('idea-pain').value = i.pain || '';
      document.getElementById('idea-result').value = i.desired_result || '';
      document.getElementById('idea-objective').value = i.objective || '';
      document.getElementById('idea-format').value = i.content_format || 'POST';
      document.getElementById('idea-platform').value = i.platform || 'LINKEDIN';
      document.getElementById('idea-status').value = i.status || 'NEW';
      document.getElementById('idea-cta').value = i.cta || '';
      document.getElementById('idea-notes').value = i.notes || '';
      document.getElementById('idea-delete-btn').style.display = 'inline-flex';
    }
  }
  document.getElementById('idea-modal').classList.remove('hidden');
}

function closeIdeaModal() {
  document.getElementById('idea-modal').classList.add('hidden');
}

async function handleSaveIdea(e) {
  e.preventDefault();
  const id = document.getElementById('idea-id').value;
  const payload = {
    title: document.getElementById('idea-title').value.trim(),
    premise: document.getElementById('idea-premise').value.trim(),
    pillarId: document.getElementById('idea-pillar').value || null,
    source: document.getElementById('idea-source').value,
    icp: document.getElementById('idea-icp').value.trim(),
    pain: document.getElementById('idea-pain').value.trim(),
    desiredResult: document.getElementById('idea-result').value.trim(),
    objective: document.getElementById('idea-objective').value.trim(),
    contentFormat: document.getElementById('idea-format').value,
    platform: document.getElementById('idea-platform').value,
    status: document.getElementById('idea-status').value,
    cta: document.getElementById('idea-cta').value.trim(),
    notes: document.getElementById('idea-notes').value.trim(),
    reScore: true
  };

  try {
    if (window.ASENZO_API) {
      let saved;
      if (id) {
        saved = await window.ASENZO_API.updateIdea(id, payload);
      } else {
        saved = await window.ASENZO_API.createIdea(payload);
      }
      const idx = CONTENT_IDEAS.findIndex(x => String(x.id) === String(saved.id));
      if (idx !== -1) CONTENT_IDEAS[idx] = saved; else CONTENT_IDEAS.push(saved);
    }
    closeIdeaModal();
    showToast(id ? 'Idea updated & re-scored' : 'Idea created & scored');
    if (CURRENT_PAGE === 'attention') renderAttention();
  } catch (err) {
    showToast(`Idea Error: ${err.message}`);
  }
}

async function handleDeleteIdea() {
  const id = document.getElementById('idea-id').value;
  if (!id) return;
  if (!confirm('Delete this idea?')) return;
  try {
    await window.ASENZO_API.deleteIdea(id);
    CONTENT_IDEAS = CONTENT_IDEAS.filter(x => String(x.id) !== String(id));
    closeIdeaModal();
    showToast('Idea deleted');
    if (CURRENT_PAGE === 'attention') renderAttention();
  } catch (err) {
    showToast(`Delete Error: ${err.message}`);
  }
}

async function handleScoreIdea(id) {
  try {
    const res = await window.ASENZO_API.scoreIdea(id);
    const idx = CONTENT_IDEAS.findIndex(x => String(x.id) === String(id));
    if (idx !== -1) CONTENT_IDEAS[idx] = res;
    showToast(`Re-scored: ${res.score}/100 (${res.priority})`);
    if (CURRENT_PAGE === 'attention') renderAttention();
  } catch (err) {
    showToast(`Score Error: ${err.message}`);
  }
}

async function handleCheckIdeaDuplicate(id) {
  const idea = CONTENT_IDEAS.find(x => String(x.id) === String(id));
  if (!idea) return;
  try {
    const res = await window.ASENZO_API.checkIdeaDuplicate({ title: idea.title, premise: idea.premise || '', excludeId: id });
    if (res.isDuplicate) {
      showToast(`⚠️ Duplicate! ${res.matches.length} similar item(s) in pipeline`);
    } else {
      showToast('✅ No duplicates detected');
    }
  } catch (err) {
    showToast(`Dup Check Error: ${err.message}`);
  }
}

async function handleConvertIdea(id) {
  const idea = CONTENT_IDEAS.find(x => String(x.id) === String(id));
  if (!idea) return;
  if (!confirm(`Convert idea "${idea.title}" into a Content Pipeline asset?`)) return;
  try {
    const res = await window.ASENZO_API.convertIdeaToContent(id, { platform: idea.platform || 'LINKEDIN' });
    const idx = CONTENT_IDEAS.findIndex(x => String(x.id) === String(id));
    if (idx !== -1) CONTENT_IDEAS[idx] = res.idea;
    if (res.content && !CONTENT_ITEMS.find(c => String(c.id) === String(res.content.id))) {
      CONTENT_ITEMS.unshift(res.content);
    }
    showToast('Idea converted to Content Pipeline (IDEA stage)');
    if (CURRENT_PAGE === 'attention') renderAttention();
  } catch (err) {
    showToast(`Convert Error: ${err.message}`);
  }
}

async function handleArchiveIdea(id) {
  if (!confirm('Archive this idea?')) return;
  try {
    await window.ASENZO_API.archiveIdea(id);
    showToast('Idea archived');
    if (CURRENT_PAGE === 'attention') renderAttention();
  } catch (err) {
    showToast(`Archive Error: ${err.message}`);
  }
}

function setIdeaFilter(key, value) {
  IDEA_FILTERS[key] = value;
  if (CURRENT_PAGE === 'attention') renderAttention();
}

// ── AI CONTENT IDEA GENERATOR MODAL ─────────────────────────────────────────
function openIdeaGeneratorModal() {
  populatePillarSelects();
  document.getElementById('idea-generator-modal').classList.remove('hidden');
}

function closeIdeaGeneratorModal() {
  document.getElementById('idea-generator-modal').classList.add('hidden');
}

async function handleGenerateIdeas(e) {
  e.preventDefault();
  const source = document.getElementById('gen-idea-source').value;
  const count = Number(document.getElementById('gen-idea-count').value);
  const pillarId = document.getElementById('gen-idea-pillar').value;
  const btn = document.querySelector('#idea-generator-modal button[type="submit"]');
  const original = btn.textContent;
  btn.disabled = true;
  btn.textContent = '⚡ Generating & Scoring Ideas...';

  try {
    const res = await window.ASENZO_API.generateIdeas({ source, count, pillarId });
    CONTENT_IDEAS = await window.ASENZO_API.getIdeas({ sort: IDEA_FILTERS.sort });
    closeIdeaGeneratorModal();
    showToast(`Generated ${res.count} scored idea(s)`);
    if (CURRENT_PAGE === 'attention') renderAttention();
  } catch (err) {
    showToast(`Generate Error: ${err.message}`);
  } finally {
    btn.disabled = false;
    btn.textContent = original;
  }
}

// ── ATTENTION SUB-TAB 2: PIPELINE & WORKSPACE ──────────────────────────────
function renderPipelineTab() {
  const activeStages = ['IDEA', 'DRAFT', 'SCRIPT', 'REVIEW', 'APPROVED', 'PRODUCTION', 'SCHEDULED', 'PUBLISHED'];
  const postPublishStages = ['PUBLISHED', 'ANALYZING', 'REPURPOSED', 'ARCHIVED'];
  const allStages = ['IDEA', 'DRAFT', 'SCRIPT', 'REVIEW', 'APPROVED', 'PRODUCTION', 'SCHEDULED', 'PUBLISHED', 'ANALYZING', 'REPURPOSED', 'ARCHIVED'];

  let targetStages = activeStages;
  if (PIPELINE_VIEW_MODE === 'POST_PUBLISH') targetStages = postPublishStages;
  if (PIPELINE_VIEW_MODE === 'ALL') targetStages = allStages;

  const stageBadges = {
    IDEA: 'badge-stage-idea',
    DRAFT: 'badge-stage-draft',
    SCRIPT: 'badge-stage-script',
    REVIEW: 'badge-stage-review',
    APPROVED: 'badge-stage-approved',
    PRODUCTION: 'badge-stage-production',
    SCHEDULED: 'badge-stage-scheduled',
    PUBLISHED: 'badge-stage-published',
    ANALYZING: 'badge-stage-analyzing',
    REPURPOSED: 'badge-stage-repurposed',
    ARCHIVED: 'badge-stage-archived'
  };

  const platformIcons = {
    LINKEDIN: '💼 LinkedIn',
    X: '𝕏 X / Twitter',
    X_TWITTER: '𝕏 X / Twitter',
    INSTAGRAM: '📸 Instagram',
    YOUTUBE_SHORT: '▶️ YouTube Short',
    CAROUSEL: '📑 Carousel',
    EMAIL: '✉️ Email',
    NEWSLETTER: '📰 Newsletter',
    BLOG: '📝 Blog'
  };

  return `
    <!-- Active Positioning Summary Card (Business DNA Source of Truth) -->
    <div class="dash-card">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div class="dash-card-title">Source of Truth — Business DNA Positioning</div>
          <div class="dash-card-sub" style="margin-top:2px">Source of truth for Attention OS content generation, scoring & AI coaching</div>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <span class="sb-badge green" style="font-weight:800;font-size:11px">Clarity Score: ${POSITIONING.score || 88}/100</span>
          <span class="sb-badge">Version ${POSITIONING.version || 1} • Locked</span>
          <button class="btn btn-secondary btn-sm" onclick="openPositioningModal()">Edit Business DNA</button>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:14px;margin-top:12px">
        <div style="background:#F8FAFC;padding:12px;border-radius:10px;border:1px solid #E2E8F0">
          <div style="font-size:11px;font-weight:700;color:#64748B">Target ICP</div>
          <div style="font-size:12.5px;font-weight:700;color:#0F172A;margin-top:4px">${POSITIONING.icp_summary || POSITIONING.icp}</div>
        </div>
        <div style="background:#F8FAFC;padding:12px;border-radius:10px;border:1px solid #E2E8F0">
          <div style="font-size:11px;font-weight:700;color:#64748B">Core Pain</div>
          <div style="font-size:12.5px;font-weight:700;color:#0F172A;margin-top:4px">${POSITIONING.problem}</div>
        </div>
        <div style="background:#F8FAFC;padding:12px;border-radius:10px;border:1px solid #E2E8F0">
          <div style="font-size:11px;font-weight:700;color:#64748B">Quantified Result</div>
          <div style="font-size:12.5px;font-weight:700;color:#0F172A;margin-top:4px">${POSITIONING.result}</div>
        </div>
        <div style="background:#F8FAFC;padding:12px;border-radius:10px;border:1px solid #E2E8F0">
          <div style="font-size:11px;font-weight:700;color:#64748B">Unique Mechanism</div>
          <div style="font-size:12.5px;font-weight:700;color:#0F172A;margin-top:4px">${POSITIONING.mechanism}</div>
        </div>
      </div>
    </div>

    <!-- Content Pipeline 11-Stage Interactive Kanban Board -->
    <div style="margin-top:14px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div>
          <div style="font-size:15px;font-weight:700;color:#0F172A">Attention OS Content Pipeline (11-Stage Matrix)</div>
          <div style="font-size:11.5px;color:#64748B;margin-top:2px">Drag & drop assets between validated stage columns</div>
        </div>
        <div style="display:flex;gap:10px;align-items:center">
          <!-- View Toggles -->
          <div style="display:flex;background:#F1F5F9;padding:3px;border-radius:8px;gap:2px">
            <button class="plat-btn ${PIPELINE_VIEW_MODE === 'ACTIVE' ? 'active' : ''}" style="font-size:11px;padding:4px 10px" onclick="setPipelineViewMode('ACTIVE')">Active Pipeline</button>
            <button class="plat-btn ${PIPELINE_VIEW_MODE === 'POST_PUBLISH' ? 'active' : ''}" style="font-size:11px;padding:4px 10px" onclick="setPipelineViewMode('POST_PUBLISH')">Post-Publish</button>
            <button class="plat-btn ${PIPELINE_VIEW_MODE === 'ALL' ? 'active' : ''}" style="font-size:11px;padding:4px 10px" onclick="setPipelineViewMode('ALL')">All 11 Stages</button>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="openScriptGeneratorModal()">+ Create New Script Asset</button>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(${targetStages.length}, minmax(220px, 1fr));gap:12px;overflow-x:auto;padding-bottom:12px">
        ${targetStages.map(stage => {
          const items = CONTENT_ITEMS.filter(c => (c.lifecycle_status || c.stage || 'DRAFT').toUpperCase() === stage);
          const badgeClass = stageBadges[stage] || 'badge-stage-draft';
          return `
            <div class="kanban-col"
                 ondragover="handleKanbanDragOver(event)"
                 ondragleave="handleKanbanDragLeave(event)"
                 ondrop="handleKanbanDrop(event, '${stage}')">
              <div class="col-head" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
                <span class="col-title sb-badge ${badgeClass}" style="font-size:11px;font-weight:700">${stage}</span>
                <span class="col-count sb-badge" style="font-size:10px">${items.length}</span>
              </div>
              <div class="kanban-cards" style="display:flex;flex-direction:column;gap:8px;min-height:360px">
                ${items.length === 0 ? `<div style="font-size:11px;color:#94A3B8;text-align:center;padding:24px 10px;background:#FFFFFF;border:1px dashed #E2E8F0;border-radius:8px">No assets in ${stage}</div>` : ''}
                ${items.map(item => {
                  const platLabel = platformIcons[item.primary_platform || 'LINKEDIN'] || (item.primary_platform || 'LinkedIn');
                  const perf = item.performance_json ? (typeof item.performance_json === 'string' ? JSON.parse(item.performance_json) : item.performance_json) : {};
                  return `
                    <div class="k-card" draggable="true"
                         ondragstart="handleKanbanDragStart(event, '${item.id}')"
                         onclick="openProductionWorkspaceModal('${item.id}')">
                      
                      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:6px">
                        <div class="k-card-title" style="font-weight:700;font-size:12.5px;color:#0F172A;line-height:1.35">${item.title}</div>
                        <span style="font-size:10px;font-weight:800;color:#047857;background:#ECFDF5;padding:1px 5px;border-radius:4px;flex-shrink:0">${item.score || 85}</span>
                      </div>

                      ${item.hook_text ? `<div style="font-size:11px;color:#475569;font-style:italic;margin-top:4px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">"${item.hook_text}"</div>` : ''}

                      <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:8px;align-items:center">
                        <span class="sb-badge" style="font-size:9.5px">${item.pillar_id || item.pillar || 'Positioning'}</span>
                        <span class="sb-badge blue" style="font-size:9.5px">${platLabel}</span>
                      </div>

                      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;padding-top:6px;border-top:1px solid #F1F5F9;font-size:10.5px;color:#64748B">
                        <span>👤 ${item.owner || 'Alex Morgan'}</span>
                        <span>${item.published_at ? 'Published: ' + item.published_at.split('T')[0] : (item.scheduled_at ? 'Sched: ' + item.scheduled_at.split('T')[0] : (item.deadline ? 'Due: ' + item.deadline : ''))}</span>
                      </div>

                      ${perf.views ? `<div style="font-size:10px;color:#2563EB;background:#EFF6FF;padding:2px 6px;border-radius:4px;margin-top:4px;font-weight:600">👁 ${perf.views.toLocaleString()} • 💬 ${perf.dms || 0} DMs • 🎯 ${perf.qualifiedLeads || 0} Leads</div>` : ''}
                      ${item.is_ad_candidate ? `<div style="font-size:9.5px;font-weight:700;color:#047857;background:#ECFDF5;padding:2px 5px;border-radius:4px;margin-top:4px">🔥 Ad Amplification</div>` : ''}
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// ── ATTENTION SUB-TAB 2: ATTRIBUTION FUNNEL & ANALYTICS ─────────────────────
function renderAttributionTab() {
  const analytics = ATTENTION_ANALYTICS || {
    summary: { totalContentItems: 4, totalViews: '43.7k', totalDms: 64, totalQualifiedLeads: 26, conversionRate: '40.6%', adCandidatesCount: 2 },
    funnel: { reach: 43700, engagement: 3496, intent: 655, leads: 64, qualifiedLeads: 26, conversations: 22, opportunities: 13, revenueImpact: 91000 },
    compoundingDetector: { status: 'Compounding Authority', trajectoryScore: '92/100', insight: 'Mechanism and Proof posts generate 3.4x more qualified DMs than general authority content.' }
  };

  const fn = analytics.funnel;

  return `
    <div style="display:grid;grid-template-columns:1fr 340px;gap:16px">
      
      <!-- Funnel Breakdown Card -->
      <div class="dash-card">
        <div class="dash-card-title">Attention OS — Full Attribution Funnel</div>
        <p class="dash-card-sub" style="margin-bottom:14px">Distinguishing Reach → Engagement → Intent → Leads → Qualified Leads → Revenue</p>
        
        <div class="funnel-container">
          <div class="funnel-step">
            <div class="funnel-step-left">
              <div class="funnel-step-num">1</div>
              <div>
                <div style="font-weight:700;color:#0F172A">Reach (Total Impressions)</div>
                <div style="font-size:11px;color:#64748B">Top of funnel views across LinkedIn, X & YouTube</div>
              </div>
            </div>
            <div class="funnel-step-val">${fn.reach.toLocaleString()}</div>
          </div>

          <div class="funnel-step">
            <div class="funnel-step-left">
              <div class="funnel-step-num">2</div>
              <div>
                <div style="font-weight:700;color:#0F172A">Engagement (Likes, Comments & Shares)</div>
                <div style="font-size:11px;color:#64748B">Active engagement rate: 8.0%</div>
              </div>
            </div>
            <div class="funnel-step-val">${fn.engagement.toLocaleString()}</div>
          </div>

          <div class="funnel-step">
            <div class="funnel-step-left">
              <div class="funnel-step-num">3</div>
              <div>
                <div style="font-weight:700;color:#0F172A">Intent Clicks (Lead Magnet / Profile Visits)</div>
                <div style="font-size:11px;color:#64748B">High intent visitors exploring Business DNA mechanism</div>
              </div>
            </div>
            <div class="funnel-step-val">${fn.intent.toLocaleString()}</div>
          </div>

          <div class="funnel-step">
            <div class="funnel-step-left">
              <div class="funnel-step-num">4</div>
              <div>
                <div style="font-weight:700;color:#0F172A">Inbound DMs Started</div>
                <div style="font-size:11px;color:#64748B">Trigger sequence replies from CTA posts</div>
              </div>
            </div>
            <div class="funnel-step-val">${fn.leads} Leads</div>
          </div>

          <div class="funnel-step" style="border-left:4px solid #10B981;background:#F0FDF4">
            <div class="funnel-step-left">
              <div class="funnel-step-num" style="background:#10B981;color:#FFF">5</div>
              <div>
                <div style="font-weight:800;color:#065F46">Qualified Leads (ICP Match)</div>
                <div style="font-size:11px;color:#047857">DM Triage Qualification Rate: ${analytics.summary.conversionRate}</div>
              </div>
            </div>
            <div class="funnel-step-val" style="color:#065F46">${fn.qualifiedLeads} Qualified</div>
          </div>

          <div class="funnel-step">
            <div class="funnel-step-left">
              <div class="funnel-step-num">6</div>
              <div>
                <div style="font-weight:700;color:#0F172A">Pipeline Revenue Influence</div>
                <div style="font-size:11px;color:#64748B">Contract value influenced by Attention OS assets</div>
              </div>
            </div>
            <div class="funnel-step-val" style="color:#2563EB">$${fn.revenueImpact.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <!-- Right Column: Compounding Detector & Ad Amplification Filter -->
      <div style="display:flex;flex-direction:column;gap:16px">
        
        <!-- Compounding vs Flat Detector -->
        <div class="dash-card">
          <div class="dash-card-title">Compounding-vs-Flat Detector</div>
          <div style="margin-top:10px;padding:12px;background:#ECFDF5;border-radius:10px;border:1px solid #A7F3D0">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span style="font-weight:800;color:#065F46;font-size:13.5px">Status: ${analytics.compoundingDetector.status}</span>
              <span class="sb-badge green">${analytics.compoundingDetector.trajectoryScore}</span>
            </div>
            <p style="font-size:12px;color:#047857;margin-top:6px;line-height:1.4">${analytics.compoundingDetector.insight}</p>
          </div>
        </div>

        <!-- Ad Amplification Filter Card -->
        <div class="dash-card">
          <div class="dash-card-title">Ad Amplification Filter</div>
          <p class="dash-card-sub">Organic top-performers flagged for paid ad testing</p>
          
          <div style="margin-top:10px;display:flex;flex-direction:column;gap:8px">
            <div style="padding:10px;background:#F8FAFC;border-radius:8px;border:1px solid #E2E8F0">
              <div style="font-weight:700;color:#0F172A">Stop Buying SaaS. Build Growth OS.</div>
              <div style="font-size:11px;color:#64748B;margin-top:2px">42.5k views • 95% Intent Score</div>
              <div style="margin-top:6px;display:flex;justify-content:space-between;align-items:center">
                <span class="sb-badge red">Human Approval Required</span>
                <button class="btn btn-secondary btn-sm" onclick="showToast('Ad Amplification brief copied for operator approval')">Review Brief</button>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  `;
}

// ── ATTENTION SUB-TAB 3: FOUNDER KNOWLEDGE VAULT ────────────────────────────
function renderKnowledgeTab() {
  const vp = (POSITIONING_SUITE_DATA && POSITIONING_SUITE_DATA.voiceProfile) || {
    communicationStyle: 'Direct, Authoritative, Metric-backed, Systems-driven',
    directnessLevel: 'High',
    recurringPhrases: ['operating system problem', 'Founder Independence Score', 'agency retainers', '60-hr workweeks'],
    vocabulary: ['leverage', 'infrastructure', 'bottleneck', 'compounding', 'SOP delegation'],
    writingStructure: 'Short declarative hook -> Context -> 3-Pillar breakdown -> Quantified action step.'
  };

  return `
    <!-- Founder Voice Profile Overview Card -->
    <div class="dash-card" style="margin-bottom:16px;background:linear-gradient(135deg, #0F172A 0%, #1E293B 100%);color:#FFFFFF">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-size:11px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:0.5px">Founder Voice Profile Engine</div>
          <div style="font-size:16px;font-weight:800;color:#F8FAFC;margin-top:2px">${vp.communicationStyle}</div>
        </div>
        <div style="display:flex;gap:8px">
          <span class="sb-badge green" style="font-weight:700">Directness: ${vp.directnessLevel || 'High'}</span>
          <button class="btn btn-secondary btn-sm" style="background:rgba(255,255,255,0.1);color:#FFF;border-color:rgba(255,255,255,0.2)" onclick="openFounderProfileModal()">Edit Founder Profile</button>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:2fr 1fr;gap:14px;margin-top:14px">
        <div style="background:rgba(255,255,255,0.05);padding:12px;border-radius:10px;border:1px solid rgba(255,255,255,0.1)">
          <div style="font-size:11px;font-weight:700;color:#94A3B8">Top Extracted Recurring Phrases</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">
            ${(vp.recurringPhrases || []).map(p => `<span style="font-size:11px;background:rgba(16,185,129,0.2);color:#34D399;padding:3px 8px;border-radius:4px;font-weight:600">"${p}"</span>`).join('')}
          </div>
        </div>

        <div style="background:rgba(255,255,255,0.05);padding:12px;border-radius:10px;border:1px solid rgba(255,255,255,0.1)">
          <div style="font-size:11px;font-weight:700;color:#94A3B8">Writing Structure Pattern</div>
          <div style="font-size:11.5px;color:#CBD5E1;margin-top:4px;line-height:1.45">${vp.writingStructure}</div>
        </div>
      </div>
    </div>

    <!-- Knowledge Vault & Ingestion Pipeline Manager -->
    <div class="dash-card">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div class="dash-card-title">Founder Authority Knowledge Vault</div>
          <div class="dash-card-sub">Knowledge Ingestion Pipeline: Source → Validation → Cleaning → Chunking → Metadata → Storage → Retrieval</div>
        </div>
        <button class="btn btn-primary btn-sm" onclick="openIngestModal()">⚡ + Ingest Source Material</button>
      </div>

      <!-- Live Search Bar -->
      <div style="margin-top:14px;display:flex;gap:10px">
        <input id="vault-search-input" placeholder="🔍 Search semantic chunks across all ingested articles, transcripts & emails..." style="padding:10px 14px;border-radius:8px;border:1px solid #CBD5E1;font:inherit;font-size:12.5px;flex:1" oninput="handleSearchVaultChunks(this.value)" />
      </div>

      <div id="vault-search-results" class="hidden" style="margin-top:12px;background:#F1F5F9;border:1px solid #CBD5E1;border-radius:10px;padding:12px"></div>

      <!-- Ingested Sources Grid -->
      <div style="display:grid;grid-template-columns:repeat(2, 1fr);gap:14px;margin-top:16px">
        ${KNOWLEDGE_ITEMS.length === 0 ? `<div style="grid-column:span 2;text-align:center;color:#94A3B8;padding:30px">No knowledge items in vault yet. Click "⚡ + Ingest Source Material" to start building your founder voice library.</div>` : ''}
        ${KNOWLEDGE_ITEMS.map(k => `
          <div style="background:#F8FAFC;padding:14px;border-radius:12px;border:1px solid #E2E8F0;display:flex;flex-direction:column;gap:8px">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <div style="display:flex;gap:6px;align-items:center">
                <span class="sb-badge green" style="font-weight:700">${k.source_type || k.category || 'ARTICLE'}</span>
                <span class="sb-badge" style="font-size:10px">${k.chunk_count || 1} Chunks Indexed</span>
              </div>
              <span style="font-size:10px;color:#94A3B8">${new Date(k.created_at || Date.now()).toLocaleDateString()}</span>
            </div>
            <div style="font-weight:700;color:#0F172A;font-size:13.5px">${k.title}</div>
            <div style="font-size:12px;color:#475569;line-height:1.45;max-height:80px;overflow:hidden">${(k.clean_content || k.content || '').substring(0, 180)}...</div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;padding-top:8px;border-top:1px solid #E2E8F0">
              <button class="btn btn-secondary btn-sm" onclick="inspectKnowledgeSourceChunks('${k.id}')">🔍 Inspect Chunks</button>
              <button class="btn btn-secondary btn-sm" style="color:#EF4444;border-color:#FCA5A5" onclick="handleDeleteKnowledgeSource('${k.id}')">🗑 Archive Source</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ── ATTENTION SUB-TAB: AUTHORITY ASSET LIBRARY ──────────────────────────────
function renderAuthorityTab() {
  return `
    <div class="dash-card">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div class="dash-card-title">Authority Proof Asset Library (Anti-Fabrication Guardrail Vault)</div>
          <div class="dash-card-sub">Verified case studies, metrics & client results — strictly filtered for AI content generation</div>
        </div>
        <button class="btn btn-primary btn-sm" onclick="openAuthorityAssetModal()">+ Add Authority Asset</button>
      </div>

      <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;padding:10px 14px;margin-top:12px;font-size:12px;color:#047857">
        🛡 <b>Anti-Fabrication Enforcement Active:</b> The AI Hook and Script Generator will <i>only</i> anchor proof claims in assets marked <b>APPROVED</b>. Unapproved or expired assets are strictly excluded.
      </div>

      <div style="display:grid;grid-template-columns:repeat(2, 1fr);gap:12px;margin-top:14px">
        ${AUTHORITY_ASSET_ITEMS.length === 0 ? `<div style="text-align:center;color:#94A3B8;padding:30px;grid-column:span 2">No authority proof assets logged yet. Click "+ Add Authority Asset" to record case studies.</div>` : ''}
        ${AUTHORITY_ASSET_ITEMS.map(auth => {
          const isApp = auth.permission_status === 'APPROVED';
          const badgeClass = isApp ? 'green' : (auth.permission_status === 'PENDING' ? 'yellow' : 'red');
          return `
            <div style="padding:14px;background:#F8FAFC;border-radius:10px;border:1px solid ${isApp ? '#BBF7D0' : '#E2E8F0'};display:flex;flex-direction:column;gap:8px">
              <div style="display:flex;justify-content:space-between;align-items:flex-start">
                <div>
                  <div style="font-weight:700;color:#0F172A;font-size:13px">${auth.title}</div>
                  <div style="font-size:11px;color:#64748B;margin-top:2px">Client: <b>${auth.client_name || 'N/A'}</b> • Source: ${auth.source || 'Case Study'}</div>
                </div>
                <span class="sb-badge ${badgeClass}" style="font-weight:700">${auth.permission_status}</span>
              </div>

              ${auth.proof_summary ? `<div style="font-size:12px;color:#334155;background:#FFFFFF;padding:8px;border-radius:6px;border:1px solid #E2E8F0">"${auth.proof_summary}"</div>` : ''}

              <div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center">
                <span class="sb-badge blue" style="font-size:9.5px">${(auth.asset_type || 'CASE_STUDY').replace(/_/g, ' ')}</span>
                ${auth.metric ? `<span class="sb-badge green" style="font-size:9.5px">🎯 ${auth.metric}</span>` : ''}
                ${(auth.tags || []).map(t => `<span class="sb-badge" style="font-size:9px">${t}</span>`).join('')}
              </div>

              <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px;padding-top:8px;border-top:1px solid #E2E8F0">
                <button class="btn btn-secondary btn-sm" onclick="openAuthorityAssetModal('${auth.id}')">✏️ Edit Asset</button>
                <button class="btn btn-secondary btn-sm" style="color:#EF4444;border-color:#FCA5A5" onclick="handleDeleteAuthorityAsset('${auth.id}')">🗑 Archive</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// ── ATTENTION SUB-TAB: MARKET INTELLIGENCE RADAR ────────────────────────────
function renderMarketIntelTab() {
  return `
    <div class="dash-card">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div class="dash-card-title">Market Intelligence Signal Radar</div>
          <div class="dash-card-sub">Competitor activity, customer questions, emerging pain points & signal → idea conversion</div>
        </div>
        <button class="btn btn-primary btn-sm" onclick="openMarketIntelModal()">+ Log Market Signal</button>
      </div>

      <div style="display:flex;flex-direction:column;gap:12px;margin-top:14px">
        ${MARKET_INTEL_ITEMS.length === 0 ? `<div style="text-align:center;color:#94A3B8;padding:30px">No market signals logged yet. Click "+ Log Market Signal" to track external niche conversations.</div>` : ''}
        ${MARKET_INTEL_ITEMS.map(mi => `
          <div style="padding:14px;background:#F8FAFC;border-radius:10px;border:1px solid #E2E8F0;display:flex;justify-content:space-between;align-items:flex-start">
            <div style="flex:1;padding-right:16px">
              <div style="display:flex;gap:8px;align-items:center">
                <span class="sb-badge blue" style="font-weight:700">${(mi.signal_type || 'MARKET_CONVERSATION').replace(/_/g, ' ')}</span>
                <span class="sb-badge ${mi.relevance === 'HIGH' ? 'green' : ''}">${mi.relevance || 'HIGH'} RELEVANCE</span>
                ${mi.is_converted_to_idea ? `<span class="sb-badge green">✓ Converted to Content Idea</span>` : ''}
              </div>
              <div style="font-weight:700;color:#0F172A;font-size:13.5px;margin-top:6px">${mi.title}</div>
              <div style="font-size:12px;color:#475569;margin-top:4px;line-height:1.45">${mi.summary || mi.insight || ''}</div>
              ${mi.potential_content_angle ? `<div style="font-size:11.5px;color:#1E40AF;background:#EFF6FF;padding:6px 10px;border-radius:6px;margin-top:6px;font-weight:600">💡 Content Angle: ${mi.potential_content_angle}</div>` : ''}
            </div>

            <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end">
              ${!mi.is_converted_to_idea ? `
                <button class="btn btn-primary btn-sm" onclick="handleConvertSignalToIdea('${mi.id}')">⚡ Convert to Content Idea</button>
              ` : `
                <span style="font-size:11px;font-weight:700;color:#10B981">Converted</span>
              `}
              <button class="btn btn-secondary btn-sm" style="color:#EF4444;border-color:#FCA5A5" onclick="handleDeleteMarketIntel('${mi.id}')">🗑 Archive</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ── ATTENTION SUB-TAB: OUTREACH TRACKER ─────────────────────────────────────
function renderOutreachTab() {
  return `
    <div class="dash-card">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div class="dash-card-title">Attention Outreach Tracker (Lightweight Prospect Pipeline)</div>
          <div class="dash-card-sub">Track initial contacts, AI reply classifications, qualified statuses & human overrides</div>
        </div>
        <button class="btn btn-primary btn-sm" onclick="openOutreachProspectModal()">+ Add Prospect</button>
      </div>

      <div style="margin-top:14px;overflow-x:auto">
        <table class="data-table" style="width:100%;font-size:12px">
          <thead>
            <tr>
              <th>Prospect Name</th>
              <th>Platform</th>
              <th>Source</th>
              <th>Latest Reply</th>
              <th>AI Reply Classification</th>
              <th>Qualified Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${OUTREACH_PROSPECT_ITEMS.length === 0 ? `<tr><td colspan="7" style="text-align:center;color:#94A3B8;padding:24px">No outreach prospects tracked yet. Click "+ Add Prospect" to begin.</td></tr>` : ''}
            ${OUTREACH_PROSPECT_ITEMS.map(p => {
              const classBadge = p.reply_classification === 'INTERESTED' ? 'green' : (p.reply_classification === 'NOT_NOW' ? 'yellow' : (p.reply_classification === 'UNSUBSCRIBE' ? 'red' : 'blue'));
              return `
                <tr>
                  <td><b>${p.prospect_name}</b></td>
                  <td><span class="sb-badge blue">${p.platform}</span></td>
                  <td>${p.source || 'LinkedIn'}</td>
                  <td style="max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${p.latest_reply || ''}">${p.latest_reply ? `"${p.latest_reply}"` : 'No reply yet'}</td>
                  <td><span class="sb-badge ${classBadge}">${p.reply_classification || 'UNKNOWN'}</span></td>
                  <td><span class="sb-badge ${p.qualified_status === 'QUALIFIED' ? 'green' : ''}">${p.qualified_status || 'UNQUALIFIED'}</span></td>
                  <td>
                    <div style="display:flex;gap:4px">
                      <button class="btn btn-secondary btn-sm" onclick="handleAutoClassifyProspectReply('${p.id}')">⚡ AI Classify</button>
                      <button class="btn btn-secondary btn-sm" onclick="openOutreachProspectModal('${p.id}')">✏️ Override</button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ── AUTHORITY ASSET MODAL CONTROLLER ─────────────────────────────────────────
function openAuthorityAssetModal(id) {
  document.getElementById('authority-modal-title').textContent = id ? 'Edit Authority Asset' : 'New Authority Proof Asset';
  document.getElementById('auth-id').value = id || '';
  document.getElementById('auth-title').value = '';
  document.getElementById('auth-type').value = 'CASE_STUDY';
  document.getElementById('auth-permission').value = 'APPROVED';
  document.getElementById('auth-client').value = '';
  document.getElementById('auth-source').value = '';
  document.getElementById('auth-metric').value = '';
  document.getElementById('auth-url').value = '';
  document.getElementById('auth-problem').value = '';
  document.getElementById('auth-result').value = '';
  document.getElementById('auth-summary').value = '';

  if (id) {
    const auth = AUTHORITY_ASSET_ITEMS.find(a => String(a.id) === String(id));
    if (auth) {
      document.getElementById('auth-title').value = auth.title || '';
      document.getElementById('auth-type').value = auth.asset_type || 'CASE_STUDY';
      document.getElementById('auth-permission').value = auth.permission_status || 'APPROVED';
      document.getElementById('auth-client').value = auth.client_name || '';
      document.getElementById('auth-source').value = auth.source || '';
      document.getElementById('auth-metric').value = auth.metric || '';
      document.getElementById('auth-url').value = auth.file_url || '';
      document.getElementById('auth-problem').value = auth.problem || '';
      document.getElementById('auth-result').value = auth.result || '';
      document.getElementById('auth-summary').value = auth.proof_summary || '';
    }
  }
  document.getElementById('authority-asset-modal').classList.remove('hidden');
}

function closeAuthorityAssetModal() {
  document.getElementById('authority-asset-modal').classList.add('hidden');
}

async function handleSaveAuthorityAsset(e) {
  e.preventDefault();
  const id = document.getElementById('auth-id').value;
  const payload = {
    title: document.getElementById('auth-title').value.trim(),
    assetType: document.getElementById('auth-type').value,
    permissionStatus: document.getElementById('auth-permission').value,
    clientName: document.getElementById('auth-client').value.trim(),
    source: document.getElementById('auth-source').value.trim(),
    metric: document.getElementById('auth-metric').value.trim(),
    fileUrl: document.getElementById('auth-url').value.trim() || '#',
    problem: document.getElementById('auth-problem').value.trim(),
    result: document.getElementById('auth-result').value.trim(),
    proofSummary: document.getElementById('auth-summary').value.trim(),
    tags: [document.getElementById('auth-type').value, document.getElementById('auth-metric').value.trim()].filter(Boolean)
  };

  try {
    let saved;
    if (id) {
      saved = await window.ASENZO_API.updateAuthorityAsset(id, payload);
    } else {
      saved = await window.ASENZO_API.createAuthorityAsset(payload);
    }
    const idx = AUTHORITY_ASSET_ITEMS.findIndex(a => String(a.id) === String(saved.id));
    if (idx !== -1) AUTHORITY_ASSET_ITEMS[idx] = saved; else AUTHORITY_ASSET_ITEMS.unshift(saved);
    closeAuthorityAssetModal();
    showToast(id ? 'Authority asset updated' : 'Authority asset created');
    if (CURRENT_PAGE === 'attention') renderAttention();
  } catch (err) {
    showToast(`Authority Asset Error: ${err.message}`);
  }
}

async function handleDeleteAuthorityAsset(id) {
  if (!confirm('Archive this authority proof asset?')) return;
  try {
    await window.ASENZO_API.deleteAuthorityAsset(id);
    AUTHORITY_ASSET_ITEMS = AUTHORITY_ASSET_ITEMS.filter(a => String(a.id) !== String(id));
    showToast('Authority asset archived');
    if (CURRENT_PAGE === 'attention') renderAttention();
  } catch (err) {
    showToast(`Archive Error: ${err.message}`);
  }
}

// MARKET INTEL CONTROLLER & SIGNAL CONVERSION LOGIC
function openMarketIntelModal() {
  document.getElementById('market-intel-modal').classList.remove('hidden');
}

function closeMarketIntelModal() {
  document.getElementById('market-intel-modal').classList.add('hidden');
}

async function handleCreateMarketIntel(e) {
  e.preventDefault();
  const payload = {
    title: document.getElementById('mi-title').value.trim(),
    signalType: document.getElementById('mi-type').value,
    relevance: document.getElementById('mi-relevance').value,
    source: document.getElementById('mi-source').value.trim(),
    topic: document.getElementById('mi-topic').value.trim(),
    icpRelevance: document.getElementById('mi-icp-relevance').value.trim(),
    summary: document.getElementById('mi-summary').value.trim(),
    potentialContentAngle: document.getElementById('mi-angle').value.trim()
  };

  try {
    const created = await window.ASENZO_API.createMarketIntel(payload);
    MARKET_INTEL_ITEMS.unshift(created);
    closeMarketIntelModal();
    showToast('Market Signal logged');
    if (CURRENT_PAGE === 'attention') renderAttention();
  } catch (err) {
    showToast(`Market Intel Error: ${err.message}`);
  }
}

async function handleConvertSignalToIdea(id) {
  if (!confirm('Convert this market signal into a scored Content Idea?')) return;
  try {
    const res = await window.ASENZO_API.convertSignalToIdea(id);
    const idx = MARKET_INTEL_ITEMS.findIndex(m => String(m.id) === String(id));
    if (idx !== -1) MARKET_INTEL_ITEMS[idx] = res.signal;
    if (res.idea && !CONTENT_IDEAS.find(i => String(i.id) === String(res.idea.id))) {
      CONTENT_IDEAS.unshift(res.idea);
    }
    showToast('Signal converted to Content Idea');
    if (CURRENT_PAGE === 'attention') renderAttention();
  } catch (err) {
    showToast(`Conversion Error: ${err.message}`);
  }
}

async function handleDeleteMarketIntel(id) {
  if (!confirm('Archive this market signal?')) return;
  try {
    await window.ASENZO_API.deleteMarketIntel(id);
    MARKET_INTEL_ITEMS = MARKET_INTEL_ITEMS.filter(m => String(m.id) !== String(id));
    showToast('Market signal archived');
    if (CURRENT_PAGE === 'attention') renderAttention();
  } catch (err) {
    showToast(`Archive Error: ${err.message}`);
  }
}

// OUTREACH TRACKER MODAL CONTROLLER & AI CLASSIFIER LOGIC
function openOutreachProspectModal(id) {
  document.getElementById('outreach-modal-title').textContent = id ? 'Edit Outreach Prospect (Human Override)' : 'Attention Outreach Tracker Prospect';
  document.getElementById('prosp-id').value = id || '';
  document.getElementById('prosp-name').value = '';
  document.getElementById('prosp-platform').value = 'LINKEDIN';
  document.getElementById('prosp-qualified').value = 'UNQUALIFIED';
  document.getElementById('prosp-source').value = 'LinkedIn Search';
  document.getElementById('prosp-date').value = new Date().toISOString().split('T')[0];
  document.getElementById('prosp-initial').value = '';
  document.getElementById('prosp-reply').value = '';
  document.getElementById('prosp-classification').value = 'UNKNOWN';
  document.getElementById('prosp-followup').value = '';

  if (id) {
    const p = OUTREACH_PROSPECT_ITEMS.find(x => String(x.id) === String(id));
    if (p) {
      document.getElementById('prosp-name').value = p.prospect_name || '';
      document.getElementById('prosp-platform').value = p.platform || 'LINKEDIN';
      document.getElementById('prosp-qualified').value = p.qualified_status || 'UNQUALIFIED';
      document.getElementById('prosp-source').value = p.source || '';
      document.getElementById('prosp-date').value = p.contact_date ? p.contact_date.split('T')[0] : '';
      document.getElementById('prosp-initial').value = p.initial_message || '';
      document.getElementById('prosp-reply').value = p.latest_reply || '';
      document.getElementById('prosp-classification').value = p.reply_classification || 'UNKNOWN';
      document.getElementById('prosp-followup').value = p.follow_up_date ? p.follow_up_date.split('T')[0] : '';
    }
  }
  document.getElementById('outreach-prospect-modal').classList.remove('hidden');
}

function closeOutreachProspectModal() {
  document.getElementById('outreach-prospect-modal').classList.add('hidden');
}

async function handleSaveOutreachProspect(e) {
  e.preventDefault();
  const id = document.getElementById('prosp-id').value;
  const payload = {
    prospectName: document.getElementById('prosp-name').value.trim(),
    platform: document.getElementById('prosp-platform').value,
    qualifiedStatus: document.getElementById('prosp-qualified').value,
    source: document.getElementById('prosp-source').value.trim(),
    contactDate: document.getElementById('prosp-date').value,
    initialMessage: document.getElementById('prosp-initial').value.trim(),
    latestReply: document.getElementById('prosp-reply').value.trim(),
    replyClassification: document.getElementById('prosp-classification').value,
    followUpDate: document.getElementById('prosp-followup').value
  };

  try {
    let saved;
    if (id) {
      saved = await window.ASENZO_API.updateOutreachProspect(id, payload);
    } else {
      saved = await window.ASENZO_API.createOutreachProspect(payload);
    }
    const idx = OUTREACH_PROSPECT_ITEMS.findIndex(p => String(p.id) === String(saved.id));
    if (idx !== -1) OUTREACH_PROSPECT_ITEMS[idx] = saved; else OUTREACH_PROSPECT_ITEMS.unshift(saved);
    closeOutreachProspectModal();
    showToast(id ? 'Prospect updated & saved' : 'Prospect added to Outreach Tracker');
    if (CURRENT_PAGE === 'attention') renderAttention();
  } catch (err) {
    showToast(`Outreach Error: ${err.message}`);
  }
}

async function handleAutoClassifyProspectModalReply() {
  const replyText = document.getElementById('prosp-reply').value.trim();
  if (!replyText) {
    return showToast('Please enter an inbound reply message first');
  }
  try {
    const res = await window.ASENZO_API.classifyOutreachReply({ replyText });
    document.getElementById('prosp-classification').value = res.classification;
    if (res.classification === 'INTERESTED') {
      document.getElementById('prosp-qualified').value = 'QUALIFIED';
    }
    showToast(`AI Classified: ${res.classification} (${res.confidence}% confidence)`);
  } catch (err) {
    showToast(`Classification Error: ${err.message}`);
  }
}

async function handleAutoClassifyProspectReply(id) {
  const p = OUTREACH_PROSPECT_ITEMS.find(x => String(x.id) === String(id));
  if (!p || !p.latest_reply) {
    return showToast('No inbound reply text recorded for this prospect');
  }
  try {
    const res = await window.ASENZO_API.classifyOutreachReply({ replyText: p.latest_reply, prospectId: id });
    if (res.prospect) {
      const idx = OUTREACH_PROSPECT_ITEMS.findIndex(x => String(x.id) === String(id));
      if (idx !== -1) OUTREACH_PROSPECT_ITEMS[idx] = res.prospect;
    }
    showToast(`AI Classified reply: ${res.classification} (${res.confidence}% confidence)`);
    if (CURRENT_PAGE === 'attention') renderAttention();
  } catch (err) {
    showToast(`Classifier Error: ${err.message}`);
  }
}

// ── ATTENTION SUB-TAB 5: AI RECOMMENDATIONS ─────────────────────────────────
function renderRecommendationsTab() {
  return `
    <div class="dash-card">
      <div class="dash-card-title">Attention Intelligence & Recommendations</div>
      <p class="dash-card-sub">AI-driven optimizations with explainability, confidence metrics, and human review gates</p>

      <div style="display:flex;flex-direction:column;gap:14px;margin-top:14px">
        ${AI_RECOMMENDATIONS.map(r => `
          <div class="decision-card" style="border-left-color:${r.status === 'applied' ? '#10B981' : '#8B5CF6'}">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <div class="dc-obs">⚡ ${r.category}</div>
              <span class="sb-badge ${r.status === 'applied' ? 'green' : ''}">${r.status.toUpperCase()}</span>
            </div>
            <div style="font-weight:700;color:#0F172A;margin-top:4px">${r.observation}</div>
            <div class="dc-why">Rationale: ${r.rationale}</div>
            <div class="dc-act">
              <span class="dc-conf">${r.confidence_score}</span>
              ${r.status === 'pending' ? `<button class="btn btn-primary btn-sm" onclick="handleApplyRecommendation(${r.id})">Apply Decision Action</button>` : `<span style="font-size:11px;font-weight:700;color:#10B981">✓ Applied</span>`}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ── 3. ENGINE 2 — CONVERSION OS ────────────────────────────────────────────
function renderConversion() {
  const ca = document.getElementById('content-area');
  ca.innerHTML = `
    <div class="pg-header">
      <div>
        <h1 class="pg-title">Engine 2 — Conversion OS (Sales & Pipeline)</h1>
        <p class="pg-sub">Turn qualified attention into predictable revenue with AI DM triage and deal pipeline.</p>
      </div>
      <div class="pg-actions">
        <button class="btn btn-primary" onclick="openDealModal()">+ Add Deal</button>
      </div>
    </div>

    <!-- DM Triage Inbox Table Card -->
    <div class="dash-card">
      <div class="dash-card-title">AI DM Qualifier Inbox</div>
      <div style="margin-top:10px;display:flex;flex-direction:column;gap:8px">
        ${DM_INBOUNDS.map(m => `
          <div style="display:flex;align-items:center;justify-content:space-between;padding:12px;background:#F8FAFC;border-radius:10px;border:1px solid #E2E8F0">
            <div>
              <div style="font-weight:700;color:#0F172A">${m.name} <span class="sb-badge green" style="margin-left:6px">${m.score} ICP Match</span></div>
              <div style="font-size:12px;color:#64748B;margin-top:3px">"${m.msg}"</div>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="showToast('Applying Story Sequence reply to ${m.name}...')">Draft AI Reply</button>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Deal CRM Pipeline Kanban Board -->
    <div>
      <div style="font-size:15px;font-weight:700;color:#0F172A;margin-bottom:12px">CRM Deal Pipeline</div>
      <div class="kanban-grid">
        ${['Lead In', 'VSL Watched', 'Call Booked', 'Proposal Sent', 'Closed Won'].map(stage => {
          const items = DEALS.filter(d => d.stage === stage);
          return `
            <div class="kanban-col">
              <div class="col-head">
                <span class="col-title">${stage}</span>
                <span class="col-count">${items.length}</span>
              </div>
              <div class="kanban-cards">
                ${items.map(d => `
                  <div class="k-card" onclick="showToast('Objection: ${d.objection}')">
                    <div class="k-card-title">${d.name}</div>
                    <div class="k-card-val">$${d.val.toLocaleString()}</div>
                    <div class="k-card-meta">${d.objection}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// ── 4. ENGINE 3 — DELIVERY OS ──────────────────────────────────────────────
function renderDelivery() {
  const ca = document.getElementById('content-area');
  ca.innerHTML = `
    <div class="pg-header">
      <div>
        <h1 class="pg-title">Engine 3 — Delivery OS (Client Success)</h1>
        <p class="pg-sub">Deliver consistent, scalable client outcomes without ERP complexity.</p>
      </div>
    </div>

    <div class="dash-card">
      <div class="dash-card-title">Active Client Onboarding & Milestones</div>
      <div style="margin-top:12px;display:flex;flex-direction:column;gap:12px">
        ${CLIENTS.map(c => `
          <div style="padding:16px;background:#F8FAFC;border-radius:12px;border:1px solid #E2E8F0;display:flex;flex-direction:column;gap:8px">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <div style="font-weight:800;font-size:14px;color:#0F172A">${c.name}</div>
              <span class="sb-badge green">${c.status}</span>
            </div>
            <div style="font-size:12px;color:#64748B">Current Milestone: <strong style="color:#0F172A">${c.milestone}</strong></div>
            <div style="width:100%;height:8px;background:#E2E8F0;border-radius:4px;overflow:hidden;margin-top:4px">
              <div style="width:${c.progress}%;height:100%;background:#10B981"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ── 5. ENGINE 4 — INTELLIGENCE OS ──────────────────────────────────────────
function renderIntelligence() {
  const ca = document.getElementById('content-area');
  ca.innerHTML = `
    <div class="pg-header">
      <div>
        <h1 class="pg-title">Engine 4 — Intelligence OS (Decision Layer)</h1>
        <p class="pg-sub">Observation → Why it matters → Recommended action → Apply.</p>
      </div>
      <div class="pg-actions">
        <button class="btn btn-primary" onclick="showToast('Recalculating Weekly Directives...')">⚡ Refresh Directives</button>
      </div>
    </div>

    <div style="display:flex;flex-direction:column;gap:14px">
      ${DIRECTIVES.map(d => `
        <div class="decision-card">
          <div class="dc-obs">🔍 ${d.obs}</div>
          <div class="dc-why">${d.why}</div>
          <div class="dc-act">
            <span class="dc-conf">Confidence: ${d.conf}</span>
            <button class="btn btn-primary btn-sm" onclick="showToast('Applied directive: ${d.act}')">Apply Decision Action</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// ── 6. ENGINE 5 — OPERATOR OS ──────────────────────────────────────────────
function renderOperator() {
  const ca = document.getElementById('content-area');
  ca.innerHTML = `
    <div class="pg-header">
      <div>
        <h1 class="pg-title">Engine 5 — Operator OS (Capability & SOPs)</h1>
        <p class="pg-sub">Train the founder into an independent Growth Operator with versioned SOP playbooks.</p>
      </div>
      <div class="pg-actions">
        <button class="btn btn-primary" onclick="openSopModal()">+ Create SOP</button>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:16px">
      ${SOPS.map(s => `
        <div class="dash-card">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <span class="sb-badge green">${s.engine} Engine</span>
            <span style="font-size:11px;color:#94A3B8">v1.2</span>
          </div>
          <div style="font-size:15px;font-weight:800;color:#0F172A;margin-top:6px">${s.title}</div>
          <div style="display:flex;flex-direction:column;gap:6px;margin-top:10px">
            ${s.steps.map(step => `<div style="font-size:12px;color:#475569;background:#F8FAFC;padding:6px 10px;border-radius:6px;border:1px solid #E2E8F0">• ${step}</div>`).join('')}
          </div>
          <button class="btn btn-secondary btn-sm" style="margin-top:12px" onclick="showToast('Executing ${s.title}...')">Execute SOP</button>
        </div>
      `).join('')}
    </div>
  `;
}

// ── 7. CALENDAR VIEW ────────────────────────────────────────────────────────
function renderCalendar() {
  const ca = document.getElementById('content-area');
  ca.innerHTML = `
    <div class="pg-header">
      <div>
        <h1 class="pg-title">Growth Calendar</h1>
        <p class="pg-sub">Site work, live calls, VSL launches & sprints</p>
      </div>
      <div class="pg-actions">
        <button class="btn btn-primary" onclick="openEventModal()">+ Add Event</button>
      </div>
    </div>

    <div class="calendar-wrap">
      <div class="cal-header">Week of 13–19 July</div>
      
      <div class="cal-grid">
        ${CALENDAR_EVENTS.map(d => `
          <div class="cal-day-col">
            <div class="cal-day-head">
              <div class="cal-day-name">${d.day}</div>
              <div class="cal-day-num">${d.date}</div>
            </div>
            <div class="cal-events">
              ${d.events.map(e => `
                <div class="cal-event-pill ${e.type}">
                  ${e.time ? `<div style="font-size:10px;font-weight:700;margin-bottom:2px">${e.time}</div>` : ''}
                  <div>${e.text}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ── POSITIONING & BUSINESS DNA SUITE MODAL LOGIC ──────────────────────────────
let POSITIONING_SUITE_DATA = null;

async function openPositioningModal() {
  switchDnaTab('core');
  try {
    if (window.ASENZO_API) {
      POSITIONING_SUITE_DATA = await window.ASENZO_API.getPositioning();
      const p = POSITIONING_SUITE_DATA.positioning || POSITIONING;
      POSITIONING = p;

      document.getElementById('pos-icp').value = p.icp_summary || p.icp || '';
      document.getElementById('pos-problem').value = p.problem || '';
      document.getElementById('pos-result').value = p.result || '';
      document.getElementById('pos-mechanism').value = p.mechanism || '';

      document.getElementById('dna-modal-score-badge').textContent = `Score: ${p.score || 88}/100`;
      document.getElementById('dna-modal-version-badge').textContent = `Version ${p.version || 1}`;

      const icpData = POSITIONING_SUITE_DATA.icp;
      if (icpData) {
        document.getElementById('icp-customer').value = icpData.target_customer || '';
        document.getElementById('icp-industry').value = icpData.industry || '';
        document.getElementById('icp-role').value = icpData.founder_role || '';
        document.getElementById('icp-size').value = icpData.company_size || '';
        document.getElementById('icp-primary-pains').value = Array.isArray(icpData.primaryPains) ? icpData.primaryPains.join(', ') : (icpData.primary_pains || '');
      }

      const offerData = POSITIONING_SUITE_DATA.offer;
      if (offerData) {
        document.getElementById('offer-name').value = offerData.offer_name || '';
        document.getElementById('offer-promise').value = offerData.promise || '';
        document.getElementById('offer-price').value = offerData.pricing_context || '';
      }

      renderDnaScoreBreakdown(POSITIONING_SUITE_DATA.scoringAnalysis);
      renderDnaAlternatives(POSITIONING_SUITE_DATA.positioning.alternatives || []);
      renderDnaVersions(POSITIONING_SUITE_DATA.versions || []);
    }
  } catch (err) {
    console.warn('Positioning suite load error:', err.message);
  } finally {
    recalculateDnaScorePreview();
    document.getElementById('positioning-modal').classList.remove('hidden');
  }
}

function closePositioningModal() {
  document.getElementById('positioning-modal').classList.add('hidden');
}

function switchDnaTab(tab) {
  ['core', 'icp', 'alts'].forEach(t => {
    const btn = document.getElementById(`tab-btn-dna-${t}`);
    const body = document.getElementById(`dna-tab-${t}`);
    if (btn) btn.classList.toggle('active', t === tab);
    if (body) body.classList.toggle('hidden', t !== tab);
  });
}

function recalculateDnaScorePreview() {
  const icp = document.getElementById('pos-icp').value.trim();
  const problem = document.getElementById('pos-problem').value.trim();
  const result = document.getElementById('pos-result').value.trim();
  const mechanism = document.getElementById('pos-mechanism').value.trim();

  const previewStmt = `For ${icp || '[ICP]'} struggling with ${problem || '[Problem]'}, ${mechanism || '[Mechanism]'} scales your revenue to ${result || '[Result]'}.`;
  const el = document.getElementById('dna-statement-preview');
  if (el) el.textContent = previewStmt;
}

function renderDnaScoreBreakdown(scoreData) {
  if (!scoreData) return;
  const bd = scoreData.breakdown || {};
  const container = document.getElementById('dna-score-bars-container');
  if (!container) return;

  const dims = [
    { label: 'ICP Specificity', score: bd.icpSpecificity || 18, max: 20 },
    { label: 'Pain Clarity', score: bd.painClarity || 18, max: 20 },
    { label: 'Outcome Clarity', score: bd.outcomeClarity || 18, max: 20 },
    { label: 'Differentiation', score: bd.differentiation || 18, max: 20 },
    { label: 'Comprehension', score: bd.comprehension || 16, max: 20 }
  ];

  container.innerHTML = dims.map(d => `
    <div style="background:#FFFFFF;padding:8px 10px;border-radius:8px;border:1px solid #E2E8F0">
      <div style="font-size:10.5px;font-weight:700;color:#64748B">${d.label}</div>
      <div style="font-size:14px;font-weight:800;color:#0F172A;margin-top:2px">${d.score}/${d.max}</div>
      <div style="width:100%;height:4px;background:#E2E8F0;border-radius:2px;overflow:hidden;margin-top:4px">
        <div style="width:${(d.score / d.max) * 100}%;height:100%;background:#10B981"></div>
      </div>
    </div>
  `).join('');

  const exp = document.getElementById('dna-score-explanation');
  if (exp) exp.innerHTML = `💡 <strong>Deterministic Audit:</strong> ${scoreData.explanation || ''} ${(scoreData.suggestions && scoreData.suggestions.length > 0) ? `<br/>• ${scoreData.suggestions.join('<br/>• ')}` : ''}`;
}

async function handleSavePositioning(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-save-dna');
  btn.disabled = true;
  btn.textContent = 'Saving & Scoring DNA...';

  const payload = {
    icpSummary: document.getElementById('pos-icp').value.trim(),
    problem: document.getElementById('pos-problem').value.trim(),
    result: document.getElementById('pos-result').value.trim(),
    mechanism: document.getElementById('pos-mechanism').value.trim()
  };

  try {
    if (window.ASENZO_API) {
      const res = await window.ASENZO_API.savePositioning(payload);
      if (res && res.positioning) {
        POSITIONING = res.positioning;
      }

      // Also save ICP deep details if modified
      const icpPayload = {
        targetCustomer: document.getElementById('icp-customer').value.trim() || payload.icpSummary,
        industry: document.getElementById('icp-industry').value.trim() || 'B2B SaaS & Digital Agencies',
        founderRole: document.getElementById('icp-role').value.trim() || 'CEO / Founder Operator',
        companySize: document.getElementById('icp-size').value.trim() || '$15k–$50k/mo',
        revenueRange: '$15k–$50k/mo',
        corePain: payload.problem,
        desiredOutcome: payload.result,
        primaryPains: document.getElementById('icp-primary-pains').value.split(',').map(s => s.trim()).filter(Boolean)
      };
      await window.ASENZO_API.saveIcp(icpPayload);

      // Save Offer details
      const offerPayload = {
        offerName: document.getElementById('offer-name').value.trim() || 'ASENZO Growth Operating System Installation',
        description: 'Complete growth infrastructure installation & founder capability training across 5 operating engines.',
        promise: document.getElementById('offer-promise').value.trim() || payload.result,
        deliverables: ['Attention OS Content Engine', 'Conversion OS CRM Triage', 'Delivery OS Milestones'],
        pricingContext: document.getElementById('offer-price').value.trim() || '$12,500 One-time OS Installation Sprint'
      };
      await window.ASENZO_API.saveOffer(offerPayload);
    }
    closePositioningModal();
    showToast('Business DNA updated, scored & versioned in database!');
    if (CURRENT_PAGE === 'attention' || CURRENT_PAGE === 'overview') go(CURRENT_PAGE);
  } catch (err) {
    showToast(`Error: ${err.message}`);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Save Business DNA (Create Version)';
  }
}

async function handleGenerateAlternativesFromModal() {
  switchDnaTab('alts');
  const container = document.getElementById('dna-alternatives-container');
  container.innerHTML = `<div style="text-align:center;color:#2563EB;padding:20px;font-weight:700">⚡ Generating 3 Distinct Strategic Positioning Angles...</div>`;

  try {
    if (window.ASENZO_API) {
      const res = await window.ASENZO_API.generatePositioningAlternatives();
      renderDnaAlternatives(res.alternatives || []);
    }
  } catch (err) {
    showToast(`Alternatives Generation Error: ${err.message}`);
  }
}

function renderDnaAlternatives(alts) {
  const container = document.getElementById('dna-alternatives-container');
  if (!container) return;
  if (!alts || alts.length === 0) {
    container.innerHTML = `<div style="font-size:12px;color:#94A3B8;text-align:center;padding:20px">No alternatives generated yet. Click "⚡ Generate 3 Alternatives" to compare strategic options.</div>`;
    return;
  }

  container.innerHTML = alts.map((a, i) => `
    <div style="padding:14px;background:#F8FAFC;border-radius:12px;border:1px solid #CBD5E1;display:flex;flex-direction:column;gap:8px">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div style="font-weight:800;color:#0F172A;font-size:13.5px">${a.angle}</div>
        <span class="sb-badge green">Score: ${a.scoreData ? a.scoreData.totalScore : 85}/100</span>
      </div>
      <div style="font-size:12px;color:#334155"><strong>Statement:</strong> "${a.statement}"</div>
      <div style="font-size:11.5px;color:#64748B"><strong>Core Problem:</strong> ${a.problem}</div>
      <div style="display:flex;justify-content:flex-end;margin-top:4px">
        <button type="button" class="btn btn-primary btn-sm" onclick="handleAcceptAlternative(${i})">
          🔒 Accept & Make Active Version
        </button>
      </div>
    </div>
  `).join('');
}

async function handleAcceptAlternative(idx) {
  try {
    if (window.ASENZO_API) {
      const res = await window.ASENZO_API.acceptPositioningAlternative(idx);
      showToast(res.message);
      closePositioningModal();
      if (CURRENT_PAGE === 'attention' || CURRENT_PAGE === 'overview') go(CURRENT_PAGE);
    }
  } catch (err) {
    showToast(`Error: ${err.message}`);
  }
}

function renderDnaVersions(versions) {
  const container = document.getElementById('dna-versions-container');
  if (!container) return;
  if (!versions || versions.length === 0) {
    container.innerHTML = `<div style="font-size:12px;color:#94A3B8;text-align:center;padding:10px">No previous versions.</div>`;
    return;
  }

  container.innerHTML = versions.map(v => `
    <div style="padding:10px 14px;background:#FFFFFF;border-radius:8px;border:1px solid #E2E8F0;display:flex;align-items:center;justify-content:space-between">
      <div>
        <div style="font-weight:700;color:#0F172A">Version ${v.version_number} <span class="sb-badge green" style="margin-left:6px">Score: ${v.score || 85}</span></div>
        <div style="font-size:11.5px;color:#64748B;margin-top:2px">"${v.icp_summary}" • ${new Date(v.created_at || Date.now()).toLocaleDateString()}</div>
      </div>
      <button type="button" class="btn btn-secondary btn-sm" onclick="handleRestorePositioningVersion(${v.version_number})">Restore v${v.version_number}</button>
    </div>
  `).join('');
}

async function handleRestorePositioningVersion(verNum) {
  if (!confirm(`Restore Version ${verNum} as your active Business DNA?`)) return;
  try {
    if (window.ASENZO_API) {
      const res = await window.ASENZO_API.restorePositioningVersion(verNum);
      showToast(res.message);
      closePositioningModal();
      if (CURRENT_PAGE === 'attention' || CURRENT_PAGE === 'overview') go(CURRENT_PAGE);
    }
  } catch (err) {
    showToast(`Restore Error: ${err.message}`);
  }
}

// ── AI SCRIPT GENERATOR MODAL LOGIC ──────────────────────────────────────────
function openScriptGeneratorModal() {
  document.getElementById('gen-output-container').classList.add('hidden');
  document.getElementById('script-generator-modal').classList.remove('hidden');
}

function closeScriptGeneratorModal() {
  document.getElementById('script-generator-modal').classList.add('hidden');
}

async function handleGenerateScript(e) {
  e.preventDefault();
  const pillar = document.getElementById('gen-pillar').value;
  const hookType = document.getElementById('gen-hook-type').value;
  const topic = document.getElementById('gen-topic').value.trim();

  const btn = document.getElementById('btn-generate-script');
  btn.disabled = true;
  btn.textContent = '⚡ Generating Script...';

  try {
    let res = null;
    if (window.ASENZO_API) {
      res = await window.ASENZO_API.generateScript({ pillar, hookType, topic });
    } else {
      res = {
        topic,
        pillar,
        hookType,
        hookOptions: [`Stop building manual growth bottlenecks in 2026.`],
        bodyScript: `Here is why relying on manual retainers breaks down...`,
        cta: `Comment OS below for the full breakdown.`,
        explainability: `Targeted for ${POSITIONING.icp}`
      };
    }

    GENERATED_SCRIPT_DATA = res;
    SELECTED_HOOK_TEXT = res.hookOptions[0] || '';

    // Render generated hooks
    const hooksContainer = document.getElementById('gen-hooks-list');
    hooksContainer.innerHTML = res.hookOptions.map((h, i) => `
      <div class="hook-opt-btn ${i === 0 ? 'selected' : ''}" onclick="selectGeneratedHook(${i})">
        Hook ${i + 1}: "${h}"
      </div>
    `).join('');

    document.getElementById('gen-body-script').value = res.bodyScript;
    document.getElementById('gen-cta').value = res.cta;

    let provHtml = '';
    if (res.provenance && res.provenance.length > 0) {
      provHtml = `
        <div style="margin-top:8px;padding-top:8px;border-top:1px solid #BFDBFE">
          <strong style="color:#1D4ED8">📌 Knowledge Provenance Attribution:</strong>
          <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:4px">
            ${res.provenance.map(p => `
              <span style="font-size:10.5px;background:#DBEAFE;color:#1E40AF;padding:2px 6px;border-radius:4px" title="${p.snippet}">
                Source: ${p.sourceTitle} (${(p.relevanceScore * 100).toFixed(0)}% match)
              </span>
            `).join('')}
          </div>
        </div>
      `;
    }

    document.getElementById('gen-explainability').innerHTML = `💡 <strong>AI Rationale:</strong> ${res.explainability}${provHtml}`;
    document.getElementById('gen-output-container').classList.remove('hidden');
  } catch (err) {
    showToast(`Script Generation Error: ${err.message}`);
  } finally {
    btn.disabled = false;
    btn.textContent = '⚡ Generate Structured Script';
  }
}

// ── KNOWLEDGE INGESTION PIPELINE MODAL HANDLERS ──────────────────────────────
function openIngestModal() {
  document.getElementById('ingest-title').value = '';
  document.getElementById('ingest-content').value = '';
  document.getElementById('ingest-knowledge-modal').classList.remove('hidden');
}

function closeIngestModal() {
  document.getElementById('ingest-knowledge-modal').classList.add('hidden');
}

async function handleIngestSource(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-run-ingestion');
  btn.disabled = true;
  btn.textContent = '⚡ Running Pipeline (Cleaning & Chunking)...';

  const payload = {
    title: document.getElementById('ingest-title').value.trim(),
    sourceType: document.getElementById('ingest-type').value,
    rawContent: document.getElementById('ingest-content').value.trim()
  };

  try {
    if (window.ASENZO_API) {
      const res = await window.ASENZO_API.ingestKnowledgeSource(payload);
      showToast(res.message);
      KNOWLEDGE_ITEMS = await window.ASENZO_API.getKnowledgeSources();
    }
    closeIngestModal();
    if (CURRENT_PAGE === 'attention') renderAttention();
  } catch (err) {
    showToast(`Ingestion Error: ${err.message}`);
  } finally {
    btn.disabled = false;
    btn.textContent = '⚡ Run Ingestion Pipeline (Clean & Chunk)';
  }
}

// ── FOUNDER & BRAND PROFILE MODAL HANDLERS ───────────────────────────────────
function openFounderProfileModal() {
  document.getElementById('founder-profile-modal').classList.remove('hidden');
}

function closeFounderProfileModal() {
  document.getElementById('founder-profile-modal').classList.add('hidden');
}

async function handleSaveFounderProfile(e) {
  e.preventDefault();
  const fpPayload = {
    name: document.getElementById('fp-name').value.trim(),
    title: document.getElementById('fp-title').value.trim(),
    expertise: document.getElementById('fp-expertise').value.split(',').map(s => s.trim()).filter(Boolean),
    story: document.getElementById('fp-story').value.trim()
  };

  const bpPayload = {
    brandName: 'ASENZO Growth OS',
    tone: document.getElementById('bp-tone').value.trim(),
    directness: document.getElementById('bp-directness').value,
    wordsToUse: document.getElementById('bp-words-use').value.split(',').map(s => s.trim()).filter(Boolean),
    wordsToAvoid: document.getElementById('bp-words-avoid').value.split(',').map(s => s.trim()).filter(Boolean)
  };

  try {
    if (window.ASENZO_API) {
      await window.ASENZO_API.saveFounderProfile(fpPayload);
      await window.ASENZO_API.saveBrandProfile(bpPayload);
    }
    closeFounderProfileModal();
    showToast('Saved Founder & Brand Profile!');
    if (CURRENT_PAGE === 'attention') renderAttention();
  } catch (err) {
    showToast(`Profile Error: ${err.message}`);
  }
}

// ── SEARCH VAULT CHUNKS & ARCHIVE ────────────────────────────────────────────
async function handleSearchVaultChunks(query) {
  const resultsEl = document.getElementById('vault-search-results');
  if (!query || query.trim().length < 2) {
    resultsEl.classList.add('hidden');
    return;
  }

  try {
    if (window.ASENZO_API) {
      const res = await window.ASENZO_API.searchKnowledgeChunks(query);
      if (!res || !res.chunks || res.chunks.length === 0) {
        resultsEl.innerHTML = `<div style="font-size:12px;color:#94A3B8">No matching semantic chunks found for "${query}".</div>`;
      } else {
        resultsEl.innerHTML = `
          <div style="font-weight:700;color:#0F172A;font-size:12px;margin-bottom:6px">Matched ${res.chunks.length} Semantic Chunks for "${query}":</div>
          <div style="display:flex;flex-direction:column;gap:6px">
            ${res.chunks.map(c => `
              <div style="background:#FFFFFF;padding:8px 10px;border-radius:6px;border:1px solid #E2E8F0;font-size:11.5px">
                <strong style="color:#2563EB">${c.source_title || 'Knowledge Source'}:</strong> "${c.chunk_text}"
              </div>
            `).join('')}
          </div>
        `;
      }
      resultsEl.classList.remove('hidden');
    }
  } catch (err) {
    console.warn('Search error:', err.message);
  }
}

async function handleDeleteKnowledgeSource(id) {
  if (!confirm('Archive this knowledge source and purge its indexed chunks?')) return;
  try {
    if (window.ASENZO_API) {
      await window.ASENZO_API.deleteKnowledgeSource(id);
      KNOWLEDGE_ITEMS = KNOWLEDGE_ITEMS.filter(k => String(k.id) !== String(id));
      showToast('Knowledge source archived and chunks purged');
      if (CURRENT_PAGE === 'attention') renderAttention();
    }
  } catch (err) {
    showToast(`Delete Error: ${err.message}`);
  }
}

async function inspectKnowledgeSourceChunks(id) {
  try {
    if (window.ASENZO_API) {
      const res = await window.ASENZO_API.getKnowledgeSourceById(id);
      alert(`Source: ${res.title}\nTotal Chunks: ${res.chunk_count}\n\nChunk 1 Snippet:\n"${res.chunks?.[0]?.chunk_text || 'N/A'}"`);
    }
  } catch (err) {
    showToast(`Inspect Error: ${err.message}`);
  }
}

function selectGeneratedHook(idx) {
  if (!GENERATED_SCRIPT_DATA) return;
  SELECTED_HOOK_TEXT = GENERATED_SCRIPT_DATA.hookOptions[idx];
  document.querySelectorAll('.hook-opt-btn').forEach((btn, i) => {
    btn.classList.toggle('selected', i === idx);
  });
}

async function handleSaveGeneratedScriptToKanban() {
  if (!GENERATED_SCRIPT_DATA) return;

  const payload = {
    title: GENERATED_SCRIPT_DATA.topic,
    pillar: GENERATED_SCRIPT_DATA.pillar,
    stage: 'Script',
    hookType: GENERATED_SCRIPT_DATA.hookType,
    hookText: SELECTED_HOOK_TEXT,
    bodyScript: document.getElementById('gen-body-script').value,
    cta: document.getElementById('gen-cta').value,
    targetPlatform: 'LinkedIn'
  };

  try {
    if (window.ASENZO_API) {
      const created = await window.ASENZO_API.createContentItem(payload);
      CONTENT_ITEMS.unshift(created);
    } else {
      CONTENT_ITEMS.unshift({ id: Date.now(), ...payload });
    }
    closeScriptGeneratorModal();
    showToast('Saved script to Content Pipeline (Human Approved)!');
    if (CURRENT_PAGE === 'attention') renderAttention();
  } catch (err) {
    showToast(`Save Error: ${err.message}`);
  }
}

// ── KANBAN VIEW & DRAG AND DROP HANDLERS ────────────────────────────────────
let PIPELINE_VIEW_MODE = 'ACTIVE';

function setPipelineViewMode(mode) {
  PIPELINE_VIEW_MODE = mode;
  if (CURRENT_PAGE === 'attention') renderAttention();
}

function handleKanbanDragStart(e, id) {
  e.dataTransfer.setData('text/plain', id);
  e.currentTarget.classList.add('dragging');
}

function handleKanbanDragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('drag-over');
}

function handleKanbanDragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}

async function handleKanbanDrop(e, targetStage) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  const id = e.dataTransfer.getData('text/plain');
  const item = CONTENT_ITEMS.find(c => String(c.id) === String(id));
  if (!item) return;

  const currentStage = (item.lifecycle_status || item.stage || 'DRAFT').toUpperCase();
  if (currentStage === targetStage) return;

  // Optimistic UI Update
  item.lifecycle_status = targetStage;
  if (CURRENT_PAGE === 'attention') renderAttention();

  try {
    const updated = await window.ASENZO_API.transitionContentStage(id, targetStage);
    const idx = CONTENT_ITEMS.findIndex(c => String(c.id) === String(id));
    if (idx !== -1) CONTENT_ITEMS[idx] = updated;
    showToast(`Moved content asset to ${targetStage}`);
    if (CURRENT_PAGE === 'attention') renderAttention();
  } catch (err) {
    // Rollback on failed mutation
    item.lifecycle_status = currentStage;
    showToast(`Transition Error: ${err.message}`);
    if (CURRENT_PAGE === 'attention') renderAttention();
  }
}

// ── PRODUCTION WORKSPACE SUB-TABS & HANDLERS ──────────────────────────────
function switchPwTab(tabName) {
  const tabs = ['script', 'assets', 'publish', 'analytics', 'versions'];
  tabs.forEach(t => {
    const el = document.getElementById(`pw-tab-${t}`);
    const btn = document.getElementById(`tab-btn-pw-${t}`);
    if (el) el.classList.toggle('hidden', t !== tabName);
    if (btn) btn.classList.toggle('active', t === tabName);
  });
}

function openProductionWorkspaceModal(id) {
  const item = CONTENT_ITEMS.find(c => String(c.id) === String(id));
  if (!item) return;

  const currentStage = (item.lifecycle_status || item.stage || 'DRAFT').toUpperCase();

  document.getElementById('pw-item-id').value = item.id;
  document.getElementById('pw-title-heading').textContent = item.title;
  document.getElementById('pw-stage-badge').textContent = currentStage;
  document.getElementById('pw-score-badge').textContent = `Score: ${item.score || 85}/100`;

  document.getElementById('pw-title').value = item.title;
  document.getElementById('pw-pillar').value = item.pillar_id || item.pillar || 'Positioning';
  document.getElementById('pw-stage').value = currentStage;
  document.getElementById('pw-platform').value = item.primary_platform || item.target_platform || item.targetPlatform || 'LINKEDIN';
  document.getElementById('pw-owner').value = item.owner || 'Alex Morgan';
  document.getElementById('pw-deadline').value = item.deadline ? item.deadline.split('T')[0] : '';
  document.getElementById('pw-hook').value = item.hook_text || item.hookText || '';
  document.getElementById('pw-body').value = item.body_script || item.bodyScript || '';
  document.getElementById('pw-cta').value = item.cta || '';
  document.getElementById('pw-dms').value = item.dms || 0;
  document.getElementById('pw-leads').value = item.qualified_leads || item.qualifiedLeads || 0;
  document.getElementById('pw-ad-candidate').value = String(Boolean(item.is_ad_candidate || item.ad_candidate || item.adCandidate));

  // Reset tab
  switchPwTab('script');

  // Asynchronously load assets & version history
  loadPwAssets(item.id);
  loadPwVersions(item.id);

  document.getElementById('production-workspace-modal').classList.remove('hidden');
}

function closeProductionWorkspaceModal() {
  document.getElementById('production-workspace-modal').classList.add('hidden');
}

async function loadPwAssets(contentId) {
  const container = document.getElementById('pw-assets-list');
  if (!container) return;
  try {
    const assets = await window.ASENZO_API.getContentAssets(contentId);
    if (!assets || assets.length === 0) {
      container.innerHTML = `<div style="padding:20px;text-align:center;color:#64748B;background:#F8FAFC;border:1px dashed #CBD5E1;border-radius:8px;grid-column:span 2">No creative assets attached yet. Add an asset link below.</div>`;
      return;
    }
    container.innerHTML = assets.map(a => `
      <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:10px">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span class="sb-badge blue">${a.asset_type}</span>
          <span style="font-size:10px;color:#94A3B8">${(a.created_at || '').split('T')[0]}</span>
        </div>
        <div style="font-size:11px;word-break:break-all;color:#2563EB;margin-top:6px;font-weight:600">${a.file_url}</div>
        ${a.caption ? `<div style="font-size:11px;color:#475569;margin-top:4px">${a.caption}</div>` : ''}
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = `<div style="color:#EF4444;font-size:12px;grid-column:span 2">Failed to load assets: ${err.message}</div>`;
  }
}

async function handleAddContentAsset() {
  const contentId = document.getElementById('pw-item-id').value;
  const assetType = document.getElementById('pw-new-asset-type').value;
  const fileUrl = document.getElementById('pw-new-asset-url').value.trim();
  if (!fileUrl) { showToast('Please enter a valid file URL'); return; }

  try {
    await window.ASENZO_API.addContentAsset(contentId, { assetType, fileUrl });
    document.getElementById('pw-new-asset-url').value = '';
    showToast('Attached creative asset!');
    loadPwAssets(contentId);
  } catch (err) {
    showToast(`Asset Error: ${err.message}`);
  }
}

async function loadPwVersions(contentId) {
  const container = document.getElementById('pw-versions-list');
  if (!container) return;
  try {
    const versions = await window.ASENZO_API.getContentVersions(contentId);
    if (!versions || versions.length === 0) {
      container.innerHTML = `<div style="padding:20px;text-align:center;color:#64748B;background:#F8FAFC;border:1px dashed #CBD5E1;border-radius:8px">No version snapshots found.</div>`;
      return;
    }
    container.innerHTML = versions.map(v => `
      <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:10px;display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-size:12px;font-weight:700;color:#0F172A">Version ${v.version_number} <span class="sb-badge">${v.created_by}</span></div>
          <div style="font-size:11px;color:#475569;margin-top:2px">"${(v.hook_text || '').substring(0, 50)}..."</div>
          <div style="font-size:10px;color:#94A3B8;margin-top:2px">${v.created_at}</div>
        </div>
        <button type="button" class="btn btn-secondary btn-sm" onclick="handleRestoreContentVersion('${contentId}', ${v.version_number}, '${v.hook_text ? encodeURIComponent(v.hook_text) : ''}', '${v.body_script ? encodeURIComponent(v.body_script) : ''}')">
          Restore V${v.version_number}
        </button>
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = `<div style="color:#EF4444;font-size:12px">Failed to load version history: ${err.message}</div>`;
  }
}

function handleRestoreContentVersion(contentId, verNum, hookEnc, bodyEnc) {
  if (hookEnc) document.getElementById('pw-hook').value = decodeURIComponent(hookEnc);
  if (bodyEnc) document.getElementById('pw-body').value = decodeURIComponent(bodyEnc);
  switchPwTab('script');
  showToast(`Restored script from Version ${verNum}! Remember to save workspace changes.`);
}

async function handleDuplicateContentAction() {
  const contentId = document.getElementById('pw-item-id').value;
  try {
    const duplicated = await window.ASENZO_API.duplicateContent(contentId);
    CONTENT_ITEMS.unshift(duplicated);
    closeProductionWorkspaceModal();
    showToast(`Duplicated content asset to DRAFT: "${duplicated.title}"`);
    if (CURRENT_PAGE === 'attention') renderAttention();
  } catch (err) {
    showToast(`Duplicate Error: ${err.message}`);
  }
}

async function handleScheduleContentAction() {
  const contentId = document.getElementById('pw-item-id').value;
  const schedDate = document.getElementById('pw-schedule-date').value;
  try {
    const res = await window.ASENZO_API.scheduleContent(contentId, schedDate ? new Date(schedDate).toISOString() : undefined);
    const idx = CONTENT_ITEMS.findIndex(c => String(c.id) === String(contentId));
    if (idx !== -1) CONTENT_ITEMS[idx] = res.content;
    closeProductionWorkspaceModal();
    showToast('Content scheduled successfully!');
    if (CURRENT_PAGE === 'attention') renderAttention();
  } catch (err) {
    showToast(`Scheduling Error: ${err.message}`);
  }
}

async function handleExecutePublishAction() {
  const contentId = document.getElementById('pw-item-id').value;
  const postUrl = document.getElementById('pw-publish-url').value.trim();
  try {
    const res = await window.ASENZO_API.publishContent(contentId, postUrl);
    const idx = CONTENT_ITEMS.findIndex(c => String(c.id) === String(contentId));
    if (idx !== -1) CONTENT_ITEMS[idx] = res.content;

    const box = document.getElementById('pw-publish-status-box');
    if (box) {
      box.classList.remove('hidden');
      box.innerHTML = `✅ Published confirmed! <a href="${res.postUrl}" target="_blank" style="color:#2563EB;text-decoration:underline">View Post (${res.postUrl})</a>`;
    }
    showToast('Publishing workflow confirmed successfully!');
    if (CURRENT_PAGE === 'attention') renderAttention();
  } catch (err) {
    showToast(`Publishing Error: ${err.message}`);
  }
}

async function handleSaveProductionWorkspace(e) {
  e.preventDefault();
  const id = document.getElementById('pw-item-id').value;
  const payload = {
    title: document.getElementById('pw-title').value.trim(),
    pillarId: document.getElementById('pw-pillar').value,
    lifecycleStatus: document.getElementById('pw-stage').value,
    primaryPlatform: document.getElementById('pw-platform').value,
    owner: document.getElementById('pw-owner').value.trim(),
    deadline: document.getElementById('pw-deadline').value,
    hookText: document.getElementById('pw-hook').value.trim(),
    bodyScript: document.getElementById('pw-body').value.trim(),
    cta: document.getElementById('pw-cta').value.trim(),
    isAdCandidate: document.getElementById('pw-ad-candidate').value === 'true'
  };

  try {
    if (window.ASENZO_API) {
      const updated = await window.ASENZO_API.updateContent(id, payload);
      const idx = CONTENT_ITEMS.findIndex(c => String(c.id) === String(id));
      if (idx !== -1) CONTENT_ITEMS[idx] = updated;
    }
    closeProductionWorkspaceModal();
    showToast('Updated asset in Production Workspace!');
    if (CURRENT_PAGE === 'attention') renderAttention();
  } catch (err) {
    showToast(`Update Error: ${err.message}`);
  }
}

async function handleDeleteContentItem() {
  const id = document.getElementById('pw-item-id').value;
  if (!id) return;
  if (!confirm('Are you sure you want to soft-delete this content asset?')) return;

  try {
    if (window.ASENZO_API) {
      await window.ASENZO_API.deleteContent(id);
      CONTENT_ITEMS = CONTENT_ITEMS.filter(c => String(c.id) !== String(id));
    }
    closeProductionWorkspaceModal();
    showToast('Soft-deleted content asset');
    if (CURRENT_PAGE === 'attention') renderAttention();
  } catch (err) {
    showToast(`Delete Error: ${err.message}`);
  }
}

// ── KNOWLEDGE VAULT MODAL LOGIC ──────────────────────────────────────────────
function openKnowledgeModal() {
  document.getElementById('knowledge-vault-modal').classList.remove('hidden');
}
function closeKnowledgeModal() {
  document.getElementById('knowledge-vault-modal').classList.add('hidden');
}
async function handleCreateKnowledge(e) {
  e.preventDefault();
  const payload = {
    title: document.getElementById('kn-title').value.trim(),
    category: document.getElementById('kn-category').value,
    content: document.getElementById('kn-content').value.trim(),
    tags: ['FounderVoice', 'Authority']
  };

  try {
    if (window.ASENZO_API) {
      await window.ASENZO_API.addKnowledge(payload);
      KNOWLEDGE_ITEMS = await window.ASENZO_API.getKnowledge();
    }
    closeKnowledgeModal();
    showToast('Added asset to Founder Knowledge Vault!');
    if (CURRENT_PAGE === 'attention') renderAttention();
  } catch (err) {
    showToast(`Error: ${err.message}`);
  }
}

// ── MARKET INTEL MODAL LOGIC ─────────────────────────────────────────────────
function openMarketIntelModal() {
  document.getElementById('market-intel-modal').classList.remove('hidden');
}
function closeMarketIntelModal() {
  document.getElementById('market-intel-modal').classList.add('hidden');
}
async function handleCreateMarketIntel(e) {
  e.preventDefault();
  const payload = {
    title: document.getElementById('mi-title').value.trim(),
    source: document.getElementById('mi-source').value.trim() || 'Niche Observation',
    insight: document.getElementById('mi-insight').value.trim(),
    viralFactor: 'High'
  };

  try {
    if (window.ASENZO_API) {
      await window.ASENZO_API.addMarketIntel(payload);
      MARKET_INTEL_ITEMS = await window.ASENZO_API.getMarketIntel();
    }
    closeMarketIntelModal();
    showToast('Logged Market Intelligence observation!');
    if (CURRENT_PAGE === 'attention') renderAttention();
  } catch (err) {
    showToast(`Error: ${err.message}`);
  }
}

async function handleApplyRecommendation(id) {
  try {
    if (window.ASENZO_API) {
      const res = await window.ASENZO_API.applyRecommendation(id);
      showToast(res.message || 'Applied recommendation');
      AI_RECOMMENDATIONS = await window.ASENZO_API.getRecommendations();
      if (CURRENT_PAGE === 'attention') renderAttention();
    }
  } catch (err) {
    showToast(`Error: ${err.message}`);
  }
}

// ── OTHER MODALS (CONVERSION, OPERATOR, CALENDAR) ───────────────────────────
function openDealModal() { document.getElementById('deal-modal').classList.remove('hidden'); }
function closeDealModal() { document.getElementById('deal-modal').classList.add('hidden'); }
function handleCreateDeal(e) {
  e.preventDefault();
  const name = document.getElementById('deal-name').value;
  const stage = document.getElementById('deal-stage').value;
  const val = Number(document.getElementById('deal-val').value);
  const notes = document.getElementById('deal-notes').value;

  DEALS.push({ id: Date.now(), name, stage, val, objection: notes || 'None' });
  closeDealModal();
  showToast(`Added deal "${name}" to ${stage}`);
  if (CURRENT_PAGE === 'conversion') renderConversion();
}

function openSopModal() { document.getElementById('sop-modal').classList.remove('hidden'); }
function closeSopModal() { document.getElementById('sop-modal').classList.add('hidden'); }
function handleCreateSOP(e) {
  e.preventDefault();
  const title = document.getElementById('sop-title').value;
  const engine = document.getElementById('sop-engine').value;
  const stepsRaw = document.getElementById('sop-steps').value;
  const steps = stepsRaw.split('\n').filter(s => s.trim().length > 0);

  SOPS.push({ id: Date.now(), title, engine, steps });
  closeSopModal();
  showToast(`Published SOP "${title}"`);
  if (CURRENT_PAGE === 'operator') renderOperator();
}

function openEventModal() { document.getElementById('event-modal').classList.remove('hidden'); }
function closeEventModal() { document.getElementById('event-modal').classList.add('hidden'); }
function handleCreateEvent(e) {
  e.preventDefault();
  const title = document.getElementById('evt-title').value;
  const day = document.getElementById('evt-day').value;
  const time = document.getElementById('evt-time').value;
  const type = document.getElementById('evt-type').value;

  const dayObj = CALENDAR_EVENTS.find(d => d.day === day);
  if (dayObj) {
    dayObj.events.push({ time, text: title, type });
  }

  closeEventModal();
  showToast(`Scheduled event "${title}" on ${day}`);
  if (CURRENT_PAGE === 'calendar') renderCalendar();
}

// ── SVG LINE & DONUT CHARTS ────────────────────────────────────────────────
function renderSVGLineChart(tf) {
  const width = 680;
  const height = 230;
  const padL = 40; const padR = 20; const padT = 20; const padB = 30;
  const pts = [140, 190, 240, 310, 380, 440, 520];
  const count = pts.length;
  const maxVal = 600;

  const getX = i => padL + i * ((width - padL - padR) / (count - 1));
  const getY = v => height - padB - (v / maxVal) * (height - padT - padB);

  let d = `M ${getX(0)} ${getY(pts[0])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const x0 = getX(i); const y0 = getY(pts[i]);
    const x1 = getX(i + 1); const y1 = getY(pts[i + 1]);
    const mx = (x0 + x1) / 2;
    d += ` C ${mx} ${y0}, ${mx} ${y1}, ${x1} ${y1}`;
  }

  const area = d + ` L ${getX(count - 1)} ${height - padB} L ${getX(0)} ${height - padB} Z`;

  return `
    <svg viewBox="0 0 ${width} ${height}" style="width:100%;height:100%">
      <defs>
        <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#10B981" stop-opacity="0.30"/>
          <stop offset="100%" stop-color="#10B981" stop-opacity="0.0"/>
        </linearGradient>
      </defs>
      <path d="${area}" fill="url(#gradGreen)"/>
      <path d="${d}" fill="none" stroke="#10B981" stroke-width="3" stroke-linecap="round"/>
      ${pts.map((v, i) => `<circle cx="${getX(i)}" cy="${getY(v)}" r="4" fill="#10B981" stroke="#FFFFFF" stroke-width="2"/>`).join('')}
    </svg>
  `;
}

function renderSVGDonutChart() {
  return `
    <svg viewBox="0 0 100 100" style="width:100%;height:100%;transform:rotate(-90deg)">
      <circle cx="50" cy="50" r="38" fill="none" stroke="#F1F5F9" stroke-width="14"/>
      <circle cx="50" cy="50" r="38" fill="none" stroke="#0284C7" stroke-width="14" stroke-dasharray="131 238"/>
      <circle cx="50" cy="50" r="38" fill="none" stroke="#F97316" stroke-width="14" stroke-dasharray="47.7 238" stroke-dashoffset="-131"/>
      <circle cx="50" cy="50" r="38" fill="none" stroke="#10B981" stroke-width="14" stroke-dasharray="35.7 238" stroke-dashoffset="-178.7"/>
    </svg>
  `;
}

function setChartTimeframe(tf) {
  CHART_TIMEFRAME = tf;
  document.getElementById('performance-chart-wrap').innerHTML = renderSVGLineChart(tf);
  document.querySelectorAll('.time-pill').forEach(el => {
    el.classList.toggle('active', el.textContent.trim() === tf);
  });
}

// ── AI ADVISOR DRAWER ─────────────────────────────────────────────────────
function openPanel() { document.getElementById('right-panel').classList.add('open'); }
function closePanel() { document.getElementById('right-panel').classList.remove('open'); }

function seedChat() {
  const el = document.getElementById('chat-messages');
  el.innerHTML = chatBubble('ai', "Hello Alex! I am your ASENZO Master AI Growth Coach. Attention OS is fully installed with 23 core systems and live REST database persistence. How can I assist you today?");
}

function chatBubble(role, text) {
  return `
    <div class="chat-msg ${role}">
      <div class="chat-av">${role === 'ai' ? 'AI' : 'A'}</div>
      <div class="chat-bub">${text}</div>
    </div>
  `;
}

function sendMsg() {
  const input = document.getElementById('coach-input');
  const val = input.value.trim();
  if (!val) return;
  const chat = document.getElementById('chat-messages');
  chat.innerHTML += chatBubble('user', val);
  input.value = '';
  chat.scrollTop = chat.scrollHeight;

  setTimeout(() => {
    chat.innerHTML += chatBubble('ai', `Analyzing Attention Engine state... Based on your Business DNA (${POSITIONING.icp}), your highest leverage action is to generate 2 Mechanism posts and review the Ad Amplification candidates.`);
    chat.scrollTop = chat.scrollHeight;
  }, 1000);
}

// ── COMMAND PALETTE (⌘K) ──────────────────────────────────────────────────
const COMMANDS = [
  { label: 'ASENZO Overview', page: 'overview', group: 'Engines' },
  { label: 'Engine 1 — Attention OS', page: 'attention', group: 'Engines' },
  { label: 'Engine 2 — Conversion OS', page: 'conversion', group: 'Engines' },
  { label: 'Engine 3 — Delivery OS', page: 'delivery', group: 'Engines' },
  { label: 'Engine 4 — Intelligence OS', page: 'intelligence', group: 'Engines' },
  { label: 'Engine 5 — Operator OS', page: 'operator', group: 'Engines' },
  { label: '⚡ AI Hook + Script Generator', action: openScriptGeneratorModal, group: 'Attention OS' },
  { label: 'Edit Business DNA Positioning', action: openPositioningModal, group: 'Attention OS' },
  { label: 'Add Founder Knowledge Asset', action: openKnowledgeModal, group: 'Attention OS' },
  { label: 'Log Market Intelligence Observation', action: openMarketIntelModal, group: 'Attention OS' },
  { label: 'Add Deal to CRM', action: openDealModal, group: 'Actions' },
  { label: 'Publish New SOP', action: openSopModal, group: 'Actions' },
  { label: 'Schedule Growth Event', action: openEventModal, group: 'Actions' }
];

function openPalette() {
  document.getElementById('cmd-overlay').classList.remove('hidden');
  setTimeout(() => document.getElementById('cmd-input').focus(), 50);
  filterCmd('');
}

function closePalette() {
  document.getElementById('cmd-overlay').classList.add('hidden');
}

function filterCmd(q) {
  const filtered = q ? COMMANDS.filter(c => c.label.toLowerCase().includes(q.toLowerCase())) : COMMANDS;
  const groups = [...new Set(filtered.map(c => c.group))];
  
  document.getElementById('cmd-results').innerHTML = groups.map(g => `
    <div class="cmd-group-lbl">${g}</div>
    ${filtered.filter(c => c.group === g).map(item => `
      <div class="cmd-item" onclick="runCommand('${item.label}')">
        <span>⚡</span>
        <span>${item.label}</span>
        ${item.page ? `<span class="cmd-item-meta">${item.page}</span>` : ''}
      </div>
    `).join('')}
  `).join('');
}

function runCommand(label) {
  const cmd = COMMANDS.find(c => c.label === label);
  closePalette();
  if (!cmd) return;
  if (cmd.action) cmd.action();
  else if (cmd.page) {
    const nav = document.getElementById('nav-' + cmd.page);
    go(cmd.page, nav || null);
  }
}

function cmdKey(e) {
  if (e.key === 'Enter') {
    const first = document.querySelector('.cmd-item');
    if (first) first.click();
  }
}

function toggleNotifs() {
  showToast('ASENZO Directives: 2 decision nudges available in Engine 1');
}

// ── TOAST NOTIFICATION HELPER ──────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ══════════════════════════════════════════════════════════════════════════════
// ATTENTION OS — AI HOOK & SCRIPT STUDIO FRONTEND LOGIC
// ══════════════════════════════════════════════════════════════════════════════

let ACTIVE_STUDIO_CONTENT_ID = null;
let ACTIVE_HOOK_STYLES = [];
let CURRENT_STUDIO_PLATFORM = 'LINKEDIN';
let CURRENT_STUDIO_SCRIPTS_CACHE = {};

function openAiStudioModal(item) {
  ACTIVE_STUDIO_CONTENT_ID = item ? (item.id || item.converted_content_id || null) : null;
  const topicInput = document.getElementById('ai-studio-topic');
  const painInput = document.getElementById('ai-studio-pain');
  const pillarSelect = document.getElementById('ai-studio-pillar');

  if (item) {
    topicInput.value = item.title || item.hookText || item.hook_text || '';
    painInput.value = item.pain || item.targetPain || '';
  } else if (!topicInput.value) {
    topicInput.value = 'Why standard agency retainers fail bootstrapped B2B founders';
    painInput.value = 'Trapped in 60-hr workweeks serving as single bottleneck';
  }

  // Populate Pillars
  if (pillarSelect) {
    const pillars = window.CONTENT_PILLARS || [];
    pillarSelect.innerHTML = '<option value="">Auto-Select Pillar</option>' +
      pillars.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
  }

  document.getElementById('ai-studio-modal').classList.remove('hidden');
  switchStudioTab('hooks');
  if (ACTIVE_STUDIO_CONTENT_ID) loadContentVersionHistory();
}

function closeAiStudioModal() {
  document.getElementById('ai-studio-modal').classList.add('hidden');
}

function switchStudioTab(tabName) {
  ['hooks', 'script', 'guardrails', 'versions'].forEach(t => {
    const btn = document.getElementById(`tab-btn-studio-${t}`);
    const tab = document.getElementById(`studio-tab-${t}`);
    if (btn) btn.classList.toggle('active', t === tabName);
    if (tab) tab.classList.toggle('hidden', t !== tabName);
  });
}

function toggleHookStyleChip(el) {
  const style = el.getAttribute('data-style');
  if (style === 'all') {
    document.querySelectorAll('#hook-style-chips .style-chip').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    ACTIVE_HOOK_STYLES = [];
  } else {
    document.querySelector('#hook-style-chips .style-chip[data-style="all"]').classList.remove('active');
    el.classList.toggle('active');
    ACTIVE_HOOK_STYLES = Array.from(document.querySelectorAll('#hook-style-chips .style-chip.active'))
      .map(c => c.getAttribute('data-style'))
      .filter(s => s !== 'all');
  }
}

async function runHookGenerator() {
  const topic = document.getElementById('ai-studio-topic').value.trim() || 'Growth Operating System';
  const targetPain = document.getElementById('ai-studio-pain').value.trim();
  const pillarId = document.getElementById('ai-studio-pillar').value;
  const container = document.getElementById('ai-studio-hooks-list');

  container.innerHTML = '<div style="padding:20px;text-align:center;color:#475569">⚡ Assembling Business DNA & Synthesizing Hooks...</div>';

  try {
    const res = await window.ASENZO_API.generateHooks({
      topic,
      targetPain,
      pillarId,
      styles: ACTIVE_HOOK_STYLES,
      count: 3
    });

    if (!res.hooks || res.hooks.length === 0) {
      container.innerHTML = '<div style="padding:16px;color:#EF4444">No hooks generated. Please check topic input.</div>';
      return;
    }

    container.innerHTML = res.hooks.map(h => `
      <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:8px;padding:14px;box-shadow:0 1px 3px rgba(0,0,0,0.04)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <div style="display:flex;gap:6px;align-items:center">
            <span class="sb-badge blue">${h.style.toUpperCase()}</span>
            <span class="sb-badge green">Score: ${h.score}/100</span>
            <span class="sb-badge gray">Confidence: ${h.confidence}%</span>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" onclick="selectStudioHook('${escapeHtml(h.text)}')">
            🎯 Use This Hook
          </button>
        </div>
        <div style="font-size:13.5px;font-weight:700;color:#0F172A;margin-bottom:6px;line-height:1.4">"${escapeHtml(h.text)}"</div>
        <div style="font-size:12px;color:#64748B;font-style:italic;margin-bottom:4px">💡 ${escapeHtml(h.reasoning)}</div>
        ${h.warnings && h.warnings.length > 0 ? `
          <div style="font-size:11px;color:#B91C1C;background:#FEF2F2;border:1px solid #FCA5A5;border-radius:4px;padding:4px 8px;margin-top:6px">
            ⚠️ ${escapeHtml(h.warnings.join(' | '))}
          </div>
        ` : ''}
      </div>
    `).join('');

    showToast(`Generated ${res.hooks.length} Hooks across styles!`);
  } catch (err) {
    container.innerHTML = `<div style="padding:16px;color:#EF4444">Error: ${escapeHtml(err.message)}</div>`;
  }
}

function selectStudioHook(hookText) {
  document.getElementById('sec-hook').value = hookText;
  switchStudioTab('script');
  showToast('Hook copied to Script Synthesizer!');
  triggerDraftValidation();
}

function selectScriptPlatform(platform) {
  CURRENT_STUDIO_PLATFORM = platform;
  document.querySelectorAll('#script-platform-selector .plat-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-platform') === platform);
  });

  if (CURRENT_STUDIO_SCRIPTS_CACHE[platform]) {
    loadCachedScriptPlatform(platform);
  } else {
    runScriptSynthesizer();
  }
}

async function runScriptSynthesizer() {
  const topic = document.getElementById('ai-studio-topic').value.trim() || 'Growth Operating System';
  const targetPain = document.getElementById('ai-studio-pain').value.trim();
  const pillarId = document.getElementById('ai-studio-pillar').value;
  const selectedHook = document.getElementById('sec-hook').value.trim();

  try {
    const res = await window.ASENZO_API.generateProductionScript({
      topic,
      targetPain,
      pillarId,
      selectedHook,
      platforms: ['LINKEDIN', 'X', 'INSTAGRAM', 'YOUTUBE_SHORT', 'CAROUSEL', 'EMAIL', 'NEWSLETTER', 'BLOG']
    });

    if (res.platforms && res.platforms.length > 0) {
      res.platforms.forEach(p => {
        CURRENT_STUDIO_SCRIPTS_CACHE[p.platform] = p;
      });
      loadCachedScriptPlatform(CURRENT_STUDIO_PLATFORM);
      showToast(`Synthesized scripts for 8 platforms!`);
    }
  } catch (err) {
    showToast(`Script Generation Error: ${err.message}`);
  }
}

function loadCachedScriptPlatform(platform) {
  const data = CURRENT_STUDIO_SCRIPTS_CACHE[platform];
  if (!data) return;

  const secs = data.structuredSections || {};
  document.getElementById('sec-hook').value = secs.hook || '';
  document.getElementById('sec-context').value = secs.context || '';
  document.getElementById('sec-problem').value = secs.problem || '';
  document.getElementById('sec-insight').value = secs.insight || '';
  document.getElementById('sec-mechanism').value = secs.mechanism || '';
  document.getElementById('sec-proof').value = secs.proof || '';
  document.getElementById('sec-cta').value = secs.cta || '';

  document.getElementById('script-full-text').value = data.fullScript || '';
  renderGuardrailsResult(data.guardrailResult);
}

function triggerDraftValidation() {
  const hook = document.getElementById('sec-hook').value;
  const context = document.getElementById('sec-context').value;
  const problem = document.getElementById('sec-problem').value;
  const insight = document.getElementById('sec-insight').value;
  const mechanism = document.getElementById('sec-mechanism').value;
  const proof = document.getElementById('sec-proof').value;
  const cta = document.getElementById('sec-cta').value;

  const assembled = `${hook}\n\n${context}\n\nProblem: ${problem}\n\n${insight}\n\nMechanism:\n${mechanism}\n\n${proof}\n\n${cta}`;
  document.getElementById('script-full-text').value = assembled;
}

async function runDraftValidation() {
  const fullText = document.getElementById('script-full-text').value;
  try {
    const result = await window.ASENZO_API.validateGuardrails({ scriptText: fullText });
    renderGuardrailsResult(result);
    showToast('Guardrails re-validated!');
  } catch (err) {
    showToast(`Validation Error: ${err.message}`);
  }
}

function renderGuardrailsResult(g) {
  if (!g) return;

  document.getElementById('ai-studio-score-badge').textContent = `Overall Score: ${g.overallScore}/100`;
  document.getElementById('g-score-overall').textContent = `${g.overallScore}/100`;
  document.getElementById('g-score-icp').textContent = `${g.icpScore}/100`;
  document.getElementById('g-score-pos').textContent = `${g.positioningScore}/100`;
  document.getElementById('g-score-voice').textContent = `${g.brandVoiceScore}/100`;
  document.getElementById('g-score-proof').textContent = `${g.proofScore}/100`;

  // Proof Gap Alert
  const gapAlert = document.getElementById('ai-studio-proof-gap-alert');
  const gapText = document.getElementById('ai-studio-proof-gap-text');
  if (g.proofGap && g.proofGaps && g.proofGaps.length > 0) {
    gapAlert.classList.remove('hidden');
    gapText.textContent = g.proofGaps.map(pg => pg.detail).join(' | ');
  } else {
    gapAlert.classList.add('hidden');
  }

  // Violations & Warnings
  document.getElementById('ai-studio-violations').innerHTML = (g.violations && g.violations.length > 0)
    ? g.violations.map(v => `<div>❌ ${escapeHtml(v)}</div>`).join('')
    : '<div style="color:#10B981">✅ Zero Brand Voice Violations</div>';

  document.getElementById('ai-studio-warnings').innerHTML = (g.warnings && g.warnings.length > 0)
    ? g.warnings.map(w => `<div>⚠️ ${escapeHtml(w)}</div>`).join('')
    : '<div style="color:#10B981">✅ All Quality Checks Passed</div>';
}

async function saveStudioVersion(approvalStatus = 'DRAFT') {
  if (!ACTIVE_STUDIO_CONTENT_ID) {
    // Create new content asset first
    try {
      const title = document.getElementById('ai-studio-topic').value.trim() || 'Untitled Growth Post';
      const created = await window.ASENZO_API.createContent({
        title,
        primaryPlatform: CURRENT_STUDIO_PLATFORM,
        lifecycleStatus: 'DRAFT'
      });
      ACTIVE_STUDIO_CONTENT_ID = created.id;
    } catch (err) {
      showToast(`Error creating content record: ${err.message}`);
      return;
    }
  }

  const payload = {
    contentId: ACTIVE_STUDIO_CONTENT_ID,
    hookText: document.getElementById('sec-hook').value.trim(),
    bodyScript: document.getElementById('script-full-text').value.trim(),
    cta: document.getElementById('sec-cta').value.trim(),
    platform: CURRENT_STUDIO_PLATFORM,
    createdBy: 'HUMAN_OPERATOR',
    approvalStatus
  };

  try {
    const res = await window.ASENZO_API.saveContentVersion(ACTIVE_STUDIO_CONTENT_ID, payload);
    showToast(`Saved Content Version #${res.version.versionNumber} (${approvalStatus})!`);
    loadContentVersionHistory();
    if (CURRENT_PAGE === 'attention') renderAttention();
  } catch (err) {
    showToast(`Version Save Error: ${err.message}`);
  }
}

async function loadContentVersionHistory() {
  if (!ACTIVE_STUDIO_CONTENT_ID) return;
  const container = document.getElementById('ai-studio-versions-list');

  try {
    const versions = await window.ASENZO_API.getContentVersions(ACTIVE_STUDIO_CONTENT_ID);
    if (!versions || versions.length === 0) {
      container.innerHTML = '<div style="padding:16px;text-align:center;color:#64748B">No saved versions yet.</div>';
      return;
    }

    container.innerHTML = versions.map(v => `
      <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:8px;padding:12px 14px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <div style="display:flex;gap:6px;align-items:center">
            <span class="sb-badge blue">Version ${v.version_number}</span>
            <span class="sb-badge gray">${v.created_by}</span>
            <span class="sb-badge green">${new Date(v.created_at).toLocaleString()}</span>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" onclick="restoreStudioVersion('${escapeHtml(v.hook_text)}', '${escapeHtml(v.body_script)}', '${escapeHtml(v.cta)}')">
            🔄 Load Into Editor
          </button>
        </div>
        <div style="font-size:12.5px;font-weight:700;color:#0F172A">"${escapeHtml(v.hook_text || 'No Hook')}"</div>
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = `<div style="padding:12px;color:#EF4444">Error loading versions: ${escapeHtml(err.message)}</div>`;
  }
}

function restoreStudioVersion(hook, body, cta) {
  document.getElementById('sec-hook').value = hook || '';
  document.getElementById('script-full-text').value = body || '';
  document.getElementById('sec-cta').value = cta || '';
  switchStudioTab('script');
  showToast('Loaded selected version into editor!');
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
