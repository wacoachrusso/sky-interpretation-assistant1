export class ChatError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly details?: any
  ) {
    super(message)
    this.name = 'ChatError'
  }
}

export class AuthError extends ChatError {
  constructor(message = 'Authentication required') {
    super(message, 'AUTH_ERROR')
    this.name = 'AuthError'
  }
}

export class NetworkError extends ChatError {
  constructor(message = 'Network error occurred') {
    super(message, 'NETWORK_ERROR')
    this.name = 'NetworkError'
  }
}

export class SupabaseError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = 'SupabaseError'
  }
}

export function handleError(error: any): string {
  console.error('Error occurred:', error)
  
  if (error instanceof ChatError) {
    return error.message
  }
  
  if (error instanceof SupabaseError) {
    return error.message
  }
  
  if (error?.message?.includes('Failed to fetch')) {
    return 'Network error occurred. Please check your connection.'
  }

  if (error?.message?.includes('body stream already read')) {
    return 'Request failed - please try again'
  }
  
  return 'An unexpected error occurred. Please try again.'
}

export function isRetryableError(error: any): boolean {
  return (
    error?.message?.includes('body stream already read') ||
    error?.message?.includes('Failed to fetch') ||
    error?.code === 'NETWORK_ERROR' ||
    error?.message?.includes('Failed to execute \'text\' on \'Response\'')
  )
}