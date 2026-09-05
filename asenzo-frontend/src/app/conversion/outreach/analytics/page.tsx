"use client";

import React from "react";
import { useOutreachOS } from "@/contexts/OutreachOSContext";

export default function OutreachAnalyticsPage() {
  const { prospects, activities } = useOutreachOS();

  // Basic funnel metrics
  const totalProspects = prospects.length || 1;
  const contacted = prospects.filter(p => p.status !== "NOT_CONTACTED").length;
  const replied = prospects.filter(p => ["REPLIED", "INTERESTED", "MEETING_BOOKED", "QUALIFIED", "OPPORTUNITY", "WON"].includes(p.status)).length;
  const interested = prospects.filter(p => ["INTERESTED", "MEETING_BOOKED", "QUALIFIED", "OPPORTUNITY", "WON"].includes(p.status)).length;
  
  // derived rates
  const contactRate = Math.round((contacted / totalProspects) * 100);
  const replyRate = Math.round((replied / Math.max(contacted, 1)) * 100);
  const interestRate = Math.round((interested / Math.max(replied, 1)) * 100);

  // Channel breakdown
  const getChannelMetrics = (channelType: string) => {
      const channelActs = activities.filter(a => a.channel === channelType);
      const outreachActs = channelActs.filter(a => a.type === "INITIAL_OUTREACH" || a.type === "FOLLOW_UP");
      const replyActs = channelActs.filter(a => a.type === "REPLY_RECEIVED");
      const interestedActs = channelActs.filter(a => a.type === "REPLY_RECEIVED" && a.outcome === "INTERESTED");
      
      const rRate = Math.round((replyActs.length / Math.max(outreachActs.length, 1)) * 100);

      return {
          outreach: outreachActs.length,
          replies: replyActs.length,
          interested: interestedActs.length,
          replyRate: rRate
      }
  };

  const instagramM = getChannelMetrics("INSTAGRAM");
  const linkedinM = getChannelMetrics("LINKEDIN");
  const emailM = getChannelMetrics("EMAIL");

  return (
    <div className="pt-8 space-y-8 animate-in fade-in duration-300 px-8 max-w-[1400px] mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight">OUTREACH ANALYTICS</h1>
          <p className="text-[14px] text-slate-500 font-medium mt-1">Measure the effectiveness of your outbound engine.</p>
        </div>
      </div>

      <div className="space-y-6">
         <h2 className="text-[14px] font-black text-slate-900 uppercase tracking-widest">FUNNEL PERFORMANCE</h2>
         
         <div className="grid grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
               <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1">Contact Rate</h3>
               <div className="text-[32px] font-black text-slate-900 leading-none">{contactRate}%</div>
               <div className="text-[12px] font-medium text-slate-500 mt-2">{contacted} / {totalProspects} prospects</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
               <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1">Reply Rate</h3>
               <div className="text-[32px] font-black text-slate-900 leading-none">{replyRate}%</div>
               <div className="text-[12px] font-medium text-slate-500 mt-2">{replied} / {contacted} contacted</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
               <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1">Interest Rate</h3>
               <div className="text-[32px] font-black text-slate-900 leading-none">{interestRate}%</div>
               <div className="text-[12px] font-medium text-slate-500 mt-2">{interested} / {replied} replied</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
               <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1">Conversion Quality</h3>
               <div className="text-[32px] font-black text-emerald-600 leading-none">High</div>
               <div className="text-[12px] font-medium text-slate-500 mt-2">Based on current trajectory</div>
            </div>
         </div>
      </div>

      <div className="space-y-6">
         <h2 className="text-[14px] font-black text-slate-900 uppercase tracking-widest">CHANNEL PERFORMANCE</h2>
         
         <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                     <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Channel</th>
                     <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Outreach Messages</th>
                     <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Replies</th>
                     <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Reply Rate</th>
                     <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Interested</th>
                  </tr>
               </thead>
               <tbody>
                  <tr className="border-b border-slate-100">
                     <td className="p-4 font-black text-[14px] text-slate-900">INSTAGRAM</td>
                     <td className="p-4 font-bold text-[13px] text-slate-700">{instagramM.outreach}</td>
                     <td className="p-4 font-bold text-[13px] text-slate-700">{instagramM.replies}</td>
                     <td className="p-4 font-bold text-[13px] text-slate-700">{instagramM.replyRate}%</td>
                     <td className="p-4 font-bold text-[13px] text-slate-700">{instagramM.interested}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                     <td className="p-4 font-black text-[14px] text-slate-900">LINKEDIN</td>
                     <td className="p-4 font-bold text-[13px] text-slate-700">{linkedinM.outreach}</td>
                     <td className="p-4 font-bold text-[13px] text-slate-700">{linkedinM.replies}</td>
                     <td className="p-4 font-bold text-[13px] text-slate-700">{linkedinM.replyRate}%</td>
                     <td className="p-4 font-bold text-[13px] text-slate-700">{linkedinM.interested}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                     <td className="p-4 font-black text-[14px] text-slate-900">EMAIL</td>
                     <td className="p-4 font-bold text-[13px] text-slate-700">{emailM.outreach}</td>
                     <td className="p-4 font-bold text-[13px] text-slate-700">{emailM.replies}</td>
                     <td className="p-4 font-bold text-[13px] text-slate-700">{emailM.replyRate}%</td>
                     <td className="p-4 font-bold text-[13px] text-slate-700">{emailM.interested}</td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
