import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createSupabaseServerClient();
  const { data: user } = await supabase.from('users').select('id').eq('clerk_id', userId).single();
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const body = await req.json();
  const { data: campaign } = await supabase
    .from('campaigns').update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', params.id).eq('user_id', user.id)
    .select().single();

  return NextResponse.json({ campaign });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createSupabaseServerClient();
  const { data: user } = await supabase.from('users').select('id').eq('clerk_id', userId).single();
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  await supabase.from('campaigns').delete().eq('id', params.id).eq('user_id', user.id);
  return NextResponse.json({ success: true });
}
