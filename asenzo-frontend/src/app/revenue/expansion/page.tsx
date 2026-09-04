"use client";

import React, { useState } from "react";
import { useRevenueOS } from "@/contexts/RevenueOSContext";
import RenewalModal from "../_components/RenewalModal";
import ExpansionModal from "../_components/ExpansionModal";

export default function ExpansionPage() {
  const { renewals, expansions, customers } = useRevenueOS();
  
  const [renewalModalOpen, setRenewalModalOpen] = useState(false);
  const [expansionModalOpen, setExpansionModalOpen] = useState(false);
  const [editingRenewal, setEditingRenewal] = useState<any>(undefined);
  const [editingExpansion, setEditingExpansion] = useState<any>(undefined);

  return (
    <div className="pt-8 space-y-6 animate-in fade-in duration-300 px-8">
      <RenewalModal isOpen={renewalModalOpen} onClose={() => {setRenewalModalOpen(false); setEditingRenewal(undefined);}} initialData={editingRenewal} />
      <ExpansionModal isOpen={expansionModalOpen} onClose={() => {setExpansionModalOpen(false); setEditingExpansion(undefined);}} initialData={editingExpansion} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-black text-slate-900 tracking-tight">Retention & Expansion</h1>
          <p className="text-[14px] text-slate-500 font-medium mt-1">Manage renewals, churn risk, and upsell opportunities for active customers.</p>
        </div>
        <div className="flex gap-2">
           <button onClick={() => setRenewalModalOpen(true)} className="px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-lg text-[12px] font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors">
              <span className="material-symbols-outlined text-[16px]">event_repeat</span> Log Renewal
           </button>
           <button onClick={() => setExpansionModalOpen(true)} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-[12px] font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined text-[16px]">trending_up</span> Add Expansion Opp
           </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
         {/* Renewals & Churn Risk */}
         <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex-1">
             <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-[14px] font-bold text-slate-900 flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px] text-slate-400">event_repeat</span> Renewals & Churn Risk</h3>
             </div>
             <div className="divide-y divide-slate-100">
               {renewals.map(r => {
                  const customer = customers.find(c => c.id === r.customerId);
                  if(!customer) return null;
                  return (
                     <div key={r.id} className="p-6">
                        <div className="flex justify-between items-start mb-3">
                           <div>
                              <div className="text-[14px] font-black text-slate-900 flex items-center gap-2">
                                 {customer.name}
                                 <span className={`px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded ${r.riskLevel === 'HIGH' ? 'bg-red-100 text-red-700' : r.riskLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{r.riskLevel} CHURN RISK</span>
                              </div>
                              <div className="text-[12px] font-bold text-slate-500 mt-1">Renews: {new Date(r.renewalDate).toLocaleDateString()} &middot; ${r.currentValue.toLocaleString()} MRR</div>
                           </div>
                           <button onClick={() => {setEditingRenewal(r); setRenewalModalOpen(true);}} className="text-[11px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">Action</button>
                        </div>
                        {r.riskReason && (
                           <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mt-3">
                              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Risk Context</span>
                              <p className="text-[12px] text-slate-700 font-medium">{r.riskReason}</p>
                              {r.recommendedAction && <p className="text-[12px] text-slate-600 italic mt-2 border-t border-slate-200 pt-2"><b className="not-italic mr-1">Recommended:</b> {r.recommendedAction}</p>}
                           </div>
                        )}
                     </div>
                  );
               })}
             </div>
         </div>

         {/* Expansion Opportunities */}
         <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex-1">
             <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-[14px] font-bold text-slate-900 flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px] text-slate-400">trending_up</span> Expansion Pipeline</h3>
             </div>
             <div className="divide-y divide-slate-100">
                {expansions.length > 0 ? expansions.map(ex => {
                   const customer = customers.find(c => c.id === ex.customerId);
                   if(!customer) return null;
                   return (
                      <div key={ex.id} onClick={() => {setEditingExpansion(ex); setExpansionModalOpen(true);}} className="p-6 hover:bg-slate-50 cursor-pointer transition-colors">
                         <div className="flex justify-between items-start mb-2">
                           <div>
                              <div className="text-[14px] font-black text-slate-900">{customer.name}</div>
                              <div className="text-[12px] font-bold text-emerald-600 mt-0.5">+${ex.potentialRevenue.toLocaleString()} <span className="text-[10px] font-semibold text-slate-400">Potential ({ex.type.replace("_", "-")})</span></div>
                           </div>
                           <span className="px-2 py-1 text-[9px] font-extrabold uppercase rounded bg-slate-100 text-slate-600 border border-slate-200">{ex.status.replace("_", " ")}</span>
                         </div>
                         <p className="text-[12px] text-slate-600 bg-white border border-slate-200 p-2.5 rounded-lg shadow-sm mt-3 font-medium">{ex.reason}</p>
                      </div>
                   );
                }) : (
                   <div className="p-8 text-center text-[12px] font-bold text-slate-400">No expansion opportunities detected currently.</div>
                )}
             </div>
         </div>
      </div>
    </div>
  );
}
