import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { requireUserId } from '@/lib/auth';

export async function GET() {
  try {
    const userId = await requireUserId();
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ campaigns: data ?? [] });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const supabase = createSupabaseServerClient();

    const { data: wallet } = await supabase
      .from('wallets').select('credits').eq('user_id', userId).single();
    if ((wallet?.credits ?? 0) <= 0) {
      return NextResponse.json({ error: 'Insufficient wallet credits. Top up to create campaigns.' }, { status: 402 });
    }

    const body = await req.json();
    const { data, error } = await supabase
      .from('campaigns')
      .insert({ ...body, user_id: userId })
      .select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ campaign: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
