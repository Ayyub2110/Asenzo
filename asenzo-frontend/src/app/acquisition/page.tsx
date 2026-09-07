"use client";

import React, { useState } from "react";
import Link from "next/link";

// ─── Data ─────────────────────────────────────────────────────────────────────
const STAGES = [
  { key: "INBOX", label: "Inbox", color: "#6B7280", count: 4 },
  { key: "SHORTLISTED", label: "Shortlisted", color: "#8B5CF6", count: 7 },
  { key: "SCRIPTING", label: "Scripting", color: "#2563EB", count: 3 },
  { key: "PRODUCTION", label: "Production", color: "#D97706", count: 5 },
  { key: "REVIEW", label: "Review", color: "#DC2626", count: 2 },
  { key: "SCHEDULED", label: "Scheduled", color: "#16A34A", count: 6 },
  { key: "PUBLISHED", label: "Published", color: "#0EA5E9", count: 34 },
  { key: "LEARNING", label: "Learning", color: "#7C3AED", count: 12 },
];

const HEALTH_STATUS = [
  { label: "Content Pipeline", status: "Healthy", color: "bg-emerald-500" },
  { label: "Research", status: "Healthy", color: "bg-emerald-500" },
  { label: "Publishing", status: "Needs Attention", color: "bg-amber-500" },
  { label: "Funnels", status: "Healthy", color: "bg-emerald-500" },
  { label: "Lead Generation", status: "Healthy", color: "bg-emerald-500" },
];

const STRATEGY_SNAPSHOT = {
  niche: "B2B SaaS Founders",
  offer: "Content-led Client Acquisition System",
  primaryGoal: "Inbound Qualified Leads",
  currentFocus: "Solution-aware content",
  bottleneck: "MOF coverage",
};

const RECENT_ACTIVITY = [
  { id: 1, action: "Content published", target: '"How SaaS founders..."', timestamp: "2 hours ago", link: "/acquisition/content" },
  { id: 2, action: "Research added", target: '"AI onboarding trends"', timestamp: "4 hours ago", link: "/acquisition/research" },
  { id: 3, action: "Funnel updated", target: '"Founder Lead Magnet"', timestamp: "Yesterday", link: "/acquisition/funnels" },
  { id: 4, action: "Content moved", target: "Production → Review", timestamp: "Yesterday", link: "/acquisition/content" },
  { id: 5, action: "Lead generated", target: "Source: LinkedIn", timestamp: "Yesterday", link: "/conversion/leads" },
];

