"use client";

import React from "react";
import { getRevenue } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function ObjectionsPage() {
  const { localData, loading, error } = useAdapter(getRevenue);

  if (loading) return <div className="p-10 animate-pulse h-96 w-full max-w-[1200px] mx-auto bg-muted/20 rounded-[16px]" />;
  if (error || !localData) return <div className="p-10">Error loading Objections.</div>;

  const { objections } = localData;

  return (
    <div className="p-6 md:p-10 max-w-[1500px] mx-auto pb-20">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-[18px] font-bold text-foreground mb-1">Objection Library</h1>
          <p className="text-[14px] text-muted-foreground">Compounding company sales intelligence and recurring friction points.</p>
        </div>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {objections?.map(o => (
            <div key={o.id} className="border border-border bg-card rounded-[12px] p-6 hover:border-foreground/30 transition-colors">
                 <div className="flex justify-between items-start mb-4">
                   <h2 className="text-[16px] font-bold text-foreground leading-tight">"{o.objection}"</h2>
                 </div>
                 
                 <div className="mb-6 bg-secondary/30 border border-border p-4 rounded-[8px]">
                    <h3 className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-2">Recommended Response</h3>
                    <p className="text-[13px] text-foreground font-medium">{o.recommendedResponse}</p>
                 </div>

                 <div className="flex justify-between items-end pt-4 border-t border-border">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Impact / Freq</p>
                      <p className="text-[14px] font-bold text-destructive">{o.winLossImpact} <span className="text-muted-foreground text-[12px]">({o.frequency}x)</span></p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Target Offer</p>
                       <p className="text-[13px] font-bold text-foreground">{o.relatedOffer}</p>
                    </div>
                 </div>
            </div>
          )) || <p className="text-[13px] text-muted-foreground">No objections logged.</p>}
      </div>
    </div>
  );
}
