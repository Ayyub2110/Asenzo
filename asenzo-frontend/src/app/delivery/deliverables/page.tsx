"use client";
import React from "react";
import { getDelivery } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function DeliverablesPage() {
  const { localData, loading, error } = useAdapter(getDelivery);
  if (loading) return <div className="p-10 animate-pulse h-96 w-full" />;
  if (error || !localData) return <div className="p-10">Error.</div>;

  return (
    <div className="p-6 md:p-10 mx-auto w-full pb-32">
      <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-6">Deliverables Center</h2>
      <div className="space-y-3">
        {localData.deliverables.map(d => {
           const client = localData.clients.find(c => c.id === d.clientId);
           return (
             <div key={d.id} className="p-4 bg-card border border-border rounded-[12px] shadow-sm flex justify-between items-center">
                <div>
                  <h3 className="text-[15px] font-bold text-foreground mb-1">{d.name}</h3>
                  <p className="text-[12px] text-muted-foreground">Client: {client?.name} • Type: {d.type} • Due: {new Date(d.dueDate).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-2 py-0.5 bg-secondary text-[10px] font-bold uppercase rounded">{d.status.replace("_", " ")}</span>
                  <button className="text-[12px] font-bold text-primary hover:underline">Review</button>
                </div>
             </div>
           )
        })}
      </div>
    </div>
  );
}
