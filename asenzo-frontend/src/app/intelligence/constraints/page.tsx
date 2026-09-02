"use client";
import React from "react";
import { getIntelligence } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function ConstraintsPage() {
  const { localData, loading, error } = useAdapter(getIntelligence);

  if (loading) return <div className="p-10 animate-pulse h-96 w-full bg-muted/20 rounded-[16px]" />;
  if (error || !localData) return <div className="p-10">Error loading Constraints.</div>;

  const { constraints } = localData;

  if (constraints.length === 0) {
    return (
      <div className="p-16 text-center text-muted-foreground bg-card rounded-[16px] border border-border mt-8">
        <h3 className="text-[14px] font-bold text-foreground mb-2">No primary constraints detected</h3>
        <p className="text-[13px]">Insufficient data or systems are fully optimized.</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 pb-32">
      <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-6">Primary Constraint History</h2>

      <div className="space-y-6">
        {constraints.map(c => (
          <div key={c.id} className="bg-card border border-border p-6 rounded-[16px] shadow-sm flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-[18px] font-bold text-foreground">{c.constraint}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest leading-none ${c.severity === 'CRITICAL' ? 'bg-destructive/20 text-destructive' : 'bg-orange-500/20 text-orange-600'}`}>{c.severity}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest leading-none ${c.status === 'ACTIVE' ? 'bg-secondary text-foreground' : 'bg-success/20 text-success'}`}>{c.status}</span>
              </div>

              <div className="mb-4 text-[13px] text-muted-foreground">
                <p className="mb-1"><strong className="text-foreground">Affected Center:</strong> {c.affectedCenter}</p>
                <p className="mb-1"><strong className="text-foreground">Evidence:</strong> {c.evidence}</p>
                {c.resolution && <p className="mb-1"><strong className="text-foreground">Resolution:</strong> {c.resolution}</p>}
                {c.result && <p className="mb-1"><strong className="text-foreground">Result:</strong> {c.result}</p>}
              </div>

              {c.status === 'ACTIVE' && (
                <div className="p-4 bg-muted/20 border border-border rounded-lg text-[13px]">
                  <strong className="block text-[11px] uppercase tracking-widest text-muted-foreground mb-1">Recommended Action</strong>
                  <span className="font-bold">{c.recommendedAction}</span>
                </div>
              )}
            </div>

            <div className="shrink-0 text-right text-[12px]">
              <p className="mb-1"><strong className="text-muted-foreground uppercase tracking-widest text-[10px]">Detected</strong><br />{new Date(c.detectedDate).toLocaleDateString()}</p>
              {c.resolvedDate && <p><strong className="text-muted-foreground uppercase tracking-widest text-[10px]">Resolved</strong><br />{new Date(c.resolvedDate).toLocaleDateString()}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
