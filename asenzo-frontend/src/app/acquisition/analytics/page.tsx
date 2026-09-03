"use client";

import React, { useState, useMemo } from "react";
import { SystemEventType } from "@/lib/types/acquisition";

// Mock Event Sourced Analytics Data
interface AnalyticsEvent {
  id: string;
  type: SystemEventType;
  assetId: string;
  assetTitle: string;
  value?: number;
  timestamp: string;
}

const generateMockEvents = (): AnalyticsEvent[] => {
  const events: AnalyticsEvent[] = [];
  
  const generateBatch = (title: string, views: number, dms: number, leads: number, calls: number, won: number, revenue: number) => {
    for (let i=0; i<views; i++) events.push({ id: `e${Math.random()}`, type: "CONTENT_VIEW", assetId: title, assetTitle: title, timestamp: new Date().toISOString() });
    for (let i=0; i<dms; i++) events.push({ id: `e${Math.random()}`, type: "CONVERSATION_CREATED", assetId: title, assetTitle: title, timestamp: new Date().toISOString() });
    for (let i=0; i<leads; i++) events.push({ id: `e${Math.random()}`, type: "LEAD_CREATED", assetId: title, assetTitle: title, timestamp: new Date().toISOString() });
    for (let i=0; i<calls; i++) events.push({ id: `e${Math.random()}`, type: "CALL_BOOKED", assetId: title, assetTitle: title, timestamp: new Date().toISOString() });
    for (let i=0; i<won; i++) events.push({ id: `e${Math.random()}`, type: "DEAL_WON", assetId: title, assetTitle: title, value: revenue, timestamp: new Date().toISOString() });
  };

  generateBatch("Why consistency isn't your problem", 250, 48, 14, 4, 1, 5000);
  generateBatch("The reason your agency didn't work", 120, 38, 12, 3, 1, 5000);
  generateBatch("5 signs your content is attracting wrong clients", 110, 58, 19, 6, 2, 10000);
  generateBatch("I wasted £12,000 on ads", 310, 22, 7, 2, 0, 0);

  return events;
};

