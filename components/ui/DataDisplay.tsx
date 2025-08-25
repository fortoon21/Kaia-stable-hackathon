"use client";

interface DataRowProps {
  label: string;
  value: string | number;
  subValue?: string;
  valueClassName?: string;
  labelClassName?: string;
}

export function DataRow({
  label,
  value,
  subValue,
  valueClassName = "text-white",
  labelClassName = "text-[#728395]",
}: DataRowProps) {
  return (
    <div className="flex justify-between items-start py-2">
      <span className={`text-sm ${labelClassName}`}>{label}</span>
      <div className="text-right">
        <div className={`font-medium ${valueClassName}`}>{value}</div>
        {subValue && (
          <div className="text-xs text-[#a1acb8] mt-0.5">{subValue}</div>
        )}
      </div>
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeader({ 
  title, 
  subtitle, 
  className = "" 
}: SectionHeaderProps) {
  return (
    <div className={`mb-6 ${className}`}>
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      {subtitle && (
        <p className="text-sm text-[#728395] mt-1">{subtitle}</p>
      )}
    </div>
  );
}

interface ValueWithLabelProps {
  label: string;
  value: string | number;
  subValue?: string;
  valueColor?: string;
  size?: "sm" | "md" | "lg";
}

export function ValueWithLabel({
  label,
  value,
  subValue,
  valueColor = "#ffffff",
  size = "md",
}: ValueWithLabelProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div>
      <div className="text-[#728395] text-xs mb-1">{label}</div>
      <div 
        className={`font-semibold ${sizeClasses[size]}`}
        style={{ color: valueColor }}
      >
        {value}
      </div>
      {subValue && (
        <div className="text-[#a1acb8] text-xs mt-0.5">{subValue}</div>
      )}
    </div>
  );
}