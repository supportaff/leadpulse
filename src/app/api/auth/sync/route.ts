import { NextResponse } from 'next/server';
import { syncUserToSupabase } from '@/lib/auth';

// Called on first load after Clerk login to sync user into Supabase
export async function POST() {
  try {
    const user = await syncUserToSupabase();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ ok: true, user });
  } catch (err) {
    console.error('[Auth Sync]', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
