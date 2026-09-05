"use client";

import React from "react";
import { useDeliveryOS } from "@/contexts/DeliveryOSContext";

export default function ClientHealthPage() {
  const { clients, healthRecords } = useDeliveryOS();

  return (
    <div className="pt-8 space-y-6 animate-in fade-in duration-300 px-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight flex items-center gap-2">
            CLIENT HEALTH & SIGNALS
          </h1>
          <p className="text-[14px] text-slate-500 font-medium max-w-2xl mt-1">
            Global view of all client risk signals, overrides, and historical health trajectories.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
         {clients.map(c => {
            const records = healthRecords
              .filter(r => r.customerId === c.id)
              .sort((a,b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
            
            if (records.length === 0 && c.status !== "AT_RISK") return null;

            return (
              <div key={c.id} className="bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden shadow-sm">
                 <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                       <h3 className="text-[16px] font-black text-slate-900">{c.company}</h3>
                       <p className="text-[12px] font-bold text-slate-500">Owner: {c.owner}</p>
                    </div>
                    <span className={`px-3 py-1.5 text-[11px] font-black uppercase rounded-lg ${
                       c.status === 'AT_RISK' ? 'bg-red-100 text-red-800 border border-red-200' :
                       c.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                       'bg-slate-100 text-slate-800'
                    }`}>
                       System Status: {c.status.replace("_", " ")}
                    </span>
                 </div>
                 
                 <div className="p-0">
                    <table className="w-full text-left">
                       <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                             <th className="p-3 pl-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest w-[140px]">Date</th>
                             <th className="p-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest w-[120px]">Score</th>
                             <th className="p-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Risk Category / Notes</th>
                             <th className="p-3 pr-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-right">Logged By</th>
                          </tr>
                       </thead>
                       <tbody>
                          {records.map(r => (
                             <tr key={r.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                                <td className="p-3 pl-5 text-[12px] font-bold text-slate-700">{new Date(r.createdDate).toLocaleDateString()}</td>
                                <td className="p-3">
                                   <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                                      r.status === 'HEALTHY' ? 'bg-emerald-100 text-emerald-800' :
                                      r.status === 'STABLE' ? 'bg-blue-100 text-blue-800' :
                                      r.status === 'AT_RISK' ? 'bg-amber-100 text-amber-800' :
                                      'bg-red-100 text-red-800'
                                   }`}>
                                      {r.status}
                                   </span>
                                </td>
                                <td className="p-3">
                                   <div className="text-[11px] font-black text-slate-800 uppercase tracking-widest mb-1">{r.signals || 'N/A'}</div>
                                   <div className="text-[13px] font-medium text-slate-600">{r.reason}</div>
                                </td>
                                <td className="p-3 pr-5 text-right text-[12px] font-bold text-slate-500">
                                   System (Auto)
                                </td>
                             </tr>
                          ))}
                          {records.length === 0 && (
                             <tr>
                               <td colSpan={4} className="p-4 pl-5 text-[12px] font-medium text-slate-500 italic">No historical health records found.</td>
                             </tr>
                          )}
                       </tbody>
                    </table>
                 </div>
              </div>
            )
         })}
      </div>
    </div>
  );
}
