"use client";
import React from "react";
import { getIntelligence } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function FounderIndependencePage() {
  const { localData, loading, error } = useAdapter(getIntelligence);

  if (loading) return <div className="p-10 animate-pulse h-96 w-full bg-muted/20 rounded-[16px]" />;
  if (error || !localData) return <div className="p-10">Error loading Founder Independence.</div>;

  const { founderDependency } = localData;

  return (
    <div className="p-6 md:p-10 pb-32">
      <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-6">Founder Independence Score</h2>

      <div className="bg-card border border-border rounded-[16px] overflow-hidden shadow-sm flex flex-col md:flex-row mb-8">
        <div className="p-10 md:w-1/3 border-b md:border-b-0 md:border-r border-border flex flex-col items-center justify-center bg-muted/10">
          <span className="text-[14px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Dependency Rating</span>
          <div className={`text-[64px] font-black leading-none ${founderDependency.score > 60 ? 'text-destructive' : founderDependency.score > 30 ? 'text-orange-600' : 'text-success'}`}>
            {founderDependency.score}%
          </div>
          <div className="mt-4 px-3 py-1 rounded-full border border-border bg-background text-[11px] font-bold uppercase tracking-widest">
            Trend: <span className={founderDependency.trend === 'DECREASING' ? 'text-success' : 'text-destructive'}>{founderDependency.trend}</span>
          </div>
        </div>
        <div className="p-10 flex-1">
          <h3 className="text-[18px] font-bold text-foreground mb-2">Executive Summary</h3>
          <p className="text-[14px] text-muted-foreground mb-8">{founderDependency.summary}</p>

          <h3 className="text-[12px] font-bold text-foreground uppercase tracking-widest mb-3">Major Dependency Sources</h3>
          <ul className="space-y-2 mb-8">
            {founderDependency.majorSources.map((s, i) => (
              <li key={i} className="flex items-center gap-2 text-[13px] text-muted-foreground">
                <span className="material-symbols-outlined text-[16px] text-destructive">error</span>
                {s}
              </li>
            ))}
          </ul>

          <div className="bg-muted/30 p-4 rounded-xl border border-border">
            <span className="block text-[11px] uppercase tracking-widest font-bold text-muted-foreground mb-1">Recommended Action</span>
            <p className="text-[14px] font-bold text-foreground">{founderDependency.recommendedAction}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
