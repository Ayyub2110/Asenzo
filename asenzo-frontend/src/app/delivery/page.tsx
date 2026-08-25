"use client";

import React from "react";
import Link from "next/link";
import { ACTION_MAP } from "@/lib/routing";
import { getDelivery } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function DeliveryCommandPage() {
  const { localData, loading, error } = useAdapter(getDelivery);

  if (loading) {
    return <div className="p-10 animate-pulse h-96 w-full max-w-[1200px] mx-auto bg-muted/20 rounded-[16px]" />;
  }

  if (error || !localData) {
    return <div className="p-10">Error loading Delivery OS.</div>;
  }

  // Calculate high-level pulse stats
  const activeClients = localData.clients.length;
  const onboardingClients = localData.onboardings.length;
  const activeEngagements = localData.engagements.filter(e => e.status === "ACTIVE").length;
  const blockedDeliverables = localData.milestones.filter(m => m.status === "BLOCKED").length;

  let healthCounts = { GREEN: 0, YELLOW: 0, RED: 0 };
  localData.clients.forEach(c => {
    if (c.health.overall === "GREEN") healthCounts.GREEN++;
    else if (c.health.overall === "YELLOW") healthCounts.YELLOW++;
    else if (c.health.overall === "RED") healthCounts.RED++;
  });

  return (
    <div className="p-6 md:p-10 mx-auto w-full pb-32">
      
      {/* 1. DELIVERY PULSE */}
      <section className="mb-12">
        <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-4">Delivery Pulse</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { label: "Active Clients", val: activeClients, href: ACTION_MAP.openClientHealth() },
            { label: "Onboarding", val: onboardingClients, href: ACTION_MAP.openOnboarding() },
            { label: "Engagements", val: activeEngagements, href: ACTION_MAP.openDeliveryProjects() },
            { label: "Milestones Due", val: localData.milestones.length, href: ACTION_MAP.openDeliveryProjects() },
            { label: "Blocked Items", val: blockedDeliverables, alert: blockedDeliverables > 0, href: ACTION_MAP.openDeliveryProjects('blocked') },
            { label: "Renewals", val: localData.renewals.length, href: ACTION_MAP.openRetentionAndProof() },
            { label: "Proof Assets", val: localData.proofs.length, href: ACTION_MAP.openRetentionAndProof() },
            { label: "Health Score", val: "94%", highlight: true, href: ACTION_MAP.openClientHealth() },
          ].map((m, i) => (
             <Link href={m.href} key={i} className={`block p-4 rounded-[12px] border hover:opacity-80 transition-opacity ${m.alert ? 'border-destructive/30 bg-destructive/10' : 'border-border bg-card'}`}>
               <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 mx-auto max-w-full text-clip overflow-hidden whitespace-nowrap ${m.alert ? 'text-destructive' : 'text-muted-foreground'}`}>{m.label}</p>
               <p className={`text-[20px] font-bold leading-none ${m.highlight ? 'text-success' : 'text-foreground'}`}>{m.val}</p>
             </Link>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        
        {/* TODAY'S ACTIONS */}
        <section className="lg:col-span-1 bg-card border border-border p-6 rounded-[16px] flex flex-col shadow-sm">
          <h2 className="text-[11px] font-bold text-foreground uppercase tracking-widest leading-none mb-6">Today's Delivery Actions</h2>
          <div className="flex flex-col gap-4">
             <Link href={ACTION_MAP.openDeliveryProjects('blocked')} className="flex justify-between items-center hover:opacity-80">
                <span className="text-[13px] font-medium text-muted-foreground">Client input overdue</span>
                <span className="bg-destructive text-destructive-foreground px-2 py-0.5 rounded text-[11px] font-bold">1</span>
             </Link>
             <Link href={ACTION_MAP.openDeliveryProjects('review')} className="flex justify-between items-center hover:opacity-80">
                <span className="text-[13px] font-medium text-muted-foreground">Deliverables Awaiting Approval</span>
                <span className="bg-secondary text-foreground px-2 py-0.5 rounded text-[11px] font-bold">2</span>
             </Link>
             <Link href={ACTION_MAP.openOnboarding()} className="flex justify-between items-center hover:opacity-80">
                <span className="text-[13px] font-medium text-muted-foreground">Kickoffs Pending</span>
                <span className="bg-secondary text-foreground px-2 py-0.5 rounded text-[11px] font-bold">0</span>
             </Link>
          </div>
        </section>

        {/* INTELLIGENCE & BOTTLENECKS */}
        <section className="lg:col-span-2 bg-foreground text-background p-6 rounded-[16px] shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-[11px] font-bold text-background/70 uppercase tracking-widest leading-none mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">psychology</span> Delivery Intelligence
              </h2>
              <div className="space-y-4">
                <div className="border border-background/20 rounded-lg p-4 bg-background/5">
                  <h3 className="text-[14px] font-bold mb-1">Strong Case-Study Candidate</h3>
                  <p className="text-[13px] text-background/80 mb-2">Logos Partners is green operationally and has achieved exceptional milestone velocity. They are a strong candidate for a testimonial request.</p>
                  <button className="text-[12px] font-bold bg-background text-foreground px-3 py-1.5 rounded-full">Request permission</button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex items-center gap-6 pt-4 border-t border-background/20">
               <div>
                  <p className="text-[10px] text-background/60 uppercase tracking-widest mb-1">Health Distribution</p>
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1 text-[13px]"><span className="w-2 h-2 rounded-full bg-success"></span> {healthCounts.GREEN} Green</span>
                    <span className="flex items-center gap-1 text-[13px]"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> {healthCounts.YELLOW} Yellow</span>
                    <span className="flex items-center gap-1 text-[13px]"><span className="w-2 h-2 rounded-full bg-destructive"></span> {healthCounts.RED} Red</span>
                  </div>
               </div>
            </div>
        </section>
      </div>

    </div>
  );
}
