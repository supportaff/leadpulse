'use client';
import { useState } from 'react';
import { Check, ExternalLink } from 'lucide-react';
import { PLANS } from '@/lib/plans';

const plans = Object.values(PLANS);

// Set to null until real DB subscription is wired
// This means all 3 plans show a Subscribe button
const CURRENT_PLAN: string | null = null;
const CURRENT_USAGE = { campaigns: 2, leadsThisMonth: 73, aiReplies: 18 };

export default function BillingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const currentPlan = CURRENT_PLAN ? PLANS[CURRENT_PLAN as keyof typeof PLANS] : null;

  const handleCheckout = async (planKey: string) => {
    const plan = PLANS[planKey as keyof typeof PLANS];
    if (!plan) return;

    // If plan has a direct PayU subscription link, redirect straight there
    if (plan.payuLink) {
      window.location.href = plan.payuLink;
      return;
    }

    // Otherwise call our checkout API to generate PayU form
    setLoading(planKey);
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey }),
      });
      const data = await res.json();
      if (data.action) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = data.action;
        Object.entries(data.fields as Record<string, string>).forEach(([k, v]) => {
          const input = document.createElement('input');
          input.type = 'hidden'; input.name = k; input.value = v;
          form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
      }
    } catch {
      alert('Payment initiation failed. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const usageItems = currentPlan ? [
    { label: 'Campaigns',        used: CURRENT_USAGE.campaigns,       total: currentPlan.limits.campaigns === 999 ? '∞' : currentPlan.limits.campaigns },
    { label: 'Leads this month', used: CURRENT_USAGE.leadsThisMonth,  total: currentPlan.limits.leadsPerMonth },
    { label: 'AI Replies',       used: CURRENT_USAGE.aiReplies,       total: currentPlan.limits.aiRepliesPerMonth },
  ] : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Billing &amp; Plans</h1>
        <p className="text-gray-400 text-sm mt-1">
          {currentPlan
            ? <>You are on the <span className="text-white font-medium">{currentPlan.label}</span> plan &middot; <span className="text-gray-500">₹{currentPlan.price}/month</span></>
            : 'Choose a plan to get started'}
        </p>
      </div>

      {/* Plan cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map(plan => {
          const isActive = plan.key === CURRENT_PLAN;
          const isPopular = 'popular' in plan && plan.popular;
          return (
            <div key={plan.key} className={`relative rounded-2xl border p-6 transition ${
              isPopular ? 'bg-white border-white' : 'bg-white/[0.02] border-white/10 hover:border-white/25'
            }`}>
              {isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20 whitespace-nowrap">
                  Most popular
                </span>
              )}
              <h3 className={`text-lg font-bold mb-1 ${isPopular ? 'text-black' : 'text-white'}`}>{plan.label}</h3>
              <div className="mb-5">
                <span className={`text-4xl font-bold ${isPopular ? 'text-black' : 'text-white'}`}>₹{plan.price.toLocaleString('en-IN')}</span>
                <span className="text-sm text-gray-500 ml-1">/month</span>
              </div>
              <ul className="space-y-2.5 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className={`w-4 h-4 shrink-0 ${isPopular ? 'text-black' : 'text-white/60'}`} />
                    <span className={isPopular ? 'text-gray-700' : 'text-gray-300'}>{f}</span>
                  </li>
                ))}
              </ul>
              {isActive ? (
                <div className={`text-center py-2.5 rounded-xl text-sm font-semibold border ${
                  isPopular ? 'border-black/20 text-black/50' : 'border-white/10 text-gray-600'
                }`}>Current plan</div>
              ) : (
                <button
                  onClick={() => handleCheckout(plan.key)}
                  disabled={loading === plan.key || !plan.payuLink}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 ${
                    !plan.payuLink
                      ? 'border border-white/10 text-gray-600 cursor-not-allowed'
                      : isPopular
                        ? 'bg-black text-white hover:bg-gray-900'
                        : 'border border-white/20 text-white hover:bg-white/5'
                  }`}>
                  {loading === plan.key
                    ? 'Redirecting...'
                    : !plan.payuLink
                      ? 'Coming soon'
                      : <><ExternalLink className="w-3.5 h-3.5" />Subscribe – ₹{plan.price.toLocaleString('en-IN')}/mo</>}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Usage — only show if on a plan */}
      {currentPlan && usageItems.length > 0 && (
        <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white">Current usage — {currentPlan.label} plan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {usageItems.map(({ label, used, total }) => {
              const pct = typeof total === 'number' ? Math.min(100, Math.round((used / total) * 100)) : 0;
              const isNearLimit = pct >= 80;
              return (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-gray-400">{label}</span>
                    <span className={isNearLimit ? 'text-amber-400' : 'text-gray-500'}>
                      {used} / {total}{isNearLimit && ' ⚠'}
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        pct >= 100 ? 'bg-red-500' : isNearLimit ? 'bg-amber-400' : 'bg-white'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <p className="text-center text-xs text-gray-700">Payments secured by PayU · GST applicable · Cancel anytime</p>
    </div>
  );
}
