import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { PLAN_LIMITS } from '@/lib/utils'
import { z } from 'zod'

const CreateCampaignSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  keywords: z.array(z.string()).min(1),
  platforms: z.array(z.enum(['reddit', 'twitter'])).default(['reddit', 'twitter']),
  subreddits: z.array(z.string()).default([]),
})

export async function GET() {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createSupabaseServerClient()
  const { data: user } = await supabase.from('users').select('id').eq('clerk_id', userId).single()
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return NextResponse.json({ campaigns })
}

export async function POST(req: NextRequest) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createSupabaseServerClient()
  const { data: user } = await supabase.from('users').select('id, plan').eq('clerk_id', userId).single()
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  // Check plan limit
  const limits = PLAN_LIMITS[user.plan as keyof typeof PLAN_LIMITS]
  const { count } = await supabase.from('campaigns').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('is_active', true)
  if (limits.keywords !== -1 && (count ?? 0) >= limits.keywords) {
    return NextResponse.json({ error: 'Campaign limit reached for your plan' }, { status: 403 })
  }

  const body = CreateCampaignSchema.parse(await req.json())
  const { data, error } = await supabase
    .from('campaigns')
    .insert({ ...body, user_id: user.id })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ campaign: data }, { status: 201 })
}
