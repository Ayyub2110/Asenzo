"use client";

import React, { useState } from "react";
import { useDeliveryOS } from "@/contexts/DeliveryOSContext";

export default function MilestonesPage() {
  const { milestones, engagements } = useDeliveryOS();
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = milestones.filter(m => {
     if(statusFilter !== "ALL" && m.status !== statusFilter) return false;
     return true;
  });

  return (
    <div className="pt-8 space-y-6 animate-in fade-in duration-300 px-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight flex items-center gap-2">
            MILESTONES & WORKFLOWS
          </h1>
          <p className="text-[14px] text-slate-500 font-medium max-w-2xl mt-1">
            Track tactical progression of client deliverables and phases.
          </p>
        </div>
        
        <div className="flex gap-4">
           <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[13px] font-bold text-slate-700 outline-none"
           >
              <option value="ALL">All Statuses</option>
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="BLOCKED">Blocked</option>
              <option value="COMPLETED">Completed</option>
           </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filtered.map(m => {
            const engagementName = engagements.find(e => e.id === m.engagementId)?.name || "Unknown";
            const isOverdue = new Date(m.dueDate) < new Date() && m.status !== "COMPLETED";

            return (
              <div key={m.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-slate-300 transition-colors">
                 <div className="flex justify-between items-start mb-3">
                    <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded ${
                       m.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                       m.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                       m.status === 'BLOCKED' ? 'bg-amber-100 text-amber-800' :
                       'bg-slate-100 text-slate-800'
                    }`}>
                       {m.status.replace("_", " ")}
                    </span>
                    {isOverdue && <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded uppercase">Overdue</span>}
                 </div>
                 
                 <h3 className="text-[16px] font-black text-slate-900 leading-tight mb-1">{m.name}</h3>
                 <p className="text-[12px] font-bold text-blue-600 mb-4">{engagementName}</p>
                 
                 <div className="mb-4">
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1.5">
                       <div className={`h-1.5 rounded-full ${m.progress === 100 ? 'bg-emerald-500' : 'bg-slate-800'}`} style={{ width: `${Math.min(100, Math.max(0, m.progress))}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-500">
                       <span>Progress: {m.progress}%</span>
                       <span className={isOverdue ? 'text-red-500' : ''}>Due: {new Date(m.dueDate).toLocaleDateString()}</span>
                    </div>
                 </div>

                 {m.description && (
                    <p className="text-[12px] text-slate-600 font-medium line-clamp-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                       {m.description}
                    </p>
                 )}
              </div>
            )
         })}
      </div>
      
      {filtered.length === 0 && (
         <div className="p-12 text-center text-slate-500 font-medium text-[14px] bg-white border-dashed border-2 border-slate-200 rounded-xl">
            No milestones found matching the criteria.
         </div>
      )}
    </div>
  );
}
