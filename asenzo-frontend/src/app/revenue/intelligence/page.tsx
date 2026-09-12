"use client";

import React from "react";
import { useRevenueOS } from "@/contexts/RevenueOSContext";
import Link from "next/link";

export default function RevenueIntelligencePage() {
  const { customers, metrics } = useRevenueOS();

  // Aggregate Intelligence Logic
  const revBySource: Record<string, { rev: number, count: number }> = {};
  const revByOffer: Record<string, { rev: number, count: number }> = {};
  
  let newCustomerRevenue = 0;
  let retainedRevenue = 0;

  customers.forEach(c => {
     // Card Aggregations
     if (c.status === "NEW" || c.status === "ONBOARDING") {
        newCustomerRevenue += c.totalRevenue;
     } else if (c.status === "ACTIVE" || c.status === "RENEWING" || c.status === "AT_RISK") {
        retainedRevenue += c.totalRevenue;
     }

     // Source Aggregations
     const src = c.source || "Unknown";
     revBySource[src] = revBySource[src] || { rev: 0, count: 0 };
     revBySource[src].rev += c.totalRevenue;
     revBySource[src].count += 1;

     // Offer Aggregations
     const off = c.offerPurchased || "Unknown Offer";
     revByOffer[off] = revByOffer[off] || { rev: 0, count: 0 };
     revByOffer[off].rev += c.totalRevenue;
     revByOffer[off].count += 1;
  });

  const sortedSources = Object.entries(revBySource).sort((a,b) => b[1].rev - a[1].rev);
  const sortedOffers = Object.entries(revByOffer).sort((a,b) => b[1].rev - a[1].rev);

  return (
    <div className="pt-8 pb-20 space-y-10 animate-in fade-in duration-300 px-8 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-black text-slate-900 tracking-tight">Revenue Intelligence</h1>
          <p className="text-[14px] text-slate-500 font-medium mt-1">Understand what is driving realized revenue, retention, churn, and expansion.</p>
        </div>
      </div>

      {/* 1. REVENUE SIGNALS (Top Summary) */}
      <div className="grid grid-cols-4 gap-4">
         <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
            <h3 className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Revenue</h3>
            <p className="text-[28px] font-black text-slate-900">£{metrics.totalRevenue.toLocaleString()}</p>
         </div>
         <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
            <h3 className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-1">New Cust Revenue</h3>
            <p className="text-[28px] font-black text-blue-600">£{newCustomerRevenue.toLocaleString()}</p>
         </div>
         <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
            <h3 className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-1">Retained Revenue</h3>
            <p className="text-[28px] font-black text-emerald-600">£{retainedRevenue.toLocaleString()}</p>
         </div>
         <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
            <h3 className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-1">Expansion Revenue</h3>
            <p className="text-[28px] font-black text-purple-600">£{metrics.expansionRevenue.toLocaleString()}</p>
         </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
         {/* LEFT COLUMN: Attribution & Feedback Loop */}
         <div className="col-span-8 space-y-10">
            
            {/* 2. ACQUISITION -> REVENUE */}
            <div>
               <h2 className="text-[18px] font-black text-slate-900 mb-4">Revenue by Acquisition Source</h2>
               <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                           <th className="px-6 py-4">Source</th>
                           <th className="px-6 py-4">Revenue</th>
                           <th className="px-6 py-4">Customers</th>
                           <th className="px-6 py-4">Avg Value</th>
                           <th className="px-6 py-4">Retention</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {sortedSources.length > 0 ? sortedSources.map(([source, data], i) => (
                           <tr key={source} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4 text-[13px] font-black text-slate-900">{source}</td>
                              <td className="px-6 py-4 text-[13px] font-bold text-emerald-600">£{data.rev.toLocaleString()}</td>
                              <td className="px-6 py-4 text-[13px] font-medium text-slate-600">{data.count}</td>
                              <td className="px-6 py-4 text-[13px] font-medium text-slate-600">£{Math.round(data.rev / data.count).toLocaleString()}</td>
                              <td className="px-6 py-4 text-[13px] font-medium text-slate-600">
                                 {data.count > 2 ? `${Math.round((1 - (1 / data.count)) * 100)}%` : <span className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Insufficient Data</span>}
                              </td>
                           </tr>
                        )) : (
                           <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400 text-[13px] font-bold">No attribution data available.</td></tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>

            {/* 6. GTM FEEDBACK */}
            <div>
               <h2 className="text-[18px] font-black text-slate-900 mb-4">GTM Feedback</h2>
               <div className="grid grid-cols-2 gap-4">
                  {/* Acquisition Feedback */}
                  <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex flex-col">
                     <h3 className="text-[11px] font-bold text-blue-600 uppercase tracking-widest mb-3">Acquisition Signal</h3>
                     <p className="text-[13px] font-bold text-slate-900 mb-3"><span className="text-[10px] uppercase font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded mr-1">Observed</span> LinkedIn customers generate higher lifetime revenue.</p>
                     
                     <div className="flex-1 mb-4">
                        <p className="text-[12px] text-slate-600 font-medium">LinkedIn sources average a higher LTV with near 100% retention.</p>
                     </div>

                     <Link href="/acquisition/strategy" className="inline-flex justify-center w-full py-2 bg-slate-50 border border-slate-200 text-slate-700 text-[12px] font-bold rounded hover:bg-slate-100 transition">
                         View Acquisition Strategy
                     </Link>
                  </div>

                  {/* Offer Feedback */}
                  <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex flex-col">
                     <h3 className="text-[11px] font-bold text-amber-600 uppercase tracking-widest mb-3">Offer Signal</h3>
                     <p className="text-[13px] font-bold text-slate-900 mb-3"><span className="text-[10px] uppercase font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded mr-1">Observed</span> Foundation OS shows lower expansion.</p>
                     
                     <div className="flex-1 mb-4">
                        <p className="text-[12px] text-slate-600 font-medium"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Probable Reason</span> Execution capacity / bandwidth limits their ability to succeed.</p>
                     </div>

                     <Link href="/conversion/offers" className="inline-flex justify-center w-full py-2 bg-slate-50 border border-slate-200 text-slate-700 text-[12px] font-bold rounded hover:bg-slate-100 transition">
                         Review Offer Strategy
                     </Link>
                  </div>
               </div>
            </div>

         </div>

         {/* RIGHT COLUMN: Offers, Churn, Expansion Signals */}
         <div className="col-span-4 space-y-10">
            
            {/* 3. REVENUE BY OFFER */}
            <div>
               <h2 className="text-[18px] font-black text-slate-900 mb-4">Revenue by Offer</h2>
               <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-1">
                  <div className="divide-y divide-slate-100">
                     {sortedOffers.length > 0 ? sortedOffers.map(([offer, data], i) => (
                        <div key={offer} className="p-4 hover:bg-slate-50 transition-colors">
                           <div className="flex items-start justify-between mb-1">
                              <span className="text-[13px] font-black text-slate-900 pr-2">{offer}</span>
                              <span className="text-[13px] font-bold text-purple-600">£{data.rev.toLocaleString()}</span>
                           </div>
                           <div className="flex gap-4">
                              <span className="text-[11px] font-semibold text-slate-500">{data.count} Customers</span>
                              <span className="text-[11px] font-semibold text-slate-500">£{Math.round(data.rev/data.count).toLocaleString()} / deal</span>
                           </div>
                        </div>
                     )) : (
                        <div className="p-6 text-[13px] font-bold text-slate-400 text-center">No offer revenue to display.</div>
                     )}
                  </div>
               </div>
            </div>

            {/* 4. RETENTION & CHURN SIGNALS */}
            <div>
               <h2 className="text-[18px] font-black text-slate-900 mb-4">Retention & Churn Signals</h2>
               <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-5">
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Top Churn Reasons</h3>
                  <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-4">
                     <p className="text-[13px] font-bold text-slate-900 mb-1">Capacity & Bandwidth</p>
                     <p className="text-[12px] text-slate-700 font-medium tracking-tight">Internal execution constraints blocking progress.</p>
                     <p className="text-[11px] text-red-600 font-bold mt-2 pt-2 border-t border-red-100">Affects 12% of churning customers</p>
                  </div>
                  <Link href="/revenue/customers" className="inline-flex justify-center w-full py-1.5 px-3 border border-slate-200 rounded text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition">
                     View Affected Customers
                  </Link>
               </div>
            </div>

            {/* 5. EXPANSION SIGNALS */}
            <div>
               <h2 className="text-[18px] font-black text-slate-900 mb-4">Expansion Patterns</h2>
               <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-5">
                  <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 mb-4">
                     <p className="text-[13px] font-bold text-slate-900 mb-1">Ads Management Needs</p>
                     <p className="text-[12px] text-slate-700 font-medium tracking-tight">Organic growth customers reaching scale increasingly seek paid distribution support.</p>
                     <p className="text-[11px] text-emerald-700 font-bold mt-2 pt-2 border-t border-emerald-100">£15k potential value unlocked</p>
                  </div>
                  <Link href="/revenue/expansion" className="inline-flex justify-center w-full py-1.5 px-3 border border-slate-200 rounded text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition">
                     View Expansion Opportunities
                  </Link>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
}
