"use client";

import React, { useState } from "react";

const WATCHLIST = [
  { id: "w1", name: "Alex Hormozi", platform: "Instagram", niche: "Business Growth", followers: "4.8M", value: 5, fav: true, notes: "Proof-led content, direct CTA" },
  { id: "w2", name: "Lara Davies", platform: "YouTube", niche: "Content Marketing", followers: "89K", value: 4, fav: true, notes: "Strong narrative arcs" },
  { id: "w3", name: "Jay Yang", platform: "TikTok", niche: "Agency Growth", followers: "34K", value: 5, fav: false, notes: "30× baseline spike Jul 2026" },
  { id: "w4", name: "Mark Metry", platform: "LinkedIn", niche: "B2B SaaS", followers: "42K", value: 3, fav: false, notes: "Long-form education" },
];

// Library-sourced BOF ideas — from Objections, Pain Points, and Desires stored by AI
const LIBRARY_BOF_IDEAS = [
  { id: "lib1", title: "\"I don't know where my next client is coming from\" — address the core anxiety directly", funnel: "BOF", awareness: "Most-Aware", pillar: "Client Acquisition", viralityScore: 0, strategicScore: 96, confidence: 96, references: 0, creator: "Library · Pain Point", perf: "Validated across 5 client interviews", recency: "3 days ago", source: "Library", libraryCategory: "Pain Points", why: "The single highest-impact pain phrase from dream client interviews. Any BOF content naming this anxiety directly creates instant recognition and buying intent.", concept: "Name the core anxiety your buyer wakes up with. Show them what their situation looks like when it's solved — specifically and predictably." },
  { id: "lib2", title: "\"I don't have time for content\" — reframe time as a strategy decision, not a volume problem", funnel: "BOF", awareness: "Solution-Aware", pillar: "Client Acquisition", viralityScore: 0, strategicScore: 88, confidence: 91, references: 0, creator: "Library · Objection", perf: "From sales call transcripts", recency: "1 week ago", source: "Library", libraryCategory: "Objections", why: "Surface objection — real fear is wasted effort without results. Content that addresses this directly removes the main buying resistance.", concept: "Reframe: they don't lack time, they lack a system that makes content output inevitable. Show the 30-minute/week version." },
  { id: "lib3", title: "Proof that consistency without clarity is just noise — not a client acquisition strategy", funnel: "BOF", awareness: "Solution-Aware", pillar: "Client Acquisition", viralityScore: 0, strategicScore: 85, confidence: 90, references: 0, creator: "Library · Objection", perf: "Validated in sales calls", recency: "1 week ago", source: "Library", libraryCategory: "Objections", why: "Buyers who have been posting consistently with no results need their current belief dismantled before they open up to a new solution.", concept: "Show concrete examples where posting frequency was high but messaging was generic — zero DMs. Then the contrast." },
  { id: "lib4", title: "What predictable inbound actually looks like — 12 qualified DMs/week from organic content", funnel: "BOF", awareness: "Product-Aware", pillar: "Client Acquisition", viralityScore: 0, strategicScore: 92, confidence: 89, references: 0, creator: "Library · Desire", perf: "Power words: Predictable · Inbound · Qualified", recency: "4 days ago", source: "Library", libraryCategory: "Desires", why: "'Predictable' and 'inbound' test 3.2× better than 'grow' in this audience. Show the desired state, quantified.", concept: "Walk through exactly what a predictable acquisition system looks like week-by-week. Make the destination so specific it feels achievable." },
  { id: "lib5", title: "Why hiring an agency failed — and what the actual problem was (it wasn't the agency)", funnel: "BOF", awareness: "Solution-Aware", pillar: "Client Acquisition", viralityScore: 0, strategicScore: 79, confidence: 85, references: 0, creator: "Library · Context", perf: "Avg £10K agency spend validated", recency: "1 week ago", source: "Library", libraryCategory: "Contexts", why: "Most buyers have already tried agencies. This context creates a belief shift that the problem is upstream (messaging) not execution (content production).", concept: "Agency work fails when the message isn't clear. Proven through the £12K case. Use to validate the inbound content approach." },
];

