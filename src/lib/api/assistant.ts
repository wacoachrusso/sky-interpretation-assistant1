import { Message } from '@/types/chat'

const ASSISTANT_ID = "asst_YdZtVHPSq6TIYKRkKcOqtwzn"

interface AssistantResponse {
  message: {
    role: 'assistant'
    content: string
  }
}

export async function callAssistant(messages: Message[]): Promise<AssistantResponse> {
  try {
    const response = await fetch('/api/chat-assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        assistantId: ASSISTANT_ID
      })
    })

    if (!response.ok) {
      throw new Error('Failed to get response from assistant')
    }

    return await response.json()
  } catch (error) {
    console.error('Error calling assistant:', error)
    throw error
  }
}