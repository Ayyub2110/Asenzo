"use client";

import React, { useState } from "react";

// --- TYPES ---
export type CaptureType = "DM_KEYWORD" | "FORM" | "LANDING_PAGE" | "LEAD_MAGNET" | "ASSESSMENT" | "APPLICATION" | "BOOKING" | "MANUAL_IMPORT";
export type SequenceType = "AWARENESS" | "LEAD_DELIVERY" | "EDUCATION" | "PROOF" | "CONVERSION" | "REACTIVATION" | "CUSTOM";
export type LeadStage = "NEW" | "CAPTURED" | "ENGAGED" | "QUALIFIED" | "BOOKING_INTENT" | "BOOKED" | "OPPORTUNITY" | "CUSTOMER" | "DORMANT" | "UNSUBSCRIBED";
export type SequenceStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED" | "ARCHIVED";

// --- MOCK DATA ---
const MOCK_CAPTURES = [
  { id: "cap1", type: "DM_KEYWORD" as CaptureType, name: "SYSTEM", platform: "Instagram", destination: "Business Systems Guide", triggered: 148, identified: 96, qualified: 24, booked: 12, customers: 3, sequence: "Inbound OS Blueprint" },
  { id: "cap2", type: "DM_KEYWORD" as CaptureType, name: "AUDIT", platform: "LinkedIn", destination: "Founder Drag Self-Audit", triggered: 94, identified: 71, qualified: 18, booked: 8, customers: 2, sequence: "Assessment Follow-up" },
  { id: "cap3", type: "BOOKING" as CaptureType, name: "Direct VSL Booking", platform: "Website", destination: "Discovery Call", triggered: 450, identified: 80, qualified: 40, booked: 25, customers: 10, sequence: "None" }
];

const MOCK_SEQUENCES = [
  { id: "seq1", name: "Inbound OS Blueprint", type: "LEAD_DELIVERY" as SequenceType, status: "ACTIVE" as SequenceStatus, emails: 4, enrolled: 148, active: 96, engaged: 31, bookingIntent: 12, booked: 8 },
  { id: "seq2", name: "Assessment Follow-up", type: "AWARENESS" as SequenceType, status: "ACTIVE" as SequenceStatus, emails: 3, enrolled: 71, active: 45, engaged: 18, bookingIntent: 9, booked: 5 },
];

const MOCK_LEADS = [
  { id: "ld1", name: "David Kim", email: "david@nextgen.ai", phone: "", source: "Instagram Reel", keyword: "SYSTEM", asset: "Business Systems Guide", sequence: "Inbound OS Blueprint", stage: "QUALIFIED" as LeadStage, engagement: "HIGH", lastInteraction: "Opened Email 4", nextAction: "AI Outreach Review", timestamp: "2 hrs ago" },
  { id: "ld2", name: "Sarah Jenkins", email: "s.jenkins@acmecorp.com", phone: "+1 555-1234", source: "LinkedIn Post", keyword: "AUDIT", asset: "Founder Drag Diagnostic", sequence: "Assessment Follow-up", stage: "BOOKING_INTENT" as LeadStage, engagement: "MEDIUM", lastInteraction: "Clicked calendar", nextAction: "Book Call", timestamp: "1 day ago" },
  { id: "ld3", name: "Mark Russo", email: "mark@russo.co", phone: "", source: "Website VSL", keyword: "-", asset: "Discovery Call", sequence: "-", stage: "BOOKED" as LeadStage, engagement: "HIGH", lastInteraction: "Scheduled Call", nextAction: "Wait for Call", timestamp: "3 hrs ago" },
];

// --- COMPONENTS ---

