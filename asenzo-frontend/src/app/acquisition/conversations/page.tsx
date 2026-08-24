"use client";

import React from "react";
import Link from "next/link";

export default function AcquisitionConversationsPage() {
  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1360px] mx-auto w-full pb-32">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-[20px] font-bold text-foreground">Conversations</h2>
          <p className="text-[14px] text-muted-foreground mt-1">Global view of all active lead conversations.</p>
        </div>
      </div>
      <div className="p-8 border border-dashed border-border rounded-[12px] flex flex-col items-center justify-center text-center">
        <span className="material-symbols-outlined text-[48px] text-muted-foreground opacity-50 mb-4">forum</span>
        <h3 className="text-[16px] font-bold text-foreground mb-2">Global Inbox</h3>
        <p className="text-[14px] text-muted-foreground max-w-sm mb-6">Manage all conversations from the Leads view.</p>
        <Link href="/acquisition/leads">
          <button className="bg-secondary text-foreground border border-border px-4 py-2 rounded-[6px] text-[13px] font-semibold">View Leads</button>
        </Link>
      </div>
    </div>
  );
}
