"use client";
import React from "react";
import { getDelivery } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function ReportingPage() {
  const { localData, loading, error } = useAdapter(getDelivery);
  if (loading) return <div className="p-10 animate-pulse h-96 w-full" />;
  if (error || !localData) return <div className="p-10">Error.</div>;

  return (
    <div className="p-6 md:p-10 mx-auto w-full pb-32">
      <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-6">Reporting</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {localData.reports.length === 0 ? (
          <div className="col-span-full p-16 text-center text-muted-foreground bg-card rounded-[16px] border border-border">
            <h3 className="text-[14px] font-bold text-foreground uppercase tracking-widest mb-2">No Reports Generated</h3>
            <p className="text-[13px]">System generates delivery reports automatically based on milestone achievements.</p>
          </div>
        ) : (
          localData.reports.map(r => {
             const client = localData.clients.find(c => c.id === r.clientId);
             return (
               <div key={r.id} className="p-5 bg-card border border-border rounded-[12px] shadow-sm">
                  <h3 className="text-[15px] font-bold text-foreground mb-1">{client?.name} - {r.type.replace("_", " ")}</h3>
                  <p className="text-[12px] text-muted-foreground mb-4">Generated on {new Date(r.generatedDate).toLocaleDateString()}</p>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="px-2 py-0.5 bg-secondary font-bold uppercase rounded">{r.status}</span>
                    <button className="text-primary font-bold hover:underline">View Report</button>
                  </div>
               </div>
             )
          })
        )}
      </div>
    </div>
  );
}
