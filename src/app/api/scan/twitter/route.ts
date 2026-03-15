import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { twitterClient } from '@/lib/twitter'
import { scoreIntent } from '@/lib/openai'

export async function POST(req: NextRequest) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createSupabaseServerClient()
  const { data: user } = await supabase.from('users').select('id').eq('clerk_id', userId).single()
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { campaign_id } = await req.json()
  const { data: campaign } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', campaign_id)
    .eq('user_id', user.id)
    .single()

  if (!campaign) return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })

  const tweets = await twitterClient.searchTweets(campaign.keywords)
  let saved = 0

  for (const tweet of tweets.slice(0, 20)) {
    try {
      const intent = await scoreIntent('', tweet.text, campaign.keywords)
      if (intent.score < 30) continue

      await supabase.from('leads').upsert({
        user_id: user.id,
        campaign_id: campaign.id,
        platform: 'twitter',
        post_id: tweet.id,
        post_url: `https://twitter.com/i/web/status/${tweet.id}`,
        post_body: tweet.text,
        author_username: tweet.author?.username,
        intent_score: intent.score,
        intent_level: intent.level,
        matched_keywords: intent.matched_signals,
        ai_summary: intent.reason,
        is_competitor: intent.is_competitor_mention,
        competitor_name: intent.competitor_name,
        posted_at: tweet.created_at,
      }, { onConflict: 'user_id,platform,post_id', ignoreDuplicates: true })
      saved++
    } catch (e) {
      console.error('Failed to process tweet:', e)
    }
  }

  return NextResponse.json({ success: true, saved })
}
