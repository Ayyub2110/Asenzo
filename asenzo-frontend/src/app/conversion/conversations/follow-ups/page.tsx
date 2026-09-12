"use client";

import React from "react";
import Link from "next/link";
import { Opportunity } from "@/lib/types/conversion";
import { useConversionOS } from "@/contexts/ConversionOSContext";

export default function FollowUpsWorkspace() {
  const { opportunities, leads } = useConversionOS();

  const requiresFollowUp = opportunities.filter(o => o.followUpState === "DUE" || o.followUpState === "OVERDUE");

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Priority Follow-ups</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Automated queue of action items required to unblock pipeline progression.</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-4">
           {requiresFollowUp.length === 0 ? (
             <div className="bg-white border text-center p-12 border-slate-200 rounded-xl shadow-sm">
               <span className="material-symbols-outlined text-[32px] text-slate-300 mb-2">done_all</span>
               <h3 className="text-[14px] font-bold text-slate-700">Inbox Zero.</h3>
               <p className="text-[12px] text-slate-500 mt-1">There are no overdue or pending follow-ups required in your active pipeline right now.</p>
             </div>
           ) : (
             <div className="space-y-4">
               {requiresFollowUp.map(opp => {
                 const lead = leads.find(l => l.id === opp.leadId);
                 return (
                 <div key={opp.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between group hover:border-amber-300 transition-colors">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 font-bold text-[10px] rounded uppercase ${opp.followUpState === 'OVERDUE' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                           {opp.followUpState}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500">{opp.nextAction || "Action required"}</span>
                      </div>
                      <h3 className="text-[14px] font-bold text-slate-900">{lead?.name || opp.leadId}</h3>
                      <p className="text-[12px] text-slate-500 mt-0.5">Stage: {opp.pipelineStage.replace('_', ' ')} • Value: £{(opp.estimatedValue || 0).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg">Draft AI Reply</button>
                      <button className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] rounded-lg">Open Deal</button>
                    </div>
                 </div>
               )})}
             </div>
           )}
        </div>
        
        <div className="col-span-4 space-y-4">
           {/* Intelligence */}
           <div className="bg-violet-50/50 border border-violet-100 rounded-xl p-5 shadow-sm">
              <h3 className="text-[10px] font-bold text-violet-600 uppercase tracking-widest flex items-center gap-1.5 mb-3">
                <span className="material-symbols-outlined text-[14px]">psychology</span>
                Follow-up Intelligence Agent
              </h3>
              <p className="text-[12px] text-slate-700 font-medium leading-relaxed">
                 You are losing momentum during the 'Offer Out' stage. The average deal sits idle for 6 days before follow-up. 
              </p>
              <div className="mt-4 pt-3 border-t border-violet-100">
                <p className="text-[11px] text-slate-500 font-medium">Recommendation: Deploy an automated Day 2 check-in on all deals over £10k.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
