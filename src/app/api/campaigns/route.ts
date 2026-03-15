import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getDummyUserId } from '@/lib/auth';

export async function GET() {
  const userId = getDummyUserId();
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ campaigns: data ?? [] });
}

export async function POST(req: NextRequest) {
  const userId = getDummyUserId();
  const supabase = createSupabaseServerClient();

  // Wallet model — no campaign limits, just check wallet has credits
  const { data: wallet } = await supabase
    .from('wallets')
    .select('credits')
    .eq('user_id', userId)
    .single();

  if ((wallet?.credits ?? 0) <= 0) {
    return NextResponse.json(
      { error: 'Insufficient wallet credits. Top up to create campaigns.', credits: 0 },
      { status: 402 }
    );
  }

  const body = await req.json();
  const { data, error } = await supabase
    .from('campaigns')
    .insert({ ...body, user_id: userId })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ campaign: data }, { status: 201 });
}
