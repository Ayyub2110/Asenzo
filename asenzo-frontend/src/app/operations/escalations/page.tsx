"use client";
import React from "react";
import { getOperations } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function EscalationsPage() {
  const { localData, loading, error } = useAdapter(getOperations);

  if (loading) return <div className="p-10 animate-pulse h-96 w-full bg-muted/20 rounded-[16px]" />;
  if (error || !localData) return <div className="p-10">Error loading Escalations.</div>;

  const { escalations, team } = localData;

  if (escalations.length === 0) {
    return (
      <div className="p-16 text-center text-muted-foreground bg-card rounded-[16px] border border-border">
        <h3 className="text-[14px] font-bold text-foreground mb-2">No active escalations</h3>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 pb-32">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Escalation Center</h2>
        <button className="px-4 py-2 bg-destructive text-destructive-foreground text-[12px] font-bold rounded-[6px]">Raise Escalation</button>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
         {escalations.map(e => (
            <div key={e.id} className="p-6 bg-card border border-border rounded-[16px] shadow-sm flex flex-col md:flex-row justify-between gap-6">
               <div className="flex-1">
                 <div className="flex items-center gap-3 mb-2">
                   <h3 className="text-[18px] font-bold text-foreground">{e.issue}</h3>
                   <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold leading-none ${e.severity === 'URGENT' ? 'bg-destructive/20 text-destructive' : e.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-600' : 'bg-muted/50 text-muted-foreground'}`}>{e.severity}</span>
                   <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold leading-none ${e.status === 'OPEN' ? 'bg-destructive/10 text-destructive border border-destructive/20' : 'bg-secondary text-foreground'}`}>{e.status.replace("_", " ")}</span>
                 </div>
                 
                 <div className="flex gap-4 mb-4 text-[13px] text-muted-foreground">
                   <span><strong>Source:</strong> {e.sourceModule}</span>
                   <span><strong>Owner:</strong> {team.find(t => t.id === e.ownerId)?.name || 'Unknown'}</span>
                   <span><strong>Escalated To:</strong> {team.find(t => t.id === e.escalationOwnerId)?.name || 'Unknown'}</span>
                 </div>

                 <div className="p-4 bg-muted/10 rounded-lg border border-border text-[13px] space-y-2">
                   <p><strong className="text-foreground">Reason:</strong> {e.reason}</p>
                   <p><strong className="text-foreground">Recommended Action:</strong> {e.recommendedAction}</p>
                 </div>
               </div>
               
               {e.deadline && (
                 <div className="shrink-0 pt-1 text-right">
                   <span className="block text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Deadline</span>
                   <span className={`text-[14px] font-bold ${new Date(e.deadline).getTime() < Date.now() ? 'text-destructive' : 'text-foreground'}`}>
                     {new Date(e.deadline).toLocaleDateString()}
                   </span>
                 </div>
               )}
            </div>
         ))}
      </div>
    </div>
  );
}
