import React from 'react'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Send } from 'lucide-react'

interface MessageInputProps {
  input: string
  isLoading: boolean
  onInputChange: (value: string) => void
  onSend: (e: React.FormEvent) => void
}

export function MessageInput({ input, isLoading, onInputChange, onSend }: MessageInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend(e)
    }
  }

  return (
    <form onSubmit={onSend} className="flex gap-2">
      <Textarea
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        disabled={isLoading}
        className="min-h-[60px] flex-1"
      />
      <Button 
        type="submit" 
        disabled={isLoading || !input.trim()}
        className="bg-[#9b87f5] hover:bg-[#7E69AB] h-[60px] px-6"
      >
        <Send className="h-5 w-5" />
      </Button>
    </form>
  )
}