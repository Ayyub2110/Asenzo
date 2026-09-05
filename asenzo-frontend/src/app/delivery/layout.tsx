"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
}

interface NavGroup {
  id: string;
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    id: "onboarding",
    title: "Client Onboarding",
    items: [
      { href: "/delivery/onboarding", label: "Intake & Setup" },
      { href: "/delivery/onboarding/handoff", label: "Sales Handoff" }
    ],
  },
  {
    id: "engagements",
    title: "Engagements",
    items: [
      { href: "/delivery/engagements", label: "Active Engagements" },
      { href: "/delivery/milestones", label: "Milestones" },
      { href: "/delivery/deliverables", label: "Deliverables" }
    ],
  },
  {
    id: "clients",
    title: "Client Health",
    items: [
      { href: "/delivery/clients", label: "Client Directory" },
      { href: "/delivery/health", label: "Health Signals" },
      { href: "/delivery/communication", label: "Client Comm Log" }
    ],
  },
  {
    id: "reporting",
    title: "Reporting & Outcomes",
    items: [
      { href: "/delivery/reporting", label: "Executive Reporting" },
      { href: "/delivery/reporting/outcomes", label: "KPI Tracking" }
    ],
  },
  {
    id: "retention",
    title: "Retention & Proof",
    items: [
      { href: "/delivery/retention", label: "Renewal Pipeline" },
      { href: "/delivery/retention/proof", label: "Proof Assets" }
    ],
  }
];

export default function DeliveryLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  // Determine active pillar based on route
  const getActiveGroup = () => {
    if (pathname === "/delivery") return null;
    for (const group of navGroups) {
      if (group.items.some((item) => pathname === item.href || pathname?.startsWith(item.href))) {
        return group.id;
      }
    }
    return null;
  };

  const currentGroup = activeGroup || getActiveGroup();

  return (
    <>
      <div className="flex flex-col min-w-0 h-full overflow-y-auto bg-slate-50">
        {/* Top Header - Level 1 Pillars in classic ASENZO clean design */}
        <div className="sticky top-0 z-30 bg-white border-b border-slate-200 shrink-0">
          <div className="max-w-[1400px] mx-auto px-8 flex items-center justify-between h-11 text-[12px]">
            <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
              <Link
                href="/delivery"
                className={`px-3 py-1.5 rounded-md font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  pathname === "/delivery"
                    ? "bg-slate-900 text-white"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                }`}
              >
                Command Center
              </Link>

              {navGroups.map((group) => {
                const isGroupActive = currentGroup === group.id;
                const primaryHref = group.items[0]?.href || "/delivery";
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
          {currentGroup && pathname !== "/delivery" && (
            <div className="bg-slate-50/80 border-t border-slate-200 px-8 py-1.5">
              <div className="max-w-[1400px] mx-auto flex items-center gap-2 overflow-x-auto text-[11px]">
                {navGroups
                  .find((g) => g.id === currentGroup)
                  ?.items.map((item) => {
                    // specialized exact match checking 
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
        <main className="flex-1 max-w-[1400px] mx-auto w-full pb-16">
          {children}
        </main>
      </div>
    </>
  );
}
