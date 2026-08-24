"use client";

import React from "react";
import { getConversion } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function AssetsPage() {
  const { localData, loading, error } = useAdapter(getConversion);

  if (loading) return <div className="p-10 animate-pulse h-96 w-full max-w-[1200px] mx-auto bg-muted/20 rounded-[16px]" />;
  if (error || !localData) return <div className="p-10">Error loading Conversion Assets.</div>;

  const { assets } = localData;

  return (
    <div className="p-6 md:p-10 max-w-[1500px] mx-auto pb-20">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-[18px] font-bold text-foreground mb-1">Conversion Assets</h1>
          <p className="text-[14px] text-muted-foreground">Lead magnets, VSLs, calculators, and forms actively routing buyer intent.</p>
        </div>
        <button className="bg-foreground text-background px-4 py-2 rounded-[8px] text-[12px] font-bold shadow-sm hover:opacity-90 transition-opacity">Deploy Asset</button>
      </div>

       <div className="bg-card border border-border rounded-[16px] overflow-hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {assets?.map(a => (
            <div key={a.id} className="border border-border bg-background rounded-[12px] p-5 hover:border-foreground/30 transition-colors flex flex-col justify-between h-48 group">
              <div>
                 <div className="flex justify-between items-start mb-3">
                   <span className="text-[10px] font-bold uppercase tracking-widest bg-secondary text-foreground px-2 py-0.5 rounded">{a.type}</span>
                   {a.status === 'ACTIVE' && <span className="w-2 h-2 rounded-full bg-success"></span>}
                 </div>
                 <h2 className="text-[15px] font-bold text-foreground leading-tight mb-2">{a.name}</h2>
                 <p className="text-[11px] text-muted-foreground line-clamp-2">{a.awarenessStage} • {a.icp}</p>
              </div>
              <div className="flex justify-between items-end">
                 <div>
                   <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Conversions</p>
                   <p className="text-[20px] font-bold text-foreground leading-none">{a.conversions}</p>
                 </div>
                 <button className="text-[11px] font-bold uppercase tracking-widest text-foreground opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">insights</span> View</button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
