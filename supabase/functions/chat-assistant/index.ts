import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://deno.land/x/openai@v4.24.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const assistantId = "asst_YdZtVHPSq6TIYKRkKcOqtwzn";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting chat-assistant function');
    const { messages, conversationId } = await req.json();
    console.log('Request payload:', { conversationId, messageCount: messages?.length });

    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const openai = new OpenAI({
      apiKey: openAIApiKey,
    });

    // Create thread
    console.log('Creating thread');
    const thread = await openai.beta.threads.create();
    console.log('Thread ID:', thread.id);

    // Get the last message from the messages array
    const lastMessage = messages[messages.length - 1];
    console.log('Processing message:', lastMessage.content);

    // Add the message to the thread
    console.log('Adding message to thread');
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: lastMessage.content,
    });

    // Run the assistant
    console.log('Starting assistant run');
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
    });

    // Wait for the run to complete
    console.log('Waiting for run to complete');
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    
    while (runStatus.status !== 'completed') {
      if (runStatus.status === 'failed') {
        console.error('Run failed:', runStatus);
        throw new Error('Assistant run failed');
      }
      if (runStatus.status === 'requires_action') {
        console.error('Run requires action:', runStatus);
        throw new Error('Assistant run requires action');
      }
      
      console.log('Current run status:', runStatus.status);
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    // Get the assistant's response
    console.log('Retrieving assistant response');
    const messagesResponse = await openai.beta.threads.messages.list(thread.id, {
      limit: 1,
      order: 'desc',
    });
    
    const assistantMessage = messagesResponse.data[0];
    console.log('Assistant response:', assistantMessage);

    return new Response(
      JSON.stringify({
        message: {
          role: 'assistant',
          content: assistantMessage.content[0].text.value,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in chat-assistant function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});