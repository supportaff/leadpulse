import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

export function createSupabaseServerClient() {
  return createClient(
    env.supabase.url,
    env.supabase.serviceRoleKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
