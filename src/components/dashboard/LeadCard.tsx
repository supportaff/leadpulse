import Link from 'next/link';
import { ExternalLink, Clock, MessageSquare, AlertTriangle } from 'lucide-react';
import { IntentBadge } from './IntentBadge';
import type { Lead } from '@/types/lead';

export function LeadCard({ lead, showReplyButton = false }: { lead: Lead; showReplyButton?: boolean }) {
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
          {lead.post_url && (
            <a href={lead.post_url} target="_blank" rel="noopener noreferrer"
              className="text-gray-600 hover:text-white transition-colors">
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default LeadCard;
