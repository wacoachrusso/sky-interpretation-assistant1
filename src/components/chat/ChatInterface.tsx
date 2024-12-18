import React, { useRef, useState } from 'react'
import { ChatLayout } from './ChatLayout'
import { useConversations } from '@/hooks/useConversations'
import { useMessages } from '@/hooks/useMessages'

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

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (currentConversation) {
      setIsNewMessage(true)
      await sendMessage(input, currentConversation)
      setInput('')
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