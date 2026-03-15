import { NextRequest, NextResponse } from 'next/server';
import { generatePayUCheckout, PAYU_MODE } from '@/lib/payu';
import { getTopupPack } from '@/lib/wallet';

export async function POST(req: NextRequest) {
  try {
    const { packId, userId, email, name } = await req.json();

    const pack = getTopupPack(packId);
    if (!pack) return NextResponse.json({ error: 'Invalid pack' }, { status: 400 });

    const origin = process.env.NEXT_PUBLIC_APP_URL
      || `${req.nextUrl.protocol}//${req.nextUrl.host}`;

    // txnid: short, alphanumeric only — PayU requirement
    const txnid = `WL${Date.now()}`;

    const checkout = generatePayUCheckout({
      txnid,
      amount: pack.amount.toFixed(2),
      productinfo: `LeadPulse Wallet Top-up ${pack.leads} leads`,
      firstname: name || 'User',
      email: email || 'user@leadpulse.in',
      phone: '9999999999',
      surl: `${origin}/api/webhooks/payu`,
      furl: `${origin}/billing?status=failed`,
    });

    console.log('[TopUp] pack:', pack.id, '| mode:', PAYU_MODE, '| txnid:', txnid);

    return NextResponse.json(checkout);
  } catch (err) {
    console.error('[TopUp Error]', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
