import { NextRequest, NextResponse } from 'next/server';
import { verifyPayUHash } from '@/lib/payu';
import { LEAD_COST_INR } from '@/lib/wallet';
import { createSupabaseServerClient } from '@/lib/supabase/server';

function htmlRedirect(url: string) {
  // PayU POSTs to surl — browser follows this page, so we return HTML that auto-redirects
  return new NextResponse(
    `<!DOCTYPE html><html><head>
    <meta http-equiv="refresh" content="0;url=${url}" />
    </head><body><script>window.location.href="${url}";</script></body></html>`,
    { status: 200, headers: { 'Content-Type': 'text/html' } }
  );
}

export async function POST(req: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://leadpulse-beta.vercel.app';

  try {
    const formData = await req.formData();
    const params: Record<string, string> = {};
    formData.forEach((value, key) => { params[key] = value.toString(); });

    console.log('[PayU Webhook]', { txnid: params.txnid, status: params.status, amount: params.amount });

    const isValid = verifyPayUHash(params);
    if (!isValid) {
      console.error('[PayU Webhook] hash FAILED');
      return htmlRedirect(`${appUrl}/billing?status=failed`);
    }

    const { txnid, status, mihpayid, amount } = params;

    if (status === 'success') {
      const supabase = createSupabaseServerClient();
      const creditsToAdd = Math.floor(Number(amount) / LEAD_COST_INR);

      // Find pending topup to get user_id
      const { data: pending, error: pendingErr } = await supabase
        .from('wallet_topups')
        .select('user_id, credits')
        .eq('txnid', txnid)
        .single();

      console.log('[PayU Webhook] pending topup:', pending, pendingErr);

      if (pending?.user_id) {
        // Use credits from topup row (more accurate than amount / 10)
        const credits = pending.credits ?? creditsToAdd;

        // Add to wallet
        const { error: rpcErr } = await supabase.rpc('add_wallet_credits', {
          p_user_id: pending.user_id,
          p_credits: credits,
        });
        console.log('[PayU Webhook] rpc error:', rpcErr);

        // Mark topup as paid
        await supabase
          .from('wallet_topups')
          .update({ status: 'paid', payu_payment_id: mihpayid })
          .eq('txnid', txnid);

        // Log transaction with user_id
        await supabase.from('wallet_transactions').insert({
          user_id: pending.user_id,
          payu_txn_id: txnid,
          payu_payment_id: mihpayid,
          amount_inr: Number(amount),
          credits_added: credits,
          status: 'success',
        });

        console.log('[PayU Webhook] ✅ credited', credits, 'leads to', pending.user_id);
        return htmlRedirect(`${appUrl}/billing?status=success&credits=${credits}`);
      } else {
        console.error('[PayU Webhook] pending topup not found for txnid:', txnid);
        return htmlRedirect(`${appUrl}/billing?status=success`);
      }
    }

    return htmlRedirect(`${appUrl}/billing?status=failed`);
  } catch (err) {
    console.error('[PayU Webhook Error]', err);
    return htmlRedirect(`${appUrl}/billing?status=failed`);
  }
}
