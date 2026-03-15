import { NextRequest, NextResponse } from 'next/server';
import { scoreIntent } from '@/lib/openai';

export async function POST(req: NextRequest) {
  const { post_body, post_title, keywords } = await req.json();
  if (!post_body) return NextResponse.json({ error: 'post_body required' }, { status: 400 });

  const result = await scoreIntent(post_title ?? '', post_body, keywords ?? []);
  return NextResponse.json(result);
}
