"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function Topbar() {
  const pathname = usePathname();

  // Basic title mapping (In a real app, this would be dynamic based on the mock adapter)
  const getPageTitle = (path: string) => {
    switch (path) {
      case "/": return "Command Center";
      case "/foundation": return "Foundation";
      case "/attention": return "Attention";
      case "/conversion": return "Conversion";
      case "/delivery": return "Delivery";
      case "/retention": return "Retention";
      case "/settings": return "Settings";
      default: return "ASENZO OS";
    }
  };

  return (
    <header className="topbar">
      {/* Page Title Context */}
      <div className="topbar-title">
        {getPageTitle(pathname)}
      </div>

      {/* Command Palette Trigger */}
      <div className="topbar-search" onClick={() => alert("Cmd+K palette will open here")}>
        <span className="material-symbols-outlined" style={{ color: "var(--text-faint)", fontSize: "18px" }}>search</span>
        <input type="text" placeholder="Search ASENZO engines, run SOPs, ask AI..." readOnly style={{ pointerEvents: "none" }} />
        <div style={{ marginLeft: "auto", fontSize: "11px", fontWeight: 700, color: "var(--text-faint)", border: "1px solid var(--surface-variant)", padding: "2px 6px", borderRadius: "4px" }}>
          âŒ˜K
        </div>
      </div>

      {/* Utilities */}
      <div className="topbar-right">
        <div className="notif-wrap">
          <button className="notif-btn">
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>notifications</span>
          </button>
          <span className="notif-badge">3</span>
        </div>

        <div className="user-btn">
          <div style={{ width: "26px", height: "26px", borderRadius: "100%", background: "var(--text-main)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700 }}>
            CE
          </div>
          <span style={{ fontSize: "13px", fontWeight: 600 }}>Founder</span>
          <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--text-muted)" }}>expand_more</span>
        </div>
      </div>
    </header>
  );
}
