"use client";
import React from "react";
import { getDelivery } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function OnboardingPage() {
  const { localData, loading, error } = useAdapter(getDelivery);

  if (loading) return <div className="p-10 animate-pulse h-96 w-full max-w-[1200px] mx-auto bg-muted/20 rounded-[16px]" />;
  if (error || !localData) return <div className="p-10">Error loading Onboarding.</div>;

  if (localData.onboardings.length === 0) {
    return (
      <div className="p-16 text-center text-muted-foreground bg-card m-6 md:m-10 rounded-[16px] border border-border">
        <h3 className="text-[14px] font-bold text-foreground uppercase tracking-widest mb-2">No active onboarding clients</h3>
        <p className="text-[13px]">Clients appear here automatically when a Revenue deal reaches Closed Won.</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 mx-auto w-full pb-32">
      <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-6">Onboarding Center</h2>
      <div className="space-y-4">
        {localData.onboardings.map(o => {
           const client = localData.clients.find(c => c.id === o.clientId);
           return (
             <div key={o.id} className="p-6 bg-card border border-border rounded-[12px] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
               <div>
                  <h3 className="text-[16px] font-bold text-foreground mb-1">{client?.name || 'Unknown Client'}</h3>
                  <p className="text-[13px] text-muted-foreground flex gap-4">
                    <span>Started: {new Date(o.startDate).toLocaleDateString()}</span>
                    <span>Status: <span className="font-semibold text-foreground">{o.status}</span></span>
                    <span>Health: <span className="font-semibold text-foreground">{o.health}</span></span>
                  </p>
               </div>
               <div className="flex gap-2">
                 <button className="px-3 py-1.5 bg-secondary text-foreground text-[12px] font-bold rounded">View Progress</button>
               </div>
             </div>
           )
        })}
      </div>
    </div>
  );
}
