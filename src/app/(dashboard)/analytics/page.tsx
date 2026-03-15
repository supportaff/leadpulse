'use client';
import { useEffect, useState } from 'react';

interface AnalyticsData {
  totalLeads: number;
  highIntent: number;
  mediumIntent: number;
  lowIntent: number;
  replied: number;
  redditLeads: number;
  twitterLeads: number;
  competitorMentions: number;
  topKeywords: { keyword: string; count: number }[];
  dailyLeads: { date: string; count: number }[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then(r => r.json())
      .then(d => setData(d))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!data) return <div className="text-gray-400 py-20 text-center">Failed to load analytics.</div>;

  const cards = [
    { label: 'Total Leads', value: data.totalLeads, icon: '📡', color: 'text-white' },
    { label: 'High Intent', value: data.highIntent, icon: '🔴', color: 'text-red-400' },
    { label: 'Replied', value: data.replied, icon: '✅', color: 'text-green-400' },
    { label: 'Competitor Mentions', value: data.competitorMentions, icon: '⚠️', color: 'text-orange-400' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-gray-400 text-sm mt-1">Performance overview for this month</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(c => (
          <div key={c.label} className="rounded-xl border border-gray-800 bg-gray-900 p-5">
            <div className="text-2xl mb-1">{c.icon}</div>
            <div className={`text-3xl font-bold ${c.color}`}>{c.value}</div>
            <div className="text-xs text-gray-500 mt-1">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Intent Distribution</h3>
          <div className="space-y-3">
            {[
              { label: 'High Intent', value: data.highIntent, total: data.totalLeads, color: 'bg-red-500' },
              { label: 'Medium Intent', value: data.mediumIntent, total: data.totalLeads, color: 'bg-yellow-500' },
              { label: 'Low Intent', value: data.lowIntent, total: data.totalLeads, color: 'bg-green-500' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all`}
                    style={{ width: item.total > 0 ? `${Math.round((item.value / item.total) * 100)}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Top Keywords</h3>
          <div className="space-y-2">
            {data.topKeywords.length === 0 ? (
              <p className="text-gray-500 text-sm">No keyword data yet.</p>
            ) : data.topKeywords.map((kw, i) => (
              <div key={kw.keyword} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 w-4">{i + 1}.</span>
                  <span className="text-sm text-gray-300">{kw.keyword}</span>
                </div>
                <span className="text-xs font-semibold text-purple-400">{kw.count} leads</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Platform Breakdown</h3>
        <div className="flex gap-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🟠</span>
            <div>
              <div className="text-xl font-bold text-white">{data.redditLeads}</div>
              <div className="text-xs text-gray-500">Reddit Leads</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">𝕏</span>
            <div>
              <div className="text-xl font-bold text-white">{data.twitterLeads}</div>
              <div className="text-xs text-gray-500">Twitter Leads</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
