"use client";

import React, { useState } from "react";
import { getCommandCenter, executeAction } from "@/lib/adapters";
import { ActionItem } from "@/lib/types";
import { useAdapter } from "@/hooks/useAdapter";

import { Skeleton, CardSkeleton } from "@/components/ui/States";
import { Alert } from "@/components/ui/Alert";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";

export default function CommandCenterPage() {
  const { data, setData, loading, error, reload: loadData } = useAdapter(getCommandCenter);
  const [pendingAction, setPendingAction] = useState<ActionItem | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  async function handleExecuteAction() {
    if (!pendingAction) return;
    setIsExecuting(true);
    try {
      await executeAction(pendingAction.id);
      setData(prev => prev ? {
        ...prev,
        actionQueue: prev.actionQueue.filter(a => a.id !== pendingAction.id)
      } : prev);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      alert(`Action failed: ${message}`);
    } finally {
      setIsExecuting(false);
      setPendingAction(null);
    }
  }

  if (loading) {
    return (
      <div className="p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <CardSkeleton />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-10 max-w-7xl mx-auto space-y-8">
        <Alert variant="danger" title={error || "Unexpected Error"}>
          We couldn&apos;t connect to the backend foundation.
          <div className="mt-4">
            <button className="bg-slate-900 text-white font-body-sm font-medium px-4 py-2 rounded-lg" onClick={loadData}>Retry Connection</button>
          </div>
        </Alert>
      </div>
    );
  }

  // Exact pulse mapping matching Stitch design layout
  const StitchColors = [
    { bg: "bg-electric-blue", shadow: "shadow-electric-blue/20", icon: "star", colorClass:"text-slate-600", pillBg: "bg-slate-100", pillText: "+2.4%" },
    { bg: "bg-amber-500", shadow: "shadow-amber-500/20", icon: "bar_chart", colorClass:"text-slate-600", pillBg: "bg-white", pillText: "+12%" },
    { bg: "bg-cyan-400", shadow: "shadow-cyan-400/20", icon: "work", colorClass:"text-slate-600", pillBg: "bg-slate-100", pillText: "Active" },
    { bg: "bg-red-500", shadow: "shadow-red-500/20", icon: "schedule", colorClass:"text-red-500", pillBg: "bg-red-50", pillText: "Action" },
  ];

  return (
    <div className="px-10 py-8 max-w-[1440px] mx-auto space-y-8">
        <div className="flex justify-between items-end mb-6">
            <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Growth Command Center</h1>
            <p className="text-slate-500">Welcome back, A. Mercer. Your pipeline is up 12% this quarter.</p>
            </div>
            <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">Export CSV</button>
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">Share Insights</button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {data.pulseMetrics.map((metric, idx) => {
                const style = StitchColors[idx % 4];
                return (
                    <div key={idx} className={`metric-card rounded-[24px] p-6 ambient-shadow hover:shadow-lg transition-shadow ${idx === 1 ? 'bg-slate-50' : ''}`}>
                        <div className="flex justify-between items-start mb-6">
                        <div className={`w-12 h-12 rounded-xl ${style.bg} flex items-center justify-center shadow-lg ${style.shadow}`}>
                        <span className="material-symbols-outlined text-white" style={{fontVariationSettings: "'FILL' 1"}}>{style.icon}</span>
                        </div>
                        <span className={`px-2 py-1 ${style.pillBg} ${style.colorClass} rounded-md font-label-sm text-label-sm flex items-center gap-1`}>
                            {style.pillText} <span className="material-symbols-outlined text-[14px]">{(idx === 3) ? 'arrow_forward' : 'trending_up'}</span>
                        </span>
                        </div>
                        <p className="font-label-md text-label-md text-slate-500 mb-2">{metric.title}</p>
                        <h3 className="font-display-lg text-3xl font-bold text-slate-900">
                            {metric.value}
                            {metric.title.includes('Score') && <span className="text-slate-400 text-xl">/100</span>}
                        </h3>
                    </div>
                )
            })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="metric-card rounded-[24px] p-8 ambient-shadow lg:col-span-2">
                <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Acquisition Velocity</h3>
                  <p className="text-sm text-slate-500">Pipeline vs Recognized <span className="w-2 h-2 inline-block rounded-full bg-electric-blue ml-2 mr-1"></span><span className="font-label-sm font-bold">PIPELINE</span> <span className="w-2 h-2 inline-block rounded-full bg-emerald ml-2 mr-1"></span><span className="font-label-sm font-bold">RECOGNIZED</span></p>
                </div>
                </div>
                <div className="h-64 relative flex items-end justify-between px-4 pb-4 pt-10">
                <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                <defs>
                <linearGradient id="gradBlue" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" style={{stopColor:'#3b82f6', stopOpacity:0.2}}></stop>
                    <stop offset="100%" style={{stopColor:'#3b82f6', stopOpacity:0}}></stop>
                </linearGradient>
                <linearGradient id="gradGreen" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" style={{stopColor:'#10b981', stopOpacity:0.2}}></stop>
                <stop offset="100%" style={{stopColor:'#10b981', stopOpacity:0}}></stop>
                </linearGradient>
                </defs>
                <path d="M0,80 C10,70 20,40 30,30 C40,20 50,60 60,70 C70,80 80,40 90,50 L100,50 L100,100 L0,100 Z" fill="url(#gradBlue)" stroke="#3b82f6" strokeWidth="0.5"></path>
                <path d="M0,90 C15,80 25,30 35,20 C45,10 55,50 65,40 C75,30 85,70 95,60 L100,60 L100,100 L0,100 Z" fill="url(#gradGreen)" stroke="#10b981" strokeWidth="0.5"></path>
                </svg>
                <div className="absolute right-0 top-1/2 -translate-y-4 flex flex-col gap-8 text-right pr-2">
                    <span className="font-label-sm text-electric-blue">$101K</span>
                    <span className="font-label-sm text-emerald">$84K</span>
                </div>
                <div className="absolute left-0 bottom-0 h-full flex flex-col justify-between text-[11px] font-label-md text-slate-400 py-4">
                <span>400</span><span>300</span><span>200</span><span>100</span><span>0</span>
                </div>
                <div className="absolute bottom-0 left-8 right-8 flex justify-between text-[11px] font-label-md text-slate-400">
                <span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span>
                </div>
                </div>
            </div>

            <div className="metric-card rounded-[24px] p-8 bg-surface-container-lowest ambient-shadow flex flex-col">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="font-headline text-headline-md font-bold text-on-surface tracking-tight">Growth Architecture</h3>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center relative">
                    <svg className="w-48 h-48 -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                        {/* Background track */}
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                        
                        {/* Signal (Cyan) 55% */}
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#22d3ee" strokeWidth="12" 
                                strokeLinecap="round" strokeDasharray="138 251" strokeDashoffset="0" />
                        
                        {/* Conv (Amber) 20% */}
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="12" 
                                strokeLinecap="round" strokeDasharray="50 251" strokeDashoffset="-150" />
                        
                        {/* Retain (Emerald) 10% */}
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="12" 
                                strokeLinecap="round" strokeDasharray="25 251" strokeDashoffset="-210" />
                    </svg>
                    
                    <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                        <span className="font-headline text-display-md font-bold text-slate-900 tracking-tight tabular-nums">$101k</span>
                    </div>
                </div>
                
                <div className="flex justify-between w-full mt-4 bg-slate-50/50 rounded-2xl p-4">
                    <div className="text-center">
                        <p className="font-headline text-headline-md font-bold text-cyan tabular-nums tracking-tight">55%</p>
                        <p className="font-label-sm text-slate-500 uppercase">Signal</p>
                    </div>
                    <div className="text-center">
                        <p className="font-headline text-headline-md font-bold text-amber tabular-nums tracking-tight">20%</p>
                        <p className="font-label-sm text-slate-500 uppercase">Conv.</p>
                    </div>
                    <div className="text-center">
                        <p className="font-headline text-headline-md font-bold text-emerald tabular-nums tracking-tight">10%</p>
                        <p className="font-label-sm text-slate-500 uppercase">Retain</p>
                    </div>
                </div>
            </div>
        </div>

      <ConfirmationDialog
        isOpen={pendingAction !== null}
        onClose={() => setPendingAction(null)}
        onConfirm={handleExecuteAction}
        title={pendingAction?.title || "Confirm Action"}
        description={pendingAction?.subtitle || "Are you sure you want to execute this action? It will mutate the live operational state."}
        confirmText="Confirm Execution"
        isLoading={isExecuting}
      />
    </div>
  );
}
