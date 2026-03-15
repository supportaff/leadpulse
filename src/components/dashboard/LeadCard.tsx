'use client'
import { useState } from 'react'
import { ExternalLink, MessageSquare, Copy, Check } from 'lucide-react'
import IntentBadge from './IntentBadge'
import { formatDate, truncate } from '@/lib/utils'
import type { Lead } from '@/types'

export default function LeadCard({ lead }: { lead: Lead }) {
  const [reply, setReply] = useState(lead.ai_reply || '')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const generateReply = async () => {
    setLoading(true)
    const res = await fetch('/api/ai/reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lead_id: lead.id }),
    })
    const data = await res.json()
    setReply(data.reply)
    setLoading(false)
  }

  const copyReply = () => {
    navigator.clipboard.writeText(reply)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              lead.platform === 'reddit' ? 'bg-orange-50 text-orange-600' : 'bg-sky-50 text-sky-600'
            }`}>
              {lead.platform === 'reddit' ? 'Reddit' : 'X (Twitter)'}
            </span>
            <IntentBadge level={lead.intent_level} />
            {lead.is_competitor && (
              <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">Competitor Mention</span>
            )}
          </div>
          {lead.post_title && <h3 className="font-semibold text-gray-900 mb-1">{truncate(lead.post_title, 100)}</h3>}
          <p className="text-sm text-gray-500">{truncate(lead.post_body, 200)}</p>
        </div>
        <a href={lead.post_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500">
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      {lead.ai_summary && (
        <div className="rounded-lg bg-blue-50 px-4 py-2 text-sm text-blue-700">
          🧠 {lead.ai_summary}
        </div>
      )}

      {reply ? (
        <div className="space-y-2">
          <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-700 border border-gray-200">{reply}</div>
          <button onClick={copyReply} className="flex items-center gap-2 text-xs text-gray-500 hover:text-blue-600">
            {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
            {copied ? 'Copied!' : 'Copy reply'}
          </button>
        </div>
      ) : (
        <button onClick={generateReply} disabled={loading} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
          <MessageSquare className="h-4 w-4" />
          {loading ? 'Generating...' : 'Generate AI Reply'}
        </button>
      )}

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>@{lead.author_username || 'anonymous'}{lead.subreddit ? ` • r/${lead.subreddit}` : ''}</span>
        <span>{lead.detected_at ? formatDate(lead.detected_at) : ''}</span>
      </div>
    </div>
  )
}
