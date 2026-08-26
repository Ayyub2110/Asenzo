"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", icon: "dashboard", label: "Command Center" },
  { href: "/foundation", icon: "account_balance", label: "Foundation" },
  { href: "/acquisition", icon: "radar", label: "Acquisition" },
  { href: "/conversion", icon: "query_stats", label: "Conversion" },
  { href: "/delivery", icon: "check_circle", label: "Delivery" },
  { href: "/retention", icon: "favorite", label: "Retention" },
  { href: "/settings", icon: "settings", label: "Settings" }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside 
      className="flex flex-shrink-0 h-screen w-[260px] z-50 flex-col pt-8 pb-5 px-3 rounded-r-none border-r border-sidebar-border bg-sidebar"
    >
      <div className="mb-8 px-3 flex items-center gap-3">
        <div className="w-[32px] h-[32px] rounded-lg bg-card/5 flex items-center justify-center border border-sidebar-border/50 shadow-sm shrink-0">
            <span className="material-symbols-outlined text-sidebar-foreground text-[16px]" style={{ fontVariationSettings: "'FILL' 0" }}>terminal</span>
        </div>
        <div className="flex flex-col min-w-0">
            <h1 className="text-[14px] font-bold text-sidebar-foreground tracking-tight leading-none mb-1">ASENZO OS</h1>
            <span className="text-[11px] text-sidebar-muted font-medium leading-none">Founder Control</span>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto overflow-x-hidden hide-scrollbar px-1 mt-4">
        <ul className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href) && item.href !== '/' || (pathname === '/' && item.href === '/');
            
            if (isActive) {
              return (
                <li key={item.href}>
                  <Link 
                    href={item.href} 
                    className="group flex items-center bg-muted text-foreground rounded-md px-2.5 h-[32px] transition-transform duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="material-symbols-outlined text-[18px] mr-2.5" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                    <span className="text-[13px] font-semibold">{item.label}</span>
                  </Link>
                </li>
              );
            }
            
            return (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  className="group flex items-center text-muted-foreground hover:bg-muted hover:text-foreground rounded-md px-2.5 h-[32px] transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="material-symbols-outlined text-muted-foreground text-[18px] mr-2.5 group-hover:text-muted-foreground transition-colors">{item.icon}</span>
                  <span className="text-[13px] font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-6 px-1">
        <div className="bg-transparent border-t border-sidebar-border/50 pt-4 flex flex-col">
            <div className="flex items-center gap-2 mb-2 px-2">
              <span className="material-symbols-outlined text-cyan text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="text-[11px] font-bold text-sidebar-foreground tracking-widest uppercase">Pro Access</span>
            </div>
            <p className="px-2 text-[12px] text-sidebar-muted leading-relaxed font-medium mb-3">
                Unlock advanced intelligence, automation and AI workforce.
            </p>
            <button className="h-[32px] border border-sidebar-border text-sidebar-foreground hover:bg-sidebar-hover hover:border-sidebar-muted rounded-md text-[12px] font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-muted w-[90%] mx-2 text-center">
                Upgrade
            </button>
        </div>
      </div>
    </aside>
  );
}
