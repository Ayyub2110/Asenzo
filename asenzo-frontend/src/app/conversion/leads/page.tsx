"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lead } from "@/lib/types/conversion";
import { useConversionOS } from "@/contexts/ConversionOSContext";

export default function LeadsWorkspace() {
  const { leads, addLead } = useConversionOS();
  const [isCreating, setIsCreating] = useState(false);
  
  const [newLead, setNewLead] = useState<Partial<Lead>>({
    name: "", email: "", originalSource: "Website", temperature: "HOT", qualificationStatus: "NEW", problem: "", buyingTrigger: ""
  });

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    addLead(newLead as any);
    setIsCreating(false);
    setNewLead({ name: "", email: "", originalSource: "Website", temperature: "HOT", qualificationStatus: "NEW", problem: "", buyingTrigger: "" });
  };

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Lead Database</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Master directory of all individuals who have entered the ecosystem.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsCreating(true)} className="px-4 py-2 bg-slate-900 text-white text-[12px] font-bold rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">add</span>
            Create Lead
          </button>
          <Link href="/conversion/leads/qualification" className="px-4 py-2 bg-blue-600 text-white text-[12px] font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">psychology</span>
            Run Batch Qualification
          </Link>
        </div>
      </div>

      {isCreating && (
        <form onSubmit={handleCreateLead} className="bg-slate-50 border border-slate-200 rounded-xl p-5 mt-4">
          <h3 className="text-[14px] font-bold text-slate-900 mb-4">Create New Lead</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input required placeholder="Lead Name" value={newLead.name} onChange={e => setNewLead({...newLead, name: e.target.value})} className="px-3 py-2 border border-slate-200 rounded text-[12px]" />
            <input required placeholder="Email or Phone" value={newLead.email} onChange={e => setNewLead({...newLead, email: e.target.value})} className="px-3 py-2 border border-slate-200 rounded text-[12px]" />
            <input placeholder="Buying Trigger" value={newLead.buyingTrigger} onChange={e => setNewLead({...newLead, buyingTrigger: e.target.value})} className="px-3 py-2 border border-slate-200 rounded text-[12px]" />
            <input placeholder="Identified Problem" value={newLead.problem} onChange={e => setNewLead({...newLead, problem: e.target.value})} className="px-3 py-2 border border-slate-200 rounded text-[12px]" />
            <select value={newLead.temperature} onChange={e => setNewLead({...newLead, temperature: e.target.value as any})} className="px-3 py-2 border border-slate-200 rounded text-[12px]">
              <option value="HOT">Hot</option>
              <option value="WARM">Warm</option>
              <option value="COLD">Cold</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 border border-slate-200 rounded text-[12px] font-bold">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded text-[12px] font-bold">Save Lead</button>
          </div>
        </form>
      )}

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden text-[12px]">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
            <tr>
              <th className="px-5 py-3">Lead</th>
              <th className="px-5 py-3">Source & Attribution</th>
              <th className="px-5 py-3">Temp</th>
              <th className="px-5 py-3">Qualification</th>
              <th className="px-5 py-3">Trigger / Problem</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="font-bold text-slate-900">{lead.name}</div>
                  <div className="text-slate-500 mt-0.5">{lead.email}</div>
                </td>
                <td className="px-5 py-4">
                  <div className="font-medium text-slate-700">{lead.originalSource}</div>
                  <div className="text-slate-400 mt-0.5">{lead.originalFunnel} • {lead.originalContent}</div>
                </td>
                <td className="px-5 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    lead.temperature === "HOT" ? "bg-red-100 text-red-700" :
                    lead.temperature === "WARM" ? "bg-amber-100 text-amber-700" :
                    "bg-blue-100 text-blue-700"
                  }`}>
                    {lead.temperature}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5 font-medium">
                    <span className="material-symbols-outlined text-[14px] text-slate-400">
                      {lead.qualificationStatus === "QUALIFIED" ? "check_circle" : "pending"}
                    </span>
                    {lead.qualificationStatus?.replace("_", " ") || "NEW"}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="text-slate-800 font-medium truncate max-w-[200px]">{lead.buyingTrigger}</div>
                  <div className="text-slate-500 mt-0.5 truncate max-w-[200px]">{lead.problem}</div>
                </td>
                <td className="px-5 py-4 text-right">
                  <button className="text-blue-600 font-bold hover:text-blue-800 transition-colors">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-[13px] font-medium text-slate-600">No leads in the system yet.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
