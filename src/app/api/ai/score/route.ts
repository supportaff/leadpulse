import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { scoreIntent } from '@/lib/openai'

export async function POST(req: NextRequest) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { post_title, post_body, keywords } = await req.json()
  const result = await scoreIntent(post_title ?? '', post_body, keywords ?? [])
  return NextResponse.json(result)
}
