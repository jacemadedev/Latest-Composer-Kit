import { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { PromptRecord } from '@/lib/supabase/prompts'

type RealtimeCallback = (payload: {
  new: PromptRecord
  old: PromptRecord | null
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
}) => void

let promptsChannel: RealtimeChannel | null = null

export function subscribeToPrompts(callback: RealtimeCallback) {
  if (promptsChannel) {
    console.warn('Already subscribed to prompts channel')
    return () => unsubscribeFromPrompts()
  }

  promptsChannel = supabase
    .channel('prompts_channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'prompts',
      },
      (payload) => {
        callback({
          new: payload.new as PromptRecord,
          old: payload.old as PromptRecord | null,
          eventType: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
        })
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('Subscribed to prompts channel')
      }
    })

  return () => unsubscribeFromPrompts()
}

export function unsubscribeFromPrompts() {
  if (promptsChannel) {
    supabase.removeChannel(promptsChannel)
    promptsChannel = null
  }
}