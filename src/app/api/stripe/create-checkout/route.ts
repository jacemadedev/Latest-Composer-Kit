import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(req: Request) {
  if (!process.env.STRIPE_PRICE_ID) {
    return NextResponse.json(
      { error: 'Stripe price ID is not configured' },
      { status: 500 }
    )
  }

  try {
    // Get authorization header
    const authHeader = headers().get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Extract the token
    const token = authHeader.split(' ')[1]
    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    const origin = headers().get('origin')
    if (!origin) {
      return NextResponse.json(
        { error: 'Origin header is required' },
        { status: 400 }
      )
    }

    // Get user data from request body
    const { email, userId } = await req.json()

    if (!email || !userId) {
      return NextResponse.json(
        { error: 'Email and userId are required' },
        { status: 400 }
      )
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${origin}/?payment=success`,
      cancel_url: `${origin}/?payment=cancelled`,
      metadata: {
        userId,
      },
      customer_email: email,
    })

    if (!checkoutSession.url) {
      throw new Error('Failed to create checkout session URL')
    }

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Error creating checkout session'
      },
      { status: 500 }
    )
  }
}