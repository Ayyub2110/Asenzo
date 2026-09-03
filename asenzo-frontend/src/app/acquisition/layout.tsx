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
    id: "content",
    title: "Content",
    items: [
      { href: "/acquisition/strategy", label: "Strategy" },
      { href: "/acquisition/research", label: "Research & Ideas" },
      { href: "/acquisition/scripts", label: "Scripts" },
      { href: "/acquisition/production", label: "Production & Kanban" },
      { href: "/acquisition/stories", label: "Stories" },
      { href: "/acquisition/content/analytics", label: "Content Analytics" },
    ],
  },
  {
    id: "distribution",
    title: "Distribution",
    items: [
      { href: "/acquisition/distribution", label: "Organic Social" },
      { href: "/acquisition/channels", label: "Channels" },
    ],
  },
  {
    id: "funnels",
    title: "Funnels",
    items: [{ href: "/acquisition/funnels", label: "Funnel Canvas" }],
  },
  {
    id: "analytics",
    title: "Analytics",
    items: [{ href: "/acquisition/analytics", label: "Acquisition Analytics" }],
  },
];

export default function AcquisitionLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFunnels = pathname === "/acquisition/funnels" || pathname?.startsWith("/acquisition/funnels/");
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  // Determine active pillar based on route
  const getActiveGroup = () => {
    for (const group of navGroups) {
      if (group.items.some((item) => pathname === item.href || (item.href !== "/acquisition" && pathname?.startsWith(item.href)))) {
        return group.id;
      }
    }
    return null;
  };

  const currentGroup = activeGroup || getActiveGroup() || "content";

  return (
    <div className={`flex flex-col min-w-0 ${isFunnels ? "h-[calc(100vh-72px)] overflow-hidden" : "h-full overflow-y-auto"}`}>
      {/* Top Header - Level 1 Pillars in classic ASENZO clean design */}
      <div className="sticky top-0 z-30 bg-background border-b border-border shrink-0">
        <div className="max-w-[1400px] mx-auto px-8 flex items-center justify-between h-11 text-[12px]">
          <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
            <Link
              href="/acquisition"
              className={`px-3 py-1.5 rounded-md font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                pathname === "/acquisition"
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              Command Center
            </Link>

            <div className="h-4 w-[1px] bg-slate-200 mx-1 shrink-0" />

            {navGroups.map((group) => {
              const isGroupActive = currentGroup === group.id;
              const primaryHref = group.items[0]?.href || "/acquisition";
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

            <div className="h-4 w-[1px] bg-slate-200 mx-1 shrink-0" />

            <Link
              href="/acquisition/library"
              className={`px-3 py-1.5 rounded-md font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                pathname === "/acquisition/library"
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              Library
            </Link>
          </div>
        </div>

        {/* Level 2 Sub-Navigation Bar */}
        {pathname !== "/acquisition" && pathname !== "/acquisition/library" && (
          <div className="bg-slate-50/80 border-t border-slate-200 px-8 py-1.5">
            <div className="max-w-[1400px] mx-auto flex items-center gap-2 overflow-x-auto text-[11px]">
              {navGroups
                .find((g) => g.id === currentGroup)
                ?.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/acquisition" && pathname?.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-2.5 py-1 rounded transition-colors font-semibold ${
                        isActive
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
      <main className={isFunnels ? "flex-1 overflow-hidden" : "flex-1 max-w-[1400px] mx-auto w-full"}>
        {children}
      </main>
    </div>
  );
}


