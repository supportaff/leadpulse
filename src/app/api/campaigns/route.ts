import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getDummyUserId } from '@/lib/auth';
import { getPlanLimits } from '@/lib/plans';

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

  // ── Enforce campaign limit based on user plan ──────────────────────────
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('plan')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  const plan = sub?.plan ?? 'starter';
  const limits = getPlanLimits(plan);

  const { count: campaignCount } = await supabase
    .from('campaigns')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);

  if ((campaignCount ?? 0) >= limits.campaigns) {
    return NextResponse.json(
      { error: 'Campaign limit reached', limit: limits.campaigns, plan },
      { status: 429 }
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
