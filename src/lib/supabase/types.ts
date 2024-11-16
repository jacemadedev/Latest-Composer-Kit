import { Database } from './database.types'

export type Tables = Database['public']['Tables']
export type Enums = Database['public']['Enums']

// Strongly typed table definitions
export type PromptTable = Tables['prompts']['Row']
export type InsertPrompt = Tables['prompts']['Insert']
export type UpdatePrompt = Tables['prompts']['Update']

export type UserSettings = Tables['user_settings']['Row']
export type InsertUserSettings = Tables['user_settings']['Insert']
export type UpdateUserSettings = Tables['user_settings']['Update']

// Enum types
export type ModelType = 'gpt-4' | 'gpt-3.5-turbo'
export type ThemeType = 'light' | 'dark' | 'system'

// Runtime type checking utilities
export function isModelType(value: string): value is ModelType {
  return value === 'gpt-4' || value === 'gpt-3.5-turbo'
}

export function isThemeType(value: string): value is ThemeType {
  return value === 'light' || value === 'dark' || value === 'system'
}

// Response types
export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

// Request validation
export interface PromptRequest {
  prompt: string
  model: ModelType
  userId: string
}

export function validatePromptRequest(data: unknown): PromptRequest {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid request data')
  }

  const { prompt, model, userId } = data as Record<string, unknown>

  if (typeof prompt !== 'string' || prompt.length === 0) {
    throw new Error('Prompt is required')
  }

  if (typeof model !== 'string' || !isModelType(model)) {
    throw new Error('Invalid model type')
  }

  if (typeof userId !== 'string' || userId.length === 0) {
    throw new Error('User ID is required')
  }

  return { prompt, model, userId }
}