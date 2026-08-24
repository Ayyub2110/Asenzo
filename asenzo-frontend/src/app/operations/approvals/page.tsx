"use client";
import React from "react";
import { getOperations } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function ApprovalsPage() {
  const { localData, loading, error } = useAdapter(getOperations);

  if (loading) return <div className="p-10 animate-pulse h-96 w-full bg-muted/20 rounded-[16px]" />;
  if (error || !localData) return <div className="p-10">Error loading Approvals.</div>;

  const { approvals, team } = localData;

  if (approvals.length === 0) {
    return (
      <div className="p-16 text-center text-muted-foreground bg-card rounded-[16px] border border-border">
        <h3 className="text-[14px] font-bold text-foreground mb-2">No pending approvals</h3>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 pb-32">
      <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-6">Approval Center</h2>
      
      <div className="bg-card border border-border rounded-[16px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px] whitespace-nowrap">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Request</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Source Module</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Requested By</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Approver</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
               {approvals.map(a => (
                 <tr key={a.id} className="hover:bg-muted/20 transition-colors">
                   <td className="px-6 py-4 font-bold text-foreground">{a.request}</td>
                   <td className="px-6 py-4">
                     <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold leading-none ${a.status === 'PENDING' ? 'bg-secondary text-foreground' : a.status === 'APPROVED' ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}>{a.status}</span>
                   </td>
                   <td className="px-6 py-4">
                     <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold leading-none ${a.priority === 'URGENT' ? 'bg-destructive/20 text-destructive' : a.priority === 'HIGH' ? 'bg-orange-500/20 text-orange-600' : 'bg-muted/50 text-muted-foreground'}`}>{a.priority}</span>
                   </td>
                   <td className="px-6 py-4 text-[13px] text-muted-foreground">{a.sourceModule}</td>
                   <td className="px-6 py-4 text-[13px] text-muted-foreground">{team.find(u => u.id === a.requestedBy)?.name || 'Unknown'}</td>
                   <td className="px-6 py-4 text-[13px] font-bold">{team.find(u => u.id === a.approverId)?.name || 'Unknown'}</td>
                   <td className={`px-6 py-4 text-[13px] font-bold ${new Date(a.dueDate).getTime() < Date.now() ? 'text-destructive' : 'text-foreground'}`}>
                     {new Date(a.dueDate).toLocaleDateString()}
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
