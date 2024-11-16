import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function createCheckoutSession(amount: number, currency: string) {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency,
          unit_amount: amount,
          product_data: {
            name: 'Token Purchase',
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment?success=false`,
  })

  return session
}

export { stripe }
