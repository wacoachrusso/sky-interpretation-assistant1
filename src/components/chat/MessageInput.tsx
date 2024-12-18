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
    <div className="max-w-3xl mx-auto w-full">
      <form onSubmit={onSend} className="relative">
        <Textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message SkyGuide..."
          disabled={isLoading}
          className="min-h-[60px] w-full pr-20 resize-none bg-[#40414F] border-0 focus-visible:ring-0 text-white placeholder:text-[#8E8EA0] rounded-lg"
          rows={1}
        />
        <Button 
          type="submit" 
          disabled={isLoading || !input.trim()}
          className="absolute right-2 top-2 bg-[#9b87f5] hover:bg-[#7E69AB] h-[36px] w-[36px] p-0"
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
      <div className="text-xs text-center mt-2 text-[#8E8EA0]">
        SkyGuide can make mistakes. Consider checking important information.
      </div>
    </div>
  )
}