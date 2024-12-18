import React from 'react'
import { Message } from '@/types/chat'
import { ScrollArea } from '../ui/scroll-area'
import { EmptyState } from './EmptyState'
import { TypewriterText } from './TypewriterText'
import { Button } from '../ui/button'
import { Download } from 'lucide-react'
import { useToast } from '../ui/use-toast'
import { useIsMobile } from '@/hooks/use-mobile'

interface MessageListProps {
  messages: Message[]
  messagesEndRef: React.RefObject<HTMLDivElement>
}

export function MessageList({ messages, messagesEndRef }: MessageListProps) {
  const { toast } = useToast()
  const isMobile = useIsMobile()

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
    <ScrollArea className="h-full">
      <div className="min-h-full">
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="pb-32 pt-4">
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
                        {message.content}
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
  )
}