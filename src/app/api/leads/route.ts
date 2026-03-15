import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getDummyUserId } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const userId = getDummyUserId();
  const supabase = createSupabaseServerClient();
  const { data: user } = await supabase.from('users').select('id').eq('id', userId).single();
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const sp = req.nextUrl.searchParams;
  const page = parseInt(sp.get('page') ?? '1');
  const limit = Math.min(parseInt(sp.get('limit') ?? '20'), 100);
  const offset = (page - 1) * limit;

  let query = supabase
    .from('leads').select('*', { count: 'exact' })
    .eq('user_id', user.id).order('detected_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (sp.get('intent'))      query = query.eq('intent_level', sp.get('intent'));
  if (sp.get('platform'))    query = query.eq('platform', sp.get('platform'));
  if (sp.get('status'))      query = query.eq('status', sp.get('status'));
  if (sp.get('campaign_id')) query = query.eq('campaign_id', sp.get('campaign_id'));

  const { data: leads, count } = await query;
  return NextResponse.json({ leads: leads ?? [], total: count ?? 0 });
}
