"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { useSettingsStore } from "@/lib/store/settings-store"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const { settings } = useSettingsStore()

  React.useEffect(() => {
    useSettingsStore.subscribe(
      (state) => state.settings.theme,
      (theme) => {
        const root = window.document.documentElement
        root.classList.remove('light', 'dark')
        if (theme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
          root.classList.add(systemTheme)
        } else {
          root.classList.add(theme)
        }
      }
    )
  }, [])

  return (
    <NextThemesProvider {...props} forcedTheme={settings.theme === 'system' ? undefined : settings.theme}>
      {children}
    </NextThemesProvider>
  )
}