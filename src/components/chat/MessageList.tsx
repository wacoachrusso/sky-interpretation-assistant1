import React from 'react'
import { Message } from '@/types/chat'
import { ScrollArea } from '../ui/scroll-area'

interface MessageListProps {
  messages: Message[]
  messagesEndRef: React.RefObject<HTMLDivElement>
}

export function MessageList({ messages, messagesEndRef }: MessageListProps) {
  return (
    <ScrollArea className="flex-1">
      <div className="w-full">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-[calc(100vh-80px)]">
            <div className="text-center space-y-3">
              <img
                src="/lovable-uploads/4d0b5f1f-ee3c-422d-81df-9db600490aec.png"
                alt="SkyGuide Logo"
                className="h-12 mx-auto opacity-50"
              />
              <h3 className="text-xl font-semibold text-white">How can I help you today?</h3>
            </div>
          </div>
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
                <div className="max-w-3xl mx-auto flex gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    message.role === 'assistant'
                      ? 'bg-[#9b87f5]'
                      : 'bg-[#5C5C7B]'
                  }`}>
                    {message.role === 'assistant' ? 'AI' : 'U'}
                  </div>
                  <div className="text-[#ECECF1] leading-relaxed whitespace-pre-wrap">
                    {message.content}
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