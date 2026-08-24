"use client";

import React from "react";
import { getRevenue } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function CloserRoomPage() {
  const { localData, loading, error } = useAdapter(getRevenue);

  if (loading) return <div className="p-10 animate-pulse h-96 w-full max-w-[1200px] mx-auto bg-muted/20 rounded-[16px]" />;
  if (error || !localData) return <div className="p-10">Error loading Closer Room.</div>;

  const deal = localData.deals.find(d => d.id === 'd1');
  const formatCurrency = (val: number) => `₹${(val / 100000).toFixed(1)}L`;

  if (!deal) return <div className="p-10">No active deal in room.</div>;

  return (
    <div className="w-full flex flex-col md:flex-row h-[calc(100vh-48px)] overflow-hidden">
      
      {/* CENTER: DEAL EXECUTION */}
      <div className="flex-1 bg-background flex flex-col border-r border-border overflow-y-auto">
         
         {/* HEADER */}
         <div className="p-6 md:p-10 border-b border-border bg-card">
           <div className="flex justify-between items-start mb-4">
             <div>
               <h1 className="text-[20px] font-bold text-foreground mb-1">{deal.company} • {deal.offer}</h1>
               <p className="text-[13px] text-muted-foreground">Owner: {deal.owner}</p>
             </div>
             <div className="text-right">
                <p className="text-[24px] font-bold text-foreground leading-none mb-1">{formatCurrency(deal.value)}</p>
                <div className="flex gap-2 justify-end">
                   <span className="text-[10px] font-bold uppercase tracking-widest bg-secondary px-2 py-1 rounded">{deal.stage.replace('_', ' ')}</span>
                </div>
             </div>
           </div>
         </div>

         {/* MAIN PANELS */}
         <div className="p-6 md:p-10 space-y-10">
            <section>
              <div className="flex justify-between items-center mb-4">
                 <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest">Buyer Brief</h2>
                 <button className="text-[11px] font-bold text-foreground uppercase tracking-widest">Edit</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-card border border-border p-6 rounded-[12px]">
                 <div>
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">ICP Fit</h3>
                    <p className="text-[13px] font-bold text-success">{deal.icp}</p>
                 </div>
                 <div>
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Source Context</h3>
                    <p className="text-[13px] font-medium text-foreground">{deal.source} ({deal.campaign})</p>
                 </div>
              </div>
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                 <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest">Deal Strategy</h2>
                 <button className="text-[11px] font-bold text-foreground uppercase tracking-widest">Update</button>
              </div>
              <div className="bg-card border border-border p-6 rounded-[12px]">
                 <div className="mb-6">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Primary Objective</h3>
                    <p className="text-[14px] text-foreground">Secure full OS implementation by EOM to utilize available Q3 budget. Buyer needs alignment on time commitment.</p>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                       <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Known Risks & Objections</h3>
                       <ul className="text-[13px] text-foreground space-y-2 list-disc pl-4">
                         <li>Too expensive for Q3</li>
                         <li>Doesn't want to sound automated</li>
                       </ul>
                    </div>
                    <div>
                       <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Proof/Assets Needed</h3>
                       <p className="text-[13px] text-foreground">Brand voice synthesis case study.</p>
                    </div>
                 </div>
              </div>
            </section>
         </div>

      </div>

      {/* RIGHT: DEAL HEALTH & ACTION */}
      <div className="w-full md:w-[350px] bg-card flex flex-col shrink-0">
          <div className="p-4 border-b border-border bg-foreground text-background">
          <h2 className="text-[12px] font-bold uppercase tracking-widest leading-none">Status: Healthy</h2>
        </div>
        <div className="p-6 space-y-6">
           <div>
              <h3 className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-2">Expected Close Date</h3>
              <div className="bg-background border border-border px-3 py-2 rounded-[8px] text-[13px] font-bold text-foreground">
                {new Date(deal.expectedCloseDate).toLocaleDateString()}
              </div>
           </div>
           <div>
              <h3 className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-2">Confidence Level</h3>
              <div className="bg-success/10 border border-success/30 px-3 py-2 rounded-[8px] text-[13px] font-bold text-success">
                {deal.confidence} ({deal.probability}%)
              </div>
           </div>
           <div>
              <h3 className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-2">Next Action</h3>
              <div className="bg-background border border-border p-3 rounded-[8px]">
                 <p className="text-[12px] font-bold text-foreground mb-1">{deal.nextAction}</p>
                 <p className="text-[11px] text-muted-foreground">Due: Today</p>
                 <button className="mt-3 w-full bg-secondary text-foreground text-[11px] font-bold py-1.5 rounded-[4px]">Log Activity</button>
              </div>
           </div>
           <div>
              <h3 className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-2">Advance Deal</h3>
              <button className="w-full bg-foreground text-background font-bold text-[12px] py-2 rounded-[8px] hover:opacity-90 shadow-sm">Mark Closed Won</button>
              <button className="w-full mt-2 bg-transparent text-destructive border border-destructive/20 font-bold text-[12px] py-2 rounded-[8px] hover:bg-destructive/10">Mark Closed Lost</button>
           </div>
        </div>
      </div>

    </div>
  );
}
