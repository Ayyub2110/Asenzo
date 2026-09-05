"use client";

import React, { useState } from "react";
import { useDeliveryOS } from "@/contexts/DeliveryOSContext";

export default function DeliverablesPage() {
  const { deliverables, engagements, clients } = useDeliveryOS();
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = deliverables.filter(d => {
     if(statusFilter !== "ALL" && d.status !== statusFilter) return false;
     return true;
  });

  return (
    <div className="pt-8 space-y-6 animate-in fade-in duration-300 px-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight flex items-center gap-2">
            DELIVERABLES & ASSETS
          </h1>
          <p className="text-[14px] text-slate-500 font-medium max-w-2xl mt-1">
            Library of all client-facing assets, documents, tools, and project outputs.
          </p>
        </div>
        
        <div className="flex gap-4">
           <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[13px] font-bold text-slate-700 outline-none"
           >
              <option value="ALL">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="CHANGES_REQUESTED">Revision Required</option>
              <option value="DELIVERED">Delivered</option>
           </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Asset Name & Type</th>
                  <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Client & Engagement</th>
                  <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest text-center">Status</th>
                  <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Due/Delivered</th>
               </tr>
            </thead>
            <tbody>
               {filtered.map(d => {
                  const engagement = engagements.find(e => e.id === d.engagementId);
                  const client = clients.find(c => c.id === engagement?.customerId);
                  const isOverdue = new Date(d.dueDate) < new Date() && d.status !== "DELIVERED";

                  return (
                    <tr key={d.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                       <td className="p-4">
                          <div className="font-black text-[14px] text-slate-900">{d.name}</div>
                          <div className="text-[12px] font-bold text-slate-500 mt-0.5 px-2 py-0.5 bg-slate-100 rounded inline-block">{d.type}</div>
                       </td>
                       <td className="p-4">
                          <div className="text-[13px] font-bold text-slate-800">{client?.company || "Multiple / Template"}</div>
                          <div className="text-[12px] font-medium text-blue-600 mt-0.5">{engagement?.name || "N/A"}</div>
                       </td>
                       <td className="p-4 text-center">
                          <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase rounded ${
                             d.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' :
                             d.status === 'IN_REVIEW' ? 'bg-blue-100 text-blue-800' :
                             d.status === 'CHANGES_REQUESTED' ? 'bg-amber-100 text-amber-800' :
                             'bg-slate-100 text-slate-800'
                          }`}>
                             {d.status.replace("_", " ")}
                          </span>
                       </td>
                       <td className="p-4">
                          <div className={`text-[13px] font-bold ${isOverdue ? 'text-red-500' : 'text-slate-700'}`}>
                             {new Date(d.dueDate).toLocaleDateString()}
                          </div>
                       </td>
                    </tr>
                  )
               })}
               {filtered.length === 0 && (
                  <tr>
                     <td colSpan={4} className="p-8 text-center text-slate-500 font-medium text-[14px] border-dashed border-2 border-slate-100 m-4 rounded-xl">
                        No deliverables found matching the criteria.
                     </td>
                  </tr>
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
}
