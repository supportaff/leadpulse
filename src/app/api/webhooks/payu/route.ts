import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { verifyPayUHash } from '@/lib/payu';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const params: Record<string, string> = {};
  formData.forEach((value, key) => { params[key] = String(value); });

  const { status, txnid, hash } = params;

  if (!verifyPayUHash(params)) {
    return NextResponse.json({ error: 'Invalid hash' }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();

  if (status === 'success') {
    const { data: sub } = await supabase
      .from('subscriptions').select('user_id, plan')
      .eq('payu_txn_id', txnid).single();

    if (sub) {
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);

      await supabase.from('subscriptions').update({
        status: 'success',
        starts_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
      }).eq('payu_txn_id', txnid);

      await supabase.from('users').update({
        plan: sub.plan,
        plan_expires_at: expiresAt.toISOString(),
      }).eq('id', sub.user_id);
    }
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/billing?status=success`);
  }

  await supabase.from('subscriptions').update({ status: 'failed' }).eq('payu_txn_id', txnid);
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/billing?status=failed`);
}
