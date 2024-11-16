export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      prompts: {
        Row: {
          id: string
          created_at: string
          user_id: string
          prompt: string
          output: string
          model: 'gpt-4' | 'gpt-3.5-turbo'
          tokens: number | null
          response_time: number | null
          type: 'prompt' | 'blog'
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          prompt: string
          output: string
          model: 'gpt-4' | 'gpt-3.5-turbo'
          tokens?: number | null
          response_time?: number | null
          type?: 'prompt' | 'blog'
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          prompt?: string
          output?: string
          model?: 'gpt-4' | 'gpt-3.5-turbo'
          tokens?: number | null
          response_time?: number | null
          type?: 'prompt' | 'blog'
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          tokens: number
          default_model: 'gpt-4' | 'gpt-3.5-turbo'
          theme: 'light' | 'dark' | 'system'
          save_history: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tokens?: number
          default_model?: 'gpt-4' | 'gpt-3.5-turbo'
          theme?: 'light' | 'dark' | 'system'
          save_history?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          tokens?: number
          default_model?: 'gpt-4' | 'gpt-3.5-turbo'
          theme?: 'light' | 'dark' | 'system'
          save_history?: boolean
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}