import React from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { ScrollArea } from '../ui/scroll-area'
import { Search, Plus, MessageSquare, Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Conversation } from '@/types/chat'

interface ConversationListProps {
  conversations: Conversation[]
  currentConversation: string | null
  searchTerm: string
  onSearchChange: (value: string) => void
  onConversationSelect: (id: string) => void
  onNewChat: () => void
  onDeleteConversation: (id: string) => void
}

export function ConversationList({
  conversations,
  currentConversation,
  searchTerm,
  onSearchChange,
  onConversationSelect,
  onNewChat,
  onDeleteConversation,
}: ConversationListProps) {
  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full">
      <div className="p-3">
        <Button 
          onClick={onNewChat} 
          className="w-full bg-gradient-to-br from-[hsl(var(--chat-gradient-start))] to-[hsl(var(--chat-gradient-end))] hover:opacity-90 text-white border-0 flex items-center gap-2 shadow-lg transition-all duration-200"
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
            className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/50 focus-visible:ring-2 focus-visible:ring-[hsl(var(--chat-gradient-start))] transition-all duration-200"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-2 py-1">
          {filteredConversations.map((conv) => (
            <div key={conv.id} className="relative group">
              <div
                className={`
                  flex items-center w-full mb-1 group
                  ${currentConversation === conv.id ? 'bg-[#2D2D30]' : 'hover:bg-[#2D2D30]'}
                  rounded-md
                `}
              >
                <Button
                  variant="ghost"
                  className={`
                    flex-1 justify-start text-sm h-auto py-3 px-2
                    ${currentConversation === conv.id ? 'text-white' : 'text-[#ECECF1]'}
                  `}
                  onClick={() => onConversationSelect(conv.id)}
                >
                  <MessageSquare className="w-4 h-4 mr-2 shrink-0" />
                  <span className="truncate text-left">{conv.title}</span>
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 h-8 w-8 mr-2 hover:bg-red-500/20"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-[#2D2D30] border-[#4D4D4F] text-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Chat</AlertDialogTitle>
                      <AlertDialogDescription className="text-[#8E8EA0]">
                        Are you sure you want to delete this chat? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-transparent border-[#4D4D4F] text-white hover:bg-[#3D3D40]">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDeleteConversation(conv.id)}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}