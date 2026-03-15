'use client';
import Link from 'next/link';
import { ExternalLink, Clock, MessageSquare, AlertTriangle, Lock, Unlock, Loader2 } from 'lucide-react';
import { IntentBadge } from './IntentBadge';
import type { Lead } from '@/types/lead';
import { useState } from 'react';

export function LeadCard({ lead: initialLead, showReplyButton = false }: { lead: Lead; showReplyButton?: boolean }) {
  const [lead, setLead] = useState(initialLead);
  const [unlocking, setUnlocking] = useState(false);
  const [error, setError] = useState('');

  const handleUnlock = async () => {
    setUnlocking(true);
    setError('');
    try {
      const res = await fetch('/api/wallet/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: lead.id }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to unlock'); return; }
      setLead(l => ({ ...l, is_unlocked: true }));
    } catch {
      setError('Network error. Try again.');
    } finally {
      setUnlocking(false);
    }
  };

  return (
    <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-5 hover:border-white/20 transition-colors group">
      <div className="flex items-start justify-between gap-3 mb-2">
        <Link
          href={`/leads/${lead.id}`}
          className="font-medium text-white hover:text-gray-300 transition-colors line-clamp-2 text-sm leading-snug"
        >
          {lead.post_title ?? 'Untitled post'}
        </Link>
        <IntentBadge level={lead.intent_level} score={lead.intent_score} />
      </div>

      {lead.post_body && (
        <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">{lead.post_body}</p>
      )}

      {lead.ai_summary && (
        <p className="text-xs text-gray-400 bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 mb-3 italic">
          🤖 {lead.ai_summary}
        </p>
      )}

      {/* Unlock section */}
      {!lead.is_unlocked ? (
        <div className="mb-3">
          <div className="flex items-center justify-between bg-white/[0.02] border border-white/8 rounded-xl px-4 py-2.5">
            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <Lock className="w-3.5 h-3.5" />
              <span>Contact details hidden · 1 credit to unlock</span>
            </div>
            <button
              onClick={handleUnlock}
              disabled={unlocking}
              className="flex items-center gap-1.5 text-xs bg-white text-black font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
            >
              {unlocking ? <Loader2 className="w-3 h-3 animate-spin" /> : <Unlock className="w-3 h-3" />}
              {unlocking ? 'Unlocking...' : 'Unlock Lead'}
            </button>
          </div>
          {error && <p className="text-xs text-red-400 mt-1 px-1">{error}</p>}
        </div>
      ) : (
        lead.reddit_username && (
          <div className="mb-3 flex items-center gap-2 bg-green-500/5 border border-green-500/15 rounded-xl px-4 py-2.5">
            <Unlock className="w-3.5 h-3.5 text-green-400" />
            <span className="text-xs text-green-400 font-medium">u/{lead.reddit_username}</span>
            {lead.post_url && (
              <a href={lead.post_url} target="_blank" rel="noopener noreferrer"
                className="ml-auto text-gray-600 hover:text-white transition">
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs bg-white/5 border border-white/10 text-gray-400 px-2 py-0.5 rounded-full">r/{lead.subreddit}</span>
          {lead.is_competitor && (
            <span className="text-xs bg-white/5 border border-white/10 text-yellow-500 px-2 py-0.5 rounded-full flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />{lead.competitor_name}
            </span>
          )}
          {lead.matched_keywords?.slice(0, 2).map(kw => (
            <span key={kw} className="text-xs bg-white/5 text-gray-500 px-2 py-0.5 rounded-full">{kw}</span>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {showReplyButton && (
            <Link href={`/leads/${lead.id}`}
              className="flex items-center gap-1 text-xs text-white/60 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg">
              <MessageSquare className="w-3 h-3" /> Reply
            </Link>
          )}
          <span className="flex items-center gap-1 text-xs text-gray-600">
            <Clock className="w-3 h-3" />
            {new Date(lead.detected_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
}

export default LeadCard;
