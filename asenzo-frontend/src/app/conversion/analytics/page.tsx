"use client";

import React, { useEffect, useState } from "react";
import { Lead, Opportunity } from "@/lib/types/conversion";

export default function AnalyticsWorkspace() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/conversion/leads").then(r => r.json()),
      fetch("/api/conversion/opportunities").then(r => r.json())
    ]).then(([lData, oData]) => {
      setLeads(lData || []);
      setOpportunities(oData || []);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  // Calculate Funnel Metrics
  const metricLeads = leads.length;
  const metricQualified = leads.filter(l => l.qualificationStatus === "QUALIFIED").length;
  const metricOpps = opportunities.length;
  const metricWon = opportunities.filter(o => o.pipelineStage === "WON").length;
  
  const funnel = [
    { label: "1. Leads Created", value: metricLeads, conversionRate: null },
    { label: "2. Qualified", value: metricQualified, conversionRate: metricLeads > 0 ? (metricQualified / metricLeads) : 0 },
    { label: "3. Sales Conversations", value: metricOpps, conversionRate: metricQualified > 0 ? (metricOpps / metricQualified) : 0 },
    { label: "4. Deals Won", value: metricWon, conversionRate: metricOpps > 0 ? (metricWon / metricOpps) : 0 },
  ];

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto space-y-8">
      <div>
         <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">query_stats</span>
            Conversion OS Layer
         </p>
         <h1 className="text-[24px] font-bold text-slate-900 tracking-tight mt-1">Analytics Sandbox</h1>
         <p className="text-[12px] text-slate-500 mt-1">The measurement and telemetry layer for the entire conversion funnel.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 min-h-[400px]">
        <h2 className="text-[14px] font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">filter_alt_off</span>
            End-To-End Funnel Conversion
        </h2>
        {isLoading ? (
            <div className="py-12 text-center text-[12px] text-slate-500">Compiling funnel data...</div>
        ) : metricLeads === 0 ? (
            <div className="py-24 flex flex-col justify-center items-center">
                <span className="material-symbols-outlined text-[48px] text-slate-200 mb-2">trending_flat</span>
                <h3 className="text-[14px] font-bold text-slate-700">No conversion data yet.</h3>
                <p className="text-[12px] text-slate-500 mt-1">Start pulling acquisition intent into the Lead Queue to visualize the funnel.</p>
            </div>
        ) : (
            <div className="flex justify-between items-end h-[300px] gap-2 pb-6">
                {funnel.map((stage, idx) => {
                    // Visual calculation of bar height relative to original lead volume so it looks like a funnel
                    const heightPercent = metricLeads > 0 ? Math.max((stage.value / metricLeads) * 100, 5) : 0;
                    return (
                        <div key={idx} className="flex-1 flex flex-col items-center justify-end relative h-full group">
                            <div className="w-full max-w-[120px] bg-slate-900 rounded-t border-b-4 border-slate-800 transition-all" style={{ height: `${heightPercent}%` }}></div>
                            
                            {/* Stats */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 px-3 py-2 rounded-lg border border-slate-200 shadow-xl whitespace-nowrap">
                                <span className="text-[16px] font-black text-slate-900">{stage.value}</span>
                                {stage.conversionRate !== null && (
                                   <span className="text-[10px] font-bold text-emerald-600">
                                      {Math.round(stage.conversionRate * 100)}% Pass-through
                                   </span>
                                )}
                            </div>

                            <div className="mt-4 text-center">
                                <p className="text-[11px] font-bold text-slate-700">{stage.label}</p>
                                <p className="text-[13px] font-black text-slate-900 mt-1">{stage.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
      </div>

       <div className="grid grid-cols-3 gap-4">
           {/* Summary Cards */}
           <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Total Pipeline Value</h3>
              <div className="text-[28px] font-bold text-slate-900 leading-none">
                 £{(opportunities.reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0) / 1000).toFixed(1)}k
              </div>
           </div>
           <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Win Rate</h3>
              <div className="text-[28px] font-bold text-slate-900 leading-none">
                 {metricOpps > 0 ? Math.round((metricWon / metricOpps) * 100) : 0}%
              </div>
           </div>
           <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Qualified Ratio</h3>
              <div className="text-[28px] font-bold text-slate-900 leading-none">
                 {metricLeads > 0 ? Math.round((metricQualified / metricLeads) * 100) : 0}%
              </div>
           </div>
       </div>
    </div>
  );
}
