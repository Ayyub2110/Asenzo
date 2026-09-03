"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Opportunity, PipelineStage } from "@/lib/types/conversion";
import { useConversionOS } from "@/contexts/ConversionOSContext";

const STAGES: { id: PipelineStage; label: string }[] = [
  { id: "QUALIFIED", label: "Qualified" },
  { id: "CALL_BOOKED", label: "Call Booked" },
  { id: "DIAGNOSIS", label: "Diagnosis" },
  { id: "OFFER_PRESENTED", label: "Offer Out" },
  { id: "DECISION", label: "Decision" }
];

export default function PipelineWorkspace() {
  const { opportunities, leads } = useConversionOS();

  const totalValue = opportunities.reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0);

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Sales Pipeline</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Track opportunities from qualification through to closed revenue.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right mr-4">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Weighted Pipeline</p>
             <p className="text-[16px] font-bold text-slate-900">£{(totalValue/1000).toFixed(1)}k</p>
          </div>
          <button className="px-4 py-2 bg-slate-900 text-white text-[12px] font-bold rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">add</span>
            New Opportunity
          </button>
        </div>
      </div>

      <div className="flex gap-4 flex-1 overflow-x-auto min-h-[500px] pb-4">
        {STAGES.map(stage => {
          const stageOpps = opportunities.filter(o => o.pipelineStage === stage.id);
          const stageTotal = stageOpps.reduce((sum, opp) => sum + opp.estimatedValue, 0);

          return (
            <div key={stage.id} className="w-[300px] shrink-0 bg-slate-50/50 border border-slate-200 rounded-xl flex flex-col">
              <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-100/50 rounded-t-xl shrink-0">
                <h3 className="text-[12px] font-bold text-slate-800 uppercase tracking-widest">{stage.label}</h3>
                <span className="text-[11px] font-bold text-slate-500">£{(stageTotal/1000).toFixed(1)}k</span>
              </div>
              
              <div className="p-3 space-y-3 overflow-y-auto flex-1">
                {stageOpps.map(opp => {
                  const lead = leads.find(l => l.id === opp.leadId);
                  return (
                  <div key={opp.id} className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm hover:border-slate-300 transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-[13px] font-bold text-slate-900">{lead?.name || opp.leadId}</span>
                       <span className="text-[11px] font-bold text-emerald-600">${(opp.estimatedValue/1000).toFixed(1)}k</span>
                    </div>
                    <div className="space-y-1 mb-3">
                      <p className="text-[11px] text-slate-500 truncate"><span className="font-semibold text-slate-700">Trigger:</span> {opp.buyingTrigger || "Unknown"}</p>
                      <p className="text-[11px] text-slate-500 truncate"><span className="font-semibold text-slate-700">Problem:</span> {opp.problem || "Unknown"}</p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1">
                         <span className="material-symbols-outlined text-[14px] text-slate-400">event</span>
                         <span className="text-[10px] font-bold text-slate-500">{opp.expectedCloseDate || "-"}</span>
                      </div>
                      <Link 
                        href={opp.pipelineStage === "CALL_BOOKED" ? "/conversion/pipeline/calls" : "/conversion/pipeline"} 
                        className="text-[10px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                         Open
                      </Link>
                    </div>
                  </div>
                )})}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
