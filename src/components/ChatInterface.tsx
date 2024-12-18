import React, { useRef, useState } from 'react'
import { ChatLayout } from './chat/ChatLayout'
import { useConversations } from '@/hooks/useConversations'
import { useMessages } from '@/hooks/useMessages'

export default function ChatInterface() {
  const [input, setInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
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

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (currentConversation) {
      await sendMessage(input, currentConversation)
      setInput('')
    }
  }

  const handleConversationSelect = async (id: string) => {
    setCurrentConversation(id)
    await fetchMessages(id)
  }

  const handleNewChat = async () => {
    const newChatId = await createNewChat()
    if (newChatId) {
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
      messagesEndRef={messagesEndRef}
      onSearchChange={setSearchTerm}
      onConversationSelect={handleConversationSelect}
      onNewChat={handleNewChat}
      onInputChange={setInput}
      onSend={handleSend}
    />
  )
}