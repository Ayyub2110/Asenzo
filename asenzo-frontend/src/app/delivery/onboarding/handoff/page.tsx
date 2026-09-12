"use client";

import React, { useState } from "react";
import { useDeliveryOS } from "@/contexts/DeliveryOSContext";

export default function SalesHandoffPage() {
  const { clients, engagements } = useDeliveryOS();
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Mock list of handoffs (usually these would come from ConversionOS -> Delivery payload)
  const handoffs = clients.map(c => {
     return {
        id: `ho_${c.id}`,
        clientId: c.id,
        clientName: c.company,
        dealOwner: "Sales Exec",
        deliveryOwner: c.owner,
        status: c.status === "ACTIVE" ? "COMPLETED" : "PENDING",
        date: c.startDate,
        notes: "Client signed Q3 expansion offer. Standard onboarding required."
     };
  });

  const filtered = handoffs.filter(ho => {
     if (statusFilter !== "ALL" && ho.status !== statusFilter) return false;
     return true;
  });

  return (
    <div className="pt-8 space-y-6 animate-in fade-in duration-300 px-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight flex items-center gap-2">
            SALES HANDOFF QUEUE
          </h1>
          <p className="text-[14px] text-slate-500 font-medium max-w-2xl mt-1">
            Review won deals moving from Conversion OS into active fulfillment.
          </p>
        </div>
        
        <div className="flex gap-4">
           <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[13px] font-bold text-slate-700 outline-none"
           >
              <option value="ALL">All Handoffs</option>
              <option value="PENDING">Action Required</option>
              <option value="COMPLETED">Completed</option>
           </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest w-[250px]">Client / Notes</th>
                  <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Handoff Date</th>
                  <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest text-center">Status</th>
                  <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest text-right">Action</th>
               </tr>
            </thead>
            <tbody>
               {filtered.map(ho => (
                  <tr key={ho.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                     <td className="p-4 text-left">
                        <div className="font-black text-[14px] text-slate-900 mb-1">{ho.clientName}</div>
                        <div className="text-[12px] font-medium text-slate-600 bg-slate-100 p-2 rounded line-clamp-2">
                           <span className="font-bold mr-1">Deal Notes:</span>
                           {ho.notes}
                        </div>
                     </td>
                     <td className="p-4">
                        <div className="text-[14px] font-bold text-slate-900">{new Date(ho.date).toLocaleDateString()}</div>
                        <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5 mt-0.5">
                           Sold by: <span className="font-bold text-slate-700">{ho.dealOwner}</span>
                        </div>
                     </td>
                     <td className="p-4 text-center">
                        <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase rounded ${
                           ho.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                           'bg-amber-100 text-amber-800'
                        }`}>
                           {ho.status}
                        </span>
                     </td>
                     <td className="p-4 text-right">
                        {ho.status === "PENDING" ? (
                           <button className="px-3 py-1.5 bg-slate-900 text-white rounded text-[11px] font-bold transition-all hover:bg-slate-800 shadow-sm">
                              Accept Handoff
                           </button>
                        ) : (
                           <button className="px-3 py-1.5 border border-slate-200 text-slate-400 rounded text-[11px] font-bold cursor-not-allowed">
                              Handoff Accepted
                           </button>
                        )}
                     </td>
                  </tr>
               ))}
               {filtered.length === 0 && (
                  <tr>
                     <td colSpan={4} className="p-8 text-center text-slate-500 font-medium text-[14px] border-dashed border-2 border-slate-100 m-4 rounded-xl">
                        No handoff requests found.
                     </td>
                  </tr>
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
}
