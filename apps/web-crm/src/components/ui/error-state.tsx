"use client";

import * as React from "react";
import { AlertCircle, RefreshCw, ArrowLeft, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onBack?: () => void;
  onHome?: () => void;
  retryLabel?: string;
  backLabel?: string;
  homeLabel?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "destructive" | "warning";
}

export function ErrorState({ 
  title = "Произошла ошибка",
  message,
  onRetry,
  onBack,
  onHome,
  retryLabel = "Повторить",
  backLabel = "Назад",
  homeLabel = "На главную",
  className,
  size = "md",
  variant = "default"
}: ErrorStateProps) {
  const sizeClasses = {
    sm: {
      container: "p-6",
      icon: "w-8 h-8",
      title: "text-base",
      description: "text-sm"
    },
    md: {
      container: "p-8",
      icon: "w-12 h-12",
      title: "text-lg",
      description: "text-sm"
    },
    lg: {
      container: "p-12",
      icon: "w-16 h-16",
      title: "text-xl",
      description: "text-base"
    }
  };

  const variantClasses = {
    default: {
      iconBg: "bg-gray-50",
      iconColor: "text-gray-600"
    },
    destructive: {
      iconBg: "bg-red-50",
      iconColor: "text-red-600"
    },
    warning: {
      iconBg: "bg-yellow-50",
      iconColor: "text-yellow-600"
    }
  };

  const currentSize = sizeClasses[size];
  const currentVariant = variantClasses[variant];

  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <Card className={cn("max-w-md w-full", className)}>
        <CardContent className={cn("text-center", currentSize.container)}>
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4",
            currentVariant.iconBg
          )}>
            <AlertCircle className={cn(currentSize.icon, currentVariant.iconColor)} />
          </div>
          
          <h2 className={cn("font-medium text-gray-900 mb-2", currentSize.title)}>
            {title}
          </h2>
          <p className={cn("text-gray-600 mb-6", currentSize.description)}>
            {message}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {onRetry && (
              <Button onClick={onRetry} className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                {retryLabel}
              </Button>
            )}
            {onBack && (
              <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                {backLabel}
              </Button>
            )}
            {onHome && (
              <Button variant="outline" onClick={onHome} className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                {homeLabel}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Специализированные состояния ошибок для организации
export function OrganizationNotFoundError({ onBack }: { onBack?: () => void }) {
  return (
    <ErrorState
      title="Организация не найдена"
      message="Возможно, она была удалена или у вас нет доступа к ней."
      onBack={onBack}
      variant="warning"
    />
  );
}

export function OrganizationLoadError({ onRetry, onBack }: { onRetry?: () => void; onBack?: () => void }) {
  return (
    <ErrorState
      title="Не удалось загрузить организацию"
      message="Проверьте подключение к интернету и повторите попытку."
      onRetry={onRetry}
      onBack={onBack}
      variant="destructive"
    />
  );
}

export function PermissionDeniedError({ onBack }: { onBack?: () => void }) {
  return (
    <ErrorState
      title="Доступ запрещен"
      message="У вас нет прав для просмотра этой организации."
      onBack={onBack}
      variant="warning"
    />
  );
}