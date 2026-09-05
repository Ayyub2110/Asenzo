"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useDeliveryOS } from "@/contexts/DeliveryOSContext";

export default function DeliveryCommandCenter() {
  const { 
    metrics, 
    clients, 
    engagements, 
    onboardings, 
    milestones, 
    healthRecords 
  } = useDeliveryOS();
  
  const [dateRange, setDateRange] = useState("This Month");

  // Recent Onboardings
  const activeOnboardings = onboardings
    .filter(o => o.status === "IN_PROGRESS" || o.status === "NOT_STARTED")
    .slice(0, 3);
    
  // At-Risk or High-Priority engagements
  const atRiskClients = clients
    .filter(c => c.status === "AT_RISK")
    .slice(0, 3);

  // Upcoming Milestones
  const upcomingMilestones = milestones
    .filter(m => m.status === "IN_PROGRESS" || m.status === "NOT_STARTED")
    .sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  const handleKpiClick = (route: string) => {
     window.location.href = route;
  };

  return (
    <div className="pt-8 space-y-6 animate-in fade-in duration-300 px-8 max-w-[1400px] mx-auto">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-[32px] text-blue-500">check_circle</span>
            DELIVERY COMMAND CENTER
          </h1>
          <p className="text-[14px] text-slate-500 font-medium max-w-2xl mt-1">
            Fulfillment, onboarding, client health, and project milestone tracking.
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-3">
           <div className="flex gap-2">
              <Link href="/delivery/onboarding" className="px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-lg text-[12px] font-bold shadow-sm flex items-center gap-1.5 transition-colors hover:bg-slate-50">
                 <span className="material-symbols-outlined text-[16px]">start</span> Start Onboarding
              </Link>
              <Link href="/delivery/milestones" className="px-4 py-2 bg-slate-900 text-white rounded-lg text-[12px] font-bold shadow-sm flex items-center gap-1.5 transition-colors hover:bg-slate-800">
                 <span className="material-symbols-outlined text-[16px]">add</span> Update Milestone
              </Link>
           </div>
           
           <div className="bg-white border border-slate-200 rounded-lg shadow-sm flex overflow-hidden">
              {["Today", "This Week", "This Month", "This Quarter", "This Year"].map((tab) => (
                 <button 
                    key={tab}
                    onClick={() => setDateRange(tab)}
                    className={`px-4 py-1.5 text-[11px] font-bold transition-colors ${dateRange === tab ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                 >
                    {tab}
                 </button>
              ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div onClick={() => handleKpiClick('/delivery/onboarding')} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm cursor-pointer hover:border-slate-300 hover:shadow-md transition-all group">
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1 group-hover:text-slate-600 transition-colors">Onboarding</p>
            <div className="flex items-center gap-3">
                <div className="text-[36px] font-black tracking-tight leading-none text-blue-600">{metrics.onboardingInProgress}</div>
            </div>
            <div className="mt-2 text-[11px] font-bold text-slate-500">Active setups</div>
        </div>
        
        <div onClick={() => handleKpiClick('/delivery/engagements')} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm cursor-pointer hover:border-slate-300 hover:shadow-md transition-all group">
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1 group-hover:text-slate-600 transition-colors">Active Engagements</p>
            <div className="flex items-center gap-3">
                <div className="text-[36px] font-black text-slate-900 tracking-tight leading-none">{metrics.activeEngagements}</div>
            </div>
            <div className="mt-2 text-[11px] font-bold text-slate-500">Live projects</div>
        </div>

        <div onClick={() => handleKpiClick('/delivery/clients')} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm cursor-pointer hover:border-slate-300 hover:shadow-md transition-all group">
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1 group-hover:text-slate-600 transition-colors">At-Risk Clients</p>
            <div className="flex items-center gap-3">
                <div className={`text-[36px] font-black tracking-tight leading-none ${metrics.atRiskClients > 0 ? "text-red-500" : "text-emerald-500"}`}>{metrics.atRiskClients}</div>
            </div>
            <div className="mt-2 text-[11px] font-bold text-slate-500">Require attention</div>
        </div>

        <div onClick={() => handleKpiClick('/delivery/milestones')} className="bg-slate-900 text-white rounded-xl p-6 shadow-sm cursor-pointer hover:bg-slate-800 transition-colors">
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Milestone Velocity</p>
            <div className="flex items-center gap-3">
                <div className="text-[36px] font-black tracking-tight leading-none">{Math.round(metrics.milestoneCompletionRate)}%</div>
            </div>
            <div className="mt-2 text-[11px] font-bold text-slate-400">Completion rate</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-6">
         {/* Active Onboardings */}
         <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-[14px] font-bold text-slate-900 flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px] text-blue-500">rocket_launch</span> Active Onboarding</h3>
               <Link href="/delivery/onboarding" className="text-[11px] font-bold text-blue-600 hover:underline">View All</Link>
            </div>
            
            <div className="space-y-4">
               {activeOnboardings.length > 0 ? activeOnboardings.map(o => {
                  const customerName = clients.find(c => c.id === o.customerId)?.company || "Unknown";
                  return (
                    <div key={o.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative overflow-hidden group">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-xl"></div>
                        <div className="flex justify-between items-start mb-2">
                           <div className="pl-3">
                              <div className="text-[13px] font-black text-slate-900">{customerName}</div>
                              <div className="text-[11px] font-bold text-slate-500">Owner: {o.owner}</div>
                           </div>
                           <span className="px-2 py-1 text-[9px] font-extrabold uppercase rounded bg-blue-100 text-blue-800">{o.status.replace("_", " ")}</span>
                        </div>
                        <div className="pl-3 mt-3">
                           <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1.5">
                              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${o.progress}%` }}></div>
                           </div>
                           <div className="flex justify-between text-[11px] font-bold text-slate-500">
                              <span>Progress</span>
                              <span>{o.progress}%</span>
                           </div>
                        </div>
                    </div>
                  )
               }) : (
                 <div className="p-8 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">No active onboardings.</div>
               )}
            </div>
         </div>

         {/* Upcoming Milestones */}
         <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-[14px] font-bold text-slate-900 flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px] text-amber-500">flag</span> Upcoming Milestones</h3>
               <Link href="/delivery/milestones" className="text-[11px] font-bold text-blue-600 hover:underline">View Pipeline</Link>
            </div>
            
            <div className="space-y-3">
               {upcomingMilestones.length > 0 ? upcomingMilestones.map(m => {
                  const engagementName = engagements.find(e => e.id === m.engagementId)?.name || "Unknown";
                  const isOverdue = new Date(m.dueDate) < new Date();

                  return (
                     <div key={m.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                        <div>
                           <div className="text-[13px] font-black text-slate-900">{m.name}</div>
                           <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5 mt-0.5">
                              Engagement: <span className="text-slate-800">{engagementName}</span>
                           </div>
                        </div>
                        <div className="text-right">
                           <div className={`text-[12px] font-black ${isOverdue ? 'text-red-500' : 'text-slate-900'}`}>
                             {new Date(m.dueDate).toLocaleDateString()}
                           </div>
                           <div className={`text-[10px] font-bold mt-1 uppercase ${isOverdue ? 'bg-red-100 text-red-700 px-1.5 py-0.5 rounded' : 'text-slate-500'}`}>
                             {isOverdue ? 'OVERDUE' : 'DUE'}
                           </div>
                        </div>
                     </div>
                  )
               }) : (
                 <div className="p-8 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">No upcoming milestones.</div>
               )}
            </div>
         </div>
      </div>

    </div>
  );
}
