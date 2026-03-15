'use client'
import { useEffect, useState } from 'react'
import StatsCards from '@/components/dashboard/StatsCards'
import LeadTable from '@/components/dashboard/LeadTable'
import type { Lead } from '@/types'

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/leads?limit=10')
      .then((r) => r.json())
      .then((d) => { setLeads(d.leads ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Your latest high-intent leads from Reddit & X.</p>
      </div>
      <StatsCards />
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Leads</h2>
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading leads...</div>
        ) : (
          <LeadTable leads={leads} />
        )}
      </div>
    </div>
  )
}
