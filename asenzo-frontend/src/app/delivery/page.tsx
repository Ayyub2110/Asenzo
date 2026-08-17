"use client";

import React, { useState } from "react";
import { getDelivery, updateDeliveryEngagement, completeDeliveryMilestone, resolveDeliveryBlocker } from "@/lib/adapters";
import { DeliveryEngagement, DeliveryMilestone, DeliveryBlocker, DeliveryStatus } from "@/lib/types";

import { Skeleton, CardSkeleton } from "@/components/ui/States";
import { Alert } from "@/components/ui/Alert";
import { useAdapter } from "@/hooks/useAdapter";

export default function DeliveryWorkspace() {
  const { data, setData, localData, setLocalData, loading, error, reload: loadData } = useAdapter(getDelivery);
  
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

  if (error || !localData) {
    return (
      <div className="max-w-[800px] mx-auto mt-12">
        <Alert variant="danger" title="Failed to load Delivery Data">
          {error}
          <div className="mt-4">
            <button className="bg-primary text-white px-4 py-2 rounded-lg" onClick={loadData}>Retry</button>
          </div>
        </Alert>
      </div>
    );
  }

  // Set default selection
  if (!selectedEngagementId && localData.engagements.length > 0) {
      setSelectedEngagementId(localData.engagements[0].id);
  }

  const activeEngagement = localData.engagements.find(e => e.id === selectedEngagementId);

  // Derived Health Data
  const blockers = localData.engagements.flatMap(e => e.blockers.filter(b => b.status === "active").map(b => ({...b, engagementClient: e.clientName}))).slice(0, 3);

  return (
    <>
      <header className="h-16 flex justify-between items-center px-container-padding w-full bg-surface/80 backdrop-blur-md border-b border-outline-variant/50 sticky top-0 z-40">
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-surface-container-high rounded font-label-caps text-[10px] tracking-wider text-on-surface-variant">ENGINE 3</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Delivery Command</h3>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <div className="relative hidden md:block w-64">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
                <input className="w-full bg-surface-container-low border border-outline-variant/30 rounded-full pl-9 pr-4 py-1.5 font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-on-surface-variant/50" placeholder="Search deliveries..." type="text"/>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 font-label-caps text-[10px] text-on-surface-variant bg-surface-container py-0.5 px-1.5 rounded">⌘K</span>
            </div>
            <button className="relative p-2 text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100 rounded-full hover:bg-surface-container-highest">
                <span className="material-symbols-outlined">notifications</span>
                {blockers.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border border-surface"></span>}
            </button>
        </div>
    </header>

      <div className="flex-1 overflow-y-auto p-container-padding space-y-card-gap pb-32">
        
        {/* Primary Constraint / Blockers */}
        <section>
            <div className="flex items-center justify-between mb-4">
                <h4 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
                    <span className="material-symbols-outlined text-error" data-icon="warning">warning</span>
                    Active Delivery Blockers
                </h4>
                <button className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">View All</button>
            </div>
            
            {blockers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-card-gap">
                {blockers.map((b, idx) => {
                    // Match the color styling from Stitch based on idx or random logic logic
                    let bgGradient = "from-error to-error/20";
                    let borderColor = "border-error-container/50";
                    let tagBg = "bg-error-container/50 text-on-error-container";
                    let btnColor = "bg-surface-container-high text-on-surface";
                    let icon = "mail";
                    let action = "Resolve Block";
                    
                    if (idx === 1) {
                        bgGradient = "from-orange-400 to-orange-200";
                        borderColor = "border-orange-100";
                        tagBg = "bg-orange-50 text-orange-800";
                        icon = "group_add";
                    } else if (idx === 2) {
                        bgGradient = "from-red-500 to-red-300";
                        borderColor = "border-red-100";
                        tagBg = "bg-red-50 text-red-800";
                        icon = "terminal";
                    }

                    return (
                    <div key={b.id} className={`bg-surface-container-lowest rounded-[24px] p-6 ambient-shadow card-hover border ${borderColor} relative overflow-hidden`}>
                        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${bgGradient}`}></div>
                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-2 py-1 rounded font-label-caps text-[10px] ${tagBg}`}>BLOCKER</span>
                            <span className="text-xs text-on-surface-variant">Active</span>
                        </div>
                        <h5 className="font-headline-sm text-headline-sm text-primary mb-1 line-clamp-1">{b.description}</h5>
                        <p className="text-sm text-on-surface-variant mb-4">{b.engagementClient}</p>
                        <button className={`w-full py-2 ${btnColor} rounded-lg text-sm font-medium hover:bg-surface-dim transition-colors flex items-center justify-center gap-2`}>
                            <span className="material-symbols-outlined text-[18px]">{icon}</span> {action}
                        </button>
                    </div>
                )})}
            </div>
            ) : (
            <div className="text-center p-8 bg-surface-bright rounded-2xl border border-outline-variant/20 text-on-surface-variant">
                <span className="material-symbols-outlined text-[32px] mb-2 text-success">check_circle</span>
                <p className="font-semibold text-on-surface text-[14.5px] mb-1">Clear</p>
                <p className="text-[13px]">No delivery blockers require immediate attention.</p>
            </div>
            )}
        </section>

        {/* Engagements Split Pane */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-card-gap h-[calc(100vh-320px)] min-h-[500px]">
            
            {/* Sidebar Active Engagements */}
            <div className="lg:col-span-4 bg-surface-container-lowest rounded-[24px] ambient-shadow flex flex-col overflow-hidden border border-outline-variant/30">
                <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-white z-10">
                    <h4 className="font-headline-sm text-headline-sm text-primary">Active Engagements</h4>
                    <div className="flex gap-2">
                        <button className="p-1.5 text-on-surface-variant hover:bg-surface-container rounded-lg"><span className="material-symbols-outlined text-[18px]">filter_list</span></button>
                        <button className="p-1.5 text-on-surface-variant hover:bg-surface-container rounded-lg"><span className="material-symbols-outlined text-[18px]">sort</span></button>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                    {localData.engagements.map((engagement, i) => {
                        const completed = engagement.milestones.filter(m => m.status === 'completed').length;
                        const total = engagement.milestones.length;
                        const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
                        
                        const colors = ['bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-emerald-500'];
                        const accentColor = colors[i % colors.length];

                        return (
                        <div 
                            key={engagement.id}
                            onClick={() => setSelectedEngagementId(engagement.id)}
                            className={`p-4 border-l-4 cursor-pointer transition-colors border-b border-outline-variant/20 flex justify-between items-center ${selectedEngagementId === engagement.id ? 'border-primary bg-surface-container/30' : 'border-transparent hover:bg-surface-container/30'}`}
                        >
                            <div>
                                <h5 className={`font-medium mb-1 ${selectedEngagementId === engagement.id ? 'text-primary' : 'text-on-surface'}`}>{engagement.clientName}</h5>
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${accentColor}`}></span>
                                    <span className="text-xs text-on-surface-variant">{engagement.engagementType}</span>
                                </div>
                            </div>
                            <div className={`text-right ${selectedEngagementId === engagement.id ? '' : 'opacity-60'}`}>
                                <span className={`text-sm font-semibold ${selectedEngagementId === engagement.id ? 'text-primary' : 'text-on-surface'}`}>{progress}%</span>
                                <div className="w-16 h-1 bg-surface-variant rounded-full mt-1">
                                    <div className={`h-1 ${accentColor} rounded-full`} style={{ width: `${progress}%` }}></div>
                                </div>
                            </div>
                        </div>
                    )})}
                </div>
            </div>

            {/* Main Detail Content */}
            <div className="lg:col-span-8 bg-surface-container-lowest rounded-[24px] ambient-shadow flex flex-col overflow-hidden border border-outline-variant/30">
                {activeEngagement ? (() => {
                    const completedCount = activeEngagement.milestones.filter(m => m.status === 'completed').length;
                    const totalCount = activeEngagement.milestones.length;
                    const progressVal = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
                    
                    return (
                        <>
                        <div className="p-8 border-b border-outline-variant/30 bg-white">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-display-lg text-display-lg text-primary">{activeEngagement.clientName}</h3>
                                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full font-label-caps text-[10px] border border-blue-100">{activeEngagement.engagementType.toUpperCase()}</span>
                                    </div>
                                    <p className="text-sm text-on-surface-variant flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px]">calendar_today</span> Target {new Date(activeEngagement.targetCompletion).toLocaleDateString()}
                                    </p>
                                </div>
                                <button className="px-4 py-2 border border-outline-variant rounded-lg text-sm font-medium hover:bg-surface-container-lowest transition-colors flex items-center gap-2">
                                    Options <span className="material-symbols-outlined text-[18px]">expand_more</span>
                                </button>
                            </div>

                            <div className="mt-4">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-sm font-medium text-on-surface-variant">Overall Progress</span>
                                    <span className="font-headline-sm text-headline-sm text-primary">{progressVal}% <span className="text-sm font-normal text-on-surface-variant">Complete</span></span>
                                </div>
                                <div className="w-full bg-surface-variant rounded-full h-2.5 overflow-hidden">
                                    <div className="bg-primary h-full rounded-full relative" style={{ width: `${progressVal}%` }}>
                                        <div className="absolute inset-0 bg-white/20 w-full" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.2) 10px, rgba(255,255,255,0.2) 20px)" }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
                            {/* Detailed Milestones */}
                            <div className="flex-1 p-8 border-r border-outline-variant/30 overflow-y-auto bg-surface-bright/30">
                                <h4 className="font-headline-sm text-headline-sm text-primary mb-6">Milestones</h4>
                                <div className="relative pl-4 border-l-2 border-surface-variant space-y-8">
                                    {activeEngagement.milestones.map((m, idx) => (
                                        <div key={m.id} className="relative">
                                            {m.status === 'completed' ? (
                                                <span className="absolute -left-[21px] p-0.5 bg-primary text-white rounded-full material-symbols-outlined text-[14px]">check</span>
                                            ) : m.status === 'in_progress' ? (
                                                <span className="absolute -left-[21px] w-[18px] h-[18px] bg-white border-2 border-primary rounded-full flex items-center justify-center">
                                                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                                                </span>
                                            ) : (
                                                <span className="absolute -left-[21px] w-[18px] h-[18px] bg-surface border-2 border-outline-variant rounded-full"></span>
                                            )}
                                            
                                            <div className={`pl-4 ${m.status === 'pending' ? 'opacity-50' : ''}`}>
                                                <h5 className={`text-sm mb-1 ${m.status === 'completed' ? 'font-semibold text-primary' : m.status === 'in_progress' ? 'font-bold text-primary' : 'font-semibold text-on-surface'}`}>{m.title}</h5>
                                                {m.status === 'in_progress' && (
                                                    <p className="text-xs text-error font-medium mb-2 flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[14px]">autorenew</span> Active
                                                    </p>
                                                )}
                                                <p className="text-xs text-on-surface-variant">{m.description}</p>
                                                <p className="text-[11px] text-on-surface-variant mt-1">Due {new Date(m.dueDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {activeEngagement.milestones.length === 0 && (
                                        <div className="text-sm text-on-surface-variant">No milestones defined.</div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Next Steps (Mocked derived) */}
                            <div className="w-full md:w-[320px] p-8 overflow-y-auto bg-white">
                                <h4 className="font-headline-sm text-headline-sm text-primary mb-6 flex items-center justify-between">
                                    Next Steps
                                    <button className="text-primary hover:bg-surface-container p-1 rounded-full"><span className="material-symbols-outlined text-[20px]">add</span></button>
                                </h4>
                                <div className="space-y-3">
                                    {activeEngagement.milestones.filter(m => m.status === "in_progress").map(m => (
                                        <label key={m.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-container/50 cursor-pointer transition-colors border border-transparent hover:border-outline-variant/30">
                                            <input className="mt-1 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary bg-surface-container-lowest" type="checkbox"/>
                                            <div>
                                                <p className="text-sm font-medium text-primary leading-tight">Complete {m.title}</p>
                                                <p className="text-xs text-error mt-1 font-medium">Due {new Date(m.dueDate).toLocaleDateString()}</p>
                                            </div>
                                        </label>
                                    ))}
                                    {activeEngagement.milestones.filter(m => m.status === "completed").map(m => (
                                         <label key={m.id} className="flex items-start gap-3 p-3 opacity-50 rounded-lg hover:bg-surface-container/50 cursor-pointer transition-colors border border-transparent hover:border-outline-variant/30">
                                            <input checked className="mt-1 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary bg-surface-container-lowest" disabled type="checkbox"/>
                                            <div className="line-through">
                                                <p className="text-sm font-medium text-on-surface leading-tight">Completed {m.title}</p>
                                            </div>
                                         </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        </>
                    )
                })() : (
                    <div className="p-8 text-center text-on-surface-variant self-center justify-self-center my-auto">Select a delivery engagement.</div>
                )}
            </div>

        </section>

      </div>

    </>
  );
}
