import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const ASSISTANT_ID = "asst_YdZtVHPSq6TIYKRkKcOqtwzn";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Format instructions for consistent responses
const formatInstructions = `
Please format your responses for maximum readability:

1. Use markdown tables when presenting structured data
2. Use bullet points for lists
3. Use headers (##, ###) to organize sections
4. Add line breaks between sections
5. Bold important information
6. Use code blocks for technical content
7. Keep paragraphs short and focused

Example table format:
| Header 1 | Header 2 |
|----------|----------|
| Data 1   | Data 2   |
`;

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

    // Create thread
    console.log('Creating thread');
    const threadResponse = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      }
    });

    if (!threadResponse.ok) {
      const error = await threadResponse.text();
      console.error('Thread creation failed:', error);
      throw new Error(`Failed to create thread: ${error}`);
    }

    const thread = await threadResponse.json();
    console.log('Thread ID:', thread.id);

    // Get the last message from the messages array
    const lastMessage = messages[messages.length - 1];
    const enhancedMessage = `${formatInstructions}\n\nUser Question: ${lastMessage.content}`;
    console.log('Processing message:', enhancedMessage);

    // Add the message to the thread
    console.log('Adding message to thread');
    const messageResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        role: 'user',
        content: enhancedMessage
      })
    });

    if (!messageResponse.ok) {
      const error = await messageResponse.text();
      console.error('Message creation failed:', error);
      throw new Error(`Failed to create message: ${error}`);
    }

    // Run the assistant
    console.log('Starting assistant run');
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        assistant_id: ASSISTANT_ID
      })
    });

    if (!runResponse.ok) {
      const error = await runResponse.text();
      console.error('Run creation failed:', error);
      throw new Error(`Failed to create run: ${error}`);
    }

    const run = await runResponse.json();
    
    // Wait for the run to complete
    console.log('Waiting for run to complete');
    let runStatus;
    do {
      const statusResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`, {
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      });

      if (!statusResponse.ok) {
        const error = await statusResponse.text();
        console.error('Status check failed:', error);
        throw new Error(`Failed to check run status: ${error}`);
      }

      runStatus = await statusResponse.json();
      console.log('Current run status:', runStatus.status);
      
      if (runStatus.status === 'failed') {
        console.error('Run failed:', runStatus);
        throw new Error('Assistant run failed');
      }
      if (runStatus.status === 'requires_action') {
        console.error('Run requires action:', runStatus);
        throw new Error('Assistant run requires action');
      }
      
      if (runStatus.status !== 'completed') {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } while (runStatus.status !== 'completed');

    // Get the assistant's response
    console.log('Retrieving assistant response');
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'OpenAI-Beta': 'assistants=v2'
      }
    });

    if (!messagesResponse.ok) {
      const error = await messagesResponse.text();
      console.error('Messages retrieval failed:', error);
      throw new Error(`Failed to retrieve messages: ${error}`);
    }
    
    const messagesData = await messagesResponse.json();
    const assistantMessage = messagesData.data[0];
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