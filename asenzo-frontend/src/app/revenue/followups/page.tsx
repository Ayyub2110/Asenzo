"use client";

import React from "react";
import { getRevenue } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function FollowupPage() {
  const { localData, loading, error } = useAdapter(getRevenue);

  if (loading) return <div className="p-10 animate-pulse h-96 w-full max-w-[1200px] mx-auto bg-muted/20 rounded-[16px]" />;
  if (error || !localData) return <div className="p-10">Error loading Follow-ups.</div>;

  const { followUps, deals } = localData;

  const getDealCompany = (id: string) => deals.find(d => d.id === id)?.company || "Unknown Deal";

  return (
    <div className="p-6 md:p-10 max-w-[1200px] mx-auto pb-20">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-[18px] font-bold text-foreground mb-1">Deal Follow-up Center</h1>
          <p className="text-[14px] text-muted-foreground">Action queue for active revenue opportunities.</p>
        </div>
      </div>

       <div className="flex flex-col gap-4">
          {followUps?.map(f => (
            <div key={f.id} className={`p-5 rounded-[12px] border ${f.status === 'OVERDUE' ? 'border-destructive/30 bg-destructive/5' : 'border-border bg-card'} flex flex-col md:flex-row justify-between md:items-center gap-4`}>
               <div>
                  <div className="flex items-center gap-3 mb-2">
                     <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${f.status === 'OVERDUE' ? 'bg-destructive text-destructive-foreground' : 'bg-secondary text-foreground'}`}>{f.status}</span>
                     <span className="text-[12px] font-bold text-muted-foreground">{getDealCompany(f.dealId)}</span>
                  </div>
                  <h3 className="text-[15px] font-bold text-foreground mb-1">{f.reason}</h3>
                  <p className="text-[13px] text-muted-foreground">Next Action: <span className="font-medium text-foreground">{f.nextAction}</span></p>
               </div>
               
               <div className="flex gap-2 shrink-0">
                  <button className="bg-background border border-border px-3 py-1.5 rounded-[6px] text-[11px] font-bold text-foreground hover:bg-secondary">Snooze</button>
                  <button className="bg-foreground text-background px-4 py-1.5 rounded-[6px] text-[11px] font-bold shadow-sm hover:opacity-90">Open Deal</button>
               </div>
            </div>
          ))}
       </div>
    </div>
  );
}
