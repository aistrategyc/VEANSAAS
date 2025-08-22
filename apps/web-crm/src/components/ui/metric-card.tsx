"use client";

import React from "react";
import clsx from "clsx";

export interface MetricCardProps {
  /** Заголовок карточки */
  title: string;
  /** Значение (строка или число) */
  value: string | number;
  /** Подзаголовок / пояснение под значением */
  subtitle?: string;
  /** Иконка справа в заголовке */
  icon?: React.ReactNode;
  /** Tailwind-класс для цвета значения */
  valueColor?: string;
  /** Процент изменения (например +12 или -5) */
  trendPct?: number;
  /** Дополнительный className для контейнера */
  className?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  valueColor,
  trendPct,
  className,
}: MetricCardProps) {
  const isNumber = typeof value === "number";
  const formattedValue = isNumber
    ? new Intl.NumberFormat(undefined).format(value as number)
    : String(value);

  const hasTrend = typeof trendPct === "number" && !Number.isNaN(trendPct);
  const trendText = hasTrend
    ? `${trendPct > 0 ? "+" : ""}${Math.round(trendPct)}%`
    : null;
  const trendColor =
    trendPct && trendPct !== 0
      ? trendPct > 0
        ? "text-green-600"
        : "text-red-600"
      : "text-muted-foreground";

  return (
    <div
      className={clsx(
        "rounded-xl border bg-background p-4 shadow-sm flex flex-col justify-between",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{title}</div>
        {icon ? <div className="text-muted-foreground">{icon}</div> : null}
      </div>

      <div
        className={clsx(
          "mt-2 text-2xl font-semibold",
          valueColor ? valueColor : "text-foreground"
        )}
      >
        {formattedValue}
      </div>

      {subtitle ? (
        <div className="mt-1 text-xs text-muted-foreground">{subtitle}</div>
      ) : null}

      {hasTrend ? (
        <div className={`mt-1 text-xs ${trendColor}`}>{trendText}</div>
      ) : null}
    </div>
  );
}

export default MetricCard;