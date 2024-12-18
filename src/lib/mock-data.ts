import { Message, Conversation } from '@/types/chat'
import { TEST_USER_ID } from './constants'

export const createMockMessage = (
  content: string,
  role: 'user' | 'assistant',
  conversationId: string,
  userId: string = TEST_USER_ID
): Message => ({
  id: `msg-${Date.now()}-${Math.random().toString(36).substring(2)}`,
  conversation_id: conversationId,
  content,
  role,
  created_at: new Date().toISOString(),
  user_id: userId
})

export const createMockConversation = (
  title: string,
  userId: string = TEST_USER_ID
): Conversation => ({
  id: `conversation-${Date.now()}`,
  title,
  last_message_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  user_id: userId
})