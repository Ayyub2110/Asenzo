"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useConversionOS } from "@/contexts/ConversionOSContext";
import { ACTION_MAP } from "@/lib/routing";
import { useRouter } from "next/navigation";

export default function CalendarCallWorkspace() {
  const { calls, opportunities, leads, conversations, updateCall, updateOpportunity, updateLead, createFollowUp, createOffer, logEvent } = useConversionOS();
  const router = useRouter();

  const [activeCallId, setActiveCallId] = useState<string | null>(null);
  const [callMode, setCallMode] = useState<"PREP" | "IN_PROGRESS">("PREP");
  
  // Call Notes State
  const [callNotes, setCallNotes] = useState("");
  const [discoveredPain, setDiscoveredPain] = useState("");
  const [buyingSignals, setBuyingSignals] = useState("");
  const [newObjections, setNewObjections] = useState("");

  const activeCall = calls.find(c => c.id === activeCallId) || null;
  const targetOpp = activeCall ? opportunities.find(o => o.id === activeCall.opportunityId) : null;
  const targetLead = targetOpp ? leads.find(l => l.id === targetOpp.leadId) : null;
  const targetConv = targetLead ? conversations.filter(c => c.leadId === targetLead.id).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0] : null;

  const handleStartCall = () => {
    if (!activeCall) return;
    updateCall(activeCall.id, { status: "SHOWED" });
    setCallMode("IN_PROGRESS");
  };

  const handleCallOutcome = (outcome: "QUALIFIED_OFFER" | "FOLLOW_UP" | "NURTURE" | "WON" | "LOST" | "NO_DECISION") => {
    if (!activeCall || !targetOpp || !targetLead) return;

    logEvent(targetLead.id, "CALL_LOG", `Call notes: ${callNotes}\nPain: ${discoveredPain}\nSignals: ${buyingSignals}\nObjections: ${newObjections}`);

    if (outcome === "QUALIFIED_OFFER") {
       // Ideally trigger an offer creation modal, simulating creation here
       createOffer({
          offerName: "Custom Proposal",
          notes: "Based on sales call.",
          status: "DRAFT",
          value: targetOpp.estimatedValue,
          opportunityId: targetOpp.id
       });
       logEvent(targetLead.id, "CALL_OUTCOME", "Call Qualified. Offer to be drafted.");
       router.push("/conversion/pipeline/offers");
    } else if (outcome === "FOLLOW_UP") {
       createFollowUp({
          leadId: targetLead.id,
          reason: "Decision maker needs another conversation (auto-generated from call)",
          dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
          status: "DUE"
       });
       logEvent(targetLead.id, "CALL_OUTCOME", "Needs Follow-up.");
       router.push("/conversion/conversations/follow-ups");
    } else if (outcome === "NURTURE") {
       updateOpportunity(targetOpp.id, { pipelineStage: "CLOSED_LOST", lostReason: "Not Ready" });
       updateLead(targetLead.id, { lifecycleStage: "NURTURE", temperature: "COLD" });
       logEvent(targetLead.id, "CALL_OUTCOME", "Not Ready. Moved to Nurture.");
       setCallMode("PREP");
    } else if (outcome === "WON") {
       updateOpportunity(targetOpp.id, { pipelineStage: "CLOSED_WON", closedAt: new Date().toISOString() });
       updateLead(targetLead.id, { lifecycleStage: "CONVERTED" });
       logEvent(targetLead.id, "CALL_OUTCOME", "Closed Won!");
       setCallMode("PREP");
    } else if (outcome === "LOST") {
       updateOpportunity(targetOpp.id, { pipelineStage: "CLOSED_LOST", lostReason: "Call Outcome: Lost" });
       logEvent(targetLead.id, "CALL_OUTCOME", "Closed Lost.");
       setCallMode("PREP");
    } else {
       logEvent(targetLead.id, "CALL_OUTCOME", "No Decision.");
       setCallMode("PREP");
    }
  };

  return (
    <div className="px-8 py-6 max-w-[1500px] mx-auto space-y-6 flex flex-col h-[calc(100vh-100px)]">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Sales Calls</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Prepare, conduct, and record sales outcomes.</p>
        </div>
      </div>

      <div className="flex gap-6 flex-1 overflow-hidden">
        {/* LEFT: CALENDAR / LIST */}
        <div className="w-[450px] shrink-0 overflow-y-auto space-y-6 pr-2">
            <div className="flex items-center gap-2 mb-4 bg-slate-100 p-1 rounded-lg">
               <button className="flex-1 bg-white shadow-sm text-slate-900 text-[11px] font-bold py-1.5 rounded">Today</button>
               <button className="flex-1 text-slate-500 hover:text-slate-900 text-[11px] font-bold py-1.5 rounded transition">This Week</button>
               <button className="flex-1 text-slate-500 hover:text-slate-900 text-[11px] font-bold py-1.5 rounded transition">All</button>
            </div>
            
            <div className="relative">
               <span className="material-symbols-outlined absolute left-3 top-2.5 text-[16px] text-slate-400">search</span>
               <input type="text" placeholder="Search calls..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-[12px] text-slate-900 focus:outline-none focus:border-blue-500 transition-colors" />
            </div>

           <div className="space-y-4">
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">SCHEDULE</h2>
               {calls.map(call => {
                  const opp = opportunities.find(o => o.id === call.opportunityId);
                  const lead = leads.find(l => l.id === opp?.leadId);
                  if (!lead || !opp) return null;

                  const isSelected = activeCallId === call.id;
                  const timeString = new Date(call.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' }) || "10:00 AM";
                  
                  return (
                     <div key={call.id} className="relative flex group">
                        <div className="w-16 shrink-0 pt-1">
                           <span className="text-[11px] font-bold text-slate-700">{timeString}</span>
                        </div>
                        <div 
                           onClick={() => { setActiveCallId(call.id); setCallMode("PREP"); }}
                           className={`flex-1 p-4 rounded-xl shadow-sm border cursor-pointer hover:border-slate-300 transition-all ${isSelected ? 'bg-slate-900 border-slate-900' : 'bg-white border-slate-200'}`}
                         >
                           <p className={`text-[14px] font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>{lead.name}</p>
                           <p className={`text-[11px] ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>{lead.company || "Independent"} • £{(opp.estimatedValue/1000).toFixed(1)}k Opp</p>
                           
                           <div className="flex gap-2 mt-3 mb-3">
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${isSelected ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'}`}>{lead.temperature} • {lead.qualificationStatus}</span>
                           </div>

                           <div className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest inline-block ${
                                 call.status === "SHOWED" ? "bg-emerald-100 text-emerald-700" :
                                 call.status === "NO_SHOW" ? "bg-red-100 text-red-700" :
                                 call.status === "CANCELLED" ? "bg-slate-200 text-slate-600" :
                                 call.status === "SCHEDULED" ? "bg-blue-100 text-blue-700" :
                                 "bg-slate-100 text-slate-600"
                              }`}>
                              CALL {call.status}
                           </div>

                           <div className="mt-3">
                              <button className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${isSelected ? 'text-blue-300' : 'text-slate-400 group-hover:text-blue-600'}`}>
                                 View Context
                              </button>
                           </div>
                        </div>
                     </div>
                  )
               })}
           </div>
        </div>

        {/* RIGHT: CONTEXT / WORKSPACE */}
        <div className="flex-1 bg-white border border-slate-200 rounded-[16px] shadow-sm flex flex-col overflow-hidden">
           {activeCall && targetLead && targetOpp ? (
              <>
                {/* HEADERS */}
                <div className="p-6 border-b border-slate-100 bg-slate-50 shrink-0">
                  <div className="flex justify-between items-start">
                     <div>
                        <h2 className="text-[24px] font-black text-slate-900 leading-tight">{targetLead.name}</h2>
                        <p className="text-[13px] font-medium text-slate-500 mt-1">{targetLead.role || "CEO"} &mdash; {targetLead.company || "Independent"}</p>
                        <div className="flex gap-2 mt-3">
                           <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-red-100 text-red-700">{targetLead.temperature}</span>
                           <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-blue-100 text-blue-700">{targetLead.qualificationStatus}</span>
                        </div>
                     </div>
                     <div className="text-right flex flex-col items-end gap-2">
                        <div className="flex items-center gap-4 text-right">
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Call</p>
                              <p className="text-[13px] font-bold text-slate-900">{(new Date(activeCall.scheduledDate)).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'})}</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Opportunity</p>
                              <p className="text-[13px] font-bold text-slate-900">£{(targetOpp.estimatedValue).toLocaleString()}</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stage</p>
                              <p className="text-[13px] font-bold text-slate-900">{targetOpp.pipelineStage.replace('_', ' ')}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                           <Link href={`/conversion/conversations`} className="text-[11px] font-bold text-slate-500 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded bg-white shadow-sm transition">Open Conversation</Link>
                        </div>
                     </div>
                  </div>
                </div>

                {callMode === "PREP" ? (
                   /* PRE-CALL CONTEXT (PREP MODE) */
                   <div className="flex-1 overflow-y-auto p-6">
                     <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-6">
                           {/* ORIGIN & JOURNEY */}
                           <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Origin & Journey</h3>
                              <div className="grid grid-cols-2 gap-2 mb-3">
                                 <div>
                                    <span className="text-[10px] text-slate-500 block">Lead Source</span>
                                    <span className="text-[12px] font-bold text-slate-900">{targetLead.originalSource}</span>
                                 </div>
                                 <div>
                                    <span className="text-[10px] text-slate-500 block">Campaign</span>
                                    <span className="text-[12px] font-bold text-slate-900">{targetLead.originalContent || "Direct"}</span>
                                 </div>
                              </div>
                              <div>
                                 <span className="text-[10px] text-slate-500 block mb-1">Journey</span>
                                 <p className="text-[11px] font-semibold text-slate-700 flex items-center gap-1 flex-wrap">
                                    New <span className="text-slate-300">→</span> Contacted <span className="text-slate-300">→</span> Engaged <span className="text-slate-300">→</span> Qualified <span className="text-slate-300">→</span> 
                                    <span className="bg-slate-200 px-1 py-0.5 rounded text-slate-900">Call Booked</span>
                                 </p>
                              </div>
                           </div>

                           {/* QUALIFICATION */}
                           <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Qualification Context</h3>
                              <div className="grid grid-cols-2 gap-3 mb-4">
                                 <div className="flex justify-between items-center bg-slate-50 p-2 rounded">
                                    <span className="text-[11px] font-medium text-slate-600">ICP Fit</span>
                                    <span className="text-[11px] font-bold text-emerald-600">Strong</span>
                                 </div>
                                 <div className="flex justify-between items-center bg-slate-50 p-2 rounded">
                                    <span className="text-[11px] font-medium text-slate-600">Problem Fit</span>
                                    <span className="text-[11px] font-bold text-emerald-600">Strong</span>
                                 </div>
                                 <div className="flex justify-between items-center bg-slate-50 p-2 rounded">
                                    <span className="text-[11px] font-medium text-slate-600">Urgency</span>
                                    <span className="text-[11px] font-bold text-amber-600">High</span>
                                 </div>
                                 <div className="flex justify-between items-center bg-slate-50 p-2 rounded">
                                    <span className="text-[11px] font-medium text-slate-600">Authority</span>
                                    <span className="text-[11px] font-bold text-slate-900">Decision Maker</span>
                                 </div>
                              </div>
                           </div>

                           {/* IDENTIFIED PROBLEM */}
                           <div>
                              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Identified Problem</h3>
                              <div className="p-3 bg-red-50 text-red-900 text-[13px] font-medium rounded-lg border border-red-100">
                                 {targetLead.problem || targetOpp.problem || "Inbound acquisition is inconsistent and heavily dependent on founder-led activity."}
                              </div>
                           </div>

                           {/* BUYING TRIGGERS */}
                           <div>
                              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Buying Triggers</h3>
                              <ul className="list-disc pl-4 space-y-1 text-[13px] text-slate-700">
                                 <li>{targetLead.buyingTrigger || targetOpp.buyingTrigger || "Revenue growth target"}</li>
                                 <li>Current acquisition bottleneck</li>
                                 <li>Founder wants predictable pipeline</li>
                              </ul>
                           </div>
                           
                           {/* known OBJECTIONS */}
                           <div>
                              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Known Objections</h3>
                              {targetLead.objections && targetLead.objections.length > 0 ? (
                                 <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                                    <p className="text-[12px] font-bold text-slate-900 mb-1">{targetLead.objections[0]}</p>
                                    <p className="text-[11px] text-slate-500 italic">"How difficult will this be for our team to implement?"</p>
                                 </div>
                              ) : (
                                 <p className="text-[12px] text-slate-500 italic">No known objections recorded yet.</p>
                              )}
                           </div>
                        </div>
                        
                        <div className="space-y-6">
                           {/* CALL PREPARATION */}
                           <div className="p-5 border-2 border-blue-100 bg-blue-50/50 rounded-xl">
                              <h3 className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-4">Call Preparation</h3>
                              
                              <div className="mb-4">
                                 <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Primary Goal</p>
                                 <p className="text-[12px] text-slate-900 font-medium">Understand the prospect's current acquisition system and determine whether we are a fit.</p>
                              </div>

                              <div className="mb-4">
                                 <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Key Questions</p>
                                 <ol className="list-decimal pl-4 space-y-1 text-[12px] text-slate-800">
                                    <li>What is currently generating most of your leads?</li>
                                    <li>Where is the biggest conversion bottleneck?</li>
                                    <li>What have you already tried?</li>
                                    <li>What happens if this problem is not solved?</li>
                                    <li>What would a successful outcome look like?</li>
                                 </ol>
                              </div>

                              <div>
                                 <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Recommended Focus</p>
                                 <div className="flex gap-2 flex-wrap">
                                    <span className="px-2 py-1 bg-white text-[10px] font-bold tracking-widest uppercase border border-slate-200 rounded text-slate-600">Acquisition Predictability</span>
                                    <span className="px-2 py-1 bg-white text-[10px] font-bold tracking-widest uppercase border border-slate-200 rounded text-slate-600">Conversion Bottleneck</span>
                                    <span className="px-2 py-1 bg-white text-[10px] font-bold tracking-widest uppercase border border-slate-200 rounded text-slate-600">Implementation Readiness</span>
                                 </div>
                              </div>
                           </div>

                           {/* CONVERSATION CONTEXT */}
                           <div className="border border-slate-200 p-4 rounded-xl shadow-sm">
                              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Conversation Context</h3>
                              {targetConv ? (
                                 <div className="bg-slate-50 p-3 rounded-lg text-[13px] border border-slate-100 italic text-slate-700">
                                    "{targetConv.latestMessage}"
                                    <span className="block mt-2 text-[10px] not-italic font-bold text-slate-400">{targetConv.channel} • Last msg {new Date(targetConv.timestamp).toLocaleDateString()}</span>
                                 </div>
                              ) : (
                                 <p className="text-[12px] text-slate-500">No conversational history logged.</p>
                              )}
                           </div>
                           
                           <button 
                             onClick={handleStartCall}
                             disabled={activeCall.status === "SHOWED" || activeCall.status === "CANCELLED" || activeCall.status === "NO_SHOW"}
                             className="w-full py-4 bg-emerald-600 text-white rounded-xl text-[14px] font-black uppercase tracking-widest hover:bg-emerald-700 transition shadow disabled:opacity-50 disabled:cursor-not-allowed">
                              [Start Call]
                           </button>
                        </div>
                     </div>
                   </div>
                ) : (
                   /* IN PROGRESS WORKSPACE (IN_PROGRESS MODE) */
                   <div className="flex-1 overflow-y-auto p-6 bg-slate-50 flex flex-col">
                     <h3 className="text-[12px] font-bold text-red-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                        Call In Progress
                     </h3>
                     
                     <div className="grid grid-cols-2 gap-6 flex-1 mb-6">
                        <div className="flex flex-col gap-4">
                           <div className="flex-1 flex flex-col">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Notes</label>
                              <textarea 
                                value={callNotes}
                                onChange={(e) => setCallNotes(e.target.value)}
                                placeholder="[Write notes...]"
                                className="flex-1 w-full p-3 bg-white border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-500 resize-none shadow-sm"></textarea>
                           </div>
                        </div>
                        <div className="flex flex-col gap-4">
                           <div className="flex-1 flex flex-col">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Discovered Pain</label>
                              <textarea 
                                value={discoveredPain}
                                onChange={(e) => setDiscoveredPain(e.target.value)}
                                placeholder="[Add...]"
                                className="flex-1 w-full p-3 bg-white border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-500 resize-none shadow-sm"></textarea>
                           </div>
                           <div className="flex-1 flex flex-col">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Buying Signals / Objections</label>
                              <textarea 
                                value={buyingSignals}
                                onChange={(e) => setBuyingSignals(e.target.value)}
                                placeholder="[Add signals and objections here...]"
                                className="flex-1 w-full p-3 bg-white border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-500 resize-none shadow-sm"></textarea>
                           </div>
                        </div>
                     </div>

                     <div className="border-t border-slate-200 pt-6">
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 text-center">Next Step Options</h3>
                        <div className="grid grid-cols-3 gap-3 max-w-[800px] mx-auto">
                           <button onClick={() => handleCallOutcome("QUALIFIED_OFFER")} className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-emerald-500 hover:bg-emerald-50 transition group">
                              <div className="text-[12px] font-bold text-slate-900 group-hover:text-emerald-700">Qualified + Offer</div>
                           </button>
                           <button onClick={() => handleCallOutcome("FOLLOW_UP")} className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-blue-500 hover:bg-blue-50 transition group">
                              <div className="text-[12px] font-bold text-slate-900 group-hover:text-blue-700">Needs Follow-up</div>
                           </button>
                           <button onClick={() => handleCallOutcome("WON")} className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-emerald-500 hover:bg-emerald-50 transition group">
                              <div className="text-[12px] font-bold text-slate-900 group-hover:text-emerald-700">Closed Won</div>
                           </button>
                           <button onClick={() => handleCallOutcome("LOST")} className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-red-500 hover:bg-red-50 transition group">
                              <div className="text-[12px] font-bold text-slate-900 group-hover:text-red-700">Closed Lost</div>
                           </button>
                           <button onClick={() => handleCallOutcome("NURTURE")} className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-slate-500 hover:bg-slate-100 transition group">
                              <div className="text-[12px] font-bold text-slate-900">Not Ready → Nurture</div>
                           </button>
                           <button onClick={() => handleCallOutcome("NO_DECISION")} className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-slate-500 hover:bg-slate-100 transition group">
                              <div className="text-[12px] font-bold text-slate-900">No Decision</div>
                           </button>
                        </div>
                     </div>
                   </div>
                )}
              </>
           ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-slate-50/50">
                 <div className="w-16 h-16 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-[24px] text-slate-400">headset_mic</span>
                 </div>
                 <h3 className="text-[16px] font-bold text-slate-900 mb-2">Calls Workspace</h3>
                 <p className="text-[13px] text-slate-500 max-w-[300px]">Select a scheduled call from the calendar to view full pre-call context and conduct the meeting.</p>
              </div>
           )}
        </div>
      </div>
    </div>
  );
}
