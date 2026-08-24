"use client";
import React from "react";
import { getDelivery } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function CommunicationPage() {
  const { localData, loading, error } = useAdapter(getDelivery);
  if (loading) return <div className="p-10 animate-pulse h-96 w-full" />;
  if (error || !localData) return <div className="p-10">Error.</div>;

  return (
    <div className="p-6 md:p-10 mx-auto w-full pb-32">
      <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-6">Client Communication Center</h2>
      <div className="space-y-4">
        {localData.communications.map(c => {
           const client = localData.clients.find(cl => cl.id === c.clientId);
           return (
             <div key={c.id} className="p-5 bg-card border border-border rounded-[12px] shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-muted-foreground text-[16px]">{c.type === 'MEETING' ? 'videocam' : 'mail'}</span>
                    <h3 className="text-[14px] font-bold text-foreground">{client?.name}</h3>
                  </div>
                  <span className="px-2 py-0.5 bg-secondary text-[10px] font-bold uppercase rounded">{c.status.replace("_", " ")}</span>
                </div>
                <p className="text-[13px] text-muted-foreground mb-3">{c.summary}</p>
                <div className="text-[11px] text-muted-foreground">
                  <span>{new Date(c.date).toLocaleString()}</span>
                </div>
             </div>
           )
        })}
      </div>
    </div>
  );
}
