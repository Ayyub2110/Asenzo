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
    id: "operations",
    title: "Revenue Operations",
    items: [
      { href: "/revenue/operations", label: "Operations Overview" },
    ],
  },
  {
    id: "customers",
    title: "Customers",
    items: [
      { href: "/revenue/customers", label: "Customer Health & Status" },
    ],
  },
  {
    id: "expansion",
    title: "Retention & Expansion",
    items: [
      { href: "/revenue/expansion", label: "Expansion Opportunities" },
    ],
  },
  {
    id: "billing",
    title: "Billing & Revenue",
    items: [
      { href: "/revenue/billing", label: "Financial Tracking" },
    ],
  },
  {
    id: "intelligence",
    title: "Revenue Intelligence",
    items: [
      { href: "/revenue/intelligence", label: "Revenue Feedback Loop" },
    ],
  },
  {
    id: "analytics",
    title: "Analytics",
    items: [
      { href: "/revenue/analytics", label: "Unified Analytics" },
    ],
  }
];

export default function RevenueLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  // Determine active pillar based on route
  const getActiveGroup = () => {
    if (pathname === "/revenue") return null;
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
                href="/revenue"
                className={`px-3 py-1.5 rounded-md font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  pathname === "/revenue"
                    ? "bg-slate-900 text-white"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                }`}
              >
                Command Center
              </Link>

              {navGroups.map((group) => {
                const isGroupActive = currentGroup === group.id;
                const primaryHref = group.items[0]?.href || "/revenue";
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
          {currentGroup && pathname !== "/revenue" && (
            <div className="bg-slate-50/80 border-t border-slate-200 px-8 py-1.5">
              <div className="max-w-[1400px] mx-auto flex items-center gap-2 overflow-x-auto text-[11px]">
                {navGroups
                  .find((g) => g.id === currentGroup)
                  ?.items.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/revenue" && pathname?.startsWith(item.href) && item.href !== "/revenue/operations" && item.href !== "/revenue/customers" && item.href !== "/revenue/expansion" && item.href !== "/revenue/billing" && item.href !== "/revenue/intelligence" && item.href !== "/revenue/analytics");

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
