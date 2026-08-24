"use client";

import React from "react";

export default function DMTriagePage() {
  return (
    <div className="h-[calc(100vh-64px)] w-full flex flex-col md:flex-row overflow-hidden pb-10">
      
      {/* LEFT: INCOMING CONVERSATIONS */}
      <div className="w-full md:w-[350px] border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="text-[12px] font-bold uppercase tracking-widest text-foreground">Inbox Triage</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="p-3 bg-secondary/50 border border-border/50 rounded-[8px] cursor-pointer hover:border-foreground/30 transition-colors">
             <div className="flex justify-between items-start mb-2">
                <span className="text-[13px] font-bold text-foreground">David Kim</span>
                <span className="text-[10px] text-muted-foreground">10m ago</span>
             </div>
             <p className="text-[12px] text-muted-foreground line-clamp-2">"Hey, just saw your post. Really struggling with fulfillment bottlenecks. Does ASENZO handle service businesses?"</p>
          </div>
          <div className="p-3 bg-background border border-border/30 rounded-[8px] opacity-70">
             <div className="flex justify-between items-start mb-2">
                <span className="text-[13px] font-bold text-foreground">Sarah Jenkins</span>
                <span className="text-[10px] text-muted-foreground">1h ago</span>
             </div>
             <p className="text-[12px] text-muted-foreground line-clamp-2 gap-1">"Thanks for the resource. I'll read through it."</p>
          </div>
        </div>
      </div>

      {/* CENTER: CONVERSATION */}
      <div className="flex-1 bg-background flex flex-col border-r border-border">
         <div className="p-4 border-b border-border flex justify-between items-center">
            <div>
              <p className="text-[15px] font-bold text-foreground">David Kim</p>
              <p className="text-[11px] text-muted-foreground">LinkedIn DM • NextGen AI</p>
            </div>
            <span className="bg-background border border-border uppercase tracking-widest text-[9px] font-bold px-2 py-0.5 rounded">NEEDS REPLY</span>
         </div>
         <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
            <div className="max-w-[80%] rounded-[12px] p-4 bg-card border border-border self-start">
               <p className="text-[13px] text-foreground">"Hey, just saw your post. Really struggling with fulfillment bottlenecks. Does ASENZO handle service businesses?"</p>
               <p className="text-[10px] text-muted-foreground mt-2">10m ago</p>
            </div>
         </div>
         <div className="p-4 border-t border-border bg-card">
            <div className="bg-background border border-border rounded-[8px] p-3 mb-3 text-[13px] text-foreground h-[100px]">
              Yes, ASENZO handles service businesses natively by mapping your exact service delivery logic into operator workflows.
            </div>
            <div className="flex justify-between items-center">
               <span className="text-[11px] font-bold text-warning uppercase tracking-widest px-2 py-1 bg-warning/10 rounded">Draft (AI Suggested)</span>
               <div className="flex gap-2">
                 <button className="px-4 py-1.5 rounded-[6px] text-[12px] font-bold text-muted-foreground border border-border hover:bg-secondary">Rewrite</button>
                 <button className="px-5 py-1.5 rounded-[6px] text-[12px] font-bold bg-foreground text-background shadow-sm hover:opacity-90">Approve & Send</button>
               </div>
            </div>
         </div>
      </div>

      {/* RIGHT: INTELLIGENCE */}
      <div className="w-full md:w-[350px] bg-card flex flex-col">
          <div className="p-4 border-b border-border">
          <h2 className="text-[12px] font-bold uppercase tracking-widest text-foreground">Intelligence</h2>
        </div>
        <div className="p-6 space-y-6">
           <div>
              <h3 className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-2">ICP Fit</h3>
              <div className="bg-success/10 border border-success/30 px-3 py-2 rounded-[8px] text-[12px] font-bold text-success">
                High Match (B2B Service)
              </div>
           </div>
           <div>
              <h3 className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-2">Recommended Route</h3>
              <div className="bg-background border border-border px-3 py-2 rounded-[8px] text-[12px] font-bold text-foreground">
                Qualification Form
              </div>
           </div>
           <div>
              <h3 className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-2">Next Action</h3>
              <button className="w-full bg-secondary border border-border text-foreground font-bold text-[12px] py-2 rounded-[8px] hover:bg-secondary/70 transition-colors">Start Qualification</button>
           </div>
        </div>
      </div>

    </div>
  );
}
