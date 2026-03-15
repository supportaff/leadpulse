'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Lead } from '@/types/lead';
import { IntentBadge } from '@/components/dashboard/IntentBadge';
import { AIReplyPanel } from '@/components/dashboard/AIReplyPanel';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/leads/${id}`)
      .then(r => r.json())
      .then(d => setLead(d.lead))
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status: string) => {
    await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (lead) setLead({ ...lead, status: status as Lead['status'] });
  };

  if (loading) return <div className="py-20"><LoadingSpinner /></div>;
  if (!lead) return <div className="text-gray-400 py-20 text-center">Lead not found.</div>;

  const platformLabel = lead.platform === 'reddit'
    ? `🟠 Reddit${lead.subreddit ? ` › r/${lead.subreddit}` : ''}`
    : '𝕏 Twitter';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button onClick={() => router.back()} className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition">
        ← Back to Leads
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Post details */}
        <div className="lg:col-span-3 space-y-5">
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">{platformLabel}</span>
              <IntentBadge level={lead.intent_level} score={lead.intent_score} />
            </div>

            {lead.post_title && (
              <h2 className="text-lg font-semibold text-white">{lead.post_title}</h2>
            )}
            <p className="text-gray-300 text-sm leading-relaxed">{lead.post_body}</p>

            <div className="flex flex-wrap gap-2">
              {lead.matched_keywords.map(kw => (
                <span key={kw} className="px-2 py-0.5 bg-purple-900/40 border border-purple-700/50 rounded-full text-xs text-purple-300">
                  #{kw}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-800">
              <span>👤 {lead.author_username ?? 'Unknown'}</span>
              {lead.posted_at && <span>🕐 {new Date(lead.posted_at).toLocaleString()}</span>}
              {lead.is_competitor && <span className="text-orange-400">⚠️ Competitor: {lead.competitor_name}</span>}
            </div>

            <a href={lead.post_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 transition">
              View Original Post ↗
            </a>
          </div>

          {lead.ai_summary && (
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
              <p className="text-xs text-gray-500 mb-1">AI Summary</p>
              <p className="text-sm text-gray-300">{lead.ai_summary}</p>
            </div>
          )}

          <div className="flex gap-2">
            {(['new', 'reviewed', 'replied', 'ignored'] as const).map(s => (
              <button key={s} onClick={() => updateStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border capitalize transition ${
                  lead.status === s
                    ? 'bg-purple-600 border-purple-500 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                }`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Right: AI Reply */}
        <div className="lg:col-span-2">
          <AIReplyPanel lead={lead} />
        </div>
      </div>
    </div>
  );
}
