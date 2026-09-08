"use client";

import React, { useState } from "react";
import { useRevenueOS } from "@/contexts/RevenueOSContext";
import RenewalModal from "../_components/RenewalModal";
import ExpansionModal from "../_components/ExpansionModal";
import Link from "next/link";
import { Customer } from "@/lib/types/revenue";

export default function ExpansionPage() {
  const { customers, renewals, expansions } = useRevenueOS();
  
  const [renewalModalOpen, setRenewalModalOpen] = useState(false);
  const [expansionModalOpen, setExpansionModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const activeCustomers = customers.filter(c => c.status !== "CHURNED");
  
  // Calculate upcoming renewals (inside next 30 days)
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const renewalsDue = activeCustomers.filter(c => {
     if (!c.renewalDate) return false;
     const rDate = new Date(c.renewalDate);
     return rDate <= thirtyDaysFromNow;
  });

  const atRiskCustomers = activeCustomers.filter(c => c.health === "AT_RISK" || c.health === "CRITICAL");
  const potentialExpansionValue = expansions.filter(e => e.status !== "CLOSED_WON" && e.status !== "CLOSED_LOST").reduce((sum, e) => sum + e.potentialRevenue, 0);

  // Sorting customers: AT_RISK first, then upcoming renewals, then stable
  const sortedCustomers = [...activeCustomers].sort((a, b) => {
      if ((a.health === "AT_RISK" || a.health === "CRITICAL") && (b.health !== "AT_RISK" && b.health !== "CRITICAL")) return -1;
      if ((a.health !== "AT_RISK" && a.health !== "CRITICAL") && (b.health === "AT_RISK" || b.health === "CRITICAL")) return 1;
      // then by renewal date
      if (a.renewalDate && b.renewalDate) {
         return new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime();
      }
      return 0;
  });

  return (
    <div className="pt-8 space-y-8 animate-in fade-in duration-300 px-8 relative h-full">
      <RenewalModal isOpen={renewalModalOpen} onClose={() => setRenewalModalOpen(false)} />
      <ExpansionModal isOpen={expansionModalOpen} onClose={() => setExpansionModalOpen(false)} />

      {/* Header */}
      <div className="flex items-start justify-between">
         <div>
            <h1 className="text-[24px] font-black tracking-tight text-slate-900">Retention & Expansion</h1>
            <p className="text-[14px] text-slate-500 font-medium mt-1">Keep customers, manage renewals, and identify expansion opportunities.</p>
         </div>
         <div className="flex gap-2">
            <button onClick={() => setRenewalModalOpen(true)} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-[12px] font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors">
               <span className="material-symbols-outlined text-[16px]">add</span> Log Renewal
            </button>
            <button onClick={() => setExpansionModalOpen(true)} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-[12px] font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors">
               <span className="material-symbols-outlined text-[16px]">add</span> Add Expansion
            </button>
         </div>
      </div>

      {/* Top Summary */}
      <div className="grid grid-cols-4 gap-4">
         <div className="border-l-[3px] border-blue-600 bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
            <h3 className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-1">Active Customers</h3>
            <p className="text-[28px] font-black text-slate-900">{activeCustomers.length}</p>
         </div>
         <div className="border-l-[3px] border-amber-500 bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
            <h3 className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-1">Renewals Due</h3>
            <p className="text-[28px] font-black text-slate-900">{renewalsDue.length}</p>
         </div>
         <div className="border-l-[3px] border-red-500 bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
            <h3 className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-1">At Risk</h3>
            <p className="text-[28px] font-black text-red-600">{atRiskCustomers.length}</p>
         </div>
         <div className="border-l-[3px] border-emerald-500 bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
            <h3 className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-1">Expansion</h3>
            <p className="text-[28px] font-black text-emerald-600">£{potentialExpansionValue.toLocaleString()}</p>
         </div>
      </div>

      {/* Main Customer View */}
      <div>
         <h2 className="text-[18px] font-black text-slate-900 mb-4">Customers</h2>
         <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                     <th className="px-6 py-4">Customer</th>
                     <th className="px-6 py-4">Value</th>
                     <th className="px-6 py-4">Renewal</th>
                     <th className="px-6 py-4">Health</th>
                     <th className="px-6 py-4">Next Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {sortedCustomers.map((c) => {
                     const isAtRisk = c.health === "AT_RISK" || c.health === "CRITICAL";
                     
                     let rDate = null;
                     if(c.renewalDate) {
                        rDate = new Date(c.renewalDate).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });
                     }

                     const riskDisplay = isAtRisk ? "At Risk" : (!rDate ? "New" : "Healthy");
                     
                     return (
                        <tr key={c.id} onClick={() => setSelectedCustomer(c)} className={`hover:bg-slate-50 cursor-pointer transition-colors ${selectedCustomer?.id === c.id ? 'bg-slate-50' : ''}`}>
                           <td className="px-6 py-4">
                              <div className="text-[13px] font-black text-slate-900">{c.name}</div>
                              {isAtRisk && <div className="text-[10px] font-bold text-red-600 mt-1 uppercase tracking-widest">AT RISK</div>}
                           </td>
                           <td className="px-6 py-4 text-[13px] font-medium text-slate-600">£{c.recurringRevenue.toLocaleString()} MRR</td>
                           <td className="px-6 py-4 text-[13px] font-medium text-slate-600">{rDate || "—"}</td>
                           <td className="px-6 py-4">
                              <span className={`text-[12px] font-bold ${isAtRisk ? 'text-red-600' : 'text-slate-600'}`}>{riskDisplay}</span>
                           </td>
                           <td className="px-6 py-4 text-[13px] font-medium text-slate-600">
                              {isAtRisk ? "Follow up" : "Renew"}
                           </td>
                        </tr>
                     );
                  })}
               </tbody>
            </table>
         </div>
      </div>

      {/* Expansion Opportunities */}
      <div className="mt-8">
         <h2 className="text-[18px] font-black text-slate-900 mb-4">Expansion Opportunities</h2>
         <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                     <th className="px-6 py-4">Customer</th>
                     <th className="px-6 py-4">Type</th>
                     <th className="px-6 py-4">Potential</th>
                     <th className="px-6 py-4">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {expansions.filter(e => e.status !== "CLOSED_WON" && e.status !== "CLOSED_LOST").length > 0 ? (
                     expansions.filter(e => e.status !== "CLOSED_WON" && e.status !== "CLOSED_LOST").map((e) => {
                        const cust = customers.find(c => c.id === e.customerId);
                        if (!cust) return null;
                        return (
                           <tr key={e.id} onClick={() => {setSelectedCustomer(cust); setExpansionModalOpen(false);}} className="hover:bg-slate-50 cursor-pointer transition-colors">
                              <td className="px-6 py-4">
                                 <div className="text-[13px] font-black text-slate-900">{cust.name}</div>
                              </td>
                              <td className="px-6 py-4 text-[13px] font-medium text-slate-600 capitalize">
                                 {e.type.replace('_', '-').toLowerCase()}
                              </td>
                              <td className="px-6 py-4 text-[13px] font-bold text-emerald-600">
                                 +£{e.potentialRevenue.toLocaleString()}
                              </td>
                              <td className="px-6 py-4">
                                 <span className="text-[12px] font-bold text-slate-600 capitalize">
                                    {e.status === 'CLOSES_WON' ? "Won" : e.status === 'CLOSED_LOST' ? "Lost" : e.status === 'IDENTIFIED' ? "Opportunity" : e.status.toLowerCase()}
                                 </span>
                              </td>
                           </tr>
                        );
                     })
                  ) : (
                     <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-[13px] font-bold text-slate-400">
                           No open expansion opportunities.
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      {/* Customer Detail Drawer */}
      {selectedCustomer && (
         <div className="fixed inset-y-0 right-0 w-[400px] bg-white border-l border-slate-200 shadow-2xl z-50 p-6 overflow-y-auto animate-in slide-in-from-right">
            <button onClick={() => setSelectedCustomer(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
               <span className="material-symbols-outlined">close</span>
            </button>
            
            <div className="mb-8">
               <h2 className="text-[24px] font-black text-slate-900 tracking-tight">{selectedCustomer.name}</h2>
               <p className="text-[14px] text-slate-500 font-medium">{selectedCustomer.company}</p>
            </div>

            <div className="space-y-6">
               <div className="flex gap-8">
                  <div>
                     <p className="text-[20px] font-black text-slate-900">£{selectedCustomer.recurringRevenue.toLocaleString()} <span className="text-[12px] text-slate-500">MRR</span></p>
                  </div>
                  <div>
                     <p className={`text-[14px] font-bold mt-1.5 ${selectedCustomer.health === "AT_RISK" || selectedCustomer.health === "CRITICAL" ? "text-red-600" : "text-emerald-600"}`}>
                        {selectedCustomer.health === "AT_RISK" || selectedCustomer.health === "CRITICAL" ? "At Risk" : "Healthy"}
                     </p>
                  </div>
               </div>

               <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Renewal</h4>
                  <p className="text-[14px] font-medium text-slate-800">
                     {selectedCustomer.renewalDate ? new Date(selectedCustomer.renewalDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric'}) : "Not set"}
                  </p>
               </div>

               {(selectedCustomer.health === "AT_RISK" || selectedCustomer.health === "CRITICAL") && (
                  <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
                     <h4 className="text-[11px] font-bold text-red-600 uppercase tracking-widest mb-1.5">Risk Reason</h4>
                     <p className="text-[13px] text-red-900 font-medium">{selectedCustomer.healthReasoning || "Renewal approaching + unresolved issue"}</p>
                  </div>
               )}

               <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-[14px] font-black text-slate-900 mb-3">Next Action</h3>
                  <div className="flex flex-col gap-3">
                     <p className="text-[13px] font-medium text-slate-600">{selectedCustomer.health === "AT_RISK" || selectedCustomer.health === "CRITICAL" ? "Follow up on risk factor" : "Renew customer"}</p>
                     <Link href="/conversion/conversations" className="inline-flex justify-center w-full py-2 bg-slate-900 text-white text-[13px] font-bold rounded hover:bg-slate-800 transition">
                        Open Conversation
                     </Link>
                  </div>
               </div>

               {/* Expansions list for this customer */}
               {(() => {
                  const custExpansions = expansions.filter(e => e.customerId === selectedCustomer.id);
                  if(custExpansions.length === 0) return null;
                  
                  return (
                     <div className="pt-6 border-t border-slate-100 space-y-4">
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Expansion Opportunities</h4>
                        {custExpansions.map(e => (
                           <div key={e.id} className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                              <div className="flex justify-between items-start mb-2">
                                 <div>
                                    <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mr-2">{e.type.replace('_','-')}</span>
                                    <span className="text-[10px] uppercase font-bold text-slate-500 border border-slate-200 bg-white px-2 py-0.5 rounded">{e.status === 'CLOSES_WON' ? "WON" : e.status === 'CLOSED_LOST' ? "LOST" : e.status}</span>
                                 </div>
                              </div>
                              <p className="text-[18px] font-black text-emerald-600 mb-2">+£{e.potentialRevenue.toLocaleString()}</p>
                              <div className="mb-4">
                                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Reason</p>
                                 <p className="text-[12px] font-medium text-slate-700">{e.reason}</p>
                              </div>
                              <Link href="/conversion/pipeline" className="inline-flex py-1.5 px-3 bg-white border border-slate-200 shadow-sm text-slate-700 text-[11px] font-bold rounded hover:bg-slate-50 transition w-full justify-center">
                                 View Opportunity
                              </Link>
                           </div>
                        ))}
                     </div>
                  );
               })()}
            </div>
         </div>
      )}
    </div>
  );
}
