import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getDummyUserId } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const userId = getDummyUserId();
  const supabase = createSupabaseServerClient();

  // In wallet model — check user has wallet credits before generating reply
  const { data: wallet } = await supabase
    .from('wallets')
    .select('credits')
    .eq('user_id', userId)
    .single();

  const credits = wallet?.credits ?? 0;
  if (credits <= 0) {
    return NextResponse.json(
      { error: 'Insufficient wallet credits. Top up to generate AI replies.', credits },
      { status: 402 }
    );
  }

  const { leadId } = await req.json();
  if (!leadId) return NextResponse.json({ error: 'leadId required' }, { status: 400 });

  const { data: lead, error } = await supabase
    .from('leads').select('*').eq('id', leadId).eq('user_id', userId).single();
  if (error || !lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

  // TODO: call Gemini/OpenAI to generate real reply
  const reply = `Hi! I noticed you're looking for ${lead.title}. We built LeadPulse specifically for this — happy to share more details if helpful!`;

  await supabase.from('leads').update({ ai_reply: reply, status: 'replied' }).eq('id', leadId);
  return NextResponse.json({ reply });
}
