import React from "react";

export type BadgeVariant = 
  | "neutral" 
  | "primary" 
  | "success" 
  | "warning" 
  | "danger" 
  | "dark";

type BadgeSize = "sm" | "md";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  statusIndicator?: boolean; // Adds a small colored dot
}

export function Badge({ 
  variant = "neutral", 
  size = "md", 
  statusIndicator = false, 
  className = "", 
  children, 
  ...props 
}: BadgeProps) {
  
  const baseClasses = "inline-flex items-center justify-center font-bold whitespace-nowrap rounded-full";
  
  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] uppercase tracking-wide",
    md: "px-2.5 py-1 text-[11px] uppercase tracking-wider",
  };

  const variantClasses = {
    neutral: "bg-surface-container-high text-on-surface-variant",
    primary: "bg-primary-container text-on-primary-container",
    success: "bg-secondary-container text-on-secondary-container",
    warning: "bg-orange-100 text-orange-800",
    danger: "bg-error-container text-on-error-container",
    dark: "bg-[#121214] text-white",
  };

  // Maps the variant to its corresponding dot color
  const dotColorClasses = {
    neutral: "bg-on-surface-variant",
    primary: "bg-primary",
    success: "bg-secondary",
    warning: "bg-orange-500",
    danger: "bg-error",
    dark: "bg-white",
  };

  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`} {...props}>
      {statusIndicator && (
        <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${dotColorClasses[variant]}`} />
      )}
      {children}
    </span>
  );
}
