import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PromptResponse } from '@/lib/openai'

interface PromptHistory {
  id: string
  prompt: string
  response: PromptResponse
  createdAt: Date
}

interface PromptStore {
  history: PromptHistory[]
  addToHistory: (prompt: string, response: PromptResponse) => void
  clearHistory: () => void
  stats: {
    totalInteractions: number
    averageResponseTime: number
    tokenUsage: number
    successRate: number
  }
  updateStats: (newStats: Partial<PromptStore['stats']>) => void
}

export const usePromptStore = create<PromptStore>()(
  persist(
    (set) => ({
      history: [],
      stats: {
        totalInteractions: 0,
        averageResponseTime: 0,
        tokenUsage: 0,
        successRate: 100,
      },
      addToHistory: (prompt, response) =>
        set((state) => ({
          history: [
            {
              id: Math.random().toString(36).substring(7),
              prompt,
              response,
              createdAt: new Date(),
            },
            ...state.history,
          ],
          stats: {
            ...state.stats,
            totalInteractions: state.stats.totalInteractions + 1,
            tokenUsage: state.stats.tokenUsage + (response.tokens || 0),
          },
        })),
      clearHistory: () => set({ history: [] }),
      updateStats: (newStats) =>
        set((state) => ({
          stats: { ...state.stats, ...newStats },
        })),
    }),
    {
      name: 'prompt-storage',
    }
  )
)
