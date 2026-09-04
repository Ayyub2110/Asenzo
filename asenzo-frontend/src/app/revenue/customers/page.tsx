"use client";

import React, { useState } from "react";
import { useRevenueOS } from "@/contexts/RevenueOSContext";
import CustomerModal from "../_components/CustomerModal";

export default function CustomersPage() {
  const { customers } = useRevenueOS();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(undefined);

  return (
    <div className="pt-8 space-y-6 animate-in fade-in duration-300 px-8">
      {modalOpen && <CustomerModal isOpen={modalOpen} onClose={() => {setModalOpen(false); setEditingCustomer(undefined);}} initialData={editingCustomer} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-black text-slate-900 tracking-tight">Customer Database</h1>
          <p className="text-[14px] text-slate-500 font-medium mt-1">Post-sale customer records linked to conversion sources and operational health.</p>
        </div>
        <div>
           <button onClick={() => setModalOpen(true)} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-[12px] font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined text-[16px]">person_add</span> Create Customer
           </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[500px]">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Customer</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Source Attribution</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Offer</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Total Value</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest text-center">Status</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest text-center">Health</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {customers.length > 0 ? customers.map((c) => (
                  <tr key={c.id} onClick={() => {setEditingCustomer(c); setModalOpen(true);}} className="hover:bg-slate-50 transition-colors cursor-pointer">
                     <td className="px-6 py-4">
                        <div className="text-[13px] font-bold text-slate-900">{c.name}</div>
                        <div className="text-[11px] font-medium text-slate-500">{c.company}</div>
                     </td>
                     <td className="px-6 py-4">
                        <div className="text-[12px] font-bold text-slate-700">{c.source}</div>
                        <div className="text-[10px] font-medium text-slate-400 mt-0.5">{c.originalContent}</div>
                     </td>
                     <td className="px-6 py-4">
                        <div className="text-[12px] font-bold text-slate-700">{c.offerPurchased}</div>
                        <div className="text-[10px] font-medium text-slate-400 mt-0.5">Start: {c.contractStartDate}</div>
                     </td>
                     <td className="px-6 py-4">
                        <div className="text-[13px] font-bold text-emerald-600">${c.totalRevenue.toLocaleString()}</div>
                        {c.recurringRevenue > 0 && <div className="text-[10px] font-bold text-slate-500 mt-0.5">${c.recurringRevenue.toLocaleString()}/mo</div>}
                     </td>
                     <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 text-[9px] font-extrabold uppercase rounded border ${
                           c.status === 'ACTIVE' || c.status === 'RENEWING' || c.status === 'EXPANDED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                           c.status === 'ONBOARDING' || c.status === 'NEW' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                           c.status === 'CHURNED' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}>{c.status.replace("_", " ")}</span>
                     </td>
                     <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 text-[9px] font-extrabold uppercase rounded ${
                           c.health === 'HEALTHY' ? 'bg-emerald-500 text-white' :
                           c.health === 'AT_RISK' ? 'bg-amber-500 text-white' :
                           'bg-red-600 text-white'
                        }`}>{c.health.replace("_", " ")}</span>
                     </td>
                  </tr>
               )) : (
                  <tr>
                     <td colSpan={6} className="px-6 py-16 text-center">
                        <div className="text-[13px] font-bold text-slate-600">No active customers found.</div>
                        <p className="text-[11px] font-medium text-slate-400 mt-1 max-w-[300px] mx-auto">Connect your first closed-won customer from Conversion to begin tracking customer health and revenue.</p>
                     </td>
                  </tr>
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
}
