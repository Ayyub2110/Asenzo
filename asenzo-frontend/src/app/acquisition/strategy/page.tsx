"use client";

import React, { useState } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "business", label: "Business & Offer" },
  { id: "audience", label: "Audience Intelligence" },
  { id: "awareness", label: "Content Strategy & Content Pillars" },
  { id: "positioning", label: "Positioning" },
  { id: "priorities", label: "Priorities" },
];

const AWARENESS_LEVELS = [
  { id: "unaware", level: 1, name: "Unaware", tone: "TOF", color: "#6B7280", goal: "Attention & Pattern Interruption", content: ["Identity content", "Relatable stories", "Curiosity hooks", "Contrarian takes", "Cultural observations", "Problem discovery"] },
  { id: "problem", level: 2, name: "Problem-Aware", tone: "TOF / MOF", color: "#8B5CF6", goal: "Diagnosis & Belief Change", content: ["Problem articulation", "Myth busting", "Root cause analysis", "Cost of inaction", "Pain education"] },
  { id: "solution", level: 3, name: "Solution-Aware", tone: "MOF", color: "#2563EB", goal: "Education & Mechanism", content: ["Frameworks", "How-to", "Mechanisms", "Comparisons", "New method"] },
  { id: "product", level: 4, name: "Product-Aware", tone: "MOF / BOF", color: "#D97706", goal: "Credibility & Proof", content: ["Case studies", "Testimonials", "Differentiation", "Process reveals", "Objection handling"] },
  { id: "most", level: 5, name: "Most-Aware", tone: "BOF", color: "#16A34A", goal: "Decision & Conversion", content: ["Direct offers", "Risk reduction", "FAQ", "Urgency", "Direct CTA"] },
];

const CONTENT_BALANCE = [
  { stage: "Unaware", planned: 12, published: 10, target: 10, status: "On Track", statusColor: "text-emerald-600 bg-emerald-50" },
  { stage: "Problem-Aware", planned: 8, published: 8, target: 8, status: "On Track", statusColor: "text-emerald-600 bg-emerald-50" },
  { stage: "Solution-Aware", planned: 4, published: 4, target: 6, status: "Behind", statusColor: "text-amber-600 bg-amber-50" },
  { stage: "Product-Aware", planned: 1, published: 1, target: 5, status: "Critical", statusColor: "text-red-600 bg-red-50" },
  { stage: "Most-Aware", planned: 0, published: 0, target: 4, status: "Critical", statusColor: "text-red-600 bg-red-50" },
];

const STRATEGIC_PURPOSES = [
  { id: "KNOW", label: "KNOW", desc: "Frameworks · How-to · Tactical education", color: "#2563EB" },
  { id: "BELIEVE", label: "BELIEVE", desc: "Mindset · Contrarian · Myth-busting", color: "#8B5CF6" },
  { id: "TRUST", label: "TRUST", desc: "Proof · Results · Case studies · BTS", color: "#16A34A" },
  { id: "IDENTITY", label: "IDENTITY", desc: "Journey · Values · Personality", color: "#D97706" },
];

