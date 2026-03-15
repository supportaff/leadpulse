import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redditClient } from '@/lib/reddit'
import { twitterClient } from '@/lib/twitter'
import { scoreIntent } from '@/lib/openai'
import { sendHighIntentAlert } from '@/lib/resend'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${env.security.cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createSupabaseServerClient()
  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('*, users(id, email, full_name, plan)')
    .eq('is_active', true)

  if (!campaigns?.length) return NextResponse.json({ message: 'No active campaigns', scanned: 0 })

  let totalLeads = 0

  for (const campaign of campaigns) {
    const user = campaign.users as { id: string; email: string; full_name: string; plan: string }
    let highIntentCount = 0

    try {
      // Reddit scan
      if (campaign.platforms.includes('reddit')) {
        const posts = await redditClient.searchPosts(campaign.keywords, campaign.subreddits)
        for (const post of posts.slice(0, 25)) {
          try {
            const intent = await scoreIntent(post.title, post.selftext, campaign.keywords)
            if (intent.score < 30) continue
            const { error } = await supabase.from('leads').upsert({
              user_id: user.id, campaign_id: campaign.id, platform: 'reddit',
              post_id: post.id, post_url: `https://reddit.com${post.permalink}`,
              post_title: post.title, post_body: post.selftext || post.title,
              author_username: post.author, subreddit: post.subreddit,
              intent_score: intent.score, intent_level: intent.level,
              matched_keywords: intent.matched_signals, ai_summary: intent.reason,
              is_competitor: intent.is_competitor_mention, competitor_name: intent.competitor_name,
              posted_at: new Date(post.created_utc * 1000).toISOString(),
            }, { onConflict: 'user_id,platform,post_id', ignoreDuplicates: true })
            if (!error) { totalLeads++; if (intent.level === 'high') highIntentCount++ }
          } catch { /* skip individual post errors */ }
        }
      }

      // Twitter scan
      if (campaign.platforms.includes('twitter')) {
        const tweets = await twitterClient.searchTweets(campaign.keywords)
        for (const tweet of tweets.slice(0, 25)) {
          try {
            const intent = await scoreIntent('', tweet.text, campaign.keywords)
            if (intent.score < 30) continue
            const { error } = await supabase.from('leads').upsert({
              user_id: user.id, campaign_id: campaign.id, platform: 'twitter',
              post_id: tweet.id, post_url: `https://twitter.com/i/web/status/${tweet.id}`,
              post_body: tweet.text, author_username: tweet.author?.username,
              intent_score: intent.score, intent_level: intent.level,
              matched_keywords: intent.matched_signals, ai_summary: intent.reason,
              is_competitor: intent.is_competitor_mention, competitor_name: intent.competitor_name,
              posted_at: tweet.created_at,
            }, { onConflict: 'user_id,platform,post_id', ignoreDuplicates: true })
            if (!error) { totalLeads++; if (intent.level === 'high') highIntentCount++ }
          } catch { /* skip */ }
        }
      }

      // Send email alert for high-intent leads
      if (highIntentCount > 0 && user.email) {
        await sendHighIntentAlert({
          to: user.email,
          userName: user.full_name || 'there',
          leadCount: highIntentCount,
          campaignName: campaign.name,
        })
      }
    } catch (e) {
      console.error(`Campaign scan error ${campaign.id}:`, e)
    }
  }

  return NextResponse.json({ success: true, leads_stored: totalLeads })
}
