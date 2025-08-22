// components/ui/loading-spinner.tsx
"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

// Объединяем интерфейсы и убираем дублирование
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  message?: string;
  text?: string;
  fullPage?: boolean;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6", 
  lg: "w-8 h-8",
  xl: "w-12 h-12"
};

export function LoadingSpinner({ 
  size = "md", 
  className,
  message,
  text,
  fullPage = true 
}: LoadingSpinnerProps) {
  const finalMessage = message ?? text ?? "Загрузка...";
  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Loader2 className={cn(sizeClasses[size], "animate-spin text-blue-600", className)} />
      {finalMessage && (
        <p className="text-sm text-gray-600">{finalMessage}</p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-8">
        {content}
      </CardContent>
    </Card>
  );
}

// Page Loading Component
export function PageLoader({ text = "Загрузка..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <LoadingSpinner size="lg" message={text} fullPage={false} />
    </div>
  );
}

// Button Loading State
export function ButtonSpinner({ size = "sm" }: { size?: "sm" | "md" }) {
  return (
    <Loader2 className={cn(
      "animate-spin",
      size === "sm" ? "w-4 h-4" : "w-5 h-5"
    )} />
  );
}

// Skeleton Loading Components
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <Skeleton className="h-8 w-full" />
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex space-x-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/6" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  );
}

// Organization specific skeletons
export function OrganizationPageSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Header skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton className="w-12 h-12 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="w-12 h-12 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs skeleton */}
      <div className="space-y-6">
        <div className="flex space-x-2">
          {['Обзор', 'Участники', 'Отделы', 'Настройки'].map((tab, i) => (
            <Skeleton key={i} className="h-10 w-20" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}

export function MembersListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Search and filters skeleton */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-40" />
          </div>
        </CardContent>
      </Card>

      {/* Members list skeleton */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function DepartmentsListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Departments grid skeleton */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-5 w-16" />
              </div>
              
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}