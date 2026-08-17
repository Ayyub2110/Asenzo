"use client";

import React, { useState } from "react";
import { getConversion, updateOpportunity } from "@/lib/adapters";
import { OpportunityStage } from "@/lib/types";
import { useAdapter } from "@/hooks/useAdapter";

import { Skeleton } from "@/components/ui/States";

const STAGES: { id: OpportunityStage; label: string }[] = [
  { id: "QUALIFIED", label: "Qualified Lead" },
  { id: "CALL_SCHEDULED", label: "Scoping Call" },
  { id: "CALL_COMPLETED", label: "Technical Scoping" },
  { id: "PROPOSAL", label: "Executive Pitch" },
  { id: "CLOSED_WON", label: "Closed Won" }
];

export default function ConversionPage() {
  const { data, setData, localData, setLocalData, loading, error } = useAdapter(getConversion);
  const [isSaving, setIsSaving] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="p-10 max-w-[1440px] mx-auto space-y-8 animate-in fade-in duration-500">
        <Skeleton className="h-10 w-48 mb-4 border border-outline-variant/30 rounded-2xl" />
        <Skeleton className="h-64 w-full border border-outline-variant/30 rounded-2xl" />
      </div>
    );
  }

  if (error || !data || !localData) {
    return (
      <div className="p-10 max-w-[1440px] mx-auto">
        <div className="bg-error-container text-on-error-container p-6 rounded-[24px]">
          <p className="font-headline-md font-bold mb-2">Conversion Core Offline</p>
          <p className="font-body-md opacity-80">{error || "Unable to sync pipeline."}</p>
        </div>
      </div>
    );
  }

  async function handleStageAdvance(oppId: string, currentStage: OpportunityStage) {
    if (!localData) return;
    const stageIndex = STAGES.findIndex(s => s.id === currentStage);
    if (stageIndex >= STAGES.length - 1) return;
    
    setIsSaving(true);
    setMutationError(null);
    try {
      const nextStage = STAGES[stageIndex + 1].id;
      const oppIndex = localData.opportunities.findIndex(o => o.id === oppId);
      const updatedOpp = { ...localData.opportunities[oppIndex], stage: nextStage };
      
      const res = await updateOpportunity(updatedOpp);
      setLocalData(res);
      setData(res);
    } catch (err: unknown) {
      setMutationError("Failed to advance deal: " + (err as Error).message);
    } finally {
      setIsSaving(false);
    }
  }

  // Calculate aggregates
  const totalPipeline = localData.opportunities.reduce((sum, opp) => sum + opp.value, 0);

  return (
    <div className="p-10 max-w-[1600px] mx-auto space-y-10">
      
      {/* Header Array */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display-lg text-slate-900 mb-2 tracking-tight">Conversion Pipeline</h1>
          <p className="text-slate-500 font-body-lg">Active deals and revenue velocity.</p>
        </div>
        <div className="bg-white rounded-[24px] p-4 px-6 ambient-shadow border border-slate-200 flex items-center gap-6">
          <div>
            <p className="font-label-sm text-slate-400 uppercase">Total Pipeline</p>
            <p className="font-headline-lg text-slate-900 tracking-tight tabular-nums">
              ${totalPipeline.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {mutationError && (
        <div className="bg-red-50 text-red-500 p-4 rounded-xl font-label-md border border-red-100">
           {mutationError}
        </div>
      )}

      {/* Signature Module: The Deal Velocity Stream */}
      <div className="relative w-full bg-white rounded-[24px] ambient-shadow border border-slate-200 overflow-x-auto hide-scrollbar">
        <div className="flex h-full min-w-max p-8 gap-4">
          
          {STAGES.map((stage, idx) => {
            const oppsInStage = localData.opportunities.filter(o => o.stage === stage.id);
            const isLast = idx === STAGES.length - 1;

            return (
              <div key={stage.id} className="relative w-[320px] flex-shrink-0 flex flex-col group">
                {/* Visual River Connection */}
                {!isLast && (
                  <div className="absolute top-[28px] right-[-16px] w-[32px] border-t-2 border-slate-200 z-0"></div>
                )}
                
                {/* Stage Header */}
                <div className="bg-slate-50 rounded-full px-4 py-3 mb-6 relative z-10 border border-slate-200/60 flex items-center justify-between transition-colors group-hover:border-slate-300">
                  <span className="font-label-md font-bold text-slate-700">{stage.label}</span>
                  <span className="bg-white text-slate-500 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                    {oppsInStage.length}
                  </span>
                </div>

                {/* Stage Content */}
                <div className="flex-1 flex flex-col gap-3 min-h-[300px]">
                  {oppsInStage.length === 0 ? (
                    <div className="h-full border-2 border-dashed border-slate-100 rounded-[16px] flex flex-col items-center justify-center text-center p-6 bg-slate-50/50">
                      <span className="material-symbols-outlined text-slate-300 mb-2">water_drop</span>
                      <p className="font-label-sm text-slate-400">Stream dry.</p>
                      {idx === 0 && <p className="text-xs text-slate-400 mt-1">Awaiting new signals from Attention engine.</p>}
                    </div>
                  ) : (
                    oppsInStage.map(opp => (
                      <div 
                        key={opp.id} 
                        className="bg-white border border-slate-200 rounded-[16px] p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col relative group/card"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <p className="font-headline-md text-slate-900 tabular-nums tracking-tight leading-none">
                            ${opp.value.toLocaleString()}
                          </p>
                        </div>
                        
                        <p className="font-label-md font-bold text-slate-700 mb-1">{opp.leadName}</p>
                        <p className="text-[13px] text-slate-500 line-clamp-1 mb-4">
                          {opp.nextAction || "Pending context."}
                        </p>

                        {!isLast && (
                          <button 
                            disabled={isSaving}
                            onClick={() => handleStageAdvance(opp.id, opp.stage)}
                            className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-50 text-slate-600 rounded-lg font-label-sm font-bold opacity-0 group-hover/card:opacity-100 focus:opacity-100 transition-all hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 absolute bottom-0 left-0 rounded-t-none border-t border-slate-200"
                          >
                            Advance Deal <span className="material-symbols-outlined text-[16px]">trending_flat</span>
                          </button>
                        )}
                        {isLast && (
                          <div className="w-full py-2 bg-emerald-50 text-emerald-700 rounded-lg font-label-sm font-bold text-center mt-auto border border-emerald-100">
                            Won & Secured
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
          
        </div>
      </div>
      
    </div>
  );
}
