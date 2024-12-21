import { supabase } from '@/integrations/supabase/client';
import { Conversation } from '@/types/chat';
import { AuthError } from '@/lib/errors';
import { getCurrentUser } from './auth';
import { saveOffline, loadOffline, removeOffline } from './storage';
import { generateTitleFromContent } from '@/lib/utils';
import { executeSupabaseQuery, executeSupabaseOperation } from './supabase-operations';

export async function fetchConversations(): Promise<Conversation[]> {
  try {
    const user = await getCurrentUser();
    if (!user) throw new AuthError('No user found');

    if (localStorage.getItem('testMode') === 'true') {
      return loadOffline('conversations') || [];
    }

    const data = await executeSupabaseQuery<Conversation[]>(() =>
      supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('last_message_at', { ascending: false })
    );

    // Filter out conversations with no messages
    const activeConversations = data.filter(c => c.last_message_at);
    saveOffline('conversations', activeConversations);
    return activeConversations;

  } catch (error) {
    console.error('Error fetching conversations:', error);
    const offlineData = loadOffline('conversations');
    if (offlineData) return offlineData;
    throw error;
  }
}

export async function createConversation(title: string = 'New Chat'): Promise<Conversation> {
  try {
    const user = await getCurrentUser();
    if (!user) throw new AuthError('No user found');
    
    if (localStorage.getItem('testMode') === 'true') {
      const conversation = {
        id: `conv-${Date.now()}`,
        title,
        user_id: 'test-user',
        created_at: new Date().toISOString(),
        last_message_at: null
      };
      const conversations = loadOffline('conversations') || [];
      saveOffline('conversations', [conversation, ...conversations]);
      return conversation;
    }

    const data = await executeSupabaseQuery<Conversation>(() =>
      supabase
        .from('conversations')
        .insert([{
          title,
          user_id: user.id,
          last_message_at: null
        }])
        .select()
        .single()
    );

    // Update offline storage
    const conversations = loadOffline('conversations') || [];
    saveOffline('conversations', [data, ...conversations]);

    return data;
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
}

export async function updateConversationTitle(id: string, title: string): Promise<void> {
  try {
    if (!title?.trim()) return;

    const user = await getCurrentUser();
    if (!user) throw new AuthError('No user found');
    
    // Truncate title if too long
    const truncatedTitle = generateTitleFromContent(title);

    // In test mode, update in localStorage
    if (localStorage.getItem('testMode') === 'true') {
      const conversations = loadOffline('conversations') || [];
      const updatedConversations = conversations.map(conv => 
        conv.id === id ? { ...conv, title: truncatedTitle } : conv
      );
      saveOffline('conversations', updatedConversations);
      return;
    }

    await executeSupabaseOperation(() =>
      supabase
        .from('conversations')
        .update({ title: truncatedTitle })
        .eq('id', id)
        .eq('user_id', user.id)
    );

    // Update offline storage
    const conversations = loadOffline('conversations') || [];
    const updatedConversations = conversations.map(conv => 
      conv.id === id ? { ...conv, title: truncatedTitle } : conv
    );
    saveOffline('conversations', updatedConversations);

  } catch (error) {
    console.error('Error updating conversation title:', error);
    // Only throw network errors
    if (error?.message?.includes('Failed to fetch')) {
      throw error;
    }
  }
}

export async function deleteConversation(id: string): Promise<void> {
  try {
    const user = await getCurrentUser();
    if (!user) throw new AuthError('No user found');

    // In test mode, remove from localStorage
    if (localStorage.getItem('testMode') === 'true') {
      const conversations = loadOffline('conversations') || [];
      saveOffline('conversations', conversations.filter(c => c.id !== id));
      return;
    }

    await executeSupabaseOperation(() =>
      supabase
        .from('conversations')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)
    );

    // Update offline storage
    const conversations = loadOffline('conversations') || [];
    saveOffline('conversations', conversations.filter(c => c.id !== id));

  } catch (error) {
    console.error('Error deleting conversation:', error);
    throw error;
  }
}

export async function clearAllConversations(): Promise<void> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new AuthError('No user found');
    }

    // In test mode, clear localStorage
    if (localStorage.getItem('testMode') === 'true') {
      saveOffline('conversations', []);
      return;
    }

    await executeSupabaseOperation(() =>
      supabase
        .from('conversations')
        .delete()
        .eq('user_id', user.id)
    );

    // Clear offline storage
    saveOffline('conversations', []);

  } catch (error) {
    console.error('Error clearing conversations:', error);
    throw error;
  }
}