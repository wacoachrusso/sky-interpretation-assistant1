import { useRef, useState } from 'react'
import { ChatLayout } from './chat/ChatLayout'
import { useConversations } from '@/hooks/useConversations'
import { useMessages } from '@/hooks/useMessages'
import { useChat } from '@/hooks/useChat'

export default function ChatInterface() {
  const [input, setInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
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

  const {
    isNewMessage,
    pendingMessage,
    handleSend,
    handleConversationSelect,
    handleNewChat
  } = useChat({
    input,
    setInput,
    currentConversation,
    setCurrentConversation,
    messages,
    sendMessage,
    fetchMessages,
    createNewChat,
    refreshConversations
  })
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