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
  // (using var(--inverse-surface) for primary apple-style black buttons as specified in styles.css)
  const baseClasses = "inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all duration-150 whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary";
  
  const sizeClasses = {
    sm: "h-8 px-3.5 text-xs",
    md: "h-10 px-5 text-[13.5px]",
    lg: "h-12 px-6 text-sm",
    icon: "h-9 w-9 rounded-full",
  };

  const variantClasses = {
    primary: "bg-[var(--color-apple-black)] text-white shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:bg-[#242428] hover:-translate-y-[1px]",
    secondary: "bg-surface text-on-surface border border-[rgba(0,0,0,0.08)] shadow-card hover:bg-surface-dim",
    outline: "bg-transparent text-on-surface border border-outline-variant hover:bg-surface-container",
    ghost: "bg-transparent text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
    danger: "bg-error text-white hover:bg-[#DC2626]",
    icon: "bg-surface text-on-surface-variant shadow-card hover:bg-surface-dim",
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
