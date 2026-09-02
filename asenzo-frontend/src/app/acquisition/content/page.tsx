"use client";

import React, { useState } from "react";

const STAGES = [
  { key: "SHORTLISTED", label: "Shortlisted", color: "#8B5CF6" },
  { key: "SCRIPTING", label: "Scripting", color: "#2563EB" },
  { key: "PRODUCTION", label: "Production", color: "#D97706" },
  { key: "REVIEW", label: "Review", color: "#DC2626" },
  { key: "SCHEDULED", label: "Scheduled", color: "#16A34A" },
  { key: "PUBLISHED", label: "Published", color: "#0EA5E9" },
  { key: "LEARNING", label: "Learning", color: "#7C3AED" },
];

const FRAMEWORKS: Record<string, string[]> = {
  "Viral": ["Context","Hook","Open Loop","Value","Pattern Interrupt","Payoff","CTA"],
  "Authority": ["Context","Hook","Problem","Mechanism","Explanation","Proof","Conclusion","CTA"],
  "Story": ["Context","Hook","Situation","Conflict","Insight","Transformation","Lesson","CTA"],
  "Conversion": ["Context","Hook","Pain","Cost of Inaction","Solution","Proof","Offer","CTA"],
  "Contrarian": ["Context","Hook","Common Belief","Why It's Wrong","New Perspective","Evidence","CTA"],
  "Educational": ["Context","Hook","Intro","Step 1","Step 2","Step 3","Summary","CTA"],
  "Credibility": ["Context","Hook","Credentials","Results","Method","Case Study","CTA"],
};

type ContentItem = {
  id: string; title: string; status: string; pillar: string; awareness: string; funnel: string;
  concept: string; context: string; framework: string; script: string; cta: string; destination: string;
  viralityScore: number; strategicScore: number; sourceCreator: string;
  platform: string; publishDate: string; caption: string;
  views: number; leads: number; calls: number; sales: number;
  productionOwner: string; productionNotes: string; learningNotes: string;
};

