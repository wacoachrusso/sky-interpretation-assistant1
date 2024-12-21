import { useEffect } from 'react'
import { Message } from '@/types/chat'
import { ScrollArea } from '../ui/scroll-area'
import { EmptyState } from './EmptyState'
import { TypewriterMarkdown } from './TypewriterMarkdown'
import { Button } from '../ui/button'
import { Download } from 'lucide-react'
import { useToast } from '../ui/use-toast'
import { useIsMobile } from '@/hooks/use-mobile'
import { LoadingMessage } from './LoadingMessage'

const CONTRACT_REFERENCE_STYLES = "bg-gray-900 p-3 rounded-md border border-gray-700 my-2 font-mono text-sm overflow-x-auto max-w-full whitespace-pre-wrap break-words shadow-lg mx-auto text-white"

interface MessageListProps {
  messages: Message[]
  isLoading: boolean
  messagesEndRef: React.RefObject<HTMLDivElement>
}

export function MessageList({ messages, isLoading, messagesEndRef }: MessageListProps) {
  const { toast } = useToast()
  const isMobile = useIsMobile()
  const lastMessageId = messages.length > 0 ? messages[messages.length - 1].id : null

  useEffect(() => {
    console.log('Scrolling to latest message')
    if (messagesEndRef.current) {
      // Use instant scroll for first message or when many messages are loaded
      const behavior = messages.length <= 1 ? 'auto' : 'smooth'
      messagesEndRef.current.scrollIntoView({ behavior })
    }
  }, [messages])

  const handleDownload = (content: string) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'skyguide-response.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      description: "Response downloaded successfully",
    })
  }

  return (
    <div className="relative h-[calc(100dvh-8rem)] bg-[#343541]">
      <div className="absolute inset-0 flex flex-col">
        <ScrollArea className="flex-1 [&>div>div]:!block">
          <div className="min-h-full pb-32">
            {messages.length === 0 && !isLoading ? (
              <EmptyState />
            ) : (
              <div className="pt-2">
                {messages.map((message) => (
                  <div
                    key={`${message.id}-${message.created_at}`}
                    className={`px-4 py-3 ${
                      message.role === 'assistant' 
                        ? 'bg-[hsla(var(--assistant-message-bg))] hover:bg-[hsla(var(--message-hover))]'
                        : 'bg-[hsla(var(--user-message-bg))] hover:bg-[hsla(var(--message-hover))]'
                    }`}
                  >
                    <div className={`w-full px-2 sm:px-0 max-w-[95%] lg:max-w-4xl mx-auto flex gap-2 sm:gap-3`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        message.role === 'assistant'
                          ? 'bg-gradient-to-br from-[hsl(var(--chat-gradient-start))] to-[hsl(var(--chat-gradient-end))] shadow-lg'
                          : 'bg-gradient-to-br from-[hsl(var(--accent-purple))] to-[hsl(var(--accent-blue))] shadow-lg'
                      }`}>
                        {message.role === 'assistant' ? 'AI' : 'U'}
                      </div>
                      <div className="flex-1 min-w-0 overflow-hidden break-words">
                        <div className="flex justify-between items-start gap-2">
                          <div className={`text-[#ECECF1] leading-relaxed break-words max-w-full ${
                            isMobile ? 'text-sm' : 'text-base'
                          }`}>
                            {message.role === 'assistant' && message.id === lastMessageId ? (
                              <TypewriterMarkdown 
                                content={message.content} 
                                speed={5}
                                contractReferenceClassName={CONTRACT_REFERENCE_STYLES}
                                onComplete={() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })}
                              />
                            ) : (
                              <TypewriterMarkdown 
                                content={message.content}
                                instant={true}
                                contractReferenceClassName={CONTRACT_REFERENCE_STYLES}
                              />
                            )}
                          </div>
                          {message.role === 'assistant' && (
                            <Button
                              variant="ghost"
                              className="flex items-center gap-2 text-gray-400 hover:text-white"
                              onClick={() => handleDownload(message.content)}
                            >
                              <Download className="h-4 w-4" />
                              <span className="hidden sm:inline">Save offline</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
                {isLoading && <LoadingMessage />}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, #343541 20%, rgba(52, 53, 65, 0.001) 100%)'
        }}
      />
    </div>
  )
}