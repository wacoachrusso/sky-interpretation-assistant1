import React from 'react'
import { Message } from '@/types/chat'
import { ScrollArea } from '../ui/scroll-area'

interface MessageListProps {
  messages: Message[]
  messagesEndRef: React.RefObject<HTMLDivElement>
}

export function MessageList({ messages, messagesEndRef }: MessageListProps) {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'assistant' ? 'justify-start' : 'justify-end'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'assistant'
                  ? 'bg-white border border-gray-200'
                  : 'bg-[#9b87f5] text-white'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  )
}