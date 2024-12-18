import React, { useState, useEffect } from 'react'
import { Message } from '@/types/chat'
import { ScrollArea } from '../ui/scroll-area'
import { EmptyState } from './EmptyState'
import { Button } from '../ui/button'
import { Download } from 'lucide-react'
import { useToast } from '../ui/use-toast'
import { useIsMobile } from '@/hooks/use-mobile'
import { TypewriterMarkdown } from './TypewriterMarkdown'

interface MessageListProps {
  messages: Message[]
  messagesEndRef: React.RefObject<HTMLDivElement>
}

export function MessageList({ messages, messagesEndRef }: MessageListProps) {
  const { toast } = useToast()
  const isMobile = useIsMobile()
  const [lastMessageId, setLastMessageId] = useState<string | null>(null)

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessageId(messages[messages.length - 1].id)
    }
  }, [messages])

  useEffect(() => {
    console.log('Scrolling to latest message')
    if (messagesEndRef.current) {
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
    <div className="relative h-[calc(100vh-8rem)] bg-[#343541]">
      <div className="absolute inset-0 flex flex-col">
        <ScrollArea className="flex-1">
          <div className="min-h-full pb-32">
            {messages.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="pt-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`px-4 py-6 ${
                      message.role === 'assistant'
                        ? 'bg-[#444654]'
                        : ''
                    }`}
                  >
                    <div className={`${isMobile ? 'w-full px-2' : 'max-w-3xl mx-auto'} flex gap-4`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        message.role === 'assistant'
                          ? 'bg-[#9b87f5]'
                          : 'bg-[#5C5C7B]'
                      }`}>
                        {message.role === 'assistant' ? 'AI' : 'U'}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start gap-4">
                          <div className={`text-[#ECECF1] leading-relaxed whitespace-pre-wrap ${
                            isMobile ? 'text-sm' : 'text-base'
                          }`}>
                            {message.role === 'assistant' && message.id === lastMessageId ? (
                              <TypewriterMarkdown 
                                content={message.content} 
                                speed={20} 
                                onComplete={() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })}
                              />
                            ) : (
                              <TypewriterMarkdown 
                                content={message.content}
                                instant={true}
                              />
                            )}
                          </div>
                          {message.role === 'assistant' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDownload(message.content)}
                              className="text-gray-400 hover:text-white shrink-0"
                            >
                              <Download className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
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