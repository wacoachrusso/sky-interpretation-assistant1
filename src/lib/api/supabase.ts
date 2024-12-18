import { Message } from '@/types/chat'
import { supabase } from '@/integrations/supabase/client'
import { AuthError } from '@/lib/errors'

// Message operations
export async function saveUserMessage(conversationId: string, content: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new AuthError()

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
  return { ...data, role: data.role as 'user' | 'assistant' }
}

export async function saveAssistantMessage(conversationId: string, content: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new AuthError()

  // First update conversation timestamp
  await updateConversationTimestamp(conversationId)

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
  return { ...data, role: data.role as 'user' | 'assistant' }
}

export async function updateConversationTimestamp(conversationId: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new AuthError()

  const { error } = await supabase
    .from('conversations')
    .update({ 
      last_message_at: new Date().toISOString(),
      title: 'Updated Chat' // This will be overwritten by first message
    })
    .eq('id', conversationId)
    .eq('user_id', user.id)

  if (error) throw error
}

export async function callChatAssistant(messages: Message[], conversationId: string) {
  const { data, error } = await supabase.functions.invoke('chat-assistant', {
    body: { messages, conversationId }
  })

  if (error) throw error
  return data
}

// Offline support
export function saveOffline(key: string, data: any) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving offline data:', error)
  }
}

export function loadOffline(key: string) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Error loading offline data:', error)
    return null
  }
}

export function removeOffline(key: string) {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Error removing offline data:', error)
  }
}