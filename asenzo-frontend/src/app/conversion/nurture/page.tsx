"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Lead } from "@/lib/types/conversion";

export default function NurtureNotReadyWorkspace() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/conversion/leads")
      .then(r => r.json())
      .then(data => {
        // Assume anything unqualified or parked due to timing is nurture
        setLeads(data.filter((l: Lead) => l.qualificationStatus !== "QUALIFIED" && l.temperature !== "HOT") || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Not Ready Nurture</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Potentially valuable leads blocked by timing, budget, or trust—requiring long-term follow-up.</p>
        </div>
        <div className="flex items-center gap-2">
           <Link href="/conversion/nurture/lost" className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-[11px] rounded-lg">Lost Opportunities</Link>
           <Link href="/conversion/nurture/reactivation" className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-[11px] rounded-lg">Reactivation Queue</Link>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-4">
           {isLoading ? (
             <div className="p-8 text-[12px] text-slate-500 text-center">Loading Nurture Queue...</div>
           ) : leads.length === 0 ? (
             <div className="bg-white border text-center p-12 border-slate-200 rounded-xl shadow-sm">
               <span className="material-symbols-outlined text-[32px] text-slate-300 mb-2">hotel</span>
               <h3 className="text-[14px] font-bold text-slate-700">No leads in Nurture.</h3>
               <p className="text-[12px] text-slate-500 mt-1">If a lead isn't ready to buy during qualification, mark them as 'Not Ready' to park them here.</p>
             </div>
           ) : (
             <div className="space-y-4">
               {leads.map(l => (
                 <div key={l.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between group hover:border-slate-300 transition-colors">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 font-bold text-[10px] rounded uppercase bg-amber-50 text-amber-600">
                           TIMING ISSUE
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500">Last Touch: 14 days ago</span>
                      </div>
                      <h3 className="text-[14px] font-bold text-slate-900">{l.name}</h3>
                      <p className="text-[12px] text-slate-500 mt-0.5">Problem: {l.problem}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg">Draft Nurture Draft</button>
                      <button className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] rounded-lg">Schedule Review</button>
                    </div>
                 </div>
               ))}
             </div>
           )}
        </div>
        
        <div className="col-span-4 space-y-4">
           <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Nurture Pipeline</h3>
              <div className="text-[28px] font-bold text-slate-900 leading-none">
                 {leads.length} Leads
              </div>
              <p className="text-[11px] text-slate-500 mt-2">Dormant capital awaiting reactivation through scheduled outreach and content drops.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
