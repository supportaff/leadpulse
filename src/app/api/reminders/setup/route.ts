import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { phone, type } = await req.json();
    if (!phone) return NextResponse.json({ error: 'Phone required.' }, { status: 400 });

    const supabase = createSupabaseServerClient();
    await supabase.from('reminders').upsert({ user_id: userId, phone: `91${phone}`, type, active: true, created_at: new Date().toISOString() }, { onConflict: 'user_id' });

    // TODO: Send welcome WhatsApp message via WhatsApp Cloud API
    // await sendWhatsApp(`91${phone}`, `🌸 Welcome to MomCare! Your ${type} reminders are now active.`);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
