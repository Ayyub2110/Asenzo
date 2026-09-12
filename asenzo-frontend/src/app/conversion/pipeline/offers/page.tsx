"use client";

import React, { useState } from "react";
import Link from "next/link";
import { OfferRecord } from "@/contexts/ConversionOSContext";
import { useConversionOS } from "@/contexts/ConversionOSContext";

export default function OffersWorkspace() {
  const { opportunities, leads, offers, createOffer, updateOffer, updateOpportunity } = useConversionOS();

  const [isCreating, setIsCreating] = useState(false);
  const [newOffer, setNewOffer] = useState<Partial<OfferRecord>>({
     offerName: "",
     status: "DRAFT",
     value: 0,
     opportunityId: "",
     notes: ""
  });

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOffer.opportunityId || !newOffer.offerName) return;
    
    createOffer({
       offerName: newOffer.offerName,
       opportunityId: newOffer.opportunityId,
       value: Number(newOffer.value) || 0,
       status: "DRAFT",
       notes: newOffer.notes
    });
    
    setIsCreating(false);
    setNewOffer({ offerName: "", status: "DRAFT", value: 0, opportunityId: "", notes: "" });
  };

  const handleSendOffer = (offer: OfferRecord) => {
     updateOffer(offer.id, { status: "SENT", sentDate: new Date().toISOString() });
     updateOpportunity(offer.opportunityId, { pipelineStage: "OFFER_SENT" });
  };

  const handleAcceptOffer = (offer: OfferRecord) => {
     updateOffer(offer.id, { status: "ACCEPTED" });
     updateOpportunity(offer.opportunityId, { pipelineStage: "CLOSED_WON", closedAt: new Date().toLocaleDateString() });
  };

  const handleDeclineOffer = (offer: OfferRecord) => {
     updateOffer(offer.id, { status: "DECLINED" });
     updateOpportunity(offer.opportunityId, { pipelineStage: "CLOSED_LOST", closedAt: new Date().toLocaleDateString(), lostReason: "Offer Declined" });
  };

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Offers Workspace</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Manage live commercial agreements that have been extended to prospects.</p>
        </div>
        <button onClick={() => setIsCreating(true)} className="px-4 py-2 bg-slate-900 text-white font-bold text-[12px] rounded-lg shadow-sm hover:bg-slate-800 transition">
           [Create Offer]
        </button>
      </div>

      {isCreating && (
         <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden">
               <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-[16px] font-bold text-slate-900">Create New Offer</h2>
                  <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-600">
                     <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
               </div>
               <form onSubmit={handleCreateOffer} className="p-6 space-y-4">
                  <div>
                     <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Select Opportunity</label>
                     <select required value={newOffer.opportunityId} onChange={e => setNewOffer({...newOffer, opportunityId: e.target.value})} className="w-full border border-slate-200 rounded p-2 text-[13px] bg-slate-50 focus:bg-white text-slate-900">
                        <option value="">-- Choose Opportunity --</option>
                        {opportunities.filter(o => o.pipelineStage !== "CLOSED_WON" && o.pipelineStage !== "CLOSED_LOST").map(opp => {
                           const l = leads.find(l => l.id === opp.leadId);
                           return <option key={opp.id} value={opp.id}>{l?.name || opp.leadId} — £{opp.estimatedValue}</option>;
                        })}
                     </select>
                  </div>
                  <div>
                     <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Offer Name</label>
                     <input required type="text" placeholder="e.g. Growth Partner Package" value={newOffer.offerName} onChange={e => setNewOffer({...newOffer, offerName: e.target.value})} className="w-full border border-slate-200 rounded p-2 text-[13px]" />
                  </div>
                  <div>
                     <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Price (£)</label>
                     <input required type="number" min="0" value={newOffer.value || ""} onChange={e => setNewOffer({...newOffer, value: Number(e.target.value)})} className="w-full border border-slate-200 rounded p-2 text-[13px]" />
                  </div>
                  <div>
                     <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Notes / Terms</label>
                     <textarea rows={3} placeholder="Optional payment terms or deliverables..." value={newOffer.notes} onChange={e => setNewOffer({...newOffer, notes: e.target.value})} className="w-full border border-slate-200 rounded p-2 text-[13px]" />
                  </div>
                  <div className="flex items-center gap-2 pt-4">
                     <button type="submit" className="flex-1 py-2 bg-slate-900 text-white font-bold text-[13px] rounded hover:bg-slate-800">Save Draft</button>
                  </div>
               </form>
            </div>
         </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-4">
           {offers.length === 0 ? (
             <div className="bg-white border text-center p-12 border-slate-200 rounded-xl shadow-sm">
               <span className="material-symbols-outlined text-[32px] text-slate-300 mb-2">description</span>
               <h3 className="text-[14px] font-bold text-slate-700">No active offers.</h3>
               <p className="text-[12px] text-slate-500 mt-1">Create an offer to begin the commercial negotiation phase.</p>
             </div>
           ) : (
             <div className="space-y-4">
               {offers.map(offer => {
                 const opp = opportunities.find(o => o.id === offer.opportunityId);
                 const lead = opp ? leads.find(l => l.id === opp.leadId) : null;
                 
                 const isDraft = offer.status === "DRAFT";
                 const isSent = offer.status === "SENT";
                 const isViewed = offer.status === "VIEWED";
                 const isAccepted = offer.status === "ACCEPTED";
                 const isDeclined = offer.status === "DECLINED";

                 return (
                 <div key={offer.id} className={`bg-white border rounded-xl p-5 flex flex-col gap-4 shadow-sm transition ${isAccepted ? 'border-emerald-200 bg-emerald-50/30' : isDeclined ? 'border-red-200 opacity-75' : 'border-slate-200 hover:border-slate-300'}`}>
                    <div className="flex items-start justify-between">
                       <div>
                         <h3 className="text-[16px] font-black tracking-tight text-slate-900 mb-1">{offer.offerName}</h3>
                         <div className="flex gap-4">
                           <p className="text-[12px] text-slate-600 font-medium">{lead?.name || "Unknown"} <span className="text-slate-400 capitalize">{lead?.company ? `— ${lead.company}` : ''}</span></p>
                           <p className="text-[12px] text-slate-600 font-medium">£{(offer.value || 0).toLocaleString()}</p>
                         </div>
                       </div>
                       <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded ${
                          isDraft ? "bg-slate-100 text-slate-600" :
                          (isSent || isViewed) ? "bg-blue-100 text-blue-700" :
                          isAccepted ? "bg-emerald-100 text-emerald-800" :
                          "bg-red-100 text-red-800"
                       }`}>
                          {offer.status}
                       </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-[11px] p-3 bg-slate-50 rounded border border-slate-100">
                       <div>
                          <span className="block text-slate-400 uppercase tracking-widest font-bold mb-0.5">Sent Date</span>
                          <span className="font-medium text-slate-900">{offer.sentDate ? new Date(offer.sentDate).toLocaleDateString() : "Not sent yet"}</span>
                       </div>
                       <div>
                          <span className="block text-slate-400 uppercase tracking-widest font-bold mb-0.5">Opportunity Stage</span>
                          <span className="font-medium text-slate-900">{opp?.pipelineStage.replace('_', ' ') || "Unknown"}</span>
                       </div>
                       {offer.notes && (
                          <div className="col-span-2 mt-1">
                             <span className="block text-slate-400 uppercase tracking-widest font-bold mb-0.5">Notes</span>
                             <span className="font-medium text-slate-700">{offer.notes}</span>
                          </div>
                       )}
                    </div>
                    
                    <div className="flex items-center gap-2 pt-2">
                       {isDraft && (
                          <>
                             <button className="px-3 py-1.5 text-[11px] font-bold border border-slate-200 text-slate-600 rounded bg-white hover:bg-slate-50">Edit</button>
                             <button onClick={() => handleSendOffer(offer)} className="px-3 py-1.5 text-[11px] font-bold border border-slate-900 text-white rounded bg-slate-900 hover:bg-slate-800">Send</button>
                          </>
                       )}
                       {(isSent || isViewed) && (
                          <>
                             <button onClick={() => handleAcceptOffer(offer)} className="px-3 py-1.5 text-[11px] font-bold border border-emerald-600 text-white rounded bg-emerald-600 hover:bg-emerald-700">Mark Accepted</button>
                             <button onClick={() => handleDeclineOffer(offer)} className="px-3 py-1.5 text-[11px] font-bold border border-red-200 text-red-700 rounded bg-red-50 hover:bg-red-100">Mark Declined</button>
                          </>
                       )}
                       {(isAccepted || isDeclined) && (
                          <Link href="/conversion/pipeline" className="px-3 py-1.5 text-[11px] font-bold border border-slate-200 text-slate-600 rounded bg-white hover:bg-slate-50">View Opportunity</Link>
                       )}
                    </div>
                 </div>
               )})}
             </div>
           )}
        </div>
        
        <div className="col-span-4 space-y-4">
           <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Pending Revenue</h3>
              <div className="text-[28px] font-bold text-slate-900 leading-none">
                 £{offers.filter(o => o.status === "SENT" || o.status === "VIEWED").reduce((acc, curr) => acc + (curr.value || 0), 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-500 mt-2">Value of proposals currently awaiting a decision.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
