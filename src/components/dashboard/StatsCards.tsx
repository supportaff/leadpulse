'use client'
import { useEffect, useState } from 'react'
import { TrendingUp, MessageSquare, Target, Zap } from 'lucide-react'

export default function StatsCards() {
  const [stats, setStats] = useState({ total: 0, high: 0, replied: 0, campaigns: 0 })

  useEffect(() => {
    fetch('/api/analytics').then(r => r.json()).then(d => setStats(d)).catch(() => {})
  }, [])

  const cards = [
    { label: 'Total Leads', value: stats.total, icon: <Zap className="h-5 w-5 text-blue-500" />, bg: 'bg-blue-50' },
    { label: 'High Intent', value: stats.high,  icon: <TrendingUp className="h-5 w-5 text-green-500" />, bg: 'bg-green-50' },
    { label: 'AI Replies Sent', value: stats.replied, icon: <MessageSquare className="h-5 w-5 text-purple-500" />, bg: 'bg-purple-50' },
    { label: 'Active Campaigns', value: stats.campaigns, icon: <Target className="h-5 w-5 text-orange-500" />, bg: 'bg-orange-50' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(c => (
        <div key={c.label} className={`${c.bg} rounded-xl p-5 border border-gray-100`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">{c.label}</span>
            {c.icon}
          </div>
          <div className="text-3xl font-bold text-gray-900">{c.value}</div>
        </div>
      ))}
    </div>
  )
}
