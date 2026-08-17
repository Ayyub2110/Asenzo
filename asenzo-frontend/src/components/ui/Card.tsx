import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "elevated" | "flat" | "outlined";
  interactive?: boolean;
}

export function Card({ className = "", variant = "elevated", interactive = false, children, ...props }: CardProps) {
  const baseClasses = "rounded-[var(--radius-md)] p-5 transition-all duration-200 block w-full";
  
  const variantClasses = {
    elevated: "bg-surface shadow-[var(--shadow-card)]",
    flat: "bg-surface-container border border-transparent",
    outlined: "bg-surface border border-outline-variant shadow-none",
  };

  const interactiveClasses = interactive
    ? "cursor-pointer hover:-translate-y-[2px] hover:shadow-[var(--shadow-hover)] hover:border-outline"
    : "";

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${interactiveClasses} ${className}`} {...props}>
      {children}
    </div>
  );
}

// Subcomponents for Card
export function CardHeader({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`flex items-start justify-between mb-4 ${className}`} {...props}>{children}</div>;
}

export function CardTitle({ className = "", children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`font-display font-bold text-on-surface text-base tracking-tight ${className}`} {...props}>{children}</h3>;
}

export function CardDescription({ className = "", children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`text-on-surface-variant text-xs mt-1 leading-snug ${className}`} {...props}>{children}</p>;
}
