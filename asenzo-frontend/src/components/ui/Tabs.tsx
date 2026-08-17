import React from "react";

export interface Tab {
  id: string;
  label: string;
  icon?: string;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: "line" | "pill";
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, variant = "pill", className = "" }: TabsProps) {
  if (variant === "line") {
    return (
      <div className={`flex border-b border-outline-variant ${className}`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-[13.5px] font-bold transition-all relative
                ${isActive ? "text-on-surface" : "text-on-surface-variant hover:text-on-surface hover:bg-surface-dim"}`}
            >
              {tab.icon && <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>}
              {tab.label}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Pill variant (used in modal sub-menus as engine-tab-bar)
  return (
    <div className={`flex flex-wrap gap-2 p-1 bg-surface-container rounded-xl ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] transition-all flex-1 justify-center min-w-[120px]
              ${isActive ? "bg-surface shadow-[0_2px_8px_rgba(0,0,0,0.06)] text-on-surface font-bold" : "text-on-surface-variant hover:bg-[rgba(255,255,255,0.4)] font-medium"}`}
          >
            {tab.icon && <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
