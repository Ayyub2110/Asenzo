"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// The navigation menu following frozen Phase 2 PRD
const navItems = [
  { href: "/", icon: "dashboard", label: "Dashboard" },
  { href: "/foundation", icon: "architecture", label: "Foundation" },
  { href: "/attention", icon: "campaign", label: "Attention" },
  { href: "/conversion", icon: "query_stats", label: "Conversion" },
  { href: "/delivery", icon: "check_circle", label: "Delivery" },
  { href: "/retention", icon: "autorenew", label: "Retention" },
  { href: "/revenue", icon: "payments", label: "Revenue" },
  { href: "/operator", icon: "terminal", label: "Operator" },
  { href: "/calendar", icon: "event", label: "Calendar" },
  { href: "/settings", icon: "settings", label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside 
      className="fixed flex h-screen w-[256px] left-0 top-0 z-50 flex-col py-5 px-3"
      style={{
        background: "linear-gradient(180deg, #0B0C0E 0%, #1D1D1F 100%)",
        borderRight: "1px solid rgba(255, 255, 255, 0.1)"
      }}
    >
      <div className="mb-8 px-3 flex flex-col items-start gap-1">
        <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">Founder Control</span>
        <h1 className="text-xl font-bold text-white tracking-tight leading-none">Asenzo OS</h1>
      </div>

      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto hide-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          if (isActive) {
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className="group flex items-center bg-white text-slate-900 rounded-full px-3 py-2.5 scale-[1.01] shadow-md transition-transform duration-150 ease-out"
              >
                <span className="material-symbols-outlined text-[18px] mr-2.5" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                <span className="text-[13px] font-semibold">{item.label}</span>
              </Link>
            );
          }
          
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className="group flex items-center text-slate-300 hover:bg-white/10 hover:text-white rounded-full px-3 py-2.5 transition-colors duration-150 ease-out"
            >
              <span className="material-symbols-outlined text-[18px] mr-2.5 opacity-80 group-hover:opacity-100 transition-opacity">{item.icon}</span>
              <span className="text-[13px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 px-1">
        <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/5" style={{ WebkitBackdropFilter: "blur(12px)" }}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-widest">Plan</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald"></span>
          </div>
          <p className="text-[13px] font-semibold text-white mb-0.5">Growth OS Active</p>
          <p className="text-[11px] text-slate-400 mb-3 line-clamp-1">32/100 Diagnostics</p>
          <button className="w-full py-1.5 px-3 bg-white/10 hover:bg-white/20 text-white rounded-md text-[11px] font-semibold transition-colors duration-150">
            View Details
          </button>
        </div>
      </div>
    </aside>
  );
}
