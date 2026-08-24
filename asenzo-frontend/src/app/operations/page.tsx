"use client";
import React from "react";
import Link from "next/link";
import { getOperations } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function OperationsCommandPage() {
  const { localData, loading, error } = useAdapter(getOperations);

  if (loading) return <div className="p-10 animate-pulse h-96 w-full bg-muted/20 rounded-[16px]" />;
  if (error || !localData) return <div className="p-10">Error loading Operations.</div>;

  const activeTasks = localData.tasks.filter(t => t.status === "READY" || t.status === "IN_PROGRESS" || t.status === "WAITING");
  const overdueTasks = activeTasks.filter(t => new Date(t.dueDate).getTime() < Date.now());
  const blockedTasks = localData.tasks.filter(t => t.status === "BLOCKED");
  const pendingApprovals = localData.approvals.filter(a => a.status === "PENDING");
  const activeEscalations = localData.escalations.filter(e => e.status !== "RESOLVED" && e.status !== "CLOSED");
  const sopsDue = localData.sops.filter(s => new Date(s.nextReviewDate).getTime() < Date.now() + (7 * 86400000));
  const qualityIssues = localData.qc.filter(q => q.status === "FAILED" || q.status === "CHANGES_REQUIRED");

  const pulseMetrics = [
    { label: "Active Tasks", value: activeTasks.length, link: "/operations/tasks", isRisk: false },
    { label: "Overdue Tasks", value: overdueTasks.length, link: "/operations/tasks", isRisk: overdueTasks.length > 0 },
    { label: "Blocked Work", value: blockedTasks.length, link: "/operations/tasks", isRisk: blockedTasks.length > 0 },
    { label: "Pending Approvals", value: pendingApprovals.length, link: "/operations/approvals", isRisk: false },
    { label: "Active Escalations", value: activeEscalations.length, link: "/operations/escalations", isRisk: activeEscalations.length > 0 },
    { label: "Quality Issues", value: qualityIssues.length, link: "/operations/quality", isRisk: qualityIssues.length > 0 }
  ];

  return (
    <div className="p-6 md:p-10 pb-32">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {pulseMetrics.map(p => (
           <Link key={p.label} href={p.link} className={`p-4 border rounded-[16px] shadow-sm flex flex-col gap-1 transition-colors ${p.isRisk ? 'bg-destructive/10 border-destructive/20 hover:bg-destructive/15' : 'bg-card border-border hover:bg-muted/30'}`}>
              <span className={`text-[11px] font-bold uppercase tracking-widest ${p.isRisk ? 'text-destructive' : 'text-muted-foreground'}`}>{p.label}</span>
              <span className={`text-[24px] font-bold ${p.isRisk ? 'text-destructive' : 'text-foreground'}`}>{p.value}</span>
           </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <section className="bg-card border border-border p-6 rounded-[16px] shadow-sm">
            <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-6 flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">priority_high</span> Critical Priorities</h2>
            <div className="space-y-4">
              {activeEscalations.map(e => (
                 <div key={e.id} className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                   <div className="flex justify-between items-start mb-2">
                     <span className="px-2 py-0.5 bg-destructive text-destructive-foreground text-[10px] font-bold uppercase rounded leading-none">{e.sourceModule} Escalation</span>
                     <span className="text-[11px] font-bold text-destructive">Owner: {localData.team.find(t => t.id === e.ownerId)?.name || "Unknown"}</span>
                   </div>
                   <p className="text-[14px] font-bold text-foreground mb-1">{e.issue}</p>
                   <p className="text-[13px] text-muted-foreground mb-2 flex flex-col gap-0.5">
                     <span><strong>Reason:</strong> {e.reason}</span>
                     <span><strong>Action:</strong> {e.recommendedAction}</span>
                   </p>
                   {e.deadline && <p className="text-[11px] font-bold text-destructive mt-3">{new Date(e.deadline).getTime() < Date.now() ? 'OVERDUE' : 'DUE SOON'}: {new Date(e.deadline).toLocaleDateString()}</p>}
                 </div>
              ))}
              {blockedTasks.map(t => (
                 <div key={t.id} className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                   <div className="flex justify-between items-start mb-2">
                     <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-700 text-[10px] font-bold uppercase rounded leading-none">Blocked Task</span>
                     <span className="text-[11px] font-bold text-yellow-700">Owner: {localData.team.find(u => u.id === t.ownerId)?.name || "Unknown"}</span>
                   </div>
                   <p className="text-[14px] font-bold text-foreground mb-1">{t.title}</p>
                   <p className="text-[13px] text-muted-foreground">Source: {t.sourceModule}</p>
                 </div>
              ))}
              {qualityIssues.map(q => (
                 <div key={q.id} className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                   <div className="flex justify-between items-start mb-2">
                     <span className="px-2 py-0.5 bg-orange-500/20 text-orange-600 text-[10px] font-bold uppercase rounded leading-none">Quality Failure - {q.severity}</span>
                   </div>
                   <p className="text-[14px] font-bold text-foreground mb-1">{q.title}</p>
                   <p className="text-[13px] text-muted-foreground">Source: {q.sourceModule}</p>
                 </div>
              ))}
              {activeEscalations.length === 0 && blockedTasks.length === 0 && qualityIssues.length === 0 && (
                <div className="p-6 text-center border border-dashed border-border rounded-xl">
                  <p className="text-[13px] text-muted-foreground font-medium">No critical escalations or blockers.</p>
                </div>
              )}
            </div>
         </section>

         <section className="bg-card border border-border p-6 rounded-[16px] shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest leading-none flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">approval</span> Bottlenecks & Capacity</h2>
            </div>
            
            <div className="space-y-6 flex-1">
               <div>
                  <h3 className="text-[11px] font-bold text-foreground uppercase mb-3">Capacity Risks</h3>
                  {localData.team.filter(t => t.status === "AT_CAPACITY" || t.status === "OVER_CAPACITY").map(t => (
                    <div key={t.id} className="flex justify-between items-center bg-muted/30 p-3 rounded-lg mb-2 text-[13px]">
                       <div>
                         <p className="font-bold">{t.name}</p>
                         <p className="text-muted-foreground text-[11px] leading-none mt-0.5">{t.role}</p>
                       </div>
                       <div className="text-right">
                         <span className={`font-bold ${t.status === 'OVER_CAPACITY' ? 'text-destructive' : 'text-yellow-600'}`}>
                           {t.workload} / {t.capacity} hrs
                         </span>
                         <span className="block text-[10px] font-bold text-muted-foreground uppercase">{t.status.replace("_", " ")}</span>
                       </div>
                    </div>
                  ))}
                  {localData.team.filter(t => t.status === "AT_CAPACITY" || t.status === "OVER_CAPACITY").length === 0 && (
                    <p className="text-[12px] text-muted-foreground border border-dashed border-border p-4 rounded-lg text-center font-medium">All team members are within operating capacity.</p>
                  )}
               </div>

               <div>
                  <h3 className="text-[11px] font-bold text-foreground uppercase mb-3">Pending Approvals Queue</h3>
                  {pendingApprovals.map(a => (
                     <div key={a.id} className="bg-muted/30 p-3 rounded-lg mb-2 text-[13px]">
                        <div className="flex justify-between items-center mb-1">
                           <span className="font-bold">{a.request}</span>
                           <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase leading-none ${a.priority === 'URGENT' ? 'bg-destructive/20 text-destructive' : a.priority === 'HIGH' ? 'bg-orange-500/20 text-orange-600' : 'bg-primary/10 text-primary'}`}>{a.priority}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">Source: {a.sourceModule} • Approver: {localData.team.find(t => t.id === a.approverId)?.name || 'Unknown'}</p>
                     </div>
                  ))}
                  {pendingApprovals.length === 0 && (
                    <p className="text-[12px] text-muted-foreground border border-dashed border-border p-4 rounded-lg text-center font-medium">No pending approvals bottlenecks.</p>
                  )}
               </div>
            </div>
         </section>
      </div>
    </div>
  );
}
