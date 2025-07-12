
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-csrf-token, x-requested-with, x-lovable-client, x-lovable-project, x-lovable-user, x-lovable-session',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Credentials': 'true',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      negotiationId, 
      userMessage, 
      negotiationContext,
      strategy = 'balanced'
    } = await req.json();

    if (!userMessage) {
      throw new Error('User message is required');
    }

    // Fetch negotiation history if negotiationId provided
    let negotiationHistory = '';
    if (negotiationId) {
      const { data: messages } = await supabase
        .from('negotiation_messages')
        .select('*')
        .eq('negotiation_id', negotiationId)
        .order('created_at', { ascending: true });

      if (messages) {
        negotiationHistory = messages.map(msg => 
          `${msg.sender_type}: ${msg.message}`
        ).join('\n');
      }
    }

    const systemPrompt = `You are an expert AI negotiation assistant with deep knowledge of business law, contracts, and strategic negotiation tactics. Your role is to help users navigate complex negotiations with professionalism and strategic insight.

    Negotiation Strategy: ${strategy}
    Context: ${negotiationContext || 'General business negotiation'}
    
    Previous conversation:
    ${negotiationHistory}
    
    Provide strategic advice, suggest responses, identify leverage points, and help achieve win-win outcomes. Be professional, ethical, and focused on creating value for all parties.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API request failed');
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Store the conversation in the database if negotiationId provided
    if (negotiationId) {
      await supabase
        .from('negotiation_messages')
        .insert([
          {
            negotiation_id: negotiationId,
            sender_type: 'user',
            message: userMessage,
            message_type: 'text'
          },
          {
            negotiation_id: negotiationId,
            sender_type: 'ai',
            message: aiResponse,
            message_type: 'text'
          }
        ]);
    }

    return new Response(JSON.stringify({ 
      aiResponse,
      strategy,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-negotiation-assistant:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});