const MOCK_EVENTS = generateMockEvents();

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

  // Derive Metrics from Events
  const aggregatedStats = useMemo(() => {
    const assetStats: Record<string, any> = {};
    let totalViews = 0, totalLeads = 0, totalCalls = 0, totalRevenue = 0, totalClosed = 0;

    MOCK_EVENTS.forEach(ev => {
      if (!assetStats[ev.assetTitle]) {
        assetStats[ev.assetTitle] = { title: ev.assetTitle, views: 0, dms: 0, leads: 0, calls: 0, sales: 0, revenue: 0 };
      }
      
      switch (ev.type) {
        case "CONTENT_VIEW":
          assetStats[ev.assetTitle].views++;
          totalViews++;
          break;
        case "CONVERSATION_CREATED":
          assetStats[ev.assetTitle].dms++;
          break;
        case "LEAD_CREATED":
          assetStats[ev.assetTitle].leads++;
          totalLeads++;
          break;
        case "CALL_BOOKED":
          assetStats[ev.assetTitle].calls++;
          totalCalls++;
          break;
        case "DEAL_WON":
          assetStats[ev.assetTitle].sales++;
          assetStats[ev.assetTitle].revenue += (ev.value || 0);
          totalClosed++;
          totalRevenue += (ev.value || 0);
          break;
      }
    });

    return {
      contentPerf: Object.values(assetStats),
      totals: { views: totalViews, leads: totalLeads, calls: totalCalls, closed: totalClosed, revenue: totalRevenue }
    };
  }, []);

  const FUNNEL_CONV = [
    { stage: "Content Views", value: aggregatedStats.totals.views, icon: "visibility" },
    { stage: "Leads Captured", value: aggregatedStats.totals.leads, icon: "person", rate: ((aggregatedStats.totals.leads / aggregatedStats.totals.views) * 100).toFixed(1) + "%" },
    { stage: "Calls Booked", value: aggregatedStats.totals.calls, icon: "call", rate: ((aggregatedStats.totals.calls / aggregatedStats.totals.leads) * 100).toFixed(1) + "%" },
    { stage: "Closed Won", value: aggregatedStats.totals.closed, icon: "handshake", rate: ((aggregatedStats.totals.closed / aggregatedStats.totals.calls) * 100).toFixed(1) + "%" },
    { stage: "Revenue", value: `£${aggregatedStats.totals.revenue.toLocaleString()}`, icon: "payments", rate: "" },
  ];

  return (
    <div className="flex h-[calc(100vh-72px)] overflow-hidden">
      <aside className="w-44 shrink-0 border-r border-slate-100 pt-6 px-3 space-y-0.5 bg-white h-full overflow-y-auto">
        {[
          { id: "overview", label: "Overview", icon: "dashboard" },
          { id: "content", label: "Content Matrix", icon: "view_list" },
          { id: "funnel", label: "Funnel Velocity", icon: "account_tree" },
          { id: "attribution", label: "Event Attribution", icon: "insights" },
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
              <h2 className="text-[16px] font-bold text-slate-900">Unified Analytics</h2>
              <p className="text-[12px] text-slate-500">Fully event-sourced reporting engine directly mapping content views to closed revenue.</p>
            </div>
            
            {/* Top metrics */}
            <div className="grid grid-cols-5 gap-3">
              {[
                { label: "Total Views", value: aggregatedStats.totals.views.toLocaleString(), color: "#2563EB" },
                { label: "Total Leads", value: aggregatedStats.totals.leads.toString(), color: "#8B5CF6" },
                { label: "Calls Booked", value: aggregatedStats.totals.calls.toString(), color: "#D97706" },
                { label: "Closed Won", value: aggregatedStats.totals.closed.toString(), color: "#16A34A" },
                { label: "Pipeline Revenue", value: `£${(aggregatedStats.totals.revenue/1000).toFixed(0)}K`, color: "#7C3AED" },
              ].map(m => (
                <div key={m.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{m.label}</p>
                  <p className="text-[22px] font-bold" style={{ color: m.color }}>{m.value}</p>
                </div>
              ))}
            </div>

            {/* Bottleneck diagnostic */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-[13px] font-bold text-slate-900 mb-3">AI Bottleneck Diagnostic</h3>
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
                <p className="text-[11px] text-red-600 mt-0.5">Automated outreach agent recommends adding a high-urgency proof asset to the Email Sequence CRM.</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Content ── */}
        {view === "content" && (
          <div>
            <div className="mb-5">
              <h2 className="text-[16px] font-bold text-slate-900">Content Matrix Scorecard</h2>
              <p className="text-[12px] text-slate-500">Events aggregated by original content asset source.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-[11px]">
                <thead><tr className="border-b border-slate-100 bg-slate-50">
                  {["Content Source Asset","Views","DMs","Leads","Calls Booked","Sales","Attributed Revenue"].map(h => <th key={h} className="text-left p-3 text-slate-400 font-semibold">{h}</th>)}
                </tr></thead>
                <tbody className="divide-y divide-slate-50">
                  {aggregatedStats.contentPerf.map((c: any) => (
                    <tr key={c.title} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-800 max-w-[200px] truncate">{c.title}</td>
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
              <h2 className="text-[16px] font-bold text-slate-900">Event Funnel Velocity</h2>
              <p className="text-[12px] text-slate-500">Stage to stage conversion based on timestamped event tracking.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
              {FUNNEL_CONV.map((stage) => {
                const max = FUNNEL_CONV[0].value as number;
                const val = typeof stage.value === "number" ? stage.value : null;
                const pct = val ? Math.round((val / max) * 100) : 0;
                return (
                  <div key={stage.stage} className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-[16px] text-slate-400 w-5">{stage.icon}</span>
                    <div className="w-36 shrink-0">
                      <p className="text-[11px] font-semibold text-slate-700">{stage.stage}</p>
                      {stage.rate && <p className="text-[10px] font-bold text-slate-400">{stage.rate}</p>}
                    </div>
                    {val && (
                      <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${Math.max(1, pct)}%` }} />
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
              <h2 className="text-[16px] font-bold text-slate-900">Full-Stack Attribution Mapping</h2>
              <p className="text-[12px] text-slate-500">Tracing closed revenue backwards through all event touchpoints.</p>
            </div>
            <div className="space-y-3">
              {aggregatedStats.contentPerf.filter((c: any) => c.revenue > 0).map((c: any) => (
                <div key={c.title} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[12px] font-bold text-slate-900">{c.title} (Asset Route)</h3>
                    <span className="text-[14px] font-extrabold text-emerald-700">£{c.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 flex-wrap">
                    <span className="font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-600">{c.views.toLocaleString()} VIEW EVENTS</span>
                    <span className="material-symbols-outlined text-[12px]">arrow_right_alt</span>
                    <span className="font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-600">{c.leads} CAPTURE EVENTS</span>
                    <span className="material-symbols-outlined text-[12px]">arrow_right_alt</span>
                    <span className="font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-600">{c.calls} BOOK EVENTS</span>
                    <span className="material-symbols-outlined text-[12px]">arrow_right_alt</span>
                    <span className="font-extrabold bg-emerald-100 px-2 py-0.5 rounded text-emerald-800">{c.sales} CLOSED EVENTS</span>
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
