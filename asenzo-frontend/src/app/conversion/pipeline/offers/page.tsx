"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Opportunity } from "@/lib/types/conversion";

export default function OffersWorkspace() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/conversion/opportunities")
      .then(r => r.json())
      .then(data => {
        setOpportunities(data || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const offerOpportunities = opportunities.filter(o => o.pipelineStage === "OFFER_PRESENTED" || o.pipelineStage === "DECISION");

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Active Offers & Proposals</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Manage live commercial agreements that have been extended to prospects.</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-4">
           {isLoading ? (
             <div className="p-8 text-[12px] text-slate-500 text-center">Loading Offers...</div>
           ) : offerOpportunities.length === 0 ? (
             <div className="bg-white border text-center p-12 border-slate-200 rounded-xl shadow-sm">
               <span className="material-symbols-outlined text-[32px] text-slate-300 mb-2">description</span>
               <h3 className="text-[14px] font-bold text-slate-700">No active proposals in Pipeline.</h3>
               <p className="text-[12px] text-slate-500 mt-1">Move a deal to the 'Offer Out' stage to track its proposal lifecycle here.</p>
               <Link href="/conversion/pipeline" className="mt-4 px-4 py-2 inline-flex bg-slate-900 text-white font-bold text-[11px] rounded-lg">View Pipeline</Link>
             </div>
           ) : (
             <div className="space-y-4">
               {offerOpportunities.map(opp => (
                 <div key={opp.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
                    <div>
                      <h3 className="text-[14px] font-bold text-slate-900">{opp.leadId} — {opp.offerId || "Custom Build"}</h3>
                      <p className="text-[12px] text-slate-500 mt-0.5">Value: <span className="font-semibold text-emerald-600">£{(opp.estimatedValue || 0).toLocaleString()}</span></p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold text-[10px] rounded uppercase">{opp.pipelineStage.replace('_', ' ')}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <button className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] rounded-lg">Review Proposal</button>
                      <span className="text-[10px] text-slate-400">Needs Follow-up: {opp.followUpState || "None"}</span>
                    </div>
                 </div>
               ))}
             </div>
           )}
        </div>
        
        <div className="col-span-4 space-y-4">
           {/* Summary Stats */}
           <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Pending Revenue</h3>
              <div className="text-[28px] font-bold text-slate-900 leading-none">
                 £{offerOpportunities.reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-500 mt-2">Active proposals currently waiting for decision or negotiation.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
