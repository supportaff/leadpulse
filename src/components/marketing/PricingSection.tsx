import Link from 'next/link'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    price: 14,
    description: 'Perfect for solo founders and indie hackers.',
    features: [
      '5 tracked keywords',
      '100 leads/month',
      '50 AI replies/month',
      'Reddit + X monitoring',
      'Email notifications',
      'Basic dashboard',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Growth',
    price: 22,
    description: 'For growing startups scaling outreach.',
    features: [
      '15 tracked keywords',
      '500 leads/month',
      '250 AI replies/month',
      'Reddit + X monitoring',
      'Competitor monitoring',
      'Priority email alerts',
      'Campaign analytics',
    ],
    cta: 'Start Growing',
    popular: true,
  },
  {
    name: 'Pro',
    price: 30,
    description: 'For teams and agencies at full scale.',
    features: [
      'Unlimited keywords',
      'Unlimited leads',
      'Unlimited AI replies',
      'Reddit + X monitoring',
      'Competitor monitoring',
      'Advanced analytics',
      'API access',
      'Priority support',
    ],
    cta: 'Go Pro',
    popular: false,
  },
]

export default function PricingSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Pricing That Makes Sense</h2>
          <p className="text-xl text-gray-500">25% more affordable. 100% more powerful.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 border-2 ${
                plan.popular
                  ? 'border-blue-500 bg-blue-600 text-white shadow-xl shadow-blue-200'
                  : 'border-gray-100 bg-white'
              }`}
            >
              {plan.popular && (
                <div className="text-xs font-semibold uppercase tracking-wider bg-blue-500 text-white rounded-full px-3 py-1 inline-block mb-4">
                  Most Popular
                </div>
              )}
              <h3 className={`text-xl font-bold mb-1 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
              <p className={`text-sm mb-4 ${plan.popular ? 'text-blue-100' : 'text-gray-500'}`}>{plan.description}</p>
              <div className="mb-6">
                <span className={`text-5xl font-extrabold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>${plan.price}</span>
                <span className={`text-sm ${plan.popular ? 'text-blue-200' : 'text-gray-400'}`}>/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className={`h-4 w-4 flex-shrink-0 ${plan.popular ? 'text-blue-200' : 'text-green-500'}`} />
                    <span className={plan.popular ? 'text-blue-50' : 'text-gray-600'}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className={`block w-full text-center rounded-xl py-3 font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-white text-blue-600 hover:bg-blue-50'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
