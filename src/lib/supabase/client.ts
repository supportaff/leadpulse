'use client';
import { createBrowserClient } from '@supabase/ssr';

export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.LP_SUPABASE_URL!,
    process.env.LP_SUPABASE_ANON_KEY!
  );
}
