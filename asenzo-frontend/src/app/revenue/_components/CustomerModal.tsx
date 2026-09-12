"use client";

import React, { useState } from "react";
import { useRevenueOS } from "@/contexts/RevenueOSContext";
import { Customer, CustomerStatus, CustomerHealth } from "@/lib/types/revenue";

export default function CustomerModal({ isOpen, onClose, initialData }: { isOpen: boolean, onClose: () => void, initialData?: Customer }) {
  const { createCustomer, updateCustomer } = useRevenueOS();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Customer>>(initialData || {
    name: "",
    company: "",
    email: "",
    source: "Direct Sales",
    originalContent: "-",
    offerPurchased: "",
    contractStartDate: new Date().toISOString().split('T')[0],
    totalRevenue: 0,
    recurringRevenue: 0,
    status: "NEW",
    health: "HEALTHY",
    healthReasoning: "New customer onboarding.",
    accountOwner: "Founder"
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initialData?.id) {
         await updateCustomer(initialData.id, formData);
      } else {
         await createCustomer(formData as Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'purchaseDate'>);
      }
      onClose();
    } catch(err) {
      console.error(err);
      alert("Failed to save customer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
      <div className="w-[500px] bg-white h-full shadow-2xl animate-in slide-in-from-right flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
           <h2 className="text-[16px] font-bold text-slate-900">{initialData ? 'Edit Customer' : 'Add New Customer'}</h2>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined text-[20px]">close</span></button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
           
           <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Contact Name</label>
                 <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full text-[13px] font-medium border border-slate-200 rounded-lg px-3 py-2" />
              </div>
              <div>
                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Company</label>
                 <input required type="text" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="w-full text-[13px] font-medium border border-slate-200 rounded-lg px-3 py-2" />
              </div>
           </div>

           <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Email</label>
              <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full text-[13px] font-medium border border-slate-200 rounded-lg px-3 py-2" />
           </div>

           <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
              <h3 className="text-[12px] font-bold text-slate-900">Attribution & Commercial</h3>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Acquisition Source</label>
                    <select required value={formData.source} onChange={(e) => setFormData({...formData, source: e.target.value})} className="w-full text-[13px] font-medium border border-slate-200 rounded-lg px-3 py-2">
                       <option value="LinkedIn">LinkedIn</option>
                       <option value="YouTube">YouTube</option>
                       <option value="Instagram">Instagram</option>
                       <option value="Direct Sales">Direct Sales</option>
                       <option value="Referral">Referral</option>
                    </select>
                 </div>
                 <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Offer Purchased</label>
                    <input required type="text" value={formData.offerPurchased} onChange={(e) => setFormData({...formData, offerPurchased: e.target.value})} className="w-full text-[13px] font-medium border border-slate-200 rounded-lg px-3 py-2" />
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Current Status</label>
                 <select required value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as CustomerStatus})} className="w-full text-[13px] font-medium border border-slate-200 rounded-lg px-3 py-2">
                    <option value="NEW">New</option>
                    <option value="ONBOARDING">Onboarding</option>
                    <option value="ACTIVE">Active</option>
                    <option value="RENEWING">Renewing</option>
                    <option value="EXPANDED">Expanded</option>
                    <option value="AT_RISK">At Risk</option>
                    <option value="CHURNED">Churned</option>
                 </select>
              </div>
              <div>
                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Health Signals</label>
                 <select required value={formData.health} onChange={(e) => setFormData({...formData, health: e.target.value as CustomerHealth})} className="w-full text-[13px] font-medium border border-slate-200 rounded-lg px-3 py-2">
                    <option value="HEALTHY">Healthy</option>
                    <option value="AT_RISK">At Risk</option>
                    <option value="CRITICAL">Critical</option>
                 </select>
              </div>
           </div>
           
           <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Health Reasoning</label>
              <textarea required value={formData.healthReasoning} onChange={(e) => setFormData({...formData, healthReasoning: e.target.value})} className="w-full h-20 text-[13px] font-medium border border-slate-200 rounded-lg px-3 py-2" />
           </div>

           <div className="pt-6 border-t border-slate-100 flex gap-2">
              <button type="submit" disabled={loading} className="flex-1 bg-slate-900 text-white font-bold text-[12px] py-2 rounded-lg hover:bg-slate-800 transition-colors">
                 {loading ? 'Saving...' : initialData ? 'Update Customer' : 'Create Customer'}
              </button>
           </div>
        </form>
      </div>
    </div>
  );
}
