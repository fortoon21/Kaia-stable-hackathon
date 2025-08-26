"use client";

import { COLORS } from "@/constants/uiConstants";

interface StatsCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  valueColor?: string;
  className?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export function StatsCard({
  label,
  value,
  subValue,
  valueColor = COLORS.textPrimary,
  className = "",
  trend,
  trendValue,
}: StatsCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-[#23c09b]";
      case "down":
        return "text-warning";
      default:
        return "text-body";
    }
  };

  return (
    <div className={`${className}`}>
      <div className="text-body text-sm mb-2 font-heading">{label}</div>
      <div className="flex items-baseline gap-2">
        <div
          className="text-lg font-heading font-medium"
          style={{ color: valueColor }}
        >
          {value}
        </div>
        {trend && trendValue && (
          <span className={`text-xs ${getTrendColor()}`}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : ""}
            {trendValue}
          </span>
        )}
      </div>
      {subValue && <div className="text-muted text-xs mt-1">{subValue}</div>}
    </div>
  );
}

interface StatsGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function StatsGrid({
  children,
  columns = 3,
  className = "",
}: StatsGridProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-8 ${className}`}>
      {children}
    </div>
  );
}
