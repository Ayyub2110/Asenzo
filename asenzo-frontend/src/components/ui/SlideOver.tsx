"use client";

import React, { useEffect } from "react";

export interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: "md" | "lg" | "xl";
  headerContent?: React.ReactNode;
}

export function SlideOver({ isOpen, onClose, title, subtitle, children, width = "lg", headerContent }: SlideOverProps) {
  
  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClass = {
    md: "max-w-md",
    lg: "max-w-xl",
    xl: "max-w-3xl",
  }[width];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div 
          className={`w-screen ${widthClass} transform transition-transform duration-300 ease-in-out sm:duration-500 animate-in slide-in-from-right`}
        >
          <div className="flex h-full flex-col bg-surface shadow-2xl border-l border-outline-variant">
            {/* Header */}
            {(title || headerContent) && (
              <div className="px-6 py-5 border-b border-outline-variant flex items-start justify-between bg-surface-container-lowest">
                <div className="flex-1 pr-4">
                  {title && <h2 className="text-xl font-display font-bold text-on-surface">{title}</h2>}
                  {subtitle && <p className="text-[13px] text-on-surface-variant mt-1">{subtitle}</p>}
                  {headerContent}
                </div>
                <button 
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant flex-shrink-0"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            )}
            
            {/* Body */}
            <div className="relative flex-1 overflow-y-auto bg-background">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
