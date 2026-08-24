"use client";
import React from "react";
import Link from "next/link";
import { getDelivery } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function ClientsPage() {
  const { localData, loading, error } = useAdapter(getDelivery);

  if (loading) return <div className="p-10 animate-pulse h-96 w-full max-w-[1200px] mx-auto bg-muted/20 rounded-[16px]" />;
  if (error || !localData) return <div className="p-10">Error loading Clients.</div>;

  if (localData.clients.length === 0) {
    return (
      <div className="p-16 text-center text-muted-foreground bg-card m-6 md:m-10 rounded-[16px] border border-border">
        <h3 className="text-[14px] font-bold text-foreground uppercase tracking-widest mb-2">No active clients</h3>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 mx-auto w-full pb-32">
      <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-6">Client Portal</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {localData.clients.map(c => {
           const contracts = localData.contracts.filter(ct => ct.clientId === c.id);
           return (
             <div key={c.id} className="p-6 bg-card border border-border rounded-[16px] shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[18px] font-bold text-foreground mb-1">{c.name}</h3>
                    <p className="text-[13px] text-muted-foreground">{c.company} — {c.icp}</p>
                  </div>
                  <span className={`px-2 py-1 text-[10px] font-bold rounded ${c.health.overall === 'GREEN' ? 'bg-success/20 text-success' : c.health.overall === 'YELLOW' ? 'bg-yellow-500/20 text-yellow-600' : 'bg-destructive/20 text-destructive'}`}>Health: {c.health.overall}</span>
                </div>
                
                <div className="bg-background/50 border border-border rounded-lg p-3 text-[13px]">
                   <p className="font-semibold mb-2">Active Contracts</p>
                   {contracts.length === 0 ? <span className="text-muted-foreground">None</span> : contracts.map(ct => (
                     <div key={ct.id} className="flex justify-between mt-1">
                        <span>{ct.offer}</span>
                        <span className="font-semibold text-foreground">${ct.value.toLocaleString()}</span>
                     </div>
                   ))}
                </div>

                <div className="flex gap-2 mt-2">
                   <Link href={`/delivery/clients/${c.id}`} className="flex-1 flex justify-center items-center px-3 py-1.5 bg-primary text-primary-foreground text-[12px] font-bold rounded">
                     Open Portal
                   </Link>
                </div>
             </div>
           )
        })}
      </div>
    </div>
  );
}
