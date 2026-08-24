"use client";
import React from "react";
import { getOperations } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function TasksPage() {
  const { localData, loading, error } = useAdapter(getOperations);

  if (loading) return <div className="p-10 animate-pulse h-96 w-full bg-muted/20 rounded-[16px]" />;
  if (error || !localData) return <div className="p-10">Error loading Tasks.</div>;

  const { tasks, team } = localData;

  if (tasks.length === 0) {
    return (
      <div className="p-16 text-center text-muted-foreground bg-card rounded-[16px] border border-border">
        <h3 className="text-[14px] font-bold text-foreground mb-2">No operational tasks</h3>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 pb-32">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Task Center</h2>
        <button className="px-4 py-2 bg-primary text-primary-foreground text-[12px] font-bold rounded-[6px]">Assign Task</button>
      </div>
      
      <div className="bg-card border border-border rounded-[16px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px] whitespace-nowrap">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Task</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Owner</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Module</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
               {tasks.map(t => (
                 <tr key={t.id} className="hover:bg-muted/20 transition-colors">
                   <td className="px-6 py-4">
                     <p className="font-bold text-foreground">{t.title}</p>
                     <p className="text-[11px] text-muted-foreground truncate max-w-[300px]">{t.description}</p>
                   </td>
                   <td className="px-6 py-4">
                     <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold leading-none ${t.status === 'BLOCKED' ? 'bg-destructive/20 text-destructive' : t.status === 'COMPLETED' ? 'bg-success/20 text-success' : 'bg-secondary text-foreground'}`}>{t.status.replace("_", " ")}</span>
                   </td>
                   <td className="px-6 py-4">
                     <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold leading-none ${t.priority === 'URGENT' ? 'bg-destructive/20 text-destructive' : t.priority === 'HIGH' ? 'bg-orange-500/20 text-orange-600' : 'bg-muted/50 text-muted-foreground'}`}>{t.priority}</span>
                   </td>
                   <td className="px-6 py-4 text-[13px] font-medium">{team.find(u => u.id === t.ownerId)?.name || 'UNASSIGNED'}</td>
                   <td className="px-6 py-4 text-[13px] text-muted-foreground">{t.sourceModule}</td>
                   <td className={`px-6 py-4 text-[13px] font-bold ${new Date(t.dueDate).getTime() < Date.now() ? 'text-destructive' : 'text-foreground'}`}>
                     {new Date(t.dueDate).toLocaleDateString()}
                   </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
