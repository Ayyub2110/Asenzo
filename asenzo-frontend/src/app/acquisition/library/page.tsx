"use client";

import React, { useState } from "react";

const CATEGORIES = ["All","Audience","Ideas","Contexts","Hooks","Power Words","Frameworks","Structures","CTAs","Objections","Pain Points","Desires","Winning Patterns","Scripts","Performance Learnings"];

const ENTRIES = [
  { id: "l1", category: "Hooks", title: "\"I post every day and nobody buys\"", content: "Highly specific audience self-identification hook. Creates instant validation before reframe. 8.4× average engagement in this niche.", confidence: 94, frequency: 12, successRate: 88, source: "Audience Intelligence + Research", recency: "2 days ago" },
  { id: "l2", category: "Objections", title: "\"I don't have time for content\"", content: "Surface objection — real fear is wasted effort without results. Address by reframing time investment as strategic decision-making, not volume.", confidence: 91, frequency: 8, successRate: 76, source: "Sales Call Transcripts", recency: "1 week ago" },
  { id: "l3", category: "Pain Points", title: "\"I don't know where my next client is coming from\"", content: "The core anxiety. Triggers most buying decisions. Use in BOF content directly. Validated across 5 client interviews.", confidence: 96, frequency: 14, successRate: 92, source: "Dream Client Interviews", recency: "3 days ago" },
  { id: "l4", category: "Winning Patterns", title: "Contrarian Hook → Belief Shift → Mechanism → CTA", content: "Most reliable TOF→MOF structure in this niche. Engages unaware audience without purely entertainment approach. Works across talking head and text formats.", confidence: 88, frequency: 6, successRate: 84, source: "Performance Learning", recency: "5 days ago" },
  { id: "l5", category: "Contexts", title: "Agency disappointment context", content: "Many B2B founders have spent £5K-£15K on agencies that produced generic content. This experience creates strong openness to the mechanism explanation. Use as trust trigger, not attack.", confidence: 85, frequency: 4, successRate: 79, source: "Sales Calls", recency: "1 week ago" },
  { id: "l6", category: "Power Words", title: "Predictable · Inbound · Proven · Qualified · Consistent", content: "Words that trigger positive emotional response in B2B founder buyers. 'Predictable' and 'inbound' outperform 'more' and 'grow' by 3.2× in CTA clicks.", confidence: 90, frequency: 20, successRate: 87, source: "A/B Testing + Research", recency: "4 days ago" },
  { id: "l7", category: "Frameworks", title: "Problem → Belief Shift → Mechanism → Proof → CTA", content: "Most consistently performing conversion framework for MOF-BOF content in this niche. Converts founder mindset before presenting mechanism.", confidence: 87, frequency: 7, successRate: 82, source: "Content Performance", recency: "6 days ago" },
  { id: "l8", category: "Performance Learnings", title: "Proof-led hooks outperform curiosity hooks for BOF", content: "For BOF population, specific result claims (e.g. 'From 0 to 12 DMs/week') outperform curiosity hooks by 3.1× click-to-CTA rate. Audience already trust the mechanism — they need proof.", confidence: 92, frequency: 3, successRate: 91, source: "Published Content Analysis", recency: "1 week ago" },
];

export default function LibraryPage() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof ENTRIES[0] | null>(null);

  const filtered = ENTRIES.filter(e =>
    (category === "All" || e.category === category) &&
    (search === "" || e.title.toLowerCase().includes(search.toLowerCase()) || e.content.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex h-full">
      {/* Category sidebar */}
      <aside className="w-44 shrink-0 border-r border-slate-100 pt-6 px-3 space-y-0.5 bg-white sticky top-0 h-[calc(100vh-128px)] overflow-y-auto">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${category === c ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`}>
            {c}
          </button>
        ))}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="shrink-0 px-6 py-3 border-b border-slate-100 bg-white flex items-center gap-3">
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search library..." className="px-3 py-1.5 border border-slate-200 rounded-lg text-[12px] w-64 bg-white focus:outline-none focus:border-blue-400" />
          <span className="text-[11px] text-slate-400">{filtered.length} entries</span>
          <div className="ml-auto">
            <button className="px-3 py-1.5 bg-slate-900 text-white text-[11px] font-bold rounded-lg hover:bg-slate-800 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[13px]">add</span>Add Entry
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Entries list */}
          <div className={`${selected ? "w-80" : "flex-1"} flex flex-col overflow-y-auto p-5 gap-3`}>
            <div className="mb-1">
              <h2 className="text-[14px] font-bold text-slate-900">Acquisition Library</h2>
              <p className="text-[11px] text-slate-500">Persistent intelligence from research, performance data, and audience conversations.</p>
            </div>
            {filtered.map(entry => (
              <div key={entry.id} onClick={() => setSelected(s => s?.id === entry.id ? null : entry)}
                className={`bg-white border rounded-xl p-4 shadow-sm cursor-pointer transition-all ${selected?.id === entry.id ? "border-blue-300 shadow-md" : "border-slate-200 hover:border-slate-300"}`}>
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{entry.category}</span>
                    <h3 className="text-[12px] font-bold text-slate-900 leading-tight">{entry.title}</h3>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-violet-100 text-violet-700 rounded">C {entry.confidence}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded">{entry.successRate}%</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{entry.content}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[9px] text-slate-400">{entry.source}</span>
                  <span className="text-[9px] text-slate-400">{entry.recency}</span>
                  <span className="text-[9px] text-slate-400">Used {entry.frequency}×</span>
                </div>
              </div>
            ))}
          </div>

          {/* Entry detail */}
          {selected && (
            <div className="flex-1 border-l border-slate-100 bg-slate-50/40 flex flex-col overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{selected.category}</span>
                  <h3 className="text-[14px] font-bold text-slate-900 mt-0.5 leading-tight">{selected.title}</h3>
                </div>
                <button onClick={() => setSelected(null)} className="text-xl text-slate-400 hover:text-slate-600">×</button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[["Confidence",`${selected.confidence}`,"text-violet-700 bg-violet-50"],["Success Rate",`${selected.successRate}%`,"text-emerald-700 bg-emerald-50"],["Used",`${selected.frequency}×`,"text-slate-700 bg-slate-100"]].map(([l,v,cls]) => (
                    <div key={l} className={`rounded-lg p-3 text-center ${cls}`}>
                      <p className="text-[10px] font-bold text-current opacity-60 uppercase tracking-widest">{l}</p>
                      <p className="text-[16px] font-bold">{v}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Knowledge</p>
                  <p className="text-[12px] text-slate-700 leading-relaxed">{selected.content}</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Source</p>
                  <p className="text-[12px] text-slate-700">{selected.source}</p>
                  <p className="text-[11px] text-slate-400 mt-1">Last updated: {selected.recency}</p>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 border border-slate-200 text-slate-700 text-[11px] font-semibold rounded-lg hover:bg-slate-50">Use in Script →</button>
                  <button className="px-4 py-2 border border-slate-200 text-slate-500 text-[11px] rounded-lg hover:bg-slate-50">Edit</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
