"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SalesCall } from "@/lib/types/conversion";
import { useConversionOS } from "@/contexts/ConversionOSContext";

export default function SalesCallWorkspace() {
  const { calls, updateCall, opportunities, leads } = useConversionOS();
  const [activeCallId, setActiveCallId] = useState<string | null>(null);
  
  const [callState, setCallState] = useState<Partial<SalesCall>>({
    id: "", opportunityId: "", scheduledDate: "", status: "SCHEDULED",
    situation: "", problem: "", impact: "", desiredOutcome: "", previousAttempts: "",
    beliefs: "", buyingTrigger: "", objections: "", fit: ""
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (calls && calls.length > 0) {
      setCallState(calls[0]);
      setActiveCallId(calls[0].id);
    }
    setIsLoaded(true);
  }, [calls]);

  const handleCompleteCall = async () => {
    setIsProcessing(true);
    if (activeCallId) {
      updateCall(activeCallId, { ...callState, status: "COMPLETED" } as any);
      alert("Call notes saved. AI extracted objections and updated the Opportunity record.");
    }
    setIsProcessing(false);
  };

  const targetOpp = opportunities.find(o => o.id === callState.opportunityId);
  const targetLead = leads.find(l => l.id === targetOpp?.leadId);

  return (
    <div className="px-8 py-6 max-w-[1500px] mx-auto h-[calc(100vh-130px)] flex flex-col space-y-4">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Sales Call Workspace</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">{targetLead?.name || "Unknown Lead"} — {targetLead?.company || "Unknown Company"}</p>
        </div>
        <button 
          onClick={handleCompleteCall}
          disabled={isProcessing || !isLoaded}
          className="px-5 py-2 bg-emerald-600 text-white text-[12px] font-bold rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1.5 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[16px]">call_end</span>
          {isProcessing ? "Processing..." : "Complete & Run Intelligence"}
        </button>
      </div>

      <div className="flex gap-4 flex-1 overflow-hidden">
        {/* Left: Pre-Call Context */}
        <div className="w-[300px] shrink-0 bg-white border border-slate-200 rounded-xl flex flex-col overflow-y-auto shadow-sm">
           <div className="p-4 border-b border-slate-100 bg-slate-50 sticky top-0">
             <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Pre-Call Context</h3>
           </div>
           <div className="p-4 space-y-5">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Acquisition Source</p>
                <div className="text-[12px] font-medium text-slate-900">{targetLead?.originalSource || "Unknown"}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{targetLead?.originalContent || "Unknown"}</div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Identified Trigger</p>
                <div className="text-[12px] font-medium text-slate-900">{targetLead?.buyingTrigger || targetOpp?.buyingTrigger || "Unknown"}</div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Foundation Qualifying Constraint</p>
                <div className="text-[12px] font-medium text-emerald-700">{targetLead?.qualificationStatus || "Unknown"}</div>
              </div>
           </div>
        </div>

        {/* Center: Diagnosis Framework */}
        <div className="flex-1 bg-white border border-slate-200 rounded-xl flex flex-col overflow-y-auto shadow-sm">
           <div className="p-4 border-b border-slate-100 bg-slate-50 sticky top-0 flex items-center justify-between">
             <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Diagnosis Framework</h3>
             <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded">Live Capture</span>
           </div>
           
           <div className="p-6 space-y-6">
              {[
                { id: "situation", label: "Situation", desc: "What is happening now?" },
                { id: "problem", label: "Problem", desc: "What is actually wrong?" },
                { id: "impact", label: "Impact", desc: "What is this costing them?" },
                { id: "desiredOutcome", label: "Desired Outcome", desc: "What do they actually want?" },
                { id: "previousAttempts", label: "Previous Attempts", desc: "What have they already tried?" },
                { id: "objections", label: "Objections", desc: "What could stop them?" }
              ].map(field => (
                <div key={field.id}>
                  <label className="text-[12px] font-bold text-slate-900 block mb-1">{field.label}</label>
                  <p className="text-[10px] text-slate-500 mb-2">{field.desc}</p>
                  <textarea 
                    value={callState[field.id as keyof SalesCall] as string}
                    onChange={(e) => setCallState({...callState, [field.id]: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg text-[13px] bg-slate-50/50 focus:bg-white focus:outline-none focus:border-blue-400 transition-colors"
                  />
                </div>
              ))}
           </div>
        </div>

        {/* Right: AI Intelligence */}
        <div className="w-[300px] shrink-0 bg-violet-50/50 border border-violet-100 rounded-xl flex flex-col overflow-y-auto shadow-sm">
           <div className="p-4 border-b border-violet-100 bg-violet-100/30 sticky top-0">
             <h3 className="text-[11px] font-bold text-violet-700 uppercase tracking-widest flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">psychology</span>
                Sales AI Agent
             </h3>
           </div>
           <div className="p-4 space-y-5">
              <div>
                <p className="text-[10px] font-bold text-violet-500 uppercase mb-2">Recommended Focus</p>
                <div className="bg-white border border-violet-100 p-3 rounded-lg text-[12px] text-slate-700 shadow-sm">
                   Probe deep into the fulfillment bottleneck. If they can't handle scale, the Acquisition OS will break their company.
                </div>
              </div>
              
              <div>
                <p className="text-[10px] font-bold text-violet-500 uppercase mb-2">Relevant Proof to Share</p>
                <div className="bg-white border border-violet-100 p-3 rounded-lg text-[12px] text-slate-700 shadow-sm flex flex-col gap-2">
                   <span className="font-semibold text-slate-900 line-clamp-1">Case Study: Elevate Media</span>
                   <span className="text-[11px]">How we built their content engine while fixing fulfillment capacity.</span>
                   <Link href="/foundation/proof" className="text-violet-600 font-bold text-[10px] mt-1">Open Asset</Link>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-violet-500 uppercase mb-2">Anticipated Objection</p>
                <div className="bg-white border border-violet-100 p-3 rounded-lg text-[12px] text-slate-700 shadow-sm">
                   Given their Q3 revenue metrics, expect price sensitivity. Pivot to opportunity cost of fixing it vs ignoring it.
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
