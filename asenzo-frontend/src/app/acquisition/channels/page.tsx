"use client";
import React from "react";
import { getIntelligence } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function ChannelsPage() {
  const { localData, loading, error } = useAdapter(getIntelligence);

  if (loading) return <div className="p-10 animate-pulse h-96 w-full bg-muted/20 rounded-[16px]" />;
  if (error || !localData) return <div className="p-10">Error loading Channels.</div>;

  const { channels } = localData;

  if (channels.length === 0) {
    return (
      <div className="p-16 text-center text-muted-foreground bg-card rounded-[16px] border border-border mt-8">
        <h3 className="text-[14px] font-bold text-foreground mb-2">No channel performance data available.</h3>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 pb-32">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Channel Performance Center</h2>
      </div>

      <div className="bg-card border border-border rounded-[16px] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border bg-muted/10">
          <h3 className="text-[16px] font-bold text-foreground mb-1">Are you optimizing for reach, or are you optimizing for revenue?</h3>
          <p className="text-[13px] text-muted-foreground">This view exposes channels driving vanity metrics vs. commercial results.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px] whitespace-nowrap">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Channel</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-right">Reach</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-right">Quality</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-right">Qualified / Leads</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-right">Opp Conv %</th>
                <th className="px-6 py-4 font-bold textError-foreground uppercase tracking-wider text-right">Rev / Opp</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-right">Total Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {channels.map(c => (
                <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4 font-bold text-foreground text-[14px]">{c.channel}</td>
                  <td className="px-6 py-4 text-right font-medium text-[14px]">{c.reach.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest ${c.engagementQuality === 'High' ? 'bg-success/20 text-success' : c.engagementQuality === 'Low' ? 'bg-destructive/20 text-destructive' : 'bg-muted text-muted-foreground'}`}>{c.engagementQuality}</span>
                  </td>
                  <td className="px-6 py-4 text-right text-[14px]">
                    <span className="font-bold text-primary">{c.qualifiedLeads}</span> <span className="text-muted-foreground">/ {c.leads}</span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-[14px]">{c.conversionRate}%</td>
                  <td className="px-6 py-4 text-right font-bold text-muted-foreground text-[14px]">${c.revenuePerOpportunity.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right font-bold text-success text-[14px]">${c.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
