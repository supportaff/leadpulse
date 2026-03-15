import FeaturesSection from '@/components/marketing/FeaturesSection'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Features — LeadPulse' }

export default function FeaturesPage() {
  return (
    <div className="py-20">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold text-gray-900">Everything You Need to Find Leads</h1>
        <p className="mt-3 text-lg text-gray-500">Powerful tools designed for modern SaaS growth.</p>
      </div>
      <FeaturesSection />
    </div>
  )
}
