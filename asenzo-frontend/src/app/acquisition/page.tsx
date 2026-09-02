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

const ALERTS = [
  { type: "warning", icon: "warning", color: "text-amber-600 bg-amber-50 border-amber-200", text: "Audience profile is 31 days old — re-validation recommended before next campaign." },
  { type: "insight", icon: "insights", color: "text-blue-600 bg-blue-50 border-blue-200", text: "Talking-head content outperforming comparison-style by 2.4× this month." },
  { type: "opportunity", icon: "auto_awesome", color: "text-violet-600 bg-violet-50 border-violet-200", text: "3 ideas validated across 4+ creators this week — strong market signal for MOF content." },
  { type: "gap", icon: "warning_amber", color: "text-orange-600 bg-orange-50 border-orange-200", text: "MOF underrepresented — only 18% of recent posts. Target is 30%." },
];

const PERF_SIGNALS = [
  { label: "Best Hook", value: "Curiosity-Led", sub: "+34% vs avg" },
  { label: "Best Format", value: "Talking Head", sub: "+28% engagement" },
  { label: "Best Pillar", value: "Client Acquisition", sub: "7 of top 10 posts" },
  { label: "Best Awareness", value: "Problem-Aware", sub: "Highest reach" },
  { label: "Top Pattern", value: "Contrarian → Proof", sub: "8.5× baseline lift" },
];

const NEXT_ACTION = {
  type: "MOF",
  title: "Client Acquisition Case Study — Problem-Aware",
  reason: "This idea has been independently used by 4 creators this week. One nano creator (normally 2K views) hit 84K — 42× baseline outperformance. Your Solution-Aware content is currently underrepresented (4 vs target 6). Proof-led hooks are outperforming educational hooks in your niche by 3.1×.",
  framework: "Problem → Belief Shift → Mechanism → Proof → CTA",
  awareness: "Solution-Aware",
  funnel: "MOF",
  pillar: "Client Acquisition",
};

const STRATEGY_SNAPSHOT = {
  niche: "B2B SaaS Founders",
  offer: "Content-led client acquisition system",
  primaryGoal: "Inbound qualified leads",
  bottleneck: "MOF content gap",
  lastUpdated: "2 days ago",
};

