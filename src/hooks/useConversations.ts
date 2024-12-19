import { useState, useEffect, useCallback, useRef } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Conversation } from '@/types/chat'
import { fetchConversations, createConversation, deleteConversation, clearAllConversations } from '@/lib/api/conversations'
import { handleError } from '@/lib/errors'

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<string | null>(null)
  const { toast } = useToast()
  const isInitialized = useRef<boolean>(false)
  const isCreatingChat = useRef(false)
  const isLoadingConversations = useRef(false)

  const clearAllChats = async () => {
    try {
      await clearAllConversations()
      setConversations([])
      setCurrentConversation(null)
      const newChatId = await createNewChat()
      if (!newChatId) {
        throw new Error('Failed to create new chat after clearing')
      }
      
      toast({
        description: "All chats cleared successfully",
        duration: 2000,
      })
    } catch (error) {
      console.error('Error clearing all chats:', error)
      toast({
        title: 'Error',
        description: handleError(error),
        variant: 'destructive',
        duration: 3000,
      })
    }
  }

  const cleanupEmptyConversations = useCallback(async () => {
    try {
      const currentConversations = await fetchConversations()
      if (!currentConversations?.length) return []
      
      const emptyConversations = currentConversations.filter(c => !c.last_message_at)
      
      for (const conv of emptyConversations) {
        await deleteConversation(conv.id)
      }
      
      return currentConversations.filter(c => c.last_message_at)
    } catch (error) {
      console.error('Error cleaning up conversations:', error)
      return []
    }
  }, [])

  const refreshConversations = useCallback(async () => {
    try {
      const data = await fetchConversations()
      // Only show conversations with messages
      const activeConversations = data.filter(c => c.last_message_at)
      setConversations(activeConversations)
      return data
    } catch (error) {
      console.error('Error refreshing conversations:', error)
      return conversations
    }
  }, [conversations])

  const loadConversations = useCallback(async () => {
    try {
      if (isLoadingConversations.current) return
      isLoadingConversations.current = true

      await cleanupEmptyConversations()
      const data = await refreshConversations()
      
      if (Array.isArray(data) && data.length > 0) {
        setCurrentConversation(data[0].id)
      } else if (data) {
        setCurrentConversation(data.id)
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
      toast({
        title: 'Error',
        description: handleError(error),
        variant: 'destructive',
      })
    } finally {
      isLoadingConversations.current = false
    }
  }, [cleanupEmptyConversations, refreshConversations])

  const createNewChat = async () => {
    try {
      if (isCreatingChat.current) return null
      
      isCreatingChat.current = true
      console.log('Creating new chat...')
      
      // Clean up empty conversations first
      const currentConversations = await cleanupEmptyConversations()
      console.log('Cleaned up conversations:', currentConversations)

      // Create new conversation
      const data = await createConversation()
      console.log('Created new conversation:', data)

      // Update conversations list
      const updatedConversations = await refreshConversations()
      console.log('Refreshed conversations:', updatedConversations)

      // Set as current conversation
      setCurrentConversation(data.id)
      
      return data.id
    } catch (error) {
      console.error('Error creating new chat:', error)
      toast({
        title: 'Error',
        description: 'Failed to create new chat',
        variant: 'destructive',
        duration: 3000,
      })
      return null
    } finally {
      isCreatingChat.current = false
    }
  }

  const handleDeleteConversation = async (id: string) => {
    try {
      await deleteConversation(id)
      const updatedConversations = await refreshConversations()
      
      if (currentConversation === id) {
        // Find the next active conversation
        const activeConversations = updatedConversations.filter(c => c.last_message_at)
        const nextConversation = activeConversations[0]
        setCurrentConversation(nextConversation?.id || null)
        if (!nextConversation) {
          createNewChat()
        }
      }

      toast({
        description: "Chat deleted successfully",
        duration: 2000,
      })
    } catch (error) {
      console.error('Error deleting conversation:', error)
      toast({
        title: 'Error',
        description: handleError(error),
        variant: 'destructive',
        duration: 3000,
      })
    }
  }

  useEffect(() => {
    if (!isInitialized.current) {
      loadConversations()
      isInitialized.current = true
    }
  }, [loadConversations])

  return {
    conversations,
    currentConversation,
    setCurrentConversation,
    createNewChat,
    handleDeleteConversation,
    refreshConversations,
    clearAllChats,
  }
}