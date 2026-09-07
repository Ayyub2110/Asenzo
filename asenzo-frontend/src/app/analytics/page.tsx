"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ACTION_MAP } from "@/lib/routing";

export default function AnalyticsCommandCenter() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading external operational module records
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
     return <div className="p-10 animate-pulse h-96 bg-muted/20 rounded-[16px] m-10"></div>;
  }

  return (
    <div className="p-6 md:p-10 lg:p-12 space-y-10 pb-32">
      
      {/* 4. EXECUTIVE KPI LAYER */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "Revenue", value: "$48,200", trend: "↑ 18.4%", positive: true },
            { label: "Cash Collected", value: "$42,100", trend: "↑ 12.1%", positive: true },
            { label: "Pipeline Value", value: "$840,000", trend: "↓ 2.4%", positive: false },
            { label: "New Customers", value: "8", trend: "↑ 14%", positive: true },
            { label: "Win Rate", value: "24.6%", trend: "↓ 1.2%", positive: false }
          ].map((kpi, idx) => (
             <div key={idx} className="bg-card border border-border p-5 rounded-[12px] flex flex-col justify-between">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{kpi.label}</span>
                <div className="flex items-end justify-between">
                   <span className="text-[24px] font-bold text-foreground">{kpi.value}</span>
                   <span className={`text-[12px] font-bold ${kpi.positive ? 'text-success' : 'text-destructive'}`}>{kpi.trend}</span>
                </div>
             </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="col-span-1 lg:col-span-2 space-y-10">

            {/* 6. WHAT CHANGED */}
            <section className="bg-card border border-border rounded-[16px] p-6 lg:p-8">
               <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-6">What Changed This Period</h2>
               <div className="space-y-4">
                  <div className="flex gap-4 p-4 rounded-xl border border-border/50 bg-success/5 hover:border-success/30 transition-colors">
                     <span className="material-symbols-outlined text-success mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
                     <div>
                        <p className="text-[14px] font-bold text-foreground mb-1">Revenue increased 18%.</p>
                        <p className="text-[12px] text-muted-foreground mb-3">One specific offer (Executive Systems Playbook) generated 42% of new revenue.</p>
                        <Link href={ACTION_MAP.openAnalyticsRevenue()} className="text-[11px] font-bold text-success uppercase tracking-widest hover:underline">View Revenue Analytics</Link>
                     </div>
                  </div>
                  <div className="flex gap-4 p-4 rounded-xl border border-border/50 bg-destructive/5 hover:border-destructive/30 transition-colors">
                     <span className="material-symbols-outlined text-destructive mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>trending_down</span>
                     <div>
                        <p className="text-[14px] font-bold text-foreground mb-1">Qualified leads decreased 9%.</p>
                        <p className="text-[12px] text-muted-foreground mb-3">Organic search volume remains steady, but LinkedIn inbound qualification rate dropped.</p>
                        <Link href={ACTION_MAP.openAnalyticsConversion()} className="text-[11px] font-bold text-destructive uppercase tracking-widest hover:underline">View Conversion Analytics</Link>
                     </div>
                  </div>
               </div>
            </section>

            {/* 5. BUSINESS HEALTH */}
            <section>
               <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-4">Business Health</h2>
               <div className="flex flex-col gap-3">
                  {[
                     { area: "Acquisition", status: "Healthy", metric: "3,420 qualified visits", trend: "+12%", desc: "Content producing stronger lead volume." },
                     { area: "Conversion", status: "Needs Attention", metric: "18.4% win rate", trend: "-4.2%", desc: "Opportunity-to-close rate declining." },
                     { area: "Revenue", status: "Healthy", metric: "$48,200", trend: "+18%", desc: "Strong new customer revenue." },
                     { area: "Delivery", status: "Stable", metric: "91% on-time delivery", trend: "-2%", desc: "Several milestones approaching deadline." },
                     { area: "Operations", status: "Needs Attention", metric: "14 overdue work items", trend: "+5", desc: "Operational backlog increasing." }
                  ].map((sys, idx) => (
                     <div key={idx} className="bg-card border border-border rounded-[12px] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-6 md:w-1/3">
                           <div>
                              <h3 className="text-[14px] font-bold text-foreground mb-1">{sys.area}</h3>
                              <span className={`px-2 py-0.5 rounded-[4px] text-[9px] uppercase font-bold tracking-widest leading-none ${
                                 sys.status === 'Healthy' ? 'bg-success/20 text-success' : 
                                 sys.status === 'Stable' ? 'bg-muted text-muted-foreground' : 
                                 'bg-warning/20 text-warning'
                              }`}>{sys.status}</span>
                           </div>
                        </div>
                        <div className="flex-1">
                           <p className="text-[13px] font-bold text-foreground">{sys.metric} <span className={sys.trend.includes('-') ? 'text-destructive font-semibold' : 'text-success font-semibold'}>{sys.trend}</span></p>
                           <p className="text-[12px] text-muted-foreground">{sys.desc}</p>
                        </div>
                        <button className="shrink-0 bg-secondary text-foreground text-[12px] font-bold px-4 py-2 flex items-center justify-center rounded-[8px] hover:bg-muted transition-colors">
                           Drill Down
                        </button>
                     </div>
                  ))}
               </div>
            </section>
         </div>

         {/* RIGHT COLUMN */}
         <div className="col-span-1 space-y-10">
            {/* 7. NEEDS ATTENTION (Decision Queue) */}
            <section className="bg-destructive/5 border border-destructive/20 rounded-[16px] p-6 lg:p-8">
               <h2 className="text-[11px] font-bold text-destructive uppercase tracking-widest leading-none mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">warning</span> Decision Queue
               </h2>
               <div className="space-y-4">
                  
                  <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
                     <span className="text-[9px] font-bold text-destructive uppercase tracking-widest bg-destructive/10 px-2 py-1 rounded inline-block mb-3">Conversion Rate Declining</span>
                     <p className="text-[13px] font-bold text-foreground mb-2">Lead-to-Opportunity rate has dropped below 20% target baseline.</p>
                     <p className="text-[12px] text-muted-foreground mb-4 font-medium"><strong className="text-foreground">Evidence:</strong> Weekly conversion fell from 24% to 18% over the last 14 days.</p>
                     
                     <div className="flex gap-2">
                        <button className="flex-1 bg-foreground text-background text-[11px] font-bold rounded-lg py-2 uppercase tracking-wide hover:opacity-90">Open Conversion Modules</button>
                     </div>
                  </div>

                  <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
                     <span className="text-[9px] font-bold text-warning uppercase tracking-widest bg-warning/10 px-2 py-1 rounded inline-block mb-3">Stagnant Opportunities</span>
                     <p className="text-[13px] font-bold text-foreground mb-2">3 high-value deals ($42k) are stuck in "Proposal Sent".</p>
                     <p className="text-[12px] text-muted-foreground mb-4 font-medium"><strong className="text-foreground">Evidence:</strong> Time in stage exceeds 14 days threshold.</p>
                     
                     <div className="flex gap-2">
                        <button className="flex-1 bg-secondary text-foreground text-[11px] font-bold rounded-lg py-2 uppercase tracking-wide hover:bg-muted">Review Opportunities</button>
                     </div>
                  </div>

               </div>
            </section>
         </div>
      </div>
    </div>
  );
}
