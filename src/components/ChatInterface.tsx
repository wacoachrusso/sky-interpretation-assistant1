import { useRef, useState, useEffect } from 'react'
import { ChatLayout } from './chat/ChatLayout'
import { useConversations } from '@/hooks/useConversations'
import { useMessages } from '@/hooks/useMessages'
import { createMockMessage } from '@/lib/mock-data'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

export default function ChatInterface() {
  const [input, setInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isNewMessage, setIsNewMessage] = useState(false)
  const [pendingMessage, setPendingMessage] = useState<Message | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  
  const { 
    conversations, 
    currentConversation, 
    setCurrentConversation, 
    createNewChat,
    clearAllChats,
    handleDeleteConversation,
    refreshConversations
  } = useConversations()

  const { 
    messages, 
    isLoading, 
    sendMessage, 
    fetchMessages 
  } = useMessages()

  // Update conversation title after first message
  const updateTitle = async (id: string, content: string) => {
    try {
      // Extract first line or first 50 chars for title
      const title = content.split('\n')[0].slice(0, 50);
      if (!title.trim()) return;
      
      await updateConversationTitle(id, title)
      await refreshConversations()
    } catch (error) {
      console.error('Error updating conversation title:', error)
      // Only show toast for network errors
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

  useEffect(() => {
    if (currentConversation && messages.length === 1 && !isLoading) {
      const userMessage = messages[0]
      if (userMessage.role === 'user') {
        updateTitle(currentConversation, userMessage.content)
      }
    }
  }, [messages, currentConversation, isLoading])

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
      if (conversations.length === 0) {
        await createNewChat()
      }
    }
    initializeChat()
  }, [conversations.length, isAuthenticated])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (currentConversation) {
      if (!input.trim()) return
      
      const trimmedInput = input.trim()
      setInput('')  // Clear input immediately for better UX

      // Create and display pending user message immediately
      const userMessage = createMockMessage(trimmedInput, 'user', currentConversation)
      setPendingMessage(userMessage)
      
      console.log('Sending message in conversation:', currentConversation)
      setIsNewMessage(true)
      try {
        await sendMessage(trimmedInput, currentConversation)
        // Update conversation's last_message_at
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
  }

  const handleConversationSelect = async (id: string) => {
    console.log('Selecting conversation:', id)
    setCurrentConversation(id)
    setIsNewMessage(false)
    await fetchMessages(id)
  }

  const handleNewChat = async () => {
    console.log('Creating new chat')
    const newChatId = await createNewChat()
    if (newChatId) {
      setIsNewMessage(false)
      await fetchMessages(newChatId)
    }
  }

  return (
    <ChatLayout
      conversations={conversations}
      currentConversation={currentConversation}
      messages={pendingMessage ? [...messages, pendingMessage] : messages}
      searchTerm={searchTerm}
      input={input}
      isLoading={isLoading}
      onClearAllChats={clearAllChats}
      isNewMessage={isNewMessage}
      messagesEndRef={messagesEndRef}
      onSearchChange={setSearchTerm}
      onConversationSelect={handleConversationSelect}
      onNewChat={handleNewChat}
      onInputChange={setInput}
      onSend={handleSend}
      onDeleteConversation={handleDeleteConversation}
    />
  )
}