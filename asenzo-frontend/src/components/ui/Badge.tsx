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
  
  const baseClasses = "inline-flex items-center justify-center font-bold whitespace-nowrap rounded-md";
  
  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] uppercase tracking-wide",
    md: "px-2.5 py-1 text-[11px] uppercase tracking-wider",
  };

  const variantClasses = {
    neutral: "bg-slate-100 text-slate-600",
    primary: "bg-electric-blue/10 text-electric-blue",
    success: "bg-emerald/10 text-emerald",
    warning: "bg-amber-100 text-amber-600",
    danger: "bg-red-50 text-red-600",
    dark: "bg-slate-900 text-white",
  };

  // Maps the variant to its corresponding dot color
  const dotColorClasses = {
    neutral: "bg-slate-500",
    primary: "bg-electric-blue",
    success: "bg-emerald",
    warning: "bg-amber-500",
    danger: "bg-red-500",
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
