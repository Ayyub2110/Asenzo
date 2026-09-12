"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Lead, LeadLifecycleStage } from "@/lib/types/conversion";
import { useConversionOS } from "@/contexts/ConversionOSContext";

const STAGES: LeadLifecycleStage[] = [
  "NEW", "CONTACTED", "ENGAGED", "QUALIFIED"
];

export default function LeadsWorkspace() {
  const { leads, conversations, opportunities, timelineEvents, addLead, updateLead, createOpportunity } = useConversionOS();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [tempFilter, setTempFilter] = useState<"ALL" | "HOT" | "WARM" | "COLD">("ALL");
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const [isCreating, setIsCreating] = useState(false);
  const [newLead, setNewLead] = useState<Partial<Lead>>({
    name: "", email: "", originalSource: "Website", temperature: "HOT", qualificationStatus: "NEW", lifecycleStage: "NEW", problem: "", buyingTrigger: ""
  });

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    addLead(newLead as any);
    setIsCreating(false);
    setNewLead({ name: "", email: "", originalSource: "Website", temperature: "HOT", qualificationStatus: "NEW", lifecycleStage: "NEW", problem: "", buyingTrigger: "" });
  };

  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      const matchSearch = (l.name + l.email + l.company).toLowerCase().includes(searchTerm.toLowerCase());
      const matchTemp = tempFilter === "ALL" || l.temperature === tempFilter;
      return matchSearch && matchTemp;
    });
  }, [leads, searchTerm, tempFilter]);

  const activeLead = selectedLeadId ? leads.find(l => l.id === selectedLeadId) : null;
  const activeOpp = activeLead ? opportunities.find(o => o.leadId === activeLead.id) : null;
  const activeConv = activeLead ? conversations.filter(c => c.leadId === activeLead.id).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0] : null;
  const events = activeLead ? timelineEvents.filter(e => e.leadId === activeLead.id) : [];

  const renderNextAction = (lead: Lead) => {
    switch (lead.lifecycleStage) {
      case "NEW": return { text: "Start Conversation", link: `/conversion/conversations`, actionLabel: "Open Conversation" };
      case "CONTACTED": return { text: "Continue conversation", link: `/conversion/conversations`, actionLabel: "Open Conversation" };
      case "ENGAGED": return { text: "Continue sales conversation", link: `/conversion/conversations`, actionLabel: "Open Conversation" };
      case "QUALIFIED": return { text: "Book sales call", link: `/conversion/pipeline`, actionLabel: "Book Call" };
      case "CALL_BOOKED": return { text: "Attend scheduled sales call", link: `/conversion/pipeline/calls`, actionLabel: "View Call" };
      case "CALL_SHOWED": return { text: "Record call outcome", link: `/conversion/pipeline/calls`, actionLabel: "View Call" };
      case "NURTURE": return { text: "Continue nurture sequence", link: `/conversion/nurture`, actionLabel: "Open Nurture" };
      case "CONVERTED": return { text: "Client onboarding", link: `/revenue`, actionLabel: "Open Client" };
      case "LOST": return { text: "Review lost reason", link: `/conversion/pipeline`, actionLabel: "View Opportunity" };
      default: return { text: "Open Conversation", link: `/conversion/conversations`, actionLabel: "Open" };
    }
  };

  const renderJourney = (currentStage: LeadLifecycleStage) => {
    const journey: LeadLifecycleStage[] = ["NEW", "CONTACTED", "ENGAGED", "QUALIFIED", "CALL_BOOKED", "CALL_SHOWED", "NURTURE", "CONVERTED", "LOST"];
    
    // Simplistic check just for visual display
    const currentIndex = journey.indexOf(currentStage);
    
    return (
      <div className="flex flex-col gap-1.5 mt-2">
         {journey.map((s, idx) => {
            const isCurrent = s === currentStage;
            const isPassed = idx < currentIndex && currentIndex < 6; // only check linear path
            
            return (
               <div key={s} className="flex justify-between items-center text-[11px] font-bold">
                  <span className={`${isCurrent ? "text-slate-900" : isPassed ? "text-slate-600" : "text-slate-400"}`}>{s.replace("_", " ")}</span>
                  <span className={`${isCurrent ? "bg-slate-900 text-white px-2 py-0.5 rounded text-[9px]" : isPassed ? "text-slate-500" : "text-slate-300"}`}>
                     {isCurrent ? "CURRENT" : isPassed ? "✓" : "—"}
                  </span>
               </div>
            )
         })}
      </div>
    )
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col relative overflow-hidden">
      {/* HEADER */}
      <div className="px-8 py-5 shrink-0 flex items-center justify-between border-b border-slate-200 bg-white z-10">
        <div>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Leads</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Manage every person through the conversion journey.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-[14px] text-slate-400">search</span>
              <input 
                type="text" 
                placeholder="Search leads..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-[12px] focus:outline-none focus:border-blue-500 bg-slate-50 focus:bg-white transition-colors min-w-[250px]" 
              />
           </div>
           <div className="flex bg-slate-100 p-0.5 rounded-lg">
             {(["ALL", "HOT", "WARM", "COLD"] as const).map(t => (
               <button 
                 key={t}
                 onClick={() => setTempFilter(t)}
                 className={`px-3 py-1 text-[10px] font-bold rounded ${tempFilter === t ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 {t}
               </button>
             ))}
           </div>
           <button onClick={() => setIsCreating(true)} className="px-4 py-1.5 bg-slate-900 text-white text-[12px] font-bold rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5 ml-2">
             <span className="material-symbols-outlined text-[14px]">add</span>
             Lead
           </button>
        </div>
      </div>

      {isCreating && (
        <div className="px-8 py-4 bg-slate-50 border-b border-slate-200 shrink-0">
          <form onSubmit={handleCreateLead} className="max-w-[700px] flex gap-2">
             <input required placeholder="Lead Name" value={newLead.name} onChange={e => setNewLead({...newLead, name: e.target.value})} className="flex-1 px-3 py-1.5 border border-slate-200 rounded text-[12px]" />
             <input required placeholder="Email" value={newLead.email} onChange={e => setNewLead({...newLead, email: e.target.value})} className="flex-1 px-3 py-1.5 border border-slate-200 rounded text-[12px]" />
             <button type="submit" className="px-4 py-1.5 bg-slate-900 text-white rounded text-[11px] font-bold whitespace-nowrap">Save</button>
             <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-1.5 border border-slate-200 bg-white rounded text-[11px] font-bold whitespace-nowrap">Cancel</button>
          </form>
        </div>
      )}

      {/* KANBAN BOARD */}
      <div className={`flex-1 overflow-x-auto overflow-y-hidden bg-slate-50/50 p-6 flex gap-4 transition-all duration-300 ${activeLead ? 'pr-[420px]' : ''}`}>
        {STAGES.map(stage => {
           const stageLeads = filteredLeads.filter(l => l.lifecycleStage === stage);
           return (
              <div key={stage} className="flex-1 min-w-[260px] h-full flex flex-col">
                 <div className="mb-3 flex items-center justify-between px-1">
                    <h3 className="text-[12px] font-black tracking-widest text-slate-800 uppercase">{stage.replace("_", " ")}</h3>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-200/50 px-2 rounded-full">{stageLeads.length}</span>
                 </div>
                 
                 <div className="flex-1 overflow-y-auto space-y-3 pb-8 scrollbar-hide">
                    {stageLeads.map(lead => (
                       <div 
                          key={lead.id} 
                          onClick={() => setSelectedLeadId(lead.id)}
                          className={`bg-white border rounded-lg p-3 cursor-pointer shadow-sm hover:border-blue-300 transition-all ${selectedLeadId === lead.id ? 'border-blue-400 ring-1 ring-blue-400' : 'border-slate-200 hover:shadow'}`}
                        >
                          <div className="font-bold text-slate-900 text-[13px] truncate">{lead.name}</div>
                          <div className="text-[11px] text-slate-500 truncate mt-0.5">{lead.email}</div>
                          
                          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                             <div className="text-[9px] font-bold tracking-widest uppercase text-slate-400">
                               {lead.lifecycleStage.replace("_", " ")}
                             </div>
                             <div className={`text-[9px] font-bold uppercase tracking-widest ${
                                 lead.temperature === "HOT" ? "text-red-600" :
                                 lead.temperature === "WARM" ? "text-amber-600" :
                                 "text-blue-600"
                               }`}>
                               • {lead.temperature}
                             </div>
                          </div>

                          {lead.lifecycleStage === "QUALIFIED" && (
                             <div className="mt-3 pt-3 border-t border-slate-100">
                               <button 
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   createOpportunity({
                                     leadId: lead.id,
                                     offerId: "TBD",
                                     pipelineStage: "NEW_OPPORTUNITY",
                                     estimatedValue: 0,
                                     probability: 10,
                                     expectedCloseDate: new Date(Date.now() + 86400000 * 30).toISOString(),
                                     problem: lead.problem || "",
                                     desiredOutcome: lead.desiredOutcome || "",
                                     qualificationNote: "Moved from Leads Kanban",
                                     buyingTrigger: lead.buyingTrigger || "",
                                     objections: [],
                                     followUpState: "UPCOMING",
                                     owner: "Founder",
                                     nextAction: "Review Deal",
                                   });
                                   updateLead(lead.id, { lifecycleStage: "CALL_BOOKED" }); 
                                 }}
                                 className="w-full py-1.5 bg-slate-900 text-white rounded text-[11px] font-bold hover:bg-slate-800 transition-colors"
                               >
                                 Move to Sales Pipeline
                               </button>
                             </div>
                          )}
                       </div>
                    ))}
                 </div>
              </div>
           )
        })}
      </div>

      {/* LEAD PROFILE DRAWER (RIGHT PANEL) */}
      <div className={`absolute top-0 right-0 bottom-0 w-[400px] bg-white border-l border-slate-200 shadow-2xl transition-transform duration-300 ease-in-out z-20 flex flex-col ${activeLead ? 'translate-x-0' : 'translate-x-full'}`}>
         {activeLead && (
            <>
               <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between bg-slate-50 shrink-0">
                  <div>
                     <h2 className="text-[20px] font-black text-slate-900 leading-tight">{activeLead.name}</h2>
                     <p className="text-[12px] text-slate-500 font-medium mb-1">{activeLead.email}</p>
                     <p className="text-[11px] font-bold text-slate-700">{activeLead.role || "Member"} {activeLead.company ? `— ${activeLead.company}` : ""}</p>
                     <div className="flex gap-2 mt-3">
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[9px] font-bold uppercase tracking-widest rounded">{activeLead.temperature}</span>
                        <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[9px] font-bold uppercase tracking-widest rounded">{activeLead.lifecycleStage.replace("_", " ")}</span>
                     </div>
                  </div>
                  <button onClick={() => setSelectedLeadId(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 transition text-slate-500">
                     <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto p-6 space-y-8">

                  {/* NEXT ACTION */}
                  <div className="space-y-2">
                     <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Next Action</h3>
                     <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg">
                        <p className="text-[12px] font-bold text-blue-900 mb-2">{renderNextAction(activeLead).text}</p>
                        <Link href={renderNextAction(activeLead).link} className="inline-block px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-[10px] font-bold rounded shadow-sm hover:bg-slate-50 transition uppercase tracking-wider">
                           {renderNextAction(activeLead).actionLabel}
                        </Link>
                     </div>
                  </div>

                  {/* CURRENT JOURNEY */}
                  <div className="space-y-2">
                     <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Current Journey</h3>
                     <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                        {renderJourney(activeLead.lifecycleStage)}
                     </div>
                  </div>

                  {/* SOURCE & ATTRIBUTION */}
                  <div className="space-y-2">
                     <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Source & Attribution</h3>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <span className="block text-[10px] text-slate-500">Source</span>
                           <span className="block text-[12px] font-bold text-slate-900">{activeLead.originalSource || "Unknown"}</span>
                        </div>
                        <div>
                           <span className="block text-[10px] text-slate-500">Campaign</span>
                           <span className="block text-[12px] font-bold text-slate-900 truncate">{activeLead.originalFunnel || "None"}</span>
                        </div>
                        <div className="col-span-2">
                           <span className="block text-[10px] text-slate-500">Content</span>
                           <span className="block text-[12px] font-bold text-slate-900">{activeLead.originalContent || "No specific content recorded."}</span>
                        </div>
                     </div>
                  </div>

                  {/* TRIGGER / PROBLEM */}
                  <div className="space-y-2">
                     <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Trigger / Problem</h3>
                     <div className="space-y-3">
                        <div>
                           <span className="block text-[11px] font-bold text-slate-700 mb-0.5">Primary Problem</span>
                           <div className="p-3 bg-red-50 text-red-900 text-[12px] rounded border border-red-100">
                              {activeLead.problem || "No primary problem identified yet."}
                           </div>
                        </div>
                        <div>
                           <span className="block text-[11px] font-bold text-slate-700 mb-0.5">Buying Trigger</span>
                           <div className="p-3 bg-amber-50 text-amber-900 text-[12px] rounded border border-amber-100">
                              {activeLead.buyingTrigger || "No trigger identified."}
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* CONVERSATION */}
                  <div className="space-y-2">
                     <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Conversation</h3>
                     {activeConv ? (
                        <div className="p-3 border border-slate-200 rounded-lg">
                           <span className="block text-[10px] font-bold text-slate-400 mb-1">Last Interaction: {new Date(activeConv.timestamp).toLocaleDateString()}</span>
                           <p className="text-[12px] text-slate-700 italic border-l-2 border-blue-500 pl-3 py-1 bg-slate-50/50">"{activeConv.latestMessage}"</p>
                        </div>
                     ) : (
                        <p className="text-[11px] text-slate-500 italic">No conversational history logged.</p>
                     )}
                  </div>

                  {/* QUALIFICATION & OPPORTUNITY SUMMARY */}
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Qualification</h3>
                        <div>
                           <span className="block text-[11px] font-bold text-slate-900">{activeLead.qualificationStatus === 'QUALIFIED' ? 'Qualified' : 'Not yet qualified'}</span>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Opportunity</h3>
                        <div>
                           <span className="block text-[11px] font-bold text-slate-900">{activeOpp ? `£${(activeOpp.estimatedValue).toLocaleString()}` : 'No active deal'}</span>
                           {activeOpp && <span className="block text-[10px] text-slate-500">{activeOpp.pipelineStage.replace('_', ' ')}</span>}
                        </div>
                     </div>
                  </div>

                  {/* ACTIVITY TIMELINE */}
                  <div className="space-y-3">
                     <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Activity</h3>
                     <div className="space-y-4">
                        {events.length > 0 ? events.slice(0, 5).map(event => (
                           <div key={event.id} className="flex flex-col">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{new Date(event.timestamp).toLocaleDateString()}</span>
                              <span className="text-[11px] text-slate-700">{event.description}</span>
                           </div>
                        )) : (
                           <p className="text-[11px] text-slate-500 italic">No recent activity.</p>
                        )}
                     </div>
                  </div>

               </div>
            </>
         )}
      </div>
    </div>
  );
}
