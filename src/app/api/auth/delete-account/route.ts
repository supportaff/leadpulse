import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function DELETE() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = createSupabaseServerClient();

    // Delete all user data from Supabase first
    await supabase.from('wallet_transactions').delete().eq('user_id', userId);
    await supabase.from('wallet_topups').delete().eq('user_id', userId);
    await supabase.from('wallets').delete().eq('user_id', userId);
    await supabase.from('leads').delete().eq('user_id', userId);
    await supabase.from('campaigns').delete().eq('user_id', userId);
    await supabase.from('users').delete().eq('id', userId);

    // Delete Clerk account using backend SDK
    const client = await clerkClient();
    await client.users.deleteUser(userId);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[Delete Account]', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