const WINNING_IDEAS = [
  { id: "i1", title: "Why consistency isn't your problem — clarity is", funnel: "TOF", awareness: "Problem-Aware", pillar: "Client Acquisition", viralityScore: 94, strategicScore: 88, confidence: 92, references: 4, creator: "Lara Davies", perf: "95K views · 3.4× baseline", recency: "3 days ago", source: "Research", libraryCategory: "", why: "Contrarian framing + audience self-identification. Strong save rate.", concept: "Most founders believe posting more will fix results. The real constraint is messaging clarity." },
  { id: "i2", title: "The reason your agency didn't work", funnel: "MOF", awareness: "Solution-Aware", pillar: "Client Acquisition", viralityScore: 91, strategicScore: 95, confidence: 89, references: 6, creator: "Alex Hormozi", perf: "210K views · 5.1× baseline", recency: "1 day ago", source: "Research", libraryCategory: "", why: "Validates the founder's experience. Creates belief shift around problem source.", concept: "Dissects why outsourcing fails when core message is unclear." },
  { id: "i3", title: "5 signs your content is attracting wrong clients", funnel: "MOF", awareness: "Problem-Aware", pillar: "Content Strategy", viralityScore: 87, strategicScore: 82, confidence: 85, references: 3, creator: "Jay Yang", perf: "84K views · 31× baseline", recency: "5 days ago", source: "Research", libraryCategory: "", why: "High save value + self-identification. Nano creator baseline outperformance.", concept: "Diagnostic list framework with high save value from self-identification." },
  { id: "i4", title: "I hired 3 agencies in 2 years — here's what I learned", funnel: "MOF", awareness: "Solution-Aware", pillar: "Client Acquisition", viralityScore: 82, strategicScore: 90, confidence: 78, references: 2, creator: "Lara Davies", perf: "67K views · 2.8× baseline", recency: "8 days ago", source: "Research", libraryCategory: "", why: "Personal story builds trust. Objection handling embedded in narrative.", concept: "Personal founder story as proof structure against agency alternatives." },
  { id: "i5", title: "Nobody taught you this about content", funnel: "TOF", awareness: "Unaware", pillar: "Content Strategy", viralityScore: 78, strategicScore: 70, confidence: 71, references: 2, creator: "Mark Metry", perf: "95K views · 2.3× baseline", recency: "2 weeks ago", source: "Research", libraryCategory: "", why: "Curiosity-led meta-content. Pattern interruption for content creators.", concept: "Contrarian pattern in content strategy meta-content." },
  ...LIBRARY_BOF_IDEAS,
];

