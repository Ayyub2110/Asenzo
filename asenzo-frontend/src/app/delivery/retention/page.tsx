"use client";
import React from "react";
import { getDelivery } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function RetentionPage() {
  const { localData, loading, error } = useAdapter(getDelivery);
  if (loading) return <div className="p-10 animate-pulse h-96 w-full" />;
  if (error || !localData) return <div className="p-10">Error.</div>;

  return (
    <div className="p-6 md:p-10 mx-auto w-full pb-32">
      <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-6">Retention & Proof</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* RENEWALS */}
        <div>
           <h3 className="text-[13px] font-bold text-foreground uppercase tracking-widest mb-4">Upcoming Renewals</h3>
           <div className="space-y-3">
              {localData.renewals.length === 0 ? (
                 <div className="p-6 text-center text-muted-foreground bg-card/50 rounded-[12px] border border-border text-[13px]">
                   No upcoming renewals based on active contracts.
                 </div>
              ) : (
                localData.renewals.map(r => {
                   const client = localData.clients.find(c => c.id === r.clientId);
                   return (
                     <div key={r.id} className="p-4 bg-card border border-border rounded-[12px] flex justify-between items-center">
                        <div>
                          <p className="font-bold text-[14px] mb-1">{client?.name}</p>
                          <p className="text-[12px] text-muted-foreground">Renews: {new Date(r.renewalDate).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-0.5 bg-secondary text-[10px] font-bold uppercase rounded block mb-1">{r.status.replace("_", " ")}</span>
                          <span className="text-[12px] font-semibold text-primary">{r.likelihood}% Likelihood</span>
                        </div>
                     </div>
                   )
                })
              )}
           </div>
        </div>

        {/* PROOFS / CASE STUDIES */}
        <div>
           <h3 className="text-[13px] font-bold text-foreground uppercase tracking-widest mb-4">Proof Assets</h3>
           <div className="space-y-3">
              {localData.proofs.length === 0 ? (
                 <div className="p-6 text-center text-muted-foreground bg-card/50 rounded-[12px] border border-border text-[13px]">
                   No pending or published proof assets.
                 </div>
              ) : (
                localData.proofs.map(p => {
                   const client = localData.clients.find(c => c.id === p.clientId);
                   return (
                     <div key={p.id} className="p-4 bg-card border border-border rounded-[12px] flex justify-between items-center">
                        <div>
                          <p className="font-bold text-[14px] mb-1">{client?.name}</p>
                          <p className="text-[12px] text-muted-foreground">Type: {p.type}</p>
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-0.5 bg-secondary text-[10px] font-bold uppercase rounded block mb-1">{p.permissionStatus}</span>
                          <span className="text-[12px] font-semibold text-foreground">{p.verificationStatus}</span>
                        </div>
                     </div>
                   )
                })
              )}
           </div>
        </div>

      </div>
    </div>
  );
}
