"use client";

import React from "react";
import Link from "next/link";
import { useConversionOS } from "@/contexts/ConversionOSContext";

export default function UnifiedOnboardingSpace() {
  const { opportunities, leads } = useConversionOS();

  // Find just won recently for onboarding queue
  const onboardingQueue = opportunities
    .filter(o => o.pipelineStage === "CLOSED_WON")
    .map(opp => {
       const lead = leads.find(l => l.id === opp.leadId);
       return {
          id: opp.id,
          name: lead?.name || "Unknown",
          company: lead?.company || lead?.name || "Unknown Company",
          value: opp.estimatedValue,
          status: "Pending Intake"
       };
    });

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Client Onboarding</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Streamlined intake to active engagement pipeline.</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 overflow-x-auto min-h-[500px]">
         {[
            { id: "sales_handoff", label: "Sales Handoff" },
            { id: "intake_pending", label: "Awaiting Intake" },
            { id: "kickoff", label: "Kickoff Scheduled" },
            { id: "active", label: "Moved to Active" }
         ].map(column => (
            <div key={column.id} className="bg-slate-50/50 border border-slate-200 rounded-xl flex flex-col min-w-[280px]">
               <div className="p-3 border-b border-slate-200 bg-slate-100/50 rounded-t-xl shrink-0">
                  <h3 className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">{column.label}</h3>
               </div>
               
               <div className="p-3 space-y-3 overflow-y-auto flex-1">
                  {column.id === "sales_handoff" && onboardingQueue.map(client => (
                     <div key={client.id} className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm hover:border-blue-300 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                           <span className="text-[13px] font-bold text-slate-900">{client.company}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mb-3"><span className="font-semibold">{client.name}</span> • ${(client.value/1000).toFixed(1)}k</p>
                        
                        <div className="space-y-2 mt-4">
                           <button className="w-full text-center py-2 bg-slate-900 text-white rounded text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 focus:ring-2 focus:ring-slate-900/50">
                              Send Intake Form
                           </button>
                           <button className="w-full text-center py-2 border border-slate-200 text-slate-600 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50">
                              Review Sales Notes
                           </button>
                        </div>
                     </div>
                  ))}
                  {column.id === "sales_handoff" && onboardingQueue.length === 0 && (
                     <p className="text-[11px] text-slate-400 text-center mt-10">No recentCLOSED_WON deals.</p>
                  )}
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}
