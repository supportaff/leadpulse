import { StatsCards } from '@/components/dashboard/StatsCards';
import { LeadCard } from '@/components/dashboard/LeadCard';
import { dummyLeads, dummyStats, dummyCampaigns } from '@/lib/dummy-data';
import Link from 'next/link';

export default function DashboardPage() {
  const recentLeads = dummyLeads.slice(0, 5);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">Real-time buyer intent signals from Reddit</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-white/60 bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-full whitespace-nowrap">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          Live
        </span>
      </div>

      <StatsCards stats={dummyStats} />

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-semibold text-white">Recent High-Intent Leads</h2>
            <Link href="/leads" className="text-xs text-gray-400 hover:text-white transition">View all →</Link>
          </div>
          <div className="space-y-3">
            {recentLeads.map(lead => <LeadCard key={lead.id} lead={lead} showReplyButton />)}
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-4 sm:p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Active Campaigns</h3>
            <div className="space-y-3">
              {dummyCampaigns.map(c => (
                <div key={c.id} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm text-white font-medium truncate">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.keywords.length} keywords &middot; {c.subreddits.length} subreddits</p>
                  </div>
                  <span className="w-2 h-2 bg-green-400 rounded-full shrink-0" />
                </div>
              ))}
            </div>
            <Link href="/campaigns" className="block mt-4 text-xs text-center text-gray-500 hover:text-white transition border border-white/10 rounded-lg py-2">Manage →</Link>
          </div>

          <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-4 sm:p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Top Keywords</h3>
            <div className="space-y-2.5">
              {dummyStats.topKeywords.map(({ keyword, count }) => (
                <div key={keyword}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-300 truncate mr-2">{keyword}</span>
                    <span className="text-gray-500 shrink-0">{count}</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full">
                    <div className="h-full bg-white/40 rounded-full" style={{ width: `${(count / 34) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
