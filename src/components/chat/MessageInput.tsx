import { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Send, Mic, MicOff } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useIsMobile } from '@/hooks/use-mobile'

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
  const isMobile = useIsMobile();

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [recognition]);

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
      try {
        recognition.stop();
        setRecognition(null);
        setIsListening(false);
        console.log('Dictation stopped manually');
      } catch (error) {
        console.error('Error stopping dictation:', error);
      }
    }
  };

  const toggleDictation = () => {
    if (!isListening) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const newRecognition = new SpeechRecognition();
        newRecognition.continuous = true;
        newRecognition.interimResults = true;
        
        let currentTranscript = input;
        
        newRecognition.onstart = () => {
          console.log('Dictation started');
          setIsListening(true);
        };

        newRecognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join(' ');
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
    <div className="max-w-3xl mx-auto w-full px-2 sm:px-4">
      <form onSubmit={handleSubmit} className="relative">
        <Textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message SkyGuide..."
          disabled={isLoading}
          className="min-h-[48px] sm:min-h-[60px] w-full pr-20 sm:pr-24 resize-none bg-[hsla(var(--input-bg))] border border-white/10 focus-visible:ring-2 focus-visible:ring-[hsl(var(--chat-gradient-start))] text-white placeholder:text-white/50 rounded-lg text-sm md:text-base shadow-lg transition-all duration-200"
          rows={1}
        />
        <div className="absolute right-2 top-1.5 sm:top-2 flex gap-2">
          <Button
            type="button"
            onClick={toggleDictation}
            className={`h-8 w-8 p-0 shadow-lg transition-all duration-200 ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-gradient-to-br from-[hsl(var(--chat-gradient-start))] to-[hsl(var(--chat-gradient-end))] hover:opacity-90'
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
            className="bg-gradient-to-br from-[hsl(var(--chat-gradient-start))] to-[hsl(var(--chat-gradient-end))] hover:opacity-90 h-8 w-8 p-0 shadow-lg transition-all duration-200"
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}