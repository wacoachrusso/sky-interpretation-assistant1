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
    <Sidebar className="w-[260px] bg-[#202123] border-r border-[#4D4D4F]">
      <div className="flex flex-col h-full">
        <div className="p-3 border-b border-[#4D4D4F]">
          <div className="flex items-center gap-2 px-2 py-1">
            <img
              src="/lovable-uploads/4d0b5f1f-ee3c-422d-81df-9db600490aec.png"
              alt="SkyGuide Logo"
              className="h-6"
            />
            <span className="text-lg font-semibold text-white">SkyGuide</span>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <ConversationList
            conversations={conversations}
            currentConversation={currentConversation}
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            onConversationSelect={onConversationSelect}
            onNewChat={onNewChat}
          />
        </div>
      </div>
    </Sidebar>
  )
}