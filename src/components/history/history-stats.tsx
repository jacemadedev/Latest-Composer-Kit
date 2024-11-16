'use client'

import React, { useEffect, useState } from 'react'
import { BarChart3, Clock, MessagesSquare, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { getAnalytics, AnalyticsStats } from '@/lib/analytics'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/use-toast'
import { subscribeToPrompts } from '@/lib/supabase/realtime'

const DEFAULT_STATS: AnalyticsStats = {
  totalInteractions: 0,
  averageResponseTime: 0,
  tokenUsage: 0,
  successRate: 0,
  previousPeriodComparison: 0,
}

export function HistoryStats() {
  const [stats, setStats] = useState<AnalyticsStats>(DEFAULT_STATS)
  const [isLoading, setIsLoading] = useState(true)
  const [retryCount, setRetryCount] = useState(0)
  const MAX_RETRIES = 3

  useEffect(() => {
    async function loadStats() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          toast({
            title: 'Authentication Error',
            description: 'Please sign in to view your stats.',
            variant: 'destructive',
          })
          return
        }

        const analyticsData = await getAnalytics(user.id)
        setStats(analyticsData)
      } catch (error) {
        console.error('Failed to load stats:', error)
        if (retryCount < MAX_RETRIES) {
          setRetryCount((prev) => prev + 1)
          setTimeout(loadStats, 1000 * (retryCount + 1)) // Exponential backoff
        } else {
          toast({
            title: 'Error Loading Stats',
            description: 'Please try refreshing the page.',
            variant: 'destructive',
          })
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()

    // Subscribe to real-time updates
    const unsubscribe = subscribeToPrompts(async (payload) => {
      if (payload.eventType === 'INSERT' || payload.eventType === 'DELETE') {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          const updatedStats = await getAnalytics(user.id)
          setStats(updatedStats)
        }
      }
    })

    return () => {
      unsubscribe()
    }
  }, [retryCount])

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Interactions</CardTitle>
          <MessagesSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalInteractions}</div>
          <p className="text-xs text-muted-foreground">
            {stats.previousPeriodComparison > 0 ? '+' : ''}
            {stats.previousPeriodComparison}% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Response Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averageResponseTime.toFixed(1)}s</div>
          <p className="text-xs text-muted-foreground">Response time across all models</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Token Usage</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.tokenUsage.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Total tokens consumed</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.successRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">Successful completions</p>
        </CardContent>
      </Card>
    </div>
  )
}
