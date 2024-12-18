import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import OpenAI from "https://deno.land/x/openai@v4.24.0/mod.ts"

const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const openai = new OpenAI({
  apiKey: openAIApiKey,
})

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { messages, threadId } = await req.json()
    console.log('Received request:', { threadId, messageCount: messages.length })

    let thread
    if (!threadId) {
      thread = await openai.beta.threads.create()
      console.log('Created new thread:', thread.id)
    } else {
      thread = { id: threadId }
      console.log('Using existing thread:', thread.id)
    }

    // Add the user's message to the thread
    const lastMessage = messages[messages.length - 1]
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: lastMessage.content,
    })

    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: "asst_abc123", // Replace with your assistant ID
      instructions: "You are a helpful AI assistant. Respond concisely and clearly.",
    })

    // Wait for the run to complete
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id)
    while (runStatus.status !== 'completed') {
      if (runStatus.status === 'failed') {
        throw new Error('Run failed')
      }
      await new Promise(resolve => setTimeout(resolve, 1000))
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id)
    }

    // Get the assistant's response
    const messages_response = await openai.beta.threads.messages.list(thread.id)
    const assistant_message = messages_response.data[0]

    console.log('Assistant response:', assistant_message)

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
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})