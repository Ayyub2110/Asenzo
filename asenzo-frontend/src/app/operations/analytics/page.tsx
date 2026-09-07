"use client";
import React from "react";
import { getOperations } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function AnalyticsPage() {
  const { localData, loading, error } = useAdapter(getOperations);

  if (loading) return <div className="p-10 animate-pulse h-96 w-full bg-muted/20 rounded-[16px]" />;
  if (error || !localData) return <div className="p-10">Error loading Analytics.</div>;

  return (
    <div className="p-6 md:p-10 pb-32">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Operations Analytics</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border p-6 rounded-[16px] shadow-sm">
           <h3 className="text-[13px] font-bold mb-4">Work by Status</h3>
           <div className="text-[12px] text-muted-foreground space-y-2">
             <div className="flex justify-between border-b border-border pb-1"><span>COMPLETED</span> <span>18</span></div>
             <div className="flex justify-between border-b border-border pb-1"><span>IN PROGRESS</span> <span>12</span></div>
             <div className="flex justify-between border-b border-border pb-1"><span>BLOCKED</span> <span className="text-destructive font-bold">2</span></div>
           </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-[16px] shadow-sm">
           <h3 className="text-[13px] font-bold mb-4">Team Utilization</h3>
           <div className="text-[12px] text-muted-foreground space-y-2">
             {localData.team.map(t => (
               <div key={t.id} className="flex justify-between border-b border-border pb-1">
                 <span>{t.name}</span> 
                 <span className={t.capacity < t.workload ? 'text-destructive font-bold' : ''}>
                   {((t.workload / t.capacity) * 100).toFixed(0)}%
                 </span>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}
