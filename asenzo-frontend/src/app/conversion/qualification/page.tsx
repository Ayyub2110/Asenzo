"use client";

import React from "react";

export default function QualificationPage() {
  return (
    <div className="p-6 md:p-10 max-w-[1000px] mx-auto pb-20">
      
      <div className="mb-8">
        <h1 className="text-[18px] font-bold text-foreground mb-1">Lead Qualification</h1>
        <p className="text-[14px] text-muted-foreground">Determine if a lead deserves founder/sales time using Foundation constraints.</p>
      </div>

      <div className="bg-card border border-border rounded-[16px] shadow-sm p-8">
        
        <div className="flex justify-between items-start border-b border-border pb-6 mb-6">
          <div>
            <h2 className="text-[16px] font-bold text-foreground mb-1">David Kim</h2>
            <p className="text-[12px] text-muted-foreground">NextGen AI • B2B SaaS</p>
          </div>
          <span className="bg-background border border-border px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest">In Progress</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
           
           <div className="space-y-6">
              <div>
                 <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block">ICP Match</label>
                 <select className="w-full bg-background border border-border rounded-[8px] px-3 py-2 text-[13px] font-medium appearance-none">
                    <option>High - B2B SaaS/Service</option>
                    <option>Medium</option>
                    <option>Low</option>
                 </select>
              </div>
              <div>
                 <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Problem Severity</label>
                 <select className="w-full bg-background border border-border rounded-[8px] px-3 py-2 text-[13px] font-medium appearance-none">
                    <option>High - Affecting revenue/sanity</option>
                    <option>Medium</option>
                 </select>
              </div>
              <div>
                 <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Urgency</label>
                 <select className="w-full bg-background border border-border rounded-[8px] px-3 py-2 text-[13px] font-medium appearance-none">
                    <option>Immediate</option>
                    <option>Near-term (1-3 mos)</option>
                    <option>Later</option>
                 </select>
              </div>
           </div>

           <div className="space-y-6">
              <div>
                 <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Budget Range</label>
                 <select className="w-full bg-background border border-border rounded-[8px] px-3 py-2 text-[13px] font-medium appearance-none">
                    <option>Validated {'>'}$50k</option>
                    <option>Unknown</option>
                    <option>Underfunded</option>
                 </select>
              </div>
              <div>
                 <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Decision Maker Status</label>
                 <select className="w-full bg-background border border-border rounded-[8px] px-3 py-2 text-[13px] font-medium appearance-none">
                    <option>Direct Founder/CEO</option>
                    <option>Requires Approval</option>
                 </select>
              </div>
           </div>

        </div>

        <div className="border-t border-border pt-6 flex flex-col md:flex-row gap-6 justify-between items-center bg-secondary/30 -mx-8 px-8 pb-4">
           <div>
             <h3 className="text-[11px] uppercase font-bold text-muted-foreground tracking-widest mb-1">AI Recommendation</h3>
             <p className="text-[14px] font-bold text-foreground">Sales Call Route</p>
             <p className="text-[11px] text-muted-foreground">Strong ICP match with validated problem.</p>
           </div>
           
           <div className="flex gap-3 w-full md:w-auto">
              <button className="flex-1 md:flex-none px-6 py-2.5 bg-background border border-border text-foreground font-bold text-[12px] rounded-[8px] hover:bg-secondary">Override</button>
              <button className="flex-1 md:flex-none px-6 py-2.5 bg-success text-background font-bold text-[12px] rounded-[8px] shadow-sm hover:opacity-90">Confirm Qualification</button>
           </div>
        </div>

      </div>

    </div>
  );
}
