"use client";
import React from "react";
import { getIntelligence } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function AttributionPage() {
  const { localData, loading, error } = useAdapter(getIntelligence);

  if (loading) return <div className="p-10 animate-pulse h-96 w-full bg-muted/20 rounded-[16px]" />;
  if (error || !localData) return <div className="p-10">Error loading Attribution.</div>;

  const { attribution } = localData;

  if (attribution.length === 0) {
    return (
      <div className="p-16 text-center text-muted-foreground bg-card rounded-[16px] border border-border mt-8">
        <h3 className="text-[14px] font-bold text-foreground mb-2">No attribution data available.</h3>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 pb-32">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Strategic Attribution Layer</h2>
      </div>
      
      <div className="bg-card border border-border rounded-[16px] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border bg-muted/10">
           <h3 className="text-[16px] font-bold text-foreground mb-1">Where does commercially valuable demand actually originate?</h3>
           <p className="text-[13px] text-muted-foreground">This center analyzes downstream Acquisition data to link source origin across the entire business lifecycle.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px] whitespace-nowrap">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Source</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-right">Leads</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-right">Qualified</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-right">Opportunities</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-right">Won</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-right">Revenue Influenced</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
               {attribution.map(a => (
                 <tr key={a.id} className="hover:bg-muted/20 transition-colors">
                   <td className="px-6 py-4 font-bold text-foreground text-[14px]">{a.source}</td>
                   <td className="px-6 py-4 text-right text-[14px]">{a.leads}</td>
                   <td className="px-6 py-4 text-right font-medium text-[14px]">{a.qualified}</td>
                   <td className="px-6 py-4 text-right font-bold text-primary text-[14px]">{a.opportunities}</td>
                   <td className="px-6 py-4 text-right font-bold text-success text-[14px]">{a.won}</td>
                   <td className="px-6 py-4 text-right font-bold text-foreground text-[14px]">${a.revenue.toLocaleString()}</td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
