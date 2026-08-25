"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RevenueLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Command", path: "/revenue" },
    { name: "Sales Pipeline", path: "/revenue/pipeline" },
    { name: "Closer Room", path: "/revenue/closer" },
    { name: "Playbook", path: "/revenue/playbook" },
    { name: "Proposals", path: "/revenue/proposals" },
    { name: "Follow-ups", path: "/revenue/followups" },
    { name: "Objection Library", path: "/revenue/objections" },
    { name: "Revenue Dashboard", path: "/revenue/analytics" },
    { name: "Closed-Lost Learning", path: "/revenue/lost" },
  ];

  return (
    <div className="flex flex-col h-full bg-background relative overflow-y-auto min-w-0">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/50 shrink-0">
        <div className="max-w-[1500px] w-full mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center w-full">
            <nav className="flex gap-1 overflow-x-auto hide-scrollbar w-full">
              {navItems.map((item) => {
                const isActive = pathname === item.path || pathname?.startsWith(item.path + '/');
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`px-3 py-1.5 rounded-[6px] text-[12px] font-semibold transition-colors whitespace-nowrap ${isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>
      
      <main className="flex-1 max-w-[1500px] mx-auto w-full">
         {children}
      </main>
    </div>
  );
}
