"use client";

import React from "react";
import { useRevenueOS } from "@/contexts/RevenueOSContext";

export default function AnalyticsPage() {
  const { metrics, customers } = useRevenueOS();

  return (
    <div className="pt-8 space-y-6 animate-in fade-in duration-300 px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-black text-slate-900 tracking-tight">Unified Revenue Analytics</h1>
          <p className="text-[14px] text-slate-500 font-medium mt-1">Comprehensive dashboard for revenue, retention, and customer economics.</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-3 py-1.5 text-[12px] font-bold bg-white border border-slate-200 rounded-lg shadow-sm">
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>Year to Date</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
         {/* Realized Revenue */}
         <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm col-span-3 lg:col-span-1">
            <h3 className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-4">Revenue Execution</h3>
            <div className="space-y-4">
               <div>
                  <span className="text-[11px] font-bold text-slate-400 block">Total Lifetime Revenue</span>
                  <span className="text-[24px] font-black text-slate-900">${metrics.totalRevenue.toLocaleString()}</span>
               </div>
               <div className="pt-3 border-t border-slate-100 flex justify-between">
                  <div>
                     <span className="text-[11px] font-bold text-slate-400 block">Target Attainment</span>
                     <span className="text-[14px] font-bold text-emerald-600">{Math.round((metrics.revenueThisMonth/metrics.revenueTarget)*100)}%</span>
                  </div>
                  <div className="text-right">
                     <span className="text-[11px] font-bold text-slate-400 block">Growth</span>
                     <span className="text-[14px] font-bold text-emerald-600">+12%</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Recurring Revenue */}
         <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm col-span-3 lg:col-span-1">
            <h3 className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-4">Recurring Economics (MRR/ARR)</h3>
            <div className="space-y-4">
               <div>
                  <span className="text-[11px] font-bold text-slate-400 block">Current MRR</span>
                  <span className="text-[24px] font-black text-slate-900">${metrics.mrr.toLocaleString()}</span>
               </div>
               <div className="pt-3 border-t border-slate-100 flex justify-between">
                  <div>
                     <span className="text-[11px] font-bold text-slate-400 block">ARR Run Rate</span>
                     <span className="text-[14px] font-bold text-blue-600">${metrics.arr.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                     <span className="text-[11px] font-bold text-slate-400 block">Expansion MRR</span>
                     <span className="text-[14px] font-bold text-emerald-600">${metrics.expansionRevenue.toLocaleString()}</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Customer Economics */}
         <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm col-span-3 lg:col-span-1">
            <h3 className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-4">Customer Economics</h3>
            <div className="space-y-4">
               <div>
                  <span className="text-[11px] font-bold text-slate-400 block">Active Customers</span>
                  <span className="text-[24px] font-black text-slate-900">{metrics.activeCustomers}</span>
               </div>
               <div className="pt-3 border-t border-slate-100 flex justify-between">
                  <div>
                     <span className="text-[11px] font-bold text-slate-400 block">Avg Revenue per Customer</span>
                     <span className="text-[14px] font-bold text-slate-900">${customers.length > 0 ? Math.round(metrics.totalRevenue / customers.length).toLocaleString() : 0}</span>
                  </div>
                  <div className="text-right">
                     <span className="text-[11px] font-bold text-slate-400 block">NRR</span>
                     <span className="text-[14px] font-bold text-emerald-600">{metrics.netRevenueRetention}%</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
}
