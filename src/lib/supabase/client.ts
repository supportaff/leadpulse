'use client';
import { createBrowserClient } from '@supabase/ssr';

export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_LP_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_LP_SUPABASE_ANON_KEY!
  );
}
