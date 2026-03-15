'use client';
import { useState, useEffect } from 'react';
import { LeadCard } from '@/components/dashboard/LeadCard';
import type { Lead } from '@/types/lead';
import { Loader2, SearchX, Megaphone } from 'lucide-react';
import Link from 'next/link';

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [intent, setIntent] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  useEffect(() => {
    setLoading(true);
    fetch('/api/leads')
      .then(r => r.json())
      .then(d => setLeads(Array.isArray(d) ? d : d.leads ?? []))
      .catch(() => setLeads([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = leads.filter(l =>
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
          <p className="text-gray-400 text-sm mt-1">
            {loading ? 'Loading...' : `${filtered.length} leads found`}
          </p>
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

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
        </div>
      ) : paginated.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4 text-center">
          {leads.length === 0 ? (
            <>
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Megaphone className="w-6 h-6 text-gray-500" />
              </div>
              <div>
                <p className="text-white font-semibold">No leads yet</p>
                <p className="text-gray-500 text-sm mt-1">Create a campaign and run a scan to start finding leads.</p>
              </div>
              <Link href="/campaigns"
                className="bg-white text-black text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-100 transition">
                Create Campaign
              </Link>
            </>
          ) : (
            <>
              <SearchX className="w-8 h-8 text-gray-600" />
              <p className="text-gray-500 text-sm">No leads match these filters.</p>
            </>
          )}
        </div>
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
