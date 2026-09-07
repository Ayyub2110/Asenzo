"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [filterPeriod, setFilterPeriod] = useState("This Month");
  
  const navItems = [
    { label: "Command Center", href: "/analytics" },
    { label: "Business", href: "/analytics/business" },
    { label: "Acquisition", href: "/analytics/acquisition" },
    { label: "Conversion", href: "/analytics/conversion" },
    { label: "Revenue", href: "/analytics/revenue" },
    { label: "Delivery", href: "/analytics/delivery" },
    { label: "Operations", href: "/analytics/operations" },
    { label: "Insights", href: "/analytics/insights" },
  ];

  return (
    <div className="flex flex-col h-full bg-background relative overflow-y-auto">
      {/* Global Analytics Filter Bar */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/50 shrink-0">
        <div className="max-w-[1500px] w-full mx-auto px-6 h-16 flex items-center justify-between">
          <nav className="flex gap-1 items-center w-full relative">
            {navItems.map((item) => {
              const isActive = item.href === "/analytics" 
                ? pathname === "/analytics" 
                : pathname?.startsWith(item.href);
              return (
                <Link 
                  key={item.label} 
                  href={item.href}
                  className={`px-3 py-1.5 rounded-[6px] text-[12px] font-semibold transition-colors whitespace-nowrap ${isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          
          <div className="flex items-center gap-3 shrink-0 ml-6">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Period:</span>
            <select 
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="bg-card border border-border text-[12px] font-medium text-foreground rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>This Quarter</option>
              <option>This Year</option>
              <option>Previous Period</option>
              <option>All Time</option>
            </select>
          </div>
        </div>
      </header>
      
      <main className="flex-1 w-full max-w-[1500px] mx-auto">
        {children}
      </main>
    </div>
  );
}