// ─── Component ─────────────────────────────────────────────────────────────────
export default function AcquisitionCommandCenter() {
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const totalPipeline = STAGES.reduce((a, s) => a + s.count, 0);

  return (
    <div className="px-8 py-6 pb-16 max-w-[1400px] mx-auto">

      {/* Header & Quick Operational Action Triggers */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Acquisition OS</p>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Command Center</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Real-time view of your acquisition machine — operational hub & 5-agent system health.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/acquisition/content" className="px-3 py-1.5 bg-slate-900 text-white text-[11px] font-bold rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">add</span>
            Create Content
          </Link>
          <Link href="/acquisition/research" className="px-3 py-1.5 border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">search</span>
            Run Research
          </Link>
          <Link href="/acquisition/scripts" className="px-3 py-1.5 border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">edit_note</span>
            Write Script
          </Link>
          <Link href="/acquisition/outreach" className="px-3 py-1.5 border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">send</span>
            Start Outreach
          </Link>
          <Link href="/acquisition/funnels" className="px-3 py-1.5 border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">account_tree</span>
            Build Funnel
          </Link>
        </div>
      </div>

      {/* Alerts strip */}
      <div className="space-y-2 mb-6">
        {ALERTS.map((a, i) => (
          <div key={i} className={`flex items-start gap-2.5 px-4 py-2.5 rounded-lg border text-[12px] ${a.color}`}>
            <span className="material-symbols-outlined text-[15px] mt-0.5 shrink-0">{a.icon}</span>
            <span>{a.text}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-5">

        {/* ── Left: Pipeline + Next Action ── */}
        <div className="col-span-8 space-y-5">

          {/* Content Pipeline */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[13px] font-bold text-slate-900">Content Pipeline</h2>
                <p className="text-[11px] text-slate-400">{totalPipeline} total content items across all stages</p>
              </div>
              <Link href="/acquisition/content"
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-700">
                Open Kanban →
              </Link>
            </div>

            {/* Pipeline stages */}
            <div className="space-y-2">
              {STAGES.map(s => {
                const isActive = activeStage === s.key;
                const pct = Math.round((s.count / Math.max(...STAGES.map(x => x.count))) * 100);
                return (
                  <div key={s.key}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${isActive ? "bg-slate-50" : "hover:bg-slate-50"}`}
                    onClick={() => setActiveStage(isActive ? null : s.key)}>
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                    <span className="text-[12px] font-semibold text-slate-700 w-24 shrink-0">{s.label}</span>
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: s.color, opacity: 0.7 }} />
                    </div>
                    <span className="text-[13px] font-bold w-8 text-right shrink-0" style={{ color: s.color }}>{s.count}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex gap-3">
              <Link href="/acquisition/content"
                className="flex-1 py-2 bg-slate-900 text-white text-[11px] font-bold rounded-lg text-center hover:bg-slate-800 transition-colors">
                Open Full Kanban
              </Link>
              <Link href="/acquisition/research"
                className="flex-1 py-2 border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg text-center hover:bg-slate-50 transition-colors">
                Research New Ideas
              </Link>
            </div>
          </div>

          {/* AI Next Action */}
          <div className="bg-white border border-violet-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[16px] text-violet-500">auto_awesome</span>
              <p className="text-[11px] font-bold text-violet-600 uppercase tracking-widest">What should I create next?</p>
            </div>
            <h3 className="text-[15px] font-bold text-slate-900 mb-1">{NEXT_ACTION.title}</h3>
            <div className="flex flex-wrap gap-1.5 mb-3">
              <span className="text-[10px] font-bold px-2 py-0.5 bg-violet-100 text-violet-700 rounded-md">{NEXT_ACTION.funnel}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md">{NEXT_ACTION.awareness}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">{NEXT_ACTION.pillar}</span>
            </div>
            <p className="text-[12px] text-slate-600 leading-relaxed mb-3">{NEXT_ACTION.reason}</p>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 mb-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Recommended Framework</p>
              <p className="text-[12px] font-semibold text-slate-700">{NEXT_ACTION.framework}</p>
            </div>
            <div className="flex gap-2">
              <Link href="/acquisition/content"
                className="px-4 py-2 bg-violet-600 text-white text-[11px] font-bold rounded-lg hover:bg-violet-700 transition-colors">
                Create This Content
              </Link>
              <Link href="/acquisition/research"
                className="px-4 py-2 border border-slate-200 text-slate-700 text-[11px] font-semibold rounded-lg hover:bg-slate-50 transition-colors">
                Explore Research
              </Link>
            </div>
          </div>

          {/* Performance Signals */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-[13px] font-bold text-slate-900 mb-3">Performance Signals</h2>
            <div className="grid grid-cols-5 gap-3">
              {PERF_SIGNALS.map(p => (
                <div key={p.label} className="bg-slate-50 rounded-lg p-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{p.label}</p>
                  <p className="text-[12px] font-bold text-slate-900">{p.value}</p>
                  <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">{p.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Strategy Snapshot + Quick Links ── */}
        <div className="col-span-4 space-y-4">

          {/* Strategy Snapshot */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[13px] font-bold text-slate-900">Strategy Snapshot</h2>
              <Link href="/acquisition/strategy" className="text-[11px] font-semibold text-blue-600 hover:text-blue-700">Edit →</Link>
            </div>
            <div className="space-y-2.5">
              {[
                { label: "Niche", value: STRATEGY_SNAPSHOT.niche },
                { label: "Offer", value: STRATEGY_SNAPSHOT.offer },
                { label: "Primary Goal", value: STRATEGY_SNAPSHOT.primaryGoal },
                { label: "Current Bottleneck", value: STRATEGY_SNAPSHOT.bottleneck, highlight: true },
                { label: "Last Updated", value: STRATEGY_SNAPSHOT.lastUpdated },
              ].map(row => (
                <div key={row.label}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{row.label}</p>
                  <p className={`text-[12px] font-semibold mt-0.5 ${row.highlight ? "text-amber-600" : "text-slate-800"}`}>{row.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Production Status */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-[13px] font-bold text-slate-900 mb-3">Production Status</h2>
            <div className="space-y-2">
              {[
                { label: "In Scripting", count: 3, color: "#2563EB" },
                { label: "In Production", count: 5, color: "#D97706" },
                { label: "In Review", count: 2, color: "#DC2626" },
                { label: "Scheduled", count: 6, color: "#16A34A" },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: row.color }} />
                    <span className="text-[12px] text-slate-600">{row.label}</span>
                  </div>
                  <span className="text-[13px] font-bold" style={{ color: row.color }}>{row.count}</span>
                </div>
              ))}
            </div>
            <Link href="/acquisition/content"
              className="mt-3 block w-full py-2 border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg text-center hover:bg-slate-50 transition-colors">
              View All Content
            </Link>
          </div>

          {/* Quick Nav */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Quick Navigation</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { href: "/acquisition/strategy", label: "Strategy", icon: "flag" },
                { href: "/acquisition/research", label: "Research", icon: "search" },
                { href: "/acquisition/content", label: "Content", icon: "view_kanban" },
                { href: "/acquisition/funnels", label: "Funnels", icon: "account_tree" },
                { href: "/acquisition/library", label: "Library", icon: "local_library" },
                { href: "/acquisition/analytics", label: "Analytics", icon: "bar_chart" },
              ].map(item => (
                <Link key={item.href} href={item.href}
                  className="flex items-center gap-2 px-3 py-2 border border-slate-100 rounded-lg hover:bg-slate-50 hover:border-slate-200 transition-colors">
                  <span className="material-symbols-outlined text-[14px] text-slate-400">{item.icon}</span>
                  <span className="text-[11px] font-semibold text-slate-700">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
