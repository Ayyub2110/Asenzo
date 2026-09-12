"use client";
import React from "react";
import { getOperations } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function PlanningPage() {
  const { localData, loading, error } = useAdapter(getOperations);

  if (loading) return <div className="p-10 animate-pulse h-96 w-full bg-muted/20 rounded-[16px]" />;
  if (error || !localData) return <div className="p-10">Error loading Planning items.</div>;

  const { planning, team } = localData;

  if (!planning || planning.length === 0) {
    return (
      <div className="p-16 text-center text-muted-foreground bg-card rounded-[16px] border border-border mt-6 mx-6 md:mx-10">
        <h3 className="text-[14px] font-bold text-foreground mb-2">No active plans</h3>
        <p className="text-[12px]">Your operations schedule is clear.</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 pb-32">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Planning & Initiatives</h2>
        <button className="px-4 py-2 bg-primary text-primary-foreground text-[12px] font-bold rounded-[6px]">New Plan</button>
      </div>
      
      <div className="bg-card border border-border rounded-[16px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px] whitespace-nowrap">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Initiative</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Dates</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
               {planning.map(s => (
                 <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                   <td className="px-6 py-4">
                     <p className="font-bold text-foreground">{s.title}</p>
                     <p className="text-[11px] text-muted-foreground truncate max-w-[300px]">{s.description}</p>
                   </td>
                   <td className="px-6 py-4 text-[13px] font-medium">{s.type}</td>
                   <td className="px-6 py-4 text-[13px] text-muted-foreground">
                      {new Date(s.startDate).toLocaleDateString()} &mdash; {new Date(s.dueDate).toLocaleDateString()}
                   </td>
                   <td className="px-6 py-4">
                     <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold leading-none ${s.status === 'COMPLETED' ? 'bg-success/20 text-success' : 'bg-secondary text-foreground'}`}>{s.status}</span>
                   </td>
                   <td className="px-6 py-4 text-[13px] font-medium">{team.find(u => u.id === s.ownerId)?.name || 'UNASSIGNED'}</td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
