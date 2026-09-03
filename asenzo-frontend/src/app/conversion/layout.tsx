"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  exact?: boolean;
}

interface NavGroup {
  id: string;
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    id: "leads",
    title: "Leads",
    items: [
      { href: "/conversion/leads", label: "All Leads" },
      { href: "/conversion/leads/hot", label: "Hot" },
      { href: "/conversion/leads/warm", label: "Warm" },
      { href: "/conversion/leads/cold", label: "Cold" },
      { href: "/conversion/leads/qualification", label: "Qualification" },
    ],
  },
  {
    id: "pipeline",
    title: "Sales Pipeline",
    items: [
      { href: "/conversion/pipeline", label: "Opportunities" },
      { href: "/conversion/pipeline/calls", label: "Calls" },
      { href: "/conversion/pipeline/offers", label: "Offers" },
      { href: "/conversion/pipeline/follow-ups", label: "Follow-ups" },
    ],
  },
  {
    id: "conversations",
    title: "Conversations",
    items: [
      { href: "/conversion/conversations", label: "Inbox" },
      { href: "/conversion/conversations/dms", label: "DMs" },
      { href: "/conversion/conversations/sales", label: "Sales Conversations" },
    ],
  },
  {
    id: "nurture",
    title: "Nurture",
    items: [
      { href: "/conversion/nurture", label: "Lead Capture & Nurture" },
    ],
  },
  {
    id: "outreach",
    title: "Outbound",
    items: [
      { href: "/conversion/outreach", label: "Outreach Workspace" },
    ],
  },
  {
    id: "intelligence",
    title: "Intelligence",
    items: [
      { href: "/conversion/intelligence", label: "Objections" },
      { href: "/conversion/intelligence/buying-triggers", label: "Buying Triggers" },
      { href: "/conversion/intelligence/lost-reasons", label: "Lost Reasons" },
      { href: "/conversion/intelligence/insights", label: "Conversion Insights" },
    ],
  },
  {
    id: "analytics",
    title: "Analytics",
    items: [
      { href: "/conversion/analytics", label: "Full Funnel" },
    ],
  }
];

export default function ConversionLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  // Determine active pillar based on route
  const getActiveGroup = () => {
    if (pathname === "/conversion") return null;
    for (const group of navGroups) {
      if (group.items.some((item) => pathname === item.href || pathname?.startsWith(item.href))) {
        return group.id;
      }
    }
    return null;
  };

  const currentGroup = activeGroup || getActiveGroup();

  return (
    <div className="flex flex-col min-w-0 h-full overflow-y-auto">
      {/* Top Header - Level 1 Pillars in classic ASENZO clean design */}
      <div className="sticky top-0 z-30 bg-background border-b border-border shrink-0">
        <div className="max-w-[1400px] mx-auto px-8 flex items-center justify-between h-11 text-[12px]">
          <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
            <Link
              href="/conversion"
              className={`px-3 py-1.5 rounded-md font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                pathname === "/conversion"
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              Command Center
            </Link>

            {navGroups.map((group) => {
              const isGroupActive = currentGroup === group.id;
              const primaryHref = group.items[0]?.href || "/conversion";
              return (
                <Link
                  key={group.id}
                  href={primaryHref}
                  onClick={() => setActiveGroup(group.id)}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-all whitespace-nowrap ${
                    isGroupActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  {group.title}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Level 2 Sub-Navigation Bar */}
        {currentGroup && pathname !== "/conversion" && (
          <div className="bg-slate-50/80 border-t border-slate-200 px-8 py-1.5">
            <div className="max-w-[1400px] mx-auto flex items-center gap-2 overflow-x-auto text-[11px]">
              {navGroups
                .find((g) => g.id === currentGroup)
                ?.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/conversion" && pathname?.startsWith(item.href) && item.href !== "/conversion/leads" && item.href !== "/conversion/pipeline" && item.href !== "/conversion/conversations" && item.href !== "/conversion/nurture" && item.href !== "/conversion/intelligence" && item.href !== "/conversion/analytics");
                  
                  // specialized exact match checking to not highlight "All Leads" when in "Warm"
                  const isExact = (item.href.split("/").length === 3 && pathname === item.href) ||
                                  (item.href.split("/").length > 3 && pathname?.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-2.5 py-1 rounded transition-colors font-semibold ${
                        isExact
                          ? "bg-blue-600 text-white"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* Page content */}
      <main className="flex-1 max-w-[1400px] mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
