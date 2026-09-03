"use client";

import React from "react";
import Link from "next/link";
import { useConversionOS } from "@/contexts/ConversionOSContext";

export default function ConversionIntelligenceWorkspace() {
  const { opportunities } = useConversionOS();

  // Compute aggregate triggers
  const triggerMap: Record<string, number> = {};
  // Compute aggregate objections (lost reasons)
  const reasonMap: Record<string, number> = {};

  opportunities.forEach(opp => {
     if (opp.buyingTrigger) {
        triggerMap[opp.buyingTrigger] = (triggerMap[opp.buyingTrigger] || 0) + 1;
     }
     if (opp.pipelineStage === "LOST" && opp.objections && opp.objections.length > 0) {
        opp.objections.forEach(obj => {
           reasonMap[obj] = (reasonMap[obj] || 0) + 1;
        });
     }
  });

  const triggers = Object.entries(triggerMap).sort((a,b) => b[1] - a[1]).slice(0, 5);
  const lostReasons = Object.entries(reasonMap).sort((a,b) => b[1] - a[1]).slice(0, 5);
  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Conversion Intelligence Insights</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Aggregate AI analysis of all conversion bottlenecks, objections, and buying triggers.</p>
        </div>
        <button className="px-4 py-2 bg-slate-900 text-white text-[12px] font-bold rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px]">refresh</span>
          Re-run Intelligence Engine
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Top Insights */}
        <div className="col-span-8 space-y-5">
           
           <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
             <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-[20px] text-red-500">warning</span>
                <h2 className="text-[14px] font-bold text-slate-900">Primary Conversion Bottleneck Detected</h2>
             </div>
             
             <div className="bg-red-50/50 border border-red-100 rounded-lg p-5">
                <div className="flex items-center justify-between mb-3">
                   <div className="font-bold text-[13px] text-red-900">Offer Presented → Won (25% Conversion)</div>
                   <div className="text-[11px] font-bold px-2 py-1 bg-white text-red-600 rounded shadow-sm border border-red-100">
                     High Impact Leak
                   </div>
                </div>
                <p className="text-[12px] text-red-800 leading-relaxed font-medium">
                  We are successfully diagnosing and presenting offers, but losing 75% of opportunities at the decision stage. The primary logged objection is not price, but <b className="font-bold">Trust / Previous Agency Failure</b>.
                </p>
                
                <div className="mt-4 pt-4 border-t border-red-100">
                   <span className="text-[10px] font-bold text-red-700 uppercase tracking-widest block mb-2">Acquisition Feedback Loop Pattern</span>
                   <p className="text-[12px] text-slate-700">Leads generated from the "Organic Scaling" campaign lack mid-funnel proof exposure before the call.</p>
                   
                   <Link href="/acquisition/strategy" className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-white text-red-700 text-[11px] font-bold rounded-lg border border-red-200 hover:bg-red-50 transition-colors">
                     Push Insight to Content Strategy Queue
                   </Link>
                </div>
             </div>
           </div>

           <div className="grid grid-cols-2 gap-5">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                 <h3 className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-4">Top Buying Triggers</h3>
                 <div className="space-y-3">
                    {triggers.length > 0 ? triggers.map(([trigger, count], i) => (
                      <div key={i} className="flex flex-col">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[12px] font-bold text-slate-900 truncate max-w-[200px]">{trigger}</span>
                          <span className="text-[11px] font-bold text-slate-500">{count}x</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                           <div className="bg-blue-500 h-full rounded-full" style={{ width: `${(count/Math.max(...triggers.map(t=>t[1])))*100}%` }} />
                        </div>
                      </div>
                    )) : <p className="text-[12px] text-slate-500">No triggers extracted yet.</p>}
                 </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                 <h3 className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-4">Top Lost Reasons</h3>
                 <div className="space-y-3">
                    {lostReasons.length > 0 ? lostReasons.map(([reason, count], i) => (
                      <div key={i} className="flex flex-col">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[12px] font-bold text-slate-900 truncate max-w-[150px]">{reason}</span>
                          <span className="text-[11px] font-bold text-slate-500">{count}x</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                           <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(count/Math.max(...lostReasons.map(r=>r[1])))*100}%` }} />
                        </div>
                      </div>
                    )) : <p className="text-[12px] text-slate-500">No loss patterns mapped.</p>}
                 </div>
              </div>
           </div>

        </div>

        {/* Right Column: AI Insights */}
        <div className="col-span-4 space-y-5">
           <div className="bg-violet-50/50 border border-violet-100 rounded-xl p-5 shadow-sm">
              <h3 className="text-[11px] font-bold text-violet-700 uppercase tracking-widest flex items-center gap-1.5 mb-4 border-b border-violet-100 pb-3">
                 <span className="material-symbols-outlined text-[14px]">psychology</span>
                 Agent Observations
              </h3>
              
              <div className="space-y-4">
                 <div>
                   <span className="text-[12px] font-bold text-slate-900 block mb-1">High Intent Cohort Found</span>
                   <p className="text-[11px] text-slate-600 leading-relaxed">
                     Leads who consume the "How to Build an OS" VSL and state their problem as "Scaling bottleneck" close at 85% — 3x the average win rate.
                   </p>
                 </div>
                 
                 <div>
                   <span className="text-[12px] font-bold text-slate-900 block mb-1">Irrelevant Problem Capture</span>
                   <p className="text-[11px] text-slate-600 leading-relaxed">
                     We are disqualifying 40% of inbound leads because they want "Done-For-You lead gen". The landing page copy may be misaligned with Foundation constraints.
                   </p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