export default function NurtureModule() {
  // State for Navigation within this Module
  const [activeView, setActiveView] = useState<"DASHBOARD" | "CAPTURE_BUILDER" | "SEQUENCE_BUILDER" | "LEAD_JOURNEY">("DASHBOARD");
  const [selectedSequence, setSelectedSequence] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);

  // CRM Filter
  const [stageFilter, setStageFilter] = useState<LeadStage | "ALL">("ALL");

  const openSequence = (id: string) => {
    setSelectedSequence(id);
    setActiveView("SEQUENCE_BUILDER");
  };

  const openLead = (id: string) => {
    setSelectedLead(id);
    setActiveView("LEAD_JOURNEY");
  };

  // 1. KPI STRIP
  const renderKPIs = () => (
    <div className="grid grid-cols-5 gap-4">
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Identified Leads</span>
        <span className="text-[24px] font-extrabold text-slate-900 tracking-tight">247</span>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Engaged</span>
        <span className="text-[24px] font-extrabold text-blue-600 tracking-tight">85</span>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Qualified</span>
        <span className="text-[24px] font-extrabold text-emerald-600 tracking-tight">42</span>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Booking Intent</span>
        <span className="text-[24px] font-extrabold text-orange-600 tracking-tight">21</span>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Booked</span>
        <span className="text-[24px] font-extrabold text-violet-600 tracking-tight">15</span>
      </div>
    </div>
  );

  // 2. CAPTURE SECTION
  const renderCapture = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <h2 className="text-[14px] font-extrabold text-slate-900 uppercase tracking-widest">1. Capture</h2>
        <button 
          onClick={() => setActiveView("CAPTURE_BUILDER")}
          className="px-3 py-1.5 bg-slate-900 text-white text-[11px] font-bold rounded-lg hover:bg-slate-800 transition-colors"
        >
          + Create Capture
        </button>
      </div>
      <div className="grid grid-cols-3 gap-5">
        {MOCK_CAPTURES.map(cap => (
          <div key={cap.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-[9px] font-extrabold text-blue-600 uppercase tracking-widest mb-1">{cap.platform} • {cap.type.replace("_", " ")}</div>
                <h3 className="text-[16px] font-bold text-slate-900">{cap.name}</h3>
              </div>
              <button className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined text-[16px]">more_vert</span></button>
            </div>
            
            <div className="text-[11px] space-y-1">
              <div className="flex justify-between items-center"><span className="text-slate-500 font-semibold">Destination:</span> <span className="font-bold text-slate-900">{cap.destination}</span></div>
              <div className="flex justify-between items-center"><span className="text-slate-500 font-semibold">Sequence:</span> <span className="font-bold text-slate-900">{cap.sequence}</span></div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
               <div className="bg-slate-50 p-2 rounded-lg text-center">
                 <div className="text-[16px] font-extrabold text-slate-900">{cap.triggered}</div>
                 <div className="text-[9px] font-bold text-slate-500 uppercase">Triggered</div>
               </div>
               <div className="bg-slate-50 p-2 rounded-lg text-center">
                 <div className="text-[16px] font-extrabold text-blue-600">{cap.identified}</div>
                 <div className="text-[9px] font-bold text-slate-500 uppercase">Identified</div>
               </div>
               <div className="bg-slate-50 p-2 rounded-lg text-center">
                 <div className="text-[16px] font-extrabold text-emerald-600">{cap.qualified}</div>
                 <div className="text-[9px] font-bold text-slate-500 uppercase">Qualified</div>
               </div>
               <div className="bg-slate-50 p-2 rounded-lg text-center">
                 <div className="text-[16px] font-extrabold text-violet-600">{cap.booked}</div>
                 <div className="text-[9px] font-bold text-slate-500 uppercase">Booked</div>
               </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button className="flex-1 py-1.5 border border-slate-200 text-[11px] font-bold text-slate-700 rounded-lg outline-none hover:bg-slate-50">View Journey</button>
              <button className="flex-1 py-1.5 border border-slate-200 text-[11px] font-bold text-slate-700 rounded-lg outline-none hover:bg-slate-50">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // 3. EMAIL SEQUENCES SECTION
  const renderSequences = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <h2 className="text-[14px] font-extrabold text-slate-900 uppercase tracking-widest">2. Email Sequences</h2>
        <button 
          onClick={() => openSequence("new")}
          className="px-3 py-1.5 bg-slate-900 text-white text-[11px] font-bold rounded-lg hover:bg-slate-800 transition-colors"
        >
          + Create Sequence
        </button>
      </div>
      <div className="grid grid-cols-2 gap-5">
        {MOCK_SEQUENCES.map(seq => (
          <div key={seq.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-[9px] font-extrabold text-violet-600 uppercase tracking-widest mb-1">{seq.type.replace("_", " ")}</div>
                <h3 className="text-[16px] font-bold text-slate-900">{seq.name}</h3>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded uppercase">{seq.status}</span>
            </div>

            <div className="flex items-center gap-6 pt-3 border-t border-slate-100">
               <div>
                 <div className="text-[18px] font-extrabold text-slate-900">{seq.enrolled}</div>
                 <div className="text-[9px] font-bold text-slate-500 uppercase">Enrolled</div>
               </div>
               <div>
                 <div className="text-[18px] font-extrabold text-blue-600">{seq.active}</div>
                 <div className="text-[9px] font-bold text-slate-500 uppercase">Active</div>
               </div>
               <div>
                 <div className="text-[18px] font-extrabold text-emerald-600">{seq.engaged}</div>
                 <div className="text-[9px] font-bold text-slate-500 uppercase">Engaged</div>
               </div>
               <div>
                 <div className="text-[18px] font-extrabold text-violet-600">{seq.booked}</div>
                 <div className="text-[9px] font-bold text-slate-500 uppercase">Booked</div>
               </div>
            </div>

            <button 
              onClick={() => openSequence(seq.id)}
              className="w-full py-2 bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-700 rounded-lg outline-none hover:bg-slate-100 mt-2"
            >
              Open Sequence Builder →
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // 4. LEAD CRM SECTION
  const renderLeadCRM = () => {
    const STAGES: (LeadStage | "ALL")[] = ["ALL", "NEW", "CAPTURED", "ENGAGED", "QUALIFIED", "BOOKING_INTENT", "BOOKED", "OPPORTUNITY", "CUSTOMER", "DORMANT", "UNSUBSCRIBED"];
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2 flex-wrap gap-4">
          <h2 className="text-[14px] font-extrabold text-slate-900 uppercase tracking-widest">3. Lead CRM</h2>
          
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-400 text-[16px]">search</span>
            <input 
              type="text" 
              placeholder="Search leads..." 
              className="w-48 px-3 py-1 text-[12px] bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500" 
            />
          </div>
        </div>

        {/* Stage Filters */}
        <div className="flex flex-wrap gap-2">
            {STAGES.map(s => (
               <button 
                 key={s} 
                 onClick={() => setStageFilter(s)}
                 className={`px-3 py-1 font-bold text-[10px] uppercase rounded-full border transition-colors ${
                   stageFilter === s 
                   ? 'bg-slate-900 text-white border-slate-900' 
                   : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                 }`}
               >
                 {s.replace("_", " ")}
               </button>
            ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                <th className="p-4">Contact</th>
                <th className="p-4">Origin Profile</th>
                <th className="p-4">Journey / Sequence</th>
                <th className="p-4">Stage & Engagement</th>
                <th className="p-4">Next Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_LEADS.filter(c => stageFilter === "ALL" || c.stage === stageFilter).map(c => (
                <tr key={c.id} className="hover:bg-slate-50/60 cursor-pointer" onClick={() => openLead(c.id)}>
                  <td className="p-4">
                    <div className="font-extrabold text-slate-900 text-[13px]">{c.name}</div>
                    <div className="text-slate-500 mt-0.5">{c.email}</div>
                  </td>
                  <td className="p-4 space-y-1.5">
                    <div className="flex items-center gap-1.5"><span className="text-[9px] font-bold text-slate-400 w-12">SOURCE</span> <span className="font-semibold text-slate-700">{c.source}</span></div>
                    {c.keyword !== "-" && <div className="flex items-center gap-1.5"><span className="text-[9px] font-bold text-slate-400 w-12">KEYWORD</span> <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 font-mono font-bold rounded">{c.keyword}</span></div>}
                  </td>
                  <td className="p-4 space-y-1.5">
                    <div className="flex items-center gap-1.5"><span className="text-[9px] font-bold text-slate-400 w-16">ASSET</span> <span className="font-semibold text-slate-700 truncate w-32">{c.asset}</span></div>
                    <div className="flex items-center gap-1.5"><span className="text-[9px] font-bold text-slate-400 w-16">SEQUENCE</span> <span className="font-semibold text-slate-700 truncate w-32">{c.sequence}</span></div>
                  </td>
                  <td className="p-4 space-y-2">
                    <div><span className={`px-2 py-0.5 font-bold uppercase rounded text-[9px] ${
                      c.stage==='QUALIFIED'?'bg-emerald-100 text-emerald-800'
                      :c.stage==='BOOKING_INTENT'?'bg-amber-100 text-amber-800'
                      :c.stage==='BOOKED'?'bg-violet-100 text-violet-800'
                      :'bg-slate-100 text-slate-800'}`
                    }>{c.stage.replace(/_/g, ' ')}</span></div>
                    <div className="flex items-center gap-1.5"><span className="text-[9px] font-bold text-slate-400">ENGAGEMENT</span> <span className="font-bold text-slate-900">{c.engagement}</span></div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-700 text-[12px]">{c.lastInteraction} <span className="text-slate-400 font-normal text-[10px] ml-1">({c.timestamp})</span></div>
                    <div className="mt-2 text-[9px] font-bold uppercase text-blue-600 bg-blue-50 px-2 py-1 rounded inline-flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[12px]">bolt</span>
                      {c.nextAction}
                    </div>
                  </td>
                </tr>
              ))}
              {MOCK_LEADS.filter(c => stageFilter === "ALL" || c.stage === stageFilter).length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 text-[12px] font-medium">
                    No leads found for this stage.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // FULL VIEWS 

  const renderCaptureBuilder = () => (
    <div className="bg-white border text-left border-slate-200 rounded-2xl p-8 max-w-[800px] mx-auto shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-[20px] font-bold text-slate-900 tracking-tight">Create Capture Source</h2>
          <p className="text-[12px] text-slate-500 mt-1">Configure how a lead enters the ecosystem and where they will be routed.</p>
        </div>
        <button className="text-slate-400 hover:text-slate-900" onClick={() => setActiveView("DASHBOARD")}><span className="material-symbols-outlined">close</span></button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Capture Type</label>
            <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-900 focus:outline-none focus:border-blue-500">
              {["DM Keyword", "Form", "Landing Page", "Lead Magnet", "Assessment", "Application", "Booking", "Manual Import"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Platform</label>
            <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-900 focus:outline-none focus:border-blue-500">
              {["Instagram", "LinkedIn", "X (Twitter)", "YouTube", "Website", "Other"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Keyword / Trigger Match</label>
            <input type="text" placeholder="e.g. SYSTEM" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-900 focus:outline-none focus:border-blue-500 uppercase" />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Destination Asset</label>
            <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-900 focus:outline-none focus:border-blue-500">
              {["Business Systems Guide", "Founder Drag Self-Audit", "VSL Direct Booking", "None"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Email Sequence Route</label>
            <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-900 focus:outline-none focus:border-blue-500">
              {["Inbound OS Blueprint", "Assessment Follow-up", "None"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Associated Funnel</label>
            <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-900 focus:outline-none focus:border-blue-500">
              {["Founder Systems Funnel", "Cold Outbound Funnel"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
        <button onClick={() => setActiveView("DASHBOARD")} className="px-4 py-2 border border-slate-200 text-slate-600 text-[12px] font-bold rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
        <button onClick={() => setActiveView("DASHBOARD")} className="px-4 py-2 bg-slate-900 text-white text-[12px] font-bold rounded-lg hover:bg-slate-800 transition-colors">Save Capture config</button>
      </div>
    </div>
  );

  const renderSequenceBuilder = () => (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
        <div>
          <button className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest mb-2" onClick={() => setActiveView("DASHBOARD")}>
            <span className="material-symbols-outlined text-[14px]">arrow_back</span> Back to Sequences
          </button>
          <h2 className="text-[20px] font-bold text-slate-900">Inbound OS Blueprint</h2>
          <div className="flex items-center gap-4 mt-2">
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded uppercase">ACTIVE</span>
            <span className="text-[12px] text-slate-500 font-medium"><strong>148</strong> Enrolled • <strong>96</strong> Active • <strong>8</strong> Booked</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 border border-slate-200 text-slate-700 text-[12px] font-bold rounded-lg hover:bg-slate-50 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">settings</span> Sequence Logic
          </button>
          <button className="px-3 py-1.5 bg-slate-900 text-white text-[12px] font-bold rounded-lg hover:bg-slate-800 flex items-center gap-1.5">
             Save Sequence
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 h-[600px]">
        {/* Sidebar */}
        <div className="col-span-3 border-r border-slate-100 bg-slate-50 p-4 space-y-3 overflow-y-auto">
          {[
            { id: 1, delay: "Triggered immediately", subject: "Here is your OS Blueprint..." },
            { id: 2, delay: "Delay: 2 days", subject: "The #1 mistake agencies make..." },
            { id: 3, delay: "Delay: 2 days", subject: "How we fixed acquisition (Proof)" },
            { id: 4, delay: "Delay: 1 day", subject: "Ready for the custom build?" },
          ].map((step, idx) => (
            <div 
              key={step.id} 
              className={`p-3 border rounded-xl cursor-pointer transition-colors ${
                 idx === 0 
                  ? "border-blue-600 bg-blue-50/50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="text-[9px] font-extrabold text-blue-600 uppercase tracking-widest">
                  Email {step.id} • {step.delay}
                </div>
              </div>
              <div className="text-[12px] font-bold text-slate-900 line-clamp-1">{step.subject}</div>
              <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2 font-medium">
                <span>64% Open</span>
                <span>12% Click</span>
              </div>
            </div>
          ))}
          <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-[12px] font-bold text-slate-500 hover:border-slate-300 hover:bg-white flex items-center justify-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">add</span> Add Email Step
          </button>
        </div>

        {/* Editor Area */}
        <div className="col-span-9 flex flex-col bg-white">
          <div className="border-b border-slate-200 p-4 space-y-4 bg-white">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Subject Line</label>
                <input type="text" defaultValue="Here is your OS Blueprint..." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] font-bold text-slate-900 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Preview Text</label>
                <input type="text" defaultValue="Attached as requested. Plus a breakdown on how to use it." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-700 bg-white focus:outline-none focus:border-blue-500" />
              </div>
            </div>
          </div>
          
          <div className="p-2 border-b border-slate-200 bg-slate-50 flex justify-between items-center px-4">
             <div className="flex items-center gap-1 text-slate-500">
               <button className="p-1 hover:bg-slate-200 rounded text-slate-600"><span className="material-symbols-outlined text-[18px]">format_bold</span></button>
               <button className="p-1 hover:bg-slate-200 rounded text-slate-600"><span className="material-symbols-outlined text-[18px]">format_italic</span></button>
               <button className="p-1 hover:bg-slate-200 rounded text-slate-600"><span className="material-symbols-outlined text-[18px]">link</span></button>
               <div className="w-px h-5 bg-slate-300 mx-1"></div>
               <button className="p-1 px-2 hover:bg-slate-200 rounded text-slate-600 text-[11px] font-bold font-mono">{`{{first_name}}`}</button>
               <button className="p-1 px-2 hover:bg-slate-200 rounded text-slate-600 text-[11px] font-bold font-mono">{`{{asset_link}}`}</button>
             </div>
             <button className="text-[11px] font-bold text-violet-600 bg-violet-50 border border-violet-100 uppercase px-2 py-1 flex items-center gap-1 rounded hover:bg-violet-100">
               <span className="material-symbols-outlined text-[14px]">smart_toy</span> Optimize Draft
             </button>
          </div>

          <textarea 
            className="flex-1 w-full p-6 text-[14px] font-medium text-slate-800 leading-relaxed resize-none focus:outline-none font-sans"
            defaultValue={"Hey {{first_name}},\n\nAs requested, here is the complete Acquisition OS Blueprint diagram.\n\n{{asset_link}}\n\nMost founders look at this and immediately realize they've been doing outbound wrong. The strategy here hinges entirely on positioning your intent accurately prior to sending a single message.\n\nReview this today, and tomorrow I'll walk you through exactly where you've been losing attention..."}
          />
        </div>
      </div>
    </div>
  );

  const renderLeadJourney = () => {
    const lead = MOCK_LEADS.find(l => l.id === selectedLead) || MOCK_LEADS[0];
    
    return (
      <div className="flex h-full min-h-[700px] border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
         {/* Left Side: Detail panel */}
         <div className="w-1/3 border-r border-slate-200 bg-slate-50 flex flex-col">
            <div className="p-6 border-b border-slate-200 space-y-4">
               <button className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest" onClick={() => setActiveView("DASHBOARD")}>
                 <span className="material-symbols-outlined text-[14px]">arrow_back</span> Back to Leads
               </button>
               
               <div>
                  <h2 className="text-[24px] font-bold text-slate-900 tracking-tight">{lead.name}</h2>
                  <p className="text-[14px] text-slate-500">{lead.email}</p>
                  {lead.phone && <p className="text-[14px] text-slate-500 mt-0.5">{lead.phone}</p>}
               </div>
               
               <div className="grid grid-cols-2 gap-3 pt-2">
                 <div className="bg-white p-3 rounded-xl border border-slate-100">
                    <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Stage</span>
                    <span className="text-[13px] font-extrabold text-emerald-600 tracking-tight">{lead.stage.replace("_", " ")}</span>
                 </div>
                 <div className="bg-white p-3 rounded-xl border border-slate-100">
                    <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Engagement</span>
                    <span className="text-[13px] font-extrabold text-blue-600 tracking-tight">{lead.engagement}</span>
                 </div>
               </div>
            </div>

            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
               <div className="space-y-3">
                  <h3 className="text-[11px] font-extrabold text-slate-900 uppercase tracking-widest">Attribution & Origin</h3>
                  <div className="space-y-1.5 text-[12px]">
                     <div className="flex justify-between"><span className="text-slate-500 font-semibold">First Touch</span> <span className="font-bold text-slate-900">{lead.source}</span></div>
                     <div className="flex justify-between"><span className="text-slate-500 font-semibold">Keyword</span> <span className="font-bold font-mono text-blue-600 bg-blue-50 px-1 rounded">{lead.keyword}</span></div>
                     <div className="flex justify-between"><span className="text-slate-500 font-semibold">Asset</span> <span className="font-bold text-slate-900">{lead.asset}</span></div>
                     <div className="flex justify-between"><span className="text-slate-500 font-semibold">Campaign</span> <span className="font-bold text-slate-900">Founder Systems</span></div>
                  </div>
               </div>

               <div className="space-y-3">
                  <h3 className="text-[11px] font-extrabold text-slate-900 uppercase tracking-widest">Active Sequence</h3>
                  <div className="p-3 border border-slate-200 rounded-xl bg-white border-l-4 border-l-blue-600">
                     <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Enrolled In</span>
                     <span className="text-[13px] font-bold text-slate-900">{lead.sequence}</span>
                     <button className="text-[11px] font-bold text-red-600 underline mt-2">Remove from Sequence</button>
                  </div>
               </div>
            </div>
         </div>

         {/* Right Side: Timeline */}
         <div className="w-2/3 bg-white flex flex-col">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-[14px] font-extrabold text-slate-900 uppercase tracking-widest">Complete Journey</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg hover:bg-slate-50">+ Add Note</button>
                {lead.stage === "QUALIFIED" && (
                  <button className="px-3 py-1.5 bg-violet-600 text-white text-[11px] font-bold rounded-lg hover:bg-violet-700 ml-2">Push to Outbound</button>
                )}
                {lead.stage === "BOOKING_INTENT" && (
                  <button className="px-3 py-1.5 bg-orange-600 text-white text-[11px] font-bold rounded-lg hover:bg-orange-700 ml-2">Convert to Deal</button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 relative">
               <div className="absolute left-10 top-0 bottom-0 w-px bg-slate-200 z-0"></div>
               
               <div className="relative z-10 space-y-6">
                 {/* Mock Timeline Events */}
                 {[
                   { type: "QUALIFIED", title: "ICP Automatically Qualified", desc: "AI Agent analyzed profile vs IPC. Intent: HIGH.", time: "2 hrs ago", tag: "AI ACTION" },
                   { type: "EMAIL", title: "Opened Email #4", desc: "Ready for the custom build?", time: "3 hrs ago" },
                   { type: "EMAIL", title: "Opened Email #3", desc: "How we fixed acquisition (Proof)", time: "1 day ago" },
                   { type: "EMAIL", title: "Clicked Asset Link in Email #1", desc: "Clicked link to Business Systems Guide PDF.", time: "3 days ago" },
                   { type: "CAPTURE", title: "Lead Captured", desc: "Submitted email via DM capture form.", time: "3 days ago" },
                   { type: "ENGAGEMENT", title: "Anonymous Engagement", desc: "User commented 'SYSTEM' on Instagram Reel.", time: "3 days ago" },
                 ].map((ev, i) => (
                   <div key={i} className="flex gap-6 relative">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white border-2 border-slate-200 flex-shrink-0 z-10 shadow-sm mt-0.5">
                         {ev.type === "QUALIFIED" && <span className="material-symbols-outlined text-emerald-500 text-[16px]">verified</span>}
                         {ev.type === "EMAIL" && <span className="material-symbols-outlined text-blue-500 text-[16px]">mail</span>}
                         {ev.type === "CAPTURE" && <span className="material-symbols-outlined text-orange-500 text-[16px]">how_to_reg</span>}
                         {ev.type === "ENGAGEMENT" && <span className="material-symbols-outlined text-slate-500 text-[16px]">forum</span>}
                      </div>
                      <div className="flex-1 bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                         <div className="flex justify-between items-start mb-1">
                           <h4 className="text-[13px] font-bold text-slate-900">{ev.title}</h4>
                           <span className="text-[10px] font-bold text-slate-400">{ev.time}</span>
                         </div>
                         <p className="text-[12px] text-slate-600 mb-2">{ev.desc}</p>
                         {ev.tag && <span className="px-2 py-0.5 bg-violet-50 text-violet-700 font-bold text-[9px] rounded uppercase">{ev.tag}</span>}
                      </div>
                   </div>
                 ))}
               </div>
            </div>
         </div>
      </div>
    );
  };

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto space-y-8 min-h-screen">
      {/* HEADER IS ALWAYS VISIBLE UNLESS IN FOCUSED OVERLAYS - wait, making it a master-detail layout */}
      
      {activeView === "DASHBOARD" && (
        <div className="space-y-12 pb-12">
          {/* HEADER */}
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Acquisition OS</p>
            <h1 className="text-[24px] font-bold text-slate-900 tracking-tight mt-0.5">Lead Capture & Nurture</h1>
            <p className="text-[13px] text-slate-500 mt-1 max-w-2xl">Capture, identify, nurture, qualify, and move acquisition leads toward conversion.</p>
          </div>

          {renderKPIs()}

          {renderCapture()}

          {renderSequences()}

          {renderLeadCRM()}
        </div>
      )}

      {activeView === "CAPTURE_BUILDER" && renderCaptureBuilder()}
      {activeView === "SEQUENCE_BUILDER" && renderSequenceBuilder()}
      {activeView === "LEAD_JOURNEY" && renderLeadJourney()}

    </div>
  );
}
