"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Opportunity } from "@/lib/types/conversion";

export default function LostOpportunitiesWorkspace() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/conversion/opportunities")
      .then(r => r.json())
      .then(data => {
        setOpportunities(data.filter((o: Opportunity) => o.pipelineStage === "LOST") || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/conversion/nurture" className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 material-symbols-outlined text-[16px] text-slate-500">arrow_back</Link>
        <div>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Lost Opportunities</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Deals intentionally marked closed-lost. Not deleted, safely archived for future analysis or reactivation.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
         {isLoading ? (
            <div className="p-12 text-center text-slate-400 text-[12px]">Loading archived records...</div>
         ) : opportunities.length === 0 ? (
            <div className="p-16 text-center">
               <span className="material-symbols-outlined text-[48px] text-slate-200 mb-2">archive</span>
               <h3 className="text-[14px] font-bold text-slate-700">No Lost Deals Recorded.</h3>
               <p className="text-[12px] text-slate-500 mt-1">When an opportunity is lost, it will be retained here to power conversion intelligence.</p>
            </div>
         ) : (
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                     <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Lead</th>
                     <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Lost Value</th>
                     <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Reason</th>
                     <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date Lost</th>
                     <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {opportunities.map(opp => (
                     <tr key={opp.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-[13px] font-bold text-slate-900">{opp.leadId}</td>
                        <td className="px-6 py-4 text-[12px] font-medium text-slate-600">£{(opp.estimatedValue || 0).toLocaleString()}</td>
                        <td className="px-6 py-4">
                           <span className="px-2 py-0.5 bg-red-50 text-red-600 font-bold text-[10px] rounded uppercase">
                              {opp.objections?.[0] || "PRICE"}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-[12px] text-slate-500">{new Date(opp.updatedAt || Date.now()).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                           <div className="flex gap-2 border-l border-slate-200 pl-4 items-center">
                              <button className="text-[11px] font-bold text-blue-600 hover:text-blue-800">View Deal</button>
                              <span className="text-slate-300">•</span>
                              <button className="text-[11px] font-bold text-slate-600 hover:text-slate-800">Add Note</button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         )}
      </div>
    </div>
  );
}
