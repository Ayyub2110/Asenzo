"use client";

import React, { useState } from "react";

const CONTENT_PERF = [
  { title: "Why consistency isn't your problem", awareness: "Problem-Aware", funnel: "TOF", views: 95400, reach: 180000, likes: 4200, comments: 890, saves: 1340, profileVisits: 2800, dms: 47, leads: 14, calls: 4, sales: 1, revenue: 5000 },
  { title: "The reason your agency didn't work", awareness: "Solution-Aware", funnel: "MOF", views: 67200, reach: 112000, likes: 3100, comments: 620, saves: 980, profileVisits: 1900, dms: 38, leads: 12, calls: 3, sales: 1, revenue: 5000 },
  { title: "5 signs your content is attracting wrong clients", awareness: "Problem-Aware", funnel: "MOF", views: 84300, reach: 140000, likes: 5600, comments: 1240, saves: 2100, profileVisits: 3200, dms: 58, leads: 19, calls: 6, sales: 2, revenue: 10000 },
  { title: "From 0 to 12 inbound DMs/week", awareness: "Product-Aware", funnel: "BOF", views: 24600, reach: 38000, likes: 1100, comments: 280, saves: 540, profileVisits: 1400, dms: 31, leads: 10, calls: 4, sales: 2, revenue: 10000 },
  { title: "I wasted £12,000 on ads", awareness: "Solution-Aware", funnel: "MOF", views: 41000, reach: 68000, likes: 2800, comments: 510, saves: 780, profileVisits: 1600, dms: 22, leads: 7, calls: 2, sales: 0, revenue: 0 },
];

const FUNNEL_CONV = [
  { stage: "Content Reach", value: 1826000, icon: "visibility" },
  { stage: "Profile Visits", value: 18600, icon: "person", rate: "1.0%" },
  { stage: "DMs / Leads", value: 350, icon: "chat", rate: "1.9%" },
  { stage: "Applications", value: 287, icon: "description", rate: "82%" },
  { stage: "Calls Booked", value: 97, icon: "call", rate: "34%" },
  { stage: "Showed", value: 75, icon: "video_call", rate: "77%" },
  { stage: "Closed", value: 17, icon: "handshake", rate: "23%" },
  { stage: "Revenue", value: "£51,000", icon: "payments", rate: "" },
];

const BOTTLENECK_CHAIN = [
  { q: "Strategy clear?", status: "pass" },
  { q: "Positioning clear?", status: "pass" },
  { q: "Offer strong?", status: "pass" },
  { q: "Audience clear?", status: "warn", note: "30-day staleness" },
  { q: "Content attracting?", status: "pass" },
  { q: "People responding (DMs)?", status: "pass" },
  { q: "Conversations converting to applications?", status: "fail", note: "7.2% — target 12–18%" },
  { q: "Calls converting?", status: "pass", note: "23% close rate" },
  { q: "Clients producing results?", status: "pass" },
];

