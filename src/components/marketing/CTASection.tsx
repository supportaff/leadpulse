import Link from 'next/link'

export default function CTASection() {
  return (
    <section className="py-24 bg-blue-600">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-4xl font-extrabold text-white mb-4">Start Finding Leads Today</h2>
        <p className="text-xl text-blue-100 mb-10">
          Join hundreds of founders who use LeadPulse to discover buyers before their competitors.
        </p>
        <Link href="/sign-up" className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-blue-600 hover:bg-blue-50 transition-colors shadow-lg">
          Get Started Free →
        </Link>
        <p className="mt-4 text-blue-200 text-sm">No credit card required. Free plan available.</p>
      </div>
    </section>
  )
}