// ─── Component ─────────────────────────────────────────────────────────────────
export default function StrategyPage() {
  const [activeTab, setActiveTab] = useState("business");
  const [business, setBusiness] = useState({
    whatWeD: "We help B2B founders build a content-led client acquisition system",
    whatWeSell: "Content-led growth system — 90 days from inconsistent to inbound",
    model: "High-ticket service + digital product",
    stage: "Growth (£10k–£30k MRR)",
    primaryGoal: "Predictable inbound qualified leads without paid ads",
    constraint: "MOF content gap — not enough proof/case study content",
    channels: "Instagram, LinkedIn, YouTube",
    platform: "Instagram",
    secondaryPlatforms: "LinkedIn, YouTube",
    currentlyWorks: "Referrals, organic content, direct network",
    currentlyFails: "Cold outreach, paid ads, agency-produced content",
  });
  const [offer, setOffer] = useState({
    coreOffer: "Content-led client acquisition system",
    entryOffer: "7-Day Client Acquisition Guide (Lead Magnet)",
    highTicket: "Done-With-You Growth Program (£5,000+)",
    transformation: "From inconsistent, referral-dependent revenue to predictable inbound clients through content",
    problem: "Inconsistent client acquisition without paid ads or cold outreach",
    mechanism: "Audience-first content system with strategic research → scripting → funnel",
    whyDiff: "Evidence-based audience research instead of guesswork. Every content piece maps to a funnel stage.",
    credibility: "Helped 40+ B2B founders generate consistent inbound leads through content",
    proof: "Average client gets first inbound qualified lead within 21 days of publishing",
    delivery: "Group coaching + 1-1 sessions + async content review",
    objections: "\"I don't have time\" · \"I've tried content before\" · \"I need clients now, not in 6 months\"",
    buyingDecision: "When they see a peer succeed with it or when they have a critical lead drought moment",
  });
  const [positioning, setPositioning] = useState({
    knownFor: "Content-led client acquisition for B2B founders",
    problemOwned: "Inconsistent client flow for founders who don't want to rely on referrals, cold DMs, or ads",
    belief: "Most founders post the wrong content for the wrong audience at the wrong funnel stage",
    pov: "Audience psychology and research must come first — content without strategy is just noise",
    whatDiff: "We research what is actually working before writing a single word of content",
    claims: "Predictable inbound leads within 90 days for B2B founders with an existing offer",
    refuseToDo: "Vanity growth, follower-chasing, low-ticket funnels, churn-and-burn clients",
    alternatives: "Agency-produced content, generic coaching programs, cold outreach tools",
    positioningSentence: "We help B2B founders attract consistent, qualified clients using evidence-based content — without paid ads, cold outreach, or a large following.",
    offerTransformation: "Go from posting content that looks active but generates no clients, to having inbound enquiries arrive predictably — regardless of follower count.",
  });
  const [pillars, setPillars] = useState([
    { id: "1", name: "Client Acquisition", subs: ["Lead generation", "Content strategy", "DM conversion"] },
    { id: "2", name: "Content Strategy", subs: ["Ideation systems", "Script writing", "Distribution"] },
    { id: "3", name: "Offer Design", subs: ["Positioning", "Productisation", "Pricing"] },
  ]);
  const [newPillar, setNewPillar] = useState("");
  const [evidence, setEvidence] = useState({
    situation: "",
    pain: "",
    desired: "",
    trigger: "",
    objections: "",
    language: "",
    journey: "",
  });
  const [profileAge] = useState(31);
  const profileStale = profileAge >= 30;
  const [priorities, setPriorities] = useState({
    primaryGoal: "Generate 15 qualified inbound DM conversations per month",
    primaryFunnelStage: "MOF — build trust + proof",
    primaryAwarenessGap: "Product-Aware content critically underrepresented",
    primaryPillar: "Client Acquisition",
    primaryChannel: "Instagram",
    bottleneck: "Content frequency at MOF — not enough proof-led posts",
    experiment: "Test daily story sequence with keyword CTA to increase BOF conversions",
  });

  const fieldClass = "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[12px] text-slate-800 bg-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30 transition-colors";
  const textareaClass = `${fieldClass} resize-none`;
  const labelClass = "text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1";

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <aside className="w-44 shrink-0 border-r border-slate-100 pt-6 px-3 space-y-0.5 sticky top-0 h-[calc(100vh-128px)] overflow-y-auto bg-white">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`w-full text-left px-3 py-2 rounded-lg text-[12px] font-semibold transition-colors ${activeTab === tab.id ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`}>
            {tab.label}
          </button>
        ))}
      </aside>

      {/* Main */}
      <main className="flex-1 py-6 px-8 overflow-y-auto max-w-[900px]">

        {/* ── Business & Offer ── */}
        {activeTab === "business" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-[16px] font-bold text-slate-900 mb-0.5">Business & Offer Context</h2>
              <p className="text-[12px] text-slate-500">The strategic foundation that the AI uses to generate content, scripts, and funnel recommendations.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-[12px] font-bold text-slate-700 mb-4">Business</h3>
              <div className="grid grid-cols-2 gap-4">
                {([
                  { key: "whatWeD", label: "What does the business do?", rows: 2 },
                  { key: "whatWeSell", label: "What does it sell?", rows: 2 },
                  { key: "model", label: "Business Model" },
                  { key: "stage", label: "Current Stage of Growth" },
                  { key: "primaryGoal", label: "Primary Acquisition Goal" },
                  { key: "constraint", label: "Current Growth Constraint" },
                  { key: "channels", label: "Current Acquisition Channels" },
                  { key: "platform", label: "Primary Platform" },
                  { key: "currentlyWorks", label: "What currently generates customers?", rows: 2 },
                  { key: "currentlyFails", label: "What currently does NOT work?", rows: 2 },
                ] as { key: keyof typeof business; label: string; rows?: number }[]).map(f => (
                  <div key={f.key} className={f.rows ? "col-span-2" : ""}>
                    <label className={labelClass}>{f.label}</label>
                    {f.rows ? (
                      <textarea rows={f.rows} className={textareaClass} value={business[f.key]}
                        onChange={e => setBusiness(b => ({ ...b, [f.key]: e.target.value }))} />
                    ) : (
                      <input className={fieldClass} value={business[f.key]}
                        onChange={e => setBusiness(b => ({ ...b, [f.key]: e.target.value }))} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-[12px] font-bold text-slate-700 mb-4">Offer</h3>
              <div className="grid grid-cols-2 gap-4">
                {([
                  { key: "coreOffer", label: "Core Offer (in one sentence)" },
                  { key: "entryOffer", label: "Entry / Low-Ticket Offer" },
                  { key: "highTicket", label: "High-Ticket Offer" },
                  { key: "transformation", label: "Transformation (before → after)", rows: 2 },
                  { key: "problem", label: "Problem Solved", rows: 2 },
                  { key: "mechanism", label: "Mechanism (how you solve it)", rows: 2 },
                  { key: "whyDiff", label: "Why This Mechanism Is Different", rows: 2 },
                  { key: "credibility", label: "Credibility / Authority" },
                  { key: "proof", label: "Proof / Results", rows: 2 },
                  { key: "delivery", label: "Delivery Model" },
                  { key: "objections", label: "Main Objections", rows: 2 },
                  { key: "buyingDecision", label: "What triggers the buying decision?", rows: 2 },
                ] as { key: keyof typeof offer; label: string; rows?: number }[]).map(f => (
                  <div key={f.key} className={f.rows ? "col-span-2" : ""}>
                    <label className={labelClass}>{f.label}</label>
                    {f.rows ? (
                      <textarea rows={f.rows ?? 2} className={textareaClass} value={offer[f.key]}
                        onChange={e => setOffer(o => ({ ...o, [f.key]: e.target.value }))} />
                    ) : (
                      <input className={fieldClass} value={offer[f.key]}
                        onChange={e => setOffer(o => ({ ...o, [f.key]: e.target.value }))} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-[12px] font-bold text-slate-700 mb-4">Positioning Inputs</h3>
              <div className="space-y-4">
                {([
                  { key: "knownFor", label: "What do you want to become known for?", rows: 2 },
                  { key: "problemOwned", label: "What problem do you want to own?", rows: 2 },
                  { key: "belief", label: "What do you believe that competitors don't?", rows: 2 },
                  { key: "pov", label: "What is your unique point of view?", rows: 2 },
                  { key: "whatDiff", label: "What makes your approach different?", rows: 2 },
                  { key: "claims", label: "What claims can you credibly make?", rows: 2 },
                  { key: "refuseToDo", label: "What do you refuse to say or do?", rows: 2 },
                  { key: "alternatives", label: "What alternatives/competitors does the audience currently use?", rows: 2 },
                ] as { key: keyof typeof positioning; label: string; rows?: number }[]).map(f => (
                  <div key={f.key}>
                    <label className={labelClass}>{f.label}</label>
                    <textarea rows={f.rows ?? 2} className={textareaClass} value={positioning[f.key]}
                      onChange={e => setPositioning(p => ({ ...p, [f.key]: e.target.value }))} />
                  </div>
                ))}
              </div>
            </div>
            <button className="px-5 py-2.5 bg-slate-900 text-white text-[12px] font-bold rounded-lg hover:bg-slate-800 transition-colors">Save Business & Offer</button>
          </div>
        )}

        {/* ── Audience Intelligence ── */}
        {activeTab === "audience" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-[16px] font-bold text-slate-900 mb-0.5">Audience Intelligence</h2>
              <p className="text-[12px] text-slate-500">Evidence-based. Collect real buyer language — not paraphrased summaries.</p>
            </div>

            {profileStale && (
              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <span className="material-symbols-outlined text-amber-500 text-[18px] mt-0.5">warning</span>
                <div>
                  <p className="text-[12px] font-bold text-amber-700">Profile is {profileAge} days old — re-validation required</p>
                  <p className="text-[11px] text-amber-600 mt-0.5">Re-interview 2–3 current dream clients. Audience sophistication shifts faster than most providers expect.</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {[
                { key: "situation", label: "Current Situation", ask: "What was happening in their business/life before working with you?", placeholder: "Be specific. What did their day-to-day look like? What were they juggling?" },
                { key: "pain", label: "Biggest Pain", ask: "In their exact words — what did they complain about most?", placeholder: '"I post every day and nobody buys." Not: "Lead generation problems."' },
                { key: "desired", label: "Desired Future", ask: "If this was solved tomorrow, what would actually be different?", placeholder: "Go beyond revenue metrics. What changes in their confidence, freedom, daily life?" },
                { key: "trigger", label: "Buying Trigger", ask: "What specific event or moment caused them to finally act?", placeholder: "The exact tipping point — a failed month, a referral drying up, a competitor's success?" },
                { key: "objections", label: "Objections & Fears", ask: "What almost stopped them from working with you?", placeholder: '"I\'ve already tried an agency." What\'s the real fear behind that?' },
                { key: "language", label: "Natural Language", ask: "Exact phrases they used — 3–5 direct quotes.", placeholder: '"I don\'t know where my next client is coming from." — verbatim only.' },
                { key: "journey", label: "Journey Before", ask: "What did they try before finding you? In order.", placeholder: "YouTube → course → freelancer → cold outreach → you" },
              ].map(f => (
                <div key={f.key} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <div className="mb-2">
                    <p className="text-[12px] font-bold text-slate-800">{f.label}</p>
                    <p className="text-[11px] text-slate-400 italic">{f.ask}</p>
                  </div>
                  <textarea
                    rows={3} placeholder={f.placeholder} className={textareaClass}
                    value={(evidence as any)[f.key]}
                    onChange={e => setEvidence(ev => ({ ...ev, [f.key]: e.target.value }))} />
                  {(evidence as any)[f.key] === "" && (
                    <p className="text-[10px] text-slate-300 mt-1">Empty — add client evidence to unlock AI insights</p>
                  )}
                  {(evidence as any)[f.key].length > 0 && (evidence as any)[f.key].length < 30 && (
                    <p className="text-[10px] text-amber-500 mt-1">⚠ This language is too generic. Re-collect the client's actual wording.</p>
                  )}
                </div>
              ))}
            </div>
            <button className="px-5 py-2.5 bg-slate-900 text-white text-[12px] font-bold rounded-lg hover:bg-slate-800 transition-colors">Save Audience Profile</button>
          </div>
        )}

        {/* ── Content Strategy & Content Pillars ── */}
        {activeTab === "awareness" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-[16px] font-bold text-slate-900 mb-0.5">Content Strategy & Content Pillars</h2>
              <p className="text-[12px] text-slate-500">Map your content to awareness stages. Every piece should serve one stage with one goal.</p>
            </div>

            {/* Awareness levels */}
            <div className="space-y-3">
              {AWARENESS_LEVELS.map((level, i) => (
                <div key={level.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 mt-0.5" style={{ backgroundColor: level.color }}>{i + 1}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-[13px] font-bold text-slate-900">{level.name}</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ backgroundColor: `${level.color}18`, color: level.color }}>
                          {level.tone}
                        </span>
                        <span className="text-[10px] text-slate-400">{level.goal}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {level.content.map(c => (
                          <span key={c} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">{c}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Content Balance */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-[13px] font-bold text-slate-900 mb-3">Content Balance</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left pb-2 text-slate-400 font-semibold">Stage</th>
                      <th className="text-center pb-2 text-slate-400 font-semibold">Planned</th>
                      <th className="text-center pb-2 text-slate-400 font-semibold">Published</th>
                      <th className="text-center pb-2 text-slate-400 font-semibold">Target</th>
                      <th className="text-right pb-2 text-slate-400 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {CONTENT_BALANCE.map(row => (
                      <tr key={row.stage}>
                        <td className="py-2 font-semibold text-slate-700">{row.stage}</td>
                        <td className="py-2 text-center text-slate-600">{row.planned}</td>
                        <td className="py-2 text-center text-slate-600">{row.published}</td>
                        <td className="py-2 text-center text-slate-600">{row.target}</td>
                        <td className="py-2 text-right">
                          <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${row.statusColor}`}>{row.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                <p className="text-[11px] text-amber-700 font-semibold">⚠ You're generating awareness but not giving Product-Aware viewers enough proof to move toward the offer. Prioritise case studies and client result posts this fortnight.</p>
              </div>
            </div>

            {/* Strategic Purposes */}
            <div>
              <h3 className="text-[13px] font-bold text-slate-900 mb-3">Strategic Content Purposes</h3>
              <div className="grid grid-cols-4 gap-3">
                {STRATEGIC_PURPOSES.map(p => (
                  <div key={p.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-center">
                    <p className="text-[11px] font-bold mb-1" style={{ color: p.color }}>{p.label}</p>
                    <p className="text-[10px] text-slate-500 leading-tight">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Pillars */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-[13px] font-bold text-slate-900 mb-3">Your Content Pillars</h3>
              <div className="space-y-3 mb-4">
                {pillars.map(p => (
                  <div key={p.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-[12px] font-bold text-slate-800">{p.name}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {p.subs.map(s => <span key={s} className="text-[10px] px-1.5 py-0.5 bg-white border border-slate-200 text-slate-500 rounded">{s}</span>)}
                      </div>
                    </div>
                    <button onClick={() => setPillars(ps => ps.filter(x => x.id !== p.id))} className="text-[10px] text-slate-400 hover:text-red-500 transition-colors">Remove</button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={newPillar} onChange={e => setNewPillar(e.target.value)} placeholder="New pillar name..." className={`flex-1 ${fieldClass}`} />
                <button onClick={() => { if (newPillar.trim()) { setPillars(ps => [...ps, { id: Date.now().toString(), name: newPillar.trim(), subs: [] }]); setNewPillar(""); } }}
                  className="px-4 py-2 bg-slate-900 text-white text-[11px] font-bold rounded-lg hover:bg-slate-800 transition-colors">Add</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Positioning ── */}
        {activeTab === "positioning" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-[16px] font-bold text-slate-900 mb-0.5">Positioning</h2>
              <p className="text-[12px] text-slate-500">Generated from your Audience Intelligence and Business & Offer data. Edit directly if needed.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <label className={labelClass}>Positioning Sentence</label>
              <p className="text-[10px] text-slate-400 italic mb-2">We help [audience] solve [problem in their language] so they can [desired future].</p>
              <textarea rows={3} className={textareaClass} value={positioning.positioningSentence}
                onChange={e => setPositioning(p => ({ ...p, positioningSentence: e.target.value }))} />
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <label className={labelClass}>Offer Transformation</label>
              <p className="text-[10px] text-slate-400 italic mb-2">Go from [painful reality] to [desired future] without [main constraint].</p>
              <textarea rows={3} className={textareaClass} value={positioning.offerTransformation}
                onChange={e => setPositioning(p => ({ ...p, offerTransformation: e.target.value }))} />
            </div>


            <button className="px-5 py-2.5 bg-slate-900 text-white text-[12px] font-bold rounded-lg hover:bg-slate-800 transition-colors">Save Positioning</button>
          </div>
        )}

        {/* ── Acquisition Priorities ── */}
        {activeTab === "priorities" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-[16px] font-bold text-slate-900 mb-0.5">Acquisition Priorities</h2>
              <p className="text-[12px] text-slate-500">Strategic priorities for the current phase. Not funnel architecture — that lives in Funnels.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="space-y-4">
                {([
                  { key: "primaryGoal", label: "Primary Acquisition Goal" },
                  { key: "primaryFunnelStage", label: "Primary Funnel Stage Focus" },
                  { key: "primaryAwarenessGap", label: "Primary Awareness Gap" },
                  { key: "primaryPillar", label: "Primary Content Pillar" },
                  { key: "primaryChannel", label: "Primary Channel" },
                  { key: "bottleneck", label: "Current Bottleneck" },
                  { key: "experiment", label: "Current Experiment" },
                ] as { key: keyof typeof priorities; label: string }[]).map(f => (
                  <div key={f.key}>
                    <label className={labelClass}>{f.label}</label>
                    <input className={fieldClass} value={priorities[f.key]}
                      onChange={e => setPriorities(p => ({ ...p, [f.key]: e.target.value }))} />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">AI Priority Recommendations</p>
              {[
                { rank: 1, action: "Produce 3 Product-Aware case study posts this week", reason: "Critical gap — 1 of 5 target posts published" },
                { rank: 2, action: "Add BOF keyword CTA to next 5 posts", reason: "High DM-to-call conversion rate (64%) but only 2 hot CTAs in last 30 posts" },
                { rank: 3, action: "Run Research — cross-creator validation shows 3 trending ideas", reason: "Strong market signal, early in the 7-day window" },
              ].map(r => (
                <div key={r.rank} className="flex gap-3 mb-3 last:mb-0">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0">{r.rank}</div>
                  <div>
                    <p className="text-[12px] font-bold text-slate-800">{r.action}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{r.reason}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="px-5 py-2.5 bg-slate-900 text-white text-[12px] font-bold rounded-lg hover:bg-slate-800 transition-colors">Save Priorities</button>
          </div>
        )}
      </main>
    </div>
  );
}
