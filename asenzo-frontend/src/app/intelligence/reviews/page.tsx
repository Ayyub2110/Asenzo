"use client";
import React from "react";
import { getIntelligence } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function ReviewsPage() {
  const { localData, loading, error } = useAdapter(getIntelligence);

  if (loading) return <div className="p-10 animate-pulse h-96 w-full bg-muted/20 rounded-[16px]" />;
  if (error || !localData) return <div className="p-10">Error loading Strategic Reviews.</div>;

  const { reviews } = localData;

  if (reviews.length === 0) {
    return (
      <div className="p-16 text-center text-muted-foreground bg-card rounded-[16px] border border-border mt-8">
        <h3 className="text-[14px] font-bold text-foreground mb-2">No strategic reviews yet.</h3>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 pb-32">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Strategic Review Rhythm</h2>
        <button className="px-4 py-2 bg-primary text-primary-foreground text-[12px] font-bold rounded-[6px]">Start New Review</button>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
         {reviews.map(r => (
            <div key={r.id} className="bg-card border border-border p-6 rounded-[16px] shadow-sm">
               <div className="flex justify-between items-start mb-4">
                  <div>
                     <h3 className="text-[18px] font-bold text-foreground mb-1">{r.reviewPeriod} REVIEW</h3>
                     <p className="text-[12px] text-muted-foreground">Conducted: {new Date(r.date).toLocaleDateString()} • Participants: {r.participants.join(", ")}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest leading-none ${r.completedStatus ? 'bg-success/20 text-success' : 'bg-secondary text-foreground'}`}>
                     {r.completedStatus ? 'COMPLETED' : 'DRAFT'}
                  </span>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[13px]">
                  <div>
                    <h4 className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground mb-2">Core Findings</h4>
                    <p className="text-foreground mb-6 font-medium">{r.findings}</p>

                    <h4 className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground mb-2">Metrics Reviewed</h4>
                    <ul className="list-disc list-inside text-muted-foreground">
                       {r.metrics.map((m, i) => <li key={i}>{m}</li>)}
                    </ul>
                  </div>

                  <div className="bg-muted/10 p-5 rounded-[12px] border border-border">
                    <h4 className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground mb-2">Strategic Decisions</h4>
                    <p className="text-foreground mb-6 font-bold">{r.decisions}</p>

                    <h4 className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground mb-2">Committed Actions</h4>
                    <ul className="list-disc list-inside text-foreground font-medium">
                       {r.actions.map((act, i) => <li key={i}>{act}</li>)}
                    </ul>
                  </div>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}
