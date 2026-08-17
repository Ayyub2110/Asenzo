import React from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "icon";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
}

export function Button({
  className = "",
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  isLoading,
  children,
  disabled,
  ...props
}: ButtonProps) {
  
  // Base classes implementing the Stitch Ambient OS logic
  const baseClasses = "inline-flex items-center justify-center gap-2 rounded-lg font-bold transition-all duration-150 whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-electric-blue";
  
  const sizeClasses = {
    sm: "h-8 px-3.5 text-xs",
    md: "h-10 px-5 text-[13.5px]",
    lg: "h-12 px-6 text-sm",
    icon: "h-9 w-9 rounded-lg",
  };

  const variantClasses = {
    primary: "bg-slate-900 text-white shadow-sm hover:bg-slate-800 hover:-translate-y-[1px]",
    secondary: "bg-white text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-50",
    outline: "bg-transparent text-slate-700 border border-slate-200 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    danger: "bg-red-600 text-white shadow-sm hover:bg-red-700",
    icon: "bg-white text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-50",
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabled || isLoading ? "opacity-60 cursor-not-allowed pointer-events-none" : ""} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
      ) : icon && iconPosition === "left" ? (
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
      ) : null}
      
      {children}
      
      {!isLoading && icon && iconPosition === "right" && (
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
      )}
    </button>
  );
}
