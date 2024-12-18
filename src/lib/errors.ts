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

export function handleError(error: any) {
  console.error('Error occurred:', error)
  
  if (error instanceof ChatError) {
    return error.message
  }
  
  if (error?.message?.includes('Failed to fetch')) {
    return 'Network error occurred. Please check your connection.'
  }
  
  return 'An unexpected error occurred. Please try again.'
}