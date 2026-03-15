import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { generatePayUHash, generateTxnId } from '@/lib/payu'
import { env } from '@/lib/env'
import { PLAN_PRICES } from '@/lib/utils'

export async function POST(req: NextRequest) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createSupabaseServerClient()
  const { data: user } = await supabase.from('users').select('*').eq('clerk_id', userId).single()
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { plan } = await req.json()
  const planData = PLAN_PRICES[plan as keyof typeof PLAN_PRICES]
  if (!planData) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })

  const txnid = generateTxnId()
  const amount = planData.monthly.toFixed(2)
  const productinfo = `LeadPulse ${planData.label} Plan`
  const firstname = user.full_name || 'Customer'
  const email = user.email
  const surl = `${env.app.url}/api/billing/success`
  const furl = `${env.app.url}/billing?status=failed`

  const hash = generatePayUHash({ txnid, amount, productinfo, firstname, email, surl, furl })

  // Store pending transaction
  await supabase.from('subscriptions').insert({
    user_id: user.id,
    payu_txn_id: txnid,
    plan,
    amount: parseFloat(amount),
    status: 'pending',
  })

  // Build PayU form data
  const paymentData = {
    key: env.payu.merchantKey,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    surl,
    furl,
    hash,
    service_provider: 'payu_paisa',
  }

  return NextResponse.json({
    paymentUrl: env.payu.baseUrl,
    paymentData,
  })
}
