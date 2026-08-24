"use client";
import React from "react";
import { getDelivery } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function MilestonesPage() {
  const { localData, loading, error } = useAdapter(getDelivery);
  if (loading) return <div className="p-10 animate-pulse h-96 w-full" />;
  if (error || !localData) return <div className="p-10">Error.</div>;

  return (
    <div className="p-6 md:p-10 mx-auto w-full pb-32">
      <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-6">Milestone Center</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {localData.milestones.map(m => {
           const engagement = localData.engagements.find(e => e.id === m.engagementId);
           return (
             <div key={m.id} className="p-5 bg-card border border-border rounded-[12px] shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-[15px] font-bold text-foreground">{m.name}</h3>
                  <span className="px-2 py-0.5 bg-secondary text-[10px] font-bold uppercase rounded">{m.status.replace("_", " ")}</span>
                </div>
                <p className="text-[12px] text-muted-foreground mb-4">{m.description}</p>
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>Engagement: <span className="font-semibold text-foreground">{engagement?.name}</span></span>
                  <span>Due: <span className="font-semibold text-foreground">{new Date(m.dueDate).toLocaleDateString()}</span></span>
                </div>
             </div>
           )
        })}
      </div>
    </div>
  );
}
