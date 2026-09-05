"use client";

import React from "react";
import { useDeliveryOS } from "@/contexts/DeliveryOSContext";

export default function CommunicationPage() {
  const { clients } = useDeliveryOS();

  return (
    <div className="pt-8 space-y-6 animate-in fade-in duration-300 px-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight flex items-center gap-2">
            CLIENT COMMUNICATION LOG
          </h1>
          <p className="text-[14px] text-slate-500 font-medium max-w-2xl mt-1">
            Global feed of all tracked meetings, Slack interactions, and ad-hoc comms across delivery.
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm min-h-[400px] flex items-center justify-center relative overflow-hidden">
         <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '16px 16px'}}></div>
         <div className="z-10 text-center">
            <span className="material-symbols-outlined text-[48px] text-slate-300 mb-4 block">maps_ugc</span>
            <h3 className="text-[18px] font-black text-slate-900 mb-2">Comms Aggregator Offline</h3>
            <p className="text-[14px] text-slate-500 font-medium max-w-sm mx-auto mb-6">Connect Slack, Email, or internal ticketing systems to auto-populate the client communication timeline.</p>
            <button className="px-6 py-2.5 bg-slate-900 text-white rounded-lg text-[13px] font-bold shadow-sm transition-colors hover:bg-slate-800">
               Connect Integrations
            </button>
         </div>
      </div>
    </div>
  );
}
