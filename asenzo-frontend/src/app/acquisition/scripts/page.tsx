"use client";

import React from "react";

export default function AcquisitionScriptsPage() {
  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1360px] mx-auto w-full flex gap-8 h-[calc(100vh-140px)]">
      
      {/* Configuration Sidebar */}
      <div className="w-[300px] flex-shrink-0 flex flex-col gap-6 overflow-y-auto pr-4 hide-scrollbar">
        <div>
          <h2 className="text-[16px] font-bold text-foreground mb-4">Script Configuration</h2>
          <div className="flex flex-col gap-3">
             <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest">Awareness Stage</label>
             <select className="bg-card border border-border p-2 rounded-[6px] text-[13px] text-foreground">
               <option>Problem-Aware</option>
               <option>Solution-Aware</option>
               <option>Product-Aware</option>
             </select>
          </div>
        </div>
        
        <div className="flex flex-col gap-3">
             <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest">Hook Style</label>
             <select className="bg-card border border-border p-2 rounded-[6px] text-[13px] text-foreground">
               <option>Contrarian / Negative</option>
               <option>Direct Value</option>
               <option>Story / Proof</option>
             </select>
        </div>

        <div className="flex flex-col gap-3">
             <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest">Framework</label>
             <select className="bg-card border border-border p-2 rounded-[6px] text-[13px] text-foreground">
               <option>PAS (Problem, Agitation, Solution)</option>
               <option>AIDA</option>
               <option>Story-Lesson-Pitch</option>
             </select>
        </div>

        <div className="flex flex-col gap-3">
             <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest">Call to Action (CTA)</label>
             <select className="bg-card border border-border p-2 rounded-[6px] text-[13px] text-foreground">
               <option>Download "12-Week Roadmap"</option>
               <option>Book Strategy Call</option>
               <option>Comment "SCALE" for DM</option>
             </select>
        </div>

        <button className="bg-foreground text-background font-bold text-[13px] py-3 rounded-[8px] mt-4 w-full">Generate AI Draft</button>
      </div>

      {/* Editor Main */}
      <div className="flex-1 bg-card border border-border rounded-[12px] flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
           <h3 className="text-[14px] font-bold text-foreground">Script Editor</h3>
           <div className="flex gap-2">
             <span className="text-[11px] font-bold text-warning bg-warning/10 px-2 py-1 rounded">DRAFT - REQUIRES REVIEW</span>
             <button className="border border-border bg-background text-foreground text-[12px] font-bold px-3 py-1 rounded-[6px]">Approve & Move to Production</button>
           </div>
        </div>
        <div className="flex-1 p-8 overflow-y-auto">
           <h4 className="text-[11px] font-bold text-tertiary uppercase tracking-widest mb-2">Selected Hook</h4>
           <p className="text-[18px] font-bold text-foreground mb-8">Most founders think they need more leads when they hit $1M ARR. In reality, their fulfillment engine is what's actually breaking.</p>
           
           <h4 className="text-[11px] font-bold text-tertiary uppercase tracking-widest mb-2">Body (PAS Framework)</h4>
           <div className="text-[15px] leading-relaxed text-foreground/90 space-y-4 font-medium" contentEditable suppressContentEditableWarning>
             <p>When you cross the 7-figure threshold, the rules of the game completely invert.</p>
             <p>What got you to $1M was brute-force sales and founder-led delivery. But if you try to scale that exact same model to $3M, you don't get more profit. You get 80-hour workweeks, declining client results, and structural burnout.</p>
             <p>The solution isn't another marketing channel. It's decoupling your time from your revenue through a formalized Operating System.</p>
           </div>

           <h4 className="text-[11px] font-bold text-tertiary uppercase tracking-widest mb-2 mt-8">CTA</h4>
           <p className="text-[14px] font-bold text-foreground italic border-l-2 border-tertiary pl-4">If you're stuck at this exact bottleneck, I've mapped out the exact OS we install to fix it. Download the 12-Week Roadmap via the link below.</p>
        </div>
      </div>
    </div>
  );
}
