"use client";

import React from "react";
import Link from "next/link";
import { Opportunity } from "@/lib/types/conversion";
import { useConversionOS } from "@/contexts/ConversionOSContext";

export default function LostReasonsIntelligence() {
  const { opportunities: allOpps } = useConversionOS();
  const opportunities = allOpps.filter((o: Opportunity) => o.pipelineStage === "LOST");

  const reasonMap: Record<string, { count: number; value: number }> = {};
  opportunities.forEach(opp => {
      // For simplicity in MVP, we track the primary objection as the "Loss Reason" 
      // when a deal is in the LOST stage.
      const reason = opp.objections?.[0]?.toUpperCase() || "UNKNOWN / NO DECISION";
      if (!reasonMap[reason]) reasonMap[reason] = { count: 0, value: 0 };
      reasonMap[reason].count++;
      reasonMap[reason].value += (opp.estimatedValue || 0);
  });

  const reasons = Object.entries(reasonMap).sort((a,b) => b[1].count - a[1].count);

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/conversion/intelligence/insights" className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 material-symbols-outlined text-[16px] text-slate-500">arrow_back</Link>
        <div>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Lost Reasons</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Categorized breakdown of why revenue leaves the pipeline.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-[400px]">
        {reasons.length === 0 ? (
            <div className="p-16 text-center">
                <span className="material-symbols-outlined text-[48px] text-slate-200 mb-2">trending_down</span>
                <h3 className="text-[14px] font-bold text-slate-700">No lost opportunities yet.</h3>
                <p className="text-[12px] text-slate-500 mt-1 max-w-[450px] mx-auto">This dashboard will automatically map and rank the categories responsible for lost revenue once deals are marked dead.</p>
            </div>
        ) : (
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Reason Category</th>
                        <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Lost Opportunity Count</th>
                        <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Lost Revenue Value</th>
                        <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Impact %</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {reasons.map(([reason, data]) => {
                        const totalLostValue = reasons.reduce((sum, r) => sum + r[1].value, 0);
                        const percentage = totalLostValue === 0 ? 0 : Math.round((data.value / totalLostValue) * 100);

                        return (
                          <tr key={reason} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                  <span className="material-symbols-outlined text-[16px] text-red-500">cancel</span>
                                  <span className="text-[13px] font-bold text-slate-900">{reason}</span>
                                  </div>
                              </td>
                              <td className="px-6 py-4 text-[13px] font-semibold text-slate-700">{data.count}</td>
                              <td className="px-6 py-4">
                                  <span className="text-[12px] text-slate-600 font-bold">£{(data.value / 1000).toFixed(1)}k</span>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-2">
                                    <span className="text-[12px] font-bold text-slate-700 w-8">{percentage}%</span>
                                    <div className="h-1.5 w-24 bg-slate-100 rounded overflow-hidden">
                                       <div className="h-full bg-red-500" style={{ width: `${percentage}%` }}></div>
                                    </div>
                                 </div>
                              </td>
                          </tr>
                        );
                    })}
                </tbody>
            </table>
        )}
      </div>
    </div>
  );
}
