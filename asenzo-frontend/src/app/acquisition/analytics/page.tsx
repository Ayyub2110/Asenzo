"use client";

import React, { useMemo } from "react";

// ─── 1. Canonical Event Model (ACQUISITION SCOPE ONLY) ───────────────────────

type EventType = 
  | "CONTENT_VIEW" 
  | "ENGAGEMENT" 
  | "CTA_RESPONSE" 
  | "LEAD_CAPTURED";

interface AnalyticsEvent {
  id: string;
  type: EventType;
  channel: string;
  assetId: string;
  assetTitle: string;
  timestamp: string;
}

// ─── 2. Metric Engine ───────────────────────────────────────────────────────

const calcRateStr = (num: number, den: number): string => {
  if (!den || den === 0) return "0.0%";
  return ((num / den) * 100).toFixed(1) + "%";
};

const determinePerformance = (views: number, leads: number): string => {
  if (views === 0) return "Insufficient Data";
  const rate = leads / views;
  if (rate > 0.05) return "Best";
  if (rate > 0.02) return "Strong";
  if (rate > 0.01) return "Healthy";
  return "Weak";
};

// ─── 3. Mock Data Generator ──────────────────────────────────────────────────

const generateMockEvents = (): AnalyticsEvent[] => {
  const events: AnalyticsEvent[] = [];
  const ts = new Date().toISOString();
  
  const generatePath = (
    title: string, channel: string,
    views: number, eng: number, resp: number, leads: number
  ) => {
    for (let i=0; i<views; i++) events.push({ id: `e${Math.random()}`, type: "CONTENT_VIEW", channel, assetId: title, assetTitle: title, timestamp: ts });
    for (let i=0; i<eng; i++) events.push({ id: `e${Math.random()}`, type: "ENGAGEMENT", channel, assetId: title, assetTitle: title, timestamp: ts });
    for (let i=0; i<resp; i++) events.push({ id: `e${Math.random()}`, type: "CTA_RESPONSE", channel, assetId: title, assetTitle: title, timestamp: ts });
    for (let i=0; i<leads; i++) events.push({ id: `e${Math.random()}`, type: "LEAD_CAPTURED", channel, assetId: title, assetTitle: title, timestamp: ts });
  };

  generatePath("Why consistency isn't your problem", "LinkedIn", 250, 48, 14, 8);
  generatePath("The reason your agency didn't work", "LinkedIn", 120, 38, 12, 7);
  generatePath("5 signs your content is attracting wrong clients", "Instagram", 110, 58, 19, 12);
  generatePath("I wasted £12,000 on ads", "X", 310, 22, 7, 3);

  return events;
};

const MOCK_EVENTS = generateMockEvents();

// ─── 4. Component ─────────────────────────────────────────────────────────────

