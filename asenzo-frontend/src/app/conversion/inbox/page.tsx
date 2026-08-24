"use client";

import React from "react";

export default function LeadInboxPage() {
  return (
    <div className="p-6 md:p-10 max-w-[1500px] mx-auto pb-20">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-[18px] font-bold text-foreground mb-1">Lead Inbox</h1>
          <p className="text-[14px] text-muted-foreground">Central intake for every potential buyer entering Conversion.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-[16px] overflow-hidden">
        <div className="flex items-center gap-2 p-4 border-b border-border">
           <input type="text" placeholder="Search leads..." className="bg-background border border-border/50 text-foreground text-[13px] px-3 py-1.5 rounded-[6px] w-[250px]" />
           <select className="bg-background border border-border/50 text-foreground text-[13px] px-3 py-1.5 rounded-[6px]">
              <option>Status: NEW</option>
              <option>Status: NEEDS REPLY</option>
              <option>Status: QUALIFIED</option>
           </select>
        </div>
        <table className="w-full text-left">
          <thead className="bg-secondary/30">
            <tr>
              <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Lead</th>
              <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Source</th>
              <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap hidden md:table-cell">ICP</th>
              <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Status</th>
              <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap hidden lg:table-cell">Last Interaction</th>
              <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-border hover:bg-secondary/20 transition-colors">
               <td className="p-4">
                 <p className="text-[14px] font-bold text-foreground">David Kim</p>
                 <p className="text-[12px] text-muted-foreground">NextGen AI</p>
               </td>
               <td className="p-4">
                 <p className="text-[12px] font-medium text-foreground bg-secondary w-fit px-2 py-0.5 rounded">LinkedIn Organic</p>
               </td>
               <td className="p-4 hidden md:table-cell">
                 <div className="flex gap-1"><span className="w-2 h-2 rounded-full bg-success mt-1"></span> <span className="text-[12px]">High</span></div>
               </td>
               <td className="p-4">
                 <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-background border border-border">NEEDS REPLY</span>
               </td>
               <td className="p-4 hidden lg:table-cell text-[12px] text-muted-foreground">Form Submission (2h ago)</td>
               <td className="p-4 text-right">
                 <button className="bg-foreground text-background text-[11px] font-bold px-3 py-1.5 rounded-[6px] mr-2">Reply</button>
                 <button className="bg-background border border-border text-foreground text-[11px] font-bold px-3 py-1.5 rounded-[6px]">Qualify</button>
               </td>
            </tr>
            <tr className="border-t border-border hover:bg-secondary/20 transition-colors">
               <td className="p-4">
                 <p className="text-[14px] font-bold text-foreground">Sarah Jenkins</p>
                 <p className="text-[12px] text-muted-foreground">Acme Corp</p>
               </td>
               <td className="p-4">
                 <p className="text-[12px] font-medium text-foreground bg-secondary w-fit px-2 py-0.5 rounded">Instagram Ads</p>
               </td>
               <td className="p-4 hidden md:table-cell">
                 <div className="flex gap-1"><span className="w-2 h-2 rounded-full bg-warning mt-1"></span> <span className="text-[12px]">Medium</span></div>
               </td>
               <td className="p-4">
                 <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-background border border-border">QUALIFIED</span>
               </td>
               <td className="p-4 hidden lg:table-cell text-[12px] text-muted-foreground">App Approved (1d ago)</td>
               <td className="p-4 text-right">
                 <button className="bg-foreground text-background text-[11px] font-bold px-3 py-1.5 rounded-[6px] mr-2">Book Call</button>
               </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
