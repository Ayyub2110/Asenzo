"use client";

import React, { useState } from "react";

import { Lead } from "@/lib/types/conversion";
import { useConversionOS } from "@/contexts/ConversionOSContext";

export default function OutreachPage() {
  const [filterTemp, setFilterTemp] = useState<"ALL" | "HOT" | "WARM" | "COLD">("ALL");
  const { leads, updateLead } = useConversionOS();
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const filteredLeads = leads.filter((l) => filterTemp === "ALL" || l.temperature === filterTemp);
  const selectedLead = leads.find(l => l.id === selectedLeadId) || filteredLeads[0];

  const handleApprove = (id: string) => {
    updateLead(id, { outreachStatus: "APPROVED" } as any);
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
                  onClick={() => setSelectedLeadId(lead.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedLead?.id === lead.id
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
                  <p className="text-[11px] text-slate-500">{lead.role || "Founder"} at <b>{lead.company || "Unknown"}</b></p>
                  <div className="mt-2 text-[10px] text-slate-400 truncate">Signal: {lead.buyingTrigger || (lead as any).icpFit || "Matched ICP list"}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Agent Intelligence & Human Review */}
        <div className="col-span-7 space-y-5">
          {selectedLead ? (
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-violet-600 uppercase tracking-widest">Outreach Intelligence Agent</span>
                <h3 className="text-[16px] font-bold text-slate-900">{selectedLead.name} ({selectedLead.company || "Unknown"})</h3>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md">
                ICP Fit: {(selectedLead as any).icpFit || "HIGH"}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Buying Signal Identified</label>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-[12px] text-slate-700 font-medium">
                  {selectedLead.buyingTrigger || (selectedLead as any).icpFit || "Matched ICP list"}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Agent Recommended Strategy Angle</label>
                <div className="p-3 bg-violet-50/60 border border-violet-100 rounded-lg text-[12px] text-violet-900 font-medium">
                  {(selectedLead as any).recommendedAngle || "Direct diagnostic hook referencing their specific role"}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Personalized Opening Message Draft</label>
                <textarea
                  value={(selectedLead as any).openingMessage || `Hey ${selectedLead.name}, saw you were looking into OS stuff...`}
                  onChange={(e) => {
                    updateLead(selectedLead.id, { openingMessage: e.target.value } as any);
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

              { (selectedLead as any).outreachStatus === "APPROVED" ? (
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
          ) : (
            <div className="bg-white border text-center p-12 border-slate-200 rounded-xl shadow-sm">
                <span className="material-symbols-outlined text-[32px] text-slate-300 mb-2">person_search</span>
                <h3 className="text-[14px] font-bold text-slate-700">No Lead Selected</h3>
                <p className="text-[12px] text-slate-500 mt-1">Select a lead from the queue to review AI outreach suggestions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
