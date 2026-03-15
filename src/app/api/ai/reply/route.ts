import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { generateReply } from '@/lib/openai'

export async function POST(req: NextRequest) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createSupabaseServerClient()
  const { data: user } = await supabase.from('users').select('id').eq('clerk_id', userId).single()
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { lead_id, product_description } = await req.json()

  const { data: lead } = await supabase
    .from('leads')
    .select('*')
    .eq('id', lead_id)
    .eq('user_id', user.id)
    .single()

  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })

  const desc = product_description ?? 'A modern SaaS product that helps businesses grow'
  const reply = await generateReply(lead.post_body, desc)

  // Save reply back to lead
  await supabase.from('leads').update({ ai_reply: reply }).eq('id', lead_id)

  return NextResponse.json({ reply })
}
