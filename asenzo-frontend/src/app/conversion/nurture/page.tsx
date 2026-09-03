"use client";

import React, { useState } from "react";

// --- TYPES ---
export type AssetType = "Landing Page" | "Lead Magnet" | "Quiz" | "Assessment" | "Application" | "Booking" | "Offer" | "VSL" | "Other";
export type CaptureMethod = "Email" | "Form" | "DM Keyword" | "Application" | "Booking" | "Purchase" | "None";
export type SequenceType = "AWARENESS" | "LEAD_DELIVERY" | "EDUCATION" | "PROOF" | "CONVERSION" | "REACTIVATION" | "CUSTOM";
export type LeadStage = "NEW" | "ANONYMOUS" | "ENGAGED" | "IDENTIFIED" | "QUALIFIED" | "BOOKING_INTENT" | "BOOKED" | "OPPORTUNITY" | "CUSTOMER" | "NURTURE" | "LOST";
export type SequenceStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED" | "ARCHIVED";

// --- MOCK DATA ---
const MOCK_ASSETS = [
  { id: "as1", name: "Founder Growth Assessment", type: "Assessment" as AssetType, status: "ACTIVE", trafficSource: "LinkedIn", cta: "Take Assessment", captureMethod: "Form" as CaptureMethod, hasLeadMagnet: false, hasEmailSequence: true, bookingDest: "Discovery Call", created: "Oct 12", visitors: 450, captureStarts: 120, captured: 71, captureRate: "15.7%", qualified: 18, booked: 8, bookingRate: "11.2%", customers: 2, revenue: "$24k" },
  { id: "as2", name: "Business Systems Guide", type: "Lead Magnet" as AssetType, status: "ACTIVE", trafficSource: "Instagram DM", cta: "Download PDF", captureMethod: "DM Keyword" as CaptureMethod, hasLeadMagnet: true, hasEmailSequence: true, bookingDest: "None", created: "Nov 3", visitors: 1120, captureStarts: 450, captured: 280, captureRate: "25.0%", qualified: 60, booked: 20, bookingRate: "7.1%", customers: 5, revenue: "$60k" },
  { id: "as3", name: "Direct VSL Booking", type: "VSL" as AssetType, status: "ACTIVE", trafficSource: "Website", cta: "Book Strategy Call", captureMethod: "Booking" as CaptureMethod, hasLeadMagnet: false, hasEmailSequence: false, bookingDest: "Strategy Session", created: "Nov 15", visitors: 3000, captureStarts: 150, captured: 80, captureRate: "2.6%", qualified: 40, booked: 25, bookingRate: "31.2%", customers: 10, revenue: "$120k" }
];

const MOCK_KEYWORDS = [
  { keyword: "GROWTH", responses: 100, identified: 72, anonymous: 28, emails: 41, qualified: 10, booked: 6, customers: 2 }
];

const MOCK_SEQUENCES = [
  { id: "seq1", name: "Inbound OS Blueprint", purpose: "Lead Delivery", trigger: "DM Keyword = SYSTEM", audience: "All Inbound", emails: 5, status: "ACTIVE" as SequenceStatus, enrolled: 148, active: 96, completed: 32, paused: 0, unsubscribed: 4, booked: 12, converted: 3 },
  { id: "seq2", name: "Assessment Follow-up", purpose: "Awareness", trigger: "Assessment Completed", audience: "Qualified Founders", emails: 3, status: "ACTIVE" as SequenceStatus, enrolled: 71, active: 45, completed: 12, paused: 0, unsubscribed: 2, booked: 8, converted: 2 },
];

const MOCK_LEADS = [
  { id: "ld1", name: "David Kim", email: "david@nextgen.ai", phone: "+1 555-0101", social: "@davidkim", company: "NextGen AI", role: "CEO", icpStatus: "YES", stage: "QUALIFIED" as LeadStage, source: "Instagram Reel", keyword: "SYSTEM", asset: "Business Systems Guide", sequence: "Inbound OS Blueprint", engagement: "HIGH", lastActivity: "Opened Email 4", nextAction: "AI Outreach Review", timestamp: "2 hrs ago", owner: "Founder" },
  { id: "ld2", name: "Sarah Jenkins", email: "s.jenkins@acmecorp.com", phone: "+1 555-1234", social: "-", company: "Acme Corp", role: "CMO", icpStatus: "REVIEW", stage: "BOOKING_INTENT" as LeadStage, source: "LinkedIn Post", keyword: "-", asset: "Founder Growth Assessment", sequence: "Assessment Follow-up", engagement: "MEDIUM", lastActivity: "Pricing Page View", nextAction: "Send Custom Booking Link", timestamp: "1 day ago", owner: "Founder" },
  { id: "ld3", name: "Mark Russo", email: "mark@russo.co", phone: "", social: "@mrusso", company: "Russo Digital", role: "Founder", icpStatus: "YES", stage: "BOOKED" as LeadStage, source: "Website VSL", keyword: "-", asset: "Direct VSL Booking", sequence: "-", engagement: "HIGH", lastActivity: "Scheduled Call", nextAction: "Complete Discovery Call", timestamp: "3 hrs ago", owner: "Founder" },
];

// --- COMPONENTS ---

