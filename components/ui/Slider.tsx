"use client";

import { forwardRef } from "react";

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  className?: string;
  trackColor?: string;
  fillColor?: string;
  thumbColor?: string;
  disabled?: boolean;
}

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      min,
      max,
      step = 0.01,
      value,
      onChange,
      className = "",
      trackColor = "rgba(42,229,185,0.2)",
      fillColor = "rgba(42,229,185,0.6)",
      thumbColor = "#2ae5b9",
      disabled = false,
    },
    ref
  ) => {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        disabled={disabled}
        className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer slider
                   disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        style={
          {
            backgroundColor: trackColor,
            background:
              max > min
                ? `linear-gradient(to right, ${fillColor} 0%, ${fillColor} ${percentage}%, ${trackColor} ${percentage}%, ${trackColor} 100%)`
                : trackColor,
            // Custom CSS variables for thumb color
            "--webkit-slider-thumb-bg": thumbColor,
            "--moz-range-thumb-bg": thumbColor,
          } as React.CSSProperties & Record<string, string>
        }
      />
    );
  }
);

Slider.displayName = "Slider";

export default Slider;
