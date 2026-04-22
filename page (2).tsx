import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { getAppUrl, requiredEnv } from '@/lib/env';

export async function POST() {
  try {
    const stripe = getStripe();
    const appUrl = getAppUrl();
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: requiredEnv('STRIPE_PRICE_ID'),
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/tool`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Checkout could not be created. Check your Stripe env vars.' },
      { status: 500 },
    );
  }
}
