import { supabase } from '@/integrations/supabase/client'
import { Message } from '@/types/chat'
import { AuthError } from '@/lib/errors'

export function saveMessageOffline(conversationId: string, messages: Message[]) {
  try {
    localStorage.setItem(`messages-${conversationId}`, JSON.stringify(messages))
    // Also update the last accessed timestamp
    localStorage.setItem(`lastAccessed-${conversationId}`, new Date().toISOString())
  } catch (error) {
    console.error('Error saving messages offline:', error)
  }
}

export function loadOfflineMessages(conversationId: string): Message[] {
  try {
    const savedMessages = localStorage.getItem(`messages-${conversationId}`)
    return savedMessages ? JSON.parse(savedMessages) : []
  } catch (error) {
    console.error('Error loading offline messages:', error)
    return []
  }
}
export async function fetchMessages(conversationId: string): Promise<Message[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser()

    // In test mode, load from localStorage
    if (localStorage.getItem('testMode') === 'true') {
      return loadOfflineMessages(conversationId)
    }

    if (!user) throw new AuthError()

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(100) // Limit to last 100 messages

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