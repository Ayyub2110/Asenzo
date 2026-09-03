"use client";

import React from "react";
import Link from "next/link";
import { getRevenue } from "@/lib/adapters";
import { ACTION_MAP } from "@/lib/routing";
import { useAdapter } from "@/hooks/useAdapter";

export default function RevenueCommandPage() {
  const { localData, loading, error } = useAdapter(getRevenue);

  if (loading) return <div className="p-10 animate-pulse h-96 w-full max-w-[1200px] mx-auto bg-muted/20 rounded-[16px]" />;
  if (error || !localData) return <div className="p-10">Error loading Revenue OS.</div>;

  const { deals, proposals, followUps, expectedRevenue, closedWon, closedLost, winRate } = localData;

  const activeDeals = deals.filter(d => !["CLOSED_WON", "CLOSED_LOST"].includes(d.stage));
  const qualifiedPipelineNum = activeDeals.reduce((sum, d) => sum + d.value, 0);

  const formatCurrency = (val: number) => `₹${(val / 100000).toFixed(1)}L`;

  return (
    <div className="p-6 md:p-10 mx-auto w-full max-w-[1500px] pb-32">
      
      {/* 1. REVENUE PULSE */}
      <section className="mb-12">
        <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-4">Revenue Pulse</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { label: "Active Deals", val: activeDeals.length, href: ACTION_MAP.openSalesPipeline() },
            { label: "Pipeline", val: formatCurrency(qualifiedPipelineNum), href: ACTION_MAP.openSalesPipeline() },
            { label: "Expected Rev", val: formatCurrency(expectedRevenue), href: ACTION_MAP.openSalesPipeline() },
            { label: "Proposals Out", val: proposals.filter(p => p.status === 'SENT' || p.status === 'VIEWED' || p.status === 'NEGOTIATION').length, href: ACTION_MAP.openProposals() },
            { label: "Follow-ups Due", val: followUps.filter(f => f.status === 'DUE' || f.status === 'OVERDUE').length, alert: followUps.some(f => f.status === 'OVERDUE'), href: ACTION_MAP.openFollowUps() },
            { label: "Closed Won", val: formatCurrency(closedWon), highlight: true, href: ACTION_MAP.openSalesPipeline('closed_won') },
            { label: "Closed Lost", val: formatCurrency(closedLost), href: ACTION_MAP.openClosedLost() },
            { label: "Win Rate", val: `${winRate}%`, highlight: true, href: ACTION_MAP.openRevenueDashboard() },
          ].map((m, i) => (
             <Link href={m.href} key={i} className={`block p-4 rounded-[12px] border hover:opacity-80 transition-opacity ${m.alert ? 'border-destructive/30 bg-destructive/10' : 'border-border bg-card'}`}>
               <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 mx-auto max-w-full text-clip overflow-hidden whitespace-nowrap ${m.alert ? 'text-destructive' : 'text-muted-foreground'}`}>{m.label}</p>
               <p className={`text-[20px] font-bold leading-none ${m.highlight ? 'text-success' : 'text-foreground'}`}>{m.val}</p>
             </Link>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        
        {/* TODAY'S REVENUE ACTIONS */}
        <section className="lg:col-span-1 bg-card border border-border p-6 rounded-[16px] flex flex-col shadow-sm">
          <h2 className="text-[11px] font-bold text-foreground uppercase tracking-widest leading-none mb-6">Today's Revenue Actions</h2>
          <div className="flex flex-col gap-4">
             <Link href={ACTION_MAP.openProposals()} className="flex justify-between items-center hover:opacity-80">
                <span className="text-[13px] font-medium text-muted-foreground">Proposals to Send</span>
                <span className="bg-destructive text-destructive-foreground px-2 py-0.5 rounded text-[11px] font-bold">1</span>
             </Link>
             <Link href={ACTION_MAP.openFollowUps()} className="flex justify-between items-center hover:opacity-80">
                <span className="text-[13px] font-medium text-muted-foreground">Follow-ups Due</span>
                <span className="bg-warning text-warning-foreground px-2 py-0.5 rounded text-[11px] font-bold">{followUps.filter(f => f.status === 'OVERDUE' || f.status === 'DUE').length}</span>
             </Link>
             <Link href={ACTION_MAP.openSalesPipeline('at_risk')} className="flex justify-between items-center hover:opacity-80">
                <span className="text-[13px] font-medium text-muted-foreground">Deals at Risk</span>
                <span className="bg-secondary text-foreground px-2 py-0.5 rounded text-[11px] font-bold">0</span>
             </Link>
          </div>
        </section>

        {/* REVENUE BOTTLENECKS */}
        <section className="lg:col-span-2 bg-foreground text-background p-6 rounded-[16px] shadow-sm flex flex-col justify-center">
            <h2 className="text-[11px] font-bold text-background/70 uppercase tracking-widest leading-none mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">warning</span> Revenue Bottlenecks
            </h2>
            <h3 className="text-[20px] font-bold mb-2">Proposal Bottleneck</h3>
            <p className="text-[14px] font-medium text-background/80">3 qualified opportunities are stalling at the proposal drafting stage.</p>
        </section>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         <section>
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Top Active Deals</h2>
               <Link href={ACTION_MAP.openSalesPipeline()} className="text-[11px] font-bold uppercase text-foreground bg-secondary px-2 py-1 rounded hover:bg-muted transition-colors">View Pipeline</Link>
            </div>
            
            <div className="flex flex-col gap-3">
             {activeDeals.map(d => (
                <Link href={ACTION_MAP.openSalesPipeline()} key={d.id} className="block hover:opacity-80">
                  <div className="p-4 border border-border rounded-[10px] bg-card flex justify-between items-center">
                     <div>
                       <p className="text-[14px] font-bold text-foreground">{d.company}</p>
                       <p className="text-[12px] font-medium text-muted-foreground">{formatCurrency(d.value)} • Expected {new Date(d.expectedCloseDate).toLocaleDateString()}</p>
                     </div>
                     <div className="text-right flex flex-col items-end">
                       <span className="text-[10px] font-bold tracking-widest uppercase bg-secondary text-foreground px-2 py-0.5 rounded mb-1">{d.stage.replace('_', ' ')}</span>
                       <span className="text-[11px] text-muted-foreground">Confidence: <span className="font-bold">{d.confidence}</span></span>
                     </div>
                  </div>
                  
                  {/* Attribution Lineage injected here (Phase 6) */}
                  <div className="px-4 py-2 bg-muted/20 border-t border-border rounded-b-[10px] flex items-center justify-between text-[10px] text-muted-foreground">
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <span className="material-symbols-outlined text-[12px]">account_tree</span>
                      <span className="font-semibold uppercase tracking-wider">Source: </span> {d.source || "Unknown"}
                    </div>
                    {d.originalContent && (
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground max-w-[200px]">
                        <span className="material-symbols-outlined text-[12px]">article</span>
                        <span className="truncate">{d.originalContent}</span>
                      </div>
                    )}
                  </div>
                </Link>
             ))}
           </div>
         </section>
         <section>
             <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-4">Recent Losses (Learning)</h2>
             <Link href={ACTION_MAP.openClosedLost()} className="block border border-border rounded-[10px] bg-card hover:opacity-80 overflow-hidden">
                 <div className="p-4 bg-card">
                   <p className="text-[14px] font-bold text-foreground">Pending Brand Restructure</p>
                   <p className="text-[12px] font-medium text-muted-foreground mb-3">{formatCurrency(200000)} • Lost in NEGOTIATION</p>
                   <div className="bg-destructive/10 border border-destructive/20 text-destructive text-[11px] font-bold p-2 flex uppercase tracking-wide rounded">Reason: Price (Too expensive for Q3 Budget)</div>
                 </div>
                 <div className="px-4 py-2 bg-muted/20 border-t border-border flex justify-between items-center text-[10px] text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[12px]">account_tree</span>
                      <span className="font-semibold uppercase tracking-wider">Source: </span> Outbound AI Agent
                    </div>
                 </div>
             </Link>
         </section>
       </div>
    </div>
  );
}
