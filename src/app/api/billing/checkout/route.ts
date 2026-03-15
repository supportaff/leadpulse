import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getPlan } from '@/lib/plans';

export async function POST(req: NextRequest) {
  try {
    const { plan: planKey } = await req.json();
    const plan = getPlan(planKey);
    if (!plan) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });

    // If plan has a direct PayU subscription link, just return it
    if (plan.payuLink) {
      return NextResponse.json({ payuLink: plan.payuLink });
    }

    const key = process.env.PAYU_MERCHANT_KEY;
    const salt = process.env.PAYU_MERCHANT_SALT;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (!key || !salt) {
      console.warn('PayU keys not configured');
      return NextResponse.json({ error: 'Payment not configured' }, { status: 503 });
    }

    const txnid = `LP-${planKey.toUpperCase()}-${Date.now()}`;
    const amountStr = plan.price.toFixed(2);
    const firstname = 'User';
    const email = 'user@leadpulse.in';
    const phone = '9999999999';
    const surl = `${appUrl}/api/webhooks/payu`;
    const furl = `${appUrl}/billing?status=failed`;

    const hashString = `${key}|${txnid}|${amountStr}|${plan.productinfo}|${firstname}|${email}|||||||||||${salt}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    return NextResponse.json({
      action: 'https://test.payu.in/_payment',
      fields: { key, txnid, amount: amountStr, productinfo: plan.productinfo, firstname, email, phone, surl, furl, hash, service_provider: 'payu_paisa' },
    });
  } catch (err) {
    console.error('Checkout route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
