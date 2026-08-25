"use client";
import React from "react";
import Link from "next/link";
import { getIntelligence } from "@/lib/adapters";
import { ACTION_MAP } from "@/lib/routing";
import { useAdapter } from "@/hooks/useAdapter";

export default function BusinessPulsePage() {
  const { localData, loading, error } = useAdapter(getIntelligence);

  if (loading) return <div className="p-10 animate-pulse h-96 w-full bg-muted/20 rounded-[16px]" />;
  if (error || !localData) return <div className="p-10">Error loading Intelligence.</div>;

  const { pulse, healthMatrix } = localData;

  const pulseMetrics = [
    { label: "Revenue", value: `$${pulse.revenue.toLocaleString()}`, href: ACTION_MAP.openRevenueDashboard() },
    { label: "Pipeline", value: `$${pulse.pipeline.toLocaleString()}`, href: ACTION_MAP.openSalesPipeline() },
    { label: "Qualified Leads", value: pulse.qualifiedLeads, href: ACTION_MAP.openLeadQualification('QUALIFIED') },
    { label: "Conversion Rate", value: `${pulse.conversionRate}%`, href: ACTION_MAP.openConversionAnalytics() },
    { label: "Content Reach", value: pulse.contentReach.toLocaleString(), href: ACTION_MAP.openAcquisitionAnalytics() },
    { label: "Client Outcomes", value: pulse.clientOutcomes, href: ACTION_MAP.openClientHealth() }
  ];

  return (
    <div className="p-6 md:p-10 pb-32">
       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {pulseMetrics.map((p, idx) => (
           <Link href={p.href} key={idx} className="block p-4 bg-card border border-border rounded-[16px] shadow-sm flex flex-col gap-1 hover:border-tertiary/40 transition-colors">
              <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{p.label}</span>
              <span className="text-[24px] font-bold text-foreground truncate">{p.value}</span>
           </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
         <section className="bg-card border border-border p-6 rounded-[16px] shadow-sm">
            <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-6">Executive Answers</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-[14px] font-bold text-foreground mb-1">1. What is the primary constraint?</h3>
                <p className="text-[14px] text-muted-foreground">Acquisition → Qualification (Detected: 14 days ago). Lead volume is up by 22% but qualified-lead rate fell 24%.</p>
              </div>
              <div>
                 <h3 className="text-[14px] font-bold text-foreground mb-1">2. What is working?</h3>
                 <p className="text-[14px] text-muted-foreground">"Founder Systems" content pillar on LinkedIn generating 3.2× more qualified conversations than average. Foundation positioned clearly.</p>
              </div>
              <div>
                 <h3 className="text-[14px] font-bold text-foreground mb-1">3. What should the founder do next?</h3>
                 <p className="text-[14px] text-muted-foreground">Audit the qualification gate, add an explicit revenue boundary question, and re-allocate 20% more production resources to the Problem-Aware content layer.</p>
              </div>
            </div>
         </section>

         <section className="bg-card border border-border p-6 rounded-[16px] shadow-sm">
            <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-6">Operating Center Health</h2>
            <div className="space-y-3">
               {healthMatrix.map((h, i) => (
                  <Link href={h.area === 'Acquisition' ? ACTION_MAP.openAcquisition() : h.area === 'Conversion' ? ACTION_MAP.openConversion() : h.area === 'Revenue' ? ACTION_MAP.openRevenue() : h.area === 'Delivery' ? ACTION_MAP.openDelivery() : h.area === 'Operations' ? ACTION_MAP.openTeamCapacity() : '/'} key={i} className="flex items-center justify-between p-3 rounded-lg bg-background border border-border hover:border-tertiary/40 transition-colors block">
                     <span className="font-bold text-[13px]">{h.area} <span className="text-muted-foreground font-medium ml-2">— {h.metric}</span></span>
                     <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest leading-none ${h.status === 'Healthy' ? 'bg-success/20 text-success' : h.status === 'Warning' ? 'bg-yellow-500/20 text-yellow-600' : 'bg-destructive/20 text-destructive'}`}>{h.status}</span>
                        <span className="text-[14px] font-bold text-foreground text-center w-4">{h.trend === 'Up' ? '↑' : h.trend === 'Down' ? '↓' : '→'}</span>
                     </div>
                  </Link>
               ))}
            </div>
         </section>
      </div>

    </div>
  );
}
