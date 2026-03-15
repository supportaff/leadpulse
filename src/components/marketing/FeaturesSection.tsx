import { Search, Brain, MessageSquare, Bell, Target, BarChart3 } from 'lucide-react'

const features = [
  {
    icon: <Search className="h-6 w-6" />,
    title: 'Lead Discovery Engine',
    description: 'Continuously scans Reddit and X for posts with buyer intent. Detects keywords, recommendation requests, and purchase signals in real time.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: <Brain className="h-6 w-6" />,
    title: 'AI Intent Scoring',
    description: 'Every detected post receives a High / Medium / Low intent score based on wording, urgency, context, and relevance to your product.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: 'AI Reply Generator',
    description: 'Generate contextual, human-sounding replies for each lead. Personalized to the post, not generic templates.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: 'Keyword Campaigns',
    description: 'Track unlimited keywords like “CRM”, “email marketing”, “landing page builder”. Organize into campaigns per product or use case.',
    color: 'bg-orange-50 text-orange-600',
  },
  {
    icon: <Bell className="h-6 w-6" />,
    title: 'Instant Notifications',
    description: 'Get email alerts when high-intent leads appear. Never miss a buying signal again.',
    color: 'bg-yellow-50 text-yellow-600',
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: 'Analytics Dashboard',
    description: 'Track lead volume, intent distribution, reply rates, and campaign performance all in one place.',
    color: 'bg-red-50 text-red-600',
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Built for Serious Lead Generation</h2>
          <p className="text-xl text-gray-500">Every feature designed to turn social conversations into revenue.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-gray-100 p-8 hover:shadow-md transition-shadow">
              <div className={`inline-flex rounded-xl p-3 ${f.color} mb-4`}>{f.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
