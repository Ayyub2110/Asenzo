"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function IntelligenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const tabs = [
    { label: "Business Pulse", href: "/intelligence" },
    { label: "Constraints", href: "/intelligence/constraints" },
    { label: "Opportunities", href: "/intelligence/opportunities" },
    { label: "Risks", href: "/intelligence/risks" },
    { label: "Attribution", href: "/intelligence/attribution" },
    { label: "Channel Performance", href: "/intelligence/channels" },
    { label: "Content-to-Revenue", href: "/intelligence/content-revenue" },
    { label: "Founder Independence", href: "/intelligence/founder-independence" },
    { label: "Recommendations", href: "/intelligence/recommendations" },
    { label: "Strategic Reviews", href: "/intelligence/reviews" }
  ];

  return (
    <div className="flex flex-col h-full bg-background min-h-screen">
      <div className="pt-6 px-6 md:px-10 max-w-[1500px] mx-auto w-full">
        <h1 className="text-[22px] md:text-[28px] font-bold text-foreground leading-tight tracking-tight mb-2 uppercase flex items-center gap-2">
           <span className="material-symbols-outlined text-[28px]">neurology</span> INTELLIGENCE CENTER
        </h1>
        <p className="text-[14px] text-muted-foreground font-medium mb-8 max-w-3xl">Strategic analysis across all operating centers. What is happening, why, and what to do next.</p>

        <div className="border-b border-border overflow-x-auto pb-4 scrollbar-none whitespace-nowrap">
           <nav className="flex gap-2">
             {tabs.map(tab => {
                const isActive = tab.href === "/intelligence" 
                  ? pathname === "/intelligence" 
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
