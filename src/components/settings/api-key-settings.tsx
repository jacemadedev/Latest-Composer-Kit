"use client"

import { useState } from "react"
import { Eye, EyeOff, Key } from "lucide-react"
import { useSettingsStore } from "@/lib/store/settings-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

export function APIKeySettings() {
  const { settings, updateSettings } = useSettingsStore()
  const [showKey, setShowKey] = useState(false)
  const [openAIKey, setOpenAIKey] = useState(settings.openAIKey || "")

  const handleSave = () => {
    if (!openAIKey.startsWith('sk-')) {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid OpenAI API key starting with 'sk-'.",
        variant: "destructive",
      })
      return
    }

    updateSettings({ openAIKey })
    toast({
      title: "API Key Updated",
      description: "Your OpenAI API key has been saved successfully.",
    })

    // Reload the page to reinitialize the OpenAI client
    window.location.reload()
  }

  const handleClear = () => {
    setOpenAIKey("")
    updateSettings({ openAIKey: undefined })
    toast({
      title: "API Key Cleared",
      description: "Using default API key now.",
    })
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>OpenAI API Key</Label>
            <div className="text-sm text-muted-foreground">
              Enter your OpenAI API key to use your own account
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowKey(!showKey)}
          >
            {showKey ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Input
              type={showKey ? "text" : "password"}
              value={openAIKey}
              onChange={(e) => setOpenAIKey(e.target.value)}
              placeholder="sk-..."
            />
            <Key className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
          <Button onClick={handleSave}>Save</Button>
          {settings.openAIKey && (
            <Button variant="outline" onClick={handleClear}>
              Clear
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Your API key is stored locally and never sent to our servers.
          {settings.openAIKey ? " Using your custom API key." : " Using default API key."}
        </p>
      </div>
    </div>
  )
}