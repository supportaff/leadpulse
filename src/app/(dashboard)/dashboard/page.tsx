'use client';
import { useLeads } from '@/hooks/useLeads';
import { useCampaigns } from '@/hooks/useCampaigns';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { LeadCard } from '@/components/dashboard/LeadCard';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import Link from 'next/link';

export default function DashboardPage() {
  const { leads, total, loading } = useLeads({ limit: 10, intent: 'high' });
  const { campaigns } = useCampaigns();

  const stats = {
    totalLeads: total,
    highIntent: leads.filter(l => l.intent_level === 'high').length,
    replied: leads.filter(l => l.status === 'replied').length,
    campaigns: campaigns.length,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Real-time buyer intent signals from Reddit &amp; X</p>
      </div>

      <StatsCards stats={stats} />

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent High-Intent Leads</h2>
          <Link href="/leads" className="text-sm text-purple-400 hover:text-purple-300 transition">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="py-12"><LoadingSpinner /></div>
        ) : leads.length === 0 ? (
          <EmptyState
            icon="📡"
            title="No leads detected yet"
            description="Create a campaign with keywords to start discovering buyer-intent posts from Reddit and X."
            action={
              <Link href="/campaigns"
                className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition">
                Create Campaign
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {leads.map(lead => <LeadCard key={lead.id} lead={lead} />)}
          </div>
        )}
      </div>
    </div>
  );
}
