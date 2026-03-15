import { NextRequest, NextResponse } from 'next/server';
import { generatePayUCheckout, PAYU_MODE } from '@/lib/payu';
import { getPlan } from '@/lib/plans';

export async function POST(req: NextRequest) {
  try {
    const { plan: planKey } = await req.json();
    const plan = getPlan(planKey);
    if (!plan) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });

    // If plan has a direct PayU subscription link, return it directly
    if (plan.payuLink) {
      return NextResponse.json({ payuLink: plan.payuLink, mode: PAYU_MODE });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const txnid = `LP-${planKey.toUpperCase()}-${Date.now()}`;

    const checkoutData = generatePayUCheckout({
      txnid,
      amount: plan.price.toFixed(2),
      productinfo: plan.productinfo,
      firstname: 'User',
      email: 'user@leadpulse.in',
      phone: '9999999999',
      surl: `${appUrl}/api/webhooks/payu`,
      furl: `${appUrl}/billing?status=failed`,
    });

    return NextResponse.json(checkoutData);
  } catch (err) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
