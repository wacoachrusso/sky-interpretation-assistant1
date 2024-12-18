import React from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { ScrollArea } from '../ui/scroll-area'
import { Search, Plus, MessageSquare } from 'lucide-react'
import { Conversation } from '@/types/chat'

interface ConversationListProps {
  conversations: Conversation[]
  currentConversation: string | null
  searchTerm: string
  onSearchChange: (value: string) => void
  onConversationSelect: (id: string) => void
  onNewChat: () => void
}

export function ConversationList({
  conversations,
  currentConversation,
  searchTerm,
  onSearchChange,
  onConversationSelect,
  onNewChat,
}: ConversationListProps) {
  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full">
      <div className="p-3">
        <Button 
          onClick={onNewChat} 
          className="w-full bg-transparent hover:bg-[#2D2D30] text-white border border-[#4D4D4F] flex items-center gap-2"
          variant="outline"
        >
          <Plus className="w-4 h-4" />
          New chat
        </Button>
      </div>

      <div className="px-3 mb-2">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#8E8EA0]" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-transparent border-[#4D4D4F] text-white placeholder:text-[#8E8EA0] focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-2 py-1">
          {filteredConversations.map((conv) => (
            <Button
              key={conv.id}
              variant="ghost"
              className={`w-full justify-start text-sm mb-1 h-auto py-3 ${
                currentConversation === conv.id
                  ? 'bg-[#2D2D30] text-white'
                  : 'text-[#ECECF1] hover:bg-[#2D2D30]'
              }`}
              onClick={() => onConversationSelect(conv.id)}
            >
              <MessageSquare className="w-4 h-4 mr-2 shrink-0" />
              <span className="truncate text-left">{conv.title}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}