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
          className="w-full bg-[#202123] hover:bg-[#2D2D30] text-white border border-[#4D4D4F]"
          variant="outline"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      <div className="px-3 mb-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#8E8EA0]" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-[#202123] border-[#4D4D4F] text-white placeholder:text-[#8E8EA0] focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1">
          {filteredConversations.map((conv) => (
            <Button
              key={conv.id}
              variant="ghost"
              className={`w-full justify-start text-sm ${
                currentConversation === conv.id
                  ? 'bg-[#2D2D30] text-white'
                  : 'text-[#ECECF1] hover:bg-[#2D2D30]'
              }`}
              onClick={() => onConversationSelect(conv.id)}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              {conv.title}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}