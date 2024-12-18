import { supabase } from '@/integrations/supabase/client';
import { Conversation } from '@/types/chat';
import { AuthError } from '@/lib/errors';
import { getCurrentUser } from './auth';
import { saveOffline, loadOffline } from './storage';

export async function fetchConversations(): Promise<Conversation[]> {
  try {
    const user = await getCurrentUser();
    if (!user) throw new AuthError('No user found');

    // In test mode, load from localStorage
    if (localStorage.getItem('testMode') === 'true') {
      return loadOffline('conversations') || [];
    }

    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', user.id)
      .order('last_message_at', { ascending: false });

    if (error) throw error;

    // Save conversations offline for backup
    saveOffline('conversations', data);
    return data;

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
    
    // Prevent duplicate conversation creation
    const existingConversations = await fetchConversations();
    if (existingConversations.some(c => c.title === title && !c.last_message_at)) {
      return existingConversations.find(c => c.title === title)!;
    }

    // In test mode, save to localStorage
    if (localStorage.getItem('testMode') === 'true') {
      const conversation = {
        id: `conv-${Date.now()}`,
        title,
        user_id: 'test-user',
        created_at: new Date().toISOString(),
        last_message_at: new Date().toISOString()
      };
      const conversations = loadOffline('conversations') || [];
      saveOffline('conversations', [conversation, ...conversations]);
      return conversation;
    }

    const { data, error } = await supabase
      .from('conversations')
      .insert([{
        title,
        user_id: user.id,
        last_message_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    // Update offline storage
    const conversations = loadOffline('conversations') || [];
    const uniqueConversations = [data, ...conversations].filter((conv, index, self) => 
      index === self.findIndex(c => c.id === conv.id)
    );
    saveOffline('conversations', uniqueConversations);

    return data;

  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
}

export async function updateConversationTitle(id: string, title: string): Promise<void> {
  try {
    const user = await getCurrentUser();
    if (!user) throw new AuthError('No user found');
    
    // Don't update title if it's empty
    if (!title.trim()) return;
    
    // Truncate title if too long
    const truncatedTitle = title.slice(0, 100);

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
      .eq('user_id', user.id)
      .select();

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