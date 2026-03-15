import { dummyStats, dummyLeads } from '@/lib/dummy-data';
import { TrendingUp, Users, MessageSquare, AlertTriangle } from 'lucide-react';

const dailyLeads = [
  { date: 'Mon', count: 18 },
  { date: 'Tue', count: 24 },
  { date: 'Wed', count: 19 },
  { date: 'Thu', count: 31 },
  { date: 'Fri', count: 27 },
  { date: 'Sat', count: 16 },
  { date: 'Sun', count: 12 },
];

const maxCount = Math.max(...dailyLeads.map(d => d.count));

export default function AnalyticsPage() {
  const highIntent = dummyLeads.filter(l => l.intent_level === 'high').length;
  const mediumIntent = dummyLeads.filter(l => l.intent_level === 'medium').length;
  const lowIntent = dummyLeads.filter(l => l.intent_level === 'low').length;
  const total = dummyStats.totalLeads;

  const cards = [
    { label: 'Total Leads',          value: total,                          icon: Users,         change: '+12 this week' },
    { label: 'High Intent',          value: dummyStats.highIntent,          icon: TrendingUp,    change: '43% of total'  },
    { label: 'Replied',              value: dummyStats.replied,             icon: MessageSquare, change: '19% reply rate' },
    { label: 'Competitor Mentions',  value: dummyStats.competitorMentions,  icon: AlertTriangle, change: 'HubSpot, Apollo' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-gray-400 text-sm mt-1">Performance overview — last 30 days</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, change }) => (
          <div key={label} className="bg-white/[0.02] border border-white/8 rounded-2xl p-5 hover:border-white/20 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
              <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                <Icon className="w-4 h-4 text-white/50" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{value.toLocaleString()}</p>
            <p className="text-xs text-gray-600">{change}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Daily leads bar chart */}
        <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-6">Leads this week</h3>
          <div className="flex items-end gap-3 h-32">
            {dailyLeads.map(({ date, count }) => (
              <div key={date} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-gray-600">{count}</span>
                <div
                  className="w-full bg-white/80 rounded-sm"
                  style={{ height: `${(count / maxCount) * 100}%` }}
                />
                <span className="text-xs text-gray-500">{date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Intent distribution */}
        <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-6">Intent distribution</h3>
          <div className="space-y-4">
            {[
              { label: 'High Intent',   value: dummyStats.highIntent, total, bar: 'bg-white'      },
              { label: 'Medium Intent', value: mediumIntent,           total, bar: 'bg-white/40'  },
              { label: 'Low Intent',    value: lowIntent,              total, bar: 'bg-white/15'  },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-400">{item.label}</span>
                  <span className="text-gray-500">{item.value} &middot; {total > 0 ? Math.round((item.value / total) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5">
                  <div
                    className={`${item.bar} h-1.5 rounded-full`}
                    style={{ width: total > 0 ? `${(item.value / total) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top keywords */}
        <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Top keywords</h3>
          <div className="space-y-3">
            {dummyStats.topKeywords.map((kw, i) => (
              <div key={kw.keyword} className="flex items-center gap-3">
                <span className="text-xs text-gray-700 w-4 shrink-0">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-300">{kw.keyword}</span>
                    <span className="text-gray-500">{kw.count}</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full">
                    <div className="h-1 bg-white/50 rounded-full" style={{ width: `${(kw.count / 34) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform + subreddit breakdown */}
        <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Platform breakdown</h3>
          <div className="flex items-center gap-6 mb-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{dummyStats.redditLeads}</p>
              <p className="text-xs text-gray-500 mt-1">Reddit leads</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-700">0</p>
              <p className="text-xs text-gray-600 mt-1">Other</p>
            </div>
          </div>
          <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-3">Top subreddits</h4>
          <div className="space-y-2">
            {[['r/SaaS', 34], ['r/entrepreneur', 28], ['r/startups', 21], ['r/marketing', 18], ['r/smallbusiness', 12]].map(([sub, count]) => (
              <div key={sub} className="flex justify-between text-xs">
                <span className="text-gray-400">{sub}</span>
                <span className="text-gray-600">{count} leads</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
