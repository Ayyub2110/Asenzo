"use client";

import React from "react";
import { useDeliveryOS } from "@/contexts/DeliveryOSContext";

export default function ReportingPage() {
  const { clients, metrics } = useDeliveryOS();

  return (
    <div className="pt-8 space-y-6 animate-in fade-in duration-300 px-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight flex items-center gap-2">
            EXECUTIVE REPORTING
          </h1>
          <p className="text-[14px] text-slate-500 font-medium max-w-2xl mt-1">
            Aggregate high-level metrics across all client delivery pipelines.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
           <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Onboarding In-Progress</p>
           <p className="text-[32px] font-black tracking-tight leading-none text-slate-900">{metrics.onboardingInProgress}</p>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
           <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Active Engagements</p>
           <p className="text-[32px] font-black tracking-tight leading-none text-slate-900">{metrics.activeEngagements}</p>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
           <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">At-Risk Clients</p>
           <p className={`text-[32px] font-black tracking-tight leading-none ${metrics.atRiskClients > 0 ? 'text-red-500' : 'text-emerald-500'}`}>{metrics.atRiskClients}</p>
        </div>
        <div className="bg-slate-900 text-white border border-slate-800 p-6 rounded-2xl shadow-sm">
           <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Completed Rate</p>
           <p className="text-[32px] font-black tracking-tight leading-none">{Math.round(metrics.milestoneCompletionRate)}%</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm min-h-[400px] flex items-center justify-center relative overflow-hidden">
         <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '16px 16px'}}></div>
         <div className="z-10 text-center">
            <span className="material-symbols-outlined text-[48px] text-slate-300 mb-4 block">insert_chart</span>
            <h3 className="text-[18px] font-black text-slate-900 mb-2">Detailed Reports Generator</h3>
            <p className="text-[14px] text-slate-500 font-medium max-w-sm mx-auto mb-6">Connect to Snowflake or custom analytics engines to auto-generate deeply filtered executive reports.</p>
            <button className="px-6 py-2.5 bg-slate-900 text-white rounded-lg text-[13px] font-bold shadow-sm transition-colors hover:bg-slate-800">
               Configure Data Sync
            </button>
         </div>
      </div>
    </div>
  );
}
