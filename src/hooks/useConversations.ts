import * as React from 'react'
const { useState, useEffect, useCallback } = React
import { useToast } from '@/components/ui/use-toast'
import { Conversation } from '@/types/chat'
import { fetchConversations, createConversation, deleteConversation } from '@/lib/api/conversations'
import { handleError } from '@/lib/errors'

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<string | null>(null)
  const { toast } = useToast()
  const isInitialized = React.useRef(false)
  const isCreatingChat = React.useRef(false)

  // Load conversations from local storage on initial mount
  useEffect(() => {
    if (!isInitialized.current) {
      loadConversations()
      isInitialized.current = true
    }
  }, [])

  const loadConversations = useCallback(async () => {
    try {
      const data = await fetchConversations()
      setConversations(data)
      localStorage.setItem('conversations', JSON.stringify(data))
      
      if (data.length > 0) {
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
      // Prevent multiple simultaneous chat creations
      if (isCreatingChat.current) return null
      isCreatingChat.current = true

      const data = await createConversation()
      const updatedConversations = [data, ...conversations]
      setConversations(updatedConversations)
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

      // Update local state
      const updatedConversations = conversations.filter(conv => conv.id !== id)
      setConversations(updatedConversations)
      
      // If the deleted conversation was selected, select the first available one
      if (currentConversation === id) {
        const nextConversation = updatedConversations[0]
        setCurrentConversation(nextConversation?.id || null)
        // Create new chat if no conversations left
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
    loadConversations()
  }, [loadConversations])

  // Auto-start new chat when no conversation exists
  useEffect(() => {
    if (isInitialized.current && conversations.length === 0 && !isCreatingChat.current) {
      createNewChat()
    }
  }, [conversations.length, isInitialized.current])

  return {
    conversations,
    currentConversation,
    setCurrentConversation,
    createNewChat,
    handleDeleteConversation,
  }
}