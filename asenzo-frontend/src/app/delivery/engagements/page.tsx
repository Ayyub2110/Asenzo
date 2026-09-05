"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useDeliveryOS } from "@/contexts/DeliveryOSContext";

export default function EngagementsPage() {
  const { engagements, clients } = useDeliveryOS();
  const [statusFilter, setStatusFilter] = useState("ACTIVE");

  const filtered = engagements.filter(e => {
     if(statusFilter !== "ALL" && e.status !== statusFilter) return false;
     return true;
  });

  return (
    <div className="pt-8 space-y-6 animate-in fade-in duration-300 px-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight flex items-center gap-2">
            ACTIVE ENGAGEMENTS
          </h1>
          <p className="text-[14px] text-slate-500 font-medium max-w-2xl mt-1">
            Monitor all ongoing projects, timelines, and resourcing.
          </p>
        </div>
        
        <div className="flex gap-4">
           <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[13px] font-bold text-slate-700 outline-none"
           >
              <option value="ALL">All Statuses</option>
              <option value="PLANNED">Planned</option>
              <option value="ONBOARDING">Onboarding</option>
              <option value="ACTIVE">Active</option>
              <option value="PAUSED">Paused</option>
              <option value="COMPLETING">Completing</option>
              <option value="COMPLETED">Completed</option>
           </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Engagement Name</th>
                  <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Client</th>
                  <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest text-center">Status</th>
                  <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Timeline</th>
                  <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest text-right">Owner</th>
               </tr>
            </thead>
            <tbody>
               {filtered.map(e => {
                  const customerName = clients.find(c => c.id === e.customerId)?.company || "Unknown";
                  return (
                    <tr key={e.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                       <td className="p-4">
                          <div className="font-black text-[14px] text-slate-900">{e.name}</div>
                          <div className="text-[12px] font-medium text-slate-500 mt-0.5">{e.offer}</div>
                       </td>
                       <td className="p-4">
                          <span className="text-[14px] font-bold text-slate-700">{customerName}</span>
                       </td>
                       <td className="p-4 text-center">
                          <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase rounded ${
                             e.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' :
                             e.status === 'PAUSED' ? 'bg-amber-100 text-amber-800' :
                             'bg-slate-100 text-slate-800'
                          }`}>
                             {e.status.replace("_", " ")}
                          </span>
                       </td>
                       <td className="p-4">
                          <div className="text-[12px] font-bold text-slate-700">
                            {new Date(e.startDate).toLocaleDateString()} - {e.endDate ? new Date(e.endDate).toLocaleDateString() : 'Ongoing'}
                          </div>
                       </td>
                       <td className="p-4 text-right">
                          <span className="text-[13px] font-bold text-slate-700">{e.owner}</span>
                       </td>
                    </tr>
                  )
               })}
               {filtered.length === 0 && (
                  <tr>
                     <td colSpan={5} className="p-8 text-center text-slate-500 font-medium text-[14px] border-dashed border-2 border-slate-100 m-4 rounded-xl">
                        No engagements found matching the criteria.
                     </td>
                  </tr>
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
}
