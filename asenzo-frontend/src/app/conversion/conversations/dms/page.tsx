"use client";

import React, { useEffect, useState } from "react";
import { Lead } from "@/lib/types/conversion";
import Link from "next/link";

export default function DMsWorkspace() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/conversion/leads")
      .then(r => r.json())
      .then(data => {
        setLeads(data.filter((l: Lead) => l.source === "Direct Message") || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto space-y-6 flex flex-col h-full">
      <div className="flex items-center gap-3">
        <Link href="/conversion/conversations" className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 material-symbols-outlined text-[16px] text-slate-500">arrow_back</Link>
        <div>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Direct Messages</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Identify intent from high-friction social channels to pull into pipeline.</p>
        </div>
      </div>

       <div className="bg-white flex-1 border border-slate-200 shadow-sm rounded-xl overflow-hidden flex">
          {/* List */}
          <div className="w-[300px] border-r border-slate-200 bg-slate-50/50">
             {isLoading ? (
               <div className="p-8 text-center text-slate-400 text-[12px]">Loading DM Threads...</div>
             ) : leads.length === 0 ? (
               <div className="p-8 text-center text-[12px] text-slate-400">
                  No active DMs linked to conversion OS right now.
               </div>
             ) : leads.map(l => (
               <div key={l.id} className="p-4 bg-white border-b border-slate-100 hover:bg-slate-50 cursor-pointer">
                  <div className="flex items-center gap-2 mb-1 justify-between">
                     <span className="text-[12px] font-bold text-slate-900">{l.name}</span>
                     <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 font-bold text-[9px] uppercase rounded">Linked In</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">Wait, could you clarify the limit?</p>
               </div>
             ))}
          </div>

          {/* Context AI window */}
          <div className="flex-1 bg-white p-8 flex flex-col justify-center items-center">
             <div className="w-full max-w-[500px] text-center space-y-4">
                <span className="material-symbols-outlined text-[48px] text-slate-200">forum</span>
                <h3 className="text-[14px] font-bold text-slate-700">Connecting Social Platforms</h3>
                <p className="text-[12px] text-slate-500">
                   ASENZO currently processes DMs manually via the backend integration layer. No active webhooks have fired in this session. When n8n routes new messages here, the AI Conversation Agent will automatically draft context-aware replies matching your ICP rules.
                </p>
             </div>
          </div>
       </div>
    </div>
  );
}
