"use client";

import React, { useState } from "react";
import { useOutreachOS } from "@/contexts/OutreachOSContext";

export default function OutreachActivitiesPage() {
  const { activities, prospects } = useOutreachOS();
  const [filter, setFilter] = useState("ALL");

  const sorted = [...activities].sort((a,b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
  
  const filtered = sorted.filter(a => {
     if(filter !== "ALL" && a.type !== filter) return false;
     return true;
  });

  return (
    <div className="pt-8 space-y-6 animate-in fade-in duration-300 px-8 max-w-[1400px] mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight">OUTREACH TIMELINE</h1>
          <p className="text-[14px] text-slate-500 font-medium mt-1">Global historical audit of all tracked outbound activity.</p>
        </div>
        <div className="flex items-center gap-3">
           <select 
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-[13px] font-bold text-slate-700 bg-white"
           >
              <option value="ALL">All Activity</option>
              <option value="INITIAL_OUTREACH">Initial Contact</option>
              <option value="FOLLOW_UP">Follow-ups</option>
              <option value="REPLY_RECEIVED">Replies</option>
              <option value="MEETING_BOOKED">Meetings</option>
           </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest w-[180px]">Date</th>
                  <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest w-[200px]">Prospect</th>
                  <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest w-[160px]">Activity Type</th>
                  <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Details</th>
                  <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest w-[140px]">Channel</th>
               </tr>
            </thead>
            <tbody>
               {filtered.map(act => {
                  const prospect = prospects.find(p => p.id === act.prospectId);
                  return (
                     <tr key={act.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                           <div className="font-bold text-[13px] text-slate-900">
                              {new Date(act.occurredAt).toLocaleDateString()}
                           </div>
                           <div className="text-[11px] font-bold text-slate-500 mt-0.5">
                              {new Date(act.occurredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                           </div>
                        </td>
                        <td className="p-4">
                           <div className="font-black text-[14px] text-slate-900">
                              {prospect?.firstName} {prospect?.lastName}
                           </div>
                           <div className="text-[12px] font-medium text-slate-500 mt-0.5">{prospect?.company}</div>
                        </td>
                        <td className="p-4">
                           <span className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded ${
                              act.type === 'INITIAL_OUTREACH' ? 'bg-blue-100 text-blue-800' :
                              act.type === 'FOLLOW_UP' ? 'bg-amber-100 text-amber-800' :
                              act.type === 'REPLY_RECEIVED' ? 'bg-emerald-100 text-emerald-800' :
                              'bg-slate-100 text-slate-800'
                           }`}>
                              {act.type.replace("_", " ")}
                           </span>
                        </td>
                        <td className="p-4">
                           <div className="text-[13px] font-medium text-slate-700">{act.summary}</div>
                           {act.outcome && (
                              <div className="mt-1 flex items-center gap-1.5">
                                 <span className="text-[10px] font-black uppercase text-slate-400">Outcome:</span>
                                 <span className="text-[11px] font-bold text-slate-700">{act.outcome.replace("_", " ")}</span>
                              </div>
                           )}
                        </td>
                        <td className="p-4">
                           <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 rounded text-[10px] font-bold tracking-wider">
                              {act.channel}
                           </span>
                        </td>
                     </tr>
                  );
               })}
               {filtered.length === 0 && (
                  <tr>
                     <td colSpan={5} className="p-12 text-center text-slate-500 font-medium text-[14px]">
                        No activities match the current filter.
                     </td>
                  </tr>
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
}
