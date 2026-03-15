import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { verifyPayUHash } from '@/lib/payu'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const params: Record<string, string> = {}
  formData.forEach((value, key) => { params[key] = value.toString() })

  // Verify hash
  if (!verifyPayUHash(params)) {
    return NextResponse.json({ error: 'Invalid hash' }, { status: 400 })
  }

  const supabase = createSupabaseServerClient()
  const { txnid, status } = params

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('*, users(id)')
    .eq('payu_txn_id', txnid)
    .single()

  if (!sub) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })

  const isSuccess = status === 'success'
  const expiresAt = isSuccess
    ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    : null

  await supabase.from('subscriptions').update({
    status: isSuccess ? 'success' : 'failed',
    starts_at: isSuccess ? new Date().toISOString() : null,
    expires_at: expiresAt,
  }).eq('payu_txn_id', txnid)

  if (isSuccess) {
    await supabase.from('users').update({
      plan: sub.plan,
      plan_expires_at: expiresAt,
    }).eq('id', (sub.users as { id: string }).id)
  }

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_APP_URL}/billing?status=${isSuccess ? 'success' : 'failed'}`
  )
}
