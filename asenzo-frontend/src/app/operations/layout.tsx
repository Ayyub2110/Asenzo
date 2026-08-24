"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function OperationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const tabs = [
    { label: "Operations Command", href: "/operations" },
    { label: "Team", href: "/operations/team" },
    { label: "Roles & Ownership", href: "/operations/roles" },
    { label: "Tasks", href: "/operations/tasks" },
    { label: "SOPs", href: "/operations/sops" },
    { label: "Workflows", href: "/operations/workflows" },
    { label: "Approvals", href: "/operations/approvals" },
    { label: "Quality Control", href: "/operations/quality" },
    { label: "Capacity", href: "/operations/capacity" },
    { label: "Escalations", href: "/operations/escalations" },
    { label: "Growth Schedule", href: "/operations/schedule" }
  ];

  return (
    <div className="flex flex-col h-full bg-background min-h-screen">
      <div className="pt-6 px-6 md:px-10 max-w-[1500px] mx-auto w-full">
        <h1 className="text-[22px] md:text-[28px] font-bold text-foreground leading-tight tracking-tight mb-2 uppercase">OPERATIONS CENTER</h1>
        <p className="text-[14px] text-muted-foreground font-medium mb-8 max-w-3xl">Coordinates people, tasks, SOPs, workflows, and approvals for the ASENZO growth operating system.</p>

        <div className="border-b border-border overflow-x-auto pb-4 scrollbar-none whitespace-nowrap">
           <nav className="flex gap-2">
             {tabs.map(tab => {
                const isActive = tab.href === "/operations" 
                  ? pathname === "/operations" 
                  : pathname?.startsWith(tab.href);
                return (
                  <Link 
                    key={tab.href}
                    href={tab.href}
                    className={`px-4 py-2 text-[12px] font-bold uppercase tracking-widest rounded-full transition-colors ${
                      isActive 
                        ? 'bg-foreground text-background' 
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    }`}
                  >
                    {tab.label}
                  </Link>
                )
             })}
           </nav>
        </div>
      </div>
      
      <main className="flex-1 max-w-[1500px] mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
