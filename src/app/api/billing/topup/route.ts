import { NextRequest, NextResponse } from 'next/server';
import { generatePayUCheckout, PAYU_MODE } from '@/lib/payu';
import { getTopupPack } from '@/lib/wallet';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { auth, currentUser } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  try {
    // Always get user from Clerk session — never trust client-sent userId
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress || 'unknown@leadpulse.in';
    const name  = clerkUser?.fullName || clerkUser?.firstName || 'User';

    const { packId } = await req.json();
    const pack = getTopupPack(packId);
    if (!pack) return NextResponse.json({ error: 'Invalid pack' }, { status: 400 });

    const origin = process.env.NEXT_PUBLIC_APP_URL
      || `${req.nextUrl.protocol}//${req.nextUrl.host}`;

    const txnid = `WL${Date.now()}`;
    const supabase = createSupabaseServerClient();

    // Upsert user row with real email
    await supabase.from('users').upsert(
      { id: userId, email, name },
      { onConflict: 'id' }
    );

    // Save pending topup with email + name for full traceability
    await supabase.from('wallet_topups').insert({
      user_id: userId,
      email,
      name,
      txnid,
      amount_inr: pack.amount,
      credits: pack.leads,
      status: 'pending',
    });

    const checkout = generatePayUCheckout({
      txnid,
      amount: pack.amount.toFixed(2),
      productinfo: `LeadPulse Wallet ${pack.leads} leads`,
      firstname: name,
      email,
      phone: '9999999999',
      surl: `${origin}/api/webhooks/payu`,
      furl: `${origin}/billing?status=failed`,
    });

    console.log('[TopUp] pack:', pack.id, '| mode:', PAYU_MODE, '| txnid:', txnid, '| user:', userId, '| email:', email);
    return NextResponse.json(checkout);
  } catch (err) {
    console.error('[TopUp Error]', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
