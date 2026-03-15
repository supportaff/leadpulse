import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getDummyUserId } from '@/lib/auth';

export async function GET() {
  const userId = getDummyUserId();
  const supabase = createSupabaseServerClient();
  const { data: user } = await supabase.from('users').select('id').eq('id', userId).single();
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const { data: campaigns } = await supabase
    .from('campaigns').select('*').eq('user_id', user.id).order('created_at', { ascending: false });

  return NextResponse.json({ campaigns: campaigns ?? [] });
}

export async function POST(req: NextRequest) {
  const userId = getDummyUserId();
  const supabase = createSupabaseServerClient();
  const { data: user } = await supabase.from('users').select('id, plan').eq('id', userId).single();
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const body = await req.json();
  const { name, description, keywords, platforms, subreddits } = body;
  if (!name || !keywords?.length) return NextResponse.json({ error: 'Name and keywords are required' }, { status: 400 });

  const { data: campaign, error } = await supabase.from('campaigns').insert({
    user_id: user.id, name, description: description ?? null,
    keywords, platforms: platforms ?? ['reddit', 'twitter'], subreddits: subreddits ?? [],
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ campaign }, { status: 201 });
}
