import * as React from 'react'
const { useState, useRef } = React
import { useToast } from '@/hooks/use-toast'
import { Message } from '@/types/chat'
import { processMessage, saveMessage } from '@/lib/api/messages'

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const isProcessing = useRef(false)

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(data)
    } catch (error) {
      console.error('Error fetching messages:', error)
      toast({
        title: 'Error',
        description: 'Failed to load messages',
        variant: 'destructive',
      })
    }
  }

  const sendMessage = async (input: string, conversationId: string) => {
    if (!input.trim() || !conversationId || isLoading || isProcessing.current) return

    setIsLoading(true)
    isProcessing.current = true
    console.log('Sending message:', input)

    try {
      // Save user message
      const userMessage = await saveMessage(input, 'user', conversationId)
      setMessages(prev => [...prev, userMessage])

      // Process with assistant
      const assistantResponse = await processMessage(input, conversationId, [...messages, userMessage])
      
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
    fetchMessages,
  }
}