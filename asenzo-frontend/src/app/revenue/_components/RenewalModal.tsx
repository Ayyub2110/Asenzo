"use client";

import React, { useState } from "react";
import { useRevenueOS } from "@/contexts/RevenueOSContext";
import { Renewal } from "@/lib/types/revenue";

export default function RenewalModal({ isOpen, onClose, initialData }: { isOpen: boolean, onClose: () => void, initialData?: Renewal }) {
  const { customers, createRenewal, updateRenewal } = useRevenueOS();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Renewal>>(initialData || {
    customerId: customers[0]?.id || "",
    currentValue: 0,
    renewalDate: new Date().toISOString().split('T')[0],
    status: "UPCOMING",
    riskLevel: "LOW",
    riskReason: "",
    recommendedAction: ""
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initialData?.id) {
         if(updateRenewal) await updateRenewal(initialData.id, formData);
      } else {
         if(createRenewal) await createRenewal(formData as Omit<Renewal, 'id'>);
      }
      onClose();
    } catch(err) {
      console.error(err);
      alert("Failed to save renewal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
      <div className="w-[450px] bg-white h-full shadow-2xl animate-in slide-in-from-right flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
           <h2 className="text-[16px] font-bold text-slate-900">{initialData ? 'Update Renewal & Risk' : 'Log Renewal Tracking'}</h2>
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
                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Current MRR ($)</label>
                 <input required type="number" value={formData.currentValue} onChange={(e) => setFormData({...formData, currentValue: Number(e.target.value)})} className="w-full text-[13px] font-medium border border-slate-200 rounded-lg px-3 py-2 bg-slate-50" />
              </div>
              <div>
                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Renewal Date</label>
                 <input required type="date" value={formData.renewalDate?.split('T')[0]} onChange={(e) => setFormData({...formData, renewalDate: e.target.value})} className="w-full text-[13px] font-medium border border-slate-200 rounded-lg px-3 py-2" />
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Status</label>
                 <select required value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as any})} className="w-full text-[13px] font-medium border border-slate-200 rounded-lg px-3 py-2">
                    <option value="UPCOMING">Upcoming</option>
                    <option value="IN_NEGOTIATION">In Negotiation</option>
                    <option value="RENEWED">Renewed / Won</option>
                    <option value="CHURNED">Churned / Lost</option>
                 </select>
              </div>
              <div>
                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Churn Risk Level</label>
                 <select required value={formData.riskLevel} onChange={(e) => setFormData({...formData, riskLevel: e.target.value as any})} className="w-full text-[13px] font-medium border border-slate-200 rounded-lg px-3 py-2">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High / Critical</option>
                 </select>
              </div>
           </div>

           <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Risk Context</label>
              <textarea required={formData.riskLevel !== 'LOW'} value={formData.riskReason || ''} onChange={(e) => setFormData({...formData, riskReason: e.target.value})} className="w-full h-16 text-[13px] font-medium border border-slate-200 rounded-lg px-3 py-2" placeholder="Why is this account at risk?" />
           </div>

           <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Recommended Action</label>
              <textarea value={formData.recommendedAction || ''} onChange={(e) => setFormData({...formData, recommendedAction: e.target.value})} className="w-full h-16 text-[13px] font-medium border border-slate-200 rounded-lg px-3 py-2" placeholder="What needs to be done?" />
           </div>

           <div className="pt-4 border-t border-slate-100 flex gap-2">
              <button type="submit" disabled={loading} className="flex-1 bg-slate-900 text-white font-bold text-[12px] py-2 rounded-lg hover:bg-slate-800 transition-colors">
                 {loading ? 'Saving...' : initialData ? 'Update Renewal' : 'Record Renewal'}
              </button>
           </div>
        </form>
      </div>
    </div>
  );
}
