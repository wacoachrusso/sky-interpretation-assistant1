import React from 'react'
import { SidebarProvider } from '../ui/sidebar'
import { QueryLimitChecker } from './QueryLimitChecker'
import { ConversationSidebar } from './ConversationSidebar'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import { Message, Conversation } from '@/types/chat'
import { useIsMobile } from '@/hooks/use-mobile'
import { Button } from '../ui/button'
import { UserMenu } from './UserMenu'
import { Menu, ArrowLeft } from 'lucide-react'

interface ChatLayoutProps {
  conversations: Conversation[]
  currentConversation: string | null
  messages: Message[]
  searchTerm: string
  input: string
  isLoading: boolean
  isNewMessage: boolean
  messagesEndRef: React.RefObject<HTMLDivElement>
  onSearchChange: (value: string) => void
  onConversationSelect: (id: string) => void
  onNewChat: () => void
  onInputChange: (value: string) => void
  onSend: (e: React.FormEvent) => void,
  onDeleteConversation: (id: string) => void
}

export function ChatLayout({
  conversations,
  currentConversation,
  messages,
  searchTerm,
  input,
  isLoading,
  isNewMessage,
  messagesEndRef,
  onSearchChange,
  onConversationSelect,
  onNewChat,
  onInputChange,
  onSend,
  onDeleteConversation,
}: ChatLayoutProps) {
  const isMobile = useIsMobile()
  const [showSidebar, setShowSidebar] = React.useState(!isMobile)

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar)
  }

  React.useEffect(() => {
    if (!isMobile) {
      setShowSidebar(true)
    }
  }, [isMobile])

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-gradient-to-br from-[hsl(var(--chat-gradient-start))] to-[hsl(var(--chat-gradient-end))] bg-opacity-5">
      <QueryLimitChecker />
      
      {/* Sidebar */}
      <div 
        className={`
          fixed inset-y-0 left-0 z-50 w-full sm:w-72 lg:w-80 transform transition-transform duration-300 ease-in-out
          ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0
          bg-[hsla(var(--sidebar-bg))] border-r border-white/10 shadow-xl
        `}
      >
        <ConversationSidebar
          conversations={conversations}
          currentConversation={currentConversation}
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          onConversationSelect={(id) => {
            onConversationSelect(id)
            if (isMobile) {
              setShowSidebar(false)
            }
          }}
          onNewChat={() => {
            onNewChat()
            if (isMobile) {
              setShowSidebar(false)
            }
          }}
          onDeleteConversation={onDeleteConversation}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative w-full md:w-auto">
        {/* Mobile Header */}
        <div className="h-14 flex items-center px-4 bg-[hsla(var(--sidebar-bg))] border-b border-white/10 sticky top-0 z-10 shadow-md">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-white hover:bg-white/10 transition-colors"
          >
            {showSidebar ? <ArrowLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <span className="ml-4 text-white font-medium">
            {currentConversation ? 'Chat' : 'SkyGuide'}
          </span>
          <div className="ml-auto">
            <UserMenu />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 relative">
          <MessageList
            messages={messages}
            isLoading={isLoading}
            messagesEndRef={messagesEndRef}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#343541] to-transparent h-32 pointer-events-none" />
        </div>

        {/* Input */}
        <div className="p-2 sm:p-4 relative sticky bottom-0 bg-[hsla(var(--sidebar-bg))] shadow-lg">
          <MessageInput
            input={input}
            isLoading={isLoading}
            onInputChange={onInputChange}
            onSend={onSend}
          />
        </div>
      </div>
    </div>
  )
}