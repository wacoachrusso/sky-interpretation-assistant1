export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
  conversation_id: string
  user_id: string
}

export interface Conversation {
  id: string
  title: string
  last_message_at: string
  created_at: string
  user_id: string
}