"use client";

import React from "react";
import Link from "next/link";
import { useDeliveryOS } from "@/contexts/DeliveryOSContext";

export default function DeliveryCommandCenter() {
  const { metrics, clients, engagements, onboardings, milestones } = useDeliveryOS();

  // Summary Cards Data
  const activeOnboardings = onboardings.filter(o => o.status !== "COMPLETED");
  const activeClients = clients.filter(c => c.status === "ACTIVE");
  const atRiskClients = clients.filter(c => c.status === "AT_RISK");
  
  const now = new Date();
  const overdueMilestones = milestones.filter(m => m.status !== "COMPLETED" && new Date(m.dueDate) < now);

  // Today / Needs Attention Data (mocked based on context logic)
  const needsAttention = [
    ...atRiskClients.map(c => ({
       id: `risk-${c.id}`,
       type: "Client at risk",
       desc: c.company,
       action: "View Client",
       link: "/delivery/clients"
    })),
    ...overdueMilestones.map(m => {
       const eng = engagements.find(e => e.id === m.engagementId);
       const client = clients.find(c => c.id === eng?.clientId);
       return {
          id: `milestone-${m.id}`,
          type: "Milestone overdue",
          desc: `${client?.name || "Unknown"} — ${m.name}`,
          action: "Update Milestone",
          link: "/delivery/engagements"
       };
    })
  ].slice(0, 5);

  return (
    <div className="pt-8 pb-32 space-y-10 animate-in fade-in duration-300 px-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-black text-slate-900 tracking-tight flex items-center gap-2">
            Delivery Command Center
          </h1>
          <p className="text-[14px] text-slate-500 font-medium max-w-2xl mt-1">
            Immediate view of what needs attention across onboarding and active delivery.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Link href="/delivery/onboarding" className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-all group block">
            <h3 className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-1 group-hover:text-slate-700 transition">Onboarding</h3>
            <p className="text-[28px] font-black text-slate-900">{activeOnboardings.length}</p>
        </Link>
        <Link href="/delivery/clients" className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-all group block">
            <h3 className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-1 group-hover:text-slate-700 transition">Active Clients</h3>
            <p className="text-[28px] font-black text-slate-900">{activeClients.length}</p>
        </Link>
        <Link href="/delivery/clients" className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-all group block">
            <h3 className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-1 group-hover:text-amber-600 transition">At Risk</h3>
            <p className={`text-[28px] font-black ${atRiskClients.length > 0 ? "text-red-600" : "text-emerald-600"}`}>{atRiskClients.length}</p>
        </Link>
        <Link href="/delivery/engagements" className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-all group block">
            <h3 className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-1 group-hover:text-red-600 transition">Due / Overdue</h3>
            <p className={`text-[28px] font-black ${overdueMilestones.length > 0 ? "text-red-600" : "text-slate-900"}`}>{overdueMilestones.length}</p>
        </Link>
      </div>

      <div className="grid grid-cols-12 gap-8">
         {/* NEEDS ATTENTION */}
         <div className="col-span-4 space-y-4">
            <h2 className="text-[18px] font-black text-slate-900">Today / Needs Attention</h2>
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-1">
               <div className="divide-y divide-slate-100">
                  {needsAttention.length > 0 ? needsAttention.map(item => (
                     <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                           <span className="text-[11px] font-bold text-red-600 uppercase tracking-widest bg-red-50 px-1.5 py-0.5 rounded">{item.type}</span>
                        </div>
                        <p className="text-[13px] font-bold text-slate-900 mb-3">{item.desc}</p>
                        <Link href={item.link} className="inline-flex py-1.5 px-3 bg-white border border-slate-200 shadow-sm text-slate-700 text-[11px] font-bold rounded hover:bg-slate-50 transition w-full justify-center">
                           {item.action}
                        </Link>
                     </div>
                  )) : (
                     <div className="p-6 text-[13px] font-bold text-slate-400 text-center flex flex-col items-center">
                        <span className="material-symbols-outlined text-[32px] mb-2 text-emerald-400">check_circle</span>
                        No immediate actions required today.
                     </div>
                  )}
               </div>
            </div>
         </div>

         {/* CURRENT DELIVERY SNAPSHOT */}
         <div className="col-span-8 space-y-4">
            <div className="flex items-center justify-between">
               <h2 className="text-[18px] font-black text-slate-900">Current Delivery Snapshot</h2>
               <Link href="/delivery/engagements" className="text-[12px] font-bold text-blue-600 hover:underline">View All</Link>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <th className="px-6 py-4">Client</th>
                        <th className="px-6 py-4">Engagement</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Progress</th>
                        <th className="px-6 py-4">Health</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {engagements.filter(e => e.status === "ACTIVE").slice(0, 8).map((e) => {
                        const client = clients.find(c => c.id === e.clientId);
                        if (!client) return null;
                        return (
                           <tr key={e.id} className="hover:bg-slate-50 cursor-pointer transition-colors">
                              <td className="px-6 py-4">
                                 <div className="text-[13px] font-black text-slate-900">{client.name}</div>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="text-[13px] font-medium text-slate-700">{e.name}</div>
                              </td>
                              <td className="px-6 py-4">
                                 <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded">Active</span>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-2">
                                    <div className="w-16 h-1.5 bg-slate-100 rounded overflow-hidden">
                                       <div className="h-full bg-blue-500 rounded" style={{ width: `${e.progress}%` }}></div>
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-500">{e.progress}%</span>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <span className={`text-[12px] font-bold ${client.status === "AT_RISK" ? "text-red-600" : "text-emerald-600"}`}>
                                    {client.status === "AT_RISK" ? "At Risk" : "Healthy"}
                                 </span>
                              </td>
                           </tr>
                        );
                     })}
                     {engagements.filter(e => e.status === "ACTIVE").length === 0 && (
                        <tr>
                           <td colSpan={5} className="px-6 py-8 text-center text-slate-500 text-[13px] font-bold">No active engagements.</td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
    </div>
  );
}
