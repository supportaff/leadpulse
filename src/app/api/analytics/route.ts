import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createSupabaseServerClient();
  const { data: user } = await supabase.from('users').select('id').eq('clerk_id', userId).single();
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const { data: leads } = await supabase
    .from('leads')
    .select('intent_level, platform, status, is_competitor, matched_keywords, detected_at')
    .eq('user_id', user.id);

  const all = leads ?? [];

  const keywordCounts: Record<string, number> = {};
  for (const lead of all) {
    for (const kw of (lead.matched_keywords ?? [])) {
      keywordCounts[kw] = (keywordCounts[kw] ?? 0) + 1;
    }
  }
  const topKeywords = Object.entries(keywordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([keyword, count]) => ({ keyword, count }));

  return NextResponse.json({
    totalLeads: all.length,
    highIntent: all.filter(l => l.intent_level === 'high').length,
    mediumIntent: all.filter(l => l.intent_level === 'medium').length,
    lowIntent: all.filter(l => l.intent_level === 'low').length,
    replied: all.filter(l => l.status === 'replied').length,
    redditLeads: all.filter(l => l.platform === 'reddit').length,
    twitterLeads: all.filter(l => l.platform === 'twitter').length,
    competitorMentions: all.filter(l => l.is_competitor).length,
    topKeywords,
  });
}
