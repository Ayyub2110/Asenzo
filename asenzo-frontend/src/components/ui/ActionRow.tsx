import React from "react";

export interface ActionRowProps {
  title: string;
  subtitle?: string;
  icon?: string;
  iconClass?: string;
  badge?: React.ReactNode;
  rightElement?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function ActionRow({
  title,
  subtitle,
  icon,
  iconClass = "bg-primary-fixed text-primary",
  badge,
  rightElement,
  onClick,
  className = "",
}: ActionRowProps) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 p-3 bg-surface rounded-xl border border-transparent shadow-[var(--shadow-card)] transition-all duration-200
        ${onClick ? "cursor-pointer hover:border-outline-variant hover:shadow-[var(--shadow-hover)] hover:-translate-y-[1px]" : ""} 
        ${className}
      `}
    >
      {/* Icon Area */}
      {icon && (
        <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg ${iconClass}`}>
          <span className="material-symbols-outlined object-contain">{icon}</span>
        </div>
      )}
      
      {/* Text Area */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-[13.5px] font-bold text-on-surface truncate leading-tight">{title}</h4>
          {badge && <div>{badge}</div>}
        </div>
        {subtitle && (
          <p className="text-[11.5px] text-on-surface-variant truncate mt-0.5">{subtitle}</p>
        )}
      </div>
      
      {/* Right Element / Action (e.g. Buttons or time labels) */}
      {rightElement && (
        <div className="flex-shrink-0 pr-1">
          {rightElement}
        </div>
      )}
      
      {/* Chevron if clickable and no override */}
      {onClick && !rightElement && (
        <div className="flex-shrink-0 text-outline px-1">
          <span className="material-symbols-outlined text-[20px]">chevron_right</span>
        </div>
      )}
    </div>
  );
}
