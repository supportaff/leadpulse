import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redditClient } from '@/lib/reddit';
import { twitterClient } from '@/lib/twitter';
import { scoreIntent } from '@/lib/openai';
import { sendHighIntentAlert } from '@/lib/resend';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${env.security.cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createSupabaseServerClient();
  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('*, users(id, email, plan)')
    .eq('is_active', true);

  if (!campaigns?.length) {
    return NextResponse.json({ message: 'No active campaigns', scanned: 0 });
  }

  let totalStored = 0;
  const highIntentAlerts: { email: string; leadCount: number }[] = [];

  for (const campaign of campaigns) {
    const user = campaign.users as { id: string; email: string; plan: string };
    let newHighIntent = 0;

    // ── Reddit scan ──
    if (campaign.platforms.includes('reddit')) {
      try {
        const posts = await redditClient.searchPosts(campaign.keywords, campaign.subreddits);
        for (const post of posts) {
          const result = await scoreIntent(post.title, post.selftext ?? '', campaign.keywords);
          if (result.score < 30) continue;

          const { error } = await supabase.from('leads').upsert({
            user_id: user.id,
            campaign_id: campaign.id,
            platform: 'reddit',
            post_id: post.id,
            post_url: `https://reddit.com${post.url}`,
            post_title: post.title,
            post_body: post.selftext ?? '',
            author_username: post.author,
            subreddit: post.subreddit,
            intent_score: result.score,
            intent_level: result.level,
            matched_keywords: result.matched_signals ?? [],
            ai_summary: result.reason,
            is_competitor: result.is_competitor_mention ?? false,
            competitor_name: result.competitor_name ?? null,
            posted_at: new Date(post.created_utc * 1000).toISOString(),
          }, { onConflict: 'user_id,platform,post_id', ignoreDuplicates: true });

          if (!error) {
            totalStored++;
            if (result.level === 'high') newHighIntent++;
          }
        }
      } catch (err) {
        console.error('Reddit scan error:', campaign.id, err);
      }
    }

    // ── Twitter/X scan ──
    if (campaign.platforms.includes('twitter')) {
      try {
        const tweets = await twitterClient.searchTweets(campaign.keywords);
        for (const tweet of tweets) {
          const result = await scoreIntent('', tweet.text, campaign.keywords);
          if (result.score < 30) continue;

          const { error } = await supabase.from('leads').upsert({
            user_id: user.id,
            campaign_id: campaign.id,
            platform: 'twitter',
            post_id: tweet.id,
            post_url: `https://twitter.com/i/web/status/${tweet.id}`,
            post_body: tweet.text,
            author_username: tweet.author_id,
            intent_score: result.score,
            intent_level: result.level,
            matched_keywords: result.matched_signals ?? [],
            ai_summary: result.reason,
            is_competitor: result.is_competitor_mention ?? false,
            competitor_name: result.competitor_name ?? null,
            posted_at: tweet.created_at,
          }, { onConflict: 'user_id,platform,post_id', ignoreDuplicates: true });

          if (!error) {
            totalStored++;
            if (result.level === 'high') newHighIntent++;
          }
        }
      } catch (err) {
        console.error('Twitter scan error:', campaign.id, err);
      }
    }

    if (newHighIntent > 0) {
      highIntentAlerts.push({ email: user.email, leadCount: newHighIntent });
    }
  }

  // Send email alerts
  for (const alert of highIntentAlerts) {
    await sendHighIntentAlert(alert.email, alert.leadCount).catch(console.error);
  }

  return NextResponse.json({ success: true, leads_stored: totalStored });
}
