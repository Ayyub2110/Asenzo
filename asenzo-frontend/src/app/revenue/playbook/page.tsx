"use client";

import React from "react";
import { getRevenue } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function PlaybookPage() {
  const { localData, loading, error } = useAdapter(getRevenue);

  if (loading) return <div className="p-10 animate-pulse h-96 w-full max-w-[1200px] mx-auto bg-muted/20 rounded-[16px]" />;
  if (error || !localData) return <div className="p-10">Error loading Playbook.</div>;

  const { playbooks } = localData;

  return (
    <div className="p-6 md:p-10 max-w-[1500px] mx-auto pb-20">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-[18px] font-bold text-foreground mb-1">Sales Playbook</h1>
          <p className="text-[14px] text-muted-foreground">Reusable sales operating systems and frameworks.</p>
        </div>
        <button className="bg-foreground text-background px-4 py-2 rounded-[8px] text-[12px] font-bold shadow-sm hover:opacity-90">Create Playbook</button>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playbooks?.map(p => (
            <div key={p.id} className="border border-border bg-card rounded-[12px] p-5 hover:border-foreground/30 transition-colors flex flex-col justify-between h-40">
              <div>
                 <div className="flex justify-between items-start mb-3">
                   <span className="text-[10px] font-bold uppercase tracking-widest bg-secondary text-foreground px-2 py-0.5 rounded">{p.stage.replace('_', ' ')}</span>
                   {p.status === 'ACTIVE' && <span className="w-2 h-2 rounded-full bg-success"></span>}
                 </div>
                 <h2 className="text-[15px] font-bold text-foreground leading-tight mb-2">{p.name}</h2>
                 <p className="text-[12px] text-muted-foreground line-clamp-2">{p.purpose}</p>
              </div>
            </div>
          )) || <p className="text-[13px] text-muted-foreground">No playbooks defined.</p>}
      </div>
    </div>
  );
}
