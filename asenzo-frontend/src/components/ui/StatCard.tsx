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
  iconColorClass = "bg-electric-blue shadow-electric-blue/20",
  deltaText,
  deltaTrend,
  interactive = false,
  onClick,
  className = "",
}: StatCardProps) {
  
  // Default icon fallback if none provided (squircle + soft shadow)
  const iconMarkup = icon ? (
    <div className={`w-12 h-12 rounded-md flex items-center justify-center shadow-md bg-primary`}>
      <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
    </div>
  ) : <div />;

  return (
    <Card variant="metric" interactive={interactive} onClick={onClick} className={`flex flex-col justify-between ${className}`}>
      <div className="flex justify-between items-start mb-6">
        {iconMarkup}
        {deltaText && (
          <span className={`px-2 py-0.5 rounded-full text-label-sm uppercase tracking-wider flex items-center gap-1 shadow-sm ${
             deltaTrend === "up" ? "bg-emerald text-white" : 
             deltaTrend === "down" ? "bg-red text-white" : 
             "bg-surface-container-high text-on-surface-variant"
          }`}>
            {deltaTrend === "up" ? "+" : deltaTrend === "down" ? "-" : ""}{deltaText}
            <span className="material-symbols-outlined text-[14px]">
              {deltaTrend === "up" ? "trending_up" : deltaTrend === "down" ? "arrow_forward" : "horizontal_rule"}
            </span>
          </span>
        )}
      </div>
      
      <div>
        <p className="font-label-md text-on-surface-variant uppercase tracking-wider mb-2">{title}</p>
        <h3 className="font-headline text-display-lg text-on-surface tracking-tight tabular-nums mt-1">
          {value}
          {subValue && <span className="text-on-surface-variant font-headline-md font-normal ml-2">{subValue}</span>}
        </h3>
      </div>
    </Card>
  );
}
