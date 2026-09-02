"use client";

import React, { useState } from "react";
import Link from "next/link";

const CONVERSION_ASSETS = [
  { id: "ast1", name: "Inbound Acquisition OS VSL", type: "VSL", status: "ACTIVE", conversions: 142, conversionRate: "18.4%", url: "/vsl/acquisition-os", leadMagnet: "OS Architecture PDF" },
  { id: "ast2", name: "Founder Drag Diagnostic Quiz", type: "Assessment", status: "ACTIVE", conversions: 89, conversionRate: "24.1%", url: "/diagnosis", leadMagnet: "Personalized Audit" },
  { id: "ast3", name: "7-Figure Acquisition Blueprint PDF", type: "Lead Magnet", status: "ACTIVE", conversions: 310, conversionRate: "34.2%", url: "/assets/blueprint", leadMagnet: "Blueprint PDF" },
  { id: "ast4", name: "Scale Readiness Application Page", type: "Application Page", status: "ACTIVE", conversions: 45, conversionRate: "12.8%", url: "/apply", leadMagnet: "Sales Call Handoff" },
  { id: "ast5", name: "Executive Consultation Booking Surface", type: "Booking Page", status: "ACTIVE", conversions: 28, conversionRate: "42.0%", url: "/book", leadMagnet: "Calendar Booking" },
];

export default function ConversionAssetsPage() {
  const [filterType, setFilterType] = useState("ALL");

  const filteredAssets = CONVERSION_ASSETS.filter(
    (ast) => filterType === "ALL" || ast.type === filterType
  );

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Pillar 3 — Conversion Assets</p>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Landing Pages, VSLs & Lead Magnets</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Manage conversion surfaces, offer pages, and lead capture assets linked to acquisition funnels.</p>
        </div>
        <button className="px-4 py-2 bg-slate-900 text-white text-[12px] font-bold rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px]">add</span>
          Create New Asset
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {["ALL", "VSL", "Assessment", "Lead Magnet", "Application Page", "Booking Page"].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                  filterType === t
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <span className="text-[12px] text-slate-400 font-semibold">{filteredAssets.length} Assets Registered</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3">Asset Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Conversions</th>
                <th className="p-3 text-right">Conv. Rate</th>
                <th className="p-3">Linked Lead Magnet</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssets.map((ast) => (
                <tr key={ast.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-3 font-bold text-slate-900">
                    {ast.name}
                    <div className="text-[10px] font-normal text-slate-400">{ast.url}</div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-medium rounded text-[11px]">
                      {ast.type}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-bold rounded text-[10px]">
                      {ast.status}
                    </span>
                  </td>
                  <td className="p-3 text-right font-bold text-slate-900">{ast.conversions}</td>
                  <td className="p-3 text-right font-bold text-blue-600">{ast.conversionRate}</td>
                  <td className="p-3 text-slate-600">{ast.leadMagnet}</td>
                  <td className="p-3 text-right">
                    <button className="px-2.5 py-1 border border-slate-200 text-slate-600 text-[11px] font-semibold rounded hover:bg-slate-100">
                      Edit Asset
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
