"use client";

import React from "react";
import { useRevenueOS } from "@/contexts/RevenueOSContext";
import Link from "next/link";

export default function RevenueIntelligencePage() {
  const { customers, transactions } = useRevenueOS();

  // Aggregate Intelligence Logic
  const revBySource: Record<string, number> = {};
  const revByOffer: Record<string, number> = {};
  
  customers.forEach(c => {
     revBySource[c.source] = (revBySource[c.source] || 0) + c.totalRevenue;
     revByOffer[c.offerPurchased] = (revByOffer[c.offerPurchased] || 0) + c.totalRevenue;
  });

  const sortedSources = Object.entries(revBySource).sort((a,b) => b[1] - a[1]);
  const sortedOffers = Object.entries(revByOffer).sort((a,b) => b[1] - a[1]);

  return (
    <div className="pt-8 space-y-6 animate-in fade-in duration-300 px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-black text-slate-900 tracking-tight">Revenue Intelligence</h1>
          <p className="text-[14px] text-slate-500 font-medium mt-1">Closing the GTM loop by feeding realized revenue attribution back to Acquisition.</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
         {/* AI Insights & Observations */}
         <div className="col-span-8 space-y-6">
            <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-6 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <span className="material-symbols-outlined text-[80px]">auto_awesome</span>
               </div>
               <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-4 pb-3 border-b border-slate-800">
                  <span className="material-symbols-outlined text-[14px]">psychology</span>
                  Agent Observations: Acquisition Feedback Loop
               </h3>
               
               <div className="space-y-4">
                  <div>
                    <span className="text-[14px] font-bold text-white block mb-1">LinkedIn significantly outperforms Instagram for LTV.</span>
                    <p className="text-[12px] text-slate-300 leading-relaxed max-w-2xl">
                      While Instagram generates 2x the lead volume, customers acquired through LinkedIn ("Founder Drag Post") have a 100% retention rate and produce 2.4x higher average lifetime revenue. 
                    </p>
                    <Link href="/acquisition/strategy" className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-white text-slate-900 text-[11px] font-bold rounded-lg hover:bg-slate-100 transition-colors">
                      Push Insight to Content Strategy <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </Link>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-800">
                    <span className="text-[14px] font-bold text-white block mb-1">"Foundation OS" buyers are highly likely to Expansion-Churn.</span>
                    <p className="text-[12px] text-slate-300 leading-relaxed max-w-2xl">
                      Customers buying the Foundation one-time offer rarely convert to Retainers currently. Discovered reason: "Lack of bandwidth to execute". The offer must be repositioned to include DFY implementation to increase post-sale NRR.
                    </p>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-4">Total Revenue by Acquisition Source</h3>
                  <div className="space-y-4">
                     {sortedSources.length > 0 ? sortedSources.map(([source, rev], i) => (
                       <div key={i}>
                         <div className="flex justify-between items-center mb-1">
                            <span className="text-[13px] font-bold text-slate-900">{source}</span>
                            <span className="text-[12px] font-bold text-emerald-600">${rev.toLocaleString()}</span>
                         </div>
                         <div className="h-1.5 w-full bg-slate-100 rounded overflow-hidden">
                            <div className="h-full bg-blue-500 rounded" style={{ width: `${(rev / (sortedSources[0]?.[1] || 1)) * 100}%` }}></div>
                         </div>
                       </div>
                     )) : (
                       <div className="text-[12px] font-bold text-slate-400">No revenue data available to analyze sources.</div>
                     )}
                  </div>
               </div>

               <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-4">Total Revenue by Offer</h3>
                  <div className="space-y-4">
                     {sortedOffers.length > 0 ? sortedOffers.map(([offer, rev], i) => (
                       <div key={i}>
                         <div className="flex justify-between items-center mb-1">
                            <span className="text-[13px] font-bold text-slate-900 truncate max-w-[200px]">{offer}</span>
                            <span className="text-[12px] font-bold text-emerald-600">${rev.toLocaleString()}</span>
                         </div>
                         <div className="h-1.5 w-full bg-slate-100 rounded overflow-hidden">
                            <div className="h-full bg-purple-500 rounded" style={{ width: `${(rev / (sortedOffers[0]?.[1] || 1)) * 100}%` }}></div>
                         </div>
                       </div>
                     )) : (
                        <div className="text-[12px] font-bold text-slate-400">No revenue data available to analyze offers.</div>
                     )}
                  </div>
               </div>
            </div>
         </div>

         {/* Sidebar Stats */}
         <div className="col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-4">Churn Reasons (Post-Sale)</span>
                <div className="space-y-3">
                   <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                      <span className="text-[13px] font-bold text-slate-900">Capacity & Bandwidth</span>
                      <p className="text-[11px] text-slate-600 mt-1">100% of churned MRR cited internal execution constraints.</p>
                   </div>
                </div>
            </div>
            
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-4">Expansion Patterns</span>
                <div className="space-y-3">
                   <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                      <span className="text-[13px] font-bold text-slate-900">Ads Management Needs</span>
                      <p className="text-[11px] text-slate-600 mt-1">Organic growth customers hitting scale actively seek capacity for paid distribution.</p>
                   </div>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}
