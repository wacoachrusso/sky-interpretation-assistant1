export type MessageRole = 'user' | 'assistant'

export interface Message {
  id: string
  role: MessageRole
  content: string
  created_at: string
  conversation_id: string
  user_id: string
  metadata?: Record<string, any>
}

export interface Conversation {
  id: string
  title: string
  last_message_at: string
  created_at: string
  user_id: string
}