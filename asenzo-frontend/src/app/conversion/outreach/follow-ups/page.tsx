"use client";

import React, { useState } from "react";
import { useOutreachOS } from "@/contexts/OutreachOSContext";

export default function OutreachFollowUpsPage() {
  const { nextActions, prospects } = useOutreachOS();
  const [filter, setFilter] = useState("ALL");

  const now = new Date().setHours(0,0,0,0);
  const pendingActions = nextActions.filter(na => na.status === "PENDING" && na.type === "FOLLOW_UP");

  const overdue = pendingActions.filter(na => new Date(na.dueDate).setHours(0,0,0,0) < now);
  const today = pendingActions.filter(na => new Date(na.dueDate).setHours(0,0,0,0) === now);
  const upcoming = pendingActions.filter(na => new Date(na.dueDate).setHours(0,0,0,0) > now);

  const getFilteredList = () => {
     if (filter === "OVERDUE") return overdue;
     if (filter === "TODAY") return today;
     if (filter === "UPCOMING") return upcoming;
     return [...overdue, ...today, ...upcoming].sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  };

  const list = getFilteredList();

  return (
    <div className="pt-8 space-y-6 animate-in fade-in duration-300 px-8 max-w-[1400px] mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight">FOLLOW-UP CENTER</h1>
          <p className="text-[14px] text-slate-500 font-medium mt-1">Never let a prospect fall through the cracks.</p>
        </div>
        
        <div className="flex gap-4">
           <select 
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-[13px] font-bold text-slate-700 bg-white"
           >
              <option value="ALL">All Follow-ups</option>
              <option value="OVERDUE">Overdue</option>
              <option value="TODAY">Due Today</option>
              <option value="UPCOMING">Upcoming</option>
           </select>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
         <div 
            onClick={() => setFilter("OVERDUE")}
            className={`bg-white border rounded-2xl p-5 cursor-pointer transition-colors ${filter === 'OVERDUE' ? 'border-red-400 bg-red-50/30' : 'border-slate-200 hover:border-slate-300'}`}
         >
            <h3 className="text-[11px] font-black text-red-500 uppercase tracking-widest mb-1">Overdue</h3>
            <div className={`text-[32px] font-black leading-none ${filter === 'OVERDUE' ? 'text-red-700' : 'text-slate-900'}`}>{overdue.length}</div>
         </div>
         <div 
            onClick={() => setFilter("TODAY")}
            className={`bg-white border rounded-2xl p-5 cursor-pointer transition-colors ${filter === 'TODAY' ? 'border-amber-400 bg-amber-50/30' : 'border-slate-200 hover:border-slate-300'}`}
         >
            <h3 className="text-[11px] font-black text-amber-500 uppercase tracking-widest mb-1">Due Today</h3>
            <div className={`text-[32px] font-black leading-none ${filter === 'TODAY' ? 'text-amber-700' : 'text-slate-900'}`}>{today.length}</div>
         </div>
         <div 
            onClick={() => setFilter("UPCOMING")}
            className={`bg-white border rounded-2xl p-5 cursor-pointer transition-colors ${filter === 'UPCOMING' ? 'border-blue-400 bg-blue-50/30' : 'border-slate-200 hover:border-slate-300'}`}
         >
            <h3 className="text-[11px] font-black text-blue-500 uppercase tracking-widest mb-1">Upcoming</h3>
            <div className={`text-[32px] font-black leading-none ${filter === 'UPCOMING' ? 'text-blue-700' : 'text-slate-900'}`}>{upcoming.length}</div>
         </div>
         <div 
            onClick={() => setFilter("ALL")}
            className={`bg-white border rounded-2xl p-5 cursor-pointer transition-colors ${filter === 'ALL' ? 'border-slate-400 bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}
         >
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Pipeline</h3>
            <div className="text-[32px] font-black text-slate-900 leading-none">{pendingActions.length}</div>
         </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest w-[280px]">Prospect</th>
                  <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Follow-up Notes</th>
                  <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest w-[160px]">Due Date</th>
                  <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest text-center w-[120px]">Channel</th>
                  <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest text-right">Actions</th>
               </tr>
            </thead>
            <tbody>
               {list.map(na => {
                  const p = prospects.find(p => p.id === na.prospectId);
                  const isOverdue = new Date(na.dueDate).setHours(0,0,0,0) < now;
                  
                  return (
                     <tr key={na.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                           <div className="font-black text-[14px] text-slate-900">
                              {p?.firstName} {p?.lastName}
                           </div>
                           <div className="text-[12px] font-bold text-slate-500 mt-0.5">{p?.company}</div>
                        </td>
                        <td className="p-4">
                           <div className="text-[13px] font-bold text-slate-800">{na.title}</div>
                           <div className="text-[12px] font-medium text-slate-500 mt-0.5">{na.description}</div>
                        </td>
                        <td className="p-4">
                           <div className={`text-[13px] font-bold ${isOverdue ? 'text-red-600' : 'text-slate-800'}`}>
                              {new Date(na.dueDate).toLocaleDateString()}
                           </div>
                           {isOverdue && (
                              <div className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-0.5">Overdue</div>
                           )}
                        </td>
                        <td className="p-4 text-center">
                           <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 rounded text-[10px] font-bold tracking-wider">
                              {na.channel}
                           </span>
                        </td>
                        <td className="p-4 text-right">
                           <div className="flex items-center justify-end gap-2">
                              <button className="px-3 py-1.5 bg-transparent border border-slate-200 text-slate-600 rounded text-[11px] font-bold hover:bg-slate-50 transition-colors">
                                 Skip
                              </button>
                              <button className="px-3 py-1.5 bg-transparent border border-slate-200 text-slate-600 rounded text-[11px] font-bold hover:bg-slate-50 transition-colors">
                                 Reschedule
                              </button>
                              <button className="px-3 py-1.5 bg-slate-900 text-white rounded text-[11px] font-bold hover:bg-slate-800 transition-colors shadow-sm">
                                 Mark Done
                              </button>
                           </div>
                        </td>
                     </tr>
                  );
               })}
               {list.length === 0 && (
                  <tr>
                     <td colSpan={5} className="p-12 text-center">
                        <h4 className="text-[15px] font-black text-slate-900 mb-2">You're all caught up.</h4>
                        <p className="text-[14px] text-slate-500 font-medium max-w-md mx-auto">
                           No follow-ups match your current filter. Keep prospecting!
                        </p>
                     </td>
                  </tr>
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
}
