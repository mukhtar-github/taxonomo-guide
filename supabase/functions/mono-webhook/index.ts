
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MonoWebhookEvent {
  event: 'mono.events.account_updated' | 'mono.events.reauth_needed'
  data: {
    type: string
    id: string
    code: string
    amount: number
    description?: string
    date: string
    currency: string
    narration?: string
    account: {
      _id: string
    }
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const monoSecretKey = Deno.env.get('MONO_SECRET_KEY')
    if (!monoSecretKey) {
      throw new Error('MONO_SECRET_KEY not configured')
    }

    // Verify Mono webhook signature
    const signature = req.headers.get('mono-webhook-secret')
    if (!signature) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Get the webhook payload
    const body: MonoWebhookEvent = await req.json()
    
    // Handle different webhook events
    switch (body.event) {
      case 'mono.events.account_updated': {
        const { data } = body
        
        // Find the bank account using the Mono account ID
        const { data: bankAccount, error: bankAccountError } = await supabaseClient
          .from('bank_accounts')
          .select('id, webhook_secret')
          .eq('mono_account_id', data.account._id)
          .single()

        if (bankAccountError || !bankAccount) {
          console.error('Bank account not found:', bankAccountError)
          return new Response('Bank account not found', { status: 404 })
        }

        // Verify webhook secret
        if (signature !== bankAccount.webhook_secret) {
          return new Response('Invalid webhook signature', { status: 401 })
        }

        // Insert the new transaction
        const { error: transactionError } = await supabaseClient
          .from('transactions')
          .insert({
            mono_transaction_id: data.id,
            bank_account_id: bankAccount.id,
            amount: data.amount,
            currency: data.currency,
            description: data.narration || data.description,
            transaction_date: data.date,
          })

        if (transactionError) {
          console.error('Error inserting transaction:', transactionError)
          return new Response('Error processing transaction', { status: 500 })
        }

        return new Response('Webhook processed successfully', {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })
      }

      case 'mono.events.reauth_needed': {
        // Handle reauthorization needed event
        // You could update a status in the bank_accounts table
        // or trigger a notification to the user
        return new Response('Reauth event received', {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })
      }

      default: {
        return new Response(`Unhandled webhook event: ${body.event}`, {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        })
      }
    }
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response('Internal Server Error', {
      headers: corsHeaders,
      status: 500,
    })
  }
})
