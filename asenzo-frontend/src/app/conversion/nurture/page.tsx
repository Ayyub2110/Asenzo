"use client";

import React, { useState } from "react";
import { useConversionOS } from "@/contexts/ConversionOSContext";

// --- TYPES ---
export type CaptureMechanism = "DM Keyword" | "Landing Page" | "Lead Magnet" | "Assessment" | "Application" | "Booking Page" | "Manual";
export type SequenceType = "AWARENESS" | "LEAD_DELIVERY" | "EDUCATION" | "PROOF" | "CONVERSION" | "REACTIVATION" | "CUSTOM";
export type SequenceStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED" | "ARCHIVED";

// --- MOCK DATA ---
const MOCK_CAPTURE_SOURCES = [
  { id: "cap1", name: "SYSTEM", platform: "Instagram", type: "DM Keyword", asset: "Business Systems Guide", triggered: 148, identified: 96, qualified: 24, booked: 12, customers: 3, sequence: "Inbound OS Blueprint" },
  { id: "cap2", name: "AUDIT", platform: "LinkedIn", type: "DM Keyword", asset: "Founder Drag Self-Audit", triggered: 94, identified: 71, qualified: 18, booked: 8, customers: 2, sequence: "Assessment Follow-up" },
  { id: "cap3", name: "Growth Assessment", platform: "Website", type: "Assessment", asset: "Growth Assessment Flow", triggered: 63, identified: 41, qualified: 9, booked: 4, customers: 1, sequence: "Founder Education" }
];

const MOCK_SEQUENCES = [
  { id: "seq1", name: "Inbound OS Blueprint", type: "LEAD_DELIVERY", tags: ["Lead Delivery", "Awareness"], emails: 4, status: "ACTIVE" as SequenceStatus, enrolled: 148, active: 96, engaged: 31, intent: 12, booked: 8 },
  { id: "seq2", name: "Founder Drag Assessment Follow-up", type: "EDUCATION", tags: ["Education", "Conversion"], emails: 5, status: "ACTIVE" as SequenceStatus, enrolled: 94, active: 61, engaged: 19, intent: 8, booked: 5 },
  { id: "seq3", name: "Reactivation - Stalled Deals", type: "REACTIVATION", tags: ["Reactivation"], emails: 3, status: "PAUSED" as SequenceStatus, enrolled: 45, active: 0, engaged: 12, intent: 2, booked: 1 },
];

const STAGE_FILTERS = ["All", "New", "Captured", "Engaged", "Qualified", "Booking Intent", "Booked", "Opportunity", "Customer", "Dormant", "Unsubscribed"];
const SEQ_FILTERS = ["ALL", "AWARENESS", "LEAD_DELIVERY", "EDUCATION", "PROOF", "CONVERSION", "REACTIVATION", "CUSTOM"];

