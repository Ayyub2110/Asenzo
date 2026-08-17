import React from "react";

export type AlertVariant = "info" | "success" | "warning" | "danger";

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  icon?: string;
  className?: string;
  onDismiss?: () => void;
}

export function Alert({ variant = "info", title, children, icon, className = "", onDismiss }: AlertProps) {
  
  const variantStyles = {
    info: "bg-surface-container-high border-outline-variant text-on-surface",
    success: "bg-secondary-container border-[#A7F3D0] text-on-secondary-container",
    warning: "bg-orange-50 border-orange-200 text-orange-900",
    danger: "bg-error-container border-[#FECACA] text-on-error-container",
  };

  const defaultIcons = {
    info: "info",
    success: "check_circle",
    warning: "warning",
    danger: "error",
  };

  const displayIcon = icon || defaultIcons[variant];

  return (
    <div className={`p-4 rounded-xl border flex items-start gap-3 ${variantStyles[variant]} ${className}`}>
      <span className="material-symbols-outlined mt-0.5" style={{ fontSize: "20px" }}>{displayIcon}</span>
      
      <div className="flex-1 min-w-0">
        {title && <h4 className="font-bold text-[13.5px] tracking-tight mb-1">{title}</h4>}
        <div className="text-[12.5px] leading-relaxed opacity-90">
          {children}
        </div>
      </div>
      
      {onDismiss && (
        <button 
          onClick={onDismiss}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors -mr-1 -mt-1 opacity-70 hover:opacity-100"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      )}
    </div>
  );
}
