'use client'
import { useEffect, useState } from 'react'
import { Plus, Target, Trash2 } from 'lucide-react'
import type { Campaign } from '@/types'

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [keywords, setKeywords] = useState('')

  const loadCampaigns = () => {
    fetch('/api/campaigns').then(r => r.json()).then(d => {
      setCampaigns(d.campaigns ?? [])
      setLoading(false)
    })
  }

  useEffect(() => { loadCampaigns() }, [])

  const createCampaign = async () => {
    if (!name || !keywords) return
    await fetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
        platforms: ['reddit', 'twitter'],
      }),
    })
    setName(''); setKeywords(''); setShowForm(false)
    loadCampaigns()
  }

  const deleteCampaign = async (id: string) => {
    await fetch(`/api/campaigns/${id}`, { method: 'DELETE' })
    loadCampaigns()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <Plus className="h-4 w-4" /> New Campaign
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <h3 className="font-semibold text-gray-800">Create Campaign</h3>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Campaign Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. CRM Keywords" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Keywords (comma separated)</label>
            <input value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="CRM, project management, team collaboration" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          </div>
          <button onClick={createCampaign} className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700">Create</button>
        </div>
      )}

      {loading ? <div className="text-center py-12 text-gray-400">Loading...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.length === 0 && <div className="col-span-2 text-center py-12 text-gray-400">No campaigns yet. Create your first one!</div>}
          {campaigns.map(c => (
            <div key={c.id} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-50 p-2"><Target className="h-5 w-5 text-blue-600" /></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{c.name}</h3>
                    <p className="text-xs text-gray-500">{c.platforms.join(', ')}</p>
                  </div>
                </div>
                <button onClick={() => deleteCampaign(c.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {c.keywords.map(k => (
                  <span key={k} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">{k}</span>
                ))}
              </div>
              <div className={`mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${c.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${c.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                {c.is_active ? 'Active' : 'Paused'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
