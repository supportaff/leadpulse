import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { generateReply } from '@/lib/openai';

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createSupabaseServerClient();
  const { data: user } = await supabase.from('users').select('id, plan').eq('clerk_id', userId).single();
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const { lead_id, user_product_description } = await req.json();

  const { data: lead } = await supabase
    .from('leads').select('*').eq('id', lead_id).eq('user_id', user.id).single();
  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

  const postContext = [lead.post_title, lead.post_body].filter(Boolean).join('\n');
  const reply = await generateReply(
    postContext,
    user_product_description ?? '',
    'LeadPulse'
  );

  // Save reply back to lead
  await supabase.from('leads').update({ ai_reply: reply }).eq('id', lead_id);

  // Track usage
  const month = new Date().toISOString().slice(0, 7);
  await supabase.rpc('increment_usage', { p_user_id: user.id, p_month: month, p_field: 'replies_generated' });

  return NextResponse.json({ reply });
}
