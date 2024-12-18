import { supabase } from '@/integrations/supabase/client'
import { AuthError } from '@/lib/errors'
import { TEST_USER_ID } from '../constants'
import { createMockConversation } from '../mock-data'

export async function testLogin() {
  try {
    // Set test user data in localStorage
    localStorage.setItem('testMode', 'true')
    localStorage.setItem('testUserId', TEST_USER_ID)
    
    // Create initial test conversation if none exists
    const conversations = JSON.parse(localStorage.getItem('conversations') || '[]')
    if (conversations.length === 0) {
      const newConversation = createMockConversation('New Chat')
      localStorage.setItem('conversations', JSON.stringify([newConversation]))
    }
    
    return { user: { id: TEST_USER_ID } }
  } catch (error) {
    console.error('Test login failed:', error)
    throw error
  }
}

export async function getCurrentUser() {
  // Check for test mode
  if (localStorage.getItem('testMode') === 'true') {
    return { id: localStorage.getItem('testUserId') }
  }

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new AuthError()
  return user
}

export async function isAuthenticated() {
  try {
    // Check for test mode
    if (localStorage.getItem('testMode') === 'true') {
      return true
    }

    await getCurrentUser()
    return true
  } catch {
    return false
  }
}

export async function signOut() {
  // Clear test mode
  localStorage.removeItem('testMode')
  localStorage.removeItem('testUserId')
  
  // Sign out from Supabase
  return supabase.auth.signOut()
}