"use client";

import React from "react";
import { getRevenue } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function LostDealsPage() {
  const { localData, loading, error } = useAdapter(getRevenue);

  if (loading) return <div className="p-10 animate-pulse h-96 w-full max-w-[1200px] mx-auto bg-muted/20 rounded-[16px]" />;
  if (error || !localData) return <div className="p-10">Error loading Closed Lost.</div>;

  const { lostDeals, deals } = localData;

  const getDealCompany = (id: string) => {
    // Note: In real app, lostDeals might store historical snapshot if deal is deleted, or link to it
    return "Acme Corp (Historical)";
  };

  const formatCurrency = (val: number) => `₹${(val / 100000).toFixed(1)}L`;

  return (
    <div className="p-6 md:p-10 max-w-[1500px] mx-auto pb-20">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-[18px] font-bold text-foreground mb-1">Closed-Lost Learning</h1>
          <p className="text-[14px] text-muted-foreground">Analyze commercial failure points to improve the system.</p>
        </div>
      </div>

       <div className="bg-card border border-border rounded-[16px] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-secondary/30">
            <tr>
              <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest hidden md:table-cell">Date</th>
              <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Deal</th>
              <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Lost Reason</th>
              <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest hidden lg:table-cell">Stage Lost</th>
              <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest text-right">Value</th>
            </tr>
          </thead>
          <tbody>
            {lostDeals?.map(l => (
              <tr key={l.id} className="border-t border-border hover:bg-secondary/20 transition-colors">
                <td className="p-4 hidden md:table-cell">
                   <p className="text-[12px] font-medium text-muted-foreground">{new Date(l.dateLost).toLocaleDateString()}</p>
                </td>
                <td className="p-4">
                   <p className="text-[14px] font-bold text-foreground">{getDealCompany(l.dealId)}</p>
                </td>
                <td className="p-4">
                   <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-destructive/10 text-destructive border border-destructive/20 mb-1 inline-block">{l.reason}</span>
                   <p className="text-[12px] text-muted-foreground mt-1 truncate max-w-[200px]">{l.objection}</p>
                </td>
                <td className="p-4 hidden lg:table-cell">
                   <span className="text-[11px] font-medium text-foreground">{l.stageLost.replace('_', ' ')}</span>
                </td>
                <td className="p-4 text-right">
                   <p className="text-[15px] font-bold text-muted-foreground line-through opacity-70">{formatCurrency(l.value)}</p>
                </td>
              </tr>
            )) || <tr><td colSpan={5} className="p-8 text-center text-[12px] text-muted-foreground">No lost deals found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
