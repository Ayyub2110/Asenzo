"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function Topbar() {
  const pathname = usePathname();

  const getPageTitle = (path: string) => {
    switch (path) {
      case "/": return "Dashboard";
      case "/foundation": return "Foundation";
      case "/attention": return "Attention";
      case "/conversion": return "Conversion";
      case "/delivery": return "Delivery";
      case "/retention": return "Retention";
      case "/revenue": return "Revenue";
      case "/operator": return "Operator";
      case "/calendar": return "Calendar";
      case "/settings": return "Settings";
      default: return "Asenzo OS";
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-canvas/80 backdrop-blur-md px-8 h-16 flex justify-between items-center w-full shrink-0 border-b border-outline-variant/30">
      <div>
        <h2 className="text-[22px] font-bold tracking-tight text-on-surface">{getPageTitle(pathname)}</h2>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative w-64 md:w-80">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
          <input 
            className="w-full h-10 pl-10 pr-4 rounded-full bg-surface border border-outline-variant focus:outline-none focus:ring-2 focus:ring-electric-blue text-on-surface text-[13px] shadow-sm transition-shadow" 
            placeholder="Search anything..." 
            type="text"
            readOnly 
          />
        </div>
        <div className="flex items-center gap-4">
          <button className="w-8 h-8 flex items-center justify-center text-outline hover:text-on-surface transition-colors relative">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-electric-blue rounded-full"></span>
          </button>
          
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-surface border border-outline-variant shadow-sm overflow-hidden flex items-center justify-center relative">
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
