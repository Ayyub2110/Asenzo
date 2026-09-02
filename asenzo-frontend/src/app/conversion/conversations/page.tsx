"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Lead } from "@/lib/types/conversion";

export default function ConversationsInbox() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/conversion/leads")
      .then(r => r.json())
      .then(data => {
        setLeads(data || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Unified Inbox</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Manage all active dialogues crossing the intent threshold.</p>
        </div>
        <div className="flex gap-2">
           <Link href="/conversion/conversations/dms" className="px-4 py-2 bg-slate-100 font-bold text-[11px] rounded-lg">DM Inbound</Link>
           <Link href="/conversion/conversations/sales" className="px-4 py-2 bg-slate-100 font-bold text-[11px] rounded-lg">Sales Threads</Link>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex-1 overflow-hidden flex">
         {/* Sidebar thread list */}
         <div className="w-[320px] border-r border-slate-200 flex flex-col bg-slate-50/50">
            <div className="p-4 border-b border-slate-200 bg-white">
               <input type="text" placeholder="Search conversations..." className="w-full px-3 py-1.5 text-[12px] border border-slate-200 rounded-lg outline-none focus:border-slate-400 transition-colors" />
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
               {isLoading ? (
                  <div className="p-4 text-center text-[12px] text-slate-500">Loading...</div>
               ) : leads.map(lead => (
                  <div key={lead.id} className="p-4 bg-white cursor-pointer hover:bg-slate-50 transition-colors">
                     <div className="flex justify-between items-start mb-1">
                        <span className="text-[13px] font-bold text-slate-900">{lead.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium">10m ago</span>
                     </div>
                     <p className="text-[11px] text-slate-500 truncate mt-1">Has there been any update on the...</p>
                     <div className="mt-2 flex gap-1">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 font-semibold text-[9px] rounded uppercase">{lead.acquisitionChannel || "Direct"}</span>
                     </div>
                  </div>
               ))}
               {leads.length === 0 && !isLoading && (
                  <div className="p-8 text-center text-[12px] text-slate-400">No active threads.</div>
               )}
            </div>
         </div>
         {/* Main chat window */}
         <div className="flex-1 flex flex-col bg-white">
            <div className="flex-1 flex items-center justify-center text-slate-400 text-[12px]">
               Select a conversation to load the operational thread.
            </div>
         </div>
      </div>
    </div>
  );
}
