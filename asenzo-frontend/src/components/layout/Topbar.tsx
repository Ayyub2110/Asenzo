"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function Topbar() {
  const pathname = usePathname();

  const getPageTitle = (path: string) => {
    if (path === "/" || path === "/command-center") return "Command Center";
    if (path.startsWith("/foundation")) return "Foundation";
    if (path.startsWith("/attention")) return "Attention OS";
    if (path.startsWith("/acquisition")) return "Acquisition";
    if (path.startsWith("/conversion")) return "Conversion OS";
    if (path.startsWith("/revenue")) return "Revenue OS";
    if (path.startsWith("/delivery")) return "Delivery OS";
    if (path.startsWith("/retention")) return "Retention OS";
    if (path.startsWith("/intelligence")) return "Intelligence Center";
    if (path.startsWith("/operations")) return "Operations Center";
    if (path.startsWith("/ai-workforce")) return "AI Workforce";
    if (path.startsWith("/resources")) return "Resources";
    if (path.startsWith("/settings")) return "Settings";
    if (path.startsWith("/calendar")) return "Calendar";
    return "Asenzo OS";
  };

  const getPageSubtitle = (path: string) => {
    if (path.startsWith("/intelligence")) return "Strategic analysis across all operating centers. What is happening, why, and what to do next.";
    if (path.startsWith("/acquisition")) return "Traffic, Attention, and Lead Generation";
    if (path.startsWith("/conversion")) return "Lead Nurture, Triage, and Conversion";
    if (path.startsWith("/revenue")) return "Sales Pipeline and Revenue Operations";
    if (path.startsWith("/delivery")) return "Client Services and Fulfillment Engine";
    if (path.startsWith("/operations")) return "Team, Workflows, and Process Management";
    if (path.startsWith("/foundation")) return "The core business ecosystem and blueprint.";
    return "Monday, August 17 · Business Overview";
  };

  return (
    <header className="px-12 h-[72px] flex justify-between items-center w-full shrink-0 border-b border-border/50">
      <div className="flex flex-col justify-center">
        <h2 className="text-[14px] font-semibold tracking-wide text-foreground uppercase mb-[2px]">{getPageTitle(pathname)}</h2>
        <span className="text-[12px] text-muted-foreground">{getPageSubtitle(pathname)}</span>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative w-[340px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 text-[16px]" style={{ fontVariationSettings: "'FILL' 0" }}>search</span>
          <input 
            className="w-full h-[32px] pl-[34px] pr-10 rounded-md bg-muted/60 border border-transparent focus:bg-card focus:outline-none focus:ring-1 focus:ring-border focus:border-border text-foreground text-[13px] shadow-sm transition-all placeholder:text-muted-foreground/70" 
            placeholder="Search anything..." 
            type="text"
            readOnly 
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-card border border-border shadow-sm rounded flex items-center justify-center px-1.5 h-[20px]">
            <span className="text-[10px] font-semibold text-muted-foreground leading-none">⌘ K</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="w-[32px] h-[32px] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors relative focus:outline-none focus:ring-1 focus:ring-ring">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-[6px] right-[6px] w-[6px] h-[6px] bg-destructive rounded-full border border-card shadow-sm"></span>
          </button>
          
          <div className="flex items-center cursor-pointer group rounded-full overflow-hidden focus-within:ring-1 focus-within:ring-ring">
            <div className="w-[32px] h-[32px] bg-card border border-border shadow-sm flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                alt="Profile" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvKuTHxQEBhtUL1Xk6_BbKmJGggF7YOqSolpY8tUenyc5O6sLzEPwbvr5nKiw0BwbDEopuoK6RBhPB6hyGUUD7pj_9Au_7bAmPWEXASC7AuQGibBo-YjQ4w_CgGesTLbqq1QnfOf5FO3YpR0AwHvSj3NXt2TbPdXMPX-XkxrnTEyhK-xYNTEfFOSJyHiW-Wrr1tXQSSW8cYvj3Sx5msyX1xWfTB5zux4WkR2aKVjRldGr2Vcp8gGPs7Q"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
