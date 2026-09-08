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
  const [selectedOppId, setSelectedOppId] = useState<string | null>(null);
  const activeOpp = opportunities.find(o => o.id === selectedOppId);
  const activeLead = activeOpp ? leads.find(l => l.id === activeOpp.leadId) : null;

  const totalValue = opportunities.reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0);
  const wonValue = opportunities.filter(o => o.pipelineStage === "CLOSED_WON").reduce((acc, curr) => acc + (curr.closedAt ? curr.estimatedValue : 0), 0);

  const renderJourney = (currentStage: string) => {
    const journey = STAGES.map(s => s.id);
    const currentIndex = journey.indexOf(currentStage as any);
    
    return (
      <div className="flex flex-col gap-1.5 mt-2">
         {journey.map((s, idx) => {
            const isCurrent = s === currentStage;
            const isPassed = idx < currentIndex && currentIndex < 5;
            
            return (
               <div key={s} className="flex justify-between items-center text-[11px] font-bold">
                  <span className={`${isCurrent ? "text-slate-900" : isPassed ? "text-slate-600" : "text-slate-400"}`}>{s.replace("_", " ")}</span>
                  <span className={`${isCurrent ? "bg-slate-900 text-white px-2 py-0.5 rounded text-[9px]" : isPassed ? "text-slate-500" : "text-slate-300"}`}>
                     {isCurrent ? "CURRENT" : isPassed ? "✓" : "—"}
                  </span>
               </div>
            )
         })}
      </div>
    )
  };

  return (
    <div className="px-8 py-6 max-w-[1500px] mx-auto space-y-6 h-[calc(100vh-100px)] flex flex-col relative overflow-hidden">
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

      <div className={`flex gap-4 flex-1 overflow-x-auto overflow-y-hidden pb-4 transition-all duration-300 ${activeOpp ? 'pr-[420px]' : ''}`}>
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
                  <div key={opp.id} onClick={() => setSelectedOppId(opp.id)} className={`bg-white border rounded-lg p-3 cursor-pointer shadow-sm hover:border-blue-300 transition-all ${selectedOppId === opp.id ? 'border-blue-400 ring-1 ring-blue-400' : isWon ? 'border-emerald-200' : isLost ? 'border-red-200 opacity-75' : 'border-slate-200 hover:shadow'}`}>
                    <div className="font-bold text-slate-900 text-[13px] truncate">{lead?.name || "Unknown Person"}</div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">{lead?.email || "Unknown Email"}</div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-[9px] font-bold tracking-widest uppercase text-slate-400">
                        {stage.label}
                      </div>
                      <div className={`text-[9px] font-bold uppercase tracking-widest ${
                          lead?.temperature === "HOT" ? "text-red-600" :
                          lead?.temperature === "WARM" ? "text-amber-600" :
                          "text-blue-600"
                        }`}>
                        • {lead?.temperature || "COLD"}
                      </div>
                    </div>
                  </div>
                )})}
              </div>
            </div>
          )
        })}
      </div>
      {/* DRAWER PANEL */}
      <div className={`absolute top-0 right-0 bottom-0 w-[400px] bg-white border-l border-slate-200 shadow-2xl transition-transform duration-300 ease-in-out z-20 flex flex-col ${activeOpp ? 'translate-x-0' : 'translate-x-full'}`}>
         {activeOpp && activeLead && (
            <>
               <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between bg-slate-50 shrink-0">
                  <div>
                     <h2 className="text-[20px] font-black text-slate-900 leading-tight">{activeLead.name}</h2>
                     <p className="text-[12px] text-slate-500 font-medium mb-1">{activeLead.company || "Unknown Company"}</p>
                     <div className="flex gap-2 mt-3">
                        <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded ${activeOpp.pipelineStage === 'CLOSED_WON' ? 'bg-emerald-100 text-emerald-800' : activeOpp.pipelineStage === 'CLOSED_LOST' ? 'bg-red-100 text-red-800' : 'bg-slate-200 text-slate-700'}`}>{activeOpp.pipelineStage.replace("_", " ")}</span>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[9px] font-bold uppercase tracking-widest rounded">Value: £{activeOpp.estimatedValue.toLocaleString()}</span>
                     </div>
                  </div>
                  <button onClick={() => setSelectedOppId(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 transition text-slate-500">
                     <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  {/* NEXT ACTION */}
                  <div className="space-y-2">
                     <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Next Action</h3>
                     <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg">
                        <p className="text-[12px] font-bold text-blue-900 mb-2">{activeOpp.nextAction || `${activeOpp.pipelineStage.replace("_", " ")} follow-up`}</p>
                        <div className="flex gap-2">
                           <Link href="/conversion/leads" className="inline-block px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-[10px] font-bold rounded shadow-sm hover:bg-slate-50 transition uppercase tracking-wider">
                              View Lead
                           </Link>
                           {activeOpp.pipelineStage === "QUALIFIED" && (
                             <Link href="/conversion/pipeline/calls" className="inline-block px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold rounded shadow-sm hover:bg-slate-800 transition uppercase tracking-wider">
                                Book Call
                             </Link>
                           )}
                           {(activeOpp.pipelineStage === "CALL_BOOKED" || activeOpp.pipelineStage === "CALL_SHOWED") && (
                             <Link href="/conversion/pipeline/calls" className="inline-block px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold rounded shadow-sm hover:bg-slate-800 transition uppercase tracking-wider">
                                View Call Notes
                             </Link>
                           )}
                           {activeOpp.pipelineStage === "OFFER_SENT" && (
                             <Link href="/conversion/pipeline/offers" className="inline-block px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold rounded shadow-sm hover:bg-slate-800 transition uppercase tracking-wider">
                                Review Offer
                             </Link>
                           )}
                           {activeOpp.pipelineStage === "CLOSED_WON" && (
                             <Link href="/delivery/onboarding" className="inline-block px-3 py-1.5 bg-emerald-600 text-white text-[10px] font-bold rounded shadow-sm hover:bg-emerald-700 transition uppercase tracking-wider">
                                Init Onboarding
                             </Link>
                           )}
                        </div>
                     </div>
                  </div>
                  {/* CURRENT JOURNEY */}
                  <div className="space-y-2">
                     <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Current Journey</h3>
                     <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                        {renderJourney(activeOpp.pipelineStage)}
                     </div>
                  </div>

                  {/* SOURCE & ATTRIBUTION */}
                  <div className="space-y-2">
                     <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Source & Attribution</h3>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <span className="block text-[10px] text-slate-500">Source</span>
                           <span className="block text-[12px] font-bold text-slate-900">{activeLead.originalSource || "Unknown"}</span>
                        </div>
                        <div>
                           <span className="block text-[10px] text-slate-500">Campaign</span>
                           <span className="block text-[12px] font-bold text-slate-900 truncate">{activeLead.originalFunnel || "None"}</span>
                        </div>
                        <div className="col-span-2">
                           <span className="block text-[10px] text-slate-500">Content</span>
                           <span className="block text-[12px] font-bold text-slate-900">{activeLead.originalContent || "No specific content recorded."}</span>
                        </div>
                     </div>
                  </div>

                  {/* TRIGGER / PROBLEM / OUTCOME */}
                  <div className="space-y-2">
                     <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Opportunity Context</h3>
                     <div className="space-y-3">
                        <div>
                           <span className="block text-[11px] font-bold text-slate-700 mb-0.5">Target Problem</span>
                           <div className="p-3 bg-red-50 text-red-900 text-[12px] rounded border border-red-100">
                              {activeOpp.problem || activeLead.problem || "No primary problem identified yet."}
                           </div>
                        </div>
                        <div>
                           <span className="block text-[11px] font-bold text-slate-700 mb-0.5">Desired Outcome</span>
                           <div className="p-3 bg-blue-50 text-blue-900 text-[12px] rounded border border-blue-100">
                              {activeOpp.desiredOutcome || activeLead.desiredOutcome || "Not specified."}
                           </div>
                        </div>
                        <div>
                           <span className="block text-[11px] font-bold text-slate-700 mb-0.5">Buying Trigger</span>
                           <div className="p-3 bg-amber-50 text-amber-900 text-[12px] rounded border border-amber-100">
                              {activeOpp.buyingTrigger || activeLead.buyingTrigger || "No clear trigger identified yet."}
                           </div>
                        </div>
                        <div>
                           <span className="block text-[11px] font-bold text-slate-700 mb-0.5">Qualification Note</span>
                           <div className="p-3 bg-emerald-50 text-emerald-900 text-[12px] rounded border border-emerald-100">
                              {activeOpp.qualificationNote || "Passed qualification smoothly."}
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* KNOWN OBJECTIONS */}
                  <div className="space-y-2">
                     <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Known Objections</h3>
                     {activeOpp.objections && activeOpp.objections.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                           {activeOpp.objections.map(obj => (
                              <span key={obj} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-[11px] font-bold uppercase tracking-widest rounded border border-slate-200">{obj}</span>
                           ))}
                        </div>
                     ) : (
                        <p className="text-[11px] text-slate-500 italic">No objections recorded.</p>
                     )}
                  </div>
                  
                  {/* METADATA */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                     <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Owner</span>
                        <span className="text-[12px] font-bold text-slate-900">{activeOpp.owner}</span>
                     </div>
                     <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Probability</span>
                        <span className="text-[12px] font-bold text-slate-900">{activeOpp.probability}%</span>
                     </div>
                  </div>
               </div>
            </>
         )}
      </div>
    </div>
  );
}
