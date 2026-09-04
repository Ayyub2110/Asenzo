"use client";

import React, { useState } from "react";
import { useRevenueOS } from "@/contexts/RevenueOSContext";
import { RevenueForecast } from "@/lib/types/revenue";

export default function ForecastModal({ isOpen, onClose, initialData }: { isOpen: boolean, onClose: () => void, initialData?: RevenueForecast & { id: string } }) {
  const { createForecast, updateForecast } = useRevenueOS();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<RevenueForecast>>(initialData || {
    month: new Date().toISOString().substring(0, 7), // YYYY-MM
    target: 0,
    committedRevenue: 0,
    weightedPipeline: 0,
    bestCase: 0
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initialData?.id) {
         if(updateForecast) await updateForecast(initialData.id, formData);
      } else {
         if(createForecast) await createForecast(formData as RevenueForecast);
      }
      onClose();
    } catch(err) {
      console.error(err);
      alert("Failed to save forecast");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
      <div className="w-[450px] bg-white h-full shadow-2xl animate-in slide-in-from-right flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
           <h2 className="text-[16px] font-bold text-slate-900">{initialData ? 'Update Forecast' : 'Set Month Forecast & Target'}</h2>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined text-[20px]">close</span></button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
           
           <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Month (YYYY-MM)</label>
              <input required type="text" value={formData.month} onChange={(e) => setFormData({...formData, month: e.target.value})} className="w-full text-[13px] font-medium border border-slate-200 rounded-lg px-3 py-2" placeholder="2026-09" />
           </div>

           <div className="pb-4 border-b border-slate-100">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Monthly Revenue Target ($)</label>
              <input required type="number" value={formData.target} onChange={(e) => setFormData({...formData, target: Number(e.target.value)})} className="w-full text-[18px] font-black tracking-tight text-blue-600 border border-slate-200 rounded-lg px-3 py-2 bg-blue-50/50" />
           </div>
           
           <div className="space-y-4">
               <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Committed Revenue ($)</label>
                  <p className="text-[10px] text-slate-400 mb-1">Already booked/realized MRR + scheduled payments.</p>
                  <input required type="number" value={formData.committedRevenue} onChange={(e) => setFormData({...formData, committedRevenue: Number(e.target.value)})} className="w-full text-[13px] font-medium border border-slate-200 rounded-lg px-3 py-2" />
               </div>
               
               <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Weighted Pipeline ($)</label>
                  <p className="text-[10px] text-slate-400 mb-1">Estimated revenue from Conversion OS pipeline x probability.</p>
                  <input required type="number" value={formData.weightedPipeline} onChange={(e) => setFormData({...formData, weightedPipeline: Number(e.target.value)})} className="w-full text-[13px] font-medium border border-slate-200 rounded-lg px-3 py-2" />
               </div>

               <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Best Case Scenario ($)</label>
                  <input required type="number" value={formData.bestCase} onChange={(e) => setFormData({...formData, bestCase: Number(e.target.value)})} className="w-full text-[13px] font-medium border border-emerald-200 bg-emerald-50 text-emerald-700 rounded-lg px-3 py-2" />
               </div>
           </div>

           <div className="pt-6 border-t border-slate-100 flex gap-2">
              <button type="submit" disabled={loading} className="flex-1 bg-slate-900 text-white font-bold text-[12px] py-2 rounded-lg hover:bg-slate-800 transition-colors">
                 {loading ? 'Saving...' : initialData ? 'Update Projection' : 'Set Targets & Forecast'}
              </button>
           </div>
        </form>
      </div>
    </div>
  );
}
