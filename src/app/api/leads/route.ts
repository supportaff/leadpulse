import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { requireUserId } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const supabase = createSupabaseServerClient();
    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get('campaign_id');
    const status = searchParams.get('status');
    const intentLevel = searchParams.get('intent_level');

    let query = supabase
      .from('leads').select('*').eq('user_id', userId)
      .order('detected_at', { ascending: false }).limit(100);

    if (campaignId) query = query.eq('campaign_id', campaignId);
    if (status)     query = query.eq('status', status);
    if (intentLevel) query = query.eq('intent_level', intentLevel);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ leads: data ?? [] });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const supabase = createSupabaseServerClient();
    const body = await req.json();
    const { data, error } = await supabase
      .from('leads').insert({ ...body, user_id: userId }).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ lead: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
