import { Message } from '@/types/chat'
import { supabase } from '@/integrations/supabase/client'
import { AuthError } from '@/lib/errors'

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
  const { error } = await supabase
    .from('conversations')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', conversationId)

  if (error) throw error
}

export async function callChatAssistant(messages: Message[], conversationId: string) {
  const { data, error } = await supabase.functions.invoke('chat-assistant', {
    body: { messages, conversationId }
  })

  if (error) throw error
  return data
}