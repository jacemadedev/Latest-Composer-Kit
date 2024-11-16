import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
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
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
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

        // Update user's token balance
        const { error } = await supabase
          .from('user_settings')
          .update({
            tokens: supabase.sql`tokens + 50000`, // Add 50,000 tokens
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)

        if (error) {
          console.error('Error updating token balance:', error)
          return NextResponse.json(
            { error: 'Failed to update token balance' },
            { status: 500 }
          )
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

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}