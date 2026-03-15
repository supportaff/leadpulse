import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const supabase = createSupabaseServerClient();

    // Verify campaign belongs to this user
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (!campaign) return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });

    // Trigger Reddit scan
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const scanRes = await fetch(`${baseUrl}/api/scan/reddit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        campaignId: campaign.id,
        keywords: campaign.keywords,
        subreddits: campaign.subreddits?.length > 0 ? campaign.subreddits : ['entrepreneur', 'startups', 'SaaS', 'smallbusiness'],
      }),
    });

    const scanData = await scanRes.json();
    return NextResponse.json({
      ok: scanRes.ok,
      message: scanRes.ok
        ? `✅ ${scanData.count ?? 0} new leads found`
        : scanData.error || 'Scan failed',
      count: scanData.count ?? 0,
    }, { status: scanRes.ok ? 200 : 500 });
  } catch (err) {
    console.error('[Campaign Scan]', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
