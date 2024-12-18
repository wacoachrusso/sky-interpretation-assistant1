import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Message } from '@/types/chat'
import { fetchMessages as fetchMessagesApi } from '@/lib/api/messages'
import { handleError } from '@/lib/errors'
import { saveUserMessage, saveAssistantMessage, callChatAssistant } from '@/lib/api/supabase'

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Load messages from local storage for current conversation
  const loadOfflineMessages = (conversationId: string) => {
    const savedMessages = localStorage.getItem(`messages-${conversationId}`)
    if (savedMessages) {
      return JSON.parse(savedMessages)
    }
    return []
  }

  const fetchMessages = async (conversationId: string | null) => {
    if (!conversationId) return

    try {
      console.log('Fetching messages for conversation:', conversationId)
      let messages
      try {
        messages = await fetchMessagesApi(conversationId)
      } catch (error) {
        console.log('Falling back to offline messages')
        messages = loadOfflineMessages(conversationId)
      }
      setMessages(messages)
    } catch (error) {
      console.error('Error fetching messages:', error)
      toast({
        title: 'Error',
        description: handleError(error),
        variant: 'destructive',
      })
    }
  }

  const sendMessage = async (input: string, conversationId: string) => {
    if (!input.trim() || !conversationId || isLoading) {
      console.log('Message not sent. Conditions:', {
        inputEmpty: !input.trim(),
        noConversation: !conversationId,
        isLoading
      })
      return
    }

    setIsLoading(true)
    console.log('Sending message:', input)

    try {
      // Save user message
      const userMessage = await saveUserMessage(conversationId, input)
      const updatedMessages = [...messages, userMessage]
      setMessages(updatedMessages)

      // Call chat-assistant function
      const assistantResponse = await callChatAssistant(updatedMessages, conversationId)

      // Save assistant message
      const assistantMessage = await saveAssistantMessage(
        conversationId, 
        assistantResponse.message.content
      )
      
      const finalMessages = [...updatedMessages, assistantMessage]
      setMessages(finalMessages)

      // Update conversation timestamp
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: 'Error',
        description: handleError(error),
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    messages,
    isLoading,
    sendMessage,
    fetchMessages,
  }
}