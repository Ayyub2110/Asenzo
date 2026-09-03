"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ContentEngineJob } from "@/lib/types/acquisition";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const MOCK_PLANNER = {
  "Monday": [{ id: "p1", title: "Why consistency isn't your problem", format: "LinkedIn Carousel", funnel: "TOF", status: "SCHEDULED" }],
  "Tuesday": [{ id: "p2", title: "Predictable Inbound Architecture", format: "YouTube Longform", funnel: "MOF", status: "READY" }],
  "Wednesday": [{ id: "p3", title: "Stop doing cold outreach", format: "X Thread", funnel: "TOF", status: "DRAFT" }],
  "Thursday": [{ id: "p4", title: "Story: Agency Mistake", format: "Instagram Reel", funnel: "BOF", status: "GENERATING" }],
  "Friday": [{ id: "p5", title: "Scale Readiness Application", format: "Newsletter", funnel: "MOF", status: "READY" }],
  "Saturday": [],
  "Sunday": []
};

export default function ContentPlannerPage() {
  const [planner, setPlanner] = useState<Record<string, any[]>>(MOCK_PLANNER);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateWeek = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setPlanner({
        ...planner,
        "Saturday": [{ id: "p6", title: "Founder Weekly Wrap-up", format: "LinkedIn Post", funnel: "TOF", status: "DRAFT" }],
        "Sunday": [{ id: "p7", title: "Preparing for scale (Mindset)", format: "X Thread", funnel: "TOF", status: "DRAFT" }]
      });
    }, 2500);
  };

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Pillar 1 — Content</p>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Weekly Content Planner</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Orchestrate and schedule content across channels using AI-driven queue generation.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleGenerateWeek}
            disabled={isGenerating}
            className="px-4 py-2 bg-blue-600 text-white text-[12px] font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5 disabled:opacity-50">
            <span className={`material-symbols-outlined text-[16px] ${isGenerating ? 'animate-spin' : ''}`}>smart_toy</span>
            {isGenerating ? "Engine Generating..." : "AI Auto-Fill Queue"}
          </button>
          <button className="px-4 py-2 bg-slate-900 text-white text-[12px] font-bold rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">add</span>
            Add Manual Slot
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {DAYS.map((day) => (
          <div key={day} className="bg-slate-50 border border-slate-200 rounded-xl flex flex-col h-[600px] overflow-hidden">
            <div className="bg-white border-b border-slate-200 p-3 flex items-center justify-between">
              <h3 className="text-[12px] font-extrabold text-slate-900">{day}</h3>
              <span className="text-[10px] font-bold text-slate-400">{planner[day].length} posts</span>
            </div>
            <div className="p-3 flex-1 overflow-y-auto space-y-3">
              {planner[day].length === 0 ? (
                <div className="h-24 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Empty Slot</div>
              ) : (
                planner[day].map((post) => (
                  <div key={post.id} className="bg-white border border-slate-200 shadow-sm rounded-lg p-3 cursor-pointer hover:border-blue-400 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-1.5 py-0.5 text-[9px] font-extrabold rounded uppercase ${
                        post.funnel === 'TOF' ? 'bg-slate-100 text-slate-600' : 
                        post.funnel === 'MOF' ? 'bg-violet-100 text-violet-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>{post.funnel}</span>
                      <span className={`text-[9px] font-bold uppercase ${post.status==='SCHEDULED'?'text-blue-600':post.status==='READY'?'text-emerald-600':post.status==='GENERATING'?'text-amber-500':'text-slate-400'}`}>{post.status}</span>
                    </div>
                    <h4 className="text-[11px] font-bold text-slate-900 leading-snug">{post.title}</h4>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[12px] text-slate-400">devices</span>
                      <span className="text-[10px] font-semibold text-slate-500">{post.format}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-2 border-t border-slate-200 bg-white">
              <button className="w-full py-1.5 text-[10px] font-bold text-slate-500 hover:bg-slate-50 rounded flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-[13px]">add</span> Add
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
