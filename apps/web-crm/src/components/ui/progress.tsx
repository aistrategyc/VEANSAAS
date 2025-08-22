// src/components/ui/progress.tsx
"use client";

import * as React from "react";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // от 0 до 100
  max?: number; // максимальное значение (по умолчанию 100)
  className?: string;
  indicatorClassName?: string;
}

export function Progress({
  value,
  max = 100,
  className = "",
  indicatorClassName = "",
  ...props
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={`w-full h-4 bg-muted rounded overflow-hidden ${className}`}
      {...props}
    >
      <div
        className={`h-4 bg-primary transition-all duration-300 ease-in-out ${indicatorClassName}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}