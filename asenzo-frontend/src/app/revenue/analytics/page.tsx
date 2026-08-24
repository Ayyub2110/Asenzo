"use client";

import React from "react";
import { getRevenue } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function AnalyticsPage() {
  const { localData, loading, error } = useAdapter(getRevenue);

  if (loading) return <div className="p-10 animate-pulse h-96 w-full max-w-[1200px] mx-auto bg-muted/20 rounded-[16px]" />;
  if (error || !localData) return <div className="p-10">Error loading Revenue Analytics.</div>;

  const { pipelineValue, closedWon, winRate } = localData;

  const formatCurrency = (val: number) => `₹${(val / 100000).toFixed(1)}L`;

  return (
    <div className="p-6 md:p-10 max-w-[1500px] mx-auto pb-20">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-[18px] font-bold text-foreground mb-1">Revenue Dashboard</h1>
          <p className="text-[14px] text-muted-foreground">High-level commercial telemetry and pipeline performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
         <div className="bg-card border border-border p-6 rounded-[12px]">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Total Pipeline</h3>
            <p className="text-[28px] font-bold text-foreground">{formatCurrency(pipelineValue)}</p>
         </div>
         <div className="bg-card border border-border p-6 rounded-[12px]">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Closed Won (YTD)</h3>
            <p className="text-[28px] font-bold text-success">{formatCurrency(closedWon)}</p>
         </div>
         <div className="bg-card border border-border p-6 rounded-[12px]">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Win Rate</h3>
            <p className="text-[28px] font-bold text-foreground">{winRate}%</p>
         </div>
      </div>

       <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Revenue Funnel Drop-off</h2>
      <div className="bg-card border border-border rounded-[16px] p-8 mb-10 flex flex-col md:flex-row justify-between items-center gap-4">
        {[
           { label: "Qualified", value: 32 },
           { label: "Booked", value: 24 },
           { label: "Held", value: 18 },
           { label: "Proposals", value: 11 },
           { label: "Negotiation", value: 7 },
           { label: "Won", value: 4 },
        ].map((step, i, arr) => (
           <div key={i} className="flex flex-col items-center flex-1 w-full relative">
              <div className="w-12 h-12 rounded-full border border-border bg-background flex flex-col items-center justify-center z-10 mb-2">
                 <span className="text-[14px] font-bold text-foreground">{step.value}</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-center">{step.label}</span>
              {i < arr.length - 1 && (
                 <div className="hidden md:block absolute top-6 left-[60%] right-[-40%] h-[1px] bg-border -z-0"></div>
              )}
           </div>
        ))}
      </div>

       <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Revenue Attribution by Source</h2>
       <div className="bg-card border border-border rounded-[16px] p-6">
           <table className="w-full text-left">
              <thead className="border-b border-border">
                 <tr>
                    <th className="pb-3 text-[11px] font-bold text-muted-foreground uppercase">Source</th>
                    <th className="pb-3 text-[11px] font-bold text-muted-foreground uppercase text-right">Revenue</th>
                 </tr>
              </thead>
              <tbody>
                 <tr>
                    <td className="py-3 text-[14px] font-bold text-foreground border-b border-border/50">LinkedIn Organic</td>
                    <td className="py-3 text-[14px] font-bold text-foreground text-right border-b border-border/50">{formatCurrency(600000)}</td>
                 </tr>
                 <tr>
                    <td className="py-3 text-[14px] font-bold text-foreground">Instagram Ads</td>
                    <td className="py-3 text-[14px] font-bold text-foreground text-right">{formatCurrency(240000)}</td>
                 </tr>
              </tbody>
           </table>
       </div>

    </div>
  );
}
