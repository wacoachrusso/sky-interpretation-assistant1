import React from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

interface MessageInputProps {
  input: string
  isLoading: boolean
  onInputChange: (value: string) => void
  onSend: (e: React.FormEvent) => void
}

export function MessageInput({ input, isLoading, onInputChange, onSend }: MessageInputProps) {
  return (
    <form onSubmit={onSend} className="p-4 border-t">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          Send
        </Button>
      </div>
    </form>
  )
}