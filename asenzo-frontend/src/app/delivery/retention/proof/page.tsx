"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useDeliveryOS } from "@/contexts/DeliveryOSContext";

export default function ProofAssetsPage() {
  const { clients } = useDeliveryOS();
  const [activeAsset, setActiveAsset] = useState<string | null>(null);

  const proofAssets = [
    { id: "p1", type: "CASE_STUDY", client: "Elevate Media", title: "Adding $40k MRR in 60 Days", date: "Oct 12, 2026", metric: "+$40k MRR", category: "Revenue", status: "APPROVED" },
    { id: "p2", type: "ROI_CALC", client: "Quantum Tech", title: "Infrastructure Cost Reduction", date: "Sep 28, 2026", metric: "-22% Churn", category: "Retention", status: "DRAFT" },
    { id: "p3", type: "TESTIMONIAL", client: "Stark Ind.", title: "CEO Video Testimonial", date: "Aug 15, 2026", metric: "3x ROI", category: "Sales Fit", status: "APPROVED" }
  ];

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Proof Asset Library
          </h1>
          <p className="text-[12px] text-slate-500 mt-0.5">
            Verified outcomes, testimonials, and case studies ready for Acquisition.
          </p>
        </div>
        <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-[12px] font-bold hover:bg-slate-800 transition-colors flex items-center gap-1.5">
           <span className="material-symbols-outlined text-[16px]">add</span>
           Log Outcome
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
         {proofAssets.map(asset => (
            <div key={asset.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col group">
               <div className="h-32 bg-slate-50 border-b border-slate-100 flex items-center justify-center relative overflow-hidden group-hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => setActiveAsset(asset.id)}>
                  <span className="material-symbols-outlined text-[40px] text-slate-300 group-hover:scale-110 transition-transform duration-500">
                     {asset.type === "CASE_STUDY" ? "monitoring" : asset.type === "VIDEO" ? "play_circle" : "description"}
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/5">
                     <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-sm text-[11px] font-bold text-slate-700 uppercase tracking-widest">Open Asset</span>
                  </div>
               </div>
               <div className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                     <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${asset.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{asset.status}</span>
                     <span className="text-[10px] font-medium text-slate-400">{asset.date}</span>
                  </div>
                  <h3 className="text-[14px] font-bold text-slate-900 mb-1 leading-tight">{asset.title}</h3>
                  <p className="text-[11px] font-medium text-slate-500 mb-4">{asset.client}</p>
                  
                  <div className="mt-auto flex justify-between items-center pt-3 border-t border-slate-100">
                     <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Validated Metric</p>
                        <p className="text-[14px] font-bold text-emerald-600">{asset.metric}</p>
                     </div>
                     <button className="h-8 w-8 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 transition-colors">
                        <span className="material-symbols-outlined text-[16px]">share</span>
                     </button>
                  </div>
               </div>
            </div>
         ))}
      </div>

      {activeAsset && (
         <div className="fixed inset-0 z-50 flex justify-center items-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-[800px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
               <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
                  <div className="flex justify-center items-center gap-2">
                     <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-[9px] font-bold uppercase tracking-widest">ASSET PREVIEW</span>
                     <span className="text-[12px] font-bold text-slate-700">{proofAssets.find(a => a.id === activeAsset)?.title}</span>
                  </div>
                  <button onClick={() => setActiveAsset(null)} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
                     <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
               </div>
               <div className="flex-1 bg-slate-100 p-8 overflow-y-auto flex items-center justify-center">
                  <div className="aspect-[4/3] w-full max-w-[600px] bg-white shadow-md border border-slate-200 rounded p-12 text-center flex flex-col justify-center items-center">
                     <h2 className="text-[32px] font-black text-slate-900 leading-tight mb-4">{proofAssets.find(a => a.id === activeAsset)?.title}</h2>
                     <p className="text-[16px] text-slate-500 mb-8 max-w-sm">"The system integrated seamlessly, eliminating our primary bottleneck."</p>
                     <div className="text-[48px] font-black text-emerald-600">{proofAssets.find(a => a.id === activeAsset)?.metric}</div>
                     <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mt-2">{proofAssets.find(a => a.id === activeAsset)?.client}</p>
                  </div>
               </div>
               <div className="p-4 border-t border-slate-200 bg-white flex justify-end gap-2 shrink-0">
                  <button className="px-4 py-2 border border-slate-200 text-slate-600 rounded text-[11px] font-bold tracking-widest uppercase hover:bg-slate-50 transition-colors">
                     Edit Asset
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded text-[11px] font-bold tracking-widest uppercase hover:bg-blue-700 transition-colors">
                     Export to Acquisition OS
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
