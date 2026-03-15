import { NextRequest, NextResponse } from 'next/server';
import { verifyPayUHash } from '@/lib/payu';
import { LEAD_COST_INR } from '@/lib/wallet';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const params: Record<string, string> = {};
    formData.forEach((value, key) => { params[key] = value.toString(); });

    console.log('[PayU Webhook] received:', { txnid: params.txnid, status: params.status, amount: params.amount });

    const isValid = verifyPayUHash(params);
    if (!isValid) {
      console.error('[PayU Webhook] hash verification FAILED');
      // Still redirect user gracefully
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      return NextResponse.redirect(`${appUrl}/billing?status=failed`);
    }

    const { txnid, status, mihpayid, amount } = params;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (status === 'success') {
      const supabase = createSupabaseServerClient();
      const creditsToAdd = Math.floor(Number(amount) / LEAD_COST_INR);

      // Log the transaction
      await supabase.from('wallet_transactions').insert({
        payu_txn_id: txnid,
        payu_payment_id: mihpayid,
        amount_inr: Number(amount),
        credits_added: creditsToAdd,
        status: 'success',
      });

      // Add credits to user wallet using txnid to find user
      // txnid format: WL{timestamp} — look up pending topup
      const { data: pending } = await supabase
        .from('wallet_topups')
        .select('user_id')
        .eq('txnid', txnid)
        .single();

      if (pending?.user_id) {
        await supabase.rpc('add_wallet_credits', {
          p_user_id: pending.user_id,
          p_credits: creditsToAdd,
        });
        await supabase
          .from('wallet_topups')
          .update({ status: 'paid', payu_payment_id: mihpayid })
          .eq('txnid', txnid);
      }

      console.log('[PayU Webhook] credited', creditsToAdd, 'leads to wallet');
      return NextResponse.redirect(`${appUrl}/billing?status=success&credits=${creditsToAdd}`);
    }

    return NextResponse.redirect(`${appUrl}/billing?status=failed`);
  } catch (err) {
    console.error('[PayU Webhook Error]', err);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${appUrl}/billing?status=failed`);
  }
}
