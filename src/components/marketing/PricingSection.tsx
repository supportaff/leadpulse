import Link from 'next/link';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: '₹99',
    credits: '10 credits',
    per: '₹10 per AI plan',
    features: ['10 AI-generated plans', 'Debt repayment planner', 'Insurance recommender', 'Credits never expire'],
    cta: 'Buy Starter',
    highlight: false,
  },
  {
    name: 'Popular',
    price: '₹249',
    credits: '30 credits',
    per: '₹8.3 per AI plan',
    features: ['30 AI-generated plans', 'Debt repayment planner', 'Insurance recommender', 'Credits never expire', 'Save 17% vs Starter'],
    cta: 'Buy Popular',
    highlight: true,
  },
  {
    name: 'Power',
    price: '₹499',
    credits: '70 credits',
    per: '₹7.1 per AI plan',
    features: ['70 AI-generated plans', 'Debt repayment planner', 'Insurance recommender', 'Credits never expire', 'Save 29% vs Starter', 'Priority support'],
    cta: 'Buy Power',
    highlight: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 px-5 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white">Simple wallet pricing</h2>
        <p className="text-gray-500 text-sm mt-2">No subscriptions. No monthly fees. Pay only for what you use.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map(({ name, price, credits, per, features, cta, highlight }) => (
          <div key={name} className={`rounded-2xl p-6 space-y-5 border ${
            highlight ? 'bg-white text-black border-transparent' : 'bg-white/[0.02] border-white/8 text-white'
          }`}>
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wide ${highlight ? 'text-gray-500' : 'text-gray-500'}`}>{name}</p>
              <p className={`text-4xl font-bold mt-1 ${highlight ? 'text-black' : 'text-white'}`}>{price}</p>
              <p className={`text-sm mt-0.5 ${highlight ? 'text-gray-600' : 'text-gray-400'}`}>{credits} · {per}</p>
            </div>
            <ul className="space-y-2">
              {features.map(f => (
                <li key={f} className={`flex items-center gap-2 text-xs ${highlight ? 'text-gray-700' : 'text-gray-400'}`}>
                  <Check className="w-3.5 h-3.5 shrink-0" />{f}
                </li>
              ))}
            </ul>
            <Link href="/sign-up" className={`block text-center text-sm font-semibold py-2.5 rounded-xl transition ${
              highlight ? 'bg-black text-white hover:bg-gray-800' : 'bg-white/10 text-white hover:bg-white/15'
            }`}>{cta}</Link>
          </div>
        ))}
      </div>
      <p className="text-center text-gray-600 text-xs mt-6">Payments secured by PayU · Indian Rupees only · Credits never expire</p>
    </section>
  );
}
