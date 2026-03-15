import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getDummyUserId } from '@/lib/auth';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = getDummyUserId();
  const { id } = await params;
  const supabase = createSupabaseServerClient();
  const { data: user } = await supabase.from('users').select('id').eq('id', userId).single();
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const body = await req.json();
  const { data: campaign } = await supabase
    .from('campaigns').update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', id).eq('user_id', user.id).select().single();

  return NextResponse.json({ campaign });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = getDummyUserId();
  const { id } = await params;
  const supabase = createSupabaseServerClient();
  const { data: user } = await supabase.from('users').select('id').eq('id', userId).single();
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  await supabase.from('campaigns').delete().eq('id', id).eq('user_id', user.id);
  return NextResponse.json({ success: true });
}
