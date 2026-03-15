import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

interface ClerkUserEvent {
  type: string
  data: {
    id: string
    email_addresses: Array<{ email_address: string; id: string }>
    first_name: string | null
    last_name: string | null
    image_url: string | null
  }
}

export async function POST(req: NextRequest) {
  const event = await req.json() as ClerkUserEvent
  const supabase = createSupabaseServerClient()

  if (event.type === 'user.created' || event.type === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url } = event.data
    const email = email_addresses[0]?.email_address
    const full_name = [first_name, last_name].filter(Boolean).join(' ') || null

    await supabase.from('users').upsert({
      clerk_id: id,
      email,
      full_name,
      avatar_url: image_url,
    }, { onConflict: 'clerk_id' })
  }

  if (event.type === 'user.deleted') {
    await supabase.from('users').delete().eq('clerk_id', event.data.id)
  }

  return NextResponse.json({ received: true })
}
