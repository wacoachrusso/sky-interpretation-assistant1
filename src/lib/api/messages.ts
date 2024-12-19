import { supabase } from '@/lib/api/supabase-client';
import { Message } from '@/types/chat';
import { AuthError, isRetryableError } from '@/lib/errors';
import { getCurrentUser } from './auth';
import { saveOffline, loadOffline } from './storage';
import { retryWithBackoff } from '@/lib/retry-utils';

const RETRY_OPTIONS = {
  maxRetries: 3,
  baseDelay: 1000,
  shouldRetry: isRetryableError
};


export async function fetchMessages(conversationId: string): Promise<Message[]> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      const testMode = localStorage.getItem('testMode') === 'true';
      if (testMode) return loadOffline(`messages-${conversationId}`) || [];
      throw new AuthError();
    }

    const fetchMessagesFromDB = async () => {
      return await supabase.select<Message>('messages', {
        filter: { conversation_id: conversationId, user_id: user.id },
        order: [{ column: 'created_at', ascending: true }]
      });
    };

    const data = await retryWithBackoff(fetchMessagesFromDB, RETRY_OPTIONS);
    saveOffline(`messages-${conversationId}`, data);
    return data;

  } catch (error) {
    console.error('Error fetching messages:', error);
    const offlineData = loadOffline(`messages-${conversationId}`);
    if (offlineData) return offlineData;
    throw error;
  }
}

export async function saveMessage(
  content: string,
  role: 'user' | 'assistant',
  conversationId: string
): Promise<Message> {
  try {
    const user = await getCurrentUser();
    if (!user) throw new AuthError('No user found');

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

    const saveMessageToDB = async () => {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          content,
          role,
          conversation_id: conversationId,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    };

    const data = await retryWithBackoff(saveMessageToDB, RETRY_OPTIONS);
    
    // Update offline storage
    const messages = loadOffline(`messages-${conversationId}`) || [];
    saveOffline(`messages-${conversationId}`, [...messages, data]);
    
    return data;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
}

export async function processMessage(
  content: string,
  conversationId: string,
  messages: Message[]
): Promise<string> {
  try {
    const processMessageWithAssistant = async () => {
      const response = await supabase.functions.invoke('chat-assistant', { 
        body: { messages, conversationId }
      });

      if (response.error) throw response.error;
      if (!response.data?.message?.content) {
        throw new Error('Invalid response from assistant');
      }

      return response.data.message.content;
    };

    return await retryWithBackoff(processMessageWithAssistant, RETRY_OPTIONS);
  } catch (error) {
    console.error('Error processing message:', error);
    throw error;
  }
}