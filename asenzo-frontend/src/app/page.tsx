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
  getDelivery,
  getOperations
} from "@/lib/adapters";
import {
  FoundationData,
  IntelligenceData,
  ConversionData,
  RevenueData,
  DeliveryData,
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
  delivery: DeliveryData | null;
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
          delivery,
          operations
        ] = await Promise.all([
          getFoundation().catch(() => null),
          getIntelligence().catch(() => null),
          getConversion().catch(() => null),
          getRevenue().catch(() => null),
          getDelivery().catch(() => null),
          getOperations().catch(() => null)
        ]);

        setData({
          cmd: mockCommandData,
          foundation,
          intelligence,
          conversion,
          revenue,
          delivery,
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

  const { cmd, foundation, intelligence, conversion, revenue, delivery, operations } = data;
  const foundationStatus = foundation?.readiness?.status || "Unknown";
  const activeConstraint = intelligence?.constraints?.find(c => c.status === "ACTIVE") || cmd?.primaryConstraint;

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1360px] mx-auto w-full pb-32">

      {/* 1. EXECUTIVE HEADER */}
      <div className="flex flex-col mb-10 mt-2">
        <h1 className="text-[24px] font-bold tracking-tight text-foreground uppercase mb-1">WELCOME, ALEX</h1>
        <p className="text-[14px] text-muted-foreground font-medium">
          Good morning. Your attention engine is stable, but <strong className="text-foreground">Acquisition → Qualification</strong> is currently the primary constraint.
        </p>
      </div>



      {/* 3. BUSINESS PULSE */}
      <section className="mb-10">
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

      {/* 4. PRIMARY CONSTRAINT */}
      {activeConstraint && (
        <section className="mb-10 relative">
          <div className="flex items-center gap-3 mb-4 select-none">
            <span className="w-2 h-2 rounded-full bg-destructive animate-pulse"></span>
            <h2 className="text-[11px] font-bold text-destructive uppercase tracking-widest leading-none">Primary Constraint Diagnosis</h2>
          </div>
          <div className="border border-destructive/30 bg-destructive/5 rounded-[12px] p-6 lg:p-8 flex flex-col md:flex-row gap-8 justify-between items-start">
            <div className="max-w-2xl">
              <h3 className="text-[20px] font-bold text-foreground leading-tight mb-2">
                {(activeConstraint as any).constraint || (activeConstraint as any).title}
              </h3>
              <p className="text-[14px] text-muted-foreground font-medium mb-6">
                {(activeConstraint as any).evidence || (activeConstraint as any).explanation}
              </p>

              <div className="bg-background/80 p-4 border border-border rounded-lg inline-block">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Recommended Action</p>
                <p className="text-[13px] font-bold text-foreground">{(activeConstraint as any).recommendedAction}</p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Affected Center</p>
              <p className="text-[14px] font-bold text-foreground uppercase tracking-widest mb-4">{(activeConstraint as any).affectedCenter || (activeConstraint as any).sourceCenter}</p>
              <button className="bg-foreground text-background px-6 py-2.5 rounded-[8px] text-[13px] font-semibold transition-all hover:bg-foreground/90 shadow-sm" onClick={() => router.push(ACTION_MAP.openConstraints((activeConstraint as any).id))}>
                Resolve Constraint
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 5. TODAY'S ACTION QUEUE & APPROVAL INBOX */}
      <section className="mb-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Action Queue */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Today's Action Queue</h2>
          </div>
          <div className="flex flex-col gap-3">
            {cmd?.todayActions.slice(0, 3).map((action, i) => (
              <div key={i} className="border border-border bg-card rounded-[12px] p-5 hover:border-tertiary/40 transition-colors flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${action.priority === 'P0' ? 'bg-destructive/20 text-destructive' : 'bg-warning/20 text-warning'}`}>
                      {action.priority === 'P0' ? 'High Priority' : 'Medium Priority'}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground">{action.source}</span>
                  </div>
                  <h4 className="text-[14px] font-bold text-foreground leading-tight mb-1">{action.title}</h4>
                  <p className="text-[12px] text-muted-foreground">{action.reason}</p>
                </div>
                <button className="shrink-0 bg-secondary text-foreground px-4 py-2 rounded-[6px] text-[12px] font-bold hover:bg-muted transition-colors" onClick={() => router.push(ACTION_MAP.openCommandCenter())}>
                  {action.primaryAction}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Approval Inbox */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Approval Inbox</h2>
            <span className="px-2 py-0.5 bg-foreground text-background text-[10px] font-bold rounded-full">
              {cmd?.approvals.filter(a => a.status === 'PENDING_REVIEW').length} pending
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {cmd?.approvals.filter(a => a.status === 'PENDING_REVIEW').slice(0, 3).map((item, i) => (
              <div key={i} className="flex items-center justify-between p-5 border border-border rounded-[12px] bg-card hover:border-tertiary/40 transition-colors">
                <div className="flex-1 pr-4 min-w-0">
                  <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 border border-border rounded bg-secondary mb-2 inline-block">{item.type}</span>
                  <h4 className="text-[14px] font-bold text-foreground truncate">{item.title}</h4>
                </div>
                <button className="shrink-0 bg-foreground text-background px-4 py-2 rounded-[6px] text-[12px] font-bold hover:opacity-90 transition-opacity" onClick={() => router.push(ACTION_MAP.openApprovals())}>
                  Review
                </button>
              </div>
            ))}
            {cmd?.approvals.filter(a => a.status === 'PENDING_REVIEW').length === 0 && (
              <div className="p-8 text-center border border-dashed rounded-[10px]">
                <p className="text-[13px] text-muted-foreground font-medium">No pending approvals.</p>
              </div>
            )}
          </div>
        </div>
      </section>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* 7. AUTHORITY PROOF LIBRARY (Snapshot) */}
        <section className="bg-card border border-border rounded-[12px] p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Authority Proof & Case Studies</h2>
            <Link href={ACTION_MAP.openRetentionAndProof()} className="text-[11px] font-bold text-foreground uppercase tracking-widest hover:underline">View Library</Link>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <span className="text-[13px] font-bold text-foreground truncate">Apex Consulting Transformation</span>
              <span className="shrink-0 px-2 py-0.5 bg-success/20 text-success text-[9px] uppercase font-bold tracking-widest rounded">Approved</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <span className="text-[13px] font-bold text-foreground truncate">TechNova Revenue Expansion</span>
              <span className="shrink-0 px-2 py-0.5 bg-warning/20 text-warning text-[9px] uppercase font-bold tracking-widest rounded">Pending Client</span>
            </div>
          </div>
        </section>

        {/* 8. ACQUISITION SNAPSHOT */}
        <section className="bg-card border border-border rounded-[12px] p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Acquisition Snapshot</h2>
            <Link href={ACTION_MAP.openAcquisition()} className="text-[11px] font-bold text-foreground uppercase tracking-widest hover:underline">View Engine</Link>
          </div>
          <div className="flex items-center gap-6 mb-4 pb-4 border-b border-border">
            <div>
              <span className="block text-[24px] font-bold text-foreground">128</span>
              <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">Gross Leads</span>
            </div>
            <div>
              <span className="block text-[24px] font-bold text-foreground text-warning">42</span>
              <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">Qualified Leads</span>
            </div>
          </div>
          <div className="text-[13px] font-medium text-muted-foreground">
            <p className="mb-2"><strong className="text-foreground">Top Magnet:</strong> Executive Systems Playbook (42% CR)</p>
            <p><strong className="text-foreground">Top Channel:</strong> LinkedIn Inbound (28 QP)</p>
          </div>
        </section>
      </div>

      {/* 9. AI / EXECUTIVE INTELLIGENCE DIRECTIVES */}
      <section className="mb-10">
        <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-4">Strategic Intelligence Directives</h2>
        <div className="flex flex-col gap-3">
          {intelligence?.recommendations?.map(rec => (
            <div key={rec.id} className="bg-card border border-border rounded-[12px] p-5 flex flex-col md:flex-row gap-6 md:items-center justify-between">
              <div className="flex-1">
                <div className="flex gap-2 items-center mb-2">
                  <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>neurology</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${rec.priority === 'CRITICAL' || rec.priority === 'HIGH' ? 'bg-destructive/20 text-destructive' : 'bg-warning/20 text-warning'}`}>
                    {rec.priority} PRIORITY
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground">{rec.affectedCenter}</span>
                </div>
                <h4 className="text-[15px] font-bold text-foreground leading-tight mb-2">{rec.recommendation}</h4>
                <p className="text-[13px] text-muted-foreground"><strong className="text-foreground font-medium">Evidence:</strong> {rec.evidence}</p>
              </div>
              <div className="shrink-0 text-left md:text-right">
                <p className="text-[13px] font-bold text-success mb-2">Impact: {rec.expectedImpact}</p>
                <button className="bg-secondary text-foreground px-4 py-2 text-[12px] font-bold rounded-lg hover:bg-muted" onClick={() => router.push(ACTION_MAP.openRecommendations())}>Review Directive</button>
              </div>
            </div>
          )) || (
              <div className="bg-card border border-border rounded-[12px] p-6 text-center text-muted-foreground text-[13px] font-medium">
                No strategic directives active.
              </div>
            )}
        </div>
      </section>

      {/* 10. NEW OPERATING CENTER SUMMARIES */}
      <section>
        <div className="flex items-center justify-between mb-4 mt-12 pt-12 border-t border-border">
          <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Operating Subsystem Summaries</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          <div className="bg-card border border-border rounded-[12px] p-5 flex flex-col justify-between hover:border-tertiary/40 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Intelligence</span>
                <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>neurology</span>
              </div>
              <p className="text-[14px] font-bold text-foreground leading-tight mb-2">Primary Constraint</p>
              {activeConstraint ? (
                <div className="text-[12px] text-muted-foreground mb-4">
                  <span className="font-bold text-destructive block mb-1">{(activeConstraint as any).constraint || (activeConstraint as any).title}</span>
                  <span className="line-clamp-2">{(activeConstraint as any).recommendedAction || (activeConstraint as any).explanation}</span>
                </div>
              ) : (
                <p className="text-[12px] text-muted-foreground mb-4">No active constraints detected.</p>
              )}
            </div>
            <Link href={ACTION_MAP.openIntelligence()} className="block text-center border border-border w-full py-1.5 rounded-[6px] text-[12px] font-bold hover:bg-muted transition-colors">
              View Intelligence
            </Link>
          </div>


          <div className="bg-card border border-border rounded-[12px] p-5 flex flex-col justify-between hover:border-tertiary/40 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Acquisition</span>
                <span className="material-symbols-outlined text-[16px] text-muted-foreground">radar</span>
              </div>
              <p className="text-[14px] font-bold text-foreground leading-tight mb-2">Current Leads</p>
              <div className="text-[12px] text-muted-foreground mb-4">
                <span className="font-bold text-foreground block mb-1">
                  128
                </span>
                <span className="text-muted-foreground">↑ 5% generated this month</span>
              </div>
            </div>
            <Link href={ACTION_MAP.openAcquisition()} className="block text-center border border-border w-full py-1.5 rounded-[6px] text-[12px] font-bold hover:bg-muted transition-colors">
              View Acquisition
            </Link>
          </div>

          <div className="bg-card border border-border rounded-[12px] p-5 flex flex-col justify-between hover:border-tertiary/40 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Conversion</span>
                <span className="material-symbols-outlined text-[16px] text-muted-foreground">query_stats</span>
              </div>
              <p className="text-[14px] font-bold text-foreground leading-tight mb-2">Qualification Rate</p>
              <div className="text-[12px] text-muted-foreground mb-4">
                <span className="font-bold text-warning block mb-1">
                  14.5%
                </span>
                <span className="text-warning font-medium">Qualification is bottleneck</span>
              </div>
            </div>
            <Link href={ACTION_MAP.openConversion()} className="block text-center border border-border w-full py-1.5 rounded-[6px] text-[12px] font-bold hover:bg-muted transition-colors">
              View Conversion
            </Link>
          </div>

          <div className="bg-card border border-border rounded-[12px] p-5 flex flex-col justify-between hover:border-tertiary/40 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Revenue</span>
                <span className="material-symbols-outlined text-[16px] text-muted-foreground">payments</span>
              </div>
              <p className="text-[14px] font-bold text-foreground leading-tight mb-2">Total Pipeline</p>
              <div className="text-[12px] text-muted-foreground mb-4">
                <span className="font-bold text-foreground block mb-1">
                  $3,200,000
                </span>
                <span className="text-success font-medium">Healthy Coverage</span>
              </div>
            </div>
            <Link href={ACTION_MAP.openRevenue()} className="block text-center border border-border w-full py-1.5 rounded-[6px] text-[12px] font-bold hover:bg-muted transition-colors">
              View Revenue
            </Link>
          </div>

          <div className="bg-card border border-border rounded-[12px] p-5 flex flex-col justify-between hover:border-tertiary/40 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Delivery</span>
                <span className="material-symbols-outlined text-[16px] text-muted-foreground">check_circle</span>
              </div>
              <p className="text-[14px] font-bold text-foreground leading-tight mb-2">Client Health</p>
              <div className="text-[12px] text-muted-foreground mb-4">
                <span className="font-bold text-success block mb-1">
                  Healthy
                </span>
                <span className="text-muted-foreground">All active engagements stable</span>
              </div>
            </div>
            <Link href={ACTION_MAP.openDelivery()} className="block text-center border border-border w-full py-1.5 rounded-[6px] text-[12px] font-bold hover:bg-muted transition-colors">
              View Delivery
            </Link>
          </div>

          <div className="bg-card border border-border rounded-[12px] p-5 flex flex-col justify-between hover:border-tertiary/40 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Operations</span>
                <span className="material-symbols-outlined text-[16px] text-muted-foreground">precision_manufacturing</span>
              </div>
              <p className="text-[14px] font-bold text-foreground leading-tight mb-2">Team Capacity</p>
              <div className="text-[12px] text-muted-foreground mb-4">
                <span className="font-bold text-warning block mb-1">
                  Warning
                </span>
                <span className="text-muted-foreground">
                  Sales team near limit
                </span>
              </div>
            </div>
            <Link href={ACTION_MAP.openTeamCapacity()} className="block text-center border border-border w-full py-1.5 rounded-[6px] text-[12px] font-bold hover:bg-muted transition-colors">
              View Operations
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
