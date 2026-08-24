"use client";

import React from "react";

export default function AcquisitionAnalyticsPage() {
  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1360px] mx-auto w-full pb-32">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-[20px] font-bold text-foreground">Acquisition Analytics</h2>
          <p className="text-[14px] text-muted-foreground mt-1">Connect acquisition activity directly to revenue outcomes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-0 border border-border rounded-[12px] overflow-hidden mb-10">
        
        <div className="p-5 bg-card border-r border-border/50">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Attention (Views)</p>
          <h3 className="text-[24px] font-bold text-foreground mb-4">42,500</h3>
          <div className="text-[12px] text-success font-bold flex items-center gap-1">+12% vs last mo</div>
        </div>
        
        <div className="p-5 bg-card border-r border-border/50">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Interest (Engage)</p>
          <h3 className="text-[24px] font-bold text-foreground mb-4">1,240</h3>
          <div className="text-[12px] text-success font-bold flex items-center gap-1">+5% vs last mo</div>
        </div>
        
        <div className="p-5 bg-card border-r border-border/50 relative">
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-cyan"></div>
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Intent (Signals)</p>
          <h3 className="text-[24px] font-bold text-cyan mb-4">84</h3>
          <div className="text-[12px] text-success font-bold flex items-center gap-1">+22% vs last mo</div>
        </div>
        
        <div className="p-5 bg-card border-r border-border/50 relative">
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-tertiary"></div>
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Demand (Leads)</p>
          <h3 className="text-[24px] font-bold text-tertiary mb-4">12</h3>
          <div className="text-[12px] text-destructive font-bold flex items-center gap-1">-5% vs last mo</div>
        </div>

        <div className="p-5 bg-card relative">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Revenue Influence</p>
          <h3 className="text-[24px] font-bold text-foreground mb-4">$45,000</h3>
          <div className="text-[12px] text-muted-foreground font-medium">Pipeline generated</div>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <section className="bg-card border border-border rounded-[12px] p-6">
            <h3 className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground mb-6">Format Efficiency (Intent Conversion)</h3>
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex justify-between items-end mb-1"><span className="text-[14px] font-bold text-foreground">Carousel + PDF CTA</span><span className="text-[14px] font-bold text-cyan">4.2%</span></div>
                <div className="w-full bg-secondary h-2 rounded"><div className="bg-cyan h-2 rounded" style={{ width: '80%' }}></div></div>
              </div>
              <div>
                <div className="flex justify-between items-end mb-1"><span className="text-[14px] font-bold text-foreground">Story Poll + DM</span><span className="text-[14px] font-bold text-cyan">3.1%</span></div>
                <div className="w-full bg-secondary h-2 rounded"><div className="bg-cyan h-2 rounded" style={{ width: '60%' }}></div></div>
              </div>
              <div>
                <div className="flex justify-between items-end mb-1"><span className="text-[14px] font-bold text-foreground">Text Post + Link</span><span className="text-[14px] font-bold text-muted-foreground">0.8%</span></div>
                <div className="w-full bg-secondary h-2 rounded"><div className="bg-muted-foreground h-2 rounded" style={{ width: '20%' }}></div></div>
              </div>
            </div>
         </section>

         <section className="bg-card border border-border rounded-[12px] p-6">
            <h3 className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground mb-6">Revenue Origination by Source</h3>
            <div className="flex items-center justify-center h-[150px] border border-dashed border-border/50 rounded flex-col">
               <span className="material-symbols-outlined text-[32px] text-muted-foreground mb-2">insert_chart</span> 
               <p className="text-[12px] text-muted-foreground">Graph blocked. Ensure sufficient conversion history.</p>
            </div>
         </section>
      </div>

    </div>
  );
}
