import { NextRequest, NextResponse } from 'next/server';
import { generatePayUCheckout, PAYU_MODE } from '@/lib/payu';
import { getTopupPack } from '@/lib/wallet';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { packId, userId, email, name } = await req.json();

    const pack = getTopupPack(packId);
    if (!pack) return NextResponse.json({ error: 'Invalid pack' }, { status: 400 });
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    const origin = process.env.NEXT_PUBLIC_APP_URL
      || `${req.nextUrl.protocol}//${req.nextUrl.host}`;

    const txnid = `WL${Date.now()}`;

    // Save pending topup row so webhook can find user_id after payment
    const supabase = createSupabaseServerClient();

    // Upsert user row (in case first time)
    await supabase.from('users').upsert(
      { id: userId, email: email || 'unknown@leadpulse.in', name: name || 'User' },
      { onConflict: 'id' }
    );

    await supabase.from('wallet_topups').insert({
      user_id: userId,
      txnid,
      amount_inr: pack.amount,
      credits: pack.leads,
      status: 'pending',
    });

    const checkout = generatePayUCheckout({
      txnid,
      amount: pack.amount.toFixed(2),
      productinfo: `LeadPulse Wallet ${pack.leads} leads`,
      firstname: name || 'User',
      email: email || 'user@leadpulse.in',
      phone: '9999999999',
      surl: `${origin}/api/webhooks/payu`,
      furl: `${origin}/billing?status=failed`,
    });

    console.log('[TopUp] pack:', pack.id, '| mode:', PAYU_MODE, '| txnid:', txnid, '| user:', userId);
    return NextResponse.json(checkout);
  } catch (err) {
    console.error('[TopUp Error]', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
