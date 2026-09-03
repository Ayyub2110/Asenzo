"use client";

import React, { useState } from "react";

const STORY_SEQUENCES = [
  {
    id: "st1",
    title: "Behind the Scenes — Inbound OS Architecture",
    objective: "Lead Magnet Opt-In",
    awarenessStage: "Problem-Aware",
    slides: [
      { num: 1, type: "Context Hook", text: "Inside the exact system we use to run Acquisition without daily content grind..." },
      { num: 2, type: "Poll", text: "Are you relying on outbound cold DMs or predictable inbound?" },
      { num: 3, type: "Objection Reframing", text: "Most founders think they lack content volume. The truth is they lack positioning clarity." },
      { num: 4, type: "CTA", text: "Reply 'OS' to get the full 7-Pillar Architecture Diagram sent straight to your DMs." }
    ]
  },
  {
    id: "st2",
    title: "Client Case Study & Proof Teaser",
    objective: "VSL Landing Page Click",
    awarenessStage: "Solution-Aware",
    slides: [
      { num: 1, type: "Proof Teaser", text: "How Lara scaled inbound pipeline from £8k to £34k MRR in 60 days." },
      { num: 2, type: "Question Sticker", text: "What's your single biggest growth bottleneck right now?" },
      { num: 3, type: "CTA", text: "Tap the link below to watch the 8-minute case study breakdown." }
    ]
  }
];

export default function StoriesPage() {
  const [selectedSequence, setSelectedSequence] = useState(STORY_SEQUENCES[0]);

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Content System — Rapid Response</p>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Stories & Ephemeral Sequences</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Build high-converting Instagram & LinkedIn story sequences with integrated poll stickers and DM triggers.</p>
        </div>
        <button className="px-4 py-2 bg-slate-900 text-white text-[12px] font-bold rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">add</span>
          New Story Sequence
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-4 space-y-3">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <h2 className="text-[13px] font-bold text-slate-900 mb-3">Story Sequences</h2>
            <div className="space-y-2">
              {STORY_SEQUENCES.map((seq) => (
                <div
                  key={seq.id}
                  onClick={() => setSelectedSequence(seq)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedSequence.id === seq.id
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="font-bold text-[13px] mb-1">{seq.title}</div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className={selectedSequence.id === seq.id ? "text-slate-300" : "text-slate-500"}>Obj: {seq.objective}</span>
                    <span className={`px-2 py-0.5 rounded font-bold ${selectedSequence.id === seq.id ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-700"}`}>
                      {seq.awarenessStage}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-8 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sequence Story Arc</span>
                <h3 className="text-[15px] font-bold text-slate-900">{selectedSequence.title}</h3>
              </div>
              <button className="px-3 py-1.5 bg-blue-600 text-white text-[11px] font-bold rounded-lg hover:bg-blue-700">
                Send to Content Engine
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {selectedSequence.slides.map((slide) => (
                <div key={slide.num} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 flex flex-col justify-between h-44">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 bg-slate-200 text-slate-800 rounded">
                        Slide {slide.num}
                      </span>
                      <span className="text-[10px] font-bold text-blue-600 uppercase">{slide.type}</span>
                    </div>
                    <p className="text-[12px] text-slate-800 font-medium leading-relaxed">{slide.text}</p>
                  </div>
                  <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-200/60 font-semibold">
                    Sticker: {slide.type === "Poll" ? "Poll Sticker [Inbound vs Outbound]" : slide.type === "CTA" ? "DM Keyword Trigger ['OS']" : "Text Overlay"}
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
