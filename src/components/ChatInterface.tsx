import React, { useState, useEffect, useRef } from 'react'
import { useToast } from './ui/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { Message, Conversation } from '@/types/chat'
import { ChatLayout } from './chat/ChatLayout'

export default function ChatInterface() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const fetchConversations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
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
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      if (error) throw error

      const typedMessages = data.map(message => ({
        ...message,
        role: message.role as "user" | "assistant"
      })) as Message[]

      setMessages(typedMessages)
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
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { data, error } = await supabase
        .from('conversations')
        .insert([{ 
          title: 'New Chat',
          user_id: user.id
        }])
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
    e.preventDefault();
    if (!input.trim() || !currentConversation || isLoading) return;

    setIsLoading(true);
    const messageContent = input;
    setInput('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Increment query count
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ query_count: (await supabase.from('profiles').select('query_count').eq('id', user.id).single()).data!.query_count + 1 })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Save user message
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .insert([{
          conversation_id: currentConversation,
          content: messageContent,
          role: 'user' as const,
          user_id: user.id
        }])
        .select()
        .single()

      if (messageError) throw messageError

      const typedMessageData = { ...messageData, role: messageData.role as "user" | "assistant" } as Message
      const updatedMessages = [...messages, typedMessageData]
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

      // Save assistant message
      const { data: assistantData, error: assistantError } = await supabase
        .from('messages')
        .insert([{
          conversation_id: currentConversation,
          content: assistantMessage.content,
          role: 'assistant' as const,
          user_id: user.id
        }])
        .select()
        .single()

      if (assistantError) throw assistantError

      const typedAssistantData = { ...assistantData, role: assistantData.role as "user" | "assistant" } as Message
      setMessages([...updatedMessages, typedAssistantData])

      // Update conversation last_message_at
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', currentConversation)
        .eq('user_id', user.id)

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatLayout
      conversations={conversations}
      currentConversation={currentConversation}
      messages={messages}
      searchTerm={searchTerm}
      input={input}
      isLoading={isLoading}
      messagesEndRef={messagesEndRef}
      onSearchChange={setSearchTerm}
      onConversationSelect={setCurrentConversation}
      onNewChat={createNewChat}
      onInputChange={setInput}
      onSend={sendMessage}
    />
  )
}
