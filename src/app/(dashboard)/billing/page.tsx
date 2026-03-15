'use client';
import { useState } from 'react';
import { PLAN_PRICES, PLAN_LIMITS } from '@/types/subscription';

export default function BillingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const checkout = async (plan: 'starter' | 'growth' | 'pro') => {
    setLoading(plan);
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.paymentUrl) window.location.href = data.paymentUrl;
    } finally {
      setLoading(null);
    }
  };

  const plans = Object.entries(PLAN_PRICES) as [keyof typeof PLAN_PRICES, { monthly: number; label: string }][];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Billing &amp; Plans</h1>
        <p className="text-gray-400 text-sm mt-1">Upgrade your plan to unlock more leads and AI replies</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(([planKey, planInfo]) => {
          const limits = PLAN_LIMITS[planKey];
          const isGrowth = planKey === 'growth';
          return (
            <div key={planKey} className={`rounded-2xl border p-6 space-y-5 relative ${
              isGrowth ? 'border-purple-500 bg-purple-950/20' : 'border-gray-800 bg-gray-900'
            }`}>
              {isGrowth && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">MOST POPULAR</span>
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-white">{planInfo.label}</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-extrabold text-white">${planInfo.monthly}</span>
                  <span className="text-gray-400 text-sm">/month</span>
                </div>
              </div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-green-400">✓</span>
                  {limits.keywords === Infinity ? 'Unlimited keywords' : `${limits.keywords} keywords`}
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-green-400">✓</span>
                  {limits.leads === Infinity ? 'Unlimited leads/mo' : `${limits.leads} leads/mo`}
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-green-400">✓</span>
                  {limits.replies === Infinity ? 'Unlimited AI replies' : `${limits.replies} AI replies/mo`}
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-green-400">✓</span> Email alerts
                </li>
                {(planKey === 'growth' || planKey === 'pro') && (
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="text-green-400">✓</span> Competitor monitoring
                  </li>
                )}
              </ul>
              <button
                onClick={() => checkout(planKey)}
                disabled={loading === planKey}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition ${
                  isGrowth
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90'
                    : 'bg-gray-800 border border-gray-700 text-white hover:bg-gray-700'
                } disabled:opacity-50`}>
                {loading === planKey ? 'Redirecting...' : `Get ${planInfo.label}`}
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-gray-500">
        Payments are secured by PayU. Cancel anytime.
      </p>
    </div>
  );
}
