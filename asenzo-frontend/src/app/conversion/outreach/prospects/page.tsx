"use client";

import React, { useState } from "react";
import { useOutreachOS } from "@/contexts/OutreachOSContext";

export default function OutreachProspectsPage() {
  const { prospects } = useOutreachOS();
  const [filter, setFilter] = useState("ALL");

  const filtered = prospects.filter(p => {
     if (filter !== "ALL" && p.status !== filter) return false;
     return true;
  });

  return (
    <div className="pt-8 space-y-6 animate-in fade-in duration-300 px-8 max-w-[1400px] mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight">PROSPECTS</h1>
          <p className="text-[14px] text-slate-500 font-medium mt-1">Manage and sequence outbound contacts.</p>
        </div>
        <div className="flex items-center gap-3">
           <select 
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-[13px] font-bold text-slate-700 bg-white"
           >
              <option value="ALL">All Prospects</option>
              <option value="NOT_CONTACTED">Not Contacted</option>
              <option value="CONTACTED">Contacted</option>
              <option value="FOLLOW_UP">Needs Follow-up</option>
              <option value="REPLIED">Replied</option>
              <option value="INTERESTED">Interested</option>
           </select>
           
           <button className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-[13px] font-bold border border-slate-200 hover:bg-slate-200 transition-colors shadow-sm">
              Import CSV
           </button>
           <button className="px-5 py-2.5 bg-slate-900 text-white rounded-lg text-[13px] font-bold hover:bg-slate-800 transition-colors shadow-sm">
              + Add Prospect
           </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest w-[280px]">Prospect</th>
                  <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Company</th>
                  <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest w-[160px]">Channels</th>
                  <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Last Activity</th>
                  <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest text-center">Status</th>
                  <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest text-right">Actions</th>
               </tr>
            </thead>
            <tbody>
               {filtered.map(p => (
                  <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer group">
                     <td className="p-4">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[13px] font-black text-slate-500 shrink-0">
                              {p.firstName[0]}{p.lastName[0]}
                           </div>
                           <div>
                              <div className="font-black text-[14px] text-slate-900 group-hover:text-blue-600 transition-colors">
                                 {p.firstName} {p.lastName}
                              </div>
                              <div className="text-[12px] font-bold text-slate-500 mt-0.5">{p.role}</div>
                           </div>
                        </div>
                     </td>
                     <td className="p-4">
                        <div className="font-bold text-[13px] text-slate-800">{p.company}</div>
                        <div className="text-[11px] font-medium text-slate-500 mt-0.5">{p.website}</div>
                     </td>
                     <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                           {p.channels.map((c, i) => (
                              <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[10px] font-bold tracking-wider">
                                 {c.type}
                              </span>
                           ))}
                        </div>
                     </td>
                     <td className="p-4 text-[13px] font-bold text-slate-700">
                        {p.lastActivityAt ? new Date(p.lastActivityAt).toLocaleDateString() : 'Never'}
                     </td>
                     <td className="p-4 text-center">
                        <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase rounded ${
                           p.status === 'NOT_CONTACTED' ? 'bg-slate-100 text-slate-800' :
                           p.status === 'CONTACTED' ? 'bg-blue-100 text-blue-800' :
                           p.status === 'FOLLOW_UP' ? 'bg-amber-100 text-amber-800' :
                           p.status === 'REPLIED' ? 'bg-purple-100 text-purple-800' :
                           p.status === 'INTERESTED' ? 'bg-emerald-100 text-emerald-800' :
                           'bg-slate-100 text-slate-800'
                        }`}>
                           {p.status.replace("_", " ")}
                        </span>
                     </td>
                     <td className="p-4 text-right">
                        <button className="px-3 py-1.5 bg-slate-900 text-white rounded text-[11px] font-bold hover:bg-slate-800 transition-colors shadow-sm">
                           Log Activity
                        </button>
                     </td>
                  </tr>
               ))}
               {filtered.length === 0 && (
                  <tr>
                     <td colSpan={6} className="p-12 text-center">
                        <h4 className="text-[15px] font-black text-slate-900 mb-2">Your outbound system starts here.</h4>
                        <p className="text-[14px] text-slate-500 font-medium max-w-md mx-auto mb-6">
                           Add prospects manually or import your existing list to begin sequencing your outreach.
                        </p>
                        <div className="flex items-center justify-center gap-3">
                           <button className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-[13px] font-bold hover:bg-slate-200 transition-colors">Import CSV</button>
                           <button className="px-5 py-2.5 bg-slate-900 text-white rounded-lg text-[13px] font-bold hover:bg-slate-800 transition-colors">Add Prospect</button>
                        </div>
                     </td>
                  </tr>
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
}
