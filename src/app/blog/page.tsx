"use client"

import React, { Suspense, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { LoadingBoundary } from "@/components/loading-boundary"
import { ErrorBoundary } from "@/components/error-boundary"
import { BlogEditor } from "@/components/blog/blog-editor"
import { BlogGenerator } from "@/components/blog/blog-generator"
import { BlogAnalytics } from "@/components/blog/blog-analytics"
import { supabase } from "@/lib/supabase"
import { getAnalytics, AnalyticsStats } from "@/lib/analytics"

export default function BlogPage() {
  const router = useRouter()
  const [content, setContent] = React.useState("")
  const [stats, setStats] = React.useState<AnalyticsStats>({
    totalInteractions: 0,
    averageResponseTime: 0,
    tokenUsage: 0,
    successRate: 100,
    previousPeriodComparison: 0
  })

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const analyticsData = await getAnalytics(user.id, 'blog')
        setStats(analyticsData)
      } catch (error) {
        console.error('Failed to load stats:', error)
      }
    }

    loadStats()
  }, [])

  return (
    <ErrorBoundary>
      <LoadingBoundary>
        <AppLayout breadcrumb={{ title: "Blog Generator" }}>
          <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            <BlogAnalytics stats={stats} />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-2 lg:col-span-2">
                <BlogGenerator onGenerate={setContent} onStatsUpdate={setStats} />
              </div>
              <div className="col-span-2 lg:col-span-5">
                <BlogEditor content={content} onChange={setContent} />
              </div>
            </div>
          </div>
        </AppLayout>
      </LoadingBoundary>
    </ErrorBoundary>
  )
}