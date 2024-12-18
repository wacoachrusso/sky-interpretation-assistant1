export interface AssistantResponse {
  message: {
    role: 'assistant'
    content: string
  }
}

export interface ApiError {
  message: string
  code?: string
  details?: any
}

export interface ChatState {
  messages: Message[]
  isLoading: boolean
  error: string | null
}