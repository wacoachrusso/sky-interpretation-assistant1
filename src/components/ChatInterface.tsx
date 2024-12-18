import React, { useRef, useState, useEffect } from 'react'
import { ChatLayout } from './chat/ChatLayout'
import { useConversations } from '@/hooks/useConversations'
import { useMessages } from '@/hooks/useMessages'
import { supabase } from '@/integrations/supabase/client'

export default function ChatInterface() {
  const [input, setInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isNewMessage, setIsNewMessage] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { 
    conversations, 
    currentConversation, 
    setCurrentConversation, 
    createNewChat 
  } = useConversations()

  const { 
    messages, 
    isLoading, 
    sendMessage, 
    fetchMessages 
  } = useMessages()

  // Update conversation title after first message
  useEffect(() => {
    const updateConversationTitle = async () => {
      if (currentConversation && messages.length === 2) {
        console.log('Updating conversation title based on first message')
        const title = messages[0].content.slice(0, 50) + '...'
        const { error } = await supabase
          .from('conversations')
          .update({ title })
          .eq('id', currentConversation)

        if (error) {
          console.error('Error updating conversation title:', error)
        }
      }
    }

    updateConversationTitle()
  }, [messages, currentConversation])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (currentConversation) {
      console.log('Sending message in conversation:', currentConversation)
      setIsNewMessage(true)
      await sendMessage(input, currentConversation)
      setInput('')
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
      messages={messages}
      searchTerm={searchTerm}
      input={input}
      isLoading={isLoading}
      isNewMessage={isNewMessage}
      messagesEndRef={messagesEndRef}
      onSearchChange={setSearchTerm}
      onConversationSelect={handleConversationSelect}
      onNewChat={handleNewChat}
      onInputChange={setInput}
      onSend={handleSend}
    />
  )
}