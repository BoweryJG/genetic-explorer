import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fiozmyoedptukpkzuhqm.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      ancestry_segments: {
        Row: {
          id: string
          user_id: string
          ancestry: string
          copy_number: number
          chromosome: string
          start_point: number
          end_point: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          ancestry: string
          copy_number: number
          chromosome: string
          start_point: number
          end_point: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          ancestry?: string
          copy_number?: number
          chromosome?: string
          start_point?: number
          end_point?: number
          created_at?: string
        }
      }
      ancestry_insights: {
        Row: {
          id: string
          user_id: string
          ancestry: string
          title: string
          description: string
          chromosome?: string
          tags: string[]
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          ancestry: string
          title: string
          description: string
          chromosome?: string
          tags?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          ancestry?: string
          title?: string
          description?: string
          chromosome?: string
          tags?: string[]
          created_at?: string
        }
      }
      search_history: {
        Row: {
          id: string
          user_id: string
          query: string
          ancestry_context?: string
          results: any
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          query: string
          ancestry_context?: string
          results?: any
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          query?: string
          ancestry_context?: string
          results?: any
          created_at?: string
        }
      }
    }
  }
}