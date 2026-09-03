"use client";

import React, { useState, useMemo } from "react";
import { SystemEventType } from "@/lib/types/acquisition";
import { getIntelligence } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

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
  const [view, setView] = useState<"overview"|"content"|"funnel"|"attribution"|"channels"|"revenue">("overview");

  // Load backend intelligence data for Channels / Content-Revenue
  const { localData, loading, error } = useAdapter(getIntelligence);

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
      <aside className="w-48 shrink-0 border-r border-slate-100 pt-6 px-3 space-y-0.5 bg-white h-full overflow-y-auto">
        {[
          { id: "overview", label: "Overview", icon: "dashboard" },
          { id: "content", label: "Content Matrix", icon: "view_list" },
          { id: "funnel", label: "Funnel Velocity", icon: "account_tree" },
          { id: "attribution", label: "Event Attribution", icon: "insights" },
          { id: "channels", label: "Channel Performance", icon: "share" },
          { id: "revenue", label: "Content → Revenue", icon: "move_up" },
        ].map(s => (
          <button key={s.id} onClick={() => setView(s.id as any)}
            className={`w-full text-left px-3 py-2 rounded-lg text-[12px] font-semibold flex items-center gap-2 ${view === s.id ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"}`}>
            <span className="material-symbols-outlined text-[14px]">{s.icon}</span>{s.label}
          </button>
        ))}
      </aside>

      <main className="flex-1 py-6 px-8 overflow-y-auto bg-slate-50/30">
        {/* ── Overview ── */}
        {view === "overview" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-[20px] font-bold text-slate-900 tracking-tight">Unified Analytics</h2>
              <p className="text-[13px] text-slate-500 mt-0.5 max-w-2xl">Fully event-sourced reporting engine directly mapping content views to closed revenue across all channels.</p>
            </div>
            
            {/* Top metrics */}
            <div className="grid grid-cols-5 gap-4">
              {[
                { label: "Total Views", value: aggregatedStats.totals.views.toLocaleString(), color: "#2563EB", bg:"bg-blue-50/50" },
                { label: "Total Leads", value: aggregatedStats.totals.leads.toString(), color: "#8B5CF6", bg:"bg-purple-50/50" },
                { label: "Calls Booked", value: aggregatedStats.totals.calls.toString(), color: "#D97706", bg:"bg-orange-50/50" },
                { label: "Closed Won", value: aggregatedStats.totals.closed.toString(), color: "#16A34A", bg:"bg-emerald-50/50" },
                { label: "Pipeline Revenue", value: `£${(aggregatedStats.totals.revenue/1000).toFixed(0)}K`, color: "#7C3AED", bg:"bg-violet-50/50" },
              ].map(m => (
                <div key={m.label} className={`border border-slate-200 rounded-xl p-4 shadow-sm ${m.bg}`}>
                  <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">{m.label}</p>
                  <p className="text-[26px] font-black tracking-tight" style={{ color: m.color }}>{m.value}</p>
                </div>
              ))}
            </div>

            {/* Bottleneck diagnostic */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 block pointer-events-none text-slate-900 material-symbols-outlined text-[100px]">vital_signs</div>
              <h3 className="text-[14px] font-extrabold text-slate-900 mb-4 uppercase tracking-widest flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">psychology</span> AI Bottleneck Diagnostic</h3>
              <div className="space-y-3 relative z-10 w-2/3">
                {BOTTLENECK_CHAIN.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 shadow-sm border ${item.status === "pass" ? "bg-emerald-50 border-emerald-100" : item.status === "warn" ? "bg-amber-50 border-amber-100" : "bg-red-50 border-red-100"}`}>
                      <span className={`material-symbols-outlined text-[14px] font-bold ${item.status === "pass" ? "text-emerald-500" : item.status === "warn" ? "text-amber-500" : "text-red-500"}`}>
                        {item.status === "pass" ? "check" : item.status === "warn" ? "warning" : "close"}
                      </span>
                    </div>
                    <span className={`text-[13px] font-semibold ${item.status === "fail" ? "text-red-700" : "text-slate-700"}`}>{item.q}</span>
                    {item.note && <span className={`text-[10px] ml-auto font-bold uppercase tracking-wider ${item.status === "warn" ? "text-amber-500" : item.status === "fail" ? "text-red-500" : "text-slate-400"}`}>{item.note}</span>}
                  </div>
                ))}
              </div>
              <div className="mt-5 p-4 bg-red-50/50 border border-red-200 rounded-xl shadow-sm relative z-10 w-2/3">
                <p className="text-[12px] font-bold text-red-700">Primary bottleneck: Lead → Application conversion (7.2% vs 12–18% target)</p>
                <p className="text-[12px] font-medium text-red-600 mt-1">Automated outreach agent recommends adding a high-urgency proof asset to the Email Sequence CRM.</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Content Matrix ── */}
        {view === "content" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-[20px] font-bold text-slate-900 tracking-tight">Content Matrix Scorecard</h2>
              <p className="text-[13px] text-slate-500 mt-0.5">Events aggregated by original content asset source to see which topics drive true business value.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-[12px]">
                <thead><tr className="border-b border-slate-200 bg-slate-50">
                  {["Content Source Asset","Views","DMs","Leads","Calls Booked","Sales","Attributed Revenue"].map(h => <th key={h} className="text-left p-4 text-slate-500 font-bold uppercase tracking-wider text-[10px]">{h}</th>)}
                </tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {aggregatedStats.contentPerf.map((c: any) => (
                    <tr key={c.title} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-bold text-slate-900 max-w-[250px] truncate">{c.title}</td>
                      <td className="p-4 text-slate-600 font-semibold">{c.views.toLocaleString()}</td>
                      <td className="p-4 text-slate-600 font-semibold">{c.dms}</td>
                      <td className="p-4 text-slate-600 font-semibold">{c.leads}</td>
                      <td className="p-4 text-slate-600 font-semibold">{c.calls}</td>
                      <td className="p-4 text-slate-600 font-semibold">{c.sales}</td>
                      <td className="p-4 font-black tracking-tight text-emerald-600">{c.revenue > 0 ? `£${c.revenue.toLocaleString()}` : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Funnel Velocity ── */}
        {view === "funnel" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-[20px] font-bold text-slate-900 tracking-tight">Event Funnel Velocity</h2>
              <p className="text-[13px] text-slate-500 mt-0.5">Stage to stage conversion based on timestamped event tracking.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-6">
              {FUNNEL_CONV.map((stage) => {
                const max = FUNNEL_CONV[0].value as number;
                const val = typeof stage.value === "number" ? stage.value : null;
                const pct = val ? Math.round((val / max) * 100) : 0;
                return (
                  <div key={stage.stage} className="flex items-center gap-6">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px] text-slate-500">{stage.icon}</span>
                    </div>
                    <div className="w-40 shrink-0">
                      <p className="text-[13px] font-bold text-slate-800">{stage.stage}</p>
                      {stage.rate && <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{stage.rate} Conversions</p>}
                    </div>
                    {val !== null ? (
                      <div className="flex-1 flex gap-2 items-center">
                        <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                          <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${Math.max(2, pct)}%` }} />
                        </div>
                      </div>
                    ) : (
                       <div className="flex-1 h-6"></div>
                    )}
                    <div className="w-24 text-right">
                      <span className="text-[18px] font-black text-slate-900">{typeof stage.value === "number" ? stage.value.toLocaleString() : stage.value}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Event Attribution ── */}
        {view === "attribution" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-[20px] font-bold text-slate-900 tracking-tight">Full-Stack Attribution Mapping</h2>
              <p className="text-[13px] text-slate-500 mt-0.5 max-w-2xl">Tracing closed revenue backwards through all digital event touchpoints to uncover canonical acquisition paths.</p>
            </div>
            <div className="space-y-4">
              {aggregatedStats.contentPerf.filter((c: any) => c.revenue > 0).map((c: any) => (
                <div key={c.title} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[15px] font-bold text-slate-900 flex items-center gap-2"><span className="material-symbols-outlined text-slate-400 text-[18px]">account_tree</span> {c.title}</h3>
                    <span className="text-[18px] font-black tracking-tight text-emerald-600">£{c.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 flex-wrap">
                    <span className="font-bold bg-slate-100 px-3 py-1.5 rounded-lg text-slate-600 shadow-sm border border-slate-200">{c.views.toLocaleString()} VIEW EVENTS</span>
                    <span className="material-symbols-outlined text-[16px] text-slate-300">double_arrow</span>
                    <span className="font-bold bg-slate-100 px-3 py-1.5 rounded-lg text-slate-600 shadow-sm border border-slate-200">{c.leads} CAPTURE EVENTS</span>
                    <span className="material-symbols-outlined text-[16px] text-slate-300">double_arrow</span>
                    <span className="font-bold bg-slate-100 px-3 py-1.5 rounded-lg text-slate-600 shadow-sm border border-slate-200">{c.calls} BOOK EVENTS</span>
                    <span className="material-symbols-outlined text-[16px] text-slate-300">double_arrow</span>
                    <span className="font-black tracking-widest bg-emerald-100/50 px-3 py-1.5 rounded-lg text-emerald-700 shadow-sm border border-emerald-200">{c.sales} CLOSED DEALS</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Channels ── */}
        {view === "channels" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-[20px] font-bold text-slate-900 tracking-tight">Channel Performance Center</h2>
              <p className="text-[13px] text-slate-500 mt-0.5 max-w-2xl">This view exposes channels driving vanity metrics vs. true commercial results.</p>
            </div>
            
            {loading ? (
              <div className="p-10 animate-pulse h-96 w-full bg-white rounded-xl border border-slate-200"></div>
            ) : error || !localData ? (
              <div className="p-10 text-red-600 font-bold bg-red-50 border border-red-200 rounded-xl">Error loading channels data.</div>
            ) : localData.channels.length === 0 ? (
              <div className="p-16 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
                <h3 className="text-[14px] font-bold text-slate-900 mb-2">No channel performance data available.</h3>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-[12px] whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Channel</th>
                      <th className="px-5 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-right">Reach</th>
                      <th className="px-5 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-center">Quality</th>
                      <th className="px-5 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-right">Qualified / Leads</th>
                      <th className="px-5 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-right">Opp Conv %</th>
                      <th className="px-5 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-right">Rev / Opp</th>
                      <th className="px-5 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-right">Total Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {localData.channels.map((c: any) => (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-5 py-4 font-bold text-slate-900 text-[13px]">{c.channel}</td>
                        <td className="px-5 py-4 text-right font-medium text-slate-700 text-[13px]">{c.reach.toLocaleString()}</td>
                        <td className="px-5 py-4 text-center">
                          <span className={`px-2 py-1 rounded-lg text-[9px] uppercase font-bold tracking-widest ${c.engagementQuality === 'High' ? 'bg-emerald-100/50 text-emerald-700 border border-emerald-200' : c.engagementQuality === 'Low' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>{c.engagementQuality}</span>
                        </td>
                        <td className="px-5 py-4 text-right text-[13px]">
                          <span className="font-bold text-blue-600 bg-blue-50 px-1 rounded">{c.qualifiedLeads}</span> <span className="text-slate-400">/ {c.leads}</span>
                        </td>
                        <td className="px-5 py-4 text-right font-black text-slate-800 text-[13px]">{c.conversionRate}%</td>
                        <td className="px-5 py-4 text-right font-bold text-slate-500 text-[13px]">${c.revenuePerOpportunity.toLocaleString()}</td>
                        <td className="px-5 py-4 text-right font-black tracking-tight text-emerald-600 text-[14px]">${c.revenue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Content Revenue ── */}
        {view === "revenue" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-[20px] font-bold text-slate-900 tracking-tight">Content-to-Revenue Bridge</h2>
              <p className="text-[13px] text-slate-500 mt-0.5 max-w-2xl">Which ideas manufacture the highest intent? This maps exact pieces of content directly to pipeline creation and closed revenue.</p>
            </div>
            
            {loading ? (
              <div className="p-10 animate-pulse h-96 w-full bg-white rounded-xl border border-slate-200"></div>
            ) : error || !localData ? (
              <div className="p-10 text-red-600 font-bold bg-red-50 border border-red-200 rounded-xl">Error loading Content to Revenue data.</div>
            ) : localData.contentRevenue.length === 0 ? (
              <div className="p-16 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
                <h3 className="text-[14px] font-bold text-slate-900 mb-2">No content-to-revenue mapping available.</h3>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-[12px] whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Content Core</th>
                      <th className="px-5 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Stage</th>
                      <th className="px-5 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Role</th>
                      <th className="px-5 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-right">Reach</th>
                      <th className="px-5 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-right">Qualified</th>
                      <th className="px-5 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-right">Revenue Influenced</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {localData.contentRevenue.map((c: any) => (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-5 py-4">
                          <p className="font-bold text-slate-900 text-[13px] max-w-[300px] truncate">{c.contentPiece}</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1.5 flex items-center gap-2"><span className="bg-slate-100 px-1 rounded">{c.contentPillar}</span> <span>{c.channel}</span></p>
                        </td>
                        <td className="px-5 py-4">
                          <span className="px-2 py-1 rounded-lg text-[9px] uppercase font-bold tracking-widest bg-blue-50 text-blue-700 border border-blue-100">{c.awarenessStage}</span>
                        </td>
                        <td className="px-5 py-4 text-[13px] font-semibold text-slate-700">{c.funnelRole}</td>
                        <td className="px-5 py-4 text-right text-[13px] text-slate-600 font-medium">{c.reach.toLocaleString()}</td>
                        <td className="px-5 py-4 text-right text-[13px] font-black text-slate-900">{c.qualifiedLeads}</td>
                        <td className="px-5 py-4 text-right font-black tracking-tight text-emerald-600 text-[14px]">${c.revenueInfluenced.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
