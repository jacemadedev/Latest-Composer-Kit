'use client'

import { BarChart3, Bot, FileEdit, Timer } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AnalyticsStats } from '@/lib/analytics'
import { AnimatedCard } from '@/components/ui/motion'

interface BlogAnalyticsProps {
  stats: AnalyticsStats
}

export function BlogAnalytics({ stats }: BlogAnalyticsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <AnimatedCard className="col-span-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Blog Posts</CardTitle>
            <FileEdit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInteractions}</div>
            <p className="text-xs text-muted-foreground">
              {stats.previousPeriodComparison > 0 ? '+' : ''}
              {stats.previousPeriodComparison}% from last month
            </p>
          </CardContent>
        </Card>
      </AnimatedCard>

      <AnimatedCard className="col-span-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Generation Time</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageResponseTime.toFixed(1)}s</div>
            <p className="text-xs text-muted-foreground">Response time across all posts</p>
          </CardContent>
        </Card>
      </AnimatedCard>

      <AnimatedCard className="col-span-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Token Usage</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tokenUsage.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total tokens used</p>
          </CardContent>
        </Card>
      </AnimatedCard>

      <AnimatedCard className="col-span-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Successful generations</p>
          </CardContent>
        </Card>
      </AnimatedCard>
    </div>
  )
}
