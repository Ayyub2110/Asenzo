"use client";

import React, { useState } from "react";
import { 
  getRetention, 
  updateRetentionEngagement, 
  addRetentionInteraction,
  updateRetentionRisk,
  updateRetentionAction
} from "@/lib/adapters";
import { 
  RetentionEngagement, 
  RetentionInteraction,
  RetentionRisk,
  RetentionNextAction
} from "@/lib/types";

import { Skeleton, CardSkeleton, EmptyState } from "@/components/ui/States";
import { Alert } from "@/components/ui/Alert";
import { useAdapter } from "@/hooks/useAdapter";

export default function RetentionWorkspace() {
  const { data, setData, localData, setLocalData, loading, error, reload: loadData } = useAdapter(getRetention);
  const [selectedEngagementId, setSelectedEngagementId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="p-container-padding max-w-[1440px] mx-auto space-y-8 animate-in fade-in duration-500">
        <header className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  // Rendering Error
  if (error || !localData) {
    return (
      <div className="max-w-[800px] mx-auto mt-12">
        <Alert variant="danger" title="Failed to load Retention Data">
          {error}
          <div className="mt-4">
            <button className="bg-primary text-white px-4 py-2 rounded-lg" onClick={loadData}>Retry</button>
          </div>
        </Alert>
      </div>
    );
  }

  // Select default
  if (!selectedEngagementId && localData.engagements.length > 0) {
      setSelectedEngagementId(localData.engagements[0].id);
  }

  const activeEngagement = localData.engagements.find(e => e.id === selectedEngagementId);
  const blockers = localData.engagements.filter(e => e.health === "AT_RISK" || e.health === "WATCH" || e.status === "NEEDS_ATTENTION").slice(0,3);

  const getHealthColorBox = (health: string) => {
      switch (health) {
        case "HEALTHY": return "bg-green-500";
        case "WATCH": return "bg-amber-500";
        case "AT_RISK": return "bg-error";
        default: return "bg-surface-variant";
      }
  };

  const currentArr = localData.engagements.length * 60000; // Mock derived metric for dashboard equivalent

  return (
    <>
    <header className="flex justify-between items-center w-full px-container-padding py-4 top-0 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20 z-40 sticky">
        <div className="flex items-center gap-8">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Retention &amp; LTV Dashboard</h2>
        </div>
        <div className="flex items-center gap-6">
            <div className="relative hidden md:block w-64">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
                <input className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg pl-9 pr-4 py-1.5 font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-on-surface-variant/50" placeholder="Search ASENZO engines..." type="text"/>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 font-label-muted text-[10px] text-on-surface-variant bg-surface border border-outline-variant/30 px-1.5 rounded">⌘K</span>
            </div>
            <div className="flex items-center gap-3 border-l border-outline-variant/30 pl-6">
                <button className="relative p-2 text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100 rounded-full hover:bg-surface-container-highest">
                    <span className="material-symbols-outlined">notifications</span>
                </button>
            </div>
        </div>
    </header>

    <div className="flex-1 overflow-y-auto p-container-padding pb-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-primary-container text-on-primary">Engine 5</span>
                    <span className="font-label-muted text-label-muted text-on-surface-variant uppercase tracking-wide">Retention &amp; LTV</span>
                </div>
                <h2 className="font-display-lg text-display-lg text-on-background">Retention Command</h2>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="font-label-muted text-label-muted text-on-surface-variant mb-1">Portfolio Value</p>
                    <div className="flex items-baseline gap-1 justify-end">
                        <span className="font-headline-md text-headline-md text-on-surface font-bold">${currentArr.toLocaleString()}</span>
                    </div>
                </div>
                <div className="h-10 w-px bg-outline-variant/30"></div>
                <div className="text-right">
                    <p className="font-label-muted text-label-muted text-on-surface-variant mb-1">Engagements</p>
                    <div className="font-headline-md text-headline-md text-on-surface font-bold">{localData.engagements.length}</div>
                </div>
            </div>
        </div>

        <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-error text-[20px]">warning</span> Active Retention Blockers
                </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-card-gap">
                {blockers.map(blocker => (
                    <div key={blocker.id} className="bg-surface-container-lowest border border-error-container p-5 rounded-xl shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className={`absolute top-0 left-0 w-1 h-full ${getHealthColorBox(blocker.health)}`}></div>
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mb-2 uppercase tracking-wide ${blocker.health === "AT_RISK" ? 'bg-error-container text-on-error-container' : 'bg-amber-100 text-amber-800'}`}>
                                    {blocker.health.replace("_", " ")}
                                </span>
                                <h4 className="font-body-lg text-body-lg font-semibold text-on-surface">{blocker.clientName}</h4>
                            </div>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mb-4 h-10 line-clamp-2">{blocker.intelligenceSignal || "No immediate intelligent signal active."}</p>
                    </div>
                ))}
                {blockers.length === 0 && (
                     <div className="col-span-3 text-center p-8 bg-surface-bright rounded-xl border border-outline-variant/20 text-on-surface-variant">
                         <span className="material-symbols-outlined text-[32px] mb-2 text-success">verified</span>
                         <p className="font-semibold text-on-surface text-[14.5px] mb-1">Clear</p>
                         <p className="text-[13px]">No active engagements require immediate attention.</p>
                     </div>
                )}
            </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-card-gap h-[600px]">
            <div className="w-full lg:w-[40%] bg-surface-container-lowest rounded-xl border border-outline-variant/30 flex flex-col overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.02)]">
                <div className="p-4 border-b border-outline-variant/20 flex justify-between items-center bg-surface/50">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Active Relationships</h3>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {localData.engagements.map(engagement => (
                        <div 
                            key={engagement.id}
                            onClick={() => setSelectedEngagementId(engagement.id)}
                            className={`p-4 border-b border-outline-variant/10 cursor-pointer transition-colors border-l-2 flex justify-between items-center group ${selectedEngagementId === engagement.id ? 'bg-surface-container-low/50 border-l-primary' : 'hover:bg-surface-container-low border-l-transparent'}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`relative flex h-3 w-3 rounded-full shrink-0 ${getHealthColorBox(engagement.health)}`}></div>
                                <div>
                                    <p className="font-body-sm text-body-sm font-semibold text-on-surface">{engagement.clientName}</p>
                                    <p className="font-label-muted text-label-muted text-on-surface-variant">{engagement.health.replace("_", " ")}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full lg:w-[60%] bg-surface-container-lowest rounded-xl border border-outline-variant/30 flex flex-col overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.04)] relative">
                {activeEngagement ? (
                    <>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                        <div className="p-6 border-b border-outline-variant/20 relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="font-display-lg-mobile text-display-lg-mobile text-on-background mb-1">{activeEngagement.clientName}</h2>
                                    <div className="flex items-center gap-3 font-body-sm text-body-sm text-on-surface-variant">
                                        <span className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${getHealthColorBox(activeEngagement.health)}`}></span> {activeEngagement.health.replace("_", " ")}</span>
                                        <span>•</span>
                                        <span>Last Interaction: {new Date(activeEngagement.lastInteractionDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-6 mt-6">
                                <div>
                                    <p className="font-label-muted text-label-muted text-on-surface-variant uppercase">Owner</p>
                                    <p className="font-headline-sm text-headline-sm font-semibold text-on-surface">{activeEngagement.owner}</p>
                                </div>
                                <div>
                                    <p className="font-label-muted text-label-muted text-on-surface-variant uppercase">Start Date</p>
                                    <p className="font-headline-sm text-headline-sm font-semibold text-on-surface">{new Date(activeEngagement.startDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 flex-1 overflow-y-auto space-y-8 relative z-10">
                            <div>
                                <h4 className="font-body-sm text-body-sm font-semibold text-on-surface uppercase tracking-wide mb-4">Relationship Summary</h4>
                                <div className="space-y-4">
                                    <p className="text-[14.5px] text-on-surface leading-relaxed">{activeEngagement.relationshipSummary}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-body-sm text-body-sm font-semibold text-on-surface uppercase tracking-wide mb-4">Action Queue</h4>
                                <div className="space-y-2">
                                    {activeEngagement.nextAction ? (
                                        <label className="flex items-center gap-3 p-3 rounded-lg border border-outline-variant/20 transition-colors cursor-pointer bg-surface">
                                            <input type="checkbox" className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" checked={activeEngagement.nextAction.status === 'COMPLETED'} />
                                            <span className="font-body-sm text-body-sm text-on-surface">{activeEngagement.nextAction.title} - {activeEngagement.nextAction.description}</span>
                                        </label>
                                    ) : (
                                        <div className="text-[13px] text-on-surface-variant">No actions scheduled.</div>
                                    )}
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="font-body-sm text-body-sm font-semibold text-on-surface uppercase tracking-wide mb-4">Goals</h4>
                                <div className="space-y-4">
                                    {activeEngagement.goals.map(goal => (
                                        <div key={goal.id}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="font-medium text-on-surface">{goal.title}</span>
                                                <span className="text-on-surface-variant">{goal.status}</span>
                                            </div>
                                            <div className="text-[13px] text-on-surface-variant">Current: {goal.currentState}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </>
                ) : (
                    <div className="p-8 text-center text-on-surface-variant">Select an active relationship to view details.</div>
                )}
            </div>
        </div>
    </div>
    </>
  );
}
