"use client";

import React from "react";
import { useOutreachOS } from "@/contexts/OutreachOSContext";
import Link from "next/link";

export default function OutreachCommandCenterPage() {
  const { prospects, nextActions } = useOutreachOS();

  // Metrics calculation
  const totalProspects = prospects.length;
  const contacted = prospects.filter(p => p.status !== "NOT_CONTACTED").length;
  const replies = prospects.filter(p => ["REPLIED", "INTERESTED", "MEETING_BOOKED", "QUALIFIED", "OPPORTUNITY", "WON"].includes(p.status)).length;
  const interested = prospects.filter(p => ["INTERESTED", "MEETING_BOOKED", "QUALIFIED", "OPPORTUNITY", "WON"].includes(p.status)).length;

  // Next Actions Logic
  const overdueActions = nextActions.filter(na => na.status === "PENDING" && new Date(na.dueDate).setHours(0,0,0,0) < new Date().setHours(0,0,0,0));
  const dueTodayActions = nextActions.filter(na => na.status === "PENDING" && new Date(na.dueDate).toDateString() === new Date().toDateString());
  const newProspects = prospects.filter(p => p.status === "NOT_CONTACTED");
  const newReplies = prospects.filter(p => p.status === "REPLIED");

  const priorityQueue = [...overdueActions, ...dueTodayActions].sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <div className="pt-8 space-y-8 animate-in fade-in duration-300 px-8 max-w-[1400px] mx-auto pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight">OUTREACH COMMAND CENTER</h1>
          <p className="text-[14px] text-slate-500 font-medium mt-1">What needs your attention right now.</p>
        </div>
        <div className="flex items-center gap-3">
           <Link href="/conversion/outreach/prospects" className="px-5 py-2.5 bg-slate-900 text-white rounded-lg text-[13px] font-bold hover:bg-slate-800 transition-colors shadow-sm">
              + New Prospect
           </Link>
        </div>
      </div>

      {/* Top Performance Overview */}
      <div className="grid grid-cols-4 gap-4">
         <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-colors cursor-pointer group">
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover:text-slate-700 transition-colors">Total Prospects</h3>
            <div className="text-[32px] font-black text-slate-900 leading-none">{totalProspects}</div>
         </div>
         <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-colors cursor-pointer group">
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover:text-slate-700 transition-colors">Contacted</h3>
            <div className="text-[32px] font-black text-slate-900 leading-none">{contacted}</div>
         </div>
         <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-colors cursor-pointer group">
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover:text-slate-700 transition-colors">Replies</h3>
            <div className="text-[32px] font-black text-slate-900 leading-none">{replies}</div>
         </div>
         <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-colors cursor-pointer group">
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover:text-slate-700 transition-colors">Interested</h3>
            <div className="text-[32px] font-black text-slate-900 leading-none">{interested}</div>
         </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
         {/* Today's Work */}
         <div className="col-span-1 space-y-4">
            <h2 className="text-[14px] font-black text-slate-900 uppercase tracking-widest">TODAY'S OUTREACH</h2>
            
            <div className="space-y-3">
               <Link href="/conversion/outreach/follow-ups" className="block bg-red-50 border border-red-100 rounded-xl p-4 hover:bg-red-100/50 transition-colors">
                  <div className="flex items-center justify-between">
                     <span className="text-[14px] font-bold text-red-900 flex items-center gap-2">
                        🔥 OVERDUE FOLLOW-UPS
                     </span>
                     <span className="text-[18px] font-black text-red-700">{overdueActions.length}</span>
                  </div>
                  <div className="text-[12px] font-medium text-red-800/70 mt-1">Resolve now →</div>
               </Link>

               <Link href="/conversion/outreach/follow-ups" className="block bg-amber-50 border border-amber-100 rounded-xl p-4 hover:bg-amber-100/50 transition-colors">
                  <div className="flex items-center justify-between">
                     <span className="text-[14px] font-bold text-amber-900 flex items-center gap-2">
                        📅 DUE TODAY
                     </span>
                     <span className="text-[18px] font-black text-amber-700">{dueTodayActions.length}</span>
                  </div>
                  <div className="text-[12px] font-medium text-amber-800/70 mt-1">View follow-ups →</div>
               </Link>

               <Link href="/conversion/outreach/prospects" className="block bg-blue-50 border border-blue-100 rounded-xl p-4 hover:bg-blue-100/50 transition-colors">
                  <div className="flex items-center justify-between">
                     <span className="text-[14px] font-bold text-blue-900 flex items-center gap-2">
                        🆕 READY TO CONTACT
                     </span>
                     <span className="text-[18px] font-black text-blue-700">{newProspects.length}</span>
                  </div>
                  <div className="text-[12px] font-medium text-blue-800/70 mt-1">Start outreach →</div>
               </Link>

               <Link href="/conversion/outreach/prospects" className="block bg-emerald-50 border border-emerald-100 rounded-xl p-4 hover:bg-emerald-100/50 transition-colors">
                  <div className="flex items-center justify-between">
                     <span className="text-[14px] font-bold text-emerald-900 flex items-center gap-2">
                        💬 NEW REPLIES
                     </span>
                     <span className="text-[18px] font-black text-emerald-700">{newReplies.length}</span>
                  </div>
                  <div className="text-[12px] font-medium text-emerald-800/70 mt-1">Review replies →</div>
               </Link>
            </div>
         </div>

         {/* NEXT BEST ACTIONS queue */}
         <div className="col-span-2 space-y-4">
            <h2 className="text-[14px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
               NEXT BEST ACTIONS 
               <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-bold tracking-widest">PRIORITY QUEUE</span>
            </h2>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
               {priorityQueue.map((na, index) => {
                  const prospect = prospects.find(p => p.id === na.prospectId);
                  const isOverdue = new Date(na.dueDate).setHours(0,0,0,0) < new Date().setHours(0,0,0,0);
                  
                  return (
                     <div key={na.id} className="border-b border-slate-100 last:border-0 p-5 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                        <div className="w-8 h-8 shrink-0 bg-slate-100 rounded-full flex items-center justify-center text-[12px] font-black text-slate-500">
                           {index + 1}
                        </div>
                        <div className="flex-1">
                           <div className="flex items-center justify-between mb-1">
                              <h3 className="text-[15px] font-black text-slate-900">{prospect?.firstName} {prospect?.lastName}</h3>
                              {isOverdue && (
                                 <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded font-extrabold text-[9px] uppercase tracking-wider">Overdue</span>
                              )}
                           </div>
                           <p className="text-[13px] font-bold text-slate-700">{na.title}</p>
                           <p className="text-[12px] font-medium text-slate-500 mt-1">{na.description}</p>
                        </div>
                        <div className="pl-4 border-l border-slate-100 flex flex-col gap-2">
                           <button className="px-4 py-2 bg-slate-900 text-white rounded text-[11px] font-bold hover:bg-slate-800 transition-colors text-center w-[120px]">
                              Mark Done
                           </button>
                           <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded text-[11px] font-bold hover:bg-slate-200 transition-colors text-center w-[120px]">
                              Skip
                           </button>
                        </div>
                     </div>
                  );
               })}
               {priorityQueue.length === 0 && (
                  <div className="p-12 text-center text-slate-500 font-medium text-[14px]">
                     You're all caught up. No pending actions today.
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
