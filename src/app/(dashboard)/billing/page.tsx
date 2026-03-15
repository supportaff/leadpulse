'use client';
import { useState } from 'react';
import { Check } from 'lucide-react';

const plans = [
  {
    key: 'starter',
    label: 'Starter',
    price: 499,
    desc: 'Solo founders testing Reddit outbound.',
    features: ['3 campaigns', '100 leads / month', '30 AI replies / month', 'Email alerts', 'Basic analytics'],
  },
  {
    key: 'growth',
    label: 'Growth',
    price: 999,
    desc: 'Growing teams that need more volume.',
    popular: true,
    features: ['10 campaigns', '500 leads / month', '150 AI replies / month', 'Email alerts', 'Competitor monitoring', 'Priority support'],
  },
  {
    key: 'pro',
    label: 'Pro',
    price: 1499,
    desc: 'Unlimited power for serious operators.',
    features: ['Unlimited campaigns', '2000 leads / month', '500 AI replies / month', 'Email alerts', 'Competitor monitoring', 'API access', 'White-label ready'],
  },
];

export default function BillingPage() {
  const [current] = useState('growth');
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (plan: string) => {
    setLoading(plan);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(null);
    alert(`Redirecting to PayU checkout for ₹${plans.find(p => p.key === plan)?.price}/month...`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Billing &amp; Plans</h1>
        <p className="text-gray-400 text-sm mt-1">You are on the <span className="text-white font-medium">Growth</span> plan. Renews on Apr 15, 2026.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map(plan => {
          const isActive = plan.key === current;
          const isPopular = plan.popular;
          return (
            <div key={plan.key} className={`relative rounded-2xl border p-6 transition ${
              isPopular ? 'bg-white border-white text-black' : 'bg-white/[0.02] border-white/10 hover:border-white/25'
            }`}>
              {isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20">Most popular</span>
              )}
              <h3 className={`text-lg font-bold mb-1 ${isPopular ? 'text-black' : 'text-white'}`}>{plan.label}</h3>
              <p className={`text-xs mb-5 ${isPopular ? 'text-gray-500' : 'text-gray-500'}`}>{plan.desc}</p>
              <div className="mb-6">
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
                <button onClick={() => handleCheckout(plan.key)} disabled={loading === plan.key}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-50 ${
                    isPopular ? 'bg-black text-white hover:bg-gray-900' : 'border border-white/20 text-white hover:bg-white/5'
                  }`}>
                  {loading === plan.key ? 'Redirecting...' : `Switch to ${plan.label}`}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6 space-y-3">
        <h2 className="text-sm font-semibold text-white">Current usage</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Campaigns', used: 2, total: 10 },
            { label: 'Leads this month', used: 147, total: 500 },
            { label: 'AI Replies', used: 28, total: 150 },
            { label: 'Days remaining', used: 31, total: 31 },
          ].map(({ label, used, total }) => (
            <div key={label}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-400">{label}</span>
                <span className="text-gray-500">{used}/{total}</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full">
                <div className="h-1.5 bg-white rounded-full" style={{ width: `${Math.min(100, (used / total) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-gray-700">Payments secured by PayU · GST applicable · Cancel anytime</p>
    </div>
  );
}
