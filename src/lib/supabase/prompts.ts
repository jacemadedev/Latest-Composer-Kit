import { supabase } from '@/lib/supabase'
import { PromptResponse } from '@/lib/openai'
import { withRetry, SupabaseError } from './error-utils'

export interface PromptRecord {
  id: string
  user_id: string
  prompt: string
  output: string
  model: string
  created_at: string
  tokens: number
  response_time: number
}

export async function savePrompt(prompt: string, response: PromptResponse) {
  return withRetry(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new SupabaseError('User not authenticated')

    const { data, error } = await supabase
      .from('prompts')
      .insert({
        user_id: user.id,
        prompt: prompt,
        output: response.content,
        model: response.model,
        tokens: response.tokens,
        response_time: response.responseTime,
      })
      .select()
      .single()

    if (error) throw SupabaseError.fromPostgrestError(error)
    return data
  })
}

export async function getPromptHistory() {
  return withRetry(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new SupabaseError('User not authenticated')

    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw SupabaseError.fromPostgrestError(error)
    return data as PromptRecord[]
  })
}

export async function deletePrompt(id: string) {
  return withRetry(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new SupabaseError('User not authenticated')

    const { error } = await supabase.from('prompts').delete().eq('id', id).eq('user_id', user.id)

    if (error) throw SupabaseError.fromPostgrestError(error)
  })
}
