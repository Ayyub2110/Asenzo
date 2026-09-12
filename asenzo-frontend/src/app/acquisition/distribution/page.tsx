"use client";

import React, { useState } from "react";
import Link from "next/link";

const CHANNELS = [
  { id: "yt", name: "YouTube", icon: "▶", handle: "@asenzo_hq", status: "Active", format: "Longform + Shorts", followers: "14.2K", avgViews: "8.5K", cadence: "2/week", scheduled: 2, live: 1 },
  { id: "li", name: "LinkedIn", icon: "in", handle: "Asenzo Growth OS", status: "Active", format: "Carousels", followers: "28.9K", avgViews: "12.4K", cadence: "5/week", scheduled: 3, live: 2 },
  { id: "ig", name: "Instagram", icon: "◎", handle: "@asenzo.os", status: "Active", format: "Reels + Stories", followers: "42.1K", avgViews: "18.2K", cadence: "7/week", scheduled: 5, live: 5 },
  { id: "x", name: "X", icon: "𝕏", handle: "@asenzo_app", status: "Active", format: "Threads", followers: "19.5K", avgViews: "6.1K", cadence: "5/week", scheduled: 2, live: 0 },
];

const UP_NEXT = [
  { id: 1, day: "Today", time: "10:00", channelId: "yt", title: "How to Build an OS", status: "Scheduled" },
  { id: 2, day: "Today", time: "14:00", channelId: "li", title: "Client Acquisition Breakdown", status: "Scheduled" },
  { id: 3, day: "Tomorrow", time: "18:00", channelId: "ig", title: "Founder Mistakes", status: "Ready" },
];

const PERFORMANCE = [
  { id: "yt", reach: "24.8K", eng: "6.2%", leads: 8 },
  { id: "li", reach: "41.2K", eng: "5.8%", leads: 7 },
  { id: "ig", reach: "52.1K", eng: "7.1%", leads: 12 },
  { id: "x", reach: "18.4K", eng: "3.9%", leads: 3 },
];

const ATTENTION = [
  "3 posts ready but not scheduled",
  "Instagram Friday has no scheduled content"
];

