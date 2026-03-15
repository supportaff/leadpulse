'use client';
import Link from 'next/link';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Starter', price: 14, desc: 'Perfect for solo founders testing the waters.',
    features: ['3 campaigns', '100 leads/month', '30 AI replies/month', 'Email alerts', 'Reddit scanning'],
  },
  {
    name: 'Growth', price: 22, desc: 'For growing teams that need more volume.', popular: true,
    features: ['10 campaigns', '500 leads/month', '150 AI replies/month', 'Email alerts', 'Reddit + X scanning', 'Priority support'],
  },
  {
    name: 'Pro', price: 30, desc: 'Unlimited power for serious operators.',
    features: ['Unlimited campaigns', '2000 leads/month', '500 AI replies/month', 'Email alerts', 'Reddit + X scanning', 'API access', 'White-label ready'],
  },
];

export function PricingSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Simple, transparent pricing</h2>
        <p className="text-gray-400 text-center mb-12">Start free. Upgrade when you're ready.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div key={plan.name} className={`relative bg-gray-900 border rounded-2xl p-6 ${
              plan.popular ? 'border-blue-500 ring-1 ring-blue-500/50' : 'border-gray-800'
            }`}>
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">Most popular</span>
              )}
              <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{plan.desc}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">${plan.price}</span>
                <span className="text-gray-400 text-sm">/month</span>
              </div>
              <ul className="space-y-2 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-green-400 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <Link href="/sign-up" className={`block text-center py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                plan.popular
                  ? 'bg-blue-600 hover:bg-blue-500 text-white'
                  : 'border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white'
              }`}>
                Get started
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PricingSection;
