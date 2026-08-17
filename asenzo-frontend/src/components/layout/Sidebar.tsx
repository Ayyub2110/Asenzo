"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// The navigation menu following frozen Phase 2 PRD
const navItems = [
  { href: "/", icon: "dashboard", label: "Command Center", sub: "Execution Hub", badge: 3 },
  { href: "/foundation", icon: "architecture", label: "Foundation", sub: "Business DNA" },
  { href: "/attention", icon: "campaign", label: "Attention", sub: "Content Engine" },
  { href: "/conversion", icon: "query_stats", label: "Conversion", sub: "Pipeline" },
  { divider: "Execution" },
  { href: "/delivery", icon: "check_circle", label: "Delivery", sub: "Fulfillment" },
  { href: "/retention", icon: "autorenew", label: "Retention", sub: "Compound Value" },
  { divider: "System" },
  { href: "/settings", icon: "settings", label: "Settings", sub: "Preferences" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Brand & Collapse */}
      <div className="sb-top">
        <div className="sb-brand">
          <div className="sb-logo">
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>view_in_ar</span>
          </div>
          <span className="sb-title">ASENZO</span>
        </div>
        <button className="sb-collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
            {collapsed ? "chevron_right" : "chevron_left"}
          </span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="sb-nav hide-scrollbar">
        {navItems.map((item, idx) => {
          if (item.divider) {
            return (
              <div key={`div-${idx}`} className="sb-divider">
                <span className="sb-divider-label">{item.divider}</span>
                <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }}></div>
              </div>
            );
          }

          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href!} className={`sb-item ${isActive ? "active" : ""}`}>
              <span className="material-symbols-outlined">{item.icon}</span>
              <div className="sb-label-group">
                <span className="sb-label">{item.label}</span>
                <span className="sb-label-sub">{item.sub}</span>
              </div>
              {item.badge && <span className="sb-action-badge">{item.badge}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade / FIS Context */}
      <div className="sb-upgrade-card">
        <div className="sb-upgrade-icon-wrap">
          <span className="material-symbols-outlined" style={{ color: "#fff", fontSize: "20px" }}>workspace_premium</span>
        </div>
        <div className="sb-upgrade-text">Founder Independence:<br/><strong>32/100 (Level 1)</strong></div>
        <button className="sb-upgrade-btn">View Diagnostics</button>
      </div>
    </aside>
  );
}
