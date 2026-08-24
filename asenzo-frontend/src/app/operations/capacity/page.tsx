"use client";
import React from "react";
import { getOperations } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function CapacityPage() {
  const { localData, loading, error } = useAdapter(getOperations);

  if (loading) return <div className="p-10 animate-pulse h-96 w-full bg-muted/20 rounded-[16px]" />;
  if (error || !localData) return <div className="p-10">Error loading Capacity data.</div>;

  const { team } = localData;

  const overloaded = team.filter(t => t.status === "OVER_CAPACITY");

  return (
    <div className="p-6 md:p-10 pb-32">
      <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-6">Capacity Center</h2>
      
      {overloaded.length > 0 && (
        <div className="mb-8 p-6 bg-destructive/10 border border-destructive/20 rounded-[16px]">
          <h3 className="text-[14px] font-bold text-destructive mb-2">Capacity Risk Detected</h3>
          <p className="text-[13px] text-destructive/80 mb-4">Team members exceeding operational limits. Risk of bottlenecking cross-center output.</p>
          <div className="space-y-2">
            {overloaded.map(t => (
              <div key={t.id} className="flex gap-4 items-center">
                 <span className="font-bold text-[13px]">{t.name}</span>
                 <span className="text-[12px] px-2 py-0.5 bg-destructive text-destructive-foreground rounded">{t.workload} / {t.capacity} hrs ({(t.workload / t.capacity * 100).toFixed(0)}%)</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {team.map(t => (
           <div key={t.id} className="bg-card border border-border p-6 rounded-[16px] shadow-sm">
              <h3 className="text-[16px] font-bold text-foreground mb-1">{t.name}</h3>
              <p className="text-[12px] text-muted-foreground mb-4">{t.role}</p>
              
              <div className="flex justify-between items-end mb-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Workload</span>
                <span className={`text-[18px] font-bold ${t.status === 'OVER_CAPACITY' ? 'text-destructive' : t.status === 'AT_CAPACITY' ? 'text-yellow-600' : 'text-foreground'}`}>
                  {t.workload} / {t.capacity}
                </span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div className={`h-full ${t.status === 'OVER_CAPACITY' ? 'bg-destructive' : t.status === 'AT_CAPACITY' ? 'bg-yellow-500' : 'bg-success'}`} style={{ width: `${Math.min((t.workload / t.capacity) * 100, 100)}%` }}></div>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
}
