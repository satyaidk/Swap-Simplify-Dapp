import type React from "react"
import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return <div className={cn("animate-pulse rounded-md bg-white/10", className)} {...props} />
}

export function TokenSkeleton() {
  return (
    <div className="flex items-center space-x-3 p-3">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  )
}

export function SwapSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-4 w-12" />
        <div className="bg-white/10 rounded-2xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-10 w-20" />
          </div>
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      <div className="flex justify-center">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>

      <div className="space-y-3">
        <Skeleton className="h-4 w-8" />
        <div className="bg-white/10 rounded-2xl p-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
      </div>

      <Skeleton className="h-14 w-full rounded-full" />
    </div>
  )
}
