"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Opportunity } from "@/lib/types/conversion";

export default function BuyingTriggersIntelligence() {
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

  // Compute aggregate triggers
  const triggerMap: Record<string, { count: number; won: number; value: number }> = {};
  opportunities.forEach(opp => {
     if (opp.buyingTrigger) {
        const key = opp.buyingTrigger.toUpperCase();
        if (!triggerMap[key]) triggerMap[key] = { count: 0, won: 0, value: 0 };
        triggerMap[key].count++;
        triggerMap[key].value += (opp.estimatedValue || 0);
        if (opp.pipelineStage === "WON") triggerMap[key].won++;
     }
  });

  const triggers = Object.entries(triggerMap).sort((a,b) => b[1].count - a[1].count);

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/conversion/intelligence/insights" className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 material-symbols-outlined text-[16px] text-slate-500">arrow_back</Link>
        <div>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Buying Triggers</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Identify exact situational events that precede paying behavior.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-[400px]">
        {isLoading ? (
            <div className="p-12 text-center text-[12px] text-slate-500">Analyzing Event Patterns...</div>
        ) : triggers.length === 0 ? (
            <div className="p-16 text-center">
                <span className="material-symbols-outlined text-[48px] text-slate-200 mb-2">radar</span>
                <h3 className="text-[14px] font-bold text-slate-700">Not enough conversion data to identify buying triggers yet.</h3>
                <p className="text-[12px] text-slate-500 mt-1 max-w-[450px] mx-auto">Triggers are extracted from won deals. As your pipeline moves, the AI will build a proprietary database of exact events that cause your ICP to buy.</p>
            </div>
        ) : (
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Trigger Pattern</th>
                        <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Frequency</th>
                        <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Associated Pipeline</th>
                        <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Signal Source</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {triggers.map(([tg, data]) => (
                        <tr key={tg} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px] text-emerald-500">crisis_alert</span>
                                <span className="text-[13px] font-bold text-slate-900">{tg}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-[13px] font-semibold text-slate-700">{data.count} Occurrences</td>
                            <td className="px-6 py-4">
                                <span className="text-[12px] text-slate-600 font-bold">£{(data.value / 1000).toFixed(1)}k</span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-0.5 border border-slate-200 bg-slate-50 text-slate-500 font-bold text-[9px] rounded uppercase tracking-wider">AI EXTRACTED</span>
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
