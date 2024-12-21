import { supabase } from '@/lib/api/supabase-client';
import { Message } from '@/types/chat';
import { AuthError } from '@/lib/errors';
import { getCurrentUser } from './auth';
import { saveOffline, loadOffline } from './storage';
import { executeSupabaseQuery, executeSupabaseOperation } from './supabase-operations';

export async function fetchMessages(conversationId: string): Promise<Message[]> {
  try {
    const user = await getCurrentUser();
    if (!user) throw new AuthError('No user found');

    if (localStorage.getItem('testMode') === 'true') {
      return loadOffline(`messages-${conversationId}`) || [];
    }

    const messages = await executeSupabaseQuery<Message[]>(() => 
      supabase.from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
    );

    saveOffline(`messages-${conversationId}`, messages);
    return messages;

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

    const message = await executeSupabaseQuery<Message>(() =>
      supabase
        .from('messages')
        .insert([{
          content,
          role,
          conversation_id: conversationId,
          user_id: user.id
        }])
        .select()
        .single()
    );

    // Update offline storage
    const messages = loadOffline(`messages-${conversationId}`) || [];
    saveOffline(`messages-${conversationId}`, [...messages, message]);
    
    return message;
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

    return await processMessageWithAssistant();
  } catch (error) {
    console.error('Error processing message:', error);
    throw error;
  }
}