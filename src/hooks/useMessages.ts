import { useState, useRef } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Message } from '@/types/chat'
import { fetchMessages, processMessage, saveMessage } from '@/lib/api/messages'
import { supabase } from '@/integrations/supabase/client'
import { handleError, isRetryableError } from '@/lib/errors'
import { generateTitleFromContent } from '@/lib/utils'

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const isProcessing = useRef(false)

  const loadMessages = async (conversationId: string) => {
    try {
      const messages = await fetchMessages(conversationId)
      if (!messages) return
      setMessages(messages)
    } catch (error) {
      console.error('Error fetching messages:', error)
      toast({
        title: 'Error',
        description: handleError(error),
        variant: 'destructive',
        duration: 3000
      })
    }
  }

  const sendMessage = async (input: string, conversationId: string) => {
    if (!input.trim() || !conversationId || isLoading || isProcessing.current) return

    setIsLoading(true)
    isProcessing.current = true

    try {
      // Save user message
      const userMessage = await saveMessage(input, 'user', conversationId)
      setMessages(prev => [...prev, userMessage])

      // Update conversation title if this is the first message
      if (messages.length === 0) {
        const title = generateTitleFromContent(input)
        await supabase
          .from('conversations')
          .update({ 
            title,
            last_message_at: new Date().toISOString() 
          })
          .eq('id', conversationId)
      } else {
        // Just update last_message_at
        await supabase
          .from('conversations')
          .update({ last_message_at: new Date().toISOString() })
          .eq('id', conversationId)
      }

      // Update conversation's last_message_at
      // Process with assistant
      const assistantResponse = await processMessage(input, conversationId, [...messages, userMessage])
      
      if (!assistantResponse) {
        throw new Error('Failed to get response from assistant')
      }
      
      // Save assistant message
      const assistantMessage = await saveMessage(assistantResponse, 'assistant', conversationId)
      setMessages(prev => [...prev, assistantMessage])

    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
      isProcessing.current = false
    }
  }

  return {
    messages,
    isLoading,
    sendMessage,
    fetchMessages: loadMessages,
  }
}