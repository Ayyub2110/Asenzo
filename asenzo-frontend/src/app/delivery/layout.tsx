import React from "react";
import Link from "next/link";
import { headers } from "next/headers";

export default async function DeliveryLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const currentPath = headersList.get("x-invoke-path") || "/delivery";

  const tabs = [
    { label: "Delivery Command", href: "/delivery" },
    { label: "Onboarding", href: "/delivery/onboarding" },
    { label: "Client Portal", href: "/delivery/clients" },
    { label: "Engagements", href: "/delivery/engagements" },
    { label: "Milestones", href: "/delivery/milestones" },
    { label: "Deliverables", href: "/delivery/deliverables" },
    { label: "Communication", href: "/delivery/communication" },
    { label: "Health", href: "/delivery/health" },
    { label: "Reporting", href: "/delivery/reporting" },
    { label: "Retention & Proof", href: "/delivery/retention" }
  ];

  return (
    <div className="flex flex-col h-full bg-background relative overflow-y-auto min-w-0">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/50 shrink-0">
        <div className="max-w-[1500px] w-full mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center w-full">
            <nav className="flex gap-1 overflow-x-auto hide-scrollbar w-full">
              {tabs.map((tab) => {
                const isActive = tab.href === "/delivery" ? currentPath === "/delivery" : currentPath.startsWith(tab.href);
                return (
                  <Link 
                    key={tab.label} 
                    href={tab.href}
                    className={`px-3 py-1.5 rounded-[6px] text-[12px] font-semibold transition-colors whitespace-nowrap ${isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}
                  >
                    {tab.label}
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
