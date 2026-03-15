import { NextRequest, NextResponse } from 'next/server';
import { verifyPayUHash } from '@/lib/payu';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const params: Record<string, string> = {};
  formData.forEach((value, key) => { params[key] = value.toString(); });

  const isValid = verifyPayUHash(params);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid hash' }, { status: 400 });
  }

  const { txnid, status, mihpayid } = params;
  const supabase = createSupabaseServerClient();

  if (status === 'success') {
    const { data: sub } = await supabase
      .from('subscriptions')
      .update({ status: 'active', payu_payment_id: mihpayid })
      .eq('payu_txn_id', txnid)
      .select('user_id, plan')
      .single();

    if (sub) {
      await supabase
        .from('users')
        .update({ plan: sub.plan, plan_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() })
        .eq('id', sub.user_id);
    }
  } else {
    await supabase
      .from('subscriptions')
      .update({ status: 'failed' })
      .eq('payu_txn_id', txnid);
  }

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/billing?status=${status}`);
}
