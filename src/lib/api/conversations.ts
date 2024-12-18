import { supabase } from '@/integrations/supabase/client'
import { Conversation } from '@/types/chat'
import { getCurrentUser } from './auth'
import { saveOffline, loadOffline, removeOffline } from './storage'
import { createMockConversation } from '../mock-data'

export async function fetchConversations(): Promise<Conversation[]> {
  try {
    const user = await getCurrentUser()
    
    // In test mode, load from localStorage
    if (localStorage.getItem('testMode') === 'true') {
      return loadOffline('conversations') || []
    }
    
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', user.id)
      .order('last_message_at', { ascending: false })

    if (error) throw error
    
    // Save conversations offline
    saveOffline('conversations', data)
    return data

  } catch (error) {
    console.error('Error fetching conversations:', error)
    // Try loading from offline storage
    const offlineData = loadOffline('conversations')
    if (offlineData) return offlineData
    throw error
  }
}

export async function createConversation(title: string = 'New Chat'): Promise<Conversation> {
  try {
    const user = await getCurrentUser()
    
    // In test mode, save to localStorage
    if (localStorage.getItem('testMode') === 'true') {
      const newConversation = createMockConversation(title)
      const existingConversations = loadOffline('conversations') || []
      const updatedConversations = [newConversation, ...existingConversations]
      saveOffline('conversations', updatedConversations.slice(0, 10)) // Limit to 10 conversations
      return newConversation
    }
    
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

    // Save new conversation offline
    const conversations = loadOffline('conversations') || []
    saveOffline('conversations', [data, ...conversations])
    saveOffline(`conversation-${data.id}`, data)

    return data

  } catch (error) {
    console.error('Error creating conversation:', error)
    throw error
  }
}

export async function deleteConversation(conversationId: string): Promise<void> {
  try {
    const user = await getCurrentUser()

    // In test mode, only update localStorage
    if (localStorage.getItem('testMode') === 'true') {
      const conversations = loadOffline('conversations') || []
      saveOffline('conversations', conversations.filter(c => c.id !== conversationId))
      removeOffline(`messages-${conversationId}`)
      removeOffline(`conversation-${conversationId}`)
      return
    }
    
    // Delete messages first
    await supabase
      .from('messages')
      .delete()
      .eq('conversation_id', conversationId)
      .eq('user_id', user.id)

    // Then delete the conversation
    await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId)
      .eq('user_id', user.id)

    // Clean up offline data
    removeOffline(`messages-${conversationId}`)
    removeOffline(`conversation-${conversationId}`)
    const conversations = loadOffline('conversations') || []
    saveOffline('conversations', conversations.filter(c => c.id !== conversationId))

  } catch (error) {
    console.error('Error deleting conversation:', error)
    throw error
  }
}