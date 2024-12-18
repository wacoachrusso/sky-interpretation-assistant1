import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Conversation } from '@/types/chat'
import { fetchConversations, createConversation } from '@/lib/api/conversations'
import { handleError } from '@/lib/errors'

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<string | null>(null)
  const { toast } = useToast()

  const loadConversations = useCallback(async () => {
    try {
      const data = await fetchConversations()
      setConversations(data)
      
      if (data.length > 0 && !currentConversation) {
        setCurrentConversation(data[0].id)
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
      toast({
        title: 'Error',
        description: handleError(error),
        variant: 'destructive',
      })
    }
  }, [])

  const createNewChat = async () => {
    try {
      const data = await createConversation()
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
    loadConversations()
  }, [loadConversations])

  return {
    conversations,
    currentConversation,
    setCurrentConversation,
    createNewChat,
  }
}