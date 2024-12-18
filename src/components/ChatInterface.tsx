import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { ScrollArea } from './ui/scroll-area'
import { Sidebar } from './ui/sidebar'
import { useToast } from './ui/use-toast'
import { Search } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

interface Conversation {
  id: string
  title: string
  last_message_at: string
}

export default function ChatInterface() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const navigate = useNavigate()

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations()
  }, [])

  // Fetch messages when conversation changes
  useEffect(() => {
    if (currentConversation) {
      fetchMessages(currentConversation)
    }
  }, [currentConversation])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('last_message_at', { ascending: false })

      if (error) throw error

      setConversations(data)
      if (data.length > 0 && !currentConversation) {
        setCurrentConversation(data[0].id)
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
      toast({
        title: 'Error',
        description: 'Failed to load conversations',
        variant: 'destructive',
      })
    }
  }

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) throw error

      setMessages(data)
    } catch (error) {
      console.error('Error fetching messages:', error)
      toast({
        title: 'Error',
        description: 'Failed to load messages',
        variant: 'destructive',
      })
    }
  }

  const createNewChat = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert([{ title: 'New Chat' }])
        .select()
        .single()

      if (error) throw error

      setConversations([data, ...conversations])
      setCurrentConversation(data.id)
      setMessages([])
    } catch (error) {
      console.error('Error creating new chat:', error)
      toast({
        title: 'Error',
        description: 'Failed to create new chat',
        variant: 'destructive',
      })
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !currentConversation || isLoading) return

    setIsLoading(true)
    const messageContent = input
    setInput('')

    try {
      // Save user message to database
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .insert([{
          conversation_id: currentConversation,
          content: messageContent,
          role: 'user'
        }])
        .select()
        .single()

      if (messageError) throw messageError

      // Update messages state
      const updatedMessages = [...messages, messageData]
      setMessages(updatedMessages)

      // Call OpenAI assistant
      const response = await fetch('/functions/v1/chat-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          messages: updatedMessages,
          threadId: currentConversation
        })
      })

      if (!response.ok) throw new Error('Failed to get assistant response')

      const { message: assistantMessage } = await response.json()

      // Save assistant message to database
      const { data: assistantData, error: assistantError } = await supabase
        .from('messages')
        .insert([{
          conversation_id: currentConversation,
          content: assistantMessage.content,
          role: 'assistant'
        }])
        .select()
        .single()

      if (assistantError) throw assistantError

      // Update messages state with assistant response
      setMessages([...updatedMessages, assistantData])

      // Update conversation last_message_at
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', currentConversation)

    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar className="w-64 p-4 border-r">
        <div className="space-y-4">
          <Button
            onClick={createNewChat}
            className="w-full"
            variant="outline"
          >
            New Chat
          </Button>

          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="space-y-2">
              {filteredConversations.map((conv) => (
                <Button
                  key={conv.id}
                  variant={currentConversation === conv.id ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setCurrentConversation(conv.id)}
                >
                  {conv.title}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </Sidebar>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
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
                      ? 'bg-secondary'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <form onSubmit={sendMessage} className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}