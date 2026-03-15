import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { requireUserId } from '@/lib/auth';

export async function GET() {
  try {
    const userId = await requireUserId();
    const supabase = createSupabaseServerClient();
    const { data } = await supabase
      .from('wallets').select('credits').eq('user_id', userId).single();
    return NextResponse.json({ credits: data?.credits ?? 0 });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
