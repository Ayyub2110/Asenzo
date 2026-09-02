"use client";
import React from "react";
import { getIntelligence } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function RisksPage() {
    const { localData, loading, error } = useAdapter(getIntelligence);

    if (loading) return <div className="p-10 animate-pulse h-96 w-full bg-muted/20 rounded-[16px]" />;
    if (error || !localData) return <div className="p-10">Error loading Risks.</div>;

    const { risks } = localData;

    if (risks.length === 0) {
        return (
            <div className="p-16 text-center text-muted-foreground bg-card rounded-[16px] border border-border mt-8">
                <h3 className="text-[14px] font-bold text-foreground mb-2">No active risks detected.</h3>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 pb-32">
            <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-6">Risk Monitoring</h2>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {risks.map(r => (
                    <div key={r.id} className={`bg-card border p-6 rounded-[16px] shadow-sm flex flex-col justify-between ${r.severity === 'CRITICAL' ? 'border-destructive/30 bg-destructive/5' : 'border-border'}`}>
                        <div>
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-[18px] font-bold text-foreground leading-tight">{r.risk}</h3>
                                <div className="flex gap-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest leading-none shrink-0 ${r.severity === 'CRITICAL' ? 'bg-destructive/20 text-destructive' : 'bg-warning/20 text-warning'}`}>{r.severity} SEVERITY</span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest leading-none shrink-0 bg-muted/50 text-muted-foreground`}>{r.probability} PROB</span>
                                </div>
                            </div>

                            <div className="text-[13px] text-muted-foreground space-y-2 mb-6">
                                <p><strong className="text-foreground">Category:</strong> {r.category}</p>
                                <p><strong className="text-foreground">Evidence:</strong> {r.evidence}</p>
                                <p><strong className="text-foreground">Business Impact:</strong> <span className={r.severity === 'CRITICAL' ? 'text-destructive font-bold' : 'text-foreground font-bold'}>{r.businessImpact}</span></p>
                                <p><strong className="text-foreground">Affected Center:</strong> {r.affectedCenter}</p>
                                <p><strong className="text-foreground">Status:</strong> {r.status}</p>
                            </div>
                        </div>

                        <div className="border-t border-border pt-4">
                            <p className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground mb-1">Recommended Mitigation</p>
                            <p className="text-[13px] font-bold text-foreground">{r.mitigation}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
