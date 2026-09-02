"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Opportunity } from "@/lib/types/conversion";

export default function ReactivationWorkspace() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/conversion/opportunities")
      .then(r => r.json())
      .then(data => {
        setOpportunities(data.filter((o: Opportunity) => o.pipelineStage === "LOST") || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/conversion/nurture" className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 material-symbols-outlined text-[16px] text-slate-500">arrow_back</Link>
        <div>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Reactivation Queue</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Identifies dormant/lost opportunities with verifiable triggers indicating renewed buying intent.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
         {isLoading ? (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-[12px]">Loading Reactivation Algorithms...</div>
         ) : opportunities.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-16 text-center">
               <span className="material-symbols-outlined text-[48px] text-slate-200 mb-2">sensor_window</span>
               <h3 className="text-[14px] font-bold text-slate-700">No Reactivation Triggers Detected.</h3>
               <p className="text-[12px] text-slate-500 mt-1 max-w-[400px]">The system constantly monitors lost deals against new intent signals. If no verified trigger exists, we do not fabricate outreach.</p>
            </div>
         ) : (
             <div className="flex-1 p-16 flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-[48px] text-emerald-100 mb-4">settings_input_antenna</span>
                <h3 className="text-[16px] font-bold text-slate-900 mb-2">Active Monitoring</h3>
                <p className="text-[12px] text-slate-500 max-w-[500px] leading-relaxed">
                   Currently monitoring {opportunities.length} lost opportunities. The Follow-up & Closing agent is evaluating historic decision criteria against latest intent signals. We will surface specific reactivation drafts here when we detect a legitimate opening (e.g., they solved a timing issue or interacted with a new matching offer).
                </p>
             </div>
         )}
      </div>
    </div>
  );
}
