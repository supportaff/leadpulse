import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createSupabaseServerClient()
  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_id', userId)
    .single()

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { searchParams } = new URL(req.url)
  const intent = searchParams.get('intent')
  const platform = searchParams.get('platform')
  const limit = parseInt(searchParams.get('limit') ?? '20')

  let query = supabase
    .from('leads')
    .select('*')
    .eq('user_id', user.id)
    .order('detected_at', { ascending: false })
    .limit(limit)

  if (intent) query = query.eq('intent_level', intent)
  if (platform) query = query.eq('platform', platform)

  const { data: leads, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ leads })
}
