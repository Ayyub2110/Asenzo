"use client";

import React, { useState } from "react";

interface Lead {
  id: string;
  name: string;
  company: string;
  title: string;
  temperature: "HOT" | "WARM" | "COLD";
  icpFit: "HIGH" | "MEDIUM" | "LOW";
  signal: string;
  recommendedAngle: string;
  openingMessage: string;
  status: "QUEUED_FOR_APPROVAL" | "APPROVED" | "SENT" | "REPLIED";
}

const LEADS: Lead[] = [
  {
    id: "l1",
    name: "David Miller",
    company: "Apex B2B Agency",
    title: "Founder & CEO",
    temperature: "HOT",
    icpFit: "HIGH",
    signal: "Commented 'OS' on YouTube long-form VSL & downloaded Lead Magnet",
    recommendedAngle: "Direct diagnostic hook referencing their agency scalability bottleneck",
    openingMessage: "Hey David, saw your comment on our Inbound OS breakdown. Since you're running Apex, are you currently relying on outbound DMs or trying to build predictable inbound?",
    status: "QUEUED_FOR_APPROVAL",
  },
  {
    id: "l2",
    name: "Sarah Jenkins",
    company: "CloudScale Systems",
    title: "Head of Growth",
    temperature: "WARM",
    icpFit: "HIGH",
    signal: "Visited /vsl/acquisition-os twice in 48 hours",
    recommendedAngle: "Value-first offer breakdown case study",
    openingMessage: "Hi Sarah, noticed you were looking into our Acquisition OS architecture. Would it be helpful if I shared our 7-figure content-to-revenue tracking template?",
    status: "QUEUED_FOR_APPROVAL",
  },
  {
    id: "l3",
    name: "Alex Rivera",
    company: "SaaSify Inc",
    title: "Co-Founder",
    temperature: "COLD",
    icpFit: "MEDIUM",
    signal: "Matched B2B SaaS ICP target list (£1M-£5M ARR)",
    recommendedAngle: "Contrarian positioning question regarding agency retention",
    openingMessage: "Hey Alex, quick question — are you guys handling founder content in-house at SaaSify or relying on external agencies?",
    status: "QUEUED_FOR_APPROVAL",
  },
];

export default function OutreachPage() {
  const [filterTemp, setFilterTemp] = useState<"ALL" | "HOT" | "WARM" | "COLD">("ALL");
  const [leadsState, setLeadsState] = useState<Lead[]>(LEADS);
  const [selectedLead, setSelectedLead] = useState<Lead>(LEADS[0]);

  const filteredLeads = leadsState.filter((l) => filterTemp === "ALL" || l.temperature === filterTemp);

  const handleApprove = (id: string) => {
    setLeadsState((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: "APPROVED" } : l))
    );
    if (selectedLead.id === id) {
      setSelectedLead((prev) => ({ ...prev, status: "APPROVED" }));
    }
  };

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Pillar 5 — Outbound / Direct Acquisition</p>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Outreach Intelligence & Lead Workspace</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">AI Outreach Agent lead research with mandatory Human-in-the-Loop review before sending.</p>
        </div>
        <div className="flex items-center gap-2">
          {(["ALL", "HOT", "WARM", "COLD"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterTemp(t)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                filterTemp === t
                  ? "bg-slate-900 text-white"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left: Lead Queue */}
        <div className="col-span-5 space-y-3">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <h2 className="text-[13px] font-bold text-slate-900 mb-3">Segmented Leads ({filteredLeads.length})</h2>
            <div className="space-y-2">
              {filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedLead.id === lead.id
                      ? "border-blue-600 bg-blue-50/40 text-slate-900"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[13px]">{lead.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        lead.temperature === "HOT"
                          ? "bg-red-100 text-red-700"
                          : lead.temperature === "WARM"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {lead.temperature}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{lead.title} at <b>{lead.company}</b></p>
                  <div className="mt-2 text-[10px] text-slate-400 truncate">Signal: {lead.signal}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Agent Intelligence & Human Review */}
        <div className="col-span-7 space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-violet-600 uppercase tracking-widest">Outreach Intelligence Agent</span>
                <h3 className="text-[16px] font-bold text-slate-900">{selectedLead.name} ({selectedLead.company})</h3>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md">
                ICP Fit: {selectedLead.icpFit}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Buying Signal Identified</label>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-[12px] text-slate-700 font-medium">
                  {selectedLead.signal}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Agent Recommended Strategy Angle</label>
                <div className="p-3 bg-violet-50/60 border border-violet-100 rounded-lg text-[12px] text-violet-900 font-medium">
                  {selectedLead.recommendedAngle}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Personalized Opening Message Draft</label>
                <textarea
                  value={selectedLead.openingMessage}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedLead((prev) => ({ ...prev, openingMessage: val }));
                  }}
                  rows={4}
                  className="w-full p-3 border border-slate-200 rounded-lg text-[12px] font-mono leading-relaxed focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-amber-500">lock</span>
                Human-in-the-Loop Approval Required Before Outbound Send
              </span>

              {selectedLead.status === "APPROVED" ? (
                <span className="px-4 py-2 bg-emerald-100 text-emerald-800 text-[12px] font-bold rounded-lg flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  Approved & Dispatched
                </span>
              ) : (
                <button
                  onClick={() => handleApprove(selectedLead.id)}
                  className="px-4 py-2 bg-slate-900 text-white text-[12px] font-bold rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  Approve & Send Outreach
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
