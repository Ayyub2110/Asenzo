"use client";
import React from "react";
import Link from "next/link";
import { getOperations, getIntelligence } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";
import { ACTION_MAP } from "@/lib/routing";

export default function OperationsCommandPage() {
  const { localData: opsData, loading: opsLoading, error: opsError } = useAdapter(getOperations);
  const { localData: intelData, loading: intelLoading, error: intelError } = useAdapter(getIntelligence);

  if (opsLoading || intelLoading) return <div className="p-10 animate-pulse h-96 w-full bg-muted/20 rounded-[16px]" />;
  if (opsError || intelError || !opsData || !intelData) return <div className="p-10 text-red-500 font-bold">Error loading Control Center data.</div>;

  const { work, approvals, issues, team, updates, planning } = opsData;
  const { pulse, healthMatrix } = intelData;

  const activeWork = work.filter(w => w.status !== "COMPLETED" && w.status !== "CANCELLED");
  const dueToday = activeWork.filter(w => {
    const d = new Date(w.dueDate);
    const today = new Date();
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  });
  const overdueWork = activeWork.filter(w => new Date(w.dueDate).getTime() < Date.now() - 86400000);
  const blockedWork = activeWork.filter(w => w.status === "BLOCKED");
  const pendingApprovals = approvals.filter(a => a.status === "PENDING");
  const openIssues = issues.filter(i => i.status !== "CLOSED" && i.status !== "RESOLVED");
  const overCapacity = team.filter(t => t.capacity < t.workload);

  const businessPulseMetrics = [
    { label: "Revenue", value: `$${pulse.revenue.toLocaleString()}`, href: ACTION_MAP.openRevenueDashboard() },
    { label: "Pipeline", value: `$${pulse.pipeline.toLocaleString()}`, href: ACTION_MAP.openSalesPipeline() },
    { label: "Qualified Leads", value: pulse.qualifiedLeads, href: ACTION_MAP.openLeadQualification('QUALIFIED') },
    { label: "Conversion Rate", value: `${pulse.conversionRate}%`, href: ACTION_MAP.openConversionAnalytics() },
    { label: "Content Reach", value: pulse.contentReach.toLocaleString(), href: ACTION_MAP.openAcquisitionAnalytics() },
    { label: "Client Outcomes", value: pulse.clientOutcomes, href: ACTION_MAP.openClientHealth() }
  ];

  const opsPulseMetrics = [
    { label: "Active Work", value: activeWork.length, link: "/operations/work", isRisk: false },
    { label: "Due Today", value: dueToday.length, link: "/operations/work", isRisk: false },
    { label: "Overdue", value: overdueWork.length, link: "/operations/work", isRisk: overdueWork.length > 0 },
    { label: "Blocked", value: blockedWork.length, link: "/operations/work", isRisk: blockedWork.length > 0 },
    { label: "Approvals", value: pendingApprovals.length, link: "/operations/control/approvals", isRisk: false },
    { label: "Open Issues", value: openIssues.length, link: "/operations/control/issues", isRisk: openIssues.length > 0 },
    { label: "Capacity Risk", value: overCapacity.length, link: "/operations/team", isRisk: overCapacity.length > 0 },
  ];

  const workByModule = {
    Acquisition:  work.filter(w => w.sourceModule === 'Acquisition').length,
    Conversion:   work.filter(w => w.sourceModule === 'Conversion').length,
    Revenue:      work.filter(w => w.sourceModule === 'Revenue').length,
    Delivery:     work.filter(w => w.sourceModule === 'Delivery').length,
    Operations:   work.filter(w => w.sourceModule === 'Operations').length,
  };

  const calculateBar = (val: number) => {
    if (val === 0) return '';
    return '█'.repeat(Math.min(val * 2, 20)); // Arbitrary scale for demo
  }

  return (
    <div className="p-6 md:p-10 pb-32 space-y-10">
      
      {/* OPERATIONAL PULSE */}
      <section>
        <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-4">Operational Pulse</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-4">
          {opsPulseMetrics.map(p => (
            <Link key={p.label} href={p.link} className={`p-4 border rounded-[16px] shadow-sm flex flex-col gap-1 transition-colors ${p.isRisk ? 'bg-destructive/10 border-destructive/30 hover:bg-destructive/20' : 'bg-card border-border hover:bg-secondary/50'}`}>
              <span className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-widest ${p.isRisk ? 'text-destructive' : 'text-muted-foreground'}`}>{p.label}</span>
              <span className={`text-[20px] sm:text-[24px] font-bold ${p.isRisk ? 'text-destructive' : 'text-foreground'}`}>{p.value}</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* NEEDS ATTENTION */}
        <section className="col-span-1 lg:col-span-2 space-y-6">
          <div className="bg-destructive/5 border border-destructive/20 p-6 rounded-[16px]">
            <h2 className="text-[12px] font-bold text-destructive uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">warning</span> Needs Attention
            </h2>
            <div className="space-y-3">
              {openIssues.length > 0 && (
                <div className="p-3 bg-card border border-border rounded-lg shadow-sm flex items-start gap-4">
                  <div className="bg-destructive text-destructive-foreground px-2 py-1 rounded text-[10px] font-bold uppercase mt-1">Issue</div>
                  <div>
                    <h3 className="text-[14px] font-bold">{openIssues[0].title}</h3>
                    <p className="text-[12px] text-muted-foreground">{openIssues[0].description}</p>
                  </div>
                </div>
              )}
              {overdueWork.length > 0 && (
                <div className="p-3 bg-card border border-border rounded-lg shadow-sm flex items-start gap-4">
                  <div className="bg-orange-500 text-white px-2 py-1 rounded text-[10px] font-bold uppercase mt-1">Overdue</div>
                  <div>
                    <h3 className="text-[14px] font-bold">{overdueWork[0].title}</h3>
                    <p className="text-[12px] text-muted-foreground">Owner: {team.find(t => t.id === overdueWork[0].ownerId)?.name}</p>
                  </div>
                </div>
              )}
              {blockedWork.length > 0 && (
                <div className="p-3 bg-card border border-border rounded-lg shadow-sm flex items-start gap-4">
                  <div className="bg-yellow-500/20 text-yellow-700 px-2 py-1 rounded text-[10px] font-bold uppercase mt-1">Blocked</div>
                  <div>
                    <h3 className="text-[14px] font-bold">{blockedWork[0].title}</h3>
                    <p className="text-[12px] text-muted-foreground">Module: {blockedWork[0].sourceModule}</p>
                  </div>
                </div>
              )}
              {overCapacity.length > 0 && (
                <div className="p-3 bg-card border border-border rounded-lg shadow-sm flex items-start gap-4">
                  <div className="bg-blue-500/20 text-blue-700 px-2 py-1 rounded text-[10px] font-bold uppercase mt-1">Capacity</div>
                  <div>
                    <h3 className="text-[14px] font-bold">{overCapacity[0].name} is Over Capacity</h3>
                    <p className="text-[12px] text-muted-foreground">Workload: {overCapacity[0].workload} hrs (Max: {overCapacity[0].capacity})</p>
                  </div>
                </div>
              )}
              {openIssues.length === 0 && overdueWork.length === 0 && blockedWork.length === 0 && overCapacity.length === 0 && (
                <div className="text-sm text-muted-foreground italic">No critical attention items.</div>
              )}
            </div>
          </div>

          {/* WORK ACROSS BUSINESS */}
          <div className="bg-card border border-border p-6 rounded-[16px]">
            <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Work Across Business</h2>
            <div className="space-y-2 font-mono text-[13px]">
              {Object.entries(workByModule).map(([mod, count]) => (
                <div key={mod} className="flex gap-4 items-center">
                  <div className="w-[100px] text-muted-foreground">{mod}</div>
                  <div className="text-primary font-bold">{calculateBar(count) || '-'}</div>
                  <div className="text-muted-foreground text-[11px]">{count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* TODAY'S UPDATES */}
          <div className="bg-card border border-border p-6 rounded-[16px]">
            <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Today's Updates</h2>
            {updates.length === 0 ? (
              <p className="text-[13px] text-muted-foreground italic">No team updates submitted yet.</p>
            ) : (
              <div className="space-y-4">
                {updates.map(u => (
                  <div key={u.id} className="border-l-2 border-primary pl-4 py-1">
                    <p className="text-[11px] font-bold text-muted-foreground mb-2">{team.find(t=>t.id===u.userId)?.name} &bull; {new Date(u.date).toLocaleDateString()}</p>
                    <div className="text-[13px] space-y-1">
                      <p><span className="font-bold text-foreground">Completed:</span> {u.completed}</p>
                      <p><span className="font-bold text-foreground">In Progress:</span> {u.inProgress}</p>
                      {u.blocked && <p><span className="font-bold text-destructive">Blocked:</span> {u.blocked}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* SIDEBAR */}
        <section className="col-span-1 space-y-6">

          {/* UPCOMING */}
          <div className="bg-card border border-border p-6 rounded-[16px]">
            <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Upcoming</h2>
            <div className="space-y-3">
              {planning.map(p => (
                <div key={p.id} className="text-[13px]">
                  <p className="font-bold">{p.title}</p>
                  <p className="text-[11px] text-muted-foreground">{p.type} &bull; Due: {new Date(p.dueDate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* WHAT CHANGED */}
          <div className="bg-secondary/40 border border-border p-6 rounded-[16px]">
            <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest mb-4">What Changed</h2>
            <div className="text-[13px] font-medium space-y-2 text-muted-foreground">
              <p className="text-foreground">+18 work items completed</p>
              <p className="text-destructive">+4 overdue</p>
              <p className="text-primary">-1 blocked</p>
              <p>5 approvals completed</p>
            </div>
          </div>

        </section>

      </div>
    </div>
  );
}
