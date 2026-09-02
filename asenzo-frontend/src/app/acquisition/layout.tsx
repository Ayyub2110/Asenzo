"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/acquisition", label: "Command Center", exact: true },
  { href: "/acquisition/strategy", label: "Strategy" },
  { href: "/acquisition/research", label: "Research" },
  { href: "/acquisition/content", label: "Content" },
  { href: "/acquisition/funnels", label: "Funnels" },
  { href: "/acquisition/library", label: "Library" },
  { href: "/acquisition/analytics", label: "Analytics" },
];

export default function AcquisitionLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFunnels = pathname === "/acquisition/funnels" || pathname?.startsWith("/acquisition/funnels/");

  return (
    <div className={`flex flex-col min-w-0 ${isFunnels ? "h-[calc(100vh-72px)] overflow-hidden" : "h-full overflow-y-auto"}`}>
      {/* Tab nav — ASENZO design system */}
      <div className="sticky top-0 z-30 bg-background border-b border-border shrink-0">
        <div className="max-w-[1400px] mx-auto px-8 flex items-center gap-1 h-11">
          {tabs.map((tab) => {
            const isActive = tab.exact
              ? pathname === tab.href
              : pathname === tab.href || pathname?.startsWith(tab.href + "/");
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-3.5 py-1.5 rounded-md text-[12px] font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Page content */}
      <main className={isFunnels ? "flex-1 overflow-hidden" : "flex-1 max-w-[1400px] mx-auto w-full"}>
        {children}
      </main>
    </div>
  );
}