export default function ResearchPage() {
  const [section, setSection] = useState<"ideas" | "engine" | "watchlist">("ideas");
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<typeof WINNING_IDEAS[0] | null>(null);
  const [researchState, setResearchState] = useState<"idle" | "loading" | "done">("done");
  const [funnel, setFunnel] = useState("ALL");
  const [watchlist, setWatchlist] = useState(WATCHLIST);
  const [sourceFilter, setSourceFilter] = useState("ALL"); // ALL | Research | Library

  const ideas = WINNING_IDEAS.filter(i =>
    (funnel === "ALL" || i.funnel === funnel) &&
    (sourceFilter === "ALL" || i.source === sourceFilter)
  );

  const fc = "w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] bg-white focus:outline-none focus:border-blue-400 transition-colors";

  return (
    <div className="flex h-full">
      <aside className="w-44 shrink-0 border-r border-slate-100 pt-6 px-3 space-y-0.5 bg-white sticky top-0 h-[calc(100vh-128px)]">
        {[{ id: "ideas", label: "Winning Ideas", icon: "auto_awesome" }, { id: "engine", label: "Research Engine", icon: "manage_search" }, { id: "watchlist", label: "Watchlist", icon: "bookmarks" }].map(s => (
          <button key={s.id} onClick={() => setSection(s.id as typeof section)}
            className={`w-full text-left px-3 py-2 rounded-lg text-[12px] font-semibold flex items-center gap-2 ${section === s.id ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`}>
            <span className="material-symbols-outlined text-[14px]">{s.icon}</span>{s.label}
          </button>
        ))}
      </aside>

      <main className="flex-1 py-6 px-8 overflow-y-auto">
        {section === "ideas" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-[16px] font-bold text-slate-900">Winning Ideas</h2>
                <p className="text-[12px] text-slate-500">Ranked by virality · strategic fit · cross-creator validation · recency</p>
              </div>
              <div className="flex gap-1.5">
                {["ALL","TOF","MOF","BOF"].map(f => (
                  <button key={f} onClick={() => setFunnel(f)} className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${funnel === f ? "bg-slate-900 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{f}</button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {ideas.map((idea, idx) => (
                <div key={idea.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-slate-300 transition-colors">
                  <div className="flex gap-4">
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[12px] font-bold text-slate-600 shrink-0 mt-0.5">{idx+1}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <h3 className="text-[13px] font-bold text-slate-900">{idea.title}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${idea.funnel==="TOF"?"bg-slate-100 text-slate-600":idea.funnel==="MOF"?"bg-violet-100 text-violet-700":"bg-emerald-100 text-emerald-700"}`}>{idea.funnel}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mb-2">{idea.concept}</p>
                      <div className="flex flex-wrap gap-3 mb-2">
                        {[{l:"Virality",v:idea.viralityScore,c:"#8B5CF6"},{l:"Strategic",v:idea.strategicScore,c:"#2563EB"},{l:"Confidence",v:idea.confidence,c:"#16A34A"}].map(s => (
                          <span key={s.l} className="text-[10px] text-slate-400">{s.l}: <b style={{color:s.c}}>{s.v}</b></span>
                        ))}
                        <span className="text-[10px] text-slate-400">{idea.references} refs · {idea.recency}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {[idea.pillar, idea.awareness, idea.creator].map(t => <span key={t} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">{t}</span>)}
                        <span className="text-[10px] text-emerald-600 font-semibold">{idea.perf}</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 mb-3">
                        <p className="text-[10px] font-bold text-slate-400 mb-0.5">Why it worked</p>
                        <p className="text-[11px] text-slate-600">{idea.why}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 bg-slate-900 text-white text-[11px] font-bold rounded-lg hover:bg-slate-800">Shortlist → Content</button>
                        <button onClick={() => { setSelectedIdea(idea); setShowAnalysis(true); }} className="px-3 py-1.5 border border-slate-200 text-slate-700 text-[11px] font-semibold rounded-lg hover:bg-slate-50">Analyse Video</button>
                        <button className="px-3 py-1.5 border border-slate-200 text-slate-700 text-[11px] font-semibold rounded-lg hover:bg-slate-50">Find Variations</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {section === "engine" && (
          <div>
            <div className="mb-5">
              <h2 className="text-[16px] font-bold text-slate-900">Research Engine</h2>
              <p className="text-[12px] text-slate-500">Find what is working right now. Ranked by recency, virality, and cross-creator validation.</p>
            </div>
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-8 space-y-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="grid grid-cols-2 gap-3">
                    {[["Platform","Instagram,YouTube,TikTok,LinkedIn,X"],["Funnel Stage","TOF,MOF,BOF (Buyer Intelligence)"],["Content Pillar","Client Acquisition,Content Strategy,Offer Design"],["Date Range","Last 7 days,Last 30 days,Last 90 days"]].map(([label,opts]) => (
                      <div key={label}>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">{label}</label>
                        <select className={fc}>{opts.split(",").map(o => <option key={o}>{o}</option>)}</select>
                      </div>
                    ))}
                    <div className="col-span-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Keyword / Topic</label><input className={fc} placeholder="e.g. client acquisition, B2B growth..." /></div>
                  </div>
                </div>
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-[11px] font-bold text-amber-700 mb-0.5">BOF uses buyer intelligence — not social content</p>
                  <p className="text-[11px] text-amber-600">BOF ideas come from DMs, sales calls, and customer interviews — not viral videos.</p>
                </div>
                {researchState !== "loading" ? (
                  <div className="flex gap-3">
                    <button onClick={() => { setResearchState("loading"); setTimeout(() => setResearchState("done"), 2500); }} className="flex-1 py-2.5 bg-slate-900 text-white text-[12px] font-bold rounded-lg hover:bg-slate-800">Analyze Research Subject</button>
                  </div>
                ) : (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-2"><span className="material-symbols-outlined text-blue-500 animate-spin text-[16px]">progress_activity</span><p className="text-[12px] font-bold text-blue-700">AI Extracting Knowledge Base...</p></div>
                    {["Extracting key ideas and themes...","Finding audience pain points & desires...","Detecting outlier patterns...","Distinguishing source facts from inferences..."].map((s,i) => <p key={i} className="text-[11px] text-blue-600 pl-5">↳ {s}</p>)}
                  </div>
                )}
              </div>
              <div className="col-span-4 space-y-4">
                <div className="bg-slate-900 rounded-xl p-5 shadow-lg border border-slate-800 text-white">
                  <h3 className="text-[14px] font-bold mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">add_circle</span> Add Research Source
                  </h3>
                  <div className="space-y-3">
                    <select className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-[12px] font-semibold focus:outline-none">
                      <option>URL (Article, YouTube, Social)</option>
                      <option>Keyword / Topic</option>
                      <option>Creator Profile</option>
                    </select>
                    <input className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-[12px] focus:outline-none focus:border-slate-500" placeholder="Paste URL or keyword..." />
                    <button className="w-full py-2 bg-white text-slate-900 text-[12px] font-bold rounded-lg hover:bg-slate-200">Add Source</button>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Creators</p><span className="text-[10px] text-blue-600 font-bold hover:underline cursor-pointer">Select All</span></div>
                  <div className="space-y-2 text-[11px] text-slate-700 font-semibold h-40 overflow-y-auto">
                    {[
                      {name:"Alex Hormozi", state:true}, {name:"Lara Davies", state:true}, 
                      {name:"Jay Yang", state:false}, {name:"Mark Metry", state:false},
                      {name:"Justin Welsh", state:true}
                    ].map(c => (
                      <label key={c.name} className="flex items-center gap-2.5 p-1.5 rounded hover:bg-slate-50 cursor-pointer">
                        <input type="checkbox" defaultChecked={c.state} className="rounded text-blue-600" />
                        <span>{c.name}</span>
                      </label>
                    ))}
                    <div className="pt-2"><input placeholder="Search creators..." className="w-full px-2 py-1.5 border border-slate-200 rounded text-[10px] bg-slate-50" /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {section === "watchlist" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div><h2 className="text-[16px] font-bold text-slate-900">Creator Watchlist</h2><p className="text-[12px] text-slate-500">Save and monitor creators for ongoing research.</p></div>
              <button className="px-3 py-1.5 bg-slate-900 text-white text-[11px] font-bold rounded-lg flex items-center gap-1.5"><span className="material-symbols-outlined text-[13px]">add</span>Add Creator</button>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5">
              <p className="text-[11px] font-bold text-blue-700 mb-2">Suggested Profiles</p>
              <div className="flex gap-2"><input className="flex-1 px-3 py-2 border border-blue-200 rounded-lg text-[12px] bg-white focus:outline-none" placeholder="Describe the type of creator you want to research..." /><button className="px-4 py-2 bg-blue-600 text-white text-[11px] font-bold rounded-lg">Find</button></div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-[11px]">
                <thead><tr className="border-b border-slate-100 bg-slate-50">{["Creator","Platform","Niche","Followers","Value","Notes",""].map(h => <th key={h} className="text-left p-3 text-slate-400 font-semibold">{h}</th>)}</tr></thead>
                <tbody className="divide-y divide-slate-50">
                  {watchlist.map(w => (
                    <tr key={w.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-800">
                        <button onClick={() => setWatchlist(ws => ws.map(x => x.id===w.id?{...x,fav:!x.fav}:x))} className={`mr-1.5 text-[14px] ${w.fav?"text-amber-400":"text-slate-200"}`}>★</button>{w.name}
                      </td>
                      <td className="p-3 text-slate-600">{w.platform}</td>
                      <td className="p-3 text-slate-600">{w.niche}</td>
                      <td className="p-3 text-slate-700 font-semibold">{w.followers}</td>
                      <td className="p-3"><div className="flex gap-0.5">{[1,2,3,4,5].map(n=><span key={n} className={`text-[12px] ${n<=w.value?"text-amber-400":"text-slate-200"}`}>★</span>)}</div></td>
                      <td className="p-3 text-slate-500 max-w-[160px] truncate">{w.notes}</td>
                      <td className="p-3"><div className="flex gap-1"><button className="px-2 py-1 border border-slate-200 text-slate-600 text-[10px] rounded hover:bg-slate-50">Research</button><button onClick={()=>setWatchlist(ws=>ws.filter(x=>x.id!==w.id))} className="px-2 py-1 text-slate-400 text-[10px] hover:text-red-500">Remove</button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Analysis Drawer */}
      {showAnalysis && selectedIdea && (
        <div className="fixed inset-0 z-50 flex" onClick={() => setShowAnalysis(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="ml-auto w-[520px] bg-white h-full shadow-2xl flex flex-col relative z-10" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 shrink-0">
              <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Video Analysis</p><h3 className="text-[13px] font-bold text-slate-900 mt-0.5">{selectedIdea.title}</h3></div>
              <button onClick={() => setShowAnalysis(false)} className="text-2xl text-slate-400 hover:text-slate-600 w-8 h-8 flex items-center justify-center">×</button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {[
                {t:"Source Fact",c:"The creator stated they wasted £12,000 on ads before discovering organic positioning content.", tag:"fact", bg:"bg-slate-100"},
                {t:"Inference",c:"Audience responds significantly better to failure stories and transparent numbers than pure 'how to' content.", tag:"inf", bg:"bg-blue-50"},
                {t:"AI Recommendation",c:"Use the 'Expensive Mistake' framework. Highlight a common financial mistake your ICP is making right now before revealing your mechanism.", tag:"ai", bg:"bg-violet-50/50"},
              ].map(s => (
                <div key={s.t} className={`${s.bg} rounded-lg p-4 border border-slate-200/50`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[13px] text-slate-400">{s.tag === 'ai' ? 'smart_toy' : s.tag === 'inf' ? 'psychology' : 'fact_check'}</span>
                    <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">{s.t}</p>
                  </div>
                  <p className="text-[12px] text-slate-800 font-medium leading-relaxed">{s.c}</p>
                </div>
              ))}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Extracted Hooks & Angles</p>
                <div className="space-y-2">
                   {[
                     "I wasted £12,000 to learn this one content truth...",
                     "The agency illusion: Why your £5k retainer is buying silence.",
                     "Stop building funnels if your message isn't validated."
                   ].map(hx => <div key={hx} className="text-[11px] font-bold text-slate-700 bg-white p-2 rounded shadow-sm border border-slate-100">{hx}</div> )}
                </div>
              </div>
            </div>
            <div className="px-5 py-3 border-t border-slate-100 shrink-0 flex gap-2">
              <button className="flex-1 py-2 bg-slate-900 flex items-center justify-center gap-2 text-white text-[11px] font-bold rounded-lg hover:bg-slate-800">
                <span className="material-symbols-outlined text-[14px]">auto_awesome</span> Create Idea
              </button>
              <button className="px-4 py-2 border border-slate-200 text-slate-600 text-[11px] font-bold rounded-lg hover:bg-slate-50">Save to Library</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
