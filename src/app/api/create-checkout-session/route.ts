import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { priceId, userId } = body;

    if (!priceId) {
      return NextResponse.json(
        { error: 'priceId required' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.headers.get('origin') || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cancel`,
      client_reference_id: userId || undefined,
    });

    console.log('✅ Created session:', session.id);
    return NextResponse.json({ sessionId: session.id });
  } catch (err: any) {
    console.error('❌ Stripe error:', err?.message || err);
    return NextResponse.json(
      { error: err?.message || 'Stripe error' },
      { status: 400 }
    );
  }
}