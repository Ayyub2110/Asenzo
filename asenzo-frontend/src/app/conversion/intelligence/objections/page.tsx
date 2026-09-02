"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Opportunity } from "@/lib/types/conversion";

export default function ObjectionsIntelligence() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/conversion/opportunities")
      .then(r => r.json())
      .then(data => {
        setOpportunities(data || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  // Compute aggregate objections
  const objectionMap: Record<string, { count: number; lost: number }> = {};
  opportunities.forEach(opp => {
     (opp.objections || []).forEach(obj => {
        const key = obj.toUpperCase();
        if (!objectionMap[key]) objectionMap[key] = { count: 0, lost: 0 };
        objectionMap[key].count++;
        if (opp.pipelineStage === "LOST") objectionMap[key].lost++;
     });
  });

  const objections = Object.entries(objectionMap).sort((a,b) => b[1].count - a[1].count);

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/conversion/intelligence/insights" className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 material-symbols-outlined text-[16px] text-slate-500">arrow_back</Link>
        <div>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Objections Intelligence</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Aggregated friction points extracted automatically from your active conversion data.</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
         <div className="col-span-8 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-[400px]">
           {isLoading ? (
              <div className="p-12 text-center text-[12px] text-slate-500">Aggregating Objections...</div>
           ) : objections.length === 0 ? (
              <div className="p-16 text-center">
                 <span className="material-symbols-outlined text-[48px] text-slate-200 mb-2">shield</span>
                 <h3 className="text-[14px] font-bold text-slate-700">No objection patterns have been detected yet.</h3>
                 <p className="text-[12px] text-slate-500 mt-1">Patterns will appear as conversations and deals accumulate.</p>
              </div>
           ) : (
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                       <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Objection Theme</th>
                       <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Frequency</th>
                       <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Loss Rate</th>
                       <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">AI Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {objections.map(([obj, data]) => (
                       <tr key={obj} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px] text-slate-400">warning</span>
                                <span className="text-[13px] font-bold text-slate-900">{obj}</span>
                             </div>
                          </td>
                          <td className="px-6 py-4 text-[13px] font-semibold text-slate-700">{data.count} Opportunities</td>
                          <td className="px-6 py-4">
                             <span className="text-[12px] text-red-600 font-bold">{Math.round((data.lost / data.count) * 100)}%</span>
                          </td>
                          <td className="px-6 py-4">
                             <span className="px-2 py-0.5 border border-emerald-200 bg-emerald-50 text-emerald-700 font-bold text-[9px] rounded uppercase tracking-wider">MAPPED</span>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           )}
         </div>

         <div className="col-span-4 space-y-4">
            <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <span className="material-symbols-outlined text-[96px]">auto_awesome</span>
               </div>
               <h3 className="text-[12px] font-bold text-slate-300 uppercase tracking-widest mb-4">AI Diagnostics</h3>
               {objections.length > 0 ? (
                 <div className="space-y-4 relative z-10">
                    <div>
                       <span className="text-[12px] text-red-300 font-bold uppercase tracking-wider block mb-1">Most Dangerous</span>
                       <p className="text-[16px] font-bold text-white uppercase">{objections.sort((a,b) => (b[1].lost/b[1].count) - (a[1].lost/a[1].count))[0]?.[0]}</p>
                    </div>
                    <div>
                       <span className="text-[12px] text-amber-300 font-bold uppercase tracking-wider block mb-1">Impact Radius</span>
                       <p className="text-[13px] font-medium text-slate-300">
                          Accounts for {Math.round((objections[0][1].lost / Math.max(opportunities.filter(o => o.pipelineStage === "LOST").length, 1)) * 100)}% of lost opportunities. Requires explicit front-loading during Foundation positioning.
                       </p>
                    </div>
                 </div>
               ) : (
                 <p className="text-[12px] text-slate-400 relative z-10">Waiting for objection volume threshold to run diagnostics.</p>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
