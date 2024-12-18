import React from 'react'
import { Sidebar } from '../ui/sidebar'
import { ConversationList } from './ConversationList'
import { Conversation } from '@/types/chat'

interface ConversationSidebarProps {
  conversations: Conversation[]
  currentConversation: string | null
  searchTerm: string
  onSearchChange: (value: string) => void
  onConversationSelect: (id: string) => void
  onNewChat: () => void
}

export function ConversationSidebar({
  conversations,
  currentConversation,
  searchTerm,
  onSearchChange,
  onConversationSelect,
  onNewChat,
}: ConversationSidebarProps) {
  return (
    <Sidebar className="w-80 p-4 bg-[#221F26] text-white border-r border-gray-700">
      <ConversationList
        conversations={conversations}
        currentConversation={currentConversation}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        onConversationSelect={onConversationSelect}
        onNewChat={onNewChat}
      />
    </Sidebar>
  )
}