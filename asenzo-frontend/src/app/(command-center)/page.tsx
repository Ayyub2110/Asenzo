"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ACTION_MAP } from "@/lib/routing";
import {
  getCommandCenter,
  getFoundation,
  getIntelligence,
  getConversion,
  getRevenue,
  getOperations
} from "@/lib/adapters";
import {
  FoundationData,
  IntelligenceData,
  ConversionData,
  RevenueData,
  OperationsData,
  CommandCenterData
} from "@/lib/types";

// Re-using old definitions that existed in page.tsx
import { mockCommandData, PrimaryConstraint, TodayAction, ApprovalItem } from "@/lib/mockCommandData";

interface PageData {
  cmd: typeof mockCommandData | null;
  foundation: FoundationData | null;
  intelligence: IntelligenceData | null;
  conversion: ConversionData | null;
  revenue: RevenueData | null;
  operations: OperationsData | null;
}

export default function CommandCenterPage() {
  const router = useRouter();
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [
          foundation,
          intelligence,
          conversion,
          revenue,
          operations
        ] = await Promise.all([
          getFoundation().catch(() => null),
          getIntelligence().catch(() => null),
          getConversion().catch(() => null),
          getRevenue().catch(() => null),
          getOperations().catch(() => null)
        ]);

        setData({
          cmd: mockCommandData,
          foundation,
          intelligence,
          conversion,
          revenue,
          operations
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || !data) {
    return (
      <div className="p-6 md:p-10 lg:p-12 max-w-[1360px] mx-auto w-full space-y-8 animate-pulse">
        <div className="h-8 bg-muted rounded w-48 mb-6"></div>
        <div className="h-[280px] bg-muted/50 rounded-[16px] border border-border mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="h-64 bg-muted/50 rounded-[12px] border border-border"></div>
          <div className="h-64 bg-muted/50 rounded-[12px] border border-border"></div>
        </div>
      </div>
    );
  }

  const { cmd, foundation, intelligence, conversion, revenue, operations } = data;
  const foundationStatus = foundation?.readiness?.status || "Unknown";
  const activeConstraint = intelligence?.constraints?.find(c => c.status === "ACTIVE") || cmd?.primaryConstraint;

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1500px] mx-auto w-full pb-32 space-y-10">

      {/* 1. EXECUTIVE HEADER */}
      <div className="flex flex-col mt-2">
        <h1 className="text-[24px] font-bold tracking-tight text-foreground uppercase mb-1">WELCOME, ALEX</h1>
        <p className="text-[14px] text-muted-foreground font-medium">
          Good morning. Your attention engine is stable, but <strong className="text-foreground">Acquisition → Qualification</strong> is currently the primary constraint.
        </p>
      </div>

      {/* BUSINESS PULSE (Migrated) */}
      <section>
        <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-4">Business Pulse</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Qualified Leads", value: intelligence?.pulse?.qualifiedLeads || cmd?.pulse[0].value, status: 'success', href: ACTION_MAP.openLeadQualification('QUALIFIED') },
            { label: "Pipeline Value", value: `$${intelligence?.pulse?.pipeline?.toLocaleString() || '1.8M'}`, status: 'neutral', href: ACTION_MAP.openSalesPipeline() },
            { label: "Client Risk", value: intelligence?.pulse?.retentionRisk || 1, status: 'warning', href: ACTION_MAP.openClientHealth('at_risk') },
            { label: "Content Queue", value: "8", status: 'attention', href: ACTION_MAP.openProductionQueue() },
            { label: "Pending Approvals", value: cmd?.approvals.filter(a => a.status === 'PENDING_REVIEW').length || 3, status: 'destructive', href: ACTION_MAP.openApprovals() }
          ].map((p, i) => (
            <Link href={p.href} key={i} className="block p-4 border border-border bg-card rounded-[12px] hover:border-tertiary/40 transition-colors">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 truncate">{p.label}</p>
              <span className={`text-[24px] font-bold ${p.status === 'success' ? 'text-foreground' : p.status === 'warning' ? 'text-warning' : p.status === 'destructive' ? 'text-destructive' : 'text-foreground'}`}>
                {p.value}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* EXECUTIVE ANSWERS & SYSTEM HEALTH */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
         {/* EXECUTIVE ANSWERS */}
         <div className="bg-card border border-border p-6 rounded-[16px] shadow-sm">
            <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-6">Executive Answers</h2>
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
         </div>

         {/* SYSTEM COMPONENT HEALTH */}
         <div className="bg-card border border-border p-6 rounded-[16px] shadow-sm flex flex-col">
            <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-6">System Component Health</h2>
            <div className="grid grid-cols-2 gap-3 flex-1 h-full">
               {intelligence?.healthMatrix?.map((h, i) => (
                  <Link href={h.area === 'Acquisition' ? ACTION_MAP.openAcquisition() : h.area === 'Conversion' ? ACTION_MAP.openConversion() : h.area === 'Revenue' ? ACTION_MAP.openRevenue() : h.area === 'Delivery' ? ACTION_MAP.openDelivery() : h.area === 'Operations' ? ACTION_MAP.openTeamCapacity() : '/'} key={i} className={`p-4 rounded-xl border border-border hover:border-foreground/30 transition-colors flex flex-col justify-between ${h.status === 'Critical' ? 'bg-destructive/5 border-destructive/20' : 'bg-background'}`}>
                     <div className="flex justify-between items-start mb-4">
                        <span className="font-bold text-[14px] text-foreground">{h.area}</span>
                        <span className={`px-2 py-0.5 rounded-[4px] text-[9px] uppercase font-bold tracking-widest leading-none ${h.status === 'Healthy' ? 'bg-success/20 text-success' : h.status === 'Warning' ? 'bg-yellow-500/20 text-yellow-600' : 'bg-destructive/20 text-destructive'}`}>{h.status}</span>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-[11px] font-medium max-w-[70%] truncate leading-tight">{h.metric}</span>
                        <span className={`text-[16px] font-bold ${h.trend === 'Down' && h.status === 'Critical' ? 'text-destructive' : 'text-foreground'}`}>{h.trend === 'Up' ? '↗' : h.trend === 'Down' ? '↘' : '→'}</span>
                     </div>
                  </Link>
               ))}
            </div>
         </div>
      </section>

      {/* OPERATIONS INTELLIGENCE & FOUNDER INDEPENDENCE */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-1 lg:col-span-2 bg-card border border-border p-6 rounded-[16px] shadow-sm">
            <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-6 flex items-center gap-2">
              Founder Independence
            </h2>
            <div className="flex flex-col md:flex-row gap-8 items-center">
               <div className="w-32 h-32 rounded-full border-8 border-success flex items-center justify-center shrink-0">
                  <span className="text-4xl font-bold text-foreground">{intelligence?.founderDependency?.score || 68}</span>
               </div>
               <div>
                  <p className="text-[14px] text-muted-foreground mb-4">{intelligence?.founderDependency?.summary}</p>
                  <p className="text-[12px] font-bold text-foreground uppercase tracking-widest mb-2">Major Dependency Sources:</p>
                  <ul className="space-y-1">
                     {intelligence?.founderDependency?.majorSources.map((s,i) => (
                        <li key={i} className="text-[13px] text-muted-foreground flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-destructive"></span> {s}</li>
                     ))}
                  </ul>
               </div>
            </div>
          </div>
          
          <div className="bg-card border border-primary/20 relative overflow-hidden p-6 rounded-[16px] shadow-sm">
            <div className="absolute -top-4 -right-4 p-4 opacity-5 pointer-events-none">
              <span className="material-symbols-outlined text-9xl">robot_2</span>
            </div>
            <h2 className="text-[11px] font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span> Operations Intelligence
            </h2>
            <p className="text-[13px] leading-relaxed relative z-10 text-muted-foreground mt-4">
              Operations is generally healthy, but <strong className="text-foreground">1 critical issue</strong> requires attention. Content Pipeline Velocity is blocked by Founder review bottlenecks. <strong>Sarah Chen</strong> is currently operating at 112% capacity.
            </p>
          </div>
      </section>

      {/* CONSTRAINTS, OPPORTUNITIES, RISKS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {/* CONSTRAINTS */}
         <div className="bg-card border border-border p-6 rounded-[16px]">
            <h2 className="text-[11px] font-bold text-destructive uppercase tracking-widest leading-none mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">warning</span> Active Constraints
            </h2>
            <div className="space-y-4">
               {intelligence?.constraints?.map(c => (
                  <div key={c.id} className="p-4 bg-destructive/5 border border-destructive/20 rounded-xl">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-destructive mb-1 block">{c.affectedCenter}</span>
                     <h4 className="text-[14px] font-bold text-foreground mb-2">{c.constraint}</h4>
                     <p className="text-[12px] text-muted-foreground mb-3">{c.evidence}</p>
                     <p className="text-[12px] font-bold text-foreground">Action: {c.recommendedAction}</p>
                  </div>
               ))}
            </div>
         </div>

         {/* OPPORTUNITIES */}
         <div className="bg-card border border-border p-6 rounded-[16px]">
            <h2 className="text-[11px] font-bold text-success uppercase tracking-widest leading-none mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">lightbulb</span> Opportunities
            </h2>
            <div className="space-y-4">
               {intelligence?.opportunities?.map(o => (
                  <div key={o.id} className="p-4 bg-success/5 border border-success/20 rounded-xl">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-success mb-1 block">Impact: {o.expectedImpact}</span>
                     <h4 className="text-[14px] font-bold text-foreground mb-2">{o.opportunity}</h4>
                     <p className="text-[12px] text-muted-foreground">{o.evidence}</p>
                  </div>
               ))}
            </div>
         </div>

         {/* RISKS */}
         <div className="bg-card border border-border p-6 rounded-[16px]">
            <h2 className="text-[11px] font-bold text-warning uppercase tracking-widest leading-none mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">policy</span> Active Risks
            </h2>
            <div className="space-y-4">
               {intelligence?.risks?.map(r => (
                  <div key={r.id} className="p-4 bg-warning/5 border border-warning/20 rounded-xl">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-warning mb-1 block">{r.category} Risk</span>
                     <h4 className="text-[14px] font-bold text-foreground mb-2">{r.risk}</h4>
                     <p className="text-[12px] text-muted-foreground">{r.businessImpact}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* STRATEGIC RECOMMENDATIONS & ATTRIBUTION */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* RECOMMENDATIONS */}
         <div className="bg-card border border-border p-6 rounded-[16px]">
            <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-6">Strategic Recommendations</h2>
            <div className="space-y-4">
               {intelligence?.recommendations?.map(rec => (
                  <div key={rec.id} className="p-4 border border-border rounded-xl hover:border-tertiary/40 transition-colors">
                     <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{rec.affectedCenter}</span>
                        <span className="text-[10px] font-bold bg-muted px-2 py-0.5 rounded">{rec.priority} PRIORITY</span>
                     </div>
                     <h4 className="text-[14px] font-bold text-foreground mb-2">{rec.recommendation}</h4>
                     <p className="text-[12px] text-muted-foreground mb-3">{rec.evidence}</p>
                     <p className="text-[12px] font-bold text-success flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">trending_up</span> {rec.expectedImpact}</p>
                  </div>
               ))}
            </div>
         </div>

         {/* ATTRIBUTION */}
         <div className="bg-card border border-border p-6 rounded-[16px]">
            <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-6">Revenue Attribution</h2>
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="border-b border-border">
                        <th className="pb-3 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Source</th>
                        <th className="pb-3 text-[11px] font-bold text-muted-foreground uppercase tracking-widest text-right">Leads</th>
                        <th className="pb-3 text-[11px] font-bold text-muted-foreground uppercase tracking-widest text-right">Qualified</th>
                        <th className="pb-3 text-[11px] font-bold text-muted-foreground uppercase tracking-widest text-right">Revenue</th>
                     </tr>
                  </thead>
                  <tbody>
                     {intelligence?.attribution?.map(a => (
                        <tr key={a.id} className="border-b border-border/50 last:border-0">
                           <td className="py-3 text-[13px] font-bold text-foreground">{a.source}</td>
                           <td className="py-3 text-[13px] text-muted-foreground text-right">{a.leads}</td>
                           <td className="py-3 text-[13px] text-muted-foreground text-right">{a.qualified}</td>
                           <td className="py-3 text-[13px] font-bold text-success text-right">${a.revenue.toLocaleString()}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </section>

    </div>
  );
}
