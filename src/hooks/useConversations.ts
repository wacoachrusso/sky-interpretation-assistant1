import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { Conversation } from '@/types/chat'

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<string | null>(null)
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
      return data.id
    } catch (error) {
      console.error('Error creating new chat:', error)
      toast({
        title: 'Error',
        description: 'Failed to create new chat',
        variant: 'destructive',
      })
      return null
    }
  }

  useEffect(() => {
    fetchConversations()
  }, [])

  return {
    conversations,
    currentConversation,
    setCurrentConversation,
    createNewChat,
  }
}