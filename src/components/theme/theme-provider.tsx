'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { useSettingsStore } from '@/lib/store/settings-store'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    // Using the simpler subscribe syntax to avoid type errors
    const unsubscribe = useSettingsStore.subscribe((state) => {
      const theme = state.settings.theme
      const root = window.document.documentElement
      root.classList.remove('light', 'dark')
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
          ? 'dark'
          : 'light'
        root.classList.add(systemTheme)
      } else {
        root.classList.add(theme)
      }
    })

    // Return cleanup function
    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
