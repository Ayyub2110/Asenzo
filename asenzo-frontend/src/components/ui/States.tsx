import React from "react";

export interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon = "inbox", title, description, action, className = "" }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-surface-container-low border border-dashed border-outline-variant ${className}`}>
      <div className="w-16 h-16 bg-surface flex items-center justify-center rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.05)] text-on-surface-variant mb-5">
        <span className="material-symbols-outlined text-[32px]">{icon}</span>
      </div>
      <h3 className="font-display font-bold text-lg text-on-surface mb-2">{title}</h3>
      <p className="text-[13.5px] text-on-surface-variant max-w-[400px] leading-relaxed mb-6">
        {description}
      </p>
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
}

export interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-surface-container-high rounded-md ${className}`} />
  );
}

// Reusable preset skeletons
export function CardSkeleton() {
  return (
    <div className="p-5 bg-surface rounded-[var(--radius-md)] border border-outline-variant flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <Skeleton className="w-12 h-12 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="h-4 w-1/3 mb-2" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <Skeleton className="h-16 w-full mt-2" />
    </div>
  );
}
