import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Settings {
  defaultModel: 'gpt-4' | 'gpt-3.5-turbo'
  theme: 'light' | 'dark' | 'system'
  saveHistory: boolean
  openAIKey?: string
}

interface SettingsStore {
  settings: Settings
  updateSettings: (newSettings: Partial<Settings>) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: {
        defaultModel: 'gpt-4',
        theme: 'system',
        saveHistory: true,
        openAIKey: undefined,
      },
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
    }),
    {
      name: 'settings-storage',
      skipHydration: typeof window === 'undefined',
    }
  )
)
