'use client';
import { useState } from 'react';
import { LeadCard } from '@/components/dashboard/LeadCard';
import { dummyLeads } from '@/lib/dummy-data';
import type { IntentLevel, LeadStatus } from '@/types/lead';

export default function LeadsPage() {
  const [intent, setIntent] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const filtered = dummyLeads.filter(l =>
    (intent === '' || l.intent_level === intent) &&
    (status === '' || l.status === status)
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const selectClass = 'bg-white/5 border border-white/10 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-white/30';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">All Leads</h1>
          <p className="text-gray-400 text-sm mt-1">{filtered.length} leads found</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select value={intent} onChange={e => { setIntent(e.target.value); setPage(1); }} className={selectClass}>
            <option value="">All Intent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
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

      {paginated.length === 0 ? (
        <div className="py-20 text-center text-gray-600">No leads match these filters.</div>
      ) : (
        <div className="space-y-3">
          {paginated.map(lead => <LeadCard key={lead.id} lead={lead} showReplyButton />)}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 text-sm rounded-lg hover:bg-white/10 disabled:opacity-30 transition">
            ← Prev
          </button>
          <span className="text-gray-500 text-sm">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 text-sm rounded-lg hover:bg-white/10 disabled:opacity-30 transition">
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
