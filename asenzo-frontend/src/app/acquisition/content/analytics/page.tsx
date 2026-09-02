"use client";

import React from "react";
import Link from "next/link";

const CONTENT_METRICS = [
  { label: "Total Reach / Views", value: "348.5K", delta: "+18.2%", color: "text-blue-600" },
  { label: "Avg Engagement Rate", value: "6.4%", delta: "+1.1%", color: "text-emerald-600" },
  { label: "Profile Visits", value: "14.2K", delta: "+24.0%", color: "text-violet-600" },
  { label: "Lead Magnet Downloads", value: "542", delta: "+31.5%", color: "text-amber-600" },
];

export default function ContentAnalyticsPage() {
  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Content System — Analytics</p>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Content Performance & Virality Analytics</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Deep-dive into content reach, hook engagement metrics, and awareness stage performance breakdown.</p>
        </div>
        <Link href="/acquisition/content-revenue" className="px-4 py-2 bg-slate-900 text-white text-[12px] font-bold rounded-lg hover:bg-slate-800 transition-colors">
          View Content-to-Revenue Attribution →
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {CONTENT_METRICS.map((m) => (
          <div key={m.label} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m.label}</p>
            <div className="flex items-baseline justify-between">
              <span className={`text-[22px] font-extrabold ${m.color}`}>{m.value}</span>
              <span className="text-[11px] font-bold text-emerald-600">{m.delta}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <h2 className="text-[14px] font-bold text-slate-900">Awareness Stage Performance Breakdown</h2>
        <div className="space-y-3">
          {[
            { stage: "Problem-Aware (TOF)", reach: "184.2K", conv: "3.2%", posts: 14, color: "bg-blue-500" },
            { stage: "Solution-Aware (MOF)", reach: "112.0K", conv: "8.4%", posts: 8, color: "bg-violet-500" },
            { stage: "Product / Most-Aware (BOF)", reach: "52.3K", conv: "19.1%", posts: 6, color: "bg-emerald-500" },
          ].map((row) => (
            <div key={row.stage} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-slate-900">{row.stage}</span>
                <span className="text-[11px] font-bold text-slate-600">{row.posts} Posts Published</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                <span>Reach: <b>{row.reach}</b></span>
                <span>Conversion Rate to DM/Lead: <b className="text-emerald-600">{row.conv}</b></span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className={`h-full ${row.color}`} style={{ width: row.conv }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