const MOCK_CARDS: ContentItem[] = [
  { id: "c1", title: "Why consistency isn't your problem — clarity is", status: "SCRIPTING", pillar: "Client Acquisition", awareness: "Problem-Aware", funnel: "TOF", concept: "Most founders post the wrong content. The constraint is clarity, not volume.", context: "Validate their frustration, then reframe the problem from execution to strategy.", framework: "Contrarian", script: "", cta: "Comment GUIDE", destination: "Lead Magnet", viralityScore: 94, strategicScore: 88, sourceCreator: "Lara Davies", platform: "", publishDate: "", caption: "", views: 0, leads: 0, calls: 0, sales: 0, productionOwner: "", productionNotes: "", learningNotes: "" },
  { id: "c2", title: "The reason your agency didn't work", status: "SHORTLISTED", pillar: "Client Acquisition", awareness: "Solution-Aware", funnel: "MOF", concept: "Outsourcing fails when core message is unclear. The problem is always upstream.", context: "", framework: "Contrarian", script: "", cta: "Comment CASE", destination: "Case Study", viralityScore: 91, strategicScore: 95, sourceCreator: "Alex Hormozi", platform: "", publishDate: "", caption: "", views: 0, leads: 0, calls: 0, sales: 0, productionOwner: "", productionNotes: "", learningNotes: "" },
  { id: "c3", title: "5 signs your content is attracting wrong clients", status: "PRODUCTION", pillar: "Content Strategy", awareness: "Problem-Aware", funnel: "MOF", concept: "Diagnostic list with high save value and self-identification potential.", context: "", framework: "Educational", script: "Hook: If your content is getting views but no clients, you're probably attracting the wrong people.\n\nHere are 5 signs...\n\n1. Your best-performing posts attract engagement but no DMs\n2. People relate to your content but don't see you as the solution\n3. Your followers love your personality but don't want your offer\n4. You attract other content creators instead of buyers\n5. You get comments but almost never 'how do I work with you?'\n\nIf 3 or more of these hit — your positioning isn't broken, your targeting is.\n\nComment GUIDE and I'll send you the framework.", cta: "Comment CASE", destination: "DM Automation", viralityScore: 87, strategicScore: 82, sourceCreator: "Jay Yang", platform: "Instagram", publishDate: "", caption: "", views: 0, leads: 0, calls: 0, sales: 0, productionOwner: "Alex", productionNotes: "Record Tuesday AM", learningNotes: "" },
  { id: "c4", title: "From 0 to 12 inbound DMs/week using content", status: "PUBLISHED", pillar: "Client Acquisition", awareness: "Product-Aware", funnel: "BOF", concept: "Client case study with specific before/after metrics and mechanism explained.", context: "", framework: "Story", script: "", cta: "Comment CALL", destination: "Booking", viralityScore: 78, strategicScore: 90, sourceCreator: "Internal", platform: "Instagram", publishDate: "2026-09-01", caption: "", views: 24600, leads: 8, calls: 3, sales: 1, productionOwner: "", productionNotes: "", learningNotes: "Strong DM conversion. Proof-led hook outperformed previous awareness content." },
  { id: "c5", title: "I wasted £12,000 on ads — here's what worked instead", status: "SHORTLISTED", pillar: "Client Acquisition", awareness: "Solution-Aware", funnel: "MOF", concept: "Relatable loss story that validates organic content approach and creates contrast.", context: "", framework: "Story", script: "", cta: "Comment GUIDE", destination: "Lead Magnet", viralityScore: 82, strategicScore: 84, sourceCreator: "Mark Metry", platform: "", publishDate: "", caption: "", views: 0, leads: 0, calls: 0, sales: 0, productionOwner: "", productionNotes: "", learningNotes: "" },
  { id: "c6", title: "The 3-post rule that changed how I sell on Instagram", status: "REVIEW", pillar: "Content Strategy", awareness: "Solution-Aware", funnel: "MOF", concept: "Simple framework content with high save potential and mechanism clarity.", context: "", framework: "Educational", script: "", cta: "Comment RULE", destination: "Email List", viralityScore: 73, strategicScore: 79, sourceCreator: "Internal", platform: "Instagram", publishDate: "", caption: "", views: 0, leads: 0, calls: 0, sales: 0, productionOwner: "", productionNotes: "Script approved", learningNotes: "" },
];

