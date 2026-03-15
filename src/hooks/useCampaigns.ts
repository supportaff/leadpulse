'use client';
import { useEffect, useState } from 'react';
import { Campaign } from '@/types/campaign';

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = () => {
    setLoading(true);
    fetch('/api/campaigns')
      .then(r => r.json())
      .then(data => setCampaigns(data.campaigns ?? []))
      .catch(() => setError('Failed to load campaigns'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCampaigns(); }, []);

  const createCampaign = async (input: Partial<Campaign>) => {
    const res = await fetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error('Failed to create campaign');
    fetchCampaigns();
    return res.json();
  };

  const deleteCampaign = async (id: string) => {
    await fetch(`/api/campaigns/${id}`, { method: 'DELETE' });
    fetchCampaigns();
  };

  return { campaigns, loading, error, createCampaign, deleteCampaign, refetch: fetchCampaigns };
}
