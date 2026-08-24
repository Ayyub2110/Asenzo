"use client";

import React from "react";

export default function AcquisitionStoriesPage() {
  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1360px] mx-auto w-full pb-32">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-[20px] font-bold text-foreground">Story Sequence Center</h2>
          <p className="text-[14px] text-muted-foreground mt-1">Design daily narrative arcs and interactive sequences.</p>
        </div>
        <button className="bg-foreground text-background px-4 py-2 rounded-[8px] text-[13px] font-bold">New Sequence</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Templates */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Sequence Templates</h3>
          
          <div className="p-5 border border-border bg-card rounded-[12px] cursor-pointer hover:border-foreground/50 transition">
             <h4 className="text-[14px] font-bold text-foreground mb-1">Pattern Interrupt</h4>
             <p className="text-[12px] text-muted-foreground mb-4">Best for Unaware stage.</p>
             <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-muted-foreground tracking-widest text-[10px]">
               <span className="bg-secondary px-1.5 py-0.5 rounded">Interrupt</span> → 
               <span className="bg-secondary px-1.5 py-0.5 rounded">Insight</span> → 
               <span className="bg-secondary px-1.5 py-0.5 rounded text-cyan">Poll</span>
             </div>
          </div>

          <div className="p-5 border border-tertiary/50 bg-tertiary/5 rounded-[12px] cursor-pointer shadow-[0_0_0_1px_rgba(var(--tertiary),0.2)]">
             <h4 className="text-[14px] font-bold text-foreground mb-1">Objection Removal (Offer)</h4>
             <p className="text-[12px] text-muted-foreground mb-4">Best for Most-Aware stage.</p>
             <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-muted-foreground tracking-widest text-[10px] flex-wrap">
               <span className="bg-background border border-border px-1.5 py-0.5 rounded">FAQ</span> → 
               <span className="bg-background border border-border px-1.5 py-0.5 rounded">Offer</span> → 
               <span className="bg-background border border-border px-1.5 py-0.5 rounded text-tertiary">Urgency CTA</span>
             </div>
          </div>
        </div>

        {/* Builder */}
        <div className="md:col-span-2 p-6 bg-card border border-border rounded-[12px] min-h-[500px]">
           <h3 className="text-[14px] font-bold text-foreground mb-6">Sequence Builder: Objection Removal</h3>
           
           <div className="flex flex-col gap-4 relative">
             <div className="absolute left-6 top-8 bottom-8 w-[2px] bg-border z-0"></div>
             
             {[
               { slide: 1, type: "FAQ / Question Box", desc: "Share a screenshot of a real DM asking about pricing." },
               { slide: 2, type: "Belief Shift", desc: "Explain why cheap solutions actually cost more in lost velocity." },
               { slide: 3, type: "Risk Reversal (Offer)", desc: "Highlight the guarantee to remove purchase friction." },
               { slide: 4, type: "Direct CTA / Urgency", desc: "Link to Application. Mention limited capacity." }
             ].map((s) => (
               <div key={s.slide} className="relative z-10 flex gap-4">
                 <div className="w-12 h-12 bg-background border border-border rounded-full flex items-center justify-center font-bold text-[14px] mt-1 shrink-0">
                   {s.slide}
                 </div>
                 <div className="flex-1 bg-background border border-border p-4 rounded-[8px]">
                   <h4 className="text-[13px] font-bold text-foreground mb-1">{s.type}</h4>
                   <p className="text-[13px] text-muted-foreground">{s.desc}</p>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}
