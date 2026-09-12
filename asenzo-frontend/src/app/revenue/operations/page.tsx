"use client";

import React, { useState } from "react";
import { useRevenueOS } from "@/contexts/RevenueOSContext";
import ForecastModal from "../_components/ForecastModal";

export default function RevenueOperations() {
  const { metrics, forecasts } = useRevenueOS();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingForecast, setEditingForecast] = useState<any>(undefined);

  return (
    <div className="pt-8 space-y-6 animate-in fade-in duration-300 px-8">
      {modalOpen && <ForecastModal isOpen={modalOpen} onClose={() => {setModalOpen(false); setEditingForecast(undefined);}} initialData={editingForecast} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-black text-slate-900 tracking-tight">Revenue Operations & Forecasting</h1>
          <p className="text-[14px] text-slate-500 font-medium mt-1 pr-6 max-w-3xl">Target tracking, pipeline weighted forecasts, and gap-to-target analysis.</p>
        </div>
        <div>
           <button onClick={() => setModalOpen(true)} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-[12px] font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined text-[16px]">add_chart</span> Set Target & Forecast
           </button>
        </div>
      </div>

      {/* Target Progress */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
         <div className="flex items-center justify-between mb-2">
            <div>
               <h3 className="text-[14px] font-bold text-slate-900">Current Month Target Tracking</h3>
               <p className="text-[12px] text-slate-500">Realized revenue vs predefined target.</p>
            </div>
            <div className="text-right">
               <div className="text-[24px] font-black text-slate-900">${metrics.revenueThisMonth.toLocaleString()} <span className="text-[14px] text-slate-400 font-bold">/ ${metrics.revenueTarget.toLocaleString()}</span></div>
            </div>
         </div>
         <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden mt-4">
            <div className={`h-full ${metrics.revenueThisMonth >= metrics.revenueTarget ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${Math.min((metrics.revenueThisMonth / metrics.revenueTarget)*100, 100)}%`}}></div>
         </div>
      </div>

      {/* Forecast */}
      <h3 className="text-[16px] font-bold text-slate-900 mt-8 mb-4">Quarterly Forecast</h3>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Month</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest text-right">Target</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest text-right">Committed Revenue</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest text-right">Weighted Pipeline (Conversion OS)</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest text-right">Best Case</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest text-right">Gap to Target</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {forecasts.length > 0 ? forecasts.map((f, i) => {
                  const projectedTotal = f.committedRevenue + f.weightedPipeline;
                  const gap = f.target - projectedTotal;
                  return (
                     <tr key={f.id || i} onClick={() => {setEditingForecast(f); setModalOpen(true);}} className="hover:bg-slate-50 transition-colors cursor-pointer">
                        <td className="px-6 py-4 text-[13px] font-bold text-slate-900">{f.month}</td>
                        <td className="px-6 py-4 text-[13px] font-bold text-slate-500 text-right">${f.target.toLocaleString()}</td>
                        <td className="px-6 py-4 text-[13px] font-bold text-slate-900 text-right">${f.committedRevenue.toLocaleString()}</td>
                        <td className="px-6 py-4 text-[13px] font-bold text-slate-500 text-right">${f.weightedPipeline.toLocaleString()}</td>
                        <td className="px-6 py-4 text-[13px] font-bold text-emerald-600 text-right">${f.bestCase.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right">
                           {gap > 0 ? (
                              <span className="text-[12px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded">-$${gap.toLocaleString()}</span>
                           ) : (
                              <span className="text-[12px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">On Track</span>
                           )}
                        </td>
                     </tr>
                  );
               }) : (
                  <tr>
                     <td colSpan={6} className="px-6 py-10 text-center">
                        <div className="text-[13px] font-bold text-slate-600">No forecasting data available.</div>
                        <p className="text-[11px] font-medium text-slate-400 mt-1 max-w-[300px] mx-auto">Set revenue targets to automatically project committed values.</p>
                     </td>
                  </tr>
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
}
