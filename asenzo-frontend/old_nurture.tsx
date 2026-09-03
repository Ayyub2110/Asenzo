"use client";

import React, { useState } from "react";

const DM_KEYWORDS = [
  { id: "kw1", keyword: "OS", trigger: "Instagram / X DM", sequence: "Inbound OS Blueprint Delivery", leadsCaptured: 148, active: true },
  { id: "kw2", keyword: "AUDIT", trigger: "LinkedIn DM", sequence: "Founder Drag Self-Audit Link", leadsCaptured: 94, active: true },
  { id: "kw3", keyword: "SYSTEM", trigger: "YouTube Comment", sequence: "7-Figure Acquisition Case Study", leadsCaptured: 215, active: true },
];

const NURTURE_SEQUENCES = [
  { id: "seq1", name: "Problem-Aware 5-Day Email Breakdowns", targetStage: "Problem-Aware", emailsCount: 5, openRate: "48.2%", clickRate: "14.5%", leadsEnrolled: 312 },
  { id: "seq2", name: "Solution-Aware Inbound Proof Series", targetStage: "Solution-Aware", emailsCount: 4, openRate: "52.1%", clickRate: "19.8%", leadsEnrolled: 184 },
  { id: "seq3", name: "Most-Aware Founder Case Study & VSL Offer", targetStage: "Most-Aware", emailsCount: 3, openRate: "61.4%", clickRate: "28.3%", leadsEnrolled: 95 },
];

export default function NurturePage() {
  const [newKeyword, setNewKeyword] = useState("");

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto space-y-6">
      <div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Pillar 4 ΓÇö Lead Capture & Nurture</p>
        <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">DM Keywords, Capture & Email Sequences</h1>
        <p className="text-[12px] text-slate-500 mt-0.5">Automate lead capture triggers, automated DM routing, and awareness-based nurture campaigns.</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left: DM Keyword Triggers */}
        <div className="col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-[14px] font-bold text-slate-900">Active DM Keyword Triggers</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="New Keyword (e.g. BLUEPRINT)"
                className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-[12px] uppercase font-bold focus:outline-none"
              />
              <button className="px-3 py-1.5 bg-slate-900 text-white text-[11px] font-bold rounded-lg hover:bg-slate-800">
                Add Keyword
              </button>
            </div>
            <div className="space-y-3">
              {DM_KEYWORDS.map((kw) => (
                <div key={kw.id} className="p-3.5 border border-slate-200 rounded-xl bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-extrabold text-[12px] rounded">
                        "{kw.keyword}"
                      </span>
                      <span className="text-[11px] text-slate-500">{kw.trigger}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">Routes to: <b>{kw.sequence}</b></p>
                  </div>
                  <div className="text-right">
                    <div className="text-[13px] font-bold text-slate-900">{kw.leadsCaptured}</div>
                    <div className="text-[10px] text-slate-400 font-semibold">Leads</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Nurture Sequences */}
        <div className="col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[14px] font-bold text-slate-900">Awareness Nurture Sequences</h2>
              <button className="px-3 py-1.5 border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg hover:bg-slate-50">
                + New Sequence
              </button>
            </div>
            <div className="space-y-3">
              {NURTURE_SEQUENCES.map((seq) => (
                <div key={seq.id} className="p-4 border border-slate-200 rounded-xl bg-white shadow-xs space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-[13px] font-bold text-slate-900">{seq.name}</h3>
                      <p className="text-[11px] text-slate-500">{seq.emailsCount} Emails ΓÇó Target: {seq.targetStage}</p>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600 px-2 py-0.5 bg-emerald-50 rounded">
                      {seq.leadsEnrolled} Active Leads
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-600 pt-2 border-t border-slate-100">
                    <span>Avg Open Rate: <b className="text-slate-900">{seq.openRate}</b></span>
                    <span>Avg Click Rate: <b className="text-blue-600">{seq.clickRate}</b></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
