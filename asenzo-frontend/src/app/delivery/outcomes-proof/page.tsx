"use client";

import React, { useState } from "react";
import { useDeliveryOS } from "@/contexts/DeliveryOSContext";

export default function OutcomesProofPage() {
  const { clients, engagements } = useDeliveryOS();
  const [activeTab, setActiveTab] = useState<"Outcomes" | "Proof">("Outcomes");

  return (
    <div className="pt-8 pb-32 space-y-10 animate-in fade-in duration-300 px-8 relative h-full">
      {/* Header */}
      <div className="flex items-start justify-between">
         <div>
            <h1 className="text-[24px] font-black tracking-tight text-slate-900">Outcomes & Proof</h1>
            <p className="text-[14px] text-slate-500 font-medium mt-1">Track promised results and document verified proof assets.</p>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-8">
        <button
          onClick={() => setActiveTab("Outcomes")}
          className={`py-3 text-[13px] font-bold border-b-2 transition-all ${
            activeTab === "Outcomes" ? "border-slate-900 text-slate-900" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Active Outcomes
        </button>
        <button
          onClick={() => setActiveTab("Proof")}
          className={`py-3 text-[13px] font-bold border-b-2 transition-all ${
            activeTab === "Proof" ? "border-slate-900 text-slate-900" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Proof Library
        </button>
      </div>

      {activeTab === "Outcomes" ? (
        <div className="space-y-6">
           {/* Outcomes Content */}
           <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <th className="px-6 py-4">Client</th>
                        <th className="px-6 py-4">Outcome</th>
                        <th className="px-6 py-4">Baseline</th>
                        <th className="px-6 py-4">Current</th>
                        <th className="px-6 py-4">Target</th>
                        <th className="px-6 py-4">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {engagements.map((e) => {
                        const client = clients.find(c => c.id === e.clientId);
                        if (!client) return null;
                        
                        return (
                           <tr key={e.id} className="hover:bg-slate-50 cursor-pointer transition-colors">
                              <td className="px-6 py-4">
                                 <div className="text-[13px] font-black text-slate-900">{client.name}</div>
                                 <div className="text-[11px] font-medium text-slate-500">{e.name}</div>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="text-[13px] font-bold text-slate-700">{client.salesContext?.promisedOutcome || "Not specified"}</div>
                              </td>
                              <td className="px-6 py-4 text-[13px] font-medium text-slate-600">
                                 — 
                              </td>
                              <td className="px-6 py-4 text-[13px] font-bold text-slate-900">
                                 — 
                              </td>
                              <td className="px-6 py-4 text-[13px] font-medium text-slate-600">
                                 — 
                              </td>
                              <td className="px-6 py-4">
                                 <span className="text-[12px] font-bold text-slate-500">Not Updated</span>
                              </td>
                           </tr>
                        );
                     })}
                     {engagements.length === 0 && (
                        <tr>
                           <td colSpan={6} className="px-6 py-8 text-center text-slate-500 text-[13px] font-bold">No active outcomes to track.</td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
        </div>
      ) : (
        <div className="space-y-6">
           {/* Proof Content */}
           <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <th className="px-6 py-4">Title</th>
                        <th className="px-6 py-4">Client</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Date</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500 text-[13px] font-bold">No proof assets generated yet.</td>
                     </tr>
                  </tbody>
               </table>
            </div>
        </div>
      )}

    </div>
  );
}
