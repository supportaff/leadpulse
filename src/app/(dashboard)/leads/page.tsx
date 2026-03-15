'use client'
import { useEffect, useState } from 'react'
import LeadTable from '@/components/dashboard/LeadTable'
import type { Lead, IntentLevel, Platform } from '@/types'

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [intentFilter, setIntentFilter] = useState<IntentLevel | 'all'>('all')
  const [platformFilter, setPlatformFilter] = useState<Platform | 'all'>('all')

  useEffect(() => {
    const params = new URLSearchParams()
    if (intentFilter !== 'all') params.set('intent', intentFilter)
    if (platformFilter !== 'all') params.set('platform', platformFilter)
    setLoading(true)
    fetch(`/api/leads?${params}`)
      .then((r) => r.json())
      .then((d) => { setLeads(d.leads ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [intentFilter, platformFilter])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">All Leads</h1>
      </div>
      <div className="flex gap-3">
        <select
          value={intentFilter}
          onChange={(e) => setIntentFilter(e.target.value as IntentLevel | 'all')}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
        >
          <option value="all">All Intent</option>
          <option value="high">High Intent</option>
          <option value="medium">Medium Intent</option>
          <option value="low">Low Intent</option>
        </select>
        <select
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value as Platform | 'all')}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
        >
          <option value="all">All Platforms</option>
          <option value="reddit">Reddit</option>
          <option value="twitter">X (Twitter)</option>
        </select>
      </div>
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : (
        <LeadTable leads={leads} />
      )}
    </div>
  )
}
