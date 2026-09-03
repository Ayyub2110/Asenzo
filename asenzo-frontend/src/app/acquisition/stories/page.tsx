"use client";

import React, { useState } from "react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Mock Story Sequences focusing on IG/FB Story structure (ephemeral, multi-part, conversion-focused)
const MOCK_STORIES: Record<string, any[]> = {
  "Monday": [
    { id: "s1", time: "09:00 AM", type: "Morning Hook", content: "Did you know that 80% of founders fail at... [Poll]", status: "PUBLISHED" },
    { id: "s2", time: "12:30 PM", type: "Proof", content: "Screenshot of Client Win ($15k MRR added in 30 days)", status: "SCHEDULED" },
    { id: "s3", time: "05:00 PM", type: "Soft Pitch", content: "Link to YouTube Video: 3 Steps to Predictability", status: "DRAFT" },
  ],
  "Tuesday": [
    { id: "s4", time: "10:15 AM", type: "Behind the Scenes", content: "Filming the new VSL (Desk setup shot)", status: "READY" },
    { id: "s5", time: "03:00 PM", type: "Direct Offer", content: "Looking for 3 founders who want to scale. DM me 'SCALE'.", status: "READY" },
  ],
  "Wednesday": [
    { id: "s6", time: "08:45 AM", type: "Personal Insight", content: "Morning gym thought on discipline vs motivation", status: "DRAFT" },
    { id: "s7", time: "01:00 PM", type: "Q&A Setup", content: "Ask me anything about building an Acquisition OS", status: "DRAFT" },
    { id: "s8", time: "06:30 PM", type: "Q&A Answers", content: "Replying to top 3 questions from earlier", status: "GENERATING" },
  ],
  "Thursday": [],
  "Friday": [
    { id: "s9", time: "11:00 AM", type: "Case Study", content: "Client transformation breakdown (3 story sequence)", status: "DRAFT" },
  ],
  "Saturday": [],
  "Sunday": [
    { id: "s10", time: "07:00 PM", type: "Weekly Prep", content: "Planning the week ahead (Notion template screenshot)", status: "DRAFT" },
    { id: "s11", time: "08:00 PM", type: "Lead Magnet Drop", content: "Free resource for the new week (Link sticker)", status: "DRAFT" }
  ]
};

export default function StoryCalendarPage() {
  const [planner, setPlanner] = useState<Record<string, any[]>>(MOCK_STORIES);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateWeek = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setPlanner({
        ...planner,
        "Thursday": [
          { id: "s12", time: "09:30 AM", type: "Myth Busting", content: "Why cold email is dead (and what to do instead)", status: "READY" },
          { id: "s13", time: "02:00 PM", type: "Hand-raiser", content: "Want my Exact 2026 Outbound Script? Vote Yes below.", status: "READY" },
        ],
        "Saturday": [
          { id: "s14", time: "10:00 AM", type: "Lifestyle", content: "Weekend unplugged (Coffee / Reading)", status: "DRAFT" }
        ]
      });
    }, 2000);
  };

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Pillar 1 — Content</p>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Story Content Calendar</h1>
          <p className="text-[12px] text-slate-500 mt-0.5 max-w-xl">A dedicated planner for orchestrating 24-hour ephemeral content (Instagram, Facebook & LinkedIn Stories) to drive daily intent and DM conversations.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleGenerateWeek}
            disabled={isGenerating}
            className="px-4 py-2 bg-blue-600 text-white text-[12px] font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5 disabled:opacity-50">
            <span className={`material-symbols-outlined text-[16px] ${isGenerating ? 'animate-spin' : ''}`}>smart_toy</span>
            {isGenerating ? "Processing AI Plan..." : "AI Auto-Fill Stories"}
          </button>
          <button className="px-4 py-2 bg-slate-900 text-white text-[12px] font-bold rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            Add Story Slot
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {DAYS.map((day) => (
          <div key={day} className="bg-slate-50 border border-slate-200 rounded-xl flex flex-col h-[700px] overflow-hidden">
            <div className="bg-white border-b border-slate-200 p-3 flex items-center justify-between shadow-sm z-10">
              <h3 className="text-[13px] font-extrabold text-slate-900">{day}</h3>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{planner[day].length} slides</span>
            </div>
            
            <div className="p-3 flex-1 overflow-y-auto space-y-3">
              {planner[day].length === 0 ? (
                <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 gap-2">
                  <span className="material-symbols-outlined text-[24px] opacity-50">history_toggle_off</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">No Stories Planned</span>
                </div>
              ) : (
                planner[day].map((story) => (
                  <div key={story.id} className="bg-white border border-slate-200 shadow-sm rounded-xl p-3 cursor-pointer hover:border-slate-400 hover:shadow-md transition-all relative group">
                    <span className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 material-symbols-outlined text-[14px] text-slate-300 hover:text-slate-900 transition-colors">edit</span>
                    
                    <div className="flex items-center gap-2 mb-2.5">
                      <div className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[9px] font-black tracking-widest flex items-center gap-1">
                        <span className="material-symbols-outlined text-[10px]">schedule</span>
                        {story.time}
                      </div>
                      <span className={`text-[9px] font-bold uppercase ml-auto ${story.status==='PUBLISHED'?'text-slate-400':story.status==='SCHEDULED'?'text-blue-600':story.status==='READY'?'text-emerald-600':story.status==='GENERATING'?'text-amber-500':'text-slate-500'}`}>{story.status}</span>
                    </div>

                    <div className="mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 mb-1 block">{story.type}</span>
                      <h4 className="text-[12px] font-semibold text-slate-800 leading-snug">{story.content}</h4>
                    </div>

                    <div className="flex items-center gap-2 border-t border-slate-100 pt-2 mt-2">
                      <button className="text-[10px] font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">image</span> Add Media</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-2 border-t border-slate-200 bg-white">
              <button className="w-full py-2 text-[11px] font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 rounded-lg flex items-center justify-center gap-1 transition-colors">
                <span className="material-symbols-outlined text-[14px]">add</span> Add Story Slot
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
