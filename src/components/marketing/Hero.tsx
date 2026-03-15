import Link from 'next/link'
import { ArrowRight, TrendingUp, MessageSquare, Search } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-24">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm text-blue-700 mb-8">
          <TrendingUp className="h-4 w-4" />
          AI-powered lead discovery from Reddit & X
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
          Catch Buyers <span className="text-blue-600">Before</span><br />Your Competitors Do
        </h1>
        <p className="mx-auto max-w-2xl text-xl text-gray-500 mb-10">
          LeadPulse scans Reddit and X (Twitter) 24/7 to find people actively asking for products like yours — then generates AI replies to convert them into customers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/sign-up" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
            Start Free <ArrowRight className="h-5 w-5" />
          </Link>
          <Link href="/features" className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 px-8 py-4 text-lg font-semibold text-gray-700 hover:border-blue-300 transition-colors">
            See How It Works
          </Link>
        </div>

        {/* Social proof */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto max-w-3xl">
          {[
            { icon: <Search className="h-6 w-6 text-blue-500" />, stat: '2M+', label: 'Posts Scanned Daily' },
            { icon: <TrendingUp className="h-6 w-6 text-green-500" />, stat: '94%', label: 'Intent Accuracy' },
            { icon: <MessageSquare className="h-6 w-6 text-purple-500" />, stat: '3.2x', label: 'Higher Reply Rate' },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-center mb-2">{item.icon}</div>
              <div className="text-3xl font-bold text-gray-900">{item.stat}</div>
              <div className="text-sm text-gray-500">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
