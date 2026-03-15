'use client';
import { useState } from 'react';
import { useLeads } from '@/hooks/useLeads';
import { LeadCard } from '@/components/dashboard/LeadCard';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';

const INTENT_OPTIONS = ['', 'high', 'medium', 'low'] as const;
const PLATFORM_OPTIONS = ['', 'reddit', 'twitter'] as const;
const STATUS_OPTIONS = ['', 'new', 'reviewed', 'replied', 'ignored'] as const;

export default function LeadsPage() {
  const [intent, setIntent] = useState('');
  const [platform, setPlatform] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const { leads, total, loading } = useLeads({ intent, platform, status, page, limit: 20 });
  const totalPages = Math.ceil(total / 20);

  const selectClass = "bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">All Leads</h1>
          <p className="text-gray-400 text-sm mt-1">{total} total leads detected</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select value={intent} onChange={e => { setIntent(e.target.value); setPage(1); }} className={selectClass}>
            <option value="">All Intent</option>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
          <select value={platform} onChange={e => { setPlatform(e.target.value); setPage(1); }} className={selectClass}>
            <option value="">All Platforms</option>
            <option value="reddit">🟠 Reddit</option>
            <option value="twitter">𝕏 Twitter</option>
          </select>
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className={selectClass}>
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="reviewed">Reviewed</option>
            <option value="replied">Replied</option>
            <option value="ignored">Ignored</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-16"><LoadingSpinner /></div>
      ) : leads.length === 0 ? (
        <EmptyState icon="🔍" title="No leads found" description="Try adjusting your filters or create a new campaign." />
      ) : (
        <>
          <div className="space-y-4">
            {leads.map(lead => <LeadCard key={lead.id} lead={lead} showReplyButton />)}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-4 py-2 bg-gray-800 text-gray-300 text-sm rounded-lg hover:bg-gray-700 disabled:opacity-40 transition">
                ← Previous
              </button>
              <span className="text-gray-400 text-sm">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-4 py-2 bg-gray-800 text-gray-300 text-sm rounded-lg hover:bg-gray-700 disabled:opacity-40 transition">
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
