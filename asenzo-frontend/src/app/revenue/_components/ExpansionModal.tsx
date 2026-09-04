"use client";

import React, { useState } from "react";
import { useRevenueOS } from "@/contexts/RevenueOSContext";
import { ExpansionOpportunity } from "@/lib/types/revenue";

export default function ExpansionModal({ isOpen, onClose, initialData }: { isOpen: boolean, onClose: () => void, initialData?: ExpansionOpportunity }) {
  const { customers, createExpansion, updateExpansion } = useRevenueOS();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<ExpansionOpportunity>>(initialData || {
    customerId: customers[0]?.id || "",
    potentialRevenue: 0,
    type: "UPSELL",
    reason: "",
    status: "IDENTIFIED"
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initialData?.id) {
         if(updateExpansion) await updateExpansion(initialData.id, formData);
      } else {
         if(createExpansion) await createExpansion(formData as Omit<ExpansionOpportunity, 'id'>);
      }
      onClose();
    } catch(err) {
      console.error(err);
      alert("Failed to save expansion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
      <div className="w-[450px] bg-white h-full shadow-2xl animate-in slide-in-from-right flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
           <h2 className="text-[16px] font-bold text-slate-900">{initialData ? 'Update Expansion' : 'Log Expansion Opportunity'}</h2>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined text-[20px]">close</span></button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
           <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Customer</label>
              <select required value={formData.customerId} onChange={(e) => setFormData({...formData, customerId: e.target.value})} className="w-full text-[13px] font-medium border border-slate-200 rounded-lg px-3 py-2">
                 {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.company})</option>
                 ))}
                 {customers.length === 0 && <option value="">No Active Customers</option>}
              </select>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Potential Value ($)</label>
                 <input required type="number" value={formData.potentialRevenue} onChange={(e) => setFormData({...formData, potentialRevenue: Number(e.target.value)})} className="w-full text-[13px] font-medium border border-slate-200 rounded-lg px-3 py-2 bg-slate-50" />
              </div>
              <div>
                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Expansion Type</label>
                 <select required value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value as any})} className="w-full text-[13px] font-medium border border-slate-200 rounded-lg px-3 py-2">
                    <option value="UPSELL">Upsell / Retainer</option>
                    <option value="CROSS_SELL">Cross-Sell</option>
                    <option value="CAPACITY">Capacity Increase</option>
                 </select>
              </div>
           </div>

           <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Deal Stage</label>
              <select required value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as any})} className="w-full text-[13px] font-medium border border-slate-200 rounded-lg px-3 py-2">
                 <option value="IDENTIFIED">Identified</option>
                 <option value="PITCHED">Solution Pitched</option>
                 <option value="CLOSED_WON">Closed Won</option>
                 <option value="CLOSED_LOST">Closed Lost</option>
              </select>
           </div>

           <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Reason / Intent</label>
              <textarea required value={formData.reason || ''} onChange={(e) => setFormData({...formData, reason: e.target.value})} className="w-full h-24 text-[13px] font-medium border border-slate-200 rounded-lg px-3 py-2" placeholder="Why are we proposing this expansion right now?" />
           </div>

           <div className="pt-4 border-t border-slate-100 flex gap-2">
              <button type="submit" disabled={loading} className="flex-1 bg-slate-900 text-white font-bold text-[12px] py-2 rounded-lg hover:bg-slate-800 transition-colors">
                 {loading ? 'Saving...' : initialData ? 'Update Opportunity' : 'Create Opportunity'}
              </button>
           </div>
        </form>
      </div>
    </div>
  );
}
