import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Send, Mic, MicOff } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface MessageInputProps {
  input: string
  isLoading: boolean
  onInputChange: (value: string) => void
  onSend: (e: React.FormEvent) => void
}

interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

declare let window: IWindow;

export function MessageInput({ input, isLoading, onInputChange, onSend }: MessageInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const { toast } = useToast();

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

  const stopDictation = () => {
    if (recognition) {
      recognition.stop();
      setRecognition(null);
      setIsListening(false);
    }
  };

  const toggleDictation = () => {
    if (!isListening) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const newRecognition = new SpeechRecognition();
        newRecognition.continuous = true;
        newRecognition.interimResults = true;
        
        // Keep existing input when starting dictation
        let currentTranscript = input;
        
        newRecognition.onstart = () => {
          console.log('Dictation started');
          setIsListening(true);
        };

        newRecognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join(' ');
          
          // Combine existing input with new transcript
          onInputChange(currentTranscript + ' ' + transcript);
        };

        newRecognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          toast({
            title: "Dictation Error",
            description: `Error: ${event.error}. Please try again.`,
            variant: "destructive"
          });
          stopDictation();
        };

        newRecognition.onend = () => {
          console.log('Dictation ended');
          setIsListening(false);
          setRecognition(null);
        };

        try {
          newRecognition.start();
          setRecognition(newRecognition);
        } catch (error) {
          console.error('Error starting dictation:', error);
          toast({
            title: "Dictation Error",
            description: "Failed to start dictation. Please try again.",
            variant: "destructive"
          });
          stopDictation();
        }
      } else {
        toast({
          title: "Not Supported",
          description: "Speech recognition is not supported in your browser.",
          variant: "destructive"
        });
      }
    } else {
      stopDictation();
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
