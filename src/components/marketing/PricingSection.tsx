import Link from 'next/link';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: '₹99',
    credits: '10 credits',
    per: '₹10 per AI plan',
    badge: '',
    features: [
      '10 AI plans (period or pregnancy)',
      'WhatsApp reminders — free forever',
      'Period cycle predictions',
      'Credits never expire',
    ],
    cta: 'Get Starter',
    highlight: false,
  },
  {
    name: 'Mom Plan',
    price: '₹249',
    credits: '30 credits',
    per: '₹8.3 per AI plan',
    badge: '⭐ Most Popular',
    features: [
      '30 AI plans (period or pregnancy)',
      'WhatsApp reminders — free forever',
      'Full 40-week pregnancy roadmap',
      'Doctor visit schedule',
      'Credits never expire',
      'Save 17% vs Starter',
    ],
    cta: 'Get Mom Plan',
    highlight: true,
  },
  {
    name: 'Family',
    price: '₹499',
    credits: '70 credits',
    per: '₹7.1 per AI plan',
    badge: '',
    features: [
      '70 AI plans (period or pregnancy)',
      'WhatsApp reminders — free forever',
      'Full 40-week pregnancy roadmap',
      'Doctor visit schedule',
      'Shareable with partner',
      'Credits never expire',
      'Save 29% vs Starter',
    ],
    cta: 'Get Family Plan',
    highlight: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 px-5 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white">Simple, honest pricing</h2>
        <p className="text-gray-500 text-sm mt-2">No subscription. No lock-in. WhatsApp reminders are always free.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map(({ name, price, credits, per, badge, features, cta, highlight }) => (
          <div key={name} className={`rounded-2xl p-6 space-y-5 border relative ${
            highlight ? 'bg-white text-black border-transparent' : 'bg-white/[0.02] border-white/8 text-white'
          }`}>
            {badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black border border-white/20 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">{badge}</div>
            )}
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wide ${highlight ? 'text-gray-500' : 'text-gray-500'}`}>{name}</p>
              <p className={`text-4xl font-bold mt-1 ${highlight ? 'text-black' : 'text-white'}`}>{price}</p>
              <p className={`text-sm mt-0.5 ${highlight ? 'text-gray-600' : 'text-gray-400'}`}>{credits} · {per}</p>
            </div>
            <ul className="space-y-2">
              {features.map(f => (
                <li key={f} className={`flex items-start gap-2 text-xs ${highlight ? 'text-gray-700' : 'text-gray-400'}`}>
                  <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" />{f}
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
