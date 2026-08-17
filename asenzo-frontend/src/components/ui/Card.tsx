import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "elevated" | "flat" | "outlined" | "metric";
  interactive?: boolean;
}

export function Card({ className = "", variant = "elevated", interactive = false, children, ...props }: CardProps) {
  const baseClasses = "rounded-xl transition-all duration-200 ease-out block w-full";
  
  const variantClasses = {
    elevated: "bg-surface-container-lowest border border-outline-variant/30 shadow-sm p-6",
    flat: "bg-surface-container-low border border-transparent p-6",
    outlined: "bg-surface-container-lowest border border-outline-variant shadow-none p-6",
    metric: "metric-card shadow-ambient p-6 bg-surface-container-lowest border border-outline-variant/10 rounded-xl"
  };

  const interactiveClasses = interactive
    ? "cursor-pointer hover:scale-[1.01] hover:shadow-xl"
    : "";

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${interactiveClasses} ${className}`} {...props}>
      {children}
    </div>
  );
}

// Subcomponents for Card
export function CardHeader({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`flex items-start justify-between mb-6 ${className}`} {...props}>{children}</div>;
}

export function CardTitle({ className = "", children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`font-bold text-slate-900 text-xl tracking-tight ${className}`} {...props}>{children}</h3>;
}

export function CardDescription({ className = "", children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`text-slate-500 text-sm mt-1 leading-snug ${className}`} {...props}>{children}</p>;
}
