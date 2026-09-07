"use client";

import React from "react";
import { useDeliveryOS } from "@/contexts/DeliveryOSContext";

export default function ReportingPage() {
  const { clients, metrics } = useDeliveryOS();

  return (
    <div className="pt-8 space-y-6 px-8 max-w-[1400px] mx-auto pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight flex items-center gap-2">
            KPI & Outcomes Repo
          </h1>
          <p className="text-[12px] text-slate-500 mt-0.5">
            Aggregate high-level metrics and hard delivery outcomes across all clients.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Onboarding In-Progress</p>
           <p className="text-[24px] font-bold text-slate-900">{metrics.onboardingInProgress}</p>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Engagements</p>
           <p className="text-[24px] font-bold text-slate-900">{metrics.activeEngagements}</p>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">At-Risk Clients</p>
           <p className={`text-[24px] font-bold ${metrics.atRiskClients > 0 ? 'text-red-500' : 'text-emerald-500'}`}>{metrics.atRiskClients}</p>
        </div>
        <div className="bg-slate-900 text-white border border-slate-800 p-4 rounded-xl shadow-sm">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Completed Rate</p>
           <p className="text-[24px] font-bold">{Math.round(metrics.milestoneCompletionRate)}%</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mt-6">
         <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h3 className="text-[12px] font-bold text-slate-800 uppercase tracking-widest">Global KPI Tracking</h3>
            <button className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Sync with Data Warehouse</button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-white border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                     <th className="px-5 py-3">Client Target Outcome</th>
                     <th className="px-5 py-3">Baseline</th>
                     <th className="px-5 py-3">Current</th>
                     <th className="px-5 py-3">Goal</th>
                     <th className="px-5 py-3">Progress</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 text-[12px]">
                  {[
                     { client: "Elevate Media", outcome: "Reduce Churn", baseline: "14%", current: "8%", goal: "< 5%", progress: 66, trend: "up" },
                     { client: "Stark Ind.", outcome: "Increase Lead Vol", baseline: "20/mo", current: "44/mo", goal: "50/mo", progress: 80, trend: "up" },
                     { client: "Quantum Tech", outcome: "CPA Reduction", baseline: "$450", current: "$390", goal: "$300", progress: 40, trend: "flat" }
                  ].map((row, idx) => (
                     <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-4">
                           <div className="font-bold text-slate-900">{row.outcome}</div>
                           <div className="text-[11px] text-slate-500">{row.client}</div>
                        </td>
                        <td className="px-5 py-4 font-medium text-slate-600">{row.baseline}</td>
                        <td className="px-5 py-4 font-bold text-slate-900">{row.current}</td>
                        <td className="px-5 py-4 font-bold text-emerald-600">{row.goal}</td>
                        <td className="px-5 py-4">
                           <div className="flex items-center gap-3">
                              <div className="h-1.5 w-full max-w-[100px] bg-slate-100 rounded-full overflow-hidden">
                                 <div className={`h-full rounded-full ${row.progress > 70 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{width: `${row.progress}%`}}></div>
                              </div>
                              <span className="text-[11px] font-bold text-slate-500">{row.progress}%</span>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
