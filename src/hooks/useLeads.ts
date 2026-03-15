'use client';
import { useEffect, useState } from 'react';
import { Lead } from '@/types/lead';

interface UseLeadsOptions {
  campaignId?: string;
  intent?: string;
  platform?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export function useLeads(options: UseLeadsOptions = {}) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { campaignId, intent, platform, status, page = 1, limit = 20 } = options;

  useEffect(() => {
    const params = new URLSearchParams();
    if (campaignId) params.set('campaign_id', campaignId);
    if (intent) params.set('intent', intent);
    if (platform) params.set('platform', platform);
    if (status) params.set('status', status);
    params.set('page', String(page));
    params.set('limit', String(limit));

    setLoading(true);
    fetch(`/api/leads?${params.toString()}`)
      .then(r => r.json())
      .then(data => {
        setLeads(data.leads ?? []);
        setTotal(data.total ?? 0);
      })
      .catch(() => setError('Failed to load leads'))
      .finally(() => setLoading(false));
  }, [campaignId, intent, platform, status, page, limit]);

  return { leads, total, loading, error };
}