export default function AcquisitionCommandCenter() {
  const totalPipeline = STAGES.reduce((a, s) => a + s.count, 0);

  return (
    <div className="px-8 py-6 pb-16 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Acquisition OS</p>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Command Center</h1>
        </div>
        <select className="px-3 py-1.5 border border-slate-200 rounded-lg text-[12px] font-bold text-slate-700 bg-slate-50 focus:outline-none focus:border-slate-400 hover:bg-slate-100 transition-colors shadow-sm cursor-pointer">
          <option>Today</option>
          <option>This Week</option>
          <option>This Month</option>
          <option>This Quarter</option>
          <option>This Year</option>
          <option>All Time</option>
        </select>
      </div>

      {/* Overview KPIs */}
      <div>
        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">query_stats</span> Acquisition Overview</h2>
        <div className="grid grid-cols-5 gap-4">
          <Link href="/acquisition/content" className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-blue-400 hover:shadow-md transition-all block group">
            <p className="text-[11px] text-slate-500 font-bold mb-1 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Total Content</p>
            <p className="text-[24px] font-black text-slate-900 leading-none">{totalPipeline}</p>
          </Link>
          <Link href="/acquisition/content" className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-blue-400 hover:shadow-md transition-all block group">
            <p className="text-[11px] text-slate-500 font-bold mb-1 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Published</p>
            <p className="text-[24px] font-black text-slate-900 leading-none">34</p>
            <p className="text-[10px] text-emerald-600 font-bold mt-1.5">↑ 12% vs prev</p>
          </Link>
          <Link href="/conversion/leads" className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-blue-400 hover:shadow-md transition-all block group">
            <p className="text-[11px] text-slate-500 font-bold mb-1 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Leads</p>
            <p className="text-[24px] font-black text-slate-900 leading-none">126</p>
          </Link>
          <Link href="/acquisition/funnels" className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-blue-400 hover:shadow-md transition-all block group">
            <p className="text-[11px] text-slate-500 font-bold mb-1 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Active Funnels</p>
            <p className="text-[24px] font-black text-slate-900 leading-none">4</p>
          </Link>
          <Link href="/acquisition/funnels" className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all block group">
            <p className="text-[11px] text-slate-500 font-bold mb-1 uppercase tracking-widest group-hover:text-emerald-600 transition-colors">Conversion</p>
            <p className="text-[24px] font-black text-slate-900 leading-none">16.4%</p>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        
        {/* Left Column */}
        <div className="col-span-8 space-y-8">
          
          {/* Health */}
          <div>
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">monitor_heart</span> Acquisition Health</h2>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm grid grid-cols-2 gap-y-4">
              {HEALTH_STATUS.map(h => (
                <div key={h.label} className="flex items-center gap-2.5 group">
                  <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${h.color}`} />
                  <span className="text-[12px] font-bold text-slate-700 w-32">{h.label}</span>
                  <span className={`text-[11px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${h.status === 'Healthy' ? 'text-slate-500 bg-slate-100' : 'text-amber-700 bg-amber-100'}`}>{h.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Content Pipeline */}
          <div>
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">view_kanban</span> Content Pipeline</h2>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-6">
              <div className="grid grid-cols-4 gap-4">
                {STAGES.map(s => (
                  <Link href="/acquisition/content" key={s.key} className="flex flex-col border border-slate-100 bg-slate-50 rounded-lg p-3 hover:bg-blue-50 hover:border-blue-100 transition-colors relative overflow-hidden">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">{s.label}</span>
                    <span className="text-[20px] font-black" style={{ color: s.color }}>{s.count}</span>
                    <div className="absolute bottom-0 left-0 h-1" style={{ backgroundColor: s.color, width: '20%', opacity: 0.5 }}></div>
                  </Link>
                ))}
              </div>
              <div className="pt-5 border-t border-slate-100 bg-slate-50/50 rounded-lg p-4">
                 <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2.5 flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">warning</span> Pipeline Attention</h3>
                 <div className="space-y-2 flex flex-col">
                    <Link href="/acquisition/content" className="text-[12px] text-slate-700 hover:text-blue-600 font-semibold inline-block border-l-2 border-transparent hover:border-blue-500 pl-2 transition-all">3 waiting in Scripting</Link>
                    <Link href="/acquisition/content" className="text-[12px] text-slate-700 hover:text-blue-600 font-semibold inline-block border-l-2 border-transparent hover:border-blue-500 pl-2 transition-all">2 waiting for Review</Link>
                    <Link href="/acquisition/content" className="text-[12px] text-slate-700 hover:text-blue-600 font-semibold inline-block border-l-2 border-transparent hover:border-blue-500 pl-2 transition-all">6 ready to Publish</Link>
                 </div>
              </div>
              <Link href="/acquisition/content" className="block w-full py-2.5 bg-slate-900 shadow-sm text-white text-[12px] font-bold rounded-lg text-center hover:bg-slate-800 transition-colors">
                Open Full Kanban
              </Link>
            </div>
          </div>

          {/* Needs Attention */}
          <div>
             <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">emergency_home</span> Needs Attention</h2>
             <div className="bg-amber-100/50 border border-amber-200 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-amber-200/50">
                   <div className="flex items-center gap-3 text-[13px] font-bold text-amber-900">
                     <span className="material-symbols-outlined text-amber-600 text-[18px]">error</span>
                     3 content items have been in Review for more than 3 days
                   </div>
                   <Link href="/acquisition/content" className="text-[11px] font-bold text-amber-700 border border-amber-200 bg-white px-3 py-1.5 rounded-lg shadow-sm hover:bg-amber-50 hover:border-amber-300 transition-all">View Content</Link>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-amber-200/50">
                   <div className="flex items-center gap-3 text-[13px] font-bold text-amber-900">
                     <span className="material-symbols-outlined text-amber-600 text-[18px]">calendar_clock</span>
                     Publishing cadence needs attention (nothing scheduled tomorrow)
                   </div>
                   <Link href="/acquisition/content" className="text-[11px] font-bold text-amber-700 border border-amber-200 bg-white px-3 py-1.5 rounded-lg shadow-sm hover:bg-amber-50 hover:border-amber-300 transition-all">Schedule</Link>
                </div>
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3 text-[13px] font-bold text-amber-900">
                     <span className="material-symbols-outlined text-amber-600 text-[18px]">troubleshoot</span>
                     Funnel "Founder Audit" has no recent activity
                   </div>
                   <Link href="/acquisition/funnels" className="text-[11px] font-bold text-amber-700 border border-amber-200 bg-white px-3 py-1.5 rounded-lg shadow-sm hover:bg-amber-50 hover:border-amber-300 transition-all">View Funnel</Link>
                </div>
             </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">history</span> Recent Activity</h2>
            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm space-y-1">
              {RECENT_ACTIVITY.map(act => (
                <Link href={act.link} key={act.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                  <div>
                    <span className="text-[12px] font-bold text-slate-900">{act.action}</span>
                    <span className="text-[12px] text-slate-500 ml-2 group-hover:text-blue-600 transition-colors">{act.target}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold tracking-widest">{act.timestamp}</span>
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="col-span-4 space-y-8">

          {/* Funnels & Conversion */}
          <div>
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">account_tree</span> Funnels & Conversion</h2>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
              <div className="space-y-4">
                 <div className="flex justify-between items-center"><span className="text-[12px] font-bold text-slate-500">Active Funnels</span><span className="text-[13px] font-black">4</span></div>
                 <div className="flex justify-between items-center"><span className="text-[12px] font-bold text-slate-500">Visitors</span><span className="text-[13px] font-black">1,842</span></div>
                 <div className="flex justify-between items-center"><span className="text-[12px] font-bold text-slate-500">Leads</span><span className="text-[13px] font-black">126</span></div>
                 <div className="flex justify-between items-center"><span className="text-[12px] font-bold text-slate-500">Conversions</span><span className="text-[13px] font-black text-emerald-600">31</span></div>
                 <div className="flex justify-between items-center pt-3 border-t border-slate-100"><span className="text-[12px] font-bold text-slate-900 uppercase tracking-widest">Global CVR</span><span className="text-[16px] font-black text-emerald-600">16.4%</span></div>
              </div>
              <Link href="/acquisition/funnels" className="block w-full py-2.5 border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg text-center shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all">
                 Open Funnels
              </Link>
            </div>
          </div>

          {/* Strategy Context */}
          <div>
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">tour</span> Strategy Context</h2>
            <div className="bg-slate-900 text-white rounded-xl p-6 shadow-md space-y-5">
              <div className="space-y-4">
                 <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Niche</p><p className="text-[13px] font-bold text-white">{STRATEGY_SNAPSHOT.niche}</p></div>
                 <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Offer</p><p className="text-[13px] font-bold text-white">{STRATEGY_SNAPSHOT.offer}</p></div>
                 <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Primary Goal</p><p className="text-[13px] font-bold text-white">{STRATEGY_SNAPSHOT.primaryGoal}</p></div>
                 <div className="pb-3 border-b border-slate-700"><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Current Focus</p><p className="text-[13px] font-bold text-blue-400">{STRATEGY_SNAPSHOT.currentFocus}</p></div>
                 <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Current Bottleneck</p><p className="text-[13px] font-bold text-amber-400">{STRATEGY_SNAPSHOT.bottleneck}</p></div>
              </div>
              <Link href="/acquisition/strategy" className="block w-full py-2.5 bg-slate-800 shadow-sm text-slate-300 text-[11px] font-bold rounded-lg text-center hover:bg-slate-700 hover:text-white transition-colors border border-slate-700">
                 Manage Strategy
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">bolt</span> Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
               <Link href="/acquisition/content" className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm text-center hover:border-slate-400 hover:shadow-md transition-all flex flex-col items-center justify-center gap-1.5 group">
                 <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-600 transition-colors">edit_square</span>
                 <span className="font-bold text-[11px] text-slate-700">Create Content</span>
               </Link>
               <Link href="/acquisition/research" className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm text-center hover:border-slate-400 hover:shadow-md transition-all flex flex-col items-center justify-center gap-1.5 group">
                 <span className="material-symbols-outlined text-slate-400 group-hover:text-amber-600 transition-colors">manage_search</span>
                 <span className="font-bold text-[11px] text-slate-700">Add Research</span>
               </Link>
               <Link href="/acquisition/scripts" className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm text-center hover:border-slate-400 hover:shadow-md transition-all flex flex-col items-center justify-center gap-1.5 group">
                 <span className="material-symbols-outlined text-slate-400 group-hover:text-purple-600 transition-colors">description</span>
                 <span className="font-bold text-[11px] text-slate-700">Write Script</span>
               </Link>
               <Link href="/acquisition/funnels" className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm text-center hover:border-slate-400 hover:shadow-md transition-all flex flex-col items-center justify-center gap-1.5 group">
                 <span className="material-symbols-outlined text-slate-400 group-hover:text-emerald-600 transition-colors">account_tree</span>
                 <span className="font-bold text-[11px] text-slate-700">Build Funnel</span>
               </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
