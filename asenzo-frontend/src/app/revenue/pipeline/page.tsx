"use client";

import React from "react";
import { getRevenue } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function PipelinePage() {
  const { localData, loading, error } = useAdapter(getRevenue);

  if (loading) return <div className="p-10 animate-pulse h-96 w-full max-w-[1200px] mx-auto bg-muted/20 rounded-[16px]" />;
  if (error || !localData) return <div className="p-10">Error loading Pipeline.</div>;

  const { deals } = localData;

  const stages = ["QUALIFIED", "CALL_BOOKED", "CALL_HELD", "PROPOSAL_SENT", "NEGOTIATION", "CLOSED_WON"];

  const formatCurrency = (val: number) => `₹${(val / 100000).toFixed(1)}L`;

  return (
    <div className="p-6 md:p-10 w-full h-[calc(100vh-100px)] flex flex-col gap-8 flex-nowrap overflow-hidden">
      <div className="flex items-end justify-between shrink-0">
        <div>
          <h1 className="text-[18px] font-bold text-foreground mb-1">Sales Pipeline</h1>
          <p className="text-[14px] text-muted-foreground">Managing legitimate commercial opportunities.</p>
        </div>
        <div className="flex gap-4">
           <select className="bg-background border border-border text-[12px] font-bold uppercase tracking-widest px-4 py-2 rounded-[8px]">
             <option>All Pipelines</option>
           </select>
           <button className="bg-foreground text-background px-4 py-2 rounded-[8px] text-[12px] font-bold shadow-sm hover:opacity-90 transition-opacity">Create Deal</button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto hide-scrollbar flex gap-4 pb-10">
        {stages.map(stage => {
           const stageDeals = deals.filter(d => d.stage === stage);
           const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);

           return (
             <div key={stage} className="flex-shrink-0 w-[300px] bg-secondary/20 rounded-[12px] border border-border/50 flex flex-col max-h-full">
                <div className="p-4 border-b border-border/50 shrink-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-foreground">{stage.replace('_', ' ')}</h3>
                    <span className="text-[10px] font-bold bg-secondary text-foreground px-1.5 py-0.5 rounded">{stageDeals.length}</span>
                  </div>
                  <p className="text-[14px] font-bold text-muted-foreground">{formatCurrency(stageValue)}</p>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                   {stageDeals.map(d => (
                     <div key={d.id} className="p-4 border border-border bg-card rounded-[8px] cursor-grab hover:border-foreground/30 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-[13px] font-bold text-foreground leading-tight">{d.company}</p>
                          <span className={`w-2 h-2 rounded-full ${d.confidence === 'HIGH' ? 'bg-success' : d.confidence === 'MEDIUM' ? 'bg-warning' : 'bg-destructive'}`}></span>
                        </div>
                        <p className="text-[15px] font-bold text-foreground mb-3">{formatCurrency(d.value)}</p>
                        <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest pt-3 border-t border-border/50 flex justify-between items-center">
                          <span>{d.nextAction}</span>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           );
        })}
      </div>
    </div>
  );
}
