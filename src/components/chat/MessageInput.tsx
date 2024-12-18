import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Send, Mic, MicOff } from 'lucide-react'

interface MessageInputProps {
  input: string
  isLoading: boolean
  onInputChange: (value: string) => void
  onSend: (e: React.FormEvent) => void
}

// Define the SpeechRecognition interface
interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

declare let window: IWindow;

export function MessageInput({ input, isLoading, onInputChange, onSend }: MessageInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (input.trim()) {
        onSend(e)
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSend(e)
    }
  }

  const toggleDictation = () => {
    if (!isListening) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        
        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map(result => (result as any)[0])
            .map(result => result.transcript)
            .join('');
          
          onInputChange(transcript);
        };

        recognition.start();
        setRecognition(recognition);
        setIsListening(true);
      } else {
        console.log('Speech recognition not supported');
      }
    } else {
      recognition?.stop();
      setRecognition(null);
      setIsListening(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full">
      <form onSubmit={handleSubmit} className="relative">
        <Textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message SkyGuide..."
          disabled={isLoading}
          className="min-h-[60px] w-full pr-32 resize-none bg-[#40414F] border-0 focus-visible:ring-0 text-white placeholder:text-[#8E8EA0] rounded-lg"
          rows={1}
        />
        <div className="absolute right-2 top-2 flex gap-2">
          <Button
            type="button"
            onClick={toggleDictation}
            className={`h-[36px] w-[36px] p-0 ${
              isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-[#9b87f5] hover:bg-[#7E69AB]'
            }`}
            size="icon"
          >
            {isListening ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="bg-[#9b87f5] hover:bg-[#7E69AB] h-[36px] w-[36px] p-0"
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}