'use client'

import { useTheme } from 'next-themes'
import { useSettingsStore } from '@/lib/store/settings-store'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useEffect } from 'react'

export function GeneralSettings() {
  const { settings, updateSettings } = useSettingsStore()
  const { setTheme } = useTheme()

  useEffect(() => {
    setTheme(settings.theme)
  }, [settings.theme, setTheme])

  const handleThemeChange = (value: 'light' | 'dark' | 'system') => {
    updateSettings({ theme: value })
    setTheme(value)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Default Model</Label>
        <Select
          value={settings.defaultModel}
          onValueChange={(value: 'gpt-4' | 'gpt-3.5-turbo') =>
            updateSettings({ defaultModel: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4">GPT-4</SelectItem>
            <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Theme</Label>
        <Select value={settings.theme} onValueChange={handleThemeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Save History</Label>
          <div className="text-sm text-muted-foreground">Store your prompt history locally</div>
        </div>
        <Switch
          checked={settings.saveHistory}
          onCheckedChange={(checked) => updateSettings({ saveHistory: checked })}
        />
      </div>
    </div>
  )
}
