"use client";
import React from "react";
import { getIntelligence } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function RecommendationsPage() {
  const { localData, loading, error } = useAdapter(getIntelligence);

  if (loading) return <div className="p-10 animate-pulse h-96 w-full bg-muted/20 rounded-[16px]" />;
  if (error || !localData) return <div className="p-10">Error loading Recommendations.</div>;

  const { recommendations } = localData;

  if (recommendations.length === 0) {
    return (
      <div className="p-16 text-center text-muted-foreground bg-card rounded-[16px] border border-border mt-8">
        <h3 className="text-[14px] font-bold text-foreground mb-2">No recommendations available.</h3>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 pb-32">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Strategic AI Recommendations</h2>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {recommendations.map(r => (
          <div key={r.id} className="bg-card border border-border p-6 rounded-[16px] shadow-sm flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-[20px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>neurology</span>
                <h3 className="text-[18px] font-bold text-foreground">{r.recommendation}</h3>
              </div>
              <div className="flex gap-2 mb-4">
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest ${r.priority === 'CRITICAL' ? 'bg-destructive/20 text-destructive' : 'bg-orange-500/20 text-orange-600'}`}>{r.priority} PRIORITY</span>
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest bg-secondary text-foreground`}>{r.affectedCenter}</span>
              </div>

              <div className="space-y-3 text-[13px] text-muted-foreground mb-6">
                <p><strong className="text-foreground">Reason:</strong> {r.reason}</p>
                <p><strong className="text-foreground">Evidence:</strong> {r.evidence}</p>
                <p><strong className="text-success">Expected Impact:</strong> {r.expectedImpact}</p>
              </div>
            </div>

            <div className="md:w-[280px] shrink-0 border-t md:border-t-0 md:border-l border-border md:pl-6 pt-6 md:pt-0 flex flex-col justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground mb-1">Status & Confidence</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[13px] font-bold text-foreground">{r.status}</span>
                  <span className={`text-[12px] font-bold ${r.confidence === 'HIGH' ? 'text-success' : 'text-orange-500'}`}>{r.confidence}</span>
                </div>
                <p className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground mb-1">Required Action</p>
                <p className="text-[13px] font-bold text-foreground mb-6">{r.requiredAction}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button className="w-full h-8 text-[12px] font-bold bg-primary text-primary-foreground rounded">Accept & Convert to Task</button>
                <button className="w-full h-8 text-[12px] font-bold bg-secondary text-foreground rounded">Reject</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
