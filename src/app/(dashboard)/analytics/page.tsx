'use client'
import { useEffect, useState } from 'react'
import { BarChart3, TrendingUp, MessageSquare, Target } from 'lucide-react'

export default function AnalyticsPage() {
  const [stats, setStats] = useState({ total: 0, high: 0, medium: 0, low: 0, replied: 0, reddit: 0, twitter: 0 })

  useEffect(() => {
    fetch('/api/analytics').then(r => r.json()).then(d => setStats(d))
  }, [])

  const cards = [
    { label: 'Total Leads', value: stats.total, icon: <BarChart3 className="h-5 w-5 text-blue-500" />, bg: 'bg-blue-50' },
    { label: 'High Intent', value: stats.high, icon: <TrendingUp className="h-5 w-5 text-green-500" />, bg: 'bg-green-50' },
    { label: 'Replied', value: stats.replied, icon: <MessageSquare className="h-5 w-5 text-purple-500" />, bg: 'bg-purple-50' },
    { label: 'Reddit Leads', value: stats.reddit, icon: <Target className="h-5 w-5 text-orange-500" />, bg: 'bg-orange-50' },
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(c => (
          <div key={c.label} className={`rounded-xl ${c.bg} p-6 border border-gray-100`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600">{c.label}</span>
              {c.icon}
            </div>
            <div className="text-3xl font-bold text-gray-900">{c.value}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-gray-100 bg-white p-8">
        <h2 className="font-semibold text-gray-800 mb-4">Intent Distribution</h2>
        <div className="space-y-4">
          {[{ label: 'High Intent', value: stats.high, total: stats.total, color: 'bg-green-500' },
            { label: 'Medium Intent', value: stats.medium, total: stats.total, color: 'bg-yellow-400' },
            { label: 'Low Intent', value: stats.low, total: stats.total, color: 'bg-gray-300' }].map(bar => (
            <div key={bar.label}>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>{bar.label}</span>
                <span>{bar.value}</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100">
                <div
                  className={`h-2 rounded-full ${bar.color} transition-all`}
                  style={{ width: bar.total > 0 ? `${(bar.value / bar.total) * 100}%` : '0%' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
