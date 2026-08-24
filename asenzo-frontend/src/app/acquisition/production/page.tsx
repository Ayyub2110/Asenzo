"use client";

import React from "react";

export default function AcquisitionProductionPage() {
  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1360px] mx-auto w-full pb-32 h-full">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-[20px] font-bold text-foreground">Production Center</h2>
          <p className="text-[14px] text-muted-foreground mt-1">Track asset creation from brief to published.</p>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-6 h-[70vh]">
        
        {['Idea', 'Brief', 'Script', 'Founder Review', 'Recording', 'Editing', 'Scheduled'].map(stage => (
          <div key={stage} className="min-w-[280px] flex-shrink-0 bg-secondary/50 rounded-[12px] p-4 flex flex-col">
            <h3 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest mb-4 flex justify-between">
              {stage} <span className="bg-muted px-2 py-0.5 rounded">{stage === 'Founder Review' ? '4' : '1'}</span>
            </h3>
            
            <div className={`p-4 bg-card border ${stage === 'Founder Review' ? 'border-destructive/50 shadow-[0_0_0_2px_rgba(255,0,0,0.1)]' : 'border-border'} rounded-[8px] cursor-pointer hover:border-foreground/50 transition`}>
               <p className="text-[10px] font-bold text-tertiary uppercase tracking-widest mb-1">LinkedIn Post</p>
               <h4 className="text-[13px] font-bold text-foreground leading-tight mb-3">Why founders burn out before reaching $1M ARR</h4>
               <div className="flex justify-between items-center text-[11px] text-muted-foreground">
                 <span>Due: Oct 12</span>
                 <span className="material-symbols-outlined text-[14px]">account_circle</span>
               </div>
            </div>
            
          </div>
        ))}
        
      </div>
    </div>
  );
}
