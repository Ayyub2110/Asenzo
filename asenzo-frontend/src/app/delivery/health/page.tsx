"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useConversionOS } from "@/contexts/ConversionOSContext"; // Reusing state for prototype

// Mock extension of lead to "Client" logic
type ClientHealth = "EXCELLENT" | "GOOD" | "AT_RISK" | "CRITICAL";
type EngagementStatus = "ACTIVE" | "ON_HOLD" | "ENDING" | "CHURNED";

export default function DeliveryDatabase() {
  const { leads, opportunities } = useConversionOS();
  const [activeClient, setActiveClient] = useState<any | null>(null);

  // Derive mock clients from Won Opportunities
  const clients = opportunities
    .filter(o => o.pipelineStage === "CLOSED_WON")
    .map(opp => {
       const lead = leads.find(l => l.id === opp.leadId);
       return {
          id: opp.id,
          lead,
          clientName: lead?.company || lead?.name || "Unknown",
          contact: lead?.name || "Unknown",
          mrr: opp.estimatedValue,
          status: "ACTIVE" as EngagementStatus,
          health: opp.estimatedValue > 3000 ? "EXCELLENT" : "GOOD",
          nps: Math.floor(Math.random() * 4) + 7,
          currentPhase: "Execution",
          nextMilestone: "Q4 Review",
          milestoneDate: "12 Days"
       }
    });

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Client Database & Health</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Unified view of active engagements, deliverables, milestones, and account health.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 border border-slate-200 bg-white text-slate-700 text-[11px] font-bold uppercase tracking-widest rounded-lg hover:bg-slate-50 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">filter_list</span>
              Filter
           </button>
        </div>
      </div>

      {/* OVERALL HEALTH STATS */}
      <div className="grid grid-cols-4 gap-4">
         <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Accounts</p>
               <p className="text-[20px] font-bold text-slate-900">{clients.length}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
               <span className="material-symbols-outlined">business</span>
            </div>
         </div>
         <div className="bg-white border border-emerald-200 shadow-emerald-50 rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Health Score Avg</p>
               <p className="text-[20px] font-bold text-emerald-700">92/100</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
               <span className="material-symbols-outlined">monitor_heart</span>
            </div>
         </div>
         <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Average NPS</p>
               <p className="text-[20px] font-bold text-slate-900">8.4</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center text-violet-500">
               <span className="material-symbols-outlined">thumbs_up_down</span>
            </div>
         </div>
         <div className="bg-white border border-amber-200 shadow-amber-50 rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Accounts At Risk</p>
               <p className="text-[20px] font-bold text-amber-700">0</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
               <span className="material-symbols-outlined">warning</span>
            </div>
         </div>
      </div>

      {/* CLIENT TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden text-[12px]">
         <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
               <tr>
                  <th className="px-5 py-3">Client</th>
                  <th className="px-5 py-3">Engagement</th>
                  <th className="px-5 py-3">Health & NPS</th>
                  <th className="px-5 py-3">Next Milestone</th>
                  <th className="px-5 py-3 text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                     <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase">
                              {client.clientName.substring(0, 2)}
                           </div>
                           <div>
                              <div className="font-bold text-slate-900 cursor-pointer hover:underline" onClick={() => setActiveClient(client)}>{client.clientName}</div>
                              <div className="text-slate-500 text-[11px]">{client.contact}</div>
                           </div>
                        </div>
                     </td>
                     <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 mb-1">
                           <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                           <span className="font-bold text-slate-700">{client.status}</span>
                        </div>
                        <div className="text-slate-500 font-medium">${(client.mrr/1000).toFixed(1)}k MRR</div>
                     </td>
                     <td className="px-5 py-4">
                        <div className="flex items-center gap-2 mb-1">
                           <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${
                              client.health === "EXCELLENT" ? "bg-emerald-100 text-emerald-700" :
                              client.health === "GOOD" ? "bg-blue-100 text-blue-700" :
                              client.health === "AT_RISK" ? "bg-amber-100 text-amber-700" :
                              "bg-red-100 text-red-700"
                           }`}>
                              {client.health}
                           </span>
                        </div>
                        <span className="text-slate-500 font-medium">NPS: {client.nps}</span>
                     </td>
                     <td className="px-5 py-4">
                        <div className="font-bold text-slate-800">{client.nextMilestone}</div>
                        <div className="text-slate-500">{client.milestoneDate}</div>
                     </td>
                     <td className="px-5 py-4 text-right">
                        <button onClick={() => setActiveClient(client)} className="px-3 py-1.5 border border-slate-200 text-slate-600 font-bold uppercase tracking-widest text-[10px] rounded hover:bg-slate-100 transition-colors">
                           View Profile
                        </button>
                     </td>
                  </tr>
               ))}
               {clients.length === 0 && (
                  <tr>
                     <td colSpan={5} className="py-12 text-center text-slate-500 font-medium">
                        No active clients found. Move deals to CLOSED WON in the Pipeline.
                     </td>
                  </tr>
               )}
            </tbody>
         </table>
      </div>

      {/* TASKS 14/15/16: UNIFIED CLIENT HEALTH PROFILE */}
      {activeClient && (
         <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm">
            <div className="w-[800px] bg-slate-50 h-full shadow-2xl flex flex-col animate-slide-in-right overflow-hidden">
               {/* Header */}
               <div className="p-6 bg-white border-b border-slate-200 flex items-start justify-between shrink-0">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[16px] font-bold text-slate-500 uppercase">
                        {activeClient.clientName.substring(0, 2)}
                     </div>
                     <div>
                        <h2 className="text-[24px] font-bold text-slate-900 tracking-tight">{activeClient.clientName}</h2>
                        <div className="flex items-center gap-3 mt-1">
                           <span className="text-[13px] font-medium text-slate-500">Contact: {activeClient.contact}</span>
                           <span className="text-[10px] text-slate-300">|</span>
                           <span className="text-[13px] font-bold text-emerald-600">${(activeClient.mrr/1000).toFixed(1)}k MRR</span>
                        </div>
                     </div>
                  </div>
                  <button onClick={() => setActiveClient(null)} className="h-[36px] w-[36px] flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-slate-500">
                     <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Health Ribbon (TASK 16) */}
                  <div className="grid grid-cols-3 gap-4">
                     <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Systems Health</span>
                        <div className="flex items-center gap-2">
                           <span className="material-symbols-outlined text-[16px] text-emerald-500">check_circle</span>
                           <span className="text-[14px] font-bold text-slate-900">Green</span>
                        </div>
                     </div>
                     <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Relationship NPS</span>
                        <div className="flex items-center gap-2">
                           <span className="material-symbols-outlined text-[16px] text-blue-500">favorite</span>
                           <span className="text-[14px] font-bold text-slate-900">{activeClient.nps} Latest Score</span>
                        </div>
                     </div>
                     <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Value Delivered</span>
                        <div className="flex items-center gap-2">
                           <span className="material-symbols-outlined text-[16px] text-violet-500">trending_up</span>
                           <span className="text-[14px] font-bold text-slate-900">On Target</span>
                        </div>
                     </div>
                  </div>

                  {/* Split Layout */}
                  <div className="grid grid-cols-2 gap-6">
                     {/* Engagements & Milestones (TASK 14) */}
                     <div className="space-y-4">
                        <h3 className="text-[12px] font-bold text-slate-800 uppercase tracking-widest pb-2 border-b border-slate-200">Active Engagement</h3>
                        <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
                           <div className="p-4 border-b border-slate-100">
                              <div className="flex justify-between items-start mb-1">
                                 <span className="font-bold text-slate-900 text-[14px]">Foundation OS Build</span>
                                 <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-bold uppercase rounded tracking-widest">Active</span>
                              </div>
                              <p className="text-[12px] text-slate-500">3 Month Accelerator</p>
                           </div>
                           <div className="p-4 space-y-4">
                              <div>
                                 <div className="flex justify-between text-[11px] font-bold mb-1">
                                    <span className="text-slate-700">Project Completion</span>
                                    <span className="text-blue-600">65%</span>
                                 </div>
                                 <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[65%] rounded-full"></div>
                                 </div>
                              </div>
                              
                              <div>
                                 <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Milestones</h4>
                                 <ul className="space-y-2">
                                    <li className="flex items-center gap-2 text-[12px] text-slate-700">
                                       <span className="material-symbols-outlined text-[14px] text-emerald-500">check_circle</span>
                                       Infrastructure Repo Validated
                                    </li>
                                    <li className="flex items-center gap-2 text-[12px] text-slate-700 font-bold">
                                       <span className="w-3.5 h-3.5 rounded-full border-2 border-blue-500 flex items-center justify-center bg-blue-50"></span>
                                       Acquisition Funnel Build
                                    </li>
                                    <li className="flex items-center gap-2 text-[12px] text-slate-400">
                                       <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-200"></span>
                                       Launch QA
                                    </li>
                                 </ul>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Deliverables (TASK 15) */}
                     <div className="space-y-4">
                        <h3 className="text-[12px] font-bold text-slate-800 uppercase tracking-widest pb-2 border-b border-slate-200">Deliverables & Assets</h3>
                        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4 space-y-3">
                           <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg group cursor-pointer hover:border-slate-300">
                              <div className="flex items-center gap-3">
                                 <span className="material-symbols-outlined text-[18px] text-slate-400">description</span>
                                 <div>
                                    <p className="text-[12px] font-bold text-slate-900">Brand Architecture Doc</p>
                                    <p className="text-[10px] text-slate-500">Approved • Oct 1st</p>
                                 </div>
                              </div>
                              <span className="material-symbols-outlined text-[16px] text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
                           </div>
                           <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg group cursor-pointer hover:border-slate-300">
                              <div className="flex items-center gap-3">
                                 <span className="material-symbols-outlined text-[18px] text-slate-400">design_services</span>
                                 <div>
                                    <p className="text-[12px] font-bold text-slate-900">Figma Master Files</p>
                                    <p className="text-[10px] text-slate-500">V2 Revisions • In Progress</p>
                                 </div>
                              </div>
                              <span className="material-symbols-outlined text-[16px] text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
                           </div>
                           <button className="w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-[11px] font-bold text-slate-500 uppercase tracking-widest hover:border-slate-300 hover:text-slate-700 transition-colors">
                              + Upload Deliverable
                           </button>
                        </div>

                        {/* Recent Outcomes */}
                        <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg shadow-sm p-4 mt-4">
                           <h4 className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-3">Tracked Outcomes (Proof)</h4>
                           <div className="space-y-2">
                              <div className="flex justify-between items-center text-[12px]">
                                 <span className="font-semibold text-slate-700">Cost Per Acquisition</span>
                                 <span className="font-bold text-emerald-700">-22%</span>
                              </div>
                              <div className="flex justify-between items-center text-[12px]">
                                 <span className="font-semibold text-slate-700">Lead Volume</span>
                                 <span className="font-bold text-emerald-700">+14%</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
