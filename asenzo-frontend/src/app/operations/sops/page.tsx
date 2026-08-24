"use client";
import React from "react";
import { getOperations } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function SOPsPage() {
  const { localData, loading, error } = useAdapter(getOperations);

  if (loading) return <div className="p-10 animate-pulse h-96 w-full bg-muted/20 rounded-[16px]" />;
  if (error || !localData) return <div className="p-10">Error loading SOPs.</div>;

  const { sops, team } = localData;

  if (sops.length === 0) {
    return (
      <div className="p-16 text-center text-muted-foreground bg-card rounded-[16px] border border-border">
        <h3 className="text-[14px] font-bold text-foreground mb-2">No active SOPs</h3>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 pb-32">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Standard Operating Procedures</h2>
        <button className="px-4 py-2 bg-primary text-primary-foreground text-[12px] font-bold rounded-[6px]">Create SOP</button>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {sops.map(sop => (
          <div key={sop.id} className="bg-card border border-border rounded-[16px] p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
               <div>
                 <h3 className="text-[18px] font-bold text-foreground">{sop.name}</h3>
                 <p className="text-[13px] text-muted-foreground">Version: {sop.version} • Status: <span className="font-bold text-foreground">{sop.status.replace("_", " ")}</span></p>
               </div>
               <span className="text-[11px] font-bold text-muted-foreground uppercase">Owner: {team.find(t => t.id === sop.ownerId)?.name || 'Unknown'}</span>
            </div>
            
            <div className="space-y-4">
              <div className="text-[13px]">
                <strong className="block mb-1">Purpose</strong>
                <p className="text-muted-foreground">{sop.purpose}</p>
              </div>
              <div className="text-[13px]">
                <strong className="block mb-1">Trigger</strong>
                <span className="px-2 py-1 bg-secondary text-foreground text-[11px] rounded font-bold">{sop.trigger}</span>
              </div>
              <div className="text-[13px]">
                <strong className="block mb-1">Expected Output</strong>
                <p className="text-muted-foreground">{sop.expectedOutput}</p>
              </div>
              <div className="border border-border rounded-xl p-4 bg-background">
                <strong className="block text-[11px] uppercase tracking-widest text-muted-foreground mb-2">Process Steps</strong>
                <ol className="list-decimal list-inside space-y-1 text-[13px] text-foreground font-medium">
                  {sop.processSteps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
