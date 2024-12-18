import React from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { ScrollArea } from '../ui/scroll-area'
import { Search } from 'lucide-react'
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
    <div className="space-y-4">
      <Button onClick={onNewChat} className="w-full" variant="outline">
        New Chat
      </Button>

      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>

      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="space-y-2">
          {filteredConversations.map((conv) => (
            <Button
              key={conv.id}
              variant={currentConversation === conv.id ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => onConversationSelect(conv.id)}
            >
              {conv.title}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}