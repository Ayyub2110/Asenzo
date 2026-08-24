"use client";
import React from "react";
import { getOperations } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function SchedulePage() {
  const { localData, loading, error } = useAdapter(getOperations);

  if (loading) return <div className="p-10 animate-pulse h-96 w-full bg-muted/20 rounded-[16px]" />;
  if (error || !localData) return <div className="p-10">Error loading Schedule.</div>;

  const { schedule, team } = localData;

  if (schedule.length === 0) {
    return (
      <div className="p-16 text-center text-muted-foreground bg-card rounded-[16px] border border-border">
        <h3 className="text-[14px] font-bold text-foreground mb-2">No standard operating rhythm established</h3>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 pb-32">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Growth Schedule Center</h2>
        <button className="px-4 py-2 bg-primary text-primary-foreground text-[12px] font-bold rounded-[6px]">Add Rhythm Event</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {schedule.map(s => (
           <div key={s.id} className="bg-card border border-border p-6 rounded-[16px] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-[16px] font-bold text-foreground">{s.title}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest leading-none ${s.frequency === 'WEEKLY' ? 'bg-primary/20 text-primary' : s.frequency === 'MONTHLY' ? 'bg-orange-500/20 text-orange-600' : 'bg-purple-500/20 text-purple-600'}`}>
                    {s.frequency}
                  </span>
                </div>
                <p className="text-[12px] text-muted-foreground mb-4">Owner: {team.find(t => t.id === s.ownerId)?.name || 'Unknown'}</p>
                
                <div className="text-[13px] text-foreground p-3 bg-muted/20 rounded-lg border border-border mb-4">
                  <strong className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Agenda</strong>
                  {s.agenda}
                </div>
              </div>
              <div className="flex justify-end">
                <span className={`px-2 py-1 text-[11px] font-bold rounded ${s.status === 'COMPLETED' ? 'text-success' : 'text-muted-foreground'}`}>{s.status}</span>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
}
