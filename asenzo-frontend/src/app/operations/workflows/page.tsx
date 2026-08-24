"use client";
import React from "react";
import { getOperations } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function WorkflowsPage() {
  const { localData, loading, error } = useAdapter(getOperations);

  if (loading) return <div className="p-10 animate-pulse h-96 w-full bg-muted/20 rounded-[16px]" />;
  if (error || !localData) return <div className="p-10">Error loading Workflows.</div>;

  const { workflows, team } = localData;

  if (workflows.length === 0) {
    return (
      <div className="p-16 text-center text-muted-foreground bg-card rounded-[16px] border border-border">
        <h3 className="text-[14px] font-bold text-foreground mb-2">No active workflows</h3>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 pb-32">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Workflow Center</h2>
        <button className="px-4 py-2 bg-primary text-primary-foreground text-[12px] font-bold rounded-[6px]">Design Workflow</button>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {workflows.map(w => (
          <div key={w.id} className="bg-card border border-border rounded-[16px] p-6 shadow-sm">
            <h3 className="text-[18px] font-bold text-foreground mb-1">{w.name}</h3>
            <p className="text-[13px] text-muted-foreground mb-4">Owner: {team.find(t => t.id === w.ownerId)?.name || 'Unknown'}</p>
            
            <div className="mb-4">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Trigger Event</span>
              <span className="px-3 py-1.5 bg-primary/10 text-primary font-bold text-[12px] rounded-md inline-block">{w.triggerEvent}</span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Automation Steps</span>
              <div className="flex flex-col gap-2">
                {w.steps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-[13px] font-medium text-foreground p-3 border border-border rounded-lg">
                    <span className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold shrink-0">{idx + 1}</span>
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
