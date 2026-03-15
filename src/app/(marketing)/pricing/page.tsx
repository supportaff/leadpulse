import PricingSection from '@/components/marketing/PricingSection'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Pricing — LeadPulse' }

export default function PricingPage() {
  return (
    <div className="py-20">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold text-gray-900">Simple, Transparent Pricing</h1>
        <p className="mt-3 text-lg text-gray-500">Start free. Scale as you grow. No hidden fees.</p>
      </div>
      <PricingSection />
    </div>
  )
}