export default function LeadCaptureNurtureOS() {
  const { leads, updateLead, timelineEvents } = useConversionOS();

  const [activeTab, setActiveTab] = useState<"CAPTURE" | "SEQUENCES" | "CRM">("CAPTURE");
  const [overlay, setOverlay] = useState<"NONE" | "SEQUENCE_BUILDER" | "LEAD_JOURNEY">("NONE");
  
  // Selection States
  const [selectedSequence, setSelectedSequence] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [crmStageFilter, setCrmStageFilter] = useState<string>("All");
  const [seqFilter, setSeqFilter] = useState<string>("ALL");

  const openSequence = (id: string) => { setSelectedSequence(id); setOverlay("SEQUENCE_BUILDER"); };
  const openLead = (id: string) => { setSelectedLead(id); setOverlay("LEAD_JOURNEY"); };
  const closeOverlay = () => setOverlay("NONE");

  // --- KPI STRIP ---
  const renderKPIs = () => (
    <div className="flex gap-12 mt-2">
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1.5"><span className="text-[20px] font-extrabold text-blue-600 tracking-tight">842</span><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Identified</span></div>
      </div>
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1.5"><span className="text-[20px] font-extrabold text-slate-800 tracking-tight">316</span><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Engaged</span></div>
      </div>
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1.5"><span className="text-[20px] font-extrabold text-emerald-600 tracking-tight">94</span><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Qualified</span></div>
      </div>
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1.5"><span className="text-[20px] font-extrabold text-orange-600 tracking-tight">37</span><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Intent</span></div>
      </div>
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1.5"><span className="text-[20px] font-extrabold text-violet-600 tracking-tight">21</span><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Booked</span></div>
      </div>
    </div>
  );

  // --- TAB 1: CAPTURE ---
  const renderCaptureTab = () => (
    <div className="space-y-6">
       <div className="flex justify-between items-center bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
         <div>
            <h2 className="text-[16px] font-bold text-slate-900">1. CAPTURE</h2>
            <p className="text-[12px] text-slate-500 mt-1">Every mechanism that turns attention into identified leads.</p>
         </div>
         <button className="px-4 py-2 bg-slate-900 text-white font-bold text-[11px] rounded-lg shadow-sm">+ Create Capture Source</button>
       </div>

       <div className="grid grid-cols-3 gap-6">
          {MOCK_CAPTURE_SOURCES.map(cap => (
             <div key={cap.id} className="bg-white border border-slate-200 rounded-xl flex flex-col">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                   <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{cap.platform} • {cap.type}</div>
                   <h3 className="text-[16px] font-bold text-slate-900">{cap.name}</h3>
                   <div className="text-[11px] font-bold text-slate-500 mt-1">Asset: <span className="text-slate-700">{cap.asset}</span></div>
                </div>
                <div className="p-5 space-y-3 flex-1 flex flex-col">
                   <div className="flex justify-between items-center text-[12px] pb-2 border-b border-slate-100">
                      <span className="font-semibold text-slate-500">Triggered (Anonymous)</span>
                      <span className="font-extrabold text-slate-900">{cap.triggered}</span>
                   </div>
                   <div className="flex justify-between items-center text-[12px] pb-2 border-b border-slate-100">
                      <span className="font-semibold text-slate-500">Identified (Lead)</span>
                      <span className="font-extrabold text-blue-600">{cap.identified}</span>
                   </div>
                   <div className="flex justify-between items-center text-[12px] pb-2 border-b border-slate-100">
                      <span className="font-semibold text-slate-500">Qualified</span>
                      <span className="font-extrabold text-emerald-600">{cap.qualified}</span>
                   </div>
                   <div className="flex justify-between items-center text-[12px] pb-2 border-b border-slate-100">
                      <span className="font-semibold text-slate-500">Booked</span>
                      <span className="font-extrabold text-violet-600">{cap.booked}</span>
                   </div>
                   <div className="flex justify-between items-center text-[12px]">
                      <span className="font-semibold text-slate-500">Customers</span>
                      <span className="font-extrabold text-slate-900">{cap.customers}</span>
                   </div>
                   
                   <div className="mt-4 pt-4 border-t border-slate-100 mt-auto">
                      <span className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Routing Sequence</span>
                      <div className="font-medium text-[11px] text-slate-700 bg-slate-50 p-2 rounded border border-slate-100 truncate">{cap.sequence}</div>
                   </div>
                   
                   <div className="flex gap-2 pt-2 mt-auto">
                      <button className="flex-1 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-bold rounded-lg transition-colors">View Journey</button>
                      <button className="flex-1 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-bold rounded-lg transition-colors">Edit</button>
                   </div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );

  // --- TAB 2: EMAIL SEQUENCES ---
  const renderEmailTab = () => (
    <div className="space-y-6">
       <div className="flex justify-between items-center bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
         <div>
            <h2 className="text-[16px] font-bold text-slate-900">2. EMAIL SEQUENCES</h2>
            <p className="text-[12px] text-slate-500 mt-1">Manage all automated sequences converting and educating leads.</p>
         </div>
         <button className="px-4 py-2 bg-slate-900 text-white font-bold text-[11px] rounded-lg shadow-sm" onClick={() => setOverlay("SEQUENCE_BUILDER")}>+ Create Sequence</button>
       </div>

       <div className="flex flex-wrap gap-2 pb-2">
            {SEQ_FILTERS.map(s => (
               <button 
                 key={s} 
                 onClick={() => setSeqFilter(s)}
                 className={`px-3 py-1.5 font-bold text-[10px] uppercase rounded-lg border transition-colors ${
                   seqFilter === s 
                   ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                   : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                 }`}
               >
                 {s.replace("_", " ")}
               </button>
            ))}
        </div>

       <div className="grid grid-cols-2 gap-5">
          {MOCK_SEQUENCES.filter(s => seqFilter === "ALL" || s.type === seqFilter).map(seq => (
             <div key={seq.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                <div>
                   <div className="flex justify-between items-start mb-2">
                      <h3 className="text-[16px] font-bold text-slate-900">{seq.name}</h3>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded uppercase">{seq.status}</span>
                   </div>
                   <div className="flex gap-1.5 mb-4">
                      {seq.tags.map(t => <span key={t} className="text-[9px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-1.5 py-0.5 rounded">Type: {t}</span>)}
                   </div>
                   <div className="text-[11px] text-slate-500 font-medium mb-4">{seq.emails} emails in sequence</div>
                </div>

                <div className="grid grid-cols-5 gap-3 pt-4 border-t border-slate-100">
                   <div><div className="text-[14px] font-extrabold text-slate-900">{seq.enrolled}</div><div className="text-[9px] font-bold text-slate-400 uppercase">Enrolled</div></div>
                   <div><div className="text-[14px] font-extrabold text-blue-600">{seq.active}</div><div className="text-[9px] font-bold text-slate-400 uppercase">Active</div></div>
                   <div><div className="text-[14px] font-extrabold text-emerald-600">{seq.engaged}</div><div className="text-[9px] font-bold text-slate-400 uppercase">Engaged</div></div>
                   <div><div className="text-[14px] font-extrabold text-orange-600">{seq.intent}</div><div className="text-[9px] font-bold text-slate-400 uppercase">Intent</div></div>
                   <div><div className="text-[14px] font-extrabold text-violet-600">{seq.booked}</div><div className="text-[9px] font-bold text-slate-400 uppercase">Booked</div></div>
                </div>

                <button 
                  onClick={() => openSequence(seq.id)}
                  className="w-full mt-5 py-2 bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-700 rounded-lg outline-none hover:bg-slate-100 transition-colors"
                >
                  Open Sequence
                </button>
             </div>
          ))}
       </div>
    </div>
  );

  // --- TAB 3: LEAD CRM ---
  const renderLeadCRM = () => {
    return (
      <div className="space-y-4">
         <div className="flex justify-between items-center bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
         <div>
            <h2 className="text-[16px] font-bold text-slate-900">3. LEAD CRM</h2>
            <p className="text-[12px] text-slate-500 mt-1">Unified view of where every identified person currently sits in the journey.</p>
         </div>
         <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 mr-2 uppercase tracking-wide">Stage ▾</span>
            <select 
               value={crmStageFilter} 
               onChange={e => setCrmStageFilter(e.target.value)} 
               className="bg-slate-50 border border-slate-200 text-[11px] font-bold rounded-lg px-3 py-1.5 outline-none cursor-pointer"
            >
               {STAGE_FILTERS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
         </div>
       </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                <th className="p-4">Name</th>
                <th className="p-4">Origin</th>
                <th className="p-4">Sequence</th>
                <th className="p-4">Stage</th>
                <th className="p-4">Next Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.filter(c => crmStageFilter === "All" || 
                 (crmStageFilter === "Qualified" && c.qualificationStatus === "QUALIFIED") ||
                 (crmStageFilter === "New" && c.qualificationStatus === "UNQUALIFIED") ||
                 (crmStageFilter === "Booking Intent" && c.qualificationStatus === "INTENT_DETECTED")
              ).map(c => (
                <tr key={c.id} className="hover:bg-slate-50/60 cursor-pointer transition-colors" onClick={() => openLead(c.id)}>
                  <td className="p-4">
                     <div className="font-extrabold text-slate-900 text-[13px]">{c.name}</div>
                     <div className="text-slate-500 font-medium">{c.email}</div>
                  </td>
                  <td className="p-4 space-y-0.5">
                     <div className="font-semibold text-slate-700">{c.originalSource}</div>
                     {c.originalKeyword && <div className="text-[10px] text-slate-400">Keyword: <span className="font-mono text-blue-600">{c.originalKeyword}</span></div>}
                     <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{c.originalContent || "Unknown Asset"}</div>
                  </td>
                  <td className="p-4">
                     <div className="font-semibold text-slate-700">{(c as any).sequence && (c as any).sequence !== "-" ? (c as any).sequence : "—"}</div>
                  </td>
                  <td className="p-4">
                     <span className={`px-2 py-1 font-bold uppercase rounded text-[9px] ${
                        c.qualificationStatus === 'QUALIFIED' ? 'bg-emerald-100 text-emerald-800'
                        : c.qualificationStatus === 'INTENT_DETECTED' ? 'bg-orange-100 text-orange-800'
                        : c.qualificationStatus === 'UNQUALIFIED' ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'}`
                     }>{c.qualificationStatus.replace(/_/g, ' ')}</span>
                  </td>
                  <td className="p-4">
                     <div className="font-bold text-slate-700 bg-slate-50 px-2 py-1 border border-slate-100 rounded inline-flex items-center uppercase text-[10px]">
                       {c.nextAction || "Automated Nurture"}
                     </div>
                  </td>
                </tr>
              ))}
              {leads.filter(c => crmStageFilter === "All" || 
                 (crmStageFilter === "Qualified" && c.qualificationStatus === "QUALIFIED") ||
                 (crmStageFilter === "New" && c.qualificationStatus === "UNQUALIFIED") ||
                 (crmStageFilter === "Booking Intent" && c.qualificationStatus === "INTENT_DETECTED")
              ).length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <span className="material-symbols-outlined text-[32px] text-slate-300 mb-2 block">person_off</span>
                    <h3 className="text-[14px] font-bold text-slate-700">No leads match this stage filter.</h3>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };


  // --- OVERLAYS ---

  const renderLeadJourney = () => {
    const lead = leads.find(l => l.id === selectedLead) || leads[0];
    
    return (
      <div className="flex h-full min-h-[750px] border border-slate-200 bg-white rounded-2xl shadow-sm text-left font-sans">
         {/* Detail Panel */}
         <div className="w-[420px] flex-shrink-0 border-r border-slate-100 bg-slate-50 flex flex-col rounded-l-2xl">
            <div className="p-6 border-b border-slate-200 relative bg-white">
               <button className="flex items-center gap-1 text-[10px] font-extrabold text-slate-400 hover:text-slate-900 uppercase tracking-widest mb-4 transition-colors" onClick={closeOverlay}>
                 <span className="material-symbols-outlined text-[14px]">arrow_back</span> Back to CRM
               </button>
               
               <h2 className="text-[24px] font-black text-slate-900 tracking-tight">{lead.name}</h2>
               <div className="text-[13px] text-slate-500 font-medium mb-4">{lead.email}</div>
               
               <div className="grid grid-cols-2 gap-px bg-slate-200 border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-white p-3">
                     <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">CURRENT STAGE</span>
                     <span className={`text-[11px] font-extrabold uppercase ${lead.qualificationStatus === 'QUALIFIED' ? 'text-emerald-600' : 'text-blue-600'}`}>{lead.qualificationStatus.replace(/_/g, " ")}</span>
                  </div>
                  <div className="bg-white p-3">
                     <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">ENGAGEMENT</span>
                     <span className="text-[11px] font-extrabold uppercase text-slate-900">HIGH</span>
                  </div>
               </div>
            </div>

            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
               <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2"><div className="h-px bg-slate-200 flex-1"></div><span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">1. ORIGIN</span><div className="h-px bg-slate-200 flex-1"></div></div>
                  <div className="space-y-2 text-center text-[12px] font-bold text-slate-700">
                     <div className="p-2 border border-slate-200 rounded-lg bg-white shadow-sm">{lead.originalSource}</div>
                     <div className="flex justify-center"><span className="w-px h-3 bg-slate-200"></span></div>
                     {lead.originalKeyword && (
                        <>
                           <div className="p-2 border border-blue-200 rounded-lg bg-blue-50/50 shadow-sm text-blue-800">Keyword: <span className="font-mono text-blue-600">{lead.originalKeyword}</span></div>
                           <div className="flex justify-center"><span className="w-px h-3 bg-slate-200"></span></div>
                        </>
                     )}
                     <div className="p-2 border border-slate-200 rounded-lg bg-white shadow-sm text-slate-500">{lead.originalContent || "Unknown Conversion Asset"}</div>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2"><div className="h-px bg-slate-200 flex-1"></div><span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">2. CAPTURE</span><div className="h-px bg-slate-200 flex-1"></div></div>
                  <div className="space-y-2 text-center text-[12px] font-bold text-slate-700">
                     {lead.originalKeyword && <div>Commented {lead.originalKeyword}</div>}
                     {lead.originalKeyword && <div className="flex justify-center"><span className="w-px h-3 bg-slate-200"></span></div>}
                     <div>Submitted Email</div>
                     <div className="flex justify-center"><span className="w-px h-3 bg-slate-200"></span></div>
                     <div className="text-emerald-600 rounded bg-emerald-50 py-1 font-extrabold border border-emerald-100">Lead record created</div>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2"><div className="h-px bg-slate-200 flex-1"></div><span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">3. NURTURE</span><div className="h-px bg-slate-200 flex-1"></div></div>
                  <div className="space-y-2 text-center text-[12px] font-bold text-slate-700">
                     <div className="p-2 border border-slate-200 rounded-lg bg-white">{(lead as any).sequence || "Inbound OS Blueprint"}</div>
                     <div className="flex justify-center"><span className="w-px h-3 bg-slate-200"></span></div>
                     <div>Email 1 <span className="text-[10px] text-slate-400 font-medium ml-1">opened</span></div>
                     <div className="flex justify-center"><span className="w-px h-3 bg-slate-200"></span></div>
                     <div>Email 2 <span className="text-[10px] text-slate-400 font-medium ml-1">opened</span></div>
                     <div className="flex justify-center"><span className="w-px h-3 bg-slate-200"></span></div>
                     <div className="text-blue-600 font-extrabold bg-blue-50 py-1 rounded border border-blue-100">CTA Clicked</div>
                  </div>
               </div>
               
               <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2"><div className="h-px bg-slate-200 flex-1"></div><span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">4. QUALIFICATION</span><div className="h-px bg-slate-200 flex-1"></div></div>
                  <div className="space-y-2 text-center text-[12px] font-bold text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                     <div className="flex justify-between py-1"><span className="text-slate-500">ICP</span> <span className="text-emerald-600">YES</span></div>
                     <div className="flex justify-between py-1"><span className="text-slate-500">Intent</span> <span>HIGH</span></div>
                     <div className="flex justify-between py-1 border-t border-slate-100 mt-1 pt-2"><span className="text-slate-500">Problem</span> <span>Identified</span></div>
                  </div>
               </div>
               
               <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2"><div className="h-px bg-slate-200 flex-1"></div><span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">5. NEXT</span><div className="h-px bg-slate-200 flex-1"></div></div>
                  <div className="space-y-2 text-center text-[12px] font-bold text-slate-700">
                     <div className="p-3 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 text-slate-600">
                        <div>AI-generated outreach</div>
                        <div className="text-amber-600 text-[10px] uppercase font-extrabold mt-1">Human approval required</div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Extra Pane for context/action if needed */}
         <div className="flex-1 bg-white p-8 flex flex-col items-center justify-center text-center">
            <span className="material-symbols-outlined text-[48px] text-slate-300 mb-4">account_tree</span>
            <h3 className="text-[18px] font-bold text-slate-900 mb-2">Automated Journey Active</h3>
            <p className="text-[13px] text-slate-500 max-w-md">This lead is fully captured and is being mapped across defined states. The unified datagraph automatically attaches conversion telemetry for analytics.</p>
         </div>
      </div>
    );
  };

  const renderSequenceBuilder = () => (
    <div className="bg-white border text-left border-slate-200 rounded-2xl shadow-sm overflow-hidden h-[800px] flex flex-col font-sans">
      <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white">
        <div>
          <button className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest mb-3 transition-colors outline-none" onClick={closeOverlay}>
            <span className="material-symbols-outlined text-[14px]">arrow_back</span> Back to Sequences
          </button>
          <div className="flex items-center gap-3">
             <h2 className="text-[22px] font-black text-slate-900">Inbound OS Blueprint</h2>
             <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded uppercase mt-1">ACTIVE</span>
          </div>
        </div>
        <div className="flex gap-6 items-center">
           <div className="text-center"><div className="text-[16px] font-extrabold text-slate-900">148</div><div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Enrolled</div></div>
           <div className="text-center"><div className="text-[16px] font-extrabold text-blue-600">96</div><div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Active</div></div>
           <div className="text-center"><div className="text-[16px] font-extrabold text-slate-500">31</div><div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Engaged</div></div>
           <div className="w-px h-8 bg-slate-200 mx-2"></div>
           <div className="text-center"><div className="text-[16px] font-extrabold text-orange-600">12</div><div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Booking Intent</div></div>
           <div className="text-center"><div className="text-[16px] font-extrabold text-violet-600">8</div><div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Booked</div></div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Email Steps list */}
        <div className="w-[380px] border-r border-slate-100 bg-slate-50/50 p-6 space-y-4 overflow-y-auto">
          {[
            { id: 1, delay: "Immediately", subject: "Here is your OS Blueprint..." },
            { id: 2, delay: "After 2 days", subject: "The #1 mistake agencies make..." },
            { id: 3, delay: "After 2 days", subject: "How we fixed acquisition (Proof)" },
            { id: 4, delay: "After 1 day", subject: "Ready for the custom build?" },
          ].map((step, idx) => (
             <React.Fragment key={step.id}>
                <div className={`p-4 border rounded-xl cursor-pointer transition-colors ${idx === 0 ? "border-blue-600 bg-blue-50/20 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300 shadow-sm"}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">EMAIL {step.id}</div>
                    <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 rounded py-0.5">{step.delay}</span>
                  </div>
                  <div className="text-[13px] font-bold text-slate-900 line-clamp-1 truncate block">{step.subject}</div>
                </div>
                {idx < 3 && (
                   <div className="flex justify-center my-1.5"><span className="material-symbols-outlined text-slate-300 text-[18px]">arrow_downward</span></div>
                )}
             </React.Fragment>
          ))}
          <div className="flex justify-center my-1.5"><span className="material-symbols-outlined text-slate-300 text-[18px]">arrow_downward</span></div>
          <button className="w-full py-4 border-2 border-dashed border-slate-300 bg-transparent rounded-xl text-[12px] font-bold text-slate-400 hover:border-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center gap-1.5 hover:bg-slate-50">
            <span className="material-symbols-outlined text-[18px]">add</span> Add Email
          </button>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col bg-slate-50 relative">
          <div className="border-b border-slate-200 p-6 space-y-4 bg-white relative shadow-sm z-10">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Subject</label>
                <input type="text" defaultValue="Here is your OS Blueprint..." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Preheader</label>
                <input type="text" defaultValue="Attached as requested. Plus a breakdown." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-700 bg-white focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
            </div>
            
            <div className="flex gap-4 pt-1">
               <div className="flex items-center gap-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Delay Status:</label>
                  <select className="bg-white border border-slate-200 text-[11px] font-bold rounded px-2 py-1 outline-none text-slate-700">
                     <option>Immediately</option>
                     <option>Wait 1 Day</option>
                     <option>Wait 2 Days</option>
                  </select>
               </div>
               <div className="flex items-center gap-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Condition:</label>
                  <select className="bg-white border border-slate-200 text-[11px] font-bold rounded px-2 py-1 outline-none text-slate-700">
                     <option>None (All Enrolled)</option>
                     <option>Only if Unopened</option>
                  </select>
               </div>
            </div>
          </div>
          
          <div className="p-2 border-b border-slate-200 bg-slate-100 flex justify-between items-center px-6 z-0">
             <div className="flex items-center gap-2 text-slate-500">
               <button className="p-1.5 hover:bg-slate-200 rounded text-slate-600 font-bold transition-colors w-7 h-7 flex items-center justify-center">B</button>
               <button className="p-1.5 hover:bg-slate-200 rounded text-slate-600 italic transition-colors w-7 h-7 flex items-center justify-center">I</button>
               <button className="p-1.5 hover:bg-slate-200 rounded text-slate-600 underline transition-colors w-7 h-7 flex items-center justify-center">U</button>
               <div className="w-px h-5 bg-slate-300 mx-2"></div>
               <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Vars:</span>
               <button className="px-2 py-1 border border-slate-200 bg-white hover:bg-slate-50 rounded text-blue-600 text-[11px] font-bold font-mono transition-colors">first_name</button>
               <button className="px-2 py-1 border border-slate-200 bg-white hover:bg-slate-50 rounded text-blue-600 text-[11px] font-bold font-mono transition-colors">asset_link</button>
             </div>
             <button className="px-4 py-1.5 bg-slate-900 text-white hover:bg-slate-800 transition-colors text-[11px] font-bold rounded cursor-pointer">Save Draft</button>
          </div>

          <div className="flex-1 p-6 flex flex-col">
             <textarea 
               className="flex-1 w-full p-6 text-[14px] font-medium text-slate-800 leading-relaxed resize-none focus:outline-none font-sans bg-white border border-slate-200 rounded-xl shadow-sm"
               defaultValue={"Hey {{first_name}},\n\nAs requested, here is the complete Acquisition OS Blueprint diagram.\n\n{{asset_link}}\n\nMost founders look at this and immediately realize they've been doing outbound wrong. The strategy here hinges entirely on positioning your intent accurately prior to sending a single message.\n\nReview this today, and tomorrow I'll walk you through exactly where you've been losing attention...\n\nTalk soon,\nAsenzo"}
             />
          </div>

          <div className="border-t border-slate-200 bg-white p-6 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
             <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">logout</span> Automatic Exit Rules</h4>
             <p className="text-[11px] text-slate-500 mb-4">Leads matching these conditions exit the sequence instantly and return to Conversion OS pipeline tracking.</p>
             <div className="flex flex-wrap gap-2">
                {["Booked Call", "Qualified / Moved to Sales", "Opportunity Created", "Customer", "Unsubscribed"].map((rule, i) => (
                   <span key={rule} className="px-3 py-1.5 bg-slate-50 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 text-[11px] font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer">
                      <span className="material-symbols-outlined text-[14px] text-slate-400">check_circle</span> {rule}
                   </span>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );


  // --- MAIN RENDER ---
  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto min-h-[900px] relative font-sans">
      
      {overlay !== "NONE" && (
         <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-40 flex items-center justify-center p-8 transition-opacity">
            <div className="w-full h-full max-h-[900px]" style={{maxWidth: overlay==="SEQUENCE_BUILDER"?"1200px":"1000px"}}>
               {overlay === "LEAD_JOURNEY" && renderLeadJourney()}
               {overlay === "SEQUENCE_BUILDER" && renderSequenceBuilder()}
            </div>
         </div>
      )}

      {/* HEADER IS ALWAYS VISIBLE */}
      <div className={`space-y-6 pb-12 transition-all duration-300 ${overlay !== "NONE" ? "opacity-40 blur-sm pointer-events-none scale-[0.98]" : ""}`}>
        
        <div className="border border-slate-200 rounded-2xl p-8 bg-white shadow-sm mb-6 flex justify-between items-center">
            <div>
               <h1 className="text-[28px] font-black text-slate-900 tracking-tight uppercase">LEAD CAPTURE & NURTURE</h1>
               <p className="text-[14px] text-slate-500 mt-1 font-medium">Turn attention into identified, nurtured, qualified leads.</p>
               {renderKPIs()}
            </div>
        </div>

        {/* PRIMARY NAVIGATION TABS */}
        <div className="flex border-b border-slate-200">
           <button 
             onClick={() => setActiveTab("CAPTURE")}
             className={`pb-3 px-6 text-[12px] font-black uppercase tracking-widest border-b-2 relative top-px transition-colors ${activeTab === "CAPTURE" ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300"}`}
           >
             1. CAPTURE
           </button>
           <button 
             onClick={() => setActiveTab("SEQUENCES")}
             className={`pb-3 px-6 text-[12px] font-black uppercase tracking-widest border-b-2 relative top-px transition-colors ${activeTab === "SEQUENCES" ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300"}`}
           >
             2. EMAIL SEQUENCES
           </button>
           <button 
             onClick={() => setActiveTab("CRM")}
             className={`pb-3 px-6 text-[12px] font-black uppercase tracking-widest border-b-2 relative top-px transition-colors ${activeTab === "CRM" ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300"}`}
           >
             3. LEAD CRM
           </button>
        </div>

        {/* ACTIVE SECTION */}
        <div className="pt-2 animate-in fade-in duration-300">
           {activeTab === "CAPTURE" && renderCaptureTab()}
           {activeTab === "SEQUENCES" && renderEmailTab()}
           {activeTab === "CRM" && renderLeadCRM()}
        </div>
      </div>
    </div>
  );
}
