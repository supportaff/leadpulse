import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from('wallets')
    .select('credits')
    .eq('user_id', userId)
    .single();

  return NextResponse.json({ credits: data?.credits ?? 0 });
}
