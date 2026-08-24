"use client";
import React from "react";
import { getIntelligence } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function ContentRevenuePage() {
  const { localData, loading, error } = useAdapter(getIntelligence);

  if (loading) return <div className="p-10 animate-pulse h-96 w-full bg-muted/20 rounded-[16px]" />;
  if (error || !localData) return <div className="p-10">Error loading Content to Revenue.</div>;

  const { contentRevenue } = localData;

  if (contentRevenue.length === 0) {
    return (
      <div className="p-16 text-center text-muted-foreground bg-card rounded-[16px] border border-border mt-8">
        <h3 className="text-[14px] font-bold text-foreground mb-2">No content-to-revenue mapping available.</h3>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 pb-32">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Content-to-Revenue Bridge</h2>
      </div>
      
      <div className="bg-card border border-border rounded-[16px] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border bg-muted/10">
           <h3 className="text-[16px] font-bold text-foreground mb-1">Which ideas manufacture the highest intent?</h3>
           <p className="text-[13px] text-muted-foreground">This maps exact pieces of content directly to pipeline creation and closed revenue.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px] whitespace-nowrap">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Content Core</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Stage</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-right">Reach</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-right">Qualified</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-right">Revenue Influenced</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
               {contentRevenue.map(c => (
                 <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                   <td className="px-6 py-4">
                      <p className="font-bold text-foreground text-[14px] max-w-[300px] truncate">{c.contentPiece}</p>
                      <p className="text-[11px] text-muted-foreground mt-1">Pillar: {c.contentPillar} • Channel: {c.channel}</p>
                   </td>
                   <td className="px-6 py-4">
                     <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest bg-secondary text-foreground">{c.awarenessStage}</span>
                   </td>
                   <td className="px-6 py-4 text-[13px] font-medium">{c.funnelRole}</td>
                   <td className="px-6 py-4 text-right text-[14px] text-muted-foreground">{c.reach.toLocaleString()}</td>
                   <td className="px-6 py-4 text-right text-[14px] font-bold">{c.qualifiedLeads}</td>
                   <td className="px-6 py-4 text-right font-bold text-success text-[14px]">${c.revenueInfluenced.toLocaleString()}</td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
