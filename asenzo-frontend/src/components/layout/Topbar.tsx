"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isSupabaseConnected } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    router.push("/login");
  };

  const getPageTitle = (path: string) => {
    if (path === "/" || path === "/command-center") return "Command Center";
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
    return "Monday, August 17 · Business Overview";
  };

  return (
    <header className="px-12 h-[72px] flex justify-between items-center w-full shrink-0 border-b border-border/50 bg-background relative z-40">
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

        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
          <button className="w-[32px] h-[32px] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors relative focus:outline-none focus:ring-1 focus:ring-ring">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-[6px] right-[6px] w-[6px] h-[6px] bg-destructive rounded-full border border-card shadow-sm"></span>
          </button>
          
          {/* User Profile Button */}
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-muted/80 transition-all focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <div className="w-[32px] h-[32px] bg-card border border-border shadow-sm rounded-full overflow-hidden flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                alt="Profile" 
                className="w-full h-full object-cover" 
                src={user?.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuCvKuTHxQEBhtUL1Xk6_BbKmJGggF7YOqSolpY8tUenyc5O6sLzEPwbvr5nKiw0BwbDEopuoK6RBhPB6hyGUUD7pj_9Au_7bAmPWEXASC7AuQGibBo-YjQ4w_CgGesTLbqq1QnfOf5FO3YpR0AwHvSj3NXt2TbPdXMPX-XkxrnTEyhK-xYNTEfFOSJyHiW-Wrr1tXQSSW8cYvj3Sx5msyX1xWfTB5zux4WkR2aKVjRldGr2Vcp8gGPs7Q"}
              />
            </div>
            <span className="material-symbols-outlined text-[18px] text-muted-foreground">
              {dropdownOpen ? "expand_less" : "expand_more"}
            </span>
          </button>

          {/* User Profile Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-12 w-68 bg-card border border-border shadow-2xl rounded-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-border/60 mb-2">
                <div className="text-xs font-semibold text-foreground truncate">
                  {user?.fullName || "Founder User"}
                </div>
                <div className="text-[11px] text-muted-foreground truncate">
                  {user?.email || "founder@asenzo.ai"}
                </div>
                <div className="mt-2.5 flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${user?.isDemo ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`} />
                  <span className={`text-[10px] font-medium ${user?.isDemo ? "text-amber-500" : "text-emerald-500"}`}>
                    {user?.isDemo ? "⚡ Demo Account (Read-Only)" : "🟢 Active Account (Full Read & Write Access)"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => { setDropdownOpen(false); router.push("/settings"); }}
                className="w-full px-3 py-2 text-xs text-foreground hover:bg-muted rounded-xl flex items-center gap-2.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-muted-foreground">settings</span>
                <span>Account Settings</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full px-3 py-2 text-xs text-destructive hover:bg-destructive/10 rounded-xl flex items-center gap-2.5 transition-colors mt-1"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
