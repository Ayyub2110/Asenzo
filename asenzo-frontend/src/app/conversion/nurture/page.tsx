"use client";

import React from "react";
import { getConversion } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function NurturePage() {
  const { localData, loading, error } = useAdapter(getConversion);

  if (loading) return <div className="p-10 animate-pulse h-96 w-full max-w-[1200px] mx-auto bg-muted/20 rounded-[16px]" />;
  if (error || !localData) return <div className="p-10">Error loading Nurture Center.</div>;

  const { nurtureRecords } = localData;

  return (
    <div className="p-6 md:p-10 max-w-[1500px] mx-auto">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-[18px] font-bold text-foreground mb-1">Nurture Center</h1>
          <p className="text-[14px] text-muted-foreground">Long-term education and re-engagement tracking for non-ready leads.</p>
        </div>
      </div>

       <div className="bg-card border border-border rounded-[16px] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-secondary/30">
            <tr>
              <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest hidden md:table-cell">Sequence</th>
              <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Segment</th>
              <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
              <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest hidden lg:table-cell">Target Return Date</th>
              <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {nurtureRecords?.map(n => (
              <tr key={n.id} className="border-t border-border hover:bg-secondary/20 transition-colors">
                <td className="p-4 hidden md:table-cell">
                   <p className="text-[13px] font-bold text-foreground">{n.sequenceName}</p>
                </td>
                <td className="p-4">
                   <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-background border border-border">{n.segment}</span>
                </td>
                <td className="p-4">
                   <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-border ${n.status === 'ACTIVE' ? 'bg-foreground text-background' : 'bg-background'}`}>{n.status}</span>
                </td>
                <td className="p-4 hidden lg:table-cell">
                   <p className="text-[12px] font-medium text-foreground">{new Date(n.reengagementDate).toLocaleDateString()}</p>
                </td>
                <td className="p-4 text-right">
                   <button className="bg-background border border-border text-foreground text-[11px] font-bold px-4 py-1.5 rounded-[6px] hover:bg-secondary">Details</button>
                </td>
              </tr>
            )) || <tr><td colSpan={5} className="p-8 text-center text-[12px] text-muted-foreground">No nurture records found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
