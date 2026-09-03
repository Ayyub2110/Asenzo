"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ActionQueueItem, Lead, Opportunity } from "@/lib/types/conversion";

const MOCK_ACTION_QUEUE: ActionQueueItem[] = [
  { id: "q1", type: "HOT_LEAD", title: "Hot Lead Needs Response", description: "David Miller matched ICP & downloaded Lead Magnet", urgency: "HIGH", targetRoute: "/conversion/leads" },
  { id: "q2", type: "CALL_DUE", title: "Sales Call Tomorrow", description: "Discovery call with Sarah Jenkins at CloudScale", urgency: "HIGH", targetRoute: "/conversion/pipeline/calls" },
];

const QUICK_ACTIONS = [
  { label: "Qualify Lead", icon: "verified", color: "text-blue-500", href: "/conversion/leads/qualification" },
  { label: "Create Opportunity", icon: "add_chart", color: "text-emerald-500", href: "/conversion/pipeline" },
  { label: "Log Conversation", icon: "forum", color: "text-purple-500", href: "/conversion/conversations" },
  { label: "Schedule Call", icon: "calendar_month", color: "text-orange-500", href: "/conversion/pipeline/calls" },
];

import { useConversionOS } from "@/contexts/ConversionOSContext";

export default function ConversionCommandCenter() {
  const [queue] = useState<ActionQueueItem[]>(MOCK_ACTION_QUEUE);
  
  const { leads, opportunities } = useConversionOS();

  const totalPipeline = opportunities.reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0);
  const qualifiedLeads = leads.filter(l => l.qualificationStatus === "QUALIFIED").length;

  const stats = [
    { label: "Total Leads", value: leads.length, change: "All Time" },
    { label: "Qualified Leads", value: qualifiedLeads, change: "Approved" },
    { label: "Active Deals", value: opportunities.length, change: "In Pipeline" },
    { label: "Pipeline Value", value: `£${(totalPipeline/1000).toFixed(1)}k`, change: "Weighted" },
    { label: "Calls Upcoming", value: opportunities.filter(o => o.pipelineStage === "CALL_BOOKED").length, change: "Scheduled" },
    { label: "Win Rate", value: "68%", change: "Last 30d" },
  ];

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto space-y-8">
      {/* Header */}
      <div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[14px]">track_changes</span>
          Pillar 3 — Conversion OS
        </p>
        <h1 className="text-[24px] font-bold text-slate-900 tracking-tight mt-1">Command Center</h1>
        <p className="text-[12px] text-slate-500 mt-1">Operating hub for turning qualified attention into closed revenue.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-6 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <p className="text-[11px] font-bold text-slate-500">{stat.label}</p>
            <div className="mt-2">
              <span className="text-[20px] font-bold text-slate-900">{stat.value}</span>
              <span className="text-[10px] text-emerald-600 font-semibold ml-2">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left: Action Queue */}
        <div className="col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-bold text-slate-900 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
              Action Queue
            </h2>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden divide-y divide-slate-100">
            {queue.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 rounded-full p-1 border ${
                    item.urgency === "HIGH" ? "bg-red-50 border-red-200 text-red-600" :
                    item.urgency === "MEDIUM" ? "bg-amber-50 border-amber-200 text-amber-600" :
                    "bg-slate-50 border-slate-200 text-slate-600"
                  }`}>
                    <span className="material-symbols-outlined text-[14px]">
                      {item.type === "HOT_LEAD" ? "local_fire_department" :
                       item.type === "CALL_DUE" ? "call" :
                       item.type === "OFFER_DECISION" ? "description" :
                       item.type === "FOLLOWUP" ? "refresh" : "history"}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-[13px] font-bold text-slate-900">{item.title}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.description}</p>
                  </div>
                </div>
                <Link 
                  href={item.targetRoute}
                  className="px-4 py-1.5 bg-slate-900 text-white text-[11px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Resolve
                </Link>
              </div>
            ))}
            {queue.length === 0 && (
               <div className="p-8 text-center text-[12px] text-slate-500">No pending actions.</div>
            )}
          </div>
        </div>

        {/* Right: Quick Actions & Intelligence */}
        <div className="col-span-4 space-y-5">
          {/* Quick Actions */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-[12px] font-bold text-slate-900 mb-3 uppercase tracking-wider text-slate-400">Manual Actions</h3>
            <div className="space-y-2">
              {QUICK_ACTIONS.map((action, i) => (
                <Link
                  key={i}
                  href={action.href}
                  className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all font-semibold text-[12px] text-slate-700"
                >
                  <span className={`material-symbols-outlined text-[18px] ${action.color}`}>{action.icon}</span>
                  {action.label}
                </Link>
              ))}
            </div>
          </div>

          {/* AI Intelligence Snippet */}
          <div className="bg-violet-50/50 border border-violet-100 rounded-xl p-5 shadow-sm">
            <h3 className="text-[10px] font-bold text-violet-600 uppercase tracking-widest flex items-center gap-1.5 mb-3">
              <span className="material-symbols-outlined text-[14px]">psychology</span>
              Conversion Intelligence
            </h3>
            <p className="text-[12px] font-medium text-slate-900 mb-2">Primary Bottleneck: Offer → Won</p>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              12 qualified calls resulted in only 3 closed-won deals this month. The highest-frequency blocker logged post-call is "Trust / Previous Agency Failure".
            </p>
            <div className="mt-4 pt-3 border-t border-violet-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Recommended Feedback Loop</span>
              <p className="text-[11px] font-medium text-slate-800 mt-1">Brief Acquisition to prioritize MOF proof & risk-reversal posts.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
