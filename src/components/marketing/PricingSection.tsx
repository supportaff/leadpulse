'use client';
import Link from 'next/link';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Starter', price: 499, desc: 'Perfect for solo founders testing Reddit outbound.',
    features: ['3 campaigns', '100 leads / month', '30 AI replies / month', 'Email alerts', 'Reddit scanning', 'Basic analytics'],
  },
  {
    name: 'Growth', price: 999, desc: 'For growing teams that need more volume.', popular: true,
    features: ['10 campaigns', '500 leads / month', '150 AI replies / month', 'Email alerts', 'Reddit scanning', 'Competitor monitoring', 'Priority support'],
  },
  {
    name: 'Pro', price: 1499, desc: 'Unlimited power for serious operators.',
    features: ['Unlimited campaigns', '2000 leads / month', '500 AI replies / month', 'Email alerts', 'Reddit scanning', 'Competitor monitoring', 'API access', 'White-label ready'],
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 px-5 bg-black border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Simple, transparent pricing</h2>
          <p className="text-gray-400 text-sm sm:text-base">All prices in INR. Cancel anytime, no hidden fees.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {plans.map(plan => (
            <div key={plan.name} className={`relative rounded-2xl p-6 border transition-colors ${
              plan.popular ? 'bg-white border-white' : 'bg-white/[0.02] border-white/10 hover:border-white/25'
            }`}>
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20 whitespace-nowrap">Most popular</span>
              )}
              <h3 className={`text-lg font-bold mb-1 ${plan.popular ? 'text-black' : 'text-white'}`}>{plan.name}</h3>
              <p className={`text-sm mb-5 ${plan.popular ? 'text-gray-600' : 'text-gray-400'}`}>{plan.desc}</p>
              <div className="mb-6">
                <span className={`text-4xl font-bold ${plan.popular ? 'text-black' : 'text-white'}`}>&#8377;{plan.price.toLocaleString('en-IN')}</span>
                <span className="text-sm text-gray-500 ml-1">/month</span>
              </div>
              <ul className="space-y-2.5 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className={`w-4 h-4 shrink-0 ${plan.popular ? 'text-black' : 'text-white'}`} />
                    <span className={plan.popular ? 'text-gray-700' : 'text-gray-300'}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/sign-in" className={`block text-center py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                plan.popular ? 'bg-black hover:bg-gray-900 text-white' : 'border border-white/20 hover:border-white/50 text-white hover:bg-white/5'
              }`}>Get started</Link>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-600 mt-8">GST applicable &middot; Payments via PayU</p>
      </div>
    </section>
  );
}

export default PricingSection;