export default function LeadCaptureNurtureOS() {
  const [activeTab, setActiveTab] = useState<"CAPTURE" | "EMAIL" | "CRM">("CAPTURE");
  const [overlay, setOverlay] = useState<"NONE" | "CREATE_ASSET" | "SEQUENCE_BUILDER" | "CREATE_SEQUENCE" | "LEAD_JOURNEY">("NONE");
  
  // Selection States
  const [selectedSequence, setSelectedSequence] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [stageFilter, setStageFilter] = useState<LeadStage | "ALL">("ALL");

  // Create Asset Flow state
  const [createAssetStep, setCreateAssetStep] = useState(1);
  const [newAsset, setNewAsset] = useState<{ type: AssetType, name: string, source: string, captureMethod: CaptureMethod, hasMagnet: boolean, sequence: string, booking: string }>({
     type: "Landing Page", name: "", source: "Instagram", captureMethod: "None", hasMagnet: false, sequence: "None", booking: "None"
  });

  const openSequence = (id: string) => { setSelectedSequence(id); setOverlay("SEQUENCE_BUILDER"); };
  const openLead = (id: string) => { setSelectedLead(id); setOverlay("LEAD_JOURNEY"); };
  const closeOverlay = () => setOverlay("NONE");

  // --- KPI STRIP ---
  const renderKPIs = () => (
    <div className="grid grid-cols-6 gap-4 border-t border-slate-200 mt-6 pt-6">
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col items-center text-center">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Interacted</span>
        <span className="text-[20px] font-extrabold text-slate-800 tracking-tight">4,570</span>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col items-center text-center">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Identified Leads</span>
        <span className="text-[20px] font-extrabold text-blue-600 tracking-tight">431</span>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col items-center text-center">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Qualified</span>
        <span className="text-[20px] font-extrabold text-emerald-600 tracking-tight">118</span>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col items-center text-center">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Booking Intent</span>
        <span className="text-[20px] font-extrabold text-orange-600 tracking-tight">42</span>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col items-center text-center">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Booked</span>
        <span className="text-[20px] font-extrabold text-violet-600 tracking-tight">53</span>
      </div>
      <div className="bg-slate-900 border border-slate-900 rounded-xl p-4 shadow-sm flex flex-col items-center text-center">
        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">Assisted Rev</span>
        <span className="text-[20px] font-extrabold text-white tracking-tight">$204k</span>
      </div>
    </div>
  );

  // --- TAB: CAPTURE & CONVERSION ---
  const renderCaptureTab = () => (
    <div className="space-y-6">
       <div className="flex justify-between items-center bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
         <div>
            <h2 className="text-[16px] font-bold text-slate-900">Conversion Assets</h2>
            <p className="text-[12px] text-slate-500 mt-1">Manage the surfaces that turn audience attention into identifiable leads.</p>
         </div>
         <button className="px-4 py-2 bg-slate-900 text-white font-bold text-[11px] rounded-lg shadow-sm" onClick={() => setOverlay("CREATE_ASSET")}>+ Create Conversion Asset</button>
       </div>

       <div className="grid grid-cols-1 gap-6">
          {MOCK_ASSETS.map(a => (
            <div key={a.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
               <div className="p-5 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                  <div className="flex gap-4 items-start">
                     <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 text-slate-400">
                        <span className="material-symbols-outlined">{a.type === "VSL" ? "play_circle" : a.type === "Assessment" ? "quiz" : "article"}</span>
                     </div>
                     <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest">{a.type}</span>
                          <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded uppercase">{a.status}</span>
                        </div>
                        <h3 className="text-[16px] font-bold text-slate-900">{a.name}</h3>
                        <p className="text-[11px] text-slate-500 mt-1">Source: {a.trafficSource} • Created: {a.created}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <button className="px-3 py-1.5 border border-slate-200 bg-white text-slate-600 font-bold text-[11px] rounded-lg">View Asset</button>
                     <button className="px-3 py-1.5 border border-slate-200 bg-white text-slate-600 font-bold text-[11px] rounded-lg">Edit Configuration</button>
                  </div>
               </div>
               
               <div className="p-5 border-b border-slate-100 bg-white grid grid-cols-12 gap-6">
                  {/* Configuration column */}
                  <div className="col-span-3 space-y-3 pt-2">
                     <div className="flex items-center gap-2 text-[11px]">
                        <span className="material-symbols-outlined text-[14px] text-slate-400">touch_app</span>
                        <span className="text-slate-500 font-medium w-24">CTA:</span>
                        <span className="font-bold text-slate-900">{a.cta}</span>
                     </div>
                     <div className="flex items-center gap-2 text-[11px]">
                        <span className="material-symbols-outlined text-[14px] text-slate-400">how_to_reg</span>
                        <span className="text-slate-500 font-medium w-24">Capture Via:</span>
                        <span className="font-bold text-slate-900">{a.captureMethod}</span>
                     </div>
                     <div className="flex items-center gap-2 text-[11px]">
                        <span className="material-symbols-outlined text-[14px] text-slate-400">mail</span>
                        <span className="text-slate-500 font-medium w-24">Nurture:</span>
                        <span className="font-bold text-slate-900">{a.hasEmailSequence ? "Connected" : "No Sequence"}</span>
                     </div>
                     <div className="flex items-center gap-2 text-[11px]">
                        <span className="material-symbols-outlined text-[14px] text-slate-400">event</span>
                        <span className="text-slate-500 font-medium w-24">Booking Dest:</span>
                        <span className="font-bold text-slate-900">{a.bookingDest}</span>
                     </div>
                  </div>

                  {/* Funnel Pipeline */}
                  <div className="col-span-9 flex items-center justify-between gap-2 pl-6 border-l border-slate-100 pt-2">
                     <div className="text-center">
                        <div className="text-[16px] font-extrabold text-slate-900">{a.visitors}</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase">Attention</div>
                     </div>
                     <span className="material-symbols-outlined text-slate-300 text-[16px]">arrow_forward</span>
                     <div className="text-center">
                        <div className="text-[16px] font-extrabold text-slate-900">{a.captureStarts}</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase">Interaction</div>
                        <div className="text-[9px] text-slate-400 mt-0.5">({a.type === "VSL" ? "Clicked CTA" : "Started Form"})</div>
                     </div>
                     <span className="material-symbols-outlined text-slate-300 text-[16px]">arrow_forward</span>
                     <div className="text-center">
                        <div className="text-[16px] font-extrabold text-blue-600">{a.captured}</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase">Identified Lead</div>
                        <div className="text-[9px] font-bold text-emerald-600 mt-0.5">{a.captureRate} Conv.</div>
                     </div>
                     <span className="material-symbols-outlined text-slate-300 text-[16px]">arrow_forward</span>
                     <div className="text-center">
                        <div className="text-[16px] font-extrabold text-emerald-600">{a.qualified}</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase">Qualified</div>
                     </div>
                     <span className="material-symbols-outlined text-slate-300 text-[16px]">arrow_forward</span>
                     <div className="text-center">
                        <div className="text-[16px] font-extrabold text-violet-600">{a.booked}</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase">Booked</div>
                        <div className="text-[9px] font-bold text-emerald-600 mt-0.5">{a.bookingRate} Conv.</div>
                     </div>
                     <span className="material-symbols-outlined text-slate-300 text-[16px]">arrow_forward</span>
                     <div className="text-center">
                        <div className="text-[16px] font-extrabold text-slate-900">{a.customers}</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase">Customers</div>
                        <div className="text-[10px] font-bold text-emerald-600 mt-0.5">{a.revenue} Rev.</div>
                     </div>
                  </div>
               </div>
            </div>
          ))}

          {/* DM Keyword Specialized Card */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
             <div className="p-5 border-b border-slate-100">
               <h3 className="text-[14px] font-bold text-slate-900">Direct Message Keyword Capture Events</h3>
               <p className="text-[11px] text-slate-500 mt-0.5">Tracking anonymous vs identified leads originating directly from DM triggers.</p>
             </div>
             <table className="w-full text-left text-[11px]">
               <thead>
                 <tr className="bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider text-[9px] border-b border-slate-100">
                   <th className="p-4">Keyword</th>
                   <th className="p-4">Anonymous Interactions</th>
                   <th className="p-4">Identified (Email/CRM)</th>
                   <th className="p-4">Qualified</th>
                   <th className="p-4">Bookings</th>
                   <th className="p-4">Customers</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {MOCK_KEYWORDS.map(k => (
                    <tr key={k.keyword}>
                       <td className="p-4"><span className="px-2 py-0.5 bg-slate-100 font-mono font-bold text-slate-800 rounded">{k.keyword}</span></td>
                       <td className="p-4">{k.responses} total <span className="text-orange-500 bg-orange-50 px-1 rounded ml-1 font-bold">({k.anonymous} missing info)</span></td>
                       <td className="p-4 font-bold text-blue-600">{k.identified} <span className="text-slate-400 font-normal">({k.emails} emails)</span></td>
                       <td className="p-4 font-bold text-emerald-600">{k.qualified}</td>
                       <td className="p-4 font-bold text-violet-600">{k.booked}</td>
                       <td className="p-4 font-bold">{k.customers}</td>
                    </tr>
                 ))}
               </tbody>
             </table>
          </div>
       </div>
    </div>
  );

  // --- TAB: EMAIL NURTURE ---
  const renderEmailTab = () => (
    <div className="space-y-6">
       <div className="flex justify-between items-center bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
         <div>
            <h2 className="text-[16px] font-bold text-slate-900">Email Nurture Sequences</h2>
            <p className="text-[12px] text-slate-500 mt-1">Manage active drip campaigns, assess sequence performance, and configure exit triggers.</p>
         </div>
         <div className="flex gap-2">
            <button className="px-4 py-2 border border-slate-200 bg-white text-slate-600 font-bold text-[11px] rounded-lg shadow-sm">Enroll Leads</button>
            <button className="px-4 py-2 bg-slate-900 text-white font-bold text-[11px] rounded-lg shadow-sm" onClick={() => setOverlay("CREATE_SEQUENCE")}>+ Create Sequence</button>
         </div>
       </div>

       <div className="grid grid-cols-2 gap-5">
          {MOCK_SEQUENCES.map(seq => (
            <div key={seq.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <div className="text-[9px] font-extrabold text-violet-600 uppercase tracking-widest mb-1">TYPE: {seq.purpose}</div>
                  <h3 className="text-[16px] font-bold text-slate-900">{seq.name}</h3>
                  <div className="mt-1 text-[11px] text-slate-500"><strong>Trigger:</strong> {seq.trigger}</div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded uppercase">{seq.status}</span>
              </div>

              <div className="grid grid-cols-4 gap-4">
                 <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Enrolled</span>
                    <span className="text-[18px] font-extrabold text-slate-900">{seq.enrolled}</span>
                 </div>
                 <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Active</span>
                    <span className="text-[18px] font-extrabold text-blue-600">{seq.active}</span>
                 </div>
                 <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Booked</span>
                    <span className="text-[18px] font-extrabold text-violet-600">{seq.booked}</span>
                 </div>
                 <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Converted</span>
                    <span className="text-[18px] font-extrabold text-emerald-600">{seq.converted}</span>
                 </div>
              </div>

              <div className="flex text-[11px] text-slate-500 justify-between items-center px-1">
                 <span>Completed: <b>{seq.completed}</b></span>
                 <span>Unsubscribed: <b>{seq.unsubscribed}</b></span>
              </div>

              <button 
                onClick={() => openSequence(seq.id)}
                className="w-full py-2 bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-700 rounded-lg outline-none hover:bg-slate-100 mt-2 transition-colors"
              >
                Open Sequence Builder 
              </button>
            </div>
          ))}
       </div>
    </div>
  );

  // --- TAB: LEAD CRM ---
  const renderLeadCRM = () => {
    const STAGES: (LeadStage | "ALL")[] = ["ALL", "NEW", "ENGAGED", "IDENTIFIED", "QUALIFIED", "BOOKING_INTENT", "BOOKED", "CUSTOMER", "NURTURE", "LOST"];
    
    return (
      <div className="space-y-4">
        {/* CRM Toolbar */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-4">
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 bg-white rounded-lg shadow-sm">
                <span className="material-symbols-outlined text-slate-400 text-[18px]">search</span>
                <input 
                  type="text" 
                  placeholder="Search lead name, email..." 
                  className="w-56 text-[12px] focus:outline-none" 
                />
             </div>
             <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 bg-white text-slate-600 font-bold text-[11px] rounded-lg shadow-sm">
                <span className="material-symbols-outlined text-[16px]">filter_list</span> Advanced Filters
             </button>
          </div>
          <div className="flex gap-2">
             <button className="px-3 py-1.5 border border-slate-200 bg-white text-slate-600 font-bold text-[11px] rounded-lg shadow-sm">Import Leads</button>
             <button className="px-3 py-1.5 bg-slate-900 text-white font-bold text-[11px] rounded-lg shadow-sm">+ Add Lead</button>
          </div>
        </div>

        {/* Stage Filters */}
        <div className="flex flex-wrap gap-2 pb-2">
            {STAGES.map(s => (
               <button 
                 key={s} 
                 onClick={() => setStageFilter(s)}
                 className={`px-3 py-1.5 font-bold text-[10px] uppercase rounded-lg border transition-colors ${
                   stageFilter === s 
                   ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                   : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                 }`}
               >
                 {s.replace("_", " ")}
               </button>
            ))}
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                <th className="p-4">Contact Profile</th>
                <th className="p-4">Source & Asset</th>
                <th className="p-4">Pipeline Stage</th>
                <th className="p-4">Active Workflow</th>
                <th className="p-4">Next Required Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_LEADS.filter(c => stageFilter === "ALL" || c.stage === stageFilter).map(c => (
                <tr key={c.id} className="hover:bg-slate-50/60 cursor-pointer transition-colors" onClick={() => openLead(c.id)}>
                  <td className="p-4 space-y-1">
                    <div className="font-extrabold text-slate-900 text-[13px]">{c.name}</div>
                    <div className="text-slate-500">{c.email}</div>
                    {(c.company || c.role) && <div className="text-[10px] text-slate-400 font-medium">{c.role} @ {c.company}</div>}
                  </td>
                  <td className="p-4 space-y-1.5">
                    <div className="flex items-center gap-1.5"><span className="text-[9px] font-bold text-slate-400 w-12">SOURCE</span> <span className="font-semibold text-slate-700">{c.source}</span></div>
                    {c.keyword !== "-" && <div className="flex items-center gap-1.5"><span className="text-[9px] font-bold text-slate-400 w-12">KEYWORD</span> <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 font-mono font-bold rounded">{c.keyword}</span></div>}
                    <div className="flex items-center gap-1.5"><span className="text-[9px] font-bold text-slate-400 w-12">ASSET</span> <span className="font-semibold text-slate-700 truncate max-w-[140px]">{c.asset}</span></div>
                  </td>
                  <td className="p-4 space-y-2">
                    <div>
                      <span className={`px-2 py-1 font-bold uppercase rounded text-[9px] ${
                        c.stage==='QUALIFIED'?'bg-emerald-100 text-emerald-800'
                        :c.stage==='BOOKING_INTENT'?'bg-amber-100 text-amber-800'
                        :c.stage==='BOOKED'?'bg-violet-100 text-violet-800'
                        :'bg-slate-100 text-slate-800'}`
                      }>{c.stage.replace(/_/g, ' ')}</span>
                    </div>
                    {c.icpStatus === "YES" ? (
                       <div className="flex items-center gap-1.5 text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded inline-flex"><span className="material-symbols-outlined text-[10px]">verified</span> ICP QUALIFIED</div>
                    ) : c.icpStatus === "REVIEW" ? (
                       <div className="flex items-center gap-1.5 text-[9px] font-extrabold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded inline-flex"><span className="material-symbols-outlined text-[10px]">error</span> NEEDS REVIEW</div>
                    ) : null}
                  </td>
                  <td className="p-4 space-y-1.5">
                    {c.sequence !== "-" ? (
                      <div className="flex items-center gap-1.5"><span className="text-[9px] font-bold text-slate-400 w-16">SEQUENCE</span> <span className="font-semibold text-blue-700 truncate max-w-[140px]">{c.sequence}</span></div>
                    ) : <span className="text-[10px] text-slate-400 font-semibold italic">No Active Sequence</span>}
                    <div className="flex items-center gap-1.5"><span className="text-[9px] font-bold text-slate-400 w-16">LAST EVENT</span> <span className="text-slate-600 max-w-[140px] truncate">{c.lastActivity}</span></div>
                  </td>
                  <td className="p-4">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Action Assigned:</div>
                    <div className="font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded inline-flex items-center gap-1.5 uppercase text-[10px]">
                      {c.nextAction}
                    </div>
                  </td>
                </tr>
              ))}
              {MOCK_LEADS.filter(c => stageFilter === "ALL" || c.stage === stageFilter).length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <span className="material-symbols-outlined text-[32px] text-slate-300 mb-2 block">person_off</span>
                    <h3 className="text-[14px] font-bold text-slate-700">No leads in this stage.</h3>
                    <p className="text-[12px] text-slate-500">Wait for identified leads to organically reach this stage, or manually import.</p>
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

  const renderCreateAsset = () => (
    <div className="bg-white border text-left border-slate-200 rounded-2xl p-8 max-w-[900px] mx-auto shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-[20px] font-bold text-slate-900 tracking-tight">Create Conversion Asset</h2>
          <p className="text-[12px] text-slate-500 mt-1">Configure exactly how attention is converted, qualified, and routed into your system.</p>
        </div>
        <button className="text-slate-400 hover:text-slate-900" onClick={closeOverlay}><span className="material-symbols-outlined">close</span></button>
      </div>

      <div className="flex items-start gap-8">
        <div className="w-1/3 border-r border-slate-100 pr-8 space-y-4 pt-2 pb-4">
           {["1. Source & Identity", "2. Capture Method", "3. Nurture Routing", "4. Advanced Hand-off"].map((step, idx) => (
             <div key={step} className={`flex items-center gap-3 text-[12px] font-bold ${createAssetStep >= idx + 1 ? "text-slate-900" : "text-slate-400"}`}>
                <div className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] ${createAssetStep >= idx + 1 ? "bg-slate-900 text-white" : "bg-slate-100"}`}>{idx + 1}</div>
                {step.split(". ")[1]}
             </div>
           ))}
        </div>
        <div className="w-2/3 space-y-5">
           {createAssetStep === 1 && (
             <>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Asset Type</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-900">
                    {["Landing Page", "Lead Magnet", "Quiz", "Assessment", "Application", "Booking", "Offer", "VSL"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Asset Name</label>
                  <input type="text" placeholder="e.g. Founder Systems Checklist" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-900" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Primary Traffic Source</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-900">
                    {["Instagram", "LinkedIn", "YouTube", "Website Organic", "Paid Ads", "Direct"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
             </>
           )}
           {createAssetStep === 2 && (
             <>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">How is Identity Captured?</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-900">
                    {["Email Form", "DM Keyword (Social)", "Application Submitted", "Booking Completion", "Purchase", "None (Direct Access)"].map(t => <option key={t}>{t}</option>)}
                  </select>
                  <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">If 'None' is selected, visitors will remain tracked as ANONYMOUS entries until they identify elsewhere in the ecosystem.</p>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="w-4 h-4 rounded text-slate-900 border-slate-300 focus:ring-slate-900" />
                    <span className="text-[13px] font-bold text-slate-900">Attach Lead Magnet Delivery</span>
                  </label>
                </div>
             </>
           )}
           {createAssetStep > 2 && (
              <div className="py-12 text-center text-[13px] text-slate-500 font-medium italic">
                (Standard configuration wizard flow completes here linking the asset directly to sequence logic and CRM assignment.)
              </div>
           )}
           
           <div className="flex justify-end gap-3 pt-6">
             {createAssetStep > 1 && (
               <button onClick={() => setCreateAssetStep(c => c-1)} className="px-4 py-2 border border-slate-200 text-slate-600 text-[12px] font-bold rounded-lg hover:bg-slate-50">Back</button>
             )}
             {createAssetStep < 4 ? (
               <button onClick={() => setCreateAssetStep(c => c+1)} className="px-4 py-2 bg-blue-600 text-white text-[12px] font-bold rounded-lg hover:bg-blue-700">Continue</button>
             ) : (
               <button onClick={closeOverlay} className="px-4 py-2 bg-slate-900 text-white text-[12px] font-bold rounded-lg hover:bg-slate-800">Save Asset Configuration</button>
             )}
           </div>
        </div>
      </div>
    </div>
  );

  const renderLeadJourney = () => {
    const lead = MOCK_LEADS.find(l => l.id === selectedLead) || MOCK_LEADS[0];
    
    return (
      <div className="flex h-full min-h-[700px] border border-slate-200 bg-white rounded-2xl shadow-sm text-left">
         {/* Detail Panel */}
         <div className="w-[380px] flex-shrink-0 border-r border-slate-200 bg-slate-50 flex flex-col rounded-l-2xl">
            <div className="p-6 border-b border-slate-200 space-y-4">
               <button className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest" onClick={closeOverlay}>
                 <span className="material-symbols-outlined text-[14px]">arrow_back</span> Back to CRM
               </button>
               
               <div>
                  <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">{lead.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="material-symbols-outlined text-[14px] text-slate-400">mail</span>
                    <span className="text-[13px] text-slate-600 font-medium">{lead.email}</span>
                  </div>
                  {lead.phone && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="material-symbols-outlined text-[14px] text-slate-400">call</span>
                      <span className="text-[13px] text-slate-600 font-medium">{lead.phone}</span>
                    </div>
                  )}
                  {lead.social !== "-" && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="material-symbols-outlined text-[14px] text-slate-400">public</span>
                      <span className="text-[13px] text-slate-600 font-medium">{lead.social}</span>
                    </div>
                  )}
               </div>
               
               <div className="grid grid-cols-2 gap-3 pt-2">
                 <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                    <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Assigned Stage</span>
                    <select className="w-full text-[12px] font-extrabold bg-transparent outline-none truncate" style={{color: lead.stage === "QUALIFIED" ? "#059669" : lead.stage === "BOOKING_INTENT" ? "#d97706" : "#4f46e5"}}>
                      {["NEW","ENGAGED","IDENTIFIED","QUALIFIED","BOOKING_INTENT","BOOKED","OPPORTUNITY","CUSTOMER","NURTURE","LOST"].map(s => (
                        <option key={s} selected={s === lead.stage}>{s.replace("_", " ")}</option>
                      ))}
                    </select>
                 </div>
                 <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                    <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">ICP AI Status</span>
                    {lead.icpStatus === "YES" ? (
                       <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-600 uppercase"><span className="material-symbols-outlined text-[14px]">verified</span> QUALIFIED</div>
                    ) : (
                       <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-600 uppercase"><span className="material-symbols-outlined text-[14px]">error</span> REVIEW</div>
                    )}
                 </div>
               </div>
            </div>

            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
               <div className="space-y-3">
                  <h3 className="text-[11px] font-extrabold text-slate-900 uppercase tracking-widest flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-slate-400">timeline</span> First Touch Origin</h3>
                  <div className="space-y-2 text-[12px]">
                     <div className="flex justify-between"><span className="text-slate-500 font-semibold">Asset</span> <span className="font-bold text-slate-900 text-right truncate w-40">{lead.asset}</span></div>
                     <div className="flex justify-between"><span className="text-slate-500 font-semibold">Source</span> <span className="font-bold text-slate-900">{lead.source}</span></div>
                     {lead.keyword !== "-" && <div className="flex justify-between"><span className="text-slate-500 font-semibold">Keyword</span> <span className="font-bold font-mono text-blue-600 bg-blue-50 px-1 rounded">{lead.keyword}</span></div>}
                     <div className="flex justify-between"><span className="text-slate-500 font-semibold">Campaign</span> <span className="font-bold text-slate-900">Founder OS Launch</span></div>
                  </div>
               </div>
               
               <div className="h-px bg-slate-200"></div>

               <div className="space-y-3">
                  <h3 className="text-[11px] font-extrabold text-slate-900 uppercase tracking-widest flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-slate-400">mail</span> Active Sequences</h3>
                  {lead.sequence !== "-" ? (
                    <div className="p-3 border border-slate-200 rounded-xl bg-white border-l-4 border-l-blue-600 shadow-sm">
                       <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Enrolled Pipeline</span>
                       <span className="text-[13px] font-bold text-slate-900">{lead.sequence}</span>
                       <div className="flex bg-slate-100 rounded-full h-1 mt-3 overflow-hidden">
                         <div className="bg-blue-600 h-full w-3/4"></div>
                       </div>
                       <div className="flex justify-between text-[9px] font-bold text-slate-400 mt-1 uppercase"><span>Sent Email 4</span> <span>2 days left</span></div>
                    </div>
                  ) : <p className="text-[12px] text-slate-500 italic">No automated nurture sequences are currently acting on this lead.</p>}
               </div>
            </div>
         </div>

         {/* Timeline */}
         <div className="flex-1 bg-white flex flex-col rounded-r-2xl">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <h3 className="text-[14px] font-extrabold text-slate-900 uppercase tracking-widest">Chronological Journey</h3>
              <div className="flex gap-2">
                {lead.stage === "QUALIFIED" && (
                  <button className="px-4 py-2 bg-violet-600 text-white text-[11px] font-bold rounded-lg hover:bg-violet-700 shadow-sm flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">send</span> Push to Outbound
                  </button>
                )}
                {lead.stage === "BOOKING_INTENT" && (
                  <button className="px-4 py-2 bg-orange-600 text-white text-[11px] font-bold rounded-lg hover:bg-orange-700 shadow-sm flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">monetization_on</span> Convert to Deal
                  </button>
                )}
                <button className="px-3 py-1.5 border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg hover:bg-slate-50">Log Note</button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 relative">
               <div className="absolute left-10 top-0 bottom-0 w-px bg-slate-200 z-0"></div>
               
               <div className="relative z-10 space-y-8">
                 {[
                   { type: "AI", title: "ICP Qualification Processed", desc: "Lead automatically flagged as 'QUALIFIED' based on matched job role.", time: "2 hrs ago" },
                   { type: "EMAIL_OPEN", title: "Sequence Email Opened", desc: "Opened 'Email #4: Ready for the custom build?' (Read time: 24s)", time: "6 hrs ago" },
                   { type: "EMAIL_OPEN", title: "Sequence Email Opened", desc: "Opened 'Email #3: System Proof'", time: "1 day ago" },
                   { type: "ASSET", title: "Conversion Asset Interaction", desc: "Downloaded the 'Business Systems Guide'. Email was captured successfully.", time: "3 days ago" },
                   { type: "LINK", title: "Anonymous Identity Created", desc: "User clicked link via Instagram comment DM.", time: "3 days ago" },
                   { type: "COMMENT", title: "Anonymous Interaction", desc: `Commented: "${lead.keyword}" on Instagram Reel. Automated DM dispatched.`, time: "3 days ago" },
                 ].map((ev, i) => (
                   <div key={i} className="flex gap-6 relative">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-slate-200 flex-shrink-0 z-10 shadow-sm mt-0.5">
                         {ev.type === "AI" && <span className="material-symbols-outlined text-emerald-500 text-[16px]">psychology</span>}
                         {ev.type.includes("EMAIL") && <span className="material-symbols-outlined text-blue-500 text-[16px]">drafts</span>}
                         {ev.type === "ASSET" && <span className="material-symbols-outlined text-orange-500 text-[16px]">file_download</span>}
                         {ev.type === "LINK" && <span className="material-symbols-outlined text-slate-400 text-[16px]">link</span>}
                         {ev.type === "COMMENT" && <span className="material-symbols-outlined text-slate-400 text-[16px]">chat_bubble</span>}
                      </div>
                      <div className="flex-1 bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:border-slate-300 transition-colors">
                         <div className="flex justify-between items-start mb-1.5">
                           <h4 className="text-[13px] font-bold text-slate-900">{ev.title}</h4>
                           <span className="text-[10px] font-bold text-slate-400">{ev.time}</span>
                         </div>
                         <p className="text-[12px] text-slate-600 leading-relaxed font-medium">{ev.desc}</p>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
         </div>
      </div>
    );
  };

  const renderSequenceBuilder = () => (
    <div className="bg-white border text-left border-slate-200 rounded-2xl shadow-sm overflow-hidden h-[700px] flex flex-col">
      <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
        <div>
          <button className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest mb-2" onClick={closeOverlay}>
            <span className="material-symbols-outlined text-[14px]">arrow_back</span> Back to Sequences
          </button>
          <h2 className="text-[20px] font-bold text-slate-900">Inbound OS Blueprint</h2>
          <div className="flex items-center gap-4 mt-2">
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded uppercase">ACTIVE</span>
            <span className="text-[12px] text-slate-500 font-medium flex items-center gap-2">
              <strong>Trigger:</strong> Capture via <span className="font-mono text-blue-600 bg-blue-50 px-1 rounded font-bold">SYSTEM</span> DM Keyword
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 border border-slate-200 bg-white text-slate-700 text-[12px] font-bold rounded-lg hover:bg-slate-50">Exit Rules Logic</button>
          <button className="px-4 py-1.5 bg-slate-900 text-white text-[12px] font-bold rounded-lg hover:bg-slate-800">Save Sequence</button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Email Steps list */}
        <div className="w-[340px] border-r border-slate-100 bg-slate-50 p-4 space-y-3 overflow-y-auto">
          {[
            { id: 1, delay: "Triggered immediately", subject: "Here is your OS Blueprint..." },
            { id: 2, delay: "Delay: 2 days", subject: "The #1 mistake agencies make..." },
            { id: 3, delay: "Delay: 2 days", subject: "How we fixed acquisition (Proof)" },
            { id: 4, delay: "Exit Condition", subject: "Booking Logic Applies", special: true },
          ].map((step, idx) => (
            step.special ? (
              <div key={step.id} className="p-3 border-2 border-dashed border-emerald-200 bg-emerald-50 rounded-xl text-emerald-800 text-[11px] font-bold flex items-center gap-2">
                 <span className="material-symbols-outlined text-[16px]">fork_right</span> Lead Exits Sequence on: Booked
              </div>
            ) : (
              <div key={step.id} className={`p-4 border rounded-xl cursor-pointer transition-colors ${idx === 0 ? "border-blue-600 bg-blue-50/50 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="text-[9px] font-extrabold text-blue-600 uppercase tracking-widest">Email {step.id} • {step.delay}</div>
                  <span className="material-symbols-outlined text-slate-300 text-[14px]">more_horiz</span>
                </div>
                <div className="text-[13px] font-bold text-slate-900 line-clamp-1">{step.subject}</div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2 font-medium">
                  <span>Open: 64%</span>
                  <span>Click: 12%</span>
                </div>
              </div>
            )
          ))}
          <button className="w-full py-4 border-2 border-dashed border-slate-200 bg-white rounded-xl text-[12px] font-bold text-slate-500 hover:border-slate-300 flex items-center justify-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">add</span> Add Email Step
          </button>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="border-b border-slate-200 p-5 space-y-4 bg-white relative">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Subject Line</label>
                <input type="text" defaultValue="Here is your OS Blueprint..." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] font-bold text-slate-900 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Preview Text</label>
                <input type="text" defaultValue="Attached as requested. Plus a breakdown." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-700 bg-white focus:outline-none focus:border-blue-500" />
              </div>
            </div>
          </div>
          
          <div className="p-2 border-b border-slate-200 bg-slate-50/80 flex justify-between items-center px-4">
             <div className="flex items-center gap-2 text-slate-500">
               <button className="p-1 hover:bg-slate-200 rounded text-slate-600 font-bold">B</button>
               <button className="p-1 hover:bg-slate-200 rounded text-slate-600 italic">I</button>
               <button className="p-1 hover:bg-slate-200 rounded text-slate-600 underline">U</button>
               <div className="w-px h-5 bg-slate-300 mx-2"></div>
               <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Variables:</span>
               <button className="px-2 py-0.5 hover:bg-white border border-transparent hover:border-slate-200 rounded shadow-sm text-slate-600 text-[11px] font-bold font-mono">{`{{first_name}}`}</button>
               <button className="px-2 py-0.5 hover:bg-white border border-transparent hover:border-slate-200 rounded shadow-sm text-slate-600 text-[11px] font-bold font-mono">{`{{asset_link}}`}</button>
             </div>
             <button className="text-[11px] font-bold text-violet-600 bg-violet-50 border border-violet-100 uppercase px-2 py-1 flex items-center gap-1 rounded hover:bg-violet-100">
               <span className="material-symbols-outlined text-[14px]">auto_awesome</span> Optimize Draft
             </button>
          </div>

          <textarea 
            className="flex-1 w-full p-8 text-[14px] font-medium text-slate-800 leading-relaxed resize-none focus:outline-none font-sans"
            defaultValue={"Hey {{first_name}},\n\nAs requested, here is the complete Acquisition OS Blueprint diagram.\n\n{{asset_link}}\n\nMost founders look at this and immediately realize they've been doing outbound wrong. The strategy here hinges entirely on positioning your intent accurately prior to sending a single message.\n\nReview this today, and tomorrow I'll walk you through exactly where you've been losing attention..."}
          />
        </div>
      </div>
    </div>
  );


  // --- MAIN RENDER ---
  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto min-h-screen relative">
      
      {overlay !== "NONE" && (
         <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-sm z-40 flex items-center justify-center p-8">
            <div className="w-full h-full max-h-[850px]" style={{maxWidth: overlay==="CREATE_ASSET"?"900px":"1200px"}}>
               {overlay === "CREATE_ASSET" && renderCreateAsset()}
               {overlay === "SEQUENCE_BUILDER" && renderSequenceBuilder()}
               {overlay === "LEAD_JOURNEY" && renderLeadJourney()}
               {overlay === "CREATE_SEQUENCE" && renderSequenceBuilder()}
            </div>
         </div>
      )}

      {/* HEADER IS ALWAYS VISIBLE */}
      <div className={`space-y-8 pb-12 transition-all ${overlay !== "NONE" ? "opacity-30 blur-sm pointer-events-none" : ""}`}>
        <div>
          <p className="text-[11px] font-extrabold text-blue-600 uppercase tracking-widest">ASENZO ACQUISITION SYSTEM</p>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight mt-1">Lead Capture & Nurture</h1>
          <p className="text-[14px] text-slate-500 mt-1 max-w-2xl font-medium leading-relaxed">The unified engine converting audience attention into identified leads, nurturing them toward qualification, and handing them off for outbound outreach or direct booking.</p>
        </div>

        {/* PRIMARY NAVIGATION TABS */}
        <div className="flex border-b border-slate-200">
           <button 
             onClick={() => setActiveTab("CAPTURE")}
             className={`pb-3 px-6 text-[12px] font-bold uppercase tracking-widest border-b-2 relative top-px transition-colors ${activeTab === "CAPTURE" ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400 hover:text-slate-600"}`}
           >
             Capture & Conversion
           </button>
           <button 
             onClick={() => setActiveTab("EMAIL")}
             className={`pb-3 px-6 text-[12px] font-bold uppercase tracking-widest border-b-2 relative top-px transition-colors ${activeTab === "EMAIL" ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400 hover:text-slate-600"}`}
           >
             Email Nurture
           </button>
           <button 
             onClick={() => setActiveTab("CRM")}
             className={`pb-3 px-6 text-[12px] font-bold uppercase tracking-widest border-b-2 relative top-px transition-colors ${activeTab === "CRM" ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400 hover:text-slate-600"}`}
           >
             Lead CRM
           </button>
        </div>

        {/* ACTIVE SECTION */}
        <div className="pt-2">
           {activeTab === "CAPTURE" && renderCaptureTab()}
           {activeTab === "EMAIL" && renderEmailTab()}
           {activeTab === "CRM" && renderLeadCRM()}
        </div>

        {renderKPIs()}
      </div>
    </div>
  );
}