export default function ContentPage() {
  const [cards, setCards] = useState<ContentItem[]>(MOCK_CARDS);
  const [selected, setSelected] = useState<ContentItem | null>(null);
  const [cardTab, setCardTab] = useState<"script"|"production"|"publishing"|"performance"|"learning">("script");
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [scriptState, setScriptState] = useState<"idle"|"loading"|"done">("idle");
  const [search, setSearch] = useState("");
  const [filterFunnel, setFilterFunnel] = useState("ALL");
  const [view, setView] = useState<"kanban"|"calendar">("kanban");

  const filtered = cards.filter(c =>
    (search === "" || c.title.toLowerCase().includes(search.toLowerCase())) &&
    (filterFunnel === "ALL" || c.funnel === filterFunnel)
  );

  const byStage = (key: string) => filtered.filter(c => c.status === key);

  const updateCard = (id: string, patch: Partial<ContentItem>) => {
    setCards(cs => cs.map(c => c.id === id ? { ...c, ...patch } : c));
    if (selected?.id === id) setSelected(s => s ? { ...s, ...patch } : s);
  };

  const handleDrop = (stageKey: string) => {
    if (dragId) {
      updateCard(dragId, { status: stageKey });
      setDragId(null);
      setDragOver(null);
    }
  };

  const stageColor = (key: string) => STAGES.find(s => s.key === key)?.color || "#6B7280";

  const fc = "w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] bg-white focus:outline-none focus:border-blue-400 transition-colors";
  const ta = `${fc} resize-none`;
  const lc = "text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1";

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="shrink-0 px-6 py-3 border-b border-slate-100 bg-white flex items-center gap-3">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search content..." className="px-3 py-1.5 border border-slate-200 rounded-lg text-[12px] w-56 bg-white focus:outline-none focus:border-blue-400" />
        <div className="flex gap-1">
          {["ALL","TOF","MOF","BOF"].map(f => (
            <button key={f} onClick={() => setFilterFunnel(f)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${filterFunnel === f ? "bg-slate-900 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{f}</button>
          ))}
        </div>
        <div className="flex gap-1 ml-4 border border-slate-200 rounded-lg p-0.5 bg-slate-50">
          <button onClick={() => setView("kanban")} className={`px-3 py-1.5 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-colors ${view === "kanban" ? "bg-white shadow border border-slate-200 text-slate-800" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"}`}><span className="material-symbols-outlined text-[14px]">view_column</span> Kanban</button>
          <button onClick={() => setView("calendar")} className={`px-3 py-1.5 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-colors ${view === "calendar" ? "bg-white shadow border border-slate-200 text-slate-800" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"}`}><span className="material-symbols-outlined text-[14px]">calendar_month</span> Calendar</button>
        </div>
        <div className="ml-auto">
          <button onClick={() => { setSelected({ id: `c${Date.now()}`, title: "New Content Idea", status: "SHORTLISTED", pillar: "Client Acquisition", awareness: "Problem-Aware", funnel: "TOF", concept: "", context: "", framework: "Viral", script: "", cta: "", destination: "", viralityScore: 0, strategicScore: 0, sourceCreator: "", platform: "", publishDate: "", caption: "", views: 0, leads: 0, calls: 0, sales: 0, productionOwner: "", productionNotes: "", learningNotes: "" }); setCardTab("script"); }}
            className="px-4 py-1.5 bg-slate-900 text-white text-[11px] font-bold rounded-lg hover:bg-slate-800 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[13px]">add</span>New Content
          </button>
        </div>
      </div>

      {/* Main View Area */}
      {view === "kanban" ? (
        <div className="flex-1 overflow-x-auto">
          <div className="flex h-full min-w-max p-4 gap-3">
            {STAGES.map(stage => {
              const stageCards = byStage(stage.key);
              return (
                <div key={stage.key}
                  className={`flex flex-col w-56 shrink-0 rounded-xl border transition-colors ${dragOver === stage.key ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-slate-50/60"}`}
                  onDragOver={e => { e.preventDefault(); setDragOver(stage.key); }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={() => handleDrop(stage.key)}>
                  {/* Column header */}
                  <div className="px-3 py-2.5 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
                      <span className="text-[11px] font-bold text-slate-700">{stage.label}</span>
                    </div>
                    <span className="text-[11px] font-bold" style={{ color: stage.color }}>{stageCards.length}</span>
                  </div>

                  {/* Cards */}
                  <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-2">
                    {stageCards.map(card => (
                      <div key={card.id}
                        draggable
                        onDragStart={() => setDragId(card.id)}
                        onDragEnd={() => { setDragId(null); setDragOver(null); }}
                        onClick={() => { setSelected(card); setCardTab("script"); }}
                        className={`bg-white border border-slate-200 rounded-lg p-3 cursor-pointer hover:border-slate-300 hover:shadow-sm transition-all ${dragId === card.id ? "opacity-40" : ""}`}>
                        <p className="text-[11px] font-bold text-slate-800 leading-tight mb-1.5">{card.title}</p>
                        <div className="flex flex-wrap gap-1 mb-1.5">
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: `${stageColor(card.funnel === "TOF" ? "#6B7280" : card.funnel === "MOF" ? "#8B5CF6" : "#16A34A")}18`, color: card.funnel === "TOF" ? "#6B7280" : card.funnel === "MOF" ? "#8B5CF6" : "#16A34A" }}>{card.funnel}</span>
                          <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">{card.awareness.split("-")[0]}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">{card.pillar}</p>
                        {card.status === "PUBLISHED" && card.views > 0 && (
                          <div className="mt-1.5 flex gap-2">
                            <span className="text-[9px] text-slate-400">{card.views.toLocaleString()} views</span>
                            {card.leads > 0 && <span className="text-[9px] text-emerald-500">{card.leads} leads</span>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex-1 p-6 overflow-hidden bg-slate-50/50">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col h-full shadow-sm">
            <div className="grid grid-cols-7 border-b border-slate-100 shrink-0 bg-slate-50/50">
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
                <div key={d} className="px-4 py-3 text-[10px] font-bold text-slate-500 text-center uppercase tracking-widest border-r border-slate-100 last:border-r-0">{d}</div>
              ))}
            </div>
            <div className="flex-1 grid grid-cols-7 grid-rows-5 overflow-y-auto">
              {Array.from({length: 35}).map((_, i) => {
                const dayNum = i > 1 && i < 33 ? (i - 1) : null;
                // Mock distribution based on card index
                const dayCards = dayNum ? filtered.filter((c, idx) => {
                  if (["PRODUCTION","REVIEW","SCHEDULED","PUBLISHED"].includes(c.status)) {
                    return (idx * 7 + 3) % 28 + 1 === dayNum;
                  }
                  return false;
                }) : [];
                
                return (
                  <div key={i} className={`border-r border-b border-slate-100 p-2 min-h-[100px] last:border-r-0 ${!dayNum ? 'bg-slate-50' : 'bg-white hover:bg-slate-50/50 transition-colors cursor-pointer'}`}>
                    {dayNum && <p className="text-[11px] font-bold text-slate-400 mb-1.5">{dayNum}</p>}
                    <div className="space-y-1.5">
                      {dayCards.map(card => (
                        <div key={card.id} onClick={() => { setSelected(card); setCardTab("script"); }} 
                          className="px-2 py-1.5 rounded border cursor-pointer hover:shadow-sm transition-all"
                          style={{ backgroundColor: `${stageColor(card.status)}0A`, borderColor: `${stageColor(card.status)}30` }}>
                          <p className="text-[9px] font-bold text-slate-700 truncate leading-tight">{card.title}</p>
                          <p className="text-[8px] mt-0.5 font-bold uppercase tracking-wider" style={{ color: stageColor(card.status) }}>{card.status}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Content Card Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-[95vw] max-w-[1000px] h-[95vh] max-h-[95vh] flex flex-col z-10 overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Card Header */}
            <div className="px-6 py-4 border-b border-slate-100 shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <input value={selected.title} onChange={e => updateCard(selected.id, { title: e.target.value })}
                    className="text-[16px] font-bold text-slate-900 bg-transparent border-none outline-none w-full" />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {[selected.funnel, selected.awareness, selected.pillar].map(t => (
                      <span key={t} className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">{t}</span>
                    ))}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ backgroundColor: `${stageColor(selected.status)}18`, color: stageColor(selected.status) }}>{selected.status}</span>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="text-2xl text-slate-400 hover:text-slate-600 shrink-0">×</button>
              </div>

              {/* Card sub-tabs */}
              <div className="flex gap-1 mt-3">
                {[["script","Script"],["production","Production"],["publishing","Publishing"],["performance","Performance"],["learning","Learning"]].map(([id, label]) => (
                  <button key={id} onClick={() => setCardTab(id as typeof cardTab)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${cardTab === id ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100"}`}>{label}</button>
                ))}
              </div>
            </div>

            {/* Card Body */}
            <div className="flex-1 overflow-y-auto">
              {/* ── Script ── */}
              {cardTab === "script" && (
                <div className="flex h-full">
                  {/* Context panel */}
                  <div className="w-[300px] shrink-0 border-r border-slate-100 p-5 space-y-4 overflow-y-auto bg-slate-50/50">
                    <div>
                      <label className={lc}>Funnel Stage</label>
                      <select value={selected.funnel} onChange={e => updateCard(selected.id, { funnel: e.target.value })} className={fc}>
                        {["TOF","MOF","BOF"].map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={lc}>Awareness</label>
                      <select value={selected.awareness} onChange={e => updateCard(selected.id, { awareness: e.target.value })} className={fc}>
                        {["Unaware","Problem-Aware","Solution-Aware","Product-Aware","Most-Aware"].map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={lc}>Content Pillar</label>
                      <select value={selected.pillar} onChange={e => updateCard(selected.id, { pillar: e.target.value })} className={fc}>
                        {["Client Acquisition","Content Strategy","Offer Design","Mindset"].map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={lc}>CTA</label>
                      <input value={selected.cta} onChange={e => updateCard(selected.id, { cta: e.target.value })} className={fc} placeholder="Comment GUIDE" />
                    </div>
                    <div>
                      <label className={lc}>Destination</label>
                      <input value={selected.destination} onChange={e => updateCard(selected.id, { destination: e.target.value })} className={fc} placeholder="Lead Magnet" />
                    </div>
                    {selected.sourceCreator && (
                      <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                        <p className={lc}>Source Creator</p>
                        <p className="text-[11px] font-semibold text-slate-700">{selected.sourceCreator}</p>
                        {selected.viralityScore > 0 && <p className="text-[10px] text-violet-600 mt-0.5">Virality {selected.viralityScore} · Strategic {selected.strategicScore}</p>}
                      </div>
                    )}
                    <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                      <p className={lc}>Research Concept</p>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{selected.concept || "No concept yet."}</p>
                    </div>
                    <div className="border-t border-slate-200 pt-4">
                      <label className={lc}>Context</label>
                      <textarea rows={2} value={selected.context} onChange={e => updateCard(selected.id, { context: e.target.value })}
                        placeholder="What is this piece about? Why does it matter? Who is it for? What should they understand?" className={ta} />
                    </div>
                    <div>
                      <label className={lc}>Framework</label>
                      <select value={selected.framework} onChange={e => updateCard(selected.id, { framework: e.target.value })} className={fc}>
                        {Object.keys(FRAMEWORKS).map(f => <option key={f}>{f}</option>)}
                      </select>
                      {/* Dynamic structure */}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {(FRAMEWORKS[selected.framework] || []).map((s, i) => (
                          <div key={s} className="flex items-center gap-1">
                            <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-200/50 text-slate-600 rounded-md">{s}</span>
                            {i < (FRAMEWORKS[selected.framework] || []).length - 1 && <span className="text-slate-300 text-[10px]">→</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Script editor */}
                  <div className="flex-1 p-6 flex flex-col min-h-0 bg-white">
                    <div className="flex-1 flex flex-col mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className={lc}>Script Editor</label>
                        {scriptState === "done" && selected.script && (
                          <div className="flex gap-1.5">
                            {["Shorten","Simpler","More Emotion","Stronger CTA","Less Filler"].map(a => (
                              <button key={a} className="px-2.5 py-1 bg-slate-50 text-slate-600 border border-slate-200 text-[10px] font-semibold rounded hover:bg-slate-100 transition-colors">{a}</button>
                            ))}
                          </div>
                        )}
                      </div>
                      <textarea
                        value={selected.script}
                        onChange={e => updateCard(selected.id, { script: e.target.value })}
                        placeholder={selected.script ? "" : "Script will appear here after generation. Or write directly."}
                        className={`${ta} flex-1 min-h-[300px] font-mono text-[13px] leading-relaxed resize-none p-4`} />
                    </div>

                    <div className="flex gap-2 shrink-0">
                      {scriptState !== "loading" ? (
                        <button onClick={() => { setScriptState("loading"); setTimeout(() => { updateCard(selected.id, { script: `[${selected.framework.toUpperCase()} FRAMEWORK]\n\nContext: ${selected.context || selected.concept}\n\nHook: "${selected.title}" — ${selected.awareness} hook optimised for ${selected.funnel}.\n\n${(FRAMEWORKS[selected.framework]||[]).map(s => `${s.toUpperCase()}\n[AI-generated ${s.toLowerCase()} content based on strategy, audience psychology, and Library intelligence.]\n`).join("\n")}\nCTA: ${selected.cta || "Comment GUIDE below and I'll send you the framework."}` }); setScriptState("done"); }, 2000); }}
                          className="px-5 py-2 bg-slate-900 text-white text-[12px] font-bold rounded-lg hover:bg-slate-800 flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[14px]">auto_awesome</span>Generate Script
                        </button>
                      ) : (
                        <button disabled className="px-5 py-2 bg-slate-400 text-white text-[12px] font-bold rounded-lg flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>Generating...
                        </button>
                      )}
                      {selected.script && (
                        <button onClick={() => updateCard(selected.id, { status: "PRODUCTION" })}
                          className="px-5 py-2 bg-emerald-600 text-white text-[12px] font-bold rounded-lg hover:bg-emerald-700 transition-colors">
                          Send to Production →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Production ── */}
              {cardTab === "production" && (
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={lc}>Production Owner</label><input value={selected.productionOwner} onChange={e => updateCard(selected.id, { productionOwner: e.target.value })} className={fc} placeholder="Who is recording/editing?" /></div>
                    <div>
                      <label className={lc}>Status</label>
                      <select value={selected.status} onChange={e => updateCard(selected.id, { status: e.target.value })} className={fc}>
                        {STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2"><label className={lc}>Production Notes</label><textarea rows={3} value={selected.productionNotes} onChange={e => updateCard(selected.id, { productionNotes: e.target.value })} className={ta} placeholder="Recording schedule, editing notes, SOP references..." /></div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className={lc}>Production Checklist</p>
                    <div className="space-y-2 mt-2">
                      {["Script approved","Recording complete","Edit complete","Caption written","Thumbnail ready","CTA verified","Link working","Final review"].map(item => (
                        <label key={item} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="rounded border-slate-300" />
                          <span className="text-[12px] text-slate-700">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Publishing ── */}
              {cardTab === "publishing" && (
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={lc}>Platform</label><select value={selected.platform} onChange={e => updateCard(selected.id, { platform: e.target.value })} className={fc}>{["Instagram","YouTube","TikTok","LinkedIn","X"].map(o => <option key={o}>{o}</option>)}</select></div>
                    <div><label className={lc}>Publish Date</label><input type="date" value={selected.publishDate} onChange={e => updateCard(selected.id, { publishDate: e.target.value })} className={fc} /></div>
                    <div className="col-span-2"><label className={lc}>Caption</label><textarea rows={4} value={selected.caption} onChange={e => updateCard(selected.id, { caption: e.target.value })} className={ta} placeholder="Write the caption or generate from script..." /></div>
                  </div>
                </div>
              )}

              {/* ── Performance ── */}
              {cardTab === "performance" && (
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-4 gap-3">
                    {[{l:"Views",k:"views"},{l:"Leads",k:"leads"},{l:"Calls",k:"calls"},{l:"Sales",k:"sales"}].map(({l,k}) => (
                      <div key={k} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{l}</p>
                        <input type="number" value={(selected as any)[k]} onChange={e => updateCard(selected.id, { [k]: Number(e.target.value) })} className="text-[20px] font-bold text-slate-900 bg-transparent border-none outline-none w-full" />
                      </div>
                    ))}
                  </div>
                  {selected.status === "PUBLISHED" && (
                    <div className="p-3.5 bg-violet-50 border border-violet-200 rounded-lg">
                      <p className="text-[11px] font-bold text-violet-700 mb-1">Attribution chain</p>
                      <p className="text-[11px] text-violet-600">{selected.title} → {selected.views.toLocaleString()} views → {selected.leads} leads → {selected.calls} calls → {selected.sales} sales</p>
                    </div>
                  )}
                </div>
              )}

              {/* ── Learning ── */}
              {cardTab === "learning" && (
                <div className="p-5 space-y-4">
                  <div><label className={lc}>Learning Notes</label><textarea rows={5} value={selected.learningNotes} onChange={e => updateCard(selected.id, { learningNotes: e.target.value })} className={ta} placeholder="What worked? What failed? Hook performance? Engagement quality? CTA result? Funnel impact?" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="py-2 border border-slate-200 text-slate-700 text-[11px] font-semibold rounded-lg hover:bg-slate-50">AI Generate Learning Summary</button>
                    <button className="py-2 bg-violet-600 text-white text-[11px] font-bold rounded-lg hover:bg-violet-700">Save to Library →</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
