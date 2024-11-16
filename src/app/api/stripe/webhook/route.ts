import { headers } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = headers().get('Stripe-Signature') as string

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const supabase = createRouteHandlerClient({ cookies })

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Get the user from the metadata
        const userId = session.metadata?.userId
        if (!userId) {
          throw new Error('No user ID in session metadata')
        }

        // First get current tokens
        const { data: currentData, error: fetchError } = await supabase
          .from('user_settings')
          .select('tokens')
          .eq('user_id', userId)
          .single()

        if (fetchError) {
          console.error('Error fetching current tokens:', fetchError)
          return new Response(JSON.stringify({ error: 'Failed to fetch token balance' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        const currentTokens = currentData?.tokens || 0
        const newTokens = currentTokens + 50000

        // Update user's token balance
        const { error: updateError } = await supabase
          .from('user_settings')
          .update({
            tokens: newTokens,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId)

        if (updateError) {
          console.error('Error updating token balance:', updateError)
          return new Response(JSON.stringify({ error: 'Failed to update token balance' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          })
        }
        break
      }

      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object as Stripe.Checkout.Session
        // Handle async payment success (e.g., for SEPA payments)
        console.log('Async payment succeeded for session:', session.id)
        break
      }

      case 'checkout.session.async_payment_failed': {
        const session = event.data.object as Stripe.Checkout.Session
        // Handle failed async payment
        console.error('Async payment failed for session:', session.id)
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        // Handle expired checkout sessions
        console.log('Checkout session expired:', session.id)
        break
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(JSON.stringify({ error: 'Webhook handler failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
