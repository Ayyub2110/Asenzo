"use client";

import React from "react";

export default function AcquisitionOutreachPage() {
  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1360px] mx-auto w-full pb-32">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-[20px] font-bold text-foreground">Outreach Center</h2>
          <p className="text-[14px] text-muted-foreground mt-1">Human-approved one-to-one demand generation.</p>
        </div>
        <button className="bg-foreground text-background px-4 py-2 rounded-[8px] text-[13px] font-bold">Import Prospects</button>
      </div>

      <div className="bg-card border border-border rounded-[12px] overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20 flex justify-between items-center">
           <h3 className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground">Prospect Queue (Pending Human Approval)</h3>
           <span className="bg-destructive/10 text-destructive text-[11px] font-bold px-2 py-1 rounded">2 Pending Actions</span>
        </div>
        
        <table className="w-full text-left border-collapse">
             <thead>
               <tr className="border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/10">
                 <th className="p-4">Prospect</th>
                 <th className="p-4">Source Signal</th>
                 <th className="p-4">Proposed Message</th>
                 <th className="p-4 text-right">Action</th>
               </tr>
             </thead>
             <tbody>
               <tr className="border-b border-border/50 hover:bg-muted/30">
                 <td className="p-4">
                   <p className="text-[14px] font-bold text-foreground">Sarah Jenkins</p>
                   <p className="text-[12px] text-muted-foreground">CEO @ ScaleTech</p>
                 </td>
                 <td className="p-4 text-[12px]">
                   <span className="bg-cyan/10 text-cyan px-2 py-0.5 rounded font-bold mr-2">POLL VOTE</span>
                   Voted 'Systems' on burnout poll
                 </td>
                 <td className="p-4 text-[13px] text-foreground font-medium italic max-w-xs">
                   "Hey Sarah, saw you voted Systems on my poll today. Is fulfillment currently your main scaling bottleneck?"
                 </td>
                 <td className="p-4 text-right">
                    <button className="bg-success text-success-foreground text-[12px] font-bold px-3 py-1.5 rounded-[6px] mr-2">Approve & Send</button>
                    <button className="border border-border text-foreground text-[12px] font-bold px-3 py-1.5 rounded-[6px]">Edit</button>
                 </td>
               </tr>
               <tr className="border-b border-border/50 hover:bg-muted/30">
                 <td className="p-4">
                   <p className="text-[14px] font-bold text-foreground">Marcus Thorne</p>
                   <p className="text-[12px] text-muted-foreground">Founder @ Elevate</p>
                 </td>
                 <td className="p-4 text-[12px]">
                   <span className="bg-tertiary/10 text-tertiary px-2 py-0.5 rounded font-bold mr-2">PAGE VISIT</span>
                   Engaged with Pricing Page
                 </td>
                 <td className="p-4 text-[13px] text-foreground font-medium italic max-w-xs">
                   "Marcus - noticed you checking out the ASENZO tiers. Happy to shoot over a quick comparison breakdown if helpful?"
                 </td>
                 <td className="p-4 text-right">
                    <button className="bg-success text-success-foreground text-[12px] font-bold px-3 py-1.5 rounded-[6px] mr-2">Approve & Send</button>
                    <button className="border border-border text-foreground text-[12px] font-bold px-3 py-1.5 rounded-[6px]">Edit</button>
                 </td>
               </tr>
             </tbody>
           </table>
      </div>
    </div>
  );
}
