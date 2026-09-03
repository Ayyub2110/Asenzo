"use client";

import React from "react";
import { Lead } from "@/lib/types/conversion";
import Link from "next/link";
import { useConversionOS } from "@/contexts/ConversionOSContext";

export default function SalesConversationsWorkspace() {
  const { leads: allLeads } = useConversionOS();
  const leads = allLeads.filter((l: Lead) => l.qualificationStatus === "QUALIFIED");

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto space-y-6 flex flex-col h-full">
      <div className="flex items-center gap-3">
        <Link href="/conversion/conversations" className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 material-symbols-outlined text-[16px] text-slate-500">arrow_back</Link>
        <div>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Sales Conversations</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">High-intent dialogues moving qualified leads towards decisions.</p>
        </div>
      </div>

       <div className="bg-white flex-1 border border-slate-200 shadow-sm rounded-xl overflow-hidden flex">
          {/* List */}
          <div className="w-[300px] border-r border-slate-200 bg-slate-50/50">
             {leads.length === 0 ? (
               <div className="p-8 text-center text-[12px] text-slate-400">
                  No active qualified sales conversations.
               </div>
             ) : leads.map(l => (
               <div key={l.id} className="p-4 bg-white border-b border-slate-100 hover:bg-slate-50 cursor-pointer">
                  <div className="flex items-center gap-2 justify-between mb-1">
                     <span className="text-[12px] font-bold text-slate-900">{l.name}</span>
                     <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">£15k Value</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-1">Reviewing the proposal internally right now...</p>
                  <div className="mt-2 flex gap-1">
                     <span className="px-2 py-0.5 bg-purple-50 text-purple-600 font-semibold text-[9px] rounded uppercase">DECISION STAGE</span>
                  </div>
               </div>
             ))}
          </div>

          {/* Context AI window */}
          <div className="flex-1 bg-white p-8 flex flex-col justify-center items-center">
             <div className="w-full max-w-[600px] text-center space-y-4">
                <span className="material-symbols-outlined text-[48px] text-emerald-100">psychology</span>
                <h3 className="text-[14px] font-bold text-slate-700">Sales Intelligence Unlocked</h3>
                <p className="text-[12px] text-slate-500 leading-relaxed">
                   When you open a Sales Conversation here, the system actively reads your Opportunity timeline to verify objections and provide draft replies designed specifically to counter known risks, ensuring you never drop the ball on high-value deals.
                </p>
                <div className="flex justify-center pt-2">
                   <Link href="/conversion/pipeline" className="px-5 py-2 bg-slate-900 text-white font-bold text-[11px] rounded-lg shadow hover:bg-slate-800 transition-colors">
                     View Pipeline View
                   </Link>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
