import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { twitterClient } from '@/lib/twitter';
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

    const tweets = await twitterClient.searchTweets(campaign.keywords);
    let saved = 0;
    for (const tweet of tweets.slice(0, 20)) {
      try {
        const intent = await scoreIntent('', tweet.text, campaign.keywords);
        if (intent.score < 30) continue;
        await supabase.from('leads').upsert({
          user_id: userId, campaign_id: campaign.id, platform: 'twitter',
          post_id: tweet.id, post_url: `https://twitter.com/i/web/status/${tweet.id}`,
          post_body: tweet.text, author_username: tweet.author_id,
          intent_score: intent.score, intent_level: intent.intent_level,
          matched_keywords: intent.matched_signals ?? [], ai_summary: intent.reasoning,
          is_competitor: intent.is_competitor_mention ?? false,
          competitor_name: intent.competitor_name ?? null,
          posted_at: tweet.created_at,
        }, { onConflict: 'user_id,platform,post_id', ignoreDuplicates: true });
        saved++;
      } catch (e) { console.error('Failed to process tweet:', e); }
    }
    return NextResponse.json({ success: true, saved });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
