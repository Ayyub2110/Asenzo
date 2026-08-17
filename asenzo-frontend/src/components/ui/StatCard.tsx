import React from "react";
import { Card } from "./Card";
import { Badge } from "./Badge";

export interface StatCardProps {
  title: string;
  value: string;
  subValue?: string;
  icon?: string;
  iconColorClass?: string;
  deltaText?: string;
  deltaTrend?: "up" | "down" | "neutral";
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
}

export function StatCard({
  title,
  value,
  subValue,
  icon,
  iconColorClass = "bg-purple-bg text-purple-accent",
  deltaText,
  deltaTrend,
  interactive = false,
  onClick,
  className = "",
}: StatCardProps) {
  return (
    <Card interactive={interactive} onClick={onClick} className={`flex flex-col justify-between ${className}`}>
      <div className="flex items-start justify-between mb-4">
        {icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconColorClass}`}>
            <span className="material-symbols-outlined">{icon}</span>
          </div>
        )}
        {deltaText && (
          <Badge 
            variant={deltaTrend === "up" ? "success" : deltaTrend === "down" ? "danger" : "neutral"} 
            size="sm"
          >
            {deltaTrend === "up" ? "â†‘ " : deltaTrend === "down" ? "â†“ " : ""}{deltaText}
          </Badge>
        )}
      </div>
      
      <div>
        <h4 className="text-on-surface-variant text-[12.5px] font-semibold mb-1 uppercase tracking-wider">{title}</h4>
        <div className="flex items-baseline gap-2">
          <span className="font-display font-bold text-on-surface text-[28px] tracking-[-0.03em] leading-8">{value}</span>
          {subValue && <span className="text-on-surface-variant text-[13px] font-medium">{subValue}</span>}
        </div>
      </div>
    </Card>
  );
}
