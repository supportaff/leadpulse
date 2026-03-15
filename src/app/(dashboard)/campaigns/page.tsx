'use client';
import { useState } from 'react';
import { useCampaigns } from '@/hooks/useCampaigns';
import { CampaignForm } from '@/components/dashboard/CampaignForm';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { Campaign } from '@/types/campaign';

export default function CampaignsPage() {
  const { campaigns, loading, createCampaign, deleteCampaign } = useCampaigns();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Campaigns</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your keyword monitoring campaigns</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition">
          + New Campaign
        </button>
      </div>

      {showForm && (
        <CampaignForm onSubmit={createCampaign} onClose={() => setShowForm(false)} />
      )}

      {loading ? (
        <div className="py-12"><LoadingSpinner /></div>
      ) : campaigns.length === 0 ? (
        <EmptyState
          icon="🎯"
          title="No campaigns yet"
          description="Create your first campaign to start monitoring Reddit and X for buyer-intent posts."
          action={
            <button onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition">
              Create Campaign
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {campaigns.map(campaign => (
            <CampaignCard key={campaign.id} campaign={campaign} onDelete={deleteCampaign} />
          ))}
        </div>
      )}
    </div>
  );
}

function CampaignCard({ campaign, onDelete }: { campaign: Campaign; onDelete: (id: string) => void }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-white">{campaign.name}</h3>
          {campaign.description && <p className="text-gray-400 text-xs mt-0.5">{campaign.description}</p>}
        </div>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          campaign.is_active ? 'bg-green-900/50 text-green-400 border border-green-700/50' : 'bg-gray-800 text-gray-500'
        }`}>
          {campaign.is_active ? '● Active' : 'Paused'}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {campaign.keywords.slice(0, 5).map(kw => (
          <span key={kw} className="px-2 py-0.5 bg-gray-800 border border-gray-700 rounded-full text-xs text-gray-300">
            {kw}
          </span>
        ))}
        {campaign.keywords.length > 5 && (
          <span className="px-2 py-0.5 bg-gray-800 border border-gray-700 rounded-full text-xs text-gray-500">
            +{campaign.keywords.length - 5} more
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-500">
        {campaign.platforms.map(p => (
          <span key={p}>{p === 'reddit' ? '🟠 Reddit' : '𝕏 Twitter'}</span>
        ))}
      </div>

      <div className="flex gap-2 pt-2 border-t border-gray-800">
        <button onClick={() => onDelete(campaign.id)}
          className="text-xs text-red-400 hover:text-red-300 transition">Delete</button>
      </div>
    </div>
  );
}
