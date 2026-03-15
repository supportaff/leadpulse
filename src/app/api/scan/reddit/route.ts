import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redditClient } from '@/lib/reddit';
import { scoreIntent } from '@/lib/openai';
import { requireUserId } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const supabase = createSupabaseServerClient();
    const { campaign_id } = await req.json();
    const { data: campaign } = await supabase
      .from('campaigns').select('*').eq('id', campaign_id).eq('user_id', userId).single();
    if (!campaign) return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });

    const posts = await redditClient.searchPosts(campaign.keywords, campaign.subreddits);
    let saved = 0;
    for (const post of posts.slice(0, 20)) {
      try {
        const intent = await scoreIntent(post.title, post.selftext ?? '', campaign.keywords);
        if (intent.score < 30) continue;
        await supabase.from('leads').upsert({
          user_id: userId, campaign_id: campaign.id, platform: 'reddit',
          post_id: post.id, post_url: `https://reddit.com${post.permalink}`,
          post_title: post.title, post_body: post.selftext || post.title,
          author_username: post.author, subreddit: post.subreddit,
          intent_score: intent.score, intent_level: intent.intent_level,
          matched_keywords: intent.matched_signals ?? [], ai_summary: intent.reasoning,
          is_competitor: intent.is_competitor_mention ?? false,
          competitor_name: intent.competitor_name ?? null,
          posted_at: new Date(post.created_utc * 1000).toISOString(),
        }, { onConflict: 'user_id,platform,post_id', ignoreDuplicates: true });
        saved++;
      } catch (e) { console.error('Failed to process post:', e); }
    }
    return NextResponse.json({ success: true, saved });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
