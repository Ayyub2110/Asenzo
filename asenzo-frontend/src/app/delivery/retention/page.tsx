"use client";

import React from "react";
import { useDeliveryOS } from "@/contexts/DeliveryOSContext";

export default function RetentionPage() {
  const { clients } = useDeliveryOS();

  // Sort by age (simulated by onboardedDate) to determine renewal priority
  const activeClients = clients.filter(c => c.status === "ACTIVE")
    .sort((a,b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  return (
    <div className="pt-8 space-y-6 animate-in fade-in duration-300 px-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight flex items-center gap-2">
            RENEWAL PIPELINE & RETENTION
          </h1>
          <p className="text-[14px] text-slate-500 font-medium max-w-2xl mt-1">
            Proactively track accounts nearing engagement completion for upsell or renewal.
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest w-[250px]">Client</th>
                  <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Time in System</th>
                  <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest text-center">Status</th>
                  <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest text-right">Expansion Opportunity</th>
               </tr>
            </thead>
            <tbody>
               {activeClients.map(c => {
                  const daysSinceOnboard = Math.floor((new Date().getTime() - new Date(c.startDate).getTime()) / (1000 * 3600 * 24));
                  const isNearingRenewal = daysSinceOnboard > 60; // Mock threshold 

                  return (
                    <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                       <td className="p-4">
                          <div className="font-black text-[14px] text-slate-900">{c.company}</div>
                          <div className="text-[12px] font-medium text-slate-500 mt-0.5">Owner: {c.owner}</div>
                       </td>
                       <td className="p-4">
                          <div className="text-[14px] font-bold text-slate-700">{daysSinceOnboard} Days</div>
                       </td>
                       <td className="p-4 text-center">
                          <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase rounded ${
                             isNearingRenewal ? 'bg-amber-100 text-amber-800' :
                             'bg-emerald-100 text-emerald-800'
                          }`}>
                             {isNearingRenewal ? 'RENEWAL WINDOW' : 'ENGAGED'}
                          </span>
                       </td>
                       <td className="p-4 text-right">
                          <button className="px-3 py-1.5 border border-slate-200 text-slate-700 rounded text-[11px] font-bold transition-all hover:bg-slate-100 shadow-sm">
                             Log Pitch
                          </button>
                       </td>
                    </tr>
                  )
               })}
               {activeClients.length === 0 && (
                  <tr>
                     <td colSpan={4} className="p-8 text-center text-slate-500 font-medium text-[14px] border-dashed border-2 border-slate-100 m-4 rounded-xl">
                        No active clients available for retention analysis.
                     </td>
                  </tr>
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
}
