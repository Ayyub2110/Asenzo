"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useDeliveryOS } from "@/contexts/DeliveryOSContext";

export default function OnboardingPipelinePage() {
  const { onboardings, clients } = useDeliveryOS();
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = onboardings.filter(o => {
     if(statusFilter !== "ALL" && o.status !== statusFilter) return false;
     return true;
  });

  return (
    <div className="pt-8 space-y-6 animate-in fade-in duration-300 px-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight flex items-center gap-2">
            ONBOARDING PIPELINE
          </h1>
          <p className="text-[14px] text-slate-500 font-medium max-w-2xl mt-1">
            Track client handoffs, kickoff calls, and setup stages.
          </p>
        </div>
        
        <div className="flex gap-4">
           <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[13px] font-bold text-slate-700 outline-none"
           >
              <option value="ALL">All Stages</option>
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="PAUSED">Paused</option>
           </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest w-[250px]">Client / Offer</th>
                  <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Progress</th>
                  <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest text-center">Status</th>
                  <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest text-right">Owner</th>
               </tr>
            </thead>
            <tbody>
               {filtered.map(o => {
                  const customerName = clients.find(c => c.id === o.customerId)?.company || "Unknown";
                  return (
                    <tr key={o.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                       <td className="p-4">
                          <div className="font-black text-[14px] text-slate-900">{customerName}</div>
                          <div className="text-[12px] font-medium text-slate-500 mt-0.5">{o.offer}</div>
                       </td>
                       <td className="p-4">
                          <div className="w-full max-w-[200px]">
                              <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1.5">
                                 <span>{o.progress}%</span>
                                 <span>{o.targetCompletionDate ? `Target: ${new Date(o.targetCompletionDate).toLocaleDateString()}` : 'No target date'}</span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-2">
                                 <div className={`h-2 rounded-full ${o.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(100, Math.max(0, o.progress))}%` }}></div>
                              </div>
                          </div>
                          {o.blockers && <div className="mt-2 text-[11px] font-bold text-red-600 bg-red-50 p-1.5 rounded inline-block"><span className="material-symbols-outlined text-[12px] mr-1 align-sub">warning</span>Blocker: {o.blockers}</div>}
                       </td>
                       <td className="p-4 text-center">
                          <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase rounded ${
                             o.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                             o.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                             'bg-slate-100 text-slate-800'
                          }`}>
                             {o.status.replace("_", " ")}
                          </span>
                       </td>
                       <td className="p-4 text-right">
                          <span className="text-[13px] font-bold text-slate-700">{o.owner}</span>
                       </td>
                    </tr>
                  )
               })}
               {filtered.length === 0 && (
                  <tr>
                     <td colSpan={4} className="p-8 text-center text-slate-500 font-medium text-[14px] border-dashed border-2 border-slate-100 m-4 rounded-xl">
                        No onboarding processes found.
                     </td>
                  </tr>
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
}
