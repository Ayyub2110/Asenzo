"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Opportunity, PipelineStage } from "@/lib/types/conversion";
import { useConversionOS } from "@/contexts/ConversionOSContext";

// TASK 09 & TASK 12: Sales Pipeline Flow
const STAGES: { id: PipelineStage; label: string }[] = [
  { id: "QUALIFIED", label: "Qualified" },
  { id: "CALL_BOOKED", label: "Call Booked" },
  { id: "CALL_SHOWED", label: "Call Showed" },
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
                  <div key={opp.id} className={`bg-white border p-4 rounded-lg shadow-sm transition-all flex flex-col group ${isWon ? "border-emerald-200" : isLost ? "border-red-200 opacity-75" : "border-slate-200"}`}>
                    <div className="flex items-start justify-between mb-3 border-b border-slate-100 pb-3">
                       <div>
                          <div className="text-[14px] font-bold text-slate-900">{lead?.name || "Unknown Person"}</div>
                          <div className="text-[12px] text-slate-500 font-medium">{lead?.company || "Unknown Company"}</div>
                       </div>
                       <div className="text-right">
                          <div className={`text-[14px] font-black ${isWon ? "text-emerald-700" : isLost ? "text-red-700" : "text-slate-900"}`}>£{(opp.estimatedValue).toLocaleString()}</div>
                       </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                       <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase ${
                          lead?.temperature === "HOT" ? "bg-red-100 text-red-700" :
                          lead?.temperature === "WARM" ? "bg-amber-100 text-amber-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {lead?.temperature || "HOT"}
                       </span>
                       <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[9px] font-bold tracking-widest uppercase">
                          {stage.id.replace("_", " ")}
                       </span>
                    </div>

                    <div className="mt-auto">
                       <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Next Action</div>
                       <div className="text-[12px] font-bold text-slate-700 mb-3">
                          {stage.id === "QUALIFIED" && "Book sales call"}
                          {stage.id === "CALL_BOOKED" && "Attend scheduled call"}
                          {stage.id === "CALL_SHOWED" && "Review outcome & send offer"}
                          {stage.id === "OFFER_SENT" && "Follow up on offer"}
                          {stage.id === "CLOSED_WON" && "Handoff to delivery"}
                          {stage.id === "CLOSED_LOST" && "Review lost reason"}
                       </div>
                       <div className="flex items-center gap-2">
                          <Link href={`/conversion/leads`} className="flex-1 text-center py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded text-[10px] font-bold text-slate-600 transition">
                             [View Lead]
                          </Link>
                          {stage.id === "QUALIFIED" && (
                            <Link href="/conversion/pipeline/calls" className="flex-1 text-center py-1.5 bg-slate-900 border border-slate-900 hover:bg-slate-800 rounded text-[10px] font-bold text-white transition">
                               [Book Call]
                            </Link>
                          )}
                          {(stage.id === "CALL_BOOKED" || stage.id === "CALL_SHOWED") && (
                            <Link href="/conversion/pipeline/calls" className="flex-1 text-center py-1.5 bg-slate-900 border border-slate-900 hover:bg-slate-800 rounded text-[10px] font-bold text-white transition">
                               [View Calls]
                            </Link>
                          )}
                          {stage.id === "OFFER_SENT" && (
                            <Link href="/conversion/pipeline/offers" className="flex-1 text-center py-1.5 bg-slate-900 border border-slate-900 hover:bg-slate-800 rounded text-[10px] font-bold text-white transition">
                               [View Offer]
                            </Link>
                          )}
                          {stage.id === "CLOSED_WON" && (
                            <Link href="/delivery/onboarding" className="flex-1 text-center py-1.5 bg-emerald-600 border border-emerald-600 hover:bg-emerald-700 rounded text-[10px] font-bold text-white transition">
                               [Onboard]
                            </Link>
                          )}
                       </div>
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
