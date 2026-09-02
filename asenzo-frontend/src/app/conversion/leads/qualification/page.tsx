"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LeadQualification, QualificationStatus } from "@/lib/types/conversion";

const MOCK_QUALIFICATIONS: LeadQualification[] = [
  {
    leadId: "l1", problemFit: "Strong", audienceFit: "Strong", stageFit: "Strong", offerFit: "Strong",
    urgency: "High", desiredOutcome: "Predictable fulfillment & content ops", buyingTrigger: "Revenue flatlined in Q3",
    decisionAuthority: true, investmentReadiness: "High", previousAttempts: "Hired $5k/mo agency, churned after 60 days.",
    riskIndicators: [], constraintConflict: "None", status: "QUALIFIED",
    reasoningSummary: "Perfect ICP match. Experiencing acute pain in an area our core offer explicitly solves. Has authority and identified buying trigger.",
    recommendedAction: "BOOK SALES CALL"
  },
  {
    leadId: "l2", problemFit: "Medium", audienceFit: "Medium", stageFit: "Weak", offerFit: "Medium",
    urgency: "Medium", desiredOutcome: "More leads", buyingTrigger: "Recently raised Series A",
    decisionAuthority: false, investmentReadiness: "Low", previousAttempts: "None",
    riskIndicators: ["No founder presence", "Expects done-for-you lead gen"], constraintConflict: "Foundation dictates founder-led content only.",
    status: "CONDITIONALLY_QUALIFIED",
    reasoningSummary: "Good company profile but explicit conflict with Delivery constraints. Needs educational intervention regarding founder-led philosophy.",
    recommendedAction: "CLARIFY MISSING INFORMATION AND NURTURE"
  }
];

export default function QualificationWorkspace() {
  const [qualifications] = useState<LeadQualification[]>(MOCK_QUALIFICATIONS);

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Qualification Engine</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">AI-driven assessment against Foundation & Offer constraints.</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left: Queue */}
        <div className="col-span-5 space-y-4">
          <h2 className="text-[13px] font-bold text-slate-900">Pending & Recent Qualifications</h2>
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 shadow-sm">
            {qualifications.map((q, i) => (
              <div key={i} className={`p-4 cursor-pointer transition-colors ${i === 0 ? "bg-slate-50/80 border-l-2 border-l-blue-600" : "hover:bg-slate-50"}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-[13px] text-slate-900">{q.leadId === "l1" ? "David Miller" : "Sarah Jenkins"}</span>
                  <span className={`text-[10px] font-bold uppercase ${
                    q.status === "QUALIFIED" ? "text-emerald-600" :
                    q.status === "CONDITIONALLY_QUALIFIED" ? "text-amber-600" : "text-red-600"
                  }`}>
                    {q.status.replace("_", " ")}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 truncate">{q.buyingTrigger}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Detailed Assessment */}
        <div className="col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1.5">
                   <span className="material-symbols-outlined text-[14px]">psychology</span>
                   Qualification Agent Output
                </span>
                <h3 className="text-[18px] font-bold text-slate-900 mt-1">David Miller Assessment</h3>
              </div>
              <div className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-lg uppercase tracking-wider">
                Qualified
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-5">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Problem Fit</p>
                <p className="text-[13px] font-medium text-emerald-700 flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">check</span> {qualifications[0].problemFit}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Offer Fit</p>
                <p className="text-[13px] font-medium text-emerald-700 flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">check</span> {qualifications[0].offerFit}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Urgency</p>
                <p className="text-[13px] font-medium text-emerald-700 flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">check</span> {qualifications[0].urgency}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Foundation Constraints</p>
                <p className="text-[13px] font-medium text-slate-800">{qualifications[0].constraintConflict}</p>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Agent Reasoning</p>
              <div className="bg-slate-50 p-3 rounded-lg text-[12px] text-slate-700 leading-relaxed font-medium">
                {qualifications[0].reasoningSummary}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Recommended Next Action</p>
              <div className="text-[14px] font-bold text-slate-900 flex items-center gap-2">
                 <span className="material-symbols-outlined text-[18px] text-blue-600">arrow_forward</span>
                 {qualifications[0].recommendedAction}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5 flex items-center gap-3">
               <Link href="/conversion/pipeline/calls" className="px-5 py-2.5 bg-slate-900 text-white text-[12px] font-bold rounded-lg hover:bg-slate-800 transition-colors">
                 Create Opportunity & Book Call
               </Link>
               <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-[12px] font-bold rounded-lg hover:bg-slate-50 transition-colors">
                 Override to Unqualified
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
