// ✅ Компоненты для loading states

import { cn } from "@/lib/utils"

interface LoadingSkeletonProps {
  className?: string
}

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div 
      className={cn(
        "animate-pulse rounded-md bg-muted", 
        className
      )} 
    />
  )
}

export function ProfileSkeleton() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <LoadingSkeleton className="h-8 w-64" />
          <LoadingSkeleton className="h-4 w-96" />
        </div>
        <LoadingSkeleton className="h-10 w-32" />
      </div>
      
      <div className="grid grid-cols-6 gap-2">
        {[...Array(6)].map((_, i) => (
          <LoadingSkeleton key={i} className="h-10 w-full" />
        ))}
      </div>
      
      <div className="bg-white rounded-lg border p-6">
        <div className="flex gap-6">
          <LoadingSkeleton className="w-32 h-32 rounded-full" />
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <LoadingSkeleton className="h-4 w-20" />
                  <LoadingSkeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <LoadingSkeleton className="h-4 w-20" />
                <LoadingSkeleton className="h-8 w-16" />
              </div>
              <LoadingSkeleton className="w-12 h-12 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg border">
            <LoadingSkeleton className="h-6 w-48 mb-4" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <LoadingSkeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <LoadingSkeleton className="h-4 w-3/4" />
                    <LoadingSkeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border">
            <LoadingSkeleton className="h-6 w-32 mb-4" />
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <LoadingSkeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}