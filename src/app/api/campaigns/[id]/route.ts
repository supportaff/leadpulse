import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { requireUserId } from '@/lib/auth';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    const supabase = createSupabaseServerClient();
    const body = await req.json();
    const { data: campaign } = await supabase
      .from('campaigns')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', id).eq('user_id', userId).select().single();
    return NextResponse.json({ campaign });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    const supabase = createSupabaseServerClient();
    await supabase.from('campaigns').delete().eq('id', id).eq('user_id', userId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
