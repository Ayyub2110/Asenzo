"use client";

import React, { useState } from "react";
import { useRevenueOS } from "@/contexts/RevenueOSContext";
import { RevenueTransaction, TransactionStatus, TransactionType } from "@/lib/types/revenue";

export default function TransactionModal({ isOpen, onClose, initialData }: { isOpen: boolean, onClose: () => void, initialData?: RevenueTransaction }) {
  const { customers, createTransaction, updateTransaction } = useRevenueOS();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<RevenueTransaction>>(initialData || {
    amount: 0,
    status: "PAID",
    type: "RECURRING",
    date: new Date().toISOString().split('T')[0],
    offerName: "",
    customerId: customers[0]?.id || "",
    invoiceId: ""
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initialData?.id) {
         await updateTransaction(initialData.id, formData);
      } else {
         await createTransaction(formData as Omit<RevenueTransaction, 'id'>);
      }
      onClose();
    } catch(err) {
      console.error(err);
      alert("Failed to save transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
      <div className="w-[450px] bg-white h-full shadow-2xl animate-in slide-in-from-right flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
           <h2 className="text-[16px] font-bold text-slate-900">{initialData ? 'Edit Transaction' : 'Record Transaction'}</h2>
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
           
           <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Offer / Product</label>
              <input required type="text" value={formData.offerName} onChange={(e) => setFormData({...formData, offerName: e.target.value})} className="w-full text-[13px] font-medium border border-slate-200 rounded-lg px-3 py-2" placeholder="e.g. Foundation OS" />
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Amount ($)</label>
                 <input required type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})} className="w-full text-[13px] font-medium border border-slate-200 rounded-lg px-3 py-2 bg-slate-50" />
              </div>
              <div>
                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Date</label>
                 <input required type="date" value={formData.date?.split('T')[0]} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full text-[13px] font-medium border border-slate-200 rounded-lg px-3 py-2" />
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Type</label>
                 <select required value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value as TransactionType})} className="w-full text-[13px] font-medium border border-slate-200 rounded-lg px-3 py-2">
                    <option value="RECURRING">Recurring (MRR)</option>
                    <option value="ONE_TIME">One Time</option>
                 </select>
              </div>
              <div>
                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Status</label>
                 <select required value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as TransactionStatus})} className="w-full text-[13px] font-medium border border-slate-200 rounded-lg px-3 py-2">
                    <option value="PAID">Paid / Realized</option>
                    <option value="OUTSTANDING">Outstanding</option>
                    <option value="PENDING">Pending</option>
                    <option value="REFUNDED">Refunded</option>
                 </select>
              </div>
           </div>

           <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Invoice ID (Optional)</label>
              <input type="text" value={formData.invoiceId || ''} onChange={(e) => setFormData({...formData, invoiceId: e.target.value})} className="w-full text-[13px] font-medium border border-slate-200 rounded-lg px-3 py-2" placeholder="INV-001" />
           </div>

           <div className="pt-4 border-t border-slate-100 flex gap-2">
              <button type="submit" disabled={loading} className="flex-1 bg-slate-900 text-white font-bold text-[12px] py-2 rounded-lg hover:bg-slate-800 transition-colors">
                 {loading ? 'Saving...' : initialData ? 'Update Transaction' : 'Record Transaction'}
              </button>
           </div>
        </form>
      </div>
    </div>
  );
}
