export const APP_NAME = 'AI Prompt Tuner'
export const APP_DESCRIPTION = 'Fine-tune your AI prompts'

export const API_RATE_LIMIT = {
  REQUESTS_PER_MINUTE: 60,
  MAX_TOKENS_PER_REQUEST: 4000,
}

export const MODELS = {
  GPT4: 'gpt-4' as const,
  GPT35: 'gpt-3.5-turbo' as const,
}

export const LOCAL_STORAGE_KEYS = {
  SETTINGS: 'settings-storage',
  PROMPT_HISTORY: 'prompt-storage',
  THEME: 'theme',
}

export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  HISTORY: '/history',
  SETTINGS: '/settings',
  DOCUMENTATION: '/docs',
}
