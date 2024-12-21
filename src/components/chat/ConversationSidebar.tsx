import React from 'react'
import { ConversationList } from './ConversationList'
import { Conversation } from '@/types/chat'
import { useIsMobile } from '@/hooks/use-mobile'
import { useToast } from '@/hooks/use-toast'

interface ConversationSidebarProps {
  conversations: Conversation[]
  currentConversation: string | null
  searchTerm: string
  onSearchChange: (value: string) => void
  onConversationSelect: (id: string) => void
  onNewChat: () => void,
  onClearAllChats: () => void,
  onDeleteConversation: (id: string) => void
}

export function ConversationSidebar({
  conversations,
  currentConversation,
  searchTerm,
  onSearchChange,
  onConversationSelect,
  onClearAllChats,
  onNewChat,
  onDeleteConversation,
}: ConversationSidebarProps) {
  const isMobile = useIsMobile()
  const { toast } = useToast()

  const handleClearAllChats = async () => {
    try {
      await onClearAllChats()
    } catch (error) {
      console.error('Error clearing chats:', error)
      toast({
        title: 'Error',
        description: 'Failed to clear chats. Please try again.',
        variant: 'destructive'
      })
    }
  }
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-[#4D4D4F]">
        <div className="flex items-center gap-2 px-2 py-1">
          <img
            src="/favicon.png"
            alt="SkyGuide Logo"
            className="h-6 w-auto object-contain"
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
          onClearAllChats={handleClearAllChats}
          onConversationSelect={onConversationSelect}
          onNewChat={onNewChat}
          onDeleteConversation={onDeleteConversation}
        />
      </div>
    </div>
  )
}