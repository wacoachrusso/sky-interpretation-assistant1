import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { Message } from '@/types/chat'

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

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

  const sendMessage = async (input: string, conversationId: string) => {
    if (!input.trim() || !conversationId || isLoading) {
      console.log('Message not sent. Conditions:', {
        inputEmpty: !input.trim(),
        noConversation: !conversationId,
        isLoading
      })
      return
    }

    setIsLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      // Save user message
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .insert([{
          conversation_id: conversationId,
          content: input,
          role: 'user',
          user_id: user.id
        }])
        .select()
        .single()

      if (messageError) throw messageError

      const typedMessageData = { ...messageData, role: messageData.role as "user" | "assistant" } as Message
      const updatedMessages = [...messages, typedMessageData]
      setMessages(updatedMessages)

      // Call chat-assistant function
      const { data: functionData, error: functionError } = await supabase.functions.invoke('chat-assistant', {
        body: {
          messages: updatedMessages,
          threadId: conversationId
        }
      })

      if (functionError) throw functionError

      // Save assistant message
      const { data: assistantData, error: assistantError } = await supabase
        .from('messages')
        .insert([{
          conversation_id: conversationId,
          content: functionData.message.content,
          role: 'assistant',
          user_id: user.id
        }])
        .select()
        .single()

      if (assistantError) throw assistantError

      const typedAssistantData = { ...assistantData, role: assistantData.role as "user" | "assistant" } as Message
      setMessages([...updatedMessages, typedAssistantData])

      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversationId)
        .eq('user_id', user.id)

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

  return {
    messages,
    isLoading,
    sendMessage,
    fetchMessages,
  }
}