export default function DistributionPage() {
  
  const getChannel = (id: string) => CHANNELS.find(c => c.id === id);

  return (
    <div className="px-8 py-6 pb-24 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Distribution</h1>
          <p className="text-[12px] text-slate-500 mt-1">Manage where your content goes, what's next, and which channels produce results.</p>
        </div>
        <div className="flex gap-2">
          <select className="px-3 py-1.5 border border-slate-200 rounded-lg text-[12px] font-bold text-slate-700 bg-white focus:outline-none cursor-pointer hover:bg-slate-50 shadow-sm min-w-[120px]">
             <option>This Week</option><option>Today</option><option>This Month</option><option>All Time</option>
          </select>
          <select className="px-3 py-1.5 border border-slate-200 rounded-lg text-[12px] font-bold text-slate-700 bg-white focus:outline-none cursor-pointer hover:bg-slate-50 shadow-sm min-w-[140px]">
             <option>All Channels</option><option>YouTube</option><option>LinkedIn</option><option>Instagram</option><option>X</option>
          </select>
        </div>
      </div>

      {/* Overview */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
         <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Overview</h2>
         <div className="grid grid-cols-5 gap-8">
            <div className="border-r border-slate-100 pr-8">
               <p className="text-[11px] font-bold text-slate-500 mb-1">Scheduled</p>
               <p className="text-[28px] font-black text-slate-900 leading-none">12</p>
            </div>
            <div className="border-r border-slate-100 pr-8">
               <p className="text-[11px] font-bold text-slate-500 mb-1">Published</p>
               <p className="text-[28px] font-black text-slate-900 leading-none">8</p>
            </div>
            <div className="border-r border-slate-100 pr-8">
               <p className="text-[11px] font-bold text-amber-600 mb-1">Needs Action</p>
               <p className="text-[28px] font-black text-amber-600 leading-none">3</p>
            </div>
            <div className="border-r border-slate-100 pr-8">
               <p className="text-[11px] font-bold text-slate-500 mb-1">Active Channels</p>
               <p className="text-[28px] font-black text-slate-900 leading-none">4</p>
            </div>
            <div>
               <p className="text-[11px] font-bold text-emerald-600 mb-1">Leads Generated</p>
               <p className="text-[28px] font-black text-emerald-600 leading-none">19</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
         {/* Left Column */}
         <div className="col-span-8 space-y-8">

            {/* Channels Directory */}
            <div>
               <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Channels</h2>
               <div className="grid grid-cols-2 gap-4">
                  {CHANNELS.map(ch => (
                     <div key={ch.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-colors flex flex-col group cursor-pointer">
                        <div className="flex items-start justify-between mb-2">
                           <div className="flex items-center gap-2">
                              <span className="text-[16px] font-bold text-slate-700">{ch.icon}</span>
                              <h3 className="text-[14px] font-bold text-slate-900">{ch.name}</h3>
                           </div>
                           <span className="text-[9px] font-black px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase tracking-widest">{ch.status}</span>
                        </div>
                        <div className="text-[11px] font-medium text-slate-500 mb-3">{ch.handle}</div>
                        <div className="text-[11px] font-semibold text-slate-700 mb-1">{ch.cadence}</div>
                        <div className="text-[11px] font-medium text-slate-500 mb-4">{ch.avgViews} avg reach</div>

                        <div className="text-[10px] font-bold text-slate-600 bg-slate-50 p-2 rounded mt-auto border border-slate-100">
                           <span className="text-slate-800">{ch.scheduled} scheduled</span> • <span className="text-slate-500">{ch.live} live</span> this week
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Content Calendar / Up Next */}
            <div>
               <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center justify-between">
                  <span>Up Next</span>
                  <Link href="/acquisition/content" className="text-blue-600 hover:underline cursor-pointer normal-case tracking-normal">Open Calendar</Link>
               </h2>
               <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="divide-y divide-slate-100">
                     {UP_NEXT.map((item, idx) => {
                        const channel = getChannel(item.channelId);
                        const isToday = item.day === 'Today';
                        return (
                           <div key={idx} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors group">
                              <div className="w-20 shrink-0 border-r border-slate-100">
                                 <div className={`text-[11px] font-bold uppercase tracking-widest mb-0.5 ${isToday ? 'text-blue-600' : 'text-slate-400'}`}>{item.day}</div>
                                 <div className="text-[13px] font-black text-slate-900">{item.time}</div>
                              </div>
                              <div className="flex-1 flex items-center gap-3">
                                 <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-[14px] font-bold text-slate-700 shrink-0">
                                    {channel?.icon}
                                 </div>
                                 <div>
                                    <div className="flex items-center gap-2 mb-0.5">
                                       <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{channel?.name}</span>
                                       <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest ${item.status === 'Scheduled' ? 'bg-slate-900 text-white' : 'bg-amber-100 text-amber-700'}`}>{item.status}</span>
                                    </div>
                                    <h4 className="text-[13px] font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors cursor-pointer">{item.title}</h4>
                                 </div>
                              </div>
                              <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-widest rounded transition-colors shrink-0">Edit</button>
                           </div>
                        )
                     })}
                  </div>
               </div>
            </div>



         </div>

         {/* Right Column */}
         <div className="col-span-4 space-y-8">
            
            {/* Channel Performance */}
            <div>
               <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Channel Performance</h2>
               <div className="bg-white border border-slate-200 rounded-xl shadow-sm text-[11px]">
                  <div className="grid grid-cols-12 gap-2 p-3 border-b border-slate-100 bg-slate-50/50 font-bold text-slate-400 uppercase tracking-widest">
                     <div className="col-span-4">Channel</div>
                     <div className="col-span-3 text-right">Reach</div>
                     <div className="col-span-3 text-right">Eng.</div>
                     <div className="col-span-2 text-right">Leads</div>
                  </div>
                  <div className="divide-y divide-slate-100">
                     {PERFORMANCE.map(p => {
                        const ch = getChannel(p.id);
                        return (
                           <div key={p.id} className="grid grid-cols-12 gap-2 p-3 items-center hover:bg-slate-50 cursor-pointer transition-colors">
                              <div className="col-span-4 font-bold text-[12px] text-slate-900 flex items-center gap-1.5">{ch?.icon} {ch?.name}</div>
                              <div className="col-span-3 text-right font-medium text-slate-700">{p.reach}</div>
                              <div className="col-span-3 text-right font-medium text-slate-700">{p.eng}</div>
                              <div className="col-span-2 text-right font-black text-emerald-600">{p.leads}</div>
                           </div>
                        )
                     })}
                  </div>
               </div>
               <Link href="/acquisition/analytics" className="mt-3 block w-full text-center text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline">View Detailed Analytics</Link>
            </div>

            {/* Needs Attention */}
            <div>
               <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Needs Attention</h2>
               <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm space-y-3">
                  {ATTENTION.map((msg, i) => (
                     <div key={i} className="flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5"></div>
                        <div className="flex-1 text-[12px] font-bold text-amber-900 leading-tight">
                           {msg}
                           <div className="mt-1"><Link href="#" className="text-[10px] text-amber-700 hover:underline uppercase tracking-widest font-black">Resolve →</Link></div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Quick Actions */}
            <div>
               <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Quick Actions</h2>
               <div className="grid grid-cols-1 gap-2">
                  <button className="p-3 bg-white border border-slate-200 rounded-lg text-center hover:border-slate-400 hover:shadow-md transition-all font-bold text-[11px] text-slate-700 uppercase tracking-widest">
                    Schedule Content
                  </button>
                  <button className="p-3 bg-white border border-slate-200 rounded-lg text-center hover:border-slate-400 hover:shadow-md transition-all font-bold text-[11px] text-slate-700 uppercase tracking-widest">
                    Add Channel
                  </button>

                  <Link href="/acquisition/content" className="p-3 bg-white border border-slate-200 rounded-lg text-center hover:border-slate-400 hover:shadow-md transition-all font-bold text-[11px] text-slate-700 uppercase tracking-widest block">
                    View Calendar
                  </Link>
               </div>
            </div>

         </div>

      </div>
    </div>
  );
}
