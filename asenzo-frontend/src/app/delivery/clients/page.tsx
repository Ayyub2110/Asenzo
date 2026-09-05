"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useDeliveryOS } from "@/contexts/DeliveryOSContext";

export default function ClientsDirectoryPage() {
  const { clients, metrics } = useDeliveryOS();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = clients.filter(c => {
     if(search && !c.company.toLowerCase().includes(search.toLowerCase())) return false;
     if(statusFilter !== "ALL" && c.status !== statusFilter) return false;
     return true;
  });

  return (
    <div className="pt-8 space-y-6 animate-in fade-in duration-300 px-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight flex items-center gap-2">
            CLIENT DIRECTORY
          </h1>
          <p className="text-[14px] text-slate-500 font-medium max-w-2xl mt-1">
            Master record of all delivery clients and high-level health.
          </p>
        </div>
        
        <div className="flex gap-4">
           {/* Filters */}
           <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">search</span>
              <input 
                type="text" 
                placeholder="Search clients..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-[13px] font-medium w-64 focus:outline-none focus:border-blue-500"
              />
           </div>
           <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[13px] font-bold text-slate-700 outline-none"
           >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="ONBOARDING">Onboarding</option>
              <option value="AT_RISK">At Risk</option>
           </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Client Name</th>
                  <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Owner</th>
                  <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest text-center">Status</th>
                  <th className="p-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest text-right">Actions</th>
               </tr>
            </thead>
            <tbody>
               {filtered.map(c => (
                  <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                     <td className="p-4">
                        <div className="font-black text-[14px] text-slate-900">{c.company}</div>
                        <div className="text-[12px] font-medium text-slate-500 mt-0.5">Since {new Date(c.startDate).toLocaleDateString()}</div>

                     </td>
                     <td className="p-4">
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-600">
                              {c.owner.substring(0,2).toUpperCase()}
                           </div>
                           <span className="text-[13px] font-bold text-slate-700">{c.owner}</span>
                        </div>
                     </td>
                     <td className="p-4 text-center">
                        <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase rounded ${
                           c.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' :
                           c.status === 'AT_RISK' ? 'bg-red-100 text-red-800' :
                           'bg-blue-100 text-blue-800'
                        }`}>
                           {c.status.replace("_", " ")}
                        </span>
                     </td>
                     <td className="p-4 text-right">
                        <Link href={`/delivery/clients/${c.id}`} className="text-[12px] font-bold text-blue-600 hover:underline">
                           View Profile
                        </Link>
                     </td>
                  </tr>
               ))}
               {filtered.length === 0 && (
                  <tr>
                     <td colSpan={4} className="p-8 text-center text-slate-500 font-medium text-[14px] border-dashed border-2 border-slate-100 m-4 rounded-xl">
                        No clients found matching the criteria.
                     </td>
                  </tr>
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
}
