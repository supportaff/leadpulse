import { NextRequest, NextResponse } from 'next/server';
import { generatePayUCheckout, PAYU_MODE, PAYU_BASE_URL } from '@/lib/payu';
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

    // Build absolute surl/furl using request origin as fallback
    const origin = process.env.NEXT_PUBLIC_APP_URL
      || `${req.nextUrl.protocol}//${req.nextUrl.host}`;

    const txnid = `LP${Date.now()}`; // keep short, no special chars

    const params = {
      txnid,
      amount: plan.price.toFixed(2),
      productinfo: plan.productinfo,
      firstname: 'LeadPulse',
      email: 'test@leadpulse.in',
      phone: '9999999999',
      surl: `${origin}/api/webhooks/payu`,
      furl: `${origin}/billing?status=failed`,
    };

    const checkoutData = generatePayUCheckout(params);

    // Debug log — visible in Vercel runtime logs
    console.log('[PayU Checkout]', {
      mode: PAYU_MODE,
      action: PAYU_BASE_URL,
      txnid,
      amount: params.amount,
      surl: params.surl,
      furl: params.furl,
      key: checkoutData.fields.key,
      hash: checkoutData.fields.hash?.slice(0, 12) + '...', // partial for safety
    });

    return NextResponse.json(checkoutData);
  } catch (err) {
    console.error('[PayU Checkout Error]', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
