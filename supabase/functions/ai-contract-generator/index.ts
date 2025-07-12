import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      contractType,
      parties,
      terms,
      jurisdiction = 'United States',
      customRequirements
    } = await req.json();

    if (!contractType || !parties) {
      throw new Error('Contract type and parties are required');
    }

    const systemPrompt = `You are an expert legal AI specializing in contract drafting. Generate professional, legally sound contracts based on the provided parameters. Include all necessary legal language, clauses, and protections appropriate for the jurisdiction and contract type.

    Important: Generate contracts that are professionally formatted, comprehensive, and include standard legal protections. Always include appropriate disclaimers about legal review.`;

    const userPrompt = `Generate a ${contractType} contract with the following details:

    Parties: ${JSON.stringify(parties)}
    Terms: ${JSON.stringify(terms)}
    Jurisdiction: ${jurisdiction}
    ${customRequirements ? `Additional Requirements: ${customRequirements}` : ''}

    Please create a comprehensive, professional contract document.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API request failed');
    }

    const data = await response.json();
    const generatedContract = data.choices[0].message.content;

    return new Response(JSON.stringify({ 
      contract: generatedContract,
      contractType,
      jurisdiction,
      timestamp: new Date().toISOString(),
      disclaimer: "This contract is AI-generated and should be reviewed by a qualified attorney before use."
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-contract-generator:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});