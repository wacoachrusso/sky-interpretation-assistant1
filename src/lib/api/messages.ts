import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/chat';
import { AuthError } from '@/lib/errors';
import { getCurrentUser } from './auth';
import { saveOffline, loadOffline } from './storage';

export async function fetchMessages(conversationId: string): Promise<Message[]> {
  try {
    const user = await getCurrentUser();
    if (!user) throw new AuthError('No user found');

    // In test mode, load from localStorage
    if (localStorage.getItem('testMode') === 'true') {
      return loadOffline(`messages-${conversationId}`) || [];
    }

    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Save messages offline for backup
    saveOffline(`messages-${conversationId}`, messages);
    return messages;

  } catch (error) {
    console.error('Error fetching messages:', error);
    // Try loading from offline storage
    const offlineData = loadOffline(`messages-${conversationId}`);
    if (offlineData) return offlineData;
    throw error;
  }
}

export async function processMessage(input: string, conversationId: string, messages: Message[]): Promise<string> {
  try {
    const response = await supabase.functions.invoke('chat-assistant', {
      body: {
        messages,
        conversationId,
        retryCount: 0,
        maxRetries: 3
      }
    });

    if (response.error) throw response.error;
    if (!response.data?.message?.content) {
      throw new Error('Invalid response from assistant');
    }

    return response.data.message.content;

  } catch (error) {
    console.error('Error processing message:', error);
    if (error.message?.includes('body stream already read')) {
      // Retry once with increased delay
      const retryCount = (error.retryCount || 0) + 1;
      const delay = Math.min(1000 * Math.pow(2, retryCount), 8000);
      await new Promise(resolve => setTimeout(resolve, delay));
      if (retryCount < 3) {
        return await processMessage(input, conversationId, messages);
      }
    }
    }
    throw error;
}

export async function saveMessage(
  content: string,
  role: 'user' | 'assistant',
  conversationId: string
): Promise<Message> {
  try {
    const user = await getCurrentUser();
    if (!user) throw new AuthError('No user found');

    // In test mode, save to localStorage
    if (localStorage.getItem('testMode') === 'true') {
      const message = {
        id: `msg-${Date.now()}`,
        content,
        role,
        conversation_id: conversationId,
        created_at: new Date().toISOString(),
        user_id: 'test-user'
      };
      const messages = loadOffline(`messages-${conversationId}`) || [];
      saveOffline(`messages-${conversationId}`, [...messages, message]);
      return message;
    }

    const messageData = {
      content,
      role,
      conversation_id: conversationId,
      user_id: user.id
    };

    const { data, error } = await supabase
      .from('messages')
      .insert([messageData])
      .select()
      .single();

    if (error) throw error;

    // Update offline storage
    const messages = loadOffline(`messages-${conversationId}`) || [];
    saveOffline(`messages-${conversationId}`, [...messages, data]);

    return data as Message;

  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
}