export default function AnalyticsPage() {
  const [view, setView] = useState<"overview"|"content"|"funnel"|"attribution">("overview");
  const totalRevenue = CONTENT_PERF.reduce((a, c) => a + c.revenue, 0);
  const totalLeads = CONTENT_PERF.reduce((a, c) => a + c.leads, 0);
  const totalViews = CONTENT_PERF.reduce((a, c) => a + c.views, 0);
  const totalCalls = CONTENT_PERF.reduce((a, c) => a + c.calls, 0);

  return (
    <div className="flex h-full">
      <aside className="w-44 shrink-0 border-r border-slate-100 pt-6 px-3 space-y-0.5 bg-white sticky top-0 h-[calc(100vh-128px)]">
        {[
          { id: "overview", label: "Overview", icon: "dashboard" },
          { id: "content", label: "Content", icon: "view_list" },
          { id: "funnel", label: "Funnel", icon: "account_tree" },
          { id: "attribution", label: "Attribution", icon: "insights" },
        ].map(s => (
          <button key={s.id} onClick={() => setView(s.id as typeof view)}
            className={`w-full text-left px-3 py-2 rounded-lg text-[12px] font-semibold flex items-center gap-2 ${view === s.id ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`}>
            <span className="material-symbols-outlined text-[14px]">{s.icon}</span>{s.label}
          </button>
        ))}
      </aside>

      <main className="flex-1 py-6 px-8 overflow-y-auto">
        {/* ── Overview ── */}
        {view === "overview" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-[16px] font-bold text-slate-900">Analytics</h2>
              <p className="text-[12px] text-slate-500">Content performance → funnel → leads → revenue attribution.</p>
            </div>
            {/* Top metrics */}
            <div className="grid grid-cols-5 gap-3">
              {[
                { label: "Total Views", value: totalViews.toLocaleString(), color: "#2563EB" },
                { label: "Total Leads", value: totalLeads.toString(), color: "#8B5CF6" },
                { label: "Calls Booked", value: totalCalls.toString(), color: "#D97706" },
                { label: "Closed", value: "17", color: "#16A34A" },
                { label: "Revenue", value: `£${(totalRevenue/1000).toFixed(0)}K`, color: "#7C3AED" },
              ].map(m => (
                <div key={m.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{m.label}</p>
                  <p className="text-[22px] font-bold" style={{ color: m.color }}>{m.value}</p>
                </div>
              ))}
            </div>

            {/* Bottleneck diagnostic */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-[13px] font-bold text-slate-900 mb-3">Bottleneck Diagnostic</h3>
              <div className="space-y-2">
                {BOTTLENECK_CHAIN.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${item.status === "pass" ? "bg-emerald-100" : item.status === "warn" ? "bg-amber-100" : "bg-red-100"}`}>
                      <span className={`material-symbols-outlined text-[12px] ${item.status === "pass" ? "text-emerald-600" : item.status === "warn" ? "text-amber-600" : "text-red-600"}`}>
                        {item.status === "pass" ? "check" : "warning"}
                      </span>
                    </div>
                    <span className={`text-[12px] ${item.status === "fail" ? "font-bold text-red-700" : "text-slate-700"}`}>{item.q}</span>
                    {item.note && <span className={`text-[10px] ml-auto font-semibold ${item.status === "warn" ? "text-amber-600" : item.status === "fail" ? "text-red-600" : "text-slate-400"}`}>{item.note}</span>}
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-[11px] font-bold text-red-700">Primary bottleneck: Lead → Application conversion (7.2% vs 12–18% target)</p>
                <p className="text-[11px] text-red-600 mt-0.5">Consider adding a case-study bridge and 5-day email nurture between Lead Magnet and Application.</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Content ── */}
        {view === "content" && (
          <div>
            <div className="mb-5">
              <h2 className="text-[16px] font-bold text-slate-900">Content Performance</h2>
              <p className="text-[12px] text-slate-500">Every content piece linked to its acquisition outcomes.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-[11px]">
                <thead><tr className="border-b border-slate-100 bg-slate-50">
                  {["Content","Funnel","Views","DMs","Leads","Calls","Sales","Revenue"].map(h => <th key={h} className="text-left p-3 text-slate-400 font-semibold">{h}</th>)}
                </tr></thead>
                <tbody className="divide-y divide-slate-50">
                  {CONTENT_PERF.map(c => (
                    <tr key={c.title} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-800 max-w-[200px] truncate">{c.title}</td>
                      <td className="p-3"><span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${c.funnel==="TOF"?"bg-slate-100 text-slate-600":c.funnel==="MOF"?"bg-violet-100 text-violet-700":"bg-emerald-100 text-emerald-700"}`}>{c.funnel}</span></td>
                      <td className="p-3 text-slate-700">{c.views.toLocaleString()}</td>
                      <td className="p-3 text-slate-700">{c.dms}</td>
                      <td className="p-3 text-slate-700">{c.leads}</td>
                      <td className="p-3 text-slate-700">{c.calls}</td>
                      <td className="p-3 text-slate-700">{c.sales}</td>
                      <td className="p-3 font-bold text-emerald-700">{c.revenue > 0 ? `£${c.revenue.toLocaleString()}` : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Funnel ── */}
        {view === "funnel" && (
          <div>
            <div className="mb-5">
              <h2 className="text-[16px] font-bold text-slate-900">Funnel Performance</h2>
              <p className="text-[12px] text-slate-500">Conversion waterfall from reach to revenue.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
              {FUNNEL_CONV.map((stage, i) => {
                const max = FUNNEL_CONV[0].value as number;
                const val = typeof stage.value === "number" ? stage.value : null;
                const pct = val ? Math.round((val / max) * 100) : 0;
                return (
                  <div key={stage.stage} className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-[16px] text-slate-400 w-5">{stage.icon}</span>
                    <div className="w-36 shrink-0">
                      <p className="text-[11px] font-semibold text-slate-700">{stage.stage}</p>
                      {stage.rate && <p className="text-[10px] text-slate-400">{stage.rate}</p>}
                    </div>
                    {val && (
                      <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    )}
                    <div className="w-24 text-right">
                      <span className="text-[12px] font-bold text-slate-900">{typeof stage.value === "number" ? stage.value.toLocaleString() : stage.value}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Attribution ── */}
        {view === "attribution" && (
          <div>
            <div className="mb-5">
              <h2 className="text-[16px] font-bold text-slate-900">Attribution</h2>
              <p className="text-[12px] text-slate-500">Which ideas actually made money?</p>
            </div>
            <div className="space-y-3">
              {CONTENT_PERF.filter(c => c.revenue > 0).map(c => (
                <div key={c.title} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[12px] font-bold text-slate-900">{c.title}</h3>
                    <span className="text-[14px] font-bold text-emerald-700">£{c.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 flex-wrap">
                    <span className="font-semibold">{c.views.toLocaleString()} views</span>
                    <span>→</span>
                    <span>{c.dms} DMs</span>
                    <span>→</span>
                    <span>{c.leads} leads</span>
                    <span>→</span>
                    <span>{c.calls} calls</span>
                    <span>→</span>
                    <span className="font-bold text-emerald-700">{c.sales} sales</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
