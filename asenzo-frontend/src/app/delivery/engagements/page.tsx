"use client";
import React from "react";
import { getDelivery } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function EngagementsPage() {
  const { localData, loading, error } = useAdapter(getDelivery);
  if (loading) return <div className="p-10 animate-pulse h-96 w-full" />;
  if (error || !localData) return <div className="p-10">Error.</div>;

  return (
    <div className="p-6 md:p-10 mx-auto w-full pb-32">
      <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-6">Engagement Center</h2>
      <div className="space-y-4">
        {localData.engagements.map(e => {
           const client = localData.clients.find(c => c.id === e.clientId);
           return (
             <div key={e.id} className="p-6 bg-card border border-border rounded-[12px] shadow-sm">
                <div className="flex justify-between mb-2">
                  <h3 className="text-[16px] font-bold text-foreground">{e.name}</h3>
                  <span className="font-semibold text-[13px] text-muted-foreground">{e.progress}% Complete</span>
                </div>
                <p className="text-[13px] text-muted-foreground mb-4">Client: <span className="text-foreground">{client?.name}</span> | Offer: <span className="text-foreground">{e.offer}</span> | Status: <span className="text-foreground">{e.status}</span></p>
                <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${e.progress}%` }}></div>
                </div>
             </div>
           )
        })}
      </div>
    </div>
  );
}
