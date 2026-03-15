import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getDummyUserId } from '@/lib/auth';
import { getPlanLimits } from '@/lib/plans';

export async function GET(req: NextRequest) {
  const userId = getDummyUserId();
  const supabase = createSupabaseServerClient();
  const { searchParams } = new URL(req.url);
  const campaignId = searchParams.get('campaign_id');
  const status = searchParams.get('status');
  const intentLevel = searchParams.get('intent_level');

  let query = supabase
    .from('leads')
    .select('*')
    .eq('user_id', userId)
    .order('detected_at', { ascending: false })
    .limit(100);

  if (campaignId) query = query.eq('campaign_id', campaignId);
  if (status)     query = query.eq('status', status);
  if (intentLevel) query = query.eq('intent_level', intentLevel);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ leads: data ?? [] });
}

export async function POST(req: NextRequest) {
  const userId = getDummyUserId();
  const supabase = createSupabaseServerClient();

  // ── Enforce monthly lead limit based on user plan ───────────────────────
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('plan')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  const plan = sub?.plan ?? 'starter';
  const limits = getPlanLimits(plan);

  // Count leads created this calendar month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count: leadsThisMonth } = await supabase
    .from('leads')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('detected_at', startOfMonth.toISOString());

  if ((leadsThisMonth ?? 0) >= limits.leadsPerMonth) {
    return NextResponse.json(
      { error: 'Monthly lead limit reached', limit: limits.leadsPerMonth, plan },
      { status: 429 }
    );
  }

  const body = await req.json();
  const { data, error } = await supabase
    .from('leads')
    .insert({ ...body, user_id: userId })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ lead: data }, { status: 201 });
}
