import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://deno.land/x/openai@v4.24.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    console.log('Received request to chat-assistant function');
    const { messages, threadId } = await req.json();
    console.log('Request payload:', { threadId, messageCount: messages.length });

    const openai = new OpenAI({
      apiKey: openAIApiKey,
    });

    let thread;
    if (!threadId) {
      console.log('Creating new thread');
      thread = await openai.beta.threads.create();
      console.log('Created new thread:', thread.id);
    } else {
      thread = { id: threadId };
      console.log('Using existing thread:', thread.id);
    }

    // Add the user's message to the thread
    const lastMessage = messages[messages.length - 1];
    console.log('Adding user message to thread:', lastMessage.content);
    
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: lastMessage.content,
    });

    // Run the assistant with the specific Assistant ID
    console.log('Starting assistant run');
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: "asst_YdZtVHPSq6TIYKRkKcOqtwzn",
      instructions: "You are a helpful AI assistant focused on aviation and crew-related questions. Respond concisely and clearly.",
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
      
      console.log('Run status:', runStatus.status);
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    // Get the assistant's response
    console.log('Retrieving assistant response');
    const messages_response = await openai.beta.threads.messages.list(thread.id);
    const assistant_message = messages_response.data[0];
    
    console.log('Assistant response:', assistant_message);

    return new Response(
      JSON.stringify({
        threadId: thread.id,
        message: {
          role: 'assistant',
          content: assistant_message.content[0].text.value,
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