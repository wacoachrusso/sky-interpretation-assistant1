import { supabase } from '@/integrations/supabase/client'
import { AuthError } from '@/lib/errors'

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new AuthError()
  return user
}

export async function isAuthenticated() {
  try {
    await getCurrentUser()
    return true
  } catch {
    return false
  }
}