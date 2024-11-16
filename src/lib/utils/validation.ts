import { z } from 'zod'
import { MODELS } from './constants'

export const promptSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(4000, 'Prompt is too long'),
  model: z.enum([MODELS.GPT4, MODELS.GPT35]),
})

export const settingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  defaultModel: z.enum([MODELS.GPT4, MODELS.GPT35]),
  saveHistory: z.boolean(),
  openAIKey: z.string().optional(),
})

export type PromptInput = z.infer<typeof promptSchema>
export type SettingsInput = z.infer<typeof settingsSchema>

export function validatePrompt(input: unknown): PromptInput {
  return promptSchema.parse(input)
}

export function validateSettings(input: unknown): SettingsInput {
  return settingsSchema.parse(input)
}
