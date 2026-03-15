import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getDummyUserId } from '@/lib/auth';
import { getPlanLimits } from '@/lib/plans';

export async function POST(req: NextRequest) {
  const userId = getDummyUserId();
  const supabase = createSupabaseServerClient();

  // ── Enforce AI reply limit based on user plan ────────────────────────
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('plan')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  const plan = sub?.plan ?? 'starter';
  const limits = getPlanLimits(plan);

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count: repliesThisMonth } = await supabase
    .from('leads')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .not('ai_reply', 'is', null)
    .gte('updated_at', startOfMonth.toISOString());

  if ((repliesThisMonth ?? 0) >= limits.aiRepliesPerMonth) {
    return NextResponse.json(
      { error: 'AI reply limit reached', limit: limits.aiRepliesPerMonth, plan },
      { status: 429 }
    );
  }

  const { leadId } = await req.json();
  if (!leadId) return NextResponse.json({ error: 'leadId required' }, { status: 400 });

  // Fetch lead
  const { data: lead, error } = await supabase
    .from('leads').select('*').eq('id', leadId).eq('user_id', userId).single();
  if (error || !lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

  // TODO: call Gemini/OpenAI to generate real reply
  const reply = `Hi! I noticed you're looking for ${lead.title}. We built LeadPulse specifically for this — happy to share more details if helpful!`;

  await supabase.from('leads').update({ ai_reply: reply, status: 'replied' }).eq('id', leadId);
  return NextResponse.json({ reply });
}
