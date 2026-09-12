"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function OperationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const navItems = [
    { label: "Command Center", href: "/operations" },
    { label: "Work", href: "/operations/work" },
    { label: "Team", href: "/operations/team" },
    { 
      label: "Systems", 
      href: "#",
      subItems: [
        { label: "SOPs", href: "/operations/systems/sops" },
        { label: "Workflows", href: "/operations/systems/workflows" }
      ]
    },
    { 
      label: "Control", 
      href: "#",
      subItems: [
        { label: "Approvals", href: "/operations/control/approvals" },
        { label: "Quality", href: "/operations/control/quality" },
        { label: "Issues", href: "/operations/control/issues" }
      ]
    },
    { label: "Planning", href: "/operations/planning" },
    { label: "Analytics", href: "/operations/analytics" }
  ];

  return (
    <div className="flex flex-col h-full bg-background relative overflow-y-auto min-w-0" onClick={() => setOpenDropdown(null)}>
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/50 shrink-0">
        <div className="max-w-[1500px] w-full mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center w-full">
            <nav className="flex gap-1 items-center w-full relative">
              {navItems.map((item) => {
                if (item.subItems) {
                  const isActive = pathname?.startsWith('/operations/systems') && item.label === 'Systems' 
                                || pathname?.startsWith('/operations/control') && item.label === 'Control';
                  return (
                    <div key={item.label} className="relative" onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === item.label ? null : item.label); }}>
                      <button 
                        className={`px-3 py-1.5 rounded-[6px] text-[12px] font-semibold transition-colors flex items-center gap-1 ${isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}
                      >
                        {item.label} <span className="text-[10px]">▼</span>
                      </button>
                      {openDropdown === item.label && (
                        <div className="absolute top-full left-0 mt-2 min-w-[150px] bg-card border border-border rounded-lg shadow-lg py-1 z-50">
                          {item.subItems.map(sub => (
                            <Link 
                               key={sub.label} 
                               href={sub.href}
                               className={`block px-4 py-2 text-[12px] font-medium hover:bg-secondary transition-colors ${pathname === sub.href ? 'text-foreground bg-secondary/30' : 'text-muted-foreground'}`}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                const isActive = item.href === "/operations" 
                  ? pathname === "/operations" 
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
          </div>
        </div>
      </header>
      
      <main className="flex-1 max-w-[1500px] mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
