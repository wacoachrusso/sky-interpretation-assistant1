import { supabase } from '@/integrations/supabase/client'
import { Message } from '@/types/chat'
import { AuthError } from '@/lib/errors'

export async function fetchMessages(conversationId: string): Promise<Message[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new AuthError()

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (error) throw error

    return data.map(msg => ({
      ...msg,
      role: msg.role as 'user' | 'assistant'
    }))
  } catch (error) {
    console.error('Error fetching messages:', error)
    throw new AuthError('Failed to fetch messages')
  }
}