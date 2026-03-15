import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getDummyUserId } from '@/lib/auth';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = getDummyUserId();
  const { id } = await params;
  const supabase = createSupabaseServerClient();
  const { data: user } = await supabase.from('users').select('id').eq('id', userId).single();
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const { data: lead } = await supabase
    .from('leads').select('*').eq('id', id).eq('user_id', user.id).single();
  if (!lead) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ lead });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = getDummyUserId();
  const { id } = await params;
  const supabase = createSupabaseServerClient();
  const { data: user } = await supabase.from('users').select('id').eq('id', userId).single();
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const body = await req.json();
  const allowed = ['status', 'reply_used'] as const;
  const update: Record<string, unknown> = {};
  for (const key of allowed) if (key in body) update[key] = body[key];
  if (body.status === 'replied') update.reply_used_at = new Date().toISOString();

  const { data: lead } = await supabase
    .from('leads').update(update).eq('id', id).eq('user_id', user.id).select().single();
  return NextResponse.json({ lead });
}
