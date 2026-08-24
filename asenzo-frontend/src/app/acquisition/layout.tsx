"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/acquisition", label: "Command" },
  { href: "/acquisition/strategy", label: "Content Strategy" },
  { href: "/acquisition/calendar", label: "Content Calendar" },
  { href: "/acquisition/production", label: "Content Production" },
  { href: "/acquisition/scripts", label: "Script Center" },
  { href: "/acquisition/stories", label: "Story Sequences" },
  { href: "/acquisition/outreach", label: "Outreach" },
  { href: "/acquisition/analytics", label: "Analytics" },
];

export default function AcquisitionLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-background relative">
      <div className="px-6 md:px-10 lg:px-12 pt-8 pb-4 border-b border-border/50 sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-[24px] font-bold tracking-tight text-foreground">Acquisition Center</h1>
          <div className="flex gap-2">
            <Link href="/acquisition/capture">
              <button className="text-[12px] font-semibold text-muted-foreground hover:text-foreground border border-transparent hover:border-border px-3 py-1.5 rounded-md transition-colors">Capture</button>
            </Link>
            <Link href="/acquisition/leads">
              <button className="text-[12px] font-semibold text-muted-foreground hover:text-foreground border border-transparent hover:border-border px-3 py-1.5 rounded-md transition-colors">Leads</button>
            </Link>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-4 py-2 text-[13px] font-semibold rounded-md transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
