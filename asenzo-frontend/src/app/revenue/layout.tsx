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
    <div className="flex flex-col h-full w-full bg-background overflow-hidden relative">
      <div className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-[1500px] mx-auto px-6 hide-scrollbar overflow-x-auto">
          <nav className="flex space-x-6 h-12">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`relative flex items-center h-full text-[12px] font-bold tracking-widest uppercase transition-colors whitespace-nowrap ${
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground w-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
         {children}
      </div>
    </div>
  );
}
