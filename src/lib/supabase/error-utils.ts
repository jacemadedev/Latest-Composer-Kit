import { PostgrestError } from '@supabase/supabase-js'

export class SupabaseError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly details?: string,
    public readonly hint?: string
  ) {
    super(message)
    this.name = 'SupabaseError'
  }

  static fromPostgrestError(error: PostgrestError): SupabaseError {
    return new SupabaseError(error.message, error.code, error.details, error.hint)
  }
}

export const MAX_RETRIES = 3
export const RETRY_DELAY = 1000 // 1 second

export async function withRetry<T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = RETRY_DELAY
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay))
      return withRetry(operation, retries - 1, delay * 2)
    }
    throw error
  }
}
