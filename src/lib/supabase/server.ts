import { createClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'

/**
 * Server-side Supabase client using service role key.
 * Only use in API routes and server components.
 */
export function createSupabaseServerClient() {
  return createClient(
    env.supabase.url,
    env.supabase.serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
