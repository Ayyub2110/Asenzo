"use client";
import React from "react";
import { getOperations } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function TeamPage() {
  const { localData, loading, error } = useAdapter(getOperations);

  if (loading) return <div className="p-10 animate-pulse h-96 w-full bg-muted/20 rounded-[16px]" />;
  if (error || !localData) return <div className="p-10">Error loading Team.</div>;

  const { team, tasks } = localData;

  if (team.length === 0) {
    return (
      <div className="p-16 text-center text-muted-foreground bg-card rounded-[16px] border border-border">
        <h3 className="text-[14px] font-bold text-foreground mb-2 placeholder">No team members added</h3>
        <p className="text-[13px]">Team members appear here once assigned an operational role.</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 pb-32">
      <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-6">Internal Operations Team</h2>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {team.map(member => {
          const activeTasksCount = tasks.filter(t => t.ownerId === member.id && (t.status === "IN_PROGRESS" || t.status === "READY")).length;
          const overdueTasksCount = tasks.filter(t => t.ownerId === member.id && new Date(t.dueDate).getTime() < Date.now() && t.status !== "COMPLETED").length;
          return (
            <div key={member.id} className="bg-card border border-border rounded-[16px] shadow-sm p-6 flex flex-col justify-between">
               <div>
                 <div className="flex justify-between items-start mb-4">
                   <div>
                     <h3 className="text-[18px] font-bold text-foreground">{member.name}</h3>
                     <p className="text-[14px] text-muted-foreground font-medium">{member.role} • {member.department}</p>
                   </div>
                   <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider leading-none ${
                     member.status === 'ACTIVE' ? 'bg-success/20 text-success' :
                     member.status === 'OVER_CAPACITY' ? 'bg-destructive/20 text-destructive' :
                     member.status === 'AT_CAPACITY' ? 'bg-yellow-500/20 text-yellow-600' :
                     'bg-muted/50 text-muted-foreground'
                   }`}>
                     {member.status.replace("_", " ")}
                   </span>
                 </div>
                 
                 <div className="space-y-4 text-[13px]">
                   <div className="grid grid-cols-2 gap-4 bg-muted/20 p-3 rounded-lg border border-border">
                     <div>
                       <span className="block text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Workload</span>
                       <div className="flex items-end gap-2">
                          <span className={`text-[16px] font-bold leading-none ${member.status === 'OVER_CAPACITY' ? 'text-destructive' : 'text-foreground'}`}>{member.workload}hrs</span> 
                          <span className="text-muted-foreground leading-none mb-[2px]">/ {member.capacity}</span>
                       </div>
                       <div className="w-full h-1 bg-secondary rounded-full mt-2 overflow-hidden">
                         <div className={`h-full ${member.status === 'OVER_CAPACITY' ? 'bg-destructive' : 'bg-primary'}`} style={{ width: `${Math.min((member.workload/member.capacity)*100, 100)}%` }}></div>
                       </div>
                     </div>
                     <div>
                       <span className="block text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Task Queue</span>
                       <p className="font-medium">
                         <span className="text-foreground font-bold">{activeTasksCount}</span> active • 
                         <span className={overdueTasksCount > 0 ? "text-destructive font-bold ml-1" : "text-muted-foreground ml-1"}>{overdueTasksCount} overdue</span>
                       </p>
                     </div>
                   </div>

                   <div className="flex flex-col gap-1">
                     <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Skills & Ownership</span>
                     <div className="flex flex-wrap gap-2">
                       {member.skills.map(s => (
                         <span key={s} className="px-2 py-1 bg-secondary text-secondary-foreground text-[11px] font-medium rounded-md">{s}</span>
                       ))}
                     </div>
                   </div>

                   {member.backupFor.length > 0 && (
                     <div className="flex flex-col gap-1 border-t border-border pt-4 mt-2">
                       <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Backup Coverage</span>
                       <p className="text-muted-foreground">{member.backupFor.map(id => team.find(t => t.id === id)?.name).join(", ")}</p>
                     </div>
                   )}
                 </div>
               </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
