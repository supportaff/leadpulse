import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET() {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createSupabaseServerClient()
  const { data: user } = await supabase.from('users').select('id').eq('clerk_id', userId).single()
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const uid = user.id

  const [totalRes, highRes, repliedRes, redditRes, twitterRes, campaignsRes] = await Promise.all([
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('user_id', uid),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('user_id', uid).eq('intent_level', 'high'),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('user_id', uid).eq('reply_used', true),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('user_id', uid).eq('platform', 'reddit'),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('user_id', uid).eq('platform', 'twitter'),
    supabase.from('campaigns').select('*', { count: 'exact', head: true }).eq('user_id', uid).eq('is_active', true),
  ])

  return NextResponse.json({
    total: totalRes.count ?? 0,
    high: highRes.count ?? 0,
    replied: repliedRes.count ?? 0,
    reddit: redditRes.count ?? 0,
    twitter: twitterRes.count ?? 0,
    campaigns: campaignsRes.count ?? 0,
  })
}