export default function AcquisitionAnalyticsPage() {
  
  // Single pass aggregation engine
  const analytics = useMemo(() => {
    let views=0, eng=0, responses=0, leads=0;
    const contentStats: Record<string, any> = {};
    const channelStats: Record<string, any> = {};

    MOCK_EVENTS.forEach(ev => {
      if (!contentStats[ev.assetTitle]) {
        contentStats[ev.assetTitle] = { title: ev.assetTitle, channel: ev.channel, views:0, eng:0, responses:0, leads:0 };
      }
      if (!channelStats[ev.channel]) {
        channelStats[ev.channel] = { channel: ev.channel, views:0, eng:0, responses:0, leads:0 };
      }

      const cs = contentStats[ev.assetTitle];
      const ch = channelStats[ev.channel];

      switch (ev.type) {
        case "CONTENT_VIEW": views++; cs.views++; ch.views++; break;
        case "ENGAGEMENT": eng++; cs.eng++; ch.eng++; break;
        case "CTA_RESPONSE": responses++; cs.responses++; ch.responses++; break;
        case "LEAD_CAPTURED": leads++; cs.leads++; ch.leads++; break;
      }
    });

    const contentArray = Object.values(contentStats).sort((a,b) => b.leads - a.leads);
    const channelArray = Object.values(channelStats).sort((a,b) => b.leads - a.leads);

    const topContent = contentArray.length > 0 ? contentArray[0].title : "None";
    const topChannel = channelArray.length > 0 ? channelArray[0].channel : "None";

    return {
      totals: { views, eng, responses, leads },
      content: contentArray,
      channels: channelArray,
      topContent,
      topChannel
    };
  }, []);

  const d = analytics.totals;

  if (d.views === 0) {
    return (
       <div className="flex h-full items-center justify-center bg-slate-50">
          <div className="text-center p-8 bg-white border border-slate-200 rounded-xl shadow-sm">
             <span className="material-symbols-outlined text-[48px] text-slate-300 mb-4">insights</span>
             <h2 className="text-[16px] font-bold text-slate-900 mb-2">No acquisition data yet</h2>
             <p className="text-[13px] text-slate-500">Connect a channel or publish content to begin tracking.</p>
          </div>
       </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/50 font-sans h-full">
      
      {/* HEADER */}
      <div className="sticky top-0 z-10 border-b border-slate-200 px-10 py-5 bg-white flex items-center justify-between shadow-sm">
        <div>
           <h1 className="text-[16px] font-black tracking-widest uppercase text-slate-900">Acquisition Analytics</h1>
           <p className="text-[12px] text-slate-500 font-medium">Which acquisition activities are actually creating qualified demand?</p>
        </div>
        <div className="flex items-center gap-3">
           <select className="px-3 py-1.5 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 bg-white"><option>Last 30 Days</option></select>
        </div>
      </div>

      <div className="p-10 max-w-[1200px] mx-auto space-y-10">
        
        {/* OVERVIEW KPI */}
        <div className="grid grid-cols-6 gap-4">
           <KPICard label="Views / Reach" value={d.views.toLocaleString()} />
           <KPICard label="Engagements" value={d.eng.toLocaleString()} />
           <KPICard label="DM / CTA Responses" value={d.responses.toLocaleString()} />
           <KPICard label="Leads Captured" value={d.leads.toLocaleString()} highlight />
           <KPICard label="Top Source" value={analytics.topChannel} isText />
           <KPICard label="Top Content" value={analytics.topContent} isText />
        </div>

        {/* ACQUISITION HEALTH DIAGNOSTIC */}
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm flex items-start gap-8">
           <div className="w-1/3 shrink-0 space-y-3">
              <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-4">Acquisition Health</h3>
              <HealthItem label="Content attracting" status="pass" />
              <HealthItem label="Distribution working" status="pass" />
              <HealthItem label="Audience responding" status="pass" />
              <HealthItem label="CTA response declining" status="warn" />
           </div>
           <div className="flex-1 bg-slate-50 rounded-xl p-6 border border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Primary Issue</p>
              <h4 className="text-[15px] font-bold text-slate-900 mb-6 leading-relaxed">Content is getting attention, but fewer people are taking the next acquisition action.</h4>
              
              <div className="flex gap-3">
                 <span className="material-symbols-outlined text-blue-600 text-[20px]">psychology</span>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">AI Recommendation</p>
                    <p className="text-[13px] font-medium text-slate-700 leading-relaxed">Strengthen the CTA on the highest-reach content and connect it to the most relevant conversion asset.</p>
                 </div>
              </div>
           </div>
        </div>

        {/* ACQUISITION FUNNEL */}
        <div className="space-y-4">
           <h2 className="text-[15px] font-black text-slate-900 uppercase tracking-widest">Acquisition Funnel</h2>
           <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm flex items-center justify-between relative overflow-hidden">
              <FunnelStage label="Views" val={d.views} />
              <FunnelConnector rate={calcRateStr(d.eng, d.views)} />
              
              <FunnelStage label="Engagement" val={d.eng} />
              <FunnelConnector rate={calcRateStr(d.responses, d.eng)} />
              
              <FunnelStage label="Response" val={d.responses} />
              <FunnelConnector rate={calcRateStr(d.leads, d.responses)} />
              
              <FunnelStage label="Lead" val={d.leads} highlight />
           </div>
        </div>

        {/* CONTENT & CHANNEL SECTIONS */}
        <div className="grid grid-cols-3 gap-8">
           
           <div className="col-span-2 space-y-10">
              {/* CONTENT PERFORMANCE */}
              <div className="space-y-4">
                 <h2 className="text-[15px] font-black text-slate-900 uppercase tracking-widest">Content Performance</h2>
                 <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
                    <table className="w-full text-left whitespace-nowrap">
                       <thead className="bg-slate-50 border-b border-slate-200">
                          <tr>
                             <th className="px-5 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500">Content</th>
                             <th className="px-5 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500 text-right">Views</th>
                             <th className="px-5 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500 text-right">Engage</th>
                             <th className="px-5 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500 text-right">CTA</th>
                             <th className="px-5 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500 text-right">Leads</th>
                             <th className="px-5 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500 text-center">Performance</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                          {analytics.content.map(c => (
                             <tr key={c.title} className="hover:bg-slate-50/50 cursor-pointer transition-colors group">
                                <td className="px-5 py-4 text-[13px] font-bold text-slate-900 group-hover:text-blue-600 max-w-[220px] truncate">{c.title}</td>
                                <td className="px-5 py-4 text-[13px] font-semibold text-slate-600 text-right">{c.views.toLocaleString()}</td>
                                <td className="px-5 py-4 text-[13px] font-semibold text-slate-600 text-right">{c.eng.toLocaleString()}</td>
                                <td className="px-5 py-4 text-[13px] font-semibold text-slate-600 text-right">{c.responses.toLocaleString()}</td>
                                <td className="px-5 py-4 text-[13px] font-bold text-slate-900 text-right">{c.leads.toLocaleString()}</td>
                                <td className="px-5 py-4 text-center">
                                   <StatusBadge status={determinePerformance(c.views, c.leads)} />
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>

              {/* CHANNEL PERFORMANCE */}
              <div className="space-y-4">
                 <h2 className="text-[15px] font-black text-slate-900 uppercase tracking-widest">Channel Performance</h2>
                 <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left whitespace-nowrap">
                       <thead className="bg-slate-50 border-b border-slate-200">
                          <tr>
                             <th className="px-5 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500">Channel</th>
                             <th className="px-5 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500 text-right">Reach</th>
                             <th className="px-5 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500 text-right">Engage</th>
                             <th className="px-5 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500 text-right">Responses</th>
                             <th className="px-5 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500 text-right">Leads</th>
                             <th className="px-5 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500 text-center">Status</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                          {analytics.channels.map(c => (
                             <tr key={c.channel} className="hover:bg-slate-50/50">
                                <td className="px-5 py-4 text-[13px] font-black text-slate-900">{c.channel}</td>
                                <td className="px-5 py-4 text-[13px] font-semibold text-slate-600 text-right">{c.views.toLocaleString()}</td>
                                <td className="px-5 py-4 text-[13px] font-semibold text-slate-600 text-right">{c.eng.toLocaleString()}</td>
                                <td className="px-5 py-4 text-[13px] font-semibold text-slate-600 text-right">{c.responses.toLocaleString()}</td>
                                <td className="px-5 py-4 text-[13px] font-bold text-slate-900 text-right">{c.leads.toLocaleString()}</td>
                                <td className="px-5 py-4 text-center">
                                   <StatusBadge status={determinePerformance(c.views, c.leads)} />
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>

           {/* TOP SOURCES SIDEBAR */}
           <div className="space-y-4">
              <h2 className="text-[15px] font-black text-slate-900 uppercase tracking-widest">Top Acquisition Sources</h2>
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-8">
                 
                 <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-4 border-b border-slate-100 pb-2">Top Content Streams</h3>
                    <div className="space-y-4">
                       {analytics.content.slice(0,3).map((c, i) => (
                          <div key={c.title} className="flex gap-3">
                             <div className="text-[12px] font-black text-slate-300 w-4">{i+1}.</div>
                             <div>
                                <p className="text-[12px] font-bold text-slate-900 leading-tight mb-1">{c.title}</p>
                                <p className="text-[11px] font-bold text-slate-500">{c.leads} leads</p>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>

                 <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-4 border-b border-slate-100 pb-2">Top Channels</h3>
                    <div className="space-y-4">
                       {analytics.channels.slice(0,3).map((c, i) => (
                          <div key={c.channel} className="flex gap-3 items-center">
                             <div className="text-[12px] font-black text-slate-300 w-4">{i+1}.</div>
                             <p className="text-[13px] font-bold text-slate-900 flex-1">{c.channel}</p>
                             <p className="text-[11px] font-bold text-slate-500">{c.leads} leads</p>
                          </div>
                       ))}
                    </div>
                 </div>

              </div>
           </div>

        </div>
      </div>
    </div>
  );
}

// ─── Subcomponents ─────────────────────────────────────────────────────────────

function KPICard({ label, value, highlight, isText }: { label: string, value: string, highlight?: boolean, isText?: boolean }) {
   return (
      <div className={`p-5 rounded-xl border ${highlight ? 'bg-slate-900 border-slate-900 shadow-md' : 'bg-white border-slate-200 shadow-sm'}`}>
         <p className={`text-[10px] font-black uppercase tracking-widest mb-3 ${highlight ? 'text-slate-400' : 'text-slate-500'}`}>{label}</p>
         {isText ? (
            <p className={`text-[13px] font-bold tracking-tight leading-snug truncate ${highlight ? 'text-white' : 'text-slate-900'}`}>{value}</p>
         ) : (
            <p className={`text-[28px] font-black leading-none ${highlight ? 'text-white' : 'text-slate-900'}`}>{value}</p>
         )}
      </div>
   )
}

function HealthItem({ label, status }: { label: string, status: "pass" | "warn" | "fail" }) {
   return (
      <div className="flex items-center gap-3">
         <span className={`material-symbols-outlined text-[16px] font-black ${status === 'pass' ? 'text-emerald-500' : status === 'warn' ? 'text-amber-500' : 'text-red-500'}`}>
            {status === 'pass' ? 'check' : 'warning'}
         </span>
         <span className={`text-[13px] font-bold ${status === 'warn' ? 'text-slate-900' : 'text-slate-600'}`}>{label}</span>
      </div>
   )
}

function FunnelStage({ label, val, highlight }: { label: string, val: number, highlight?: boolean }) {
   return (
      <div className="flex flex-col items-center">
         <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">{label}</p>
         <div className={`px-6 py-3 rounded-lg border font-black text-[22px] ${highlight ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
            {val.toLocaleString()}
         </div>
      </div>
   )
}

function FunnelConnector({ rate }: { rate: string }) {
   return (
      <div className="flex-1 flex flex-col items-centerjustify-center relative mx-4 mt-6">
         <div className="w-full h-px bg-slate-200 absolute top-1/2 -translate-y-1/2"></div>
         <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t border-r border-slate-300 rotate-45 transform translate-x-1/2"></div>
         <div className="relative z-10 bg-white px-3 py-1 border border-slate-200 rounded-full text-[11px] font-bold text-slate-500 shadow-sm mx-auto self-center">
            {rate}
         </div>
      </div>
   )
}

function StatusBadge({ status }: { status: string }) {
   const colors = {
      Best: 'bg-emerald-100 text-emerald-800',
      Strong: 'bg-emerald-50 text-emerald-700',
      Healthy: 'bg-blue-50 text-blue-700',
      Weak: 'bg-red-50 text-red-700',
      'Needs Attention': 'bg-amber-100 text-amber-800',
      'Insufficient Data': 'bg-slate-100 text-slate-600'
   } as Record<string, string>;

   return (
      <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${colors[status] || colors['Insufficient Data']}`}>
         {status}
      </span>
   )
}
