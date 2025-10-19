import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId required' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log('🔍 session:', session.id, 'status:', session.payment_status);

    if (session.payment_status !== 'paid' && session.status !== 'complete') {
      return NextResponse.json(
        { error: 'Session not paid/complete' },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, message: 'Payment confirmed!' });
  } catch (err: any) {
    console.error('❌ confirm-success error:', err?.message || err);
    return NextResponse.json(
      { error: err?.message || 'Error confirming session' },
      { status: 400 }
    );
  }
}