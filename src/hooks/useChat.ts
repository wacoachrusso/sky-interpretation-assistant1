import { useState, useEffect } from 'react'
import { Message } from '@/types/chat'
import { createMockMessage } from '@/lib/mock-data'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { handleError } from '@/lib/errors'
import { updateConversationTitle } from '@/lib/api/conversations'

interface UseChatProps {
  input: string
  setInput: (value: string) => void
  currentConversation: string | null
  setCurrentConversation: (id: string | null) => void
  messages: Message[]
  sendMessage: (content: string, conversationId: string) => Promise<void>
  fetchMessages: (conversationId: string) => Promise<void>
  createNewChat: () => Promise<string | null>
  refreshConversations: () => Promise<void>
}

export function useChat({
  input,
  setInput,
  currentConversation,
  setCurrentConversation,
  messages,
  sendMessage,
  fetchMessages,
  createNewChat,
  refreshConversations
}: UseChatProps) {
  const [isNewMessage, setIsNewMessage] = useState(false)
  const [pendingMessage, setPendingMessage] = useState<Message | null>(null)
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()

  // Update conversation title after first message
  useEffect(() => {
    const updateTitle = async () => {
      if (currentConversation && messages.length === 1) {
        const userMessage = messages[0]
        if (userMessage.role === 'user') {
          try {
            await updateConversationTitle(currentConversation, userMessage.content)
            await refreshConversations()
          } catch (error) {
            console.error('Error updating conversation title:', error)
            if (error?.message?.includes('Failed to fetch')) {
              toast({
                title: 'Warning',
                description: 'Failed to update chat title. This won\'t affect your conversation.',
                variant: 'destructive',
                duration: 3000
              })
            }
          }
        }
      }
    }
    updateTitle()
  }, [messages, currentConversation])

  // Initialize chat if needed
  useEffect(() => {
    if (!isAuthenticated && process.env.NODE_ENV !== 'development') {
      toast({
        title: "Authentication Required",
        description: "Please log in to continue",
        variant: "destructive"
      })
      return
    }

    const initializeChat = async () => {
      if (!currentConversation) {
        await createNewChat()
      }
    }
    initializeChat()
  }, [currentConversation, isAuthenticated])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentConversation || !input.trim()) return
    
    const trimmedInput = input.trim()
    setInput('')  // Clear input immediately for better UX

    // Create and display pending user message immediately
    const userMessage = createMockMessage(trimmedInput, 'user', currentConversation)
    setPendingMessage(userMessage)
    
    setIsNewMessage(true)
    try {
      await sendMessage(trimmedInput, currentConversation)
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', currentConversation)
      await refreshConversations()
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: 'Error',
        description: handleError(error),
        variant: 'destructive',
        duration: 3000
      })
      setInput(trimmedInput) // Restore input on error
    } finally {
      setPendingMessage(null)
    }
  }

  const handleConversationSelect = async (id: string) => {
    setCurrentConversation(id)
    setIsNewMessage(false)
    await fetchMessages(id)
  }

  const handleNewChat = async () => {
    const newChatId = await createNewChat()
    if (newChatId) {
      setIsNewMessage(false)
      await fetchMessages(newChatId)
    }
  }

  return {
    isNewMessage,
    pendingMessage,
    handleSend,
    handleConversationSelect,
    handleNewChat
  }
}