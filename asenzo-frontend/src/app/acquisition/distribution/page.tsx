"use client";

import React, { useState } from "react";
import Link from "next/link";

const CHANNELS = [
  { id: "yt", name: "YouTube", handle: "@asenzo_hq", status: "ACTIVE", format: "Longform VSLs & Short Clips", followers: "14.2K", avgViews: "8.5K", cadence: "2/week" },
  { id: "li", name: "LinkedIn", handle: "Asenzo Growth OS", status: "ACTIVE", format: "Text Carousels & Proof Breakdown", followers: "28.9K", avgViews: "12.4K", cadence: "5/week" },
  { id: "ig", name: "Instagram", handle: "@asenzo.os", status: "ACTIVE", format: "Reels & Story Poll Sequences", followers: "42.1K", avgViews: "18.2K", cadence: "7/week" },
  { id: "x", name: "X (Twitter)", handle: "@asenzo_app", status: "ACTIVE", format: "Short Threads & Contrarian Takes", followers: "19.5K", avgViews: "6.1K", cadence: "5/week" },
];

const REPURPOSING_QUEUE = [
  { id: "rep1", title: "Why consistency without clarity is noise", primaryChannel: "YouTube", status: "READY_FOR_REPURPOSE", targets: ["LinkedIn Carousel", "X Thread", "Instagram Reel"] },
  { id: "rep2", title: "Predictable Inbound Acquisition System Breakdown", primaryChannel: "LinkedIn", status: "IN_PROGRESS", targets: ["YouTube Short", "Newsletter Issue"] },
  { id: "rep3", title: "Agency vs Inbound OS Case Study", primaryChannel: "Instagram", status: "COMPLETED", targets: ["X Thread", "LinkedIn Post"] },
];

export default function DistributionPage() {
  const [selectedChannel, setSelectedChannel] = useState(CHANNELS[0]);

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Pillar 2 — Distribution</p>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Organic Social & Founder Brand</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Manage platform distribution strategy, channel cadence, and content repurposing execution.</p>
        </div>
        <Link href="/acquisition/channels" className="px-4 py-2 border border-slate-200 text-slate-700 text-[12px] font-bold rounded-lg hover:bg-slate-50 transition-colors">
          View Channel Performance →
        </Link>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left: Connected Channels */}
        <div className="col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-[14px] font-bold text-slate-900">Active Distribution Channels</h2>
            <div className="space-y-3">
              {CHANNELS.map((ch) => (
                <div
                  key={ch.id}
                  onClick={() => setSelectedChannel(ch)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedChannel.id === ch.id
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-slate-50/50 text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-[13px]">{ch.name}</div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${selectedChannel.id === ch.id ? "bg-emerald-500/20 text-emerald-300" : "bg-emerald-100 text-emerald-700"}`}>
                      {ch.status}
                    </span>
                  </div>
                  <p className={`text-[11px] mb-2 ${selectedChannel.id === ch.id ? "text-slate-300" : "text-slate-500"}`}>{ch.handle} • {ch.format}</p>
                  <div className="flex justify-between text-[10px] font-semibold pt-2 border-t border-slate-200/20">
                    <span>Audience: {ch.followers}</span>
                    <span>Avg Reach: {ch.avgViews}</span>
                    <span>Cadence: {ch.cadence}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Repurposing Engine & Checklist */}
        <div className="col-span-7 space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[14px] font-bold text-slate-900">Content Repurposing Engine</h2>
              <span className="text-[11px] font-semibold text-slate-400">3 Items Active</span>
            </div>
            <div className="space-y-3">
              {REPURPOSING_QUEUE.map((item) => (
                <div key={item.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-[13px] font-bold text-slate-900">{item.title}</h3>
                      <span className="text-[11px] text-slate-500">Source: {item.primaryChannel}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md">
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Targets:</span>
                    {item.targets.map((t) => (
                      <span key={t} className="text-[10px] font-medium px-2 py-0.5 bg-white border border-slate-200 rounded-full text-slate-600">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <h2 className="text-[14px] font-bold text-slate-900">Distribution Execution Checklist</h2>
            <div className="space-y-2 text-[12px] text-slate-700">
              {[
                "Attach direct keyword CTA (e.g. 'Comment OS') to long-form YouTube descriptions",
                "Format LinkedIn posts with first-comment proof link to prevent reach throttling",
                "Post Instagram Reels with 3-slide Story sequence directing to Lead Magnet VSL",
                "Cross-post X high-performing thread to LinkedIn article format"
              ].map((step, idx) => (
                <label key={idx} className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
                  <input type="checkbox" defaultChecked={idx < 2} className="rounded text-slate-900" />
                  <span>{step}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
