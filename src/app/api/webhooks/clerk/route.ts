import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { env } from '@/lib/env';

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const headers = {
    'svix-id': req.headers.get('svix-id') ?? '',
    'svix-timestamp': req.headers.get('svix-timestamp') ?? '',
    'svix-signature': req.headers.get('svix-signature') ?? '',
  };

  // Use the Clerk Webhook Secret (not the secret key) — set CLERK_WEBHOOK_SECRET in env
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET ?? '';

  let event: { type: string; data: Record<string, unknown> };
  try {
    const wh = new Webhook(webhookSecret);
    event = wh.verify(payload, headers) as { type: string; data: Record<string, unknown> };
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();

  if (event.type === 'user.created' || event.type === 'user.updated') {
    const d = event.data as {
      id: string;
      email_addresses: { email_address: string }[];
      first_name: string;
      last_name: string;
      image_url: string;
    };
    const email = d.email_addresses?.[0]?.email_address;
    const full_name = [d.first_name, d.last_name].filter(Boolean).join(' ');

    await supabase.from('users').upsert({
      clerk_id: d.id,
      email,
      full_name,
      avatar_url: d.image_url,
    }, { onConflict: 'clerk_id' });
  }

  if (event.type === 'user.deleted') {
    const d = event.data as { id: string };
    await supabase.from('users').delete().eq('clerk_id', d.id);
  }

  return NextResponse.json({ received: true });
}
