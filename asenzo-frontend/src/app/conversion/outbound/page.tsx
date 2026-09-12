"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ACTION_MAP } from "@/lib/routing";

export default function OutboundWorkspace() {
  const [isFindingLeads, setIsFindingLeads] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [searchParams, setSearchParams] = useState({
     industry: "",
     role: "",
     companySize: "",
     location: "",
     revenueRange: "",
     problemSignal: "",
     numberOfRecords: 50
  });

  const handleSearch = (e: React.FormEvent) => {
     e.preventDefault();
     setHasSearched(true);
  };

  return (
    <div className="p-6 md:p-10 lg:p-12 pb-32 max-w-[1400px] mx-auto space-y-8 relative">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-[20px] font-bold text-foreground tracking-tight">Outbound Prospecting</h1>
           <p className="text-[12px] text-muted-foreground mt-1">Discover leads, analyze context, inject personalization, and send.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-slate-100 text-slate-700 text-[11px] font-bold uppercase tracking-widest rounded-lg hover:bg-slate-200 transition-colors">
              [Import Leads]
           </button>
           <button onClick={() => {setIsFindingLeads(true); setHasSearched(false);}} className="px-4 py-2 bg-slate-900 text-white text-[11px] font-bold uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity">
              [Find Leads]
           </button>
        </div>
      </div>

      {isFindingLeads && (
         <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
               <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                  <h2 className="text-[16px] font-bold text-slate-900">Find Leads</h2>
                  <button onClick={() => setIsFindingLeads(false)} className="text-slate-400 hover:text-slate-600">
                     <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
               </div>
               
               <div className="p-6 overflow-y-auto flex-1">
                  {!hasSearched ? (
                     <form id="find-leads-form" onSubmit={handleSearch} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-500 uppercase">Industry</label>
                              <input required value={searchParams.industry} onChange={e => setSearchParams({...searchParams, industry: e.target.value})} placeholder="e.g. B2B SaaS" className="w-full border border-slate-200 rounded p-2 text-[13px] bg-slate-50 focus:bg-white" />
                           </div>
                           <div className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-500 uppercase">Role</label>
                              <input required value={searchParams.role} onChange={e => setSearchParams({...searchParams, role: e.target.value})} placeholder="e.g. VP Sales, CRO" className="w-full border border-slate-200 rounded p-2 text-[13px] bg-slate-50 focus:bg-white" />
                           </div>
                           <div className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-500 uppercase">Company Size</label>
                              <input required value={searchParams.companySize} onChange={e => setSearchParams({...searchParams, companySize: e.target.value})} placeholder="e.g. 50-200 employees" className="w-full border border-slate-200 rounded p-2 text-[13px] bg-slate-50 focus:bg-white" />
                           </div>
                           <div className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-500 uppercase">Location</label>
                              <input required value={searchParams.location} onChange={e => setSearchParams({...searchParams, location: e.target.value})} placeholder="e.g. North America, UK" className="w-full border border-slate-200 rounded p-2 text-[13px] bg-slate-50 focus:bg-white" />
                           </div>
                           <div className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-500 uppercase">Revenue Range</label>
                              <input value={searchParams.revenueRange} onChange={e => setSearchParams({...searchParams, revenueRange: e.target.value})} placeholder="e.g. $5M-$20M" className="w-full border border-slate-200 rounded p-2 text-[13px] bg-slate-50 focus:bg-white" />
                           </div>
                           <div className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-500 uppercase">Problem / Signal</label>
                              <input required value={searchParams.problemSignal} onChange={e => setSearchParams({...searchParams, problemSignal: e.target.value})} placeholder="e.g. Recruited sales team last 3 months" className="w-full border border-slate-200 rounded p-2 text-[13px] bg-slate-50 focus:bg-white" />
                           </div>
                        </div>

                        <div className="space-y-1 pt-2">
                           <label className="text-[11px] font-bold text-slate-500 uppercase mb-2 block">Number of Leads</label>
                           <div className="flex gap-3">
                              {[25, 50, 100].map(num => (
                                 <button 
                                    key={num} type="button" 
                                    onClick={() => setSearchParams({...searchParams, numberOfRecords: num})}
                                    className={`flex-1 py-2 border rounded-lg text-[13px] font-bold transition-all ${
                                       searchParams.numberOfRecords === num ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                    }`}
                                 >
                                    {num}
                                 </button>
                              ))}
                           </div>
                        </div>
                     </form>
                  ) : (
                     <div className="py-12 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                           <span className="material-symbols-outlined text-[32px] text-slate-400">link_off</span>
                        </div>
                        <h3 className="text-[16px] font-bold text-slate-900 mb-2">Integration Not Connected</h3>
                        <p className="text-[13px] text-slate-500 max-w-md mx-auto mb-6">
                           The backend automation integration required to pull "{searchParams.industry}" leads matching the specified signals is not currently authenticated.
                        </p>
                        <button onClick={() => setHasSearched(false)} className="px-4 py-2 border border-slate-200 text-slate-700 bg-white rounded text-[12px] font-bold shadow-sm hover:bg-slate-50">
                           Edit Configuration
                        </button>
                     </div>
                  )}
               </div>

               {!hasSearched && (
                  <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end shrink-0 gap-2">
                     <button type="button" onClick={() => setIsFindingLeads(false)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-[12px] font-bold rounded hover:bg-slate-50">Cancel</button>
                     <button type="submit" form="find-leads-form" className="px-5 py-2 bg-slate-900 text-white text-[12px] font-bold rounded shadow hover:bg-slate-800">
                        Find Leads
                     </button>
                  </div>
               )}
            </div>
         </div>
      )}

      <div className="bg-card border border-border rounded-[12px] overflow-hidden shadow-sm">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 border-b border-border">
                     <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Prospect</th>
                     <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">ICP Fit</th>
                     <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap w-[250px]">Problem Identified</th>
                     <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Research & Analysis</th>
                     <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Message Status</th>
                     <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border">
                  {[
                     { name: "Sarah Connor", company: "Cyberdyne Systems", fit: "High", problem: "High turnover in engineering observed via LinkedIn.", research: "COMPLETE", msgStatus: "READY" },
                     { name: "John Smith", company: "Acme Corp", fit: "High", problem: "Competitor just secured series B.", research: "COMPLETE", msgStatus: "SENT" },
                     { name: "Emily Chen", company: "Stark Ind.", fit: "Medium", problem: "Slow product launch integration.", research: "ANALYZING", msgStatus: "PENDING" },
                  ].map((row, idx) => (
                     <tr key={idx} className="hover:bg-muted/10 transition-colors">
                        <td className="px-5 py-4">
                           <p className="text-[14px] font-bold text-foreground leading-tight">{row.name}</p>
                           <p className="text-[12px] text-muted-foreground font-medium mt-0.5">{row.company}</p>
                        </td>
                        <td className="px-5 py-4">
                           <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                              row.fit === 'High' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-700'
                           }`}>{row.fit} Fit</span>
                        </td>
                        <td className="px-5 py-4 text-[12px] text-slate-700 font-medium">
                           {row.problem}
                        </td>
                        <td className="px-5 py-4">
                           <span className={`text-[10px] uppercase font-bold tracking-widest ${
                              row.research === 'COMPLETE' ? 'text-emerald-600' : 'text-blue-600'
                           }`}>
                              {row.research}
                           </span>
                        </td>
                        <td className="px-5 py-4">
                           <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                               row.msgStatus === 'SENT' ? 'bg-slate-900 text-white' :
                               row.msgStatus === 'READY' ? 'bg-emerald-100 text-emerald-800' :
                               'bg-slate-100 text-slate-500'
                           }`}>
                              {row.msgStatus}
                           </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                           {row.msgStatus === 'SENT' ? (
                              <Link href={ACTION_MAP.openConversionInbox()} className="inline-flex px-3 py-1.5 border border-slate-200 rounded bg-slate-50 text-[10px] font-bold text-slate-700 uppercase tracking-widest items-center gap-1 hover:bg-slate-100">
                                 Open Conversation
                              </Link>
                           ) : row.msgStatus === 'READY' ? (
                              <div className="flex gap-2 justify-end">
                                 <button className="text-[10px] font-bold text-slate-700 uppercase tracking-widest border border-slate-200 px-3 py-1.5 rounded hover:bg-slate-50 bg-white">Review</button>
                                 <button className="text-[10px] font-bold text-white uppercase tracking-widest bg-emerald-600 border-none px-3 py-1.5 rounded hover:bg-emerald-700 shadow-sm">Send</button>
                              </div>
                           ) : (
                              <button disabled className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1.5">Processing...</button>
                           )}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
