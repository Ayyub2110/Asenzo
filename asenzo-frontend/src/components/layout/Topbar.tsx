"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function Topbar() {
  const pathname = usePathname();

  const getPageTitle = (path: string) => {
    switch (path) {
      case "/": return "Command Center";
      case "/foundation": return "Foundation";
      case "/attention": return "Attention OS";
      case "/conversion": return "Conversion OS";
      case "/delivery": return "Delivery OS";
      case "/retention": return "Retention OS";
      case "/revenue": return "Revenue OS";
      case "/intelligence": return "Intelligence";
      case "/ai-workforce": return "AI Workforce";
      case "/resources": return "Resources";
      case "/settings": return "Settings";
      default: return "Asenzo OS";
    }
  };

  return (
    <header className="px-12 h-[72px] flex justify-between items-center w-full shrink-0 border-b border-border/50">
      <div className="flex flex-col justify-center">
        <h2 className="text-[14px] font-semibold tracking-wide text-foreground uppercase mb-[2px]">{getPageTitle(pathname)}</h2>
        <span className="text-[12px] text-muted-foreground">Monday, August 17 · Business Overview</span>
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
