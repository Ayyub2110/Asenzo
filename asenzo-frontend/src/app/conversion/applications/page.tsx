"use client";

import React from "react";
import { getConversion } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function ApplicationsPage() {
  const { localData, loading, error } = useAdapter(getConversion);

  if (loading) return <div className="p-10 animate-pulse h-96 w-full max-w-[1200px] mx-auto bg-muted/20 rounded-[16px]" />;
  if (error || !localData) return <div className="p-10">Error loading Applications.</div>;

  const { applications } = localData;

  return (
    <div className="p-6 md:p-10 max-w-[1500px] mx-auto">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-[18px] font-bold text-foreground mb-1">Applications</h1>
          <p className="text-[14px] text-muted-foreground">Structured buyer intent and pre-qualification.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-[16px] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-secondary/30">
            <tr>
              <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Applicant</th>
              <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest hidden md:table-cell">ICP Fit</th>
              <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest hidden lg:table-cell">Projected Route</th>
              <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
              <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {applications?.map(app => (
              <tr key={app.id} className="border-t border-border hover:bg-secondary/20 transition-colors">
                <td className="p-4">
                  <p className="text-[14px] font-bold text-foreground">{app.applicant}</p>
                  <p className="text-[12px] text-muted-foreground">{app.company}</p>
                </td>
                <td className="p-4 hidden md:table-cell">
                   <div className="flex items-center gap-2">
                     <span className={`w-2 h-2 rounded-full ${app.icpFit === 'HIGH' ? 'bg-success' : 'bg-warning'}`}></span>
                     <span className="text-[12px] font-medium text-foreground">{app.icpFit}</span>
                   </div>
                </td>
                <td className="p-4 hidden lg:table-cell">
                   <span className="text-[12px] text-foreground font-medium">{app.recommendedRoute || 'Pending'}</span>
                </td>
                <td className="p-4">
                   <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-background border border-border">{app.status}</span>
                </td>
                <td className="p-4 text-right">
                   <button className="bg-foreground text-background text-[11px] font-bold px-4 py-1.5 rounded-[6px] hover:opacity-90">Review</button>
                </td>
              </tr>
            )) || <tr><td colSpan={5} className="p-8 text-center text-[12px] text-muted-foreground">No applications found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
