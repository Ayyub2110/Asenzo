"use client";
import React from "react";
import { getDelivery } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function HealthPage() {
  const { localData, loading, error } = useAdapter(getDelivery);
  if (loading) return <div className="p-10 animate-pulse h-96 w-full" />;
  if (error || !localData) return <div className="p-10">Error.</div>;

  return (
    <div className="p-6 md:p-10 mx-auto w-full pb-32">
      <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-6">Client Health Center</h2>
      <div className="grid grid-cols-1 gap-6">
        {localData.clients.map(c => (
           <div key={c.id} className="p-6 bg-card border border-border rounded-[16px] shadow-sm flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0 w-full md:w-64 border-r border-border md:pr-6">
                 <h3 className="text-[16px] font-bold text-foreground mb-1">{c.name}</h3>
                 <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold mt-2 ${c.health.overall === 'GREEN' ? 'bg-success/20 text-success' : c.health.overall === 'YELLOW' ? 'bg-yellow-500/20 text-yellow-600' : 'bg-destructive/20 text-destructive'}`}>
                    <span className={`w-2 h-2 rounded-full ${c.health.overall === 'GREEN' ? 'bg-success' : c.health.overall === 'YELLOW' ? 'bg-yellow-500' : 'bg-destructive'}`}></span>
                    {c.health.overall}
                 </div>
              </div>
              <div className="flex-1 space-y-4">
                 <h4 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest">Active Dimensions</h4>
                 {c.health.signals.map(s => (
                   <div key={s.id} className="p-3 bg-secondary/50 rounded-lg border border-border text-[13px]">
                     <div className="flex justify-between items-center mb-1">
                       <span className="font-bold text-foreground uppercase text-[11px]">{s.dimension}</span>
                       <span className={`font-bold ${s.status === 'GREEN' ? 'text-success' : s.status === 'YELLOW' ? 'text-yellow-600' : 'text-destructive'}`}>{s.status}</span>
                     </div>
                     <p className="text-muted-foreground mb-2">{s.reason}</p>
                     {s.recommendedAction && (
                       <p className="text-primary font-semibold">Action: {s.recommendedAction}</p>
                     )}
                   </div>
                 ))}
                 {c.health.signals.length === 0 && <p className="text-[13px] text-muted-foreground">No health signals recorded.</p>}
              </div>
           </div>
        ))}
      </div>
    </div>
  );
}
