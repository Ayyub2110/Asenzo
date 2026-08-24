"use client";
import React from "react";
import { getIntelligence } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function RisksPage() {
  const { localData, loading, error } = useAdapter(getIntelligence);

  if (loading) return <div className="p-10 animate-pulse h-96 w-full bg-muted/20 rounded-[16px]" />;
  if (error || !localData) return <div className="p-10">Error loading Risks.</div>;

  const { risks } = localData;

  if (risks.length === 0) {
    return (
      <div className="p-16 text-center text-muted-foreground bg-card rounded-[16px] border border-border mt-8">
        <h3 className="text-[14px] font-bold text-foreground mb-2">No evidence-based risks detected.</h3>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 pb-32">
      <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-6">Strategic Risk Center</h2>
      
      <div className="space-y-6">
         {risks.map(r => (
            <div key={r.id} className="bg-card border border-border p-6 rounded-[16px] shadow-sm">
               <div className="flex items-center gap-3 mb-2 flex-wrap">
                 <h3 className="text-[18px] font-bold text-foreground">{r.risk}</h3>
                 <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest leading-none bg-secondary text-foreground`}>{r.category} Risk</span>
                 <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest leading-none ${r.severity === 'HIGH' || r.severity === 'CRITICAL' ? 'bg-destructive/20 text-destructive' : 'bg-orange-500/20 text-orange-600'}`}>Severity: {r.severity}</span>
                 <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest leading-none bg-muted/50 text-muted-foreground`}>Probability: {r.probability}</span>
                 <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest leading-none ${r.status === 'OPEN' ? 'border border-destructive text-destructive' : 'bg-secondary'}`}>{r.status}</span>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 text-[13px]">
                  <div className="space-y-2 text-muted-foreground">
                     <p><strong className="text-foreground">Evidence:</strong> {r.evidence}</p>
                     <p><strong className="text-foreground">Business Impact:</strong> {r.businessImpact}</p>
                     <p><strong className="text-foreground">Affected Center:</strong> {r.affectedCenter}</p>
                  </div>
                  
                  <div className="bg-muted/20 p-4 rounded-xl border border-border">
                     <strong className="block text-[11px] uppercase tracking-widest text-muted-foreground mb-1">Recommended Mitigation</strong>
                     <p className="font-bold text-foreground">{r.mitigation}</p>
                  </div>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}
