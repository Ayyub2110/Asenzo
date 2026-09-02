"use client";
import React from "react";
import { getIntelligence } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function OpportunitiesPage() {
    const { localData, loading, error } = useAdapter(getIntelligence);

    if (loading) return <div className="p-10 animate-pulse h-96 w-full bg-muted/20 rounded-[16px]" />;
    if (error || !localData) return <div className="p-10">Error loading Opportunities.</div>;

    const { opportunities } = localData;

    if (opportunities.length === 0) {
        return (
            <div className="p-16 text-center text-muted-foreground bg-card rounded-[16px] border border-border mt-8">
                <h3 className="text-[14px] font-bold text-foreground mb-2">No opportunities detected yet.</h3>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 pb-32">
            <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-6">Growth Opportunities</h2>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {opportunities.map(o => (
                    <div key={o.id} className="bg-card border border-border p-6 rounded-[16px] shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-[18px] font-bold text-foreground leading-tight">{o.opportunity}</h3>
                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest leading-none shrink-0 ml-4 ${o.confidence === 'HIGH' ? 'bg-success/20 text-success' : 'bg-muted/50 text-muted-foreground'}`}>{o.confidence} CONFIDENCE</span>
                            </div>

                            <div className="text-[13px] text-muted-foreground space-y-2 mb-6">
                                <p><strong className="text-foreground">Source:</strong> {o.source}</p>
                                <p><strong className="text-foreground">Evidence:</strong> {o.evidence}</p>
                                <p><strong className="text-foreground">Expected Impact:</strong> <span className="text-success font-bold">{o.expectedImpact}</span></p>
                                <p><strong className="text-foreground">Related Center:</strong> {o.relatedCenter}</p>
                            </div>
                        </div>

                        <div className="border-t border-border pt-4">
                            <p className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground mb-1">Required Action</p>
                            <p className="text-[13px] font-bold text-foreground">{o.requiredAction}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
