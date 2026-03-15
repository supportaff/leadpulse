import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { requireUserId } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const supabase = createSupabaseServerClient();

    const { data: wallet } = await supabase
      .from('wallets').select('credits').eq('user_id', userId).single();
    if ((wallet?.credits ?? 0) <= 0) {
      return NextResponse.json({ error: 'Insufficient wallet credits.', credits: 0 }, { status: 402 });
    }

    const { leadId } = await req.json();
    if (!leadId) return NextResponse.json({ error: 'leadId required' }, { status: 400 });

    const { data: lead, error } = await supabase
      .from('leads').select('*').eq('id', leadId).eq('user_id', userId).single();
    if (error || !lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

    const reply = `Hi! I noticed you're looking for ${lead.title}. We built LeadPulse specifically for this — happy to share more details if helpful!`;
    await supabase.from('leads').update({ ai_reply: reply, status: 'replied' }).eq('id', leadId);
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
