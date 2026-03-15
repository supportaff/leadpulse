'use client'
import { useState } from 'react'
import { Check } from 'lucide-react'

const plans = [
  { id: 'starter', name: 'Starter', price: 14, features: ['5 keywords', '100 leads/mo', '50 AI replies'] },
  { id: 'growth',  name: 'Growth',  price: 22, features: ['15 keywords', '500 leads/mo', '250 AI replies'] },
  { id: 'pro',     name: 'Pro',     price: 30, features: ['Unlimited keywords', 'Unlimited leads', 'Unlimited replies'] },
]

export default function BillingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const checkout = async (planId: string) => {
    setLoading(planId)
    const res = await fetch('/api/billing/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: planId }),
    })
    const data = await res.json()
    if (data.paymentUrl) window.location.href = data.paymentUrl
    setLoading(null)
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Billing & Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
        {plans.map(plan => (
          <div key={plan.id} className="rounded-xl border-2 border-gray-100 bg-white p-6">
            <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
            <div className="my-3"><span className="text-4xl font-extrabold">${plan.price}</span><span className="text-gray-400 text-sm">/mo</span></div>
            <ul className="space-y-2 mb-6">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="h-4 w-4 text-green-500" />{f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => checkout(plan.id)}
              disabled={loading === plan.id}
              className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading === plan.id ? 'Redirecting...' : `Upgrade to ${plan.name}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
