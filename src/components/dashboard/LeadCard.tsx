import Link from 'next/link';
import { ExternalLink, Clock, MessageSquare } from 'lucide-react';
import { IntentBadge } from './IntentBadge';
import type { Lead } from '@/types/lead';

interface LeadCardProps {
  lead: Lead;
  showReplyButton?: boolean;
}

export function LeadCard({ lead, showReplyButton = false }: LeadCardProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-3">
        <Link
          href={`/leads/${lead.id}`}
          className="font-medium text-white hover:text-blue-400 transition-colors line-clamp-2"
        >
          {lead.post_title ?? 'Untitled post'}
        </Link>
        <IntentBadge level={lead.intent_level} score={lead.intent_score} />
      </div>

      {lead.post_body && (
        <p className="text-sm text-gray-400 line-clamp-2 mb-3">{lead.post_body}</p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            lead.platform === 'reddit'
              ? 'bg-orange-500/20 text-orange-400'
              : 'bg-sky-500/20 text-sky-400'
          }`}>
            {lead.platform === 'reddit' ? 'Reddit' : 'X / Twitter'}
          </span>
          {lead.matched_keywords?.slice(0, 2).map(kw => (
            <span key={kw} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
              {kw}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {showReplyButton && (
            <Link
              href={`/leads/${lead.id}`}
              className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
            >
              <MessageSquare className="w-3 h-3" />
              Reply
            </Link>
          )}
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            {new Date(lead.detected_at).toLocaleDateString()}
          </span>
          {lead.post_url && (
            <a
              href={lead.post_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default LeadCard;
