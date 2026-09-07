"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useConversionOS } from "@/contexts/ConversionOSContext";
import { SalesCall, Lead, Opportunity } from "@/lib/types/conversion";
import { ACTION_MAP } from "@/lib/routing";

export default function CalendarCallWorkspace() {
  const { calls, opportunities, leads } = useConversionOS();
  const [activeCallId, setActiveCallId] = useState<string | null>(null);

  const activeCall = calls.find(c => c.id === activeCallId) || null;
  const targetOpp = activeCall ? opportunities.find(o => o.id === activeCall.opportunityId) : null;
  const targetLead = targetOpp ? leads.find(l => l.id === targetOpp.leadId) : null;

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto space-y-6 flex flex-col h-[calc(100vh-100px)]">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Sales Calendar</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Manage booked appointments and pre-call context.</p>
        </div>
      </div>

      <div className="flex gap-6 flex-1 overflow-hidden">
        {/* LEFT: CALENDAR SCHEDULE */}
        <div className="flex-1 max-w-[500px] overflow-y-auto space-y-8 pr-4">
           {/* Example Schedule Block */}
           <div>
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">MONDAY, 18TH</h2>
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[50px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                 {calls.map((call, idx) => {
                    const opp = opportunities.find(o => o.id === call.opportunityId);
                    const lead = leads.find(l => l.id === opp?.leadId);
                    const isSelected = activeCallId === call.id;
                    const timeString = new Date(call.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' }) || "10:00 AM";

                    return (
                       <div key={call.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 border-white bg-slate-100 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
                             <span className="text-[9px] font-bold text-slate-500">{timeString.split(" ")[0]}</span>
                          </div>
                          
                          <div 
                             onClick={() => setActiveCallId(call.id)}
                             className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl shadow-sm border cursor-pointer hover:border-slate-300 transition-all ${isSelected ? 'bg-blue-50 border-blue-200 shadow-blue-100' : 'bg-white border-slate-200'}`}
                           >
                             <div className="flex justify-between items-start mb-2">
                                <div>
                                   <p className="text-[14px] font-bold text-slate-900">{lead?.name || "Unknown Lead"}</p>
                                   <p className="text-[11px] text-slate-500">{lead?.company || "Independent"} • {lead?.qualificationStatus}</p>
                                </div>
                             </div>
                             
                             {/* TASK 10: Call Status Tags directly on the schedule blocks */}
                             <div className="flex gap-2 mb-3">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${
                                   call.status === "SHOWED" ? "bg-emerald-100 text-emerald-700" :
                                   call.status === "NO_SHOW" ? "bg-red-100 text-red-700" :
                                   call.status === "SCHEDULED" ? "bg-indigo-100 text-indigo-700" :
                                   "bg-slate-100 text-slate-600"
                                }`}>
                                   {call.status}
                                </span>
                                {opp?.pipelineStage === "OFFER_SENT" && (
                                   <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-amber-100 text-amber-700">OFFER SENT</span>
                                )}
                             </div>

                             <button className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${isSelected ? 'text-blue-700' : 'text-slate-400 group-hover:text-blue-600'}`}>
                                View Context
                             </button>
                          </div>
                       </div>
                    )
                 })}
              </div>
           </div>
        </div>

        {/* RIGHT: PERSON PRE-CALL CONTEXT (TASK 11) */}
        <div className="flex-1 bg-white border border-slate-200 rounded-[16px] shadow-sm flex flex-col overflow-hidden relative">
           {activeCall && targetLead && targetOpp ? (
              <>
                 <div className="p-6 border-b border-slate-100 bg-slate-50">
                    <div className="flex items-center justify-between mb-4">
                       <div>
                          <h2 className="text-[20px] font-bold text-slate-900 leading-tight">{targetLead.name}</h2>
                          <p className="text-[13px] font-medium text-slate-500 mt-1">{targetLead.company || "Independent"} {targetLead.role ? `• ${targetLead.role}` : ""}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Deal Value</p>
                          <p className="text-[16px] font-bold text-emerald-600">£{(targetOpp.estimatedValue/1000).toFixed(1)}k</p>
                       </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                       <div className="flex gap-2">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${targetLead.temperature === "HOT" ? "bg-red-100 text-red-700" : targetLead.temperature === "WARM" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>
                             {targetLead.temperature} LEAD
                          </span>
                          <span className="px-2 py-1 flex items-center gap-1 rounded text-[10px] font-bold uppercase bg-slate-200 text-slate-700">
                             <span className="material-symbols-outlined text-[12px]">{targetLead.qualificationStatus === 'QUALIFIED' ? 'check_circle' : 'pending'}</span>
                             {targetLead.qualificationStatus}
                          </span>
                       </div>
                       <div className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">calendar_clock</span>
                          {(new Date(activeCall.scheduledDate)).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'})}
                       </div>
                    </div>
                 </div>

                 <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Source & Journey */}
                    <div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Origin & Journey</p>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                             <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Lead Source</p>
                             <p className="text-[12px] font-bold text-slate-800">{targetLead.originalSource}</p>
                             <p className="text-[11px] text-slate-500 truncate">{targetLead.originalContent}</p>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                             <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Previous Interaction</p>
                             <p className="text-[12px] font-bold text-slate-800">{activeCall.previousAttempts || "Direct Booking"}</p>
                             <Link href={ACTION_MAP.openConversionInbox()} className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-1 block">View Conversations</Link>
                          </div>
                       </div>
                    </div>

                    {/* Pre-Call Intelligence */}
                    <div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Pre-Call Context & Intelligence</p>
                       <div className="space-y-3">
                          <div className="p-4 border border-slate-200 rounded-lg shadow-sm">
                             <p className="text-[11px] font-bold text-slate-900 mb-1">Identified Pain Point / Problem</p>
                             <p className="text-[13px] text-slate-600 leading-relaxed">{targetOpp.problem || targetLead.problem || "Not fully discovered. Priority 1 for discovery call."}</p>
                          </div>
                          <div className="p-4 border border-slate-200 rounded-lg shadow-sm bg-blue-50/50">
                             <p className="text-[11px] font-bold text-slate-900 mb-1">Buying Trigger</p>
                             <p className="text-[13px] text-slate-600 leading-relaxed">{targetOpp.buyingTrigger || targetLead.buyingTrigger || "Needs investigation."}</p>
                          </div>
                          {targetLead.objections && targetLead.objections.length > 0 && (
                             <div className="p-4 border border-red-100 bg-red-50/50 rounded-lg shadow-sm">
                                <p className="text-[11px] font-bold text-red-900 mb-1 flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">warning</span> Known Objections</p>
                                <div className="flex gap-2 mt-2">
                                   {targetLead.objections.map(obj => (
                                      <span key={obj} className="px-2 py-1 bg-white border border-red-200 text-red-700 text-[10px] font-bold rounded uppercase tracking-widest">{obj}</span>
                                   ))}
                                </div>
                             </div>
                          )}
                       </div>
                    </div>

                    {/* Action Panel */}
                    <div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Call Outcomes</p>
                       <div className="grid grid-cols-2 gap-3">
                          <button className="px-4 py-3 bg-emerald-600 text-white rounded-lg text-[12px] font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-emerald-700 transition">
                             <span className="material-symbols-outlined text-[16px]">check_circle</span>
                             Qualified & Offer Sent
                          </button>
                          <button className="px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-lg text-[12px] font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-slate-50 transition">
                             <span className="material-symbols-outlined text-[16px]">schedule</span>
                             Needs Follow-up
                          </button>
                       </div>
                    </div>
                 </div>
              </>
           ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                 <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-[24px] text-slate-300">person_search</span>
                 </div>
                 <h3 className="text-[16px] font-bold text-slate-900 mb-2">Pre-Call Intelligence</h3>
                 <p className="text-[13px] text-slate-500 max-w-[300px]">Select a scheduled call from the calendar to view full lead context, history, and prep material.</p>
              </div>
           )}
        </div>
      </div>
    </div>
  );
}
