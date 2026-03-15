import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { LEAD_COST_INR } from '@/lib/wallet';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { leadId } = await req.json();
    if (!leadId) return NextResponse.json({ error: 'leadId required' }, { status: 400 });

    const supabase = createSupabaseServerClient();

    // Check if already unlocked
    const { data: lead } = await supabase
      .from('leads')
      .select('id, is_unlocked, user_id, reddit_username, post_url')
      .eq('id', leadId)
      .eq('user_id', userId)
      .single();

    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    if (lead.is_unlocked) return NextResponse.json({ ok: true, already: true });

    // Check wallet balance
    const { data: wallet } = await supabase
      .from('wallets')
      .select('credits')
      .eq('user_id', userId)
      .single();

    if (!wallet || wallet.credits < 1) {
      return NextResponse.json({ error: 'Insufficient credits. Please top up your wallet.' }, { status: 402 });
    }

    // Deduct 1 credit via RPC
    const { error: rpcErr } = await supabase.rpc('deduct_wallet_credit', {
      p_user_id: userId,
      p_lead_id: leadId,
    });

    if (rpcErr) {
      // Fallback: manual deduct if RPC not set up
      await supabase.from('wallets').update({ credits: wallet.credits - 1 }).eq('user_id', userId);
      await supabase.from('leads').update({ is_unlocked: true }).eq('id', leadId);
    }

    // Log transaction
    await supabase.from('wallet_transactions').insert({
      user_id: userId,
      amount_inr: -LEAD_COST_INR,
      credits_added: -1,
      status: 'lead_unlock',
      payu_txn_id: `UNLOCK_${leadId}_${Date.now()}`,
    });

    return NextResponse.json({ ok: true, creditsRemaining: wallet.credits - 1 });
  } catch (err) {
    console.error('[Unlock Lead]', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
