"use client";

import React from "react";
import Link from "next/link";
import { getConversion } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function ConversationsPage() {
  const { localData, loading, error } = useAdapter(getConversion);

  if (loading) {
     return <div className="p-10 animate-pulse h-96 w-full max-w-[1200px] mx-auto bg-muted/20 rounded-[16px]" />;
  }

  if (error || !localData) {
     return <div className="p-10">Error loading Conversations.</div>;
  }

  const { conversations } = localData;

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-[18px] font-bold text-foreground mb-1">Conversations</h1>
          <p className="text-[14px] text-muted-foreground">Global view of all active lead conversations.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-[16px] overflow-hidden">
        <div className="flex items-center gap-2 p-4 border-b border-border bg-card">
           <input type="text" placeholder="Search conversations..." className="bg-background border border-border text-foreground text-[13px] px-3 py-1.5 rounded-[6px] w-[250px]" />
           <select className="bg-background border border-border text-foreground text-[13px] px-3 py-1.5 rounded-[6px]">
              <option>All Statuses</option>
              <option>ACTIVE</option>
              <option>WAITING</option>
           </select>
        </div>
        <table className="w-full text-left">
          <thead className="bg-secondary/50">
            <tr>
              <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Contact</th>
              <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Company</th>
              <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
              <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest hidden md:table-cell">Next Action</th>
              <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {conversations.length === 0 ? (
               <tr>
                 <td colSpan={5} className="p-10 text-center">
                    <p className="text-[13px] text-muted-foreground font-medium italic">No active conversations found.</p>
                 </td>
               </tr>
            ) : conversations.map(c => (
              <tr key={c.id} className="border-t border-border hover:bg-secondary/30 transition-colors">
                 <td className="p-4">
                   <p className="text-[14px] font-bold text-foreground">{c.contact}</p>
                   <p className="text-[11px] text-muted-foreground bg-background border border-border w-fit px-1.5 rounded mt-1">{c.source}</p>
                 </td>
                 <td className="p-4 text-[13px] font-medium text-foreground">{c.company}</td>
                 <td className="p-4">
                   <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-background border border-border text-foreground">{c.status as string}</span>
                 </td>
                 <td className="p-4 hidden md:table-cell">
                   <p className="text-[13px] text-foreground">{c.nextAction}</p>
                 </td>
                 <td className="p-4 text-right">
                   <button className="bg-foreground text-background text-[12px] font-bold px-4 py-1.5 rounded-[6px] hover:opacity-90">Open</button>
                 </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
