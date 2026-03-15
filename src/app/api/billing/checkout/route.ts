import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { generatePayUCheckout } from '@/lib/payu';
import { getDummyUserId, getDummyUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const userId = getDummyUserId();
  const dummyUser = getDummyUser();
  const supabase = createSupabaseServerClient();

  const { data: user } = await supabase
    .from('users').select('id, email, full_name').eq('id', userId).single();

  const email = user?.email ?? dummyUser.email;
  const full_name = user?.full_name ?? dummyUser.full_name;
  const dbUserId = user?.id ?? userId;

  const { plan } = await req.json();
  const prices: Record<string, number> = { starter: 14, growth: 22, pro: 30 };
  const amount = prices[plan];
  if (!amount) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });

  const txnid = `LP-${Date.now()}-${dbUserId.slice(0, 8)}`;

  await supabase.from('subscriptions').insert({
    user_id: dbUserId, payu_txn_id: txnid, plan, amount, currency: 'USD', status: 'pending',
  });

  const checkoutData = generatePayUCheckout({
    txnid,
    amount: amount.toFixed(2),
    productinfo: `LeadPulse ${plan} plan`,
    firstname: full_name?.split(' ')[0] ?? 'User',
    email,
    phone: '9999999999',
    surl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/payu`,
    furl: `${process.env.NEXT_PUBLIC_APP_URL}/billing?status=failed`,
  });

  return NextResponse.json(checkoutData);
}
