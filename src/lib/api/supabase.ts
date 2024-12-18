import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'
import { Message } from '@/types/chat'
import { AuthError } from '@/lib/errors'

const SUPABASE_URL = "https://xnlzqsoujwsffoxhhybk.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhubHpxc291andzZmZveGhoeWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0ODA1ODUsImV4cCI6MjA1MDA1NjU4NX0.G-N5b6L3-208ox8jRHPj8NDyQAg8xIDST3r8v8Tlae8"

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Error handling wrapper
export async function handleSupabaseError<T>(promise: Promise<T>): Promise<T> {
  try {
    const result = await promise
    return result
  } catch (error) {
    console.error('Supabase error:', error)
    if (error?.message?.includes('body stream already read')) {
      throw new Error('Network error - please try again')
    }
    throw error
  }
}

export async function saveUserMessage(conversationId: string, content: string): Promise<Message> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new AuthError('No user found')

  const { data, error } = await supabase
    .from('messages')
    .insert([{
      conversation_id: conversationId,
      content,
      role: 'user',
      user_id: user.id
    }])
    .select()
    .single()

  if (error) throw error
  return data as Message
}

export async function saveAssistantMessage(conversationId: string, content: string): Promise<Message> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new AuthError('No user found')

  const { data, error } = await supabase
    .from('messages')
    .insert([{
      conversation_id: conversationId,
      content,
      role: 'assistant',
      user_id: user.id
    }])
    .select()
    .single()

  if (error) throw error
  return data as Message
}

export async function callChatAssistant(messages: Message[]): Promise<{ message: { content: string } }> {
  const response = await supabase.functions.invoke('chat-assistant', {
    body: { messages }
  })

  if (response.error) throw response.error
  return response.data
}