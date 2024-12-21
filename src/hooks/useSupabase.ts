import { useState, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'
import { retryWithBackoff } from '@/lib/retry-utils'
import { handleError } from '@/lib/errors'

const RETRY_OPTIONS = {
  maxRetries: 3,
  baseDelay: 1000,
  shouldRetry: (error: any) => 
    error?.message?.includes('body stream already read') ||
    error?.message?.includes('Failed to fetch'),
  onRetry: (attempt: number, error: any) => {
    console.warn(`Retry attempt ${attempt}, error:`, handleError(error))
  }
}

export function useSupabase() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const executeWithRetry = useCallback(async <T>(
    operation: () => Promise<T>,
    options: {
      loadingMessage?: string
      successMessage?: string
      errorMessage?: string
    } = {}
  ): Promise<T | null> => {
    const { loadingMessage, successMessage, errorMessage } = options
    
    try {
      setIsLoading(true)
      
      const result = await retryWithBackoff(operation, RETRY_OPTIONS)
      
      if (successMessage) {
        toast({
          description: successMessage,
          duration: 2000,
        })
      }
      
      return result
    } catch (error) {
      console.error('Operation failed:', error)
      toast({
        title: 'Error',
        description: errorMessage || handleError(error),
        variant: 'destructive',
        duration: 3000,
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  return {
    isLoading,
    executeWithRetry
  }
}