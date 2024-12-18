import React from 'react'
import { ConversationList } from './ConversationList'
import { Conversation } from '@/types/chat'
import { useIsMobile } from '@/hooks/use-mobile'

interface ConversationSidebarProps {
  conversations: Conversation[]
  currentConversation: string | null
  searchTerm: string
  onSearchChange: (value: string) => void
  onConversationSelect: (id: string) => void
  onNewChat: () => void,
  onDeleteConversation: (id: string) => void
}

export function ConversationSidebar({
  conversations,
  currentConversation,
  searchTerm,
  onSearchChange,
  onConversationSelect,
  onNewChat,
  onDeleteConversation,
}: ConversationSidebarProps) {
  const isMobile = useIsMobile()
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-[#4D4D4F]">
        <div className="flex items-center gap-2 px-2 py-1">
          <img
            src="./assets/skyguide-logo.png"
            alt="SkyGuide"
            className="h-6"
            loading="eager"
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
          onDeleteConversation={onDeleteConversation}
        />
      </div>
    </div>
  )
}