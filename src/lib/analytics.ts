import { supabase } from './supabase'
import { PromptRecord } from './supabase/prompts'
import { withRetry } from './supabase/error-utils'

export interface AnalyticsStats {
  totalInteractions: number
  averageResponseTime: number
  tokenUsage: number
  successRate: number
  previousPeriodComparison: number
}

export type AnalyticsType = 'prompt' | 'blog'

const DEFAULT_STATS: AnalyticsStats = {
  totalInteractions: 0,
  averageResponseTime: 0,
  tokenUsage: 0,
  successRate: 0,
  previousPeriodComparison: 0
}

export async function getAnalytics(userId: string, type: AnalyticsType = 'prompt'): Promise<AnalyticsStats> {
  return withRetry(async () => {
    try {
      // Verify user session first
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError) throw authError
      if (!user || user.id !== userId) {
        throw new Error('Unauthorized')
      }

      const now = new Date()
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

      // Get current period data with error handling
      const { data: currentPeriodData, error: currentError } = await supabase
        .from('prompts')
        .select('*')
        .eq('user_id', userId)
        .eq('type', type)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false })

      if (currentError) throw currentError

      // Get previous period data with error handling
      const { data: previousPeriodData, error: previousError } = await supabase
        .from('prompts')
        .select('*')
        .eq('user_id', userId)
        .eq('type', type)
        .gte('created_at', sixtyDaysAgo.toISOString())
        .lt('created_at', thirtyDaysAgo.toISOString())

      if (previousError) throw previousError

      const currentPeriod = currentPeriodData as PromptRecord[]
      const previousPeriod = previousPeriodData as PromptRecord[]

      if (!currentPeriod || !previousPeriod) {
        console.warn('No data found for analytics')
        return DEFAULT_STATS
      }

      // Calculate statistics with null checks
      const totalInteractions = currentPeriod.length
      const previousInteractions = previousPeriod.length

      const validResponseTimes = currentPeriod
        .map(p => p.response_time)
        .filter((time): time is number => typeof time === 'number' && !isNaN(time))

      const averageResponseTime = validResponseTimes.length > 0
        ? validResponseTimes.reduce((acc, curr) => acc + curr, 0) / validResponseTimes.length
        : 0

      const validTokens = currentPeriod
        .map(p => p.tokens)
        .filter((tokens): tokens is number => typeof tokens === 'number' && !isNaN(tokens))

      const tokenUsage = validTokens.reduce((acc, curr) => acc + curr, 0)

      // Calculate success rate with validation
      const successfulPrompts = currentPeriod.filter(p => 
        p.output && 
        typeof p.output === 'string' && 
        p.output.length > 0
      ).length

      const successRate = (successfulPrompts / Math.max(currentPeriod.length, 1)) * 100

      // Calculate period-over-period change with validation
      const percentageChange = previousInteractions === 0
        ? 0
        : ((totalInteractions - previousInteractions) / previousInteractions) * 100

      return {
        totalInteractions,
        averageResponseTime: Number(averageResponseTime.toFixed(2)),
        tokenUsage,
        successRate: Number(successRate.toFixed(1)),
        previousPeriodComparison: Number(percentageChange.toFixed(1))
      }
    } catch (error) {
      console.error('Analytics error:', error)
      return DEFAULT_STATS
    }
  }, 3, 1000) // 3 retries with 1s delay
}