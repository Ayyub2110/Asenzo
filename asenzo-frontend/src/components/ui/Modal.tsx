"use client";

import React, { useEffect } from "react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  size?: "md" | "lg" | "xl";
  actions?: React.ReactNode;
  headerBadge?: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, subtitle, children, size = "md", actions, headerBadge }: ModalProps) {
  
  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClass = {
    md: "max-w-[500px]",
    lg: "max-w-[760px]",
    xl: "max-w-[960px]"
  }[size];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className={`w-full bg-surface rounded-[24px] shadow-2xl flex flex-col overflow-hidden max-h-[90vh] animate-in zoom-in-95 duration-200 ${sizeClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-outline-variant">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-[22px] font-display font-bold text-on-surface tracking-tight leading-tight">{title}</h2>
              {headerBadge}
            </div>
            {subtitle && <p className="text-[13.5px] text-on-surface-variant mt-1.5">{subtitle}</p>}
          </div>
          
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
        
        {/* Body */}
        <div className="overflow-y-auto p-6 flex-1 bg-surface">
          {children}
        </div>
        
        {/* Footer Actions */}
        {actions && (
          <div className="px-6 py-4 bg-surface-container-lowest border-t border-outline-variant flex items-center justify-end gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
