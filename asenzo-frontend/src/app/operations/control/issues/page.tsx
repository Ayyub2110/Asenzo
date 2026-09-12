"use client";
import React from "react";
import { getOperations } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function IssuesPage() {
  const { localData, loading, error } = useAdapter(getOperations);

  if (loading) return <div className="p-10 animate-pulse h-96 w-full bg-muted/20 rounded-[16px]" />;
  if (error || !localData) return <div className="p-10">Error loading Issues.</div>;

  const { issues, team } = localData;

  if (!issues || issues.length === 0) {
    return (
      <div className="p-16 text-center text-muted-foreground bg-card rounded-[16px] border border-border mt-6 mx-6 md:mx-10">
        <h3 className="text-[14px] font-bold text-foreground mb-2">No active issues or escalations.</h3>
        <p className="text-[12px]">Your operations currently have no escalated issues.</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 pb-32">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Issues & Escalations</h2>
        <button className="px-4 py-2 bg-destructive text-destructive-foreground text-[12px] font-bold rounded-[6px]">Report Issue</button>
      </div>
      
      <div className="bg-card border border-border rounded-[16px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px] whitespace-nowrap">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Issue</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Type / Module</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Severity</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Owner</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
               {issues.map(e => (
                 <tr key={e.id} className="hover:bg-muted/20 transition-colors">
                   <td className="px-6 py-4">
                     <p className="font-bold text-foreground">{e.title}</p>
                     <p className="text-[11px] text-muted-foreground truncate max-w-[300px]">{e.description}</p>
                   </td>
                   <td className="px-6 py-4">
                     <p className="font-bold text-foreground uppercase text-[10px]">{e.type}</p>
                     <p className="text-[11px] text-muted-foreground">{e.sourceModule}</p>
                   </td>
                   <td className="px-6 py-4">
                     <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold leading-none ${e.severity === 'CRITICAL' ? 'bg-destructive/20 text-destructive' : 'bg-orange-500/20 text-orange-600'}`}>{e.severity}</span>
                   </td>
                   <td className="px-6 py-4">
                     <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold leading-none bg-secondary text-foreground">{e.status.replace("_", " ")}</span>
                   </td>
                   <td className="px-6 py-4 text-[13px] font-medium">{team.find(u => u.id === e.ownerId)?.name || 'UNASSIGNED'}</td>
                   <td className={`px-6 py-4 text-[13px] font-bold ${e.dueDate && new Date(e.dueDate).getTime() < Date.now() ? 'text-destructive' : 'text-foreground'}`}>
                     {e.dueDate ? new Date(e.dueDate).toLocaleDateString() : '-'}
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
