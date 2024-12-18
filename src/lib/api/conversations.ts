import { supabase } from '@/integrations/supabase/client'
import { Conversation } from '@/types/chat'
import { getCurrentUser } from './auth'
import { handleError } from '@/lib/errors'

export async function fetchConversations(): Promise<Conversation[]> {
  try {
    const user = await getCurrentUser()
    
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', user.id)
      .order('last_message_at', { ascending: false })

    if (error) throw error
    return data

  } catch (error) {
    console.error('Error fetching conversations:', error)
    throw error
  }
}

export async function createConversation(title: string = 'New Chat'): Promise<Conversation> {
  try {
    const user = await getCurrentUser()
    
    const { data, error } = await supabase
      .from('conversations')
      .insert([{
        title,
        user_id: user.id,
        last_message_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data

  } catch (error) {
    console.error('Error creating conversation:', error)
    throw error
  }
}