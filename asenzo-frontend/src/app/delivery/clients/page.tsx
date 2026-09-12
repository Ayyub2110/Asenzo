"use client";

import React, { useState } from "react";
import { useDeliveryOS } from "@/contexts/DeliveryOSContext";

export default function DeliveryClientsPage() {
  const { clients, engagements } = useDeliveryOS();
  const [selectedClient, setSelectedClient] = useState<any | null>(null);

  return (
    <div className="pt-8 pb-32 space-y-10 animate-in fade-in duration-300 px-8 relative h-full max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
         <div>
            <h1 className="text-[24px] font-black tracking-tight text-slate-900 flex items-center gap-2">
               <span className="material-symbols-outlined text-[28px] text-blue-500">groups</span>
               Clients Directory
            </h1>
            <p className="text-[14px] text-slate-500 font-medium mt-1">See exactly who we are serving right now.</p>
         </div>
      </div>

      <div>
         <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                     <th className="px-6 py-4">Client</th>
                     <th className="px-6 py-4">Primary Contact</th>
                     <th className="px-6 py-4">Owner</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4">Health</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {clients.map(c => {
                     return (
                        <tr key={c.id} onClick={() => setSelectedClient(c)} className="hover:bg-slate-50 cursor-pointer transition-colors">
                           <td className="px-6 py-4">
                              <div className="text-[13px] font-black text-slate-900">{c.company}</div>
                           </td>
                           <td className="px-6 py-4">
                              <div className="text-[13px] font-bold text-slate-700">{c.primaryContact}</div>
                           </td>
                           <td className="px-6 py-4 text-[13px] font-medium text-slate-600">{c.owner}</td>
                           <td className="px-6 py-4">
                              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">{c.status.replace("_", " ")}</span>
                           </td>
                           <td className="px-6 py-4">
                              <span className={`text-[12px] font-bold ${c.health === "AT_RISK" || c.health === "CRITICAL" ? "text-red-600" : c.health === "HEALTHY" ? "text-emerald-600" : "text-amber-600"}`}>
                                 {c.health.replace("_", " ")}
                              </span>
                           </td>
                        </tr>
                     );
                  })}
                  {clients.length === 0 && (
                     <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-[13px] font-bold text-slate-400">No active clients.</td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      {/* Linked Unified Profile Drawer */}
      {selectedClient && (() => {
         const engs = engagements.filter(e => e.clientId === selectedClient.id || e.customerId === selectedClient.id);
         
         return (
            <div className="fixed inset-y-0 right-0 w-[450px] bg-white border-l border-slate-200 shadow-2xl z-50 p-6 overflow-y-auto animate-in slide-in-from-right">
               <button onClick={() => setSelectedClient(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
                  <span className="material-symbols-outlined">close</span>
               </button>
               
               <div className="mb-8">
                  <h2 className="text-[24px] font-black text-slate-900 tracking-tight">{selectedClient.company}</h2>
                  <p className="text-[14px] text-slate-500 font-medium mt-1">{selectedClient.primaryContact} ({selectedClient.email})</p>
                  
                  <div className="flex items-center gap-3 mt-4">
                     <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded mr-2">{selectedClient.status.replace("_", " ")}</span>
                     <span className={`text-[12px] font-bold ${selectedClient.health === "AT_RISK" || selectedClient.health === "CRITICAL" ? "text-red-600" : selectedClient.health === "HEALTHY" ? "text-emerald-600" : "text-amber-600"}`}>
                        Health: {selectedClient.health.replace("_", " ")}
                     </span>
                  </div>
               </div>

               <div className="space-y-8">
                  <div>
                     <h3 className="text-[14px] font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">Active Engagements</h3>
                     <div className="space-y-3">
                        {engs.map(e => (
                           <div key={e.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50 relative overflow-hidden group">
                              <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-blue-500"></div>
                              <p className="text-[13px] font-bold text-slate-900 mb-1">{e.name}</p>
                              <div className="flex items-center justify-between">
                                 <p className="text-[11px] font-medium text-slate-500">{e.status}</p>
                                 <span className="text-[11px] font-extrabold text-blue-600">{e.progress}%</span>
                              </div>
                           </div>
                        ))}
                        {engs.length === 0 && (
                           <p className="text-[12px] text-slate-500 font-medium">No engagements attached.</p>
                        )}
                     </div>
                  </div>

                  <div>
                     <h3 className="text-[14px] font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">Commercial (Revenue Connection)</h3>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                           <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Renewal Date</p>
                           <p className="text-[14px] font-bold text-slate-900">{selectedClient.renewalDate ? new Date(selectedClient.renewalDate).toLocaleDateString() : "Not Set"}</p>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl shadow-sm">
                           <p className="text-[10px] uppercase font-bold text-emerald-600 tracking-widest mb-1">Expansion Risk/Opp</p>
                           <p className="text-[14px] font-bold text-emerald-900">View in Revenue →</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         );
      })()}
    </div>
  );
}
