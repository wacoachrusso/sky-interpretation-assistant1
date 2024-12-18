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
      conversations: {
        Row: {
          id: string
          created_at: string
          title: string
          user_id: string
          last_message_at: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          user_id: string
          last_message_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          user_id?: string
          last_message_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          created_at: string
          content: string
          role: string
          conversation_id: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          content: string
          role: string
          conversation_id: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          content?: string
          role?: string
          conversation_id?: string
          user_id?: string
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          full_name: string | null
          subscription_plan: string | null
          user_type: string | null
          airline: string | null
          query_count: number | null
        }
        Insert: {
          id: string
          created_at?: string
          full_name?: string | null
          subscription_plan?: string | null
          user_type?: string | null
          airline?: string | null
          query_count?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          full_name?: string | null
          subscription_plan?: string | null
          user_type?: string | null
          airline?: string | null
          query_count?: number | null
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}