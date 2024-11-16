import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

export interface RateLimitConfig {
  interval: number // in seconds
  limit: number
}

const DEFAULT_CONFIG: RateLimitConfig = {
  interval: 60,
  limit: 100,
}

export async function rateLimit(identifier: string, config: RateLimitConfig = DEFAULT_CONFIG) {
  const key = `rate-limit:${identifier}`

  try {
    const [response] = await redis.multi().incr(key).expire(key, config.interval).exec()

    const attempts = response as number
    const success = attempts <= config.limit

    return {
      success,
      remaining: Math.max(0, config.limit - attempts),
      reset: Date.now() + config.interval * 1000,
    }
  } catch (error) {
    console.error('Rate limiting error:', error)
    // Fail open if Redis is down
    return {
      success: true,
      remaining: config.limit,
      reset: Date.now() + config.interval * 1000,
    }
  }
}
