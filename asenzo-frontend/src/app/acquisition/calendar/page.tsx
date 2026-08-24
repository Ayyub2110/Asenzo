"use client";

import React from "react";

export default function AcquisitionCalendarPage() {
  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1360px] mx-auto w-full pb-32 h-full flex flex-col">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-[20px] font-bold text-foreground">Content Calendar</h2>
          <p className="text-[14px] text-muted-foreground mt-1">Schedule and manage the publishing pipeline.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-secondary text-foreground text-[12px] font-bold px-3 py-1.5 rounded-md">Filters</button>
          <button className="bg-foreground text-background px-4 py-2 rounded-[8px] text-[13px] font-bold">Schedule Post</button>
        </div>
      </div>

      <div className="flex-1 bg-card border border-border rounded-[12px] p-6 flex flex-col items-center justify-center min-h-[500px]">
        <span className="material-symbols-outlined text-[48px] text-muted-foreground opacity-50 mb-4">calendar_view_week</span>
        <h3 className="text-[16px] font-bold text-foreground mb-2">Calendar View Active</h3>
        <p className="text-[14px] text-muted-foreground max-w-sm text-center">
           Calendar module renders the scheduled content array mapped by Date and Channel (LinkedIn, X, YouTube).
        </p>
      </div>
    </div>
  );
}
