import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { generatePayUCheckout } from '@/lib/payu';

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createSupabaseServerClient();
  const { data: user } = await supabase
    .from('users').select('id, email, full_name').eq('clerk_id', userId).single();
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const { plan } = await req.json();
  const prices: Record<string, number> = { starter: 14, growth: 22, pro: 30 };
  const amount = prices[plan];
  if (!amount) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });

  const txnid = `LP-${Date.now()}-${user.id.slice(0, 8)}`;

  // Store pending subscription
  await supabase.from('subscriptions').insert({
    user_id: user.id,
    payu_txn_id: txnid,
    plan,
    amount,
    currency: 'USD',
    status: 'pending',
  });

  const checkoutData = generatePayUCheckout({
    txnid,
    amount: amount.toFixed(2),
    productinfo: `LeadPulse ${plan} plan`,
    firstname: user.full_name?.split(' ')[0] ?? 'User',
    email: user.email,
    phone: '9999999999',
    surl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/payu`,
    furl: `${process.env.NEXT_PUBLIC_APP_URL}/billing?status=failed`,
  });

  return NextResponse.json(checkoutData);
}
