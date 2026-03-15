import { createClient } from '@supabase/supabase-js';

export function createSupabaseServerClient() {
  return createClient(
    process.env.LP_SUPABASE_URL!,
    process.env.LP_SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
