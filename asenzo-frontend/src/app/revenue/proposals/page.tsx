"use client";

import React from "react";
import { getRevenue } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function ProposalsPage() {
  const { localData, loading, error } = useAdapter(getRevenue);

  if (loading) return <div className="p-10 animate-pulse h-96 w-full max-w-[1200px] mx-auto bg-muted/20 rounded-[16px]" />;
  if (error || !localData) return <div className="p-10">Error loading Proposals.</div>;

  const { proposals } = localData;
  const formatCurrency = (val: number) => `₹${(val / 100000).toFixed(1)}L`;

  return (
    <div className="p-6 md:p-10 max-w-[1500px] mx-auto pb-20">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-[18px] font-bold text-foreground mb-1">Proposal Center</h1>
          <p className="text-[14px] text-muted-foreground">Commercial proposals for qualified opportunities.</p>
        </div>
      </div>

       <div className="bg-card border border-border rounded-[16px] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-secondary/30">
            <tr>
              <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest hidden md:table-cell">ID</th>
              <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Offer</th>
              <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
              <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest hidden lg:table-cell">Sent Date</th>
              <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest text-right">Value</th>
            </tr>
          </thead>
          <tbody>
            {proposals?.map(p => (
              <tr key={p.id} className="border-t border-border hover:bg-secondary/20 transition-colors">
                <td className="p-4 hidden md:table-cell">
                   <p className="text-[12px] font-bold text-muted-foreground uppercase">#{p.id}</p>
                </td>
                <td className="p-4">
                   <p className="text-[14px] font-bold text-foreground">{p.offer}</p>
                   <p className="text-[12px] text-muted-foreground truncate max-w-[200px]">{p.scope}</p>
                </td>
                <td className="p-4">
                   <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-border ${p.status === 'SENT' || p.status === 'VIEWED' ? 'bg-secondary text-foreground' : 'bg-background'}`}>{p.status}</span>
                </td>
                <td className="p-4 hidden lg:table-cell">
                   <p className="text-[12px] font-medium text-foreground">{p.sentDate ? new Date(p.sentDate).toLocaleDateString() : '—'}</p>
                </td>
                <td className="p-4 text-right">
                   <p className="text-[15px] font-bold text-foreground">{formatCurrency(p.price)}</p>
                </td>
              </tr>
            )) || <tr><td colSpan={5} className="p-8 text-center text-[12px] text-muted-foreground">No proposals found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
