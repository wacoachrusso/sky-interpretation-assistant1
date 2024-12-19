import { supabase } from '@/integrations/supabase/client';
import { Conversation } from '@/types/chat';
import { AuthError } from '@/lib/errors';
import { getCurrentUser } from './auth';
import { saveOffline, loadOffline } from './storage';
import { generateTitleFromContent } from '@/lib/utils';

export async function fetchConversations(): Promise<Conversation[]> {
  try {
    const user = await getCurrentUser();
    if (!user) throw new AuthError('No user found');

    // In test mode, load from localStorage
    if (localStorage.getItem('testMode') === 'true') {
      return loadOffline('conversations') || [];
    }

    const data = await supabase.select<Conversation>('conversations', {
      filter: { user_id: user.id },
      order: [{ column: 'last_message_at', ascending: false }]
    });

    // Filter out conversations with no messages
    const activeConversations = data.filter(c => c.last_message_at);
    
    // Save conversations offline for backup
    saveOffline('conversations', activeConversations);
    return activeConversations;

  } catch (error) {
    console.error('Error fetching conversations:', error);
    // Try loading from offline storage
    const offlineData = loadOffline('conversations');
    if (offlineData) return offlineData;
    throw error;
  }
}

export async function createConversation(title: string = 'New Chat'): Promise<Conversation> {
  try {
    const user = await getCurrentUser();
    if (!user) throw new AuthError('No user found');
    
    // In test mode, save to localStorage
    if (localStorage.getItem('testMode') === 'true') {
      const conversation = {
        id: `conv-${Date.now()}`,
        title,
        user_id: 'test-user',
        created_at: new Date().toISOString(),
        last_message_at: null
      };
      const conversations = loadOffline('conversations') || [];
      const activeConversations = conversations.filter(c => c.last_message_at);
      saveOffline('conversations', [conversation, ...activeConversations]);
      return conversation;
    }

    const { data, error } = await supabase
      .from('conversations')
      .insert([{
        title,
        user_id: user.id,
        last_message_at: null // This will be updated when first message is sent
      }])
      .select()
      .single();

    if (error) throw error;

    // Update offline storage
    const conversations = loadOffline('conversations') || [];
    const activeConversations = conversations.filter(c => c.last_message_at);
    saveOffline('conversations', [data, ...activeConversations]);

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

    const { error } = await supabase
      .from('conversations')
      .update({ title: truncatedTitle })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

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

    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

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

    await supabase.deleteAll('conversations', user.id);
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }

    // Clear offline storage
    saveOffline('conversations', []);

  } catch (error) {
    console.error('Error clearing conversations:', error);
    throw error;
  }
}