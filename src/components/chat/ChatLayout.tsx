import React from 'react'
import { SidebarProvider } from '../ui/sidebar'
import { QueryLimitChecker } from './QueryLimitChecker'
import { ConversationSidebar } from './ConversationSidebar'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import { Message, Conversation } from '@/types/chat'

interface ChatLayoutProps {
  conversations: Conversation[]
  currentConversation: string | null
  messages: Message[]
  searchTerm: string
  input: string
  isLoading: boolean
  messagesEndRef: React.RefObject<HTMLDivElement>
  onSearchChange: (value: string) => void
  onConversationSelect: (id: string) => void
  onNewChat: () => void
  onInputChange: (value: string) => void
  onSend: (e: React.FormEvent) => void
}

export function ChatLayout({
  conversations,
  currentConversation,
  messages,
  searchTerm,
  input,
  isLoading,
  messagesEndRef,
  onSearchChange,
  onConversationSelect,
  onNewChat,
  onInputChange,
  onSend,
}: ChatLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <QueryLimitChecker />
        <ConversationSidebar
          conversations={conversations}
          currentConversation={currentConversation}
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          onConversationSelect={onConversationSelect}
          onNewChat={onNewChat}
        />
        <div className="flex-1 flex flex-col relative bg-[#343541]">
          <MessageList
            messages={messages}
            messagesEndRef={messagesEndRef}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#343541] to-transparent h-32 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <MessageInput
              input={input}
              isLoading={isLoading}
              onInputChange={onInputChange}
              onSend={onSend}
            />
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}