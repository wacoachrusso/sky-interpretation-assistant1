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
    console.log('Sending message:', input)
    
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
      console.log('Getting user data...')
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      console.log('Incrementing query count...')
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ query_count: (await supabase.from('profiles').select('query_count').eq('id', user.id).single()).data!.query_count + 1 })
        .eq('id', user.id)

      if (updateError) throw updateError

      console.log('Saving user message...')
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .insert([{
          conversation_id: conversationId,
          content: input,
          role: 'user' as const,
          user_id: user.id
        }])
        .select()
        .single()

      if (messageError) throw messageError

      const typedMessageData = { ...messageData, role: messageData.role as "user" | "assistant" } as Message
      const updatedMessages = [...messages, typedMessageData]
      setMessages(updatedMessages)

      console.log('Calling OpenAI assistant...')
      const response = await fetch('/functions/v1/chat-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          messages: updatedMessages,
          threadId: conversationId
        })
      })

      if (!response.ok) {
        console.error('Assistant response not ok:', response.status)
        throw new Error('Failed to get assistant response')
      }

      const { message: assistantMessage } = await response.json()
      console.log('Received assistant response:', assistantMessage)

      console.log('Saving assistant message...')
      const { data: assistantData, error: assistantError } = await supabase
        .from('messages')
        .insert([{
          conversation_id: conversationId,
          content: assistantMessage.content,
          role: 'assistant' as const,
          user_id: user.id
        }])
        .select()
        .single()

      if (assistantError) throw assistantError

      const typedAssistantData = { ...assistantData, role: assistantData.role as "user" | "assistant" } as Message
      setMessages([...updatedMessages, typedAssistantData])

      console.log('Updating conversation timestamp...')
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