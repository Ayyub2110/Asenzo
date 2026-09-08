"use client";

import React, { useState } from "react";
import { useDeliveryOS } from "@/contexts/DeliveryOSContext";

export default function DeliveryOnboardingPage() {
  const { clients, onboardings, engagements } = useDeliveryOS();
  const [selectedOnboarding, setSelectedOnboarding] = useState<any | null>(null);

  const activeOnboardings = onboardings.filter(o => o.status !== "COMPLETED" && o.status !== "CANCELLED");

  return (
    <div className="pt-8 pb-32 space-y-10 animate-in fade-in duration-300 px-8 relative h-full">
      {/* Header */}
      <div className="flex items-start justify-between">
         <div>
            <h1 className="text-[24px] font-black tracking-tight text-slate-900">Onboarding</h1>
            <p className="text-[14px] text-slate-500 font-medium mt-1">Move closed-won customers from sale to active delivery.</p>
         </div>
      </div>

      <div>
         <h2 className="text-[18px] font-black text-slate-900 mb-4">Active Onboarding Queue</h2>
         <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                     <th className="px-6 py-4">Client</th>
                     <th className="px-6 py-4">Engagement</th>
                     <th className="px-6 py-4">Owner</th>
                     <th className="px-6 py-4">Current Stage</th>
                     <th className="px-6 py-4">Progress</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {activeOnboardings.map(o => {
                     const client = clients.find(c => c.id === o.customerId);
                     const eng = engagements.find(e => e.id === o.engagementId);
                     
                     return (
                        <tr key={o.id} onClick={() => setSelectedOnboarding(o)} className="hover:bg-slate-50 cursor-pointer transition-colors">
                           <td className="px-6 py-4">
                              <div className="text-[13px] font-black text-slate-900">{client?.company || "Unknown"}</div>
                           </td>
                           <td className="px-6 py-4">
                              <div className="text-[13px] font-bold text-slate-700">{eng?.name || o.offer}</div>
                           </td>
                           <td className="px-6 py-4 text-[13px] font-medium text-slate-600">{o.owner}</td>
                           <td className="px-6 py-4">
                              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">{o.status.replace("_", " ")}</span>
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                 <div className="w-16 h-1.5 bg-slate-100 rounded overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded" style={{ width: `${o.progress}%` }}></div>
                                 </div>
                                 <span className="text-[11px] font-bold text-slate-500">{o.progress}%</span>
                              </div>
                           </td>
                        </tr>
                     );
                  })}
                  {activeOnboardings.length === 0 && (
                     <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-[13px] font-bold text-slate-400">No active onboardings in queue.</td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      {/* Drawer */}
      {selectedOnboarding && (() => {
         const client = clients.find(c => c.id === selectedOnboarding.customerId);
         const eng = engagements.find(e => e.id === selectedOnboarding.engagementId);
         const isReady = selectedOnboarding.progress === 100 || selectedOnboarding.status === "COMPLETED";

         return (
            <div className="fixed inset-y-0 right-0 w-[450px] bg-white border-l border-slate-200 shadow-2xl z-50 p-6 overflow-y-auto animate-in slide-in-from-right">
               <button onClick={() => setSelectedOnboarding(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
                  <span className="material-symbols-outlined">close</span>
               </button>
               
               <div className="mb-6">
                  <h2 className="text-[24px] font-black text-slate-900 tracking-tight">{client?.company || "Unknown Client"}</h2>
                  <p className="text-[14px] text-slate-500 font-medium mt-1">{eng?.name || selectedOnboarding.offer}</p>
               </div>

               <div className="space-y-8">
                  {/* Sales Context */}
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                     <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Sales Handoff Context</h3>
                     <div className="space-y-2">
                        <div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Primary Contact</p>
                           <p className="text-[13px] font-bold text-slate-900">{client?.primaryContact || "N/A"}</p>
                        </div>
                        <div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5 mt-2">Promised Outcome</p>
                           <p className="text-[13px] font-medium text-slate-700">{eng?.successCriteria || "Not explicitly defined in handoff."}</p>
                        </div>
                        <div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5 mt-2">Important Expectations (Notes)</p>
                           <p className="text-[12px] font-medium text-slate-600">{selectedOnboarding.notes || "None recorded."}</p>
                        </div>
                     </div>
                  </div>

                  {/* Onboarding Checklist */}
                  <div>
                     <h3 className="text-[14px] font-black text-slate-900 mb-3">Onboarding Checklist</h3>
                     <div className="space-y-2">
                        {selectedOnboarding.steps?.map((step: any) => (
                           <label key={step.id} className={`flex items-center gap-3 p-3 rounded-lg border ${step.status === "COMPLETED" ? "bg-slate-50 border-slate-200 opacity-60" : "bg-white border-blue-200 shadow-sm cursor-pointer hover:bg-blue-50"}`}>
                              <input type="checkbox" checked={step.status === "COMPLETED"} readOnly className="w-4 h-4 text-blue-600 rounded cursor-pointer" />
                              <div>
                                 <p className={`text-[13px] font-bold ${step.status === "COMPLETED" ? "text-slate-500" : "text-blue-900"}`}>{step.task}</p>
                              </div>
                           </label>
                        ))}
                        {(!selectedOnboarding.steps || selectedOnboarding.steps.length === 0) && (
                           <div className="p-4 border border-slate-200 rounded-lg text-[12px] font-medium text-slate-500 text-center">No checklist steps defined.</div>
                        )}
                     </div>
                  </div>

                  {/* Action */}
                  <div className="pt-4 border-t border-slate-100">
                     <button className={`w-full py-2.5 rounded-lg text-[13px] font-bold transition-all ${isReady ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20" : "bg-slate-900 hover:bg-slate-800 text-white"}`}>
                        {isReady ? "Move Engagement to ACTIVE" : "Update Onboarding"}
                     </button>
                  </div>
               </div>
            </div>
         );
      })()}
    </div>
  );
}
