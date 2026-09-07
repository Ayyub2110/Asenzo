"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Opportunity, PipelineStage } from "@/lib/types/conversion";
import { useConversionOS } from "@/contexts/ConversionOSContext";

// TASK 09 & TASK 12: Sales Pipeline Flow
const STAGES: { id: PipelineStage; label: string }[] = [
  { id: "LEAD", label: "Lead" },
  { id: "QUALIFIED", label: "Qualified" },
  { id: "CALL_BOOKED", label: "Call Booked" },
  { id: "CALL_SHOWED", label: "Call Showed" },
  { id: "OFFER_PROPOSAL", label: "Offer / Proposal" },
  { id: "OFFER_SENT", label: "Offer Sent" },
  { id: "CLOSED_WON", label: "Closed Won" },
  { id: "CLOSED_LOST", label: "Closed Lost" }
];

export default function PipelineWorkspace() {
  const { opportunities, leads } = useConversionOS();

  const totalValue = opportunities.reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0);
  const wonValue = opportunities.filter(o => o.pipelineStage === "CLOSED_WON").reduce((acc, curr) => acc + (curr.closedAt ? curr.estimatedValue : 0), 0);

  return (
    <div className="px-8 py-6 max-w-[1500px] mx-auto space-y-6 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Commercial Pipeline</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Track opportunities logically from qualification through to closed revenue.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right mr-4 border-r border-slate-200 pr-5">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Weighted Pipeline</p>
             <p className="text-[16px] font-bold text-slate-900">£{(totalValue/1000).toFixed(1)}k</p>
          </div>
          <div className="text-right mr-4">
             <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Closed Won Rev</p>
             <p className="text-[16px] font-bold text-emerald-700">£{(wonValue/1000).toFixed(1)}k</p>
          </div>
          <button className="px-4 py-2 bg-slate-900 text-white text-[12px] font-bold rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">add</span>
            New Opportunity
          </button>
        </div>
      </div>

      <div className="flex gap-4 flex-1 overflow-x-auto overflow-y-hidden pb-4">
        {STAGES.map(stage => {
          const stageOpps = opportunities.filter(o => o.pipelineStage === stage.id);
          const stageTotal = stageOpps.reduce((sum, opp) => sum + opp.estimatedValue, 0);

          return (
            <div key={stage.id} className="w-[300px] shrink-0 bg-slate-50/50 border border-slate-200 rounded-xl flex flex-col h-full overflow-hidden">
              <div className={`p-3 border-b border-slate-200 flex items-center justify-between shadow-sm shrink-0 ${stage.id === "CLOSED_WON" ? "bg-emerald-50" : stage.id === "CLOSED_LOST" ? "bg-red-50" : "bg-slate-100/50"}`}>
                <h3 className={`text-[12px] font-bold uppercase tracking-widest ${stage.id === "CLOSED_WON" ? "text-emerald-700" : stage.id === "CLOSED_LOST" ? "text-red-700" : "text-slate-800"}`}>
                  {stage.label}
                </h3>
                <span className="text-[11px] font-bold text-slate-500">£{(stageTotal/1000).toFixed(1)}k</span>
              </div>
              
              <div className="p-3 space-y-3 overflow-y-auto flex-1 h-full pb-10">
                {stageOpps.map(opp => {
                  const lead = leads.find(l => l.id === opp.leadId);
                  
                  // TASK 10: Call Status inference (Mocked via data bounds for now, but dynamically linked)
                  // In a real DB this would be linked to Calls table.
                  const isWon = opp.pipelineStage === "CLOSED_WON";
                  const isLost = opp.pipelineStage === "CLOSED_LOST";
                  
                  return (
                  <div key={opp.id} className={`bg-white border p-4 rounded-lg shadow-sm transition-all cursor-pointer group ${isWon ? "border-emerald-200 shadow-emerald-50" : isLost ? "border-red-200 opacity-75" : "border-slate-200 hover:border-slate-300"}`}>
                    
                    {/* TASK 10: Status Tag */}
                    <div className="mb-2">
                       <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${
                          opp.pipelineStage === "CALL_BOOKED" ? "bg-blue-100 text-blue-700" :
                          opp.pipelineStage === "CALL_SHOWED" ? "bg-indigo-100 text-indigo-700" :
                          isWon ? "bg-emerald-100 text-emerald-800" :
                          isLost ? "bg-red-100 text-red-800" :
                          "bg-slate-100 text-slate-600"
                       }`}>
                          {isWon ? "WON & CONTRACT SENT" : isLost ? opp.lostReason || "No Fit" : opp.pipelineStage.replace("_", " ")}
                       </span>
                    </div>

                    <div className="flex justify-between items-start mb-2">
                       <span className="text-[13px] font-bold text-slate-900">{lead?.name || opp.leadId}</span>
                       <span className={`text-[11px] font-bold ${isWon ? "text-emerald-700" : "text-slate-700"}`}>${(opp.estimatedValue/1000).toFixed(1)}k</span>
                    </div>
                    
                    {!(isWon || isLost) && (
                      <div className="space-y-1 mb-3">
                        <p className="text-[11px] text-slate-500 truncate"><span className="font-semibold text-slate-700">Trigger:</span> {opp.buyingTrigger || lead?.buyingTrigger || "Unknown"}</p>
                        <p className="text-[11px] text-slate-500 truncate"><span className="font-semibold text-slate-700">Problem:</span> {opp.problem || lead?.problem || "Unknown"}</p>
                      </div>
                    )}

                    {/* TASK 12 Fields for Won/Lost */}
                    {(isWon || isLost) && (
                       <div className="mt-3 p-2 bg-slate-50 rounded border border-slate-100 text-[10px]">
                          <div className="flex justify-between mb-1">
                             <span className="font-bold text-slate-500 uppercase">Closed Date</span>
                             <span className="font-semibold text-slate-800">{opp.closedAt || "Recent"}</span>
                          </div>
                          {isLost && (
                            <div className="flex justify-between">
                               <span className="font-bold text-slate-500 uppercase">Lost Reason</span>
                               <span className="font-semibold text-red-700 truncate max-w-[100px]">{opp.lostReason || "Price"}</span>
                            </div>
                          )}
                          {isWon && (
                            <div className="flex justify-between">
                               <span className="font-bold text-slate-500 uppercase">Offer</span>
                               <span className="font-semibold text-emerald-700 truncate max-w-[100px]">{opp.offerId}</span>
                            </div>
                          )}
                       </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
                      <div className="flex items-center gap-1">
                         <span className="material-symbols-outlined text-[14px] text-slate-400">event</span>
                         <span className="text-[10px] font-bold text-slate-500">{opp.expectedCloseDate || "-"}</span>
                      </div>
                      <Link 
                        href={(opp.pipelineStage === "CALL_BOOKED" || opp.pipelineStage === "CALL_SHOWED") ? "/conversion/pipeline/calls" : (isWon ? "/delivery/onboarding" : "/conversion/pipeline")} 
                        className={`text-[10px] font-bold uppercase tracking-widest transition-opacity ${isWon ? "text-emerald-600 opacity-100" : "text-blue-600 opacity-0 group-hover:opacity-100"}`}
                      >
                         {isWon ? "Deliver" : "Open"}
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
