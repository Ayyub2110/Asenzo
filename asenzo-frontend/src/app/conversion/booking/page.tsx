"use client";

import React from "react";
import { getConversion } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function BookingPage() {
  const { localData, loading, error } = useAdapter(getConversion);

  if (loading) return <div className="p-10 animate-pulse h-96 w-full max-w-[1200px] mx-auto bg-muted/20 rounded-[16px]" />;
  if (error || !localData) return <div className="p-10">Error loading Bookings.</div>;

  const { bookings } = localData;

  return (
    <div className="p-6 md:p-10 max-w-[1500px] mx-auto">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-[18px] font-bold text-foreground mb-1">Booking Center</h1>
          <p className="text-[14px] text-muted-foreground">Scheduled interactions, show-ups, and outcomes.</p>
        </div>
      </div>

       <div className="bg-card border border-border rounded-[16px] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-secondary/30">
            <tr>
              <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Date</th>
              <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest hidden md:table-cell">Call Type</th>
              <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
              <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest hidden lg:table-cell">Show Status</th>
              <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings?.map(b => (
              <tr key={b.id} className="border-t border-border hover:bg-secondary/20 transition-colors">
                <td className="p-4">
                  <p className="text-[14px] font-bold text-foreground">{new Date(b.callDate).toLocaleDateString()}</p>
                  <p className="text-[12px] text-muted-foreground">{new Date(b.callDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </td>
                <td className="p-4 hidden md:table-cell">
                   <p className="text-[13px] font-medium text-foreground">{b.callType}</p>
                   <p className="text-[11px] text-muted-foreground mt-0.5">{b.source}</p>
                </td>
                <td className="p-4">
                   <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-border ${b.status === 'BOOKED' ? 'bg-secondary text-foreground' : 'bg-background text-muted-foreground'}`}>{b.status}</span>
                </td>
                <td className="p-4 hidden lg:table-cell">
                   {b.showStatus ? <span className="bg-success text-background px-2 py-1 rounded-[4px] text-[10px] font-bold uppercase">{b.showStatus}</span> : <span className="text-[12px] text-muted-foreground italic">Pending</span>}
                </td>
                <td className="p-4 text-right">
                   {b.status === "BOOKED" && <button className="bg-foreground text-background text-[11px] font-bold px-4 py-1.5 rounded-[6px] hover:opacity-90">Log Outcome</button>}
                </td>
              </tr>
            )) || <tr><td colSpan={5} className="p-8 text-center text-[12px] text-muted-foreground">No bookings found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
