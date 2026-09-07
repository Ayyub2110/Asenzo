import React from "react";
import Link from "next/link";
import { ACTION_MAP } from "@/lib/routing";

export default function OutboundWorkspace() {
  return (
    <div className="p-6 md:p-10 lg:p-12 pb-32 max-w-[1400px] mx-auto space-y-8">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-[20px] font-bold text-foreground tracking-tight">Outbound Workspace</h1>
           <p className="text-[12px] text-muted-foreground mt-1">Batch import, analyze context, generate personalization, and send.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 border border-border bg-card text-foreground text-[11px] font-bold uppercase tracking-widest rounded-lg hover:bg-muted transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px]">psychology</span>
              Analyze Batch
           </button>
           <button className="px-4 py-2 bg-foreground text-background text-[11px] font-bold uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px]">file_download</span>
              Import Leads
           </button>
        </div>
      </div>

      {/* BATCH SUMMARY STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">
         {[
            { label: "Imported", count: 100, color: "text-slate-500" },
            { label: "Analyzed", count: 72, color: "text-blue-500" },
            { label: "Draft Ready", count: 61, color: "text-amber-500" },
            { label: "Needs Review", count: 8, color: "text-orange-500" },
            { label: "Approved", count: 52, color: "text-emerald-500" },
            { label: "Sent", count: 12, color: "text-violet-500" },
            { label: "Replied", count: 7, color: "text-foreground" }
         ].map(stat => (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-4 flex flex-col justify-between">
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</span>
               <span className={`text-[20px] font-bold ${stat.color}`}>{stat.count}</span>
            </div>
         ))}
      </div>

      {/* NOTION STYLE DATABASE */}
      <div className="bg-card border border-border rounded-[16px] overflow-hidden shadow-sm">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-muted/50 border-b border-border">
                     <th className="px-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Prospect</th>
                     <th className="px-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Status</th>
                     <th className="px-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap w-[200px]">Problem / Defect</th>
                     <th className="px-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap w-[300px]">Outreach Draft</th>
                     <th className="px-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border">
                  {[
                     { name: "Sarah Connor", company: "Cyberdyne Systems", status: "REPLIED", defect: "High turnover in engineering observed via LinkedIn.", draft: "Hey Sarah, noticed the recent shift at Cyberdyne...", highlight: true },
                     { name: "John Smith", company: "Acme Corp", status: "NEEDS REVIEW", defect: "Competitor just secured series B.", draft: "John — seeing Acme's recent market positioning..." },
                     { name: "Emily Chen", company: "Stark Ind.", status: "DRAFT READY", defect: "Slow adoption of recent product launch.", draft: "Emily, I was looking at Stark's recent launch metrics..." },
                     { name: "Mike Ross", company: "Pearson Hardman", status: "ANALYZING", defect: "...", draft: "..." },
                  ].map((row, idx) => (
                     <tr key={idx} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-4">
                           <p className="text-[13px] font-bold text-foreground leading-tight">{row.name}</p>
                           <p className="text-[11px] text-muted-foreground font-medium">{row.company}</p>
                        </td>
                        <td className="px-4 py-4">
                           <span className={`inline-flex px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest ${
                              row.status === 'REPLIED' ? 'bg-foreground text-background' :
                              row.status === 'NEEDS REVIEW' ? 'bg-orange-100 text-orange-700' :
                              row.status === 'DRAFT READY' ? 'bg-emerald-100 text-emerald-700' :
                              'bg-slate-100 text-slate-500'
                           }`}>{row.status}</span>
                        </td>
                        <td className="px-4 py-4 text-[12px] text-muted-foreground leading-relaxed">
                           {row.defect}
                        </td>
                        <td className="px-4 py-4">
                           <div className="bg-muted/50 p-2 rounded-lg border border-border/50 text-[12px] text-foreground font-medium italic line-clamp-2">
                              "{row.draft}"
                           </div>
                        </td>
                        <td className="px-4 py-4">
                           {row.status === 'REPLIED' ? (
                              <Link href={ACTION_MAP.openConversionInbox()} className="text-[11px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1 hover:underline">
                                 Open Conversation <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                              </Link>
                           ) : (
                              <button className="text-[11px] font-bold text-foreground uppercase tracking-widest border border-border px-3 py-1.5 rounded-lg hover:bg-muted">Review</button>
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
