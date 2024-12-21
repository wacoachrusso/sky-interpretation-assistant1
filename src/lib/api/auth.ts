import { supabase } from '@/integrations/supabase/client'
import { AuthError } from '../errors'
import { persistSession, clearSession } from '@/lib/session'
import { executeSupabaseOperation } from './supabase-operations'

const RETRY_OPTIONS = {
  maxRetries: 2,
  baseDelay: 1000,
  shouldRetry: (error: any) => 
    error?.message?.includes('body stream already read') ||
    error?.message?.includes('Failed to fetch')
}

export async function signIn(email: string, password: string, stayLoggedIn = false) {
  try {
    const data = await executeSupabaseOperation(async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          persistSession: stayLoggedIn
        }
      })
      if (error) throw error
      return data
    }, RETRY_OPTIONS)
    
    if (stayLoggedIn) {
      persistSession()
    }
    
    return data
  } catch (error) {
    throw error
  }
}

export async function signUp(email: string, password: string, metadata?: any) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  })

  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  // Check if in test mode
  if (localStorage.getItem('testMode') === 'true') {
    return { id: 'test-user', email: 'test@example.com' };
  }

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  if (!user) throw new AuthError('No user found')
  return user
}

export async function isAuthenticated() {
  try {
    // Check if in test mode
    if (localStorage.getItem('testMode') === 'true') {
      return true;
    }
    await getCurrentUser()
    return true
  } catch {
    return false
  }
}

export async function testLogin() {
  localStorage.setItem('testMode', 'true')
  return true
}