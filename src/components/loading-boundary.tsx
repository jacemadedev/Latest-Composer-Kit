"use client"

import React, { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface LoadingBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function LoadingBoundary({ children, fallback }: LoadingBoundaryProps) {
  return (
    <Suspense fallback={fallback || <DefaultLoadingFallback />}>
      {children}
    </Suspense>
  )
}

function DefaultLoadingFallback() {
  return (
    <div className="w-full space-y-4">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  )
}

export function CardLoadingFallback() {
  return (
    <div className="w-full space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

export function TableLoadingFallback() {
  return (
    <div className="w-full space-y-4">
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  )
}

export function ImageLoadingFallback() {
  return <Skeleton className="h-full w-full min-h-[200px]" />
}