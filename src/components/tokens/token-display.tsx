"use client"

import { useEffect, useState } from "react"
import { Coins } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TokenPurchaseModal } from "./token-purchase-modal"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import { UserSettings } from "@/lib/supabase/types"

export function TokenDisplay() {
  const [tokens, setTokens] = useState(10000) // Default free tokens
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTokens = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Try to get existing settings
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (error) {
          if (error.code === 'PGRST116') {
            // Create default settings for new user
            const defaultSettings: Omit<UserSettings, 'id' | 'created_at' | 'updated_at'> = {
              user_id: user.id,
              tokens: 10000,
              default_model: 'gpt-4',
              theme: 'system',
              save_history: true
            }

            const { data: newData, error: insertError } = await supabase
              .from('user_settings')
              .insert([defaultSettings])
              .select('tokens')
              .single()

            if (insertError) throw insertError
            setTokens(newData.tokens)
          } else {
            throw error
          }
        } else {
          setTokens(data.tokens)
        }
      } catch (error) {
        console.error('Error loading tokens:', error)
        toast({
          title: "Error",
          description: "Failed to load token balance",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadTokens()
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Available Tokens</CardTitle>
        <Coins className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">
              {isLoading ? "Loading..." : tokens.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Remaining tokens for AI generations
            </p>
          </div>
          <TokenPurchaseModal />
        </div>
      </CardContent>
    </Card>
  )
}