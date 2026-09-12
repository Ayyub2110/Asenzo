"use client";

import React, { useState } from "react";
import { useDeliveryOS } from "@/contexts/DeliveryOSContext";

export default function DeliveryEngagementsPage() {
  const { engagements, clients, milestones, deliverables } = useDeliveryOS();
  const [selectedEngagement, setSelectedEngagement] = useState<any | null>(null);

  const activeEngagements = engagements.filter(e => e.status !== "COMPLETED" && e.status !== "CANCELLED");

  return (
    <div className="pt-8 pb-32 space-y-10 animate-in fade-in duration-300 px-8 relative h-full max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
         <div>
            <h1 className="text-[24px] font-black tracking-tight text-slate-900 flex items-center gap-2">
               <span className="material-symbols-outlined text-[28px] text-blue-500">work</span>
               Engagements (Delivery Workspace)
            </h1>
            <p className="text-[14px] text-slate-500 font-medium mt-1">What we are actually delivering to clients right now.</p>
         </div>
      </div>

      <div>
         <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                     <th className="px-6 py-4">Client</th>
                     <th className="px-6 py-4">Engagement</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4">Progress</th>
                     <th className="px-6 py-4">Owner</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {activeEngagements.map(e => {
                     const client = clients.find(c => c.id === e.customerId || c.id === (e as any).clientId);
                     
                     return (
                        <tr key={e.id} onClick={() => setSelectedEngagement(e)} className="hover:bg-slate-50 cursor-pointer transition-colors">
                           <td className="px-6 py-4">
                              <div className="text-[13px] font-black text-slate-900">{client?.company || "Unknown"}</div>
                           </td>
                           <td className="px-6 py-4">
                              <div className="text-[13px] font-bold text-slate-700">{e.name}</div>
                           </td>
                           <td className="px-6 py-4">
                              <span className={`text-[11px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${e.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>{e.status}</span>
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                 <div className="w-16 h-1.5 bg-slate-100 rounded overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded" style={{ width: `${e.progress}%` }}></div>
                                 </div>
                                 <span className="text-[11px] font-bold text-slate-500">{e.progress}%</span>
                              </div>
                           </td>
                           <td className="px-6 py-4 text-[13px] font-medium text-slate-600">{e.owner}</td>
                        </tr>
                     );
                  })}
                  {activeEngagements.length === 0 && (
                     <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-[13px] font-bold text-slate-400">No active engagements.</td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      {/* Drawer */}
      {selectedEngagement && (() => {
         const client = clients.find(c => c.id === selectedEngagement.customerId || c.id === (selectedEngagement as any).clientId);
         const engMilestones = milestones.filter(m => m.engagementId === selectedEngagement.id).sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
         const engDeliverables = deliverables.filter(d => d.engagementId === selectedEngagement.id);

         return (
            <div className="fixed inset-y-0 right-0 w-[500px] bg-white border-l border-slate-200 shadow-2xl z-50 p-6 overflow-y-auto animate-in slide-in-from-right">
               <button onClick={() => setSelectedEngagement(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
                  <span className="material-symbols-outlined">close</span>
               </button>
               
               <div className="mb-8">
                  <p className="text-[12px] font-bold text-blue-600 uppercase tracking-widest mb-1 pb-1">{client?.company || "Unknown"}</p>
                  <h2 className="text-[24px] font-black text-slate-900 tracking-tight">{selectedEngagement.name}</h2>
                  <p className="text-[13px] text-slate-500 font-medium mt-1 pr-6">{selectedEngagement.description}</p>
                  <div className="flex gap-4 mt-4">
                     <span className={`text-[11px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${selectedEngagement.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>{selectedEngagement.status}</span>
                     <span className="text-[12px] font-black text-slate-900 text-blue-600">{selectedEngagement.progress}% Complete</span>
                  </div>
               </div>

               <div className="space-y-8">
                  {/* Milestones */}
                  <div>
                     <h3 className="text-[14px] font-black text-slate-900 mb-4 border-b border-slate-100 pb-2">Delivery Progress (Milestones)</h3>
                     <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-100">
                        {engMilestones.map((m, idx) => {
                           const isComplete = m.status === "COMPLETED";
                           const isProgress = m.status === "IN_PROGRESS";
                           return (
                              <div key={m.id} className="relative flex items-center justify-between max-w-full z-10 w-full group transition-all">
                                 <div className="flex items-center gap-4">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 ${isComplete ? "bg-blue-600 border-blue-600" : isProgress ? "bg-white border-blue-600" : "bg-slate-100 border-slate-200"}`}>
                                       {isComplete && <span className="material-symbols-outlined text-[12px] text-white font-bold">check</span>}
                                       {isProgress && <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>}
                                    </div>
                                    <div>
                                       <span className="text-[10px] font-bold text-slate-400 block tracking-widest mb-0.5">0{idx+1} {m.dueDate && new Date(m.dueDate).toLocaleDateString()}</span>
                                       <span className={`text-[13px] font-bold ${isComplete ? "text-slate-400 line-through" : "text-slate-900"}`}>{m.name}</span>
                                    </div>
                                 </div>
                              </div>
                           )
                        })}
                        {engMilestones.length === 0 && <p className="text-[12px] text-slate-500 mt-2 px-6">No mapped milestones.</p>}
                     </div>
                  </div>

                  {/* Deliverables List */}
                  <div>
                     <h3 className="text-[14px] font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">Deliverables</h3>
                     <div className="space-y-2">
                        {engDeliverables.map(d => {
                           const isDone = d.status === "DELIVERED";
                           return (
                              <div key={d.id} className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm flex items-center justify-between group cursor-pointer hover:border-slate-300">
                                 <div>
                                    <p className={`text-[13px] font-bold ${isDone ? "text-slate-500 line-through" : "text-slate-900"}`}>{d.name}</p>
                                    <p className="text-[11px] font-medium text-slate-500">Due: {new Date(d.dueDate).toLocaleDateString()}</p>
                                 </div>
                                 <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded ${isDone ? "bg-slate-100 text-slate-400" : "bg-amber-50 text-amber-600"}`}>{d.status.replace("_", " ")}</span>
                              </div>
                           );
                        })}
                        {engDeliverables.length === 0 && <p className="text-[12px] text-slate-500 mt-2">No specific deliverables uploaded.</p>}
                     </div>
                  </div>
               </div>
            </div>
         );
      })()}
    </div>
  );
}
