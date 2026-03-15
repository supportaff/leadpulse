import { TrendingUp, Users, MessageSquare, Target } from 'lucide-react';

interface Stats { totalLeads: number; highIntent: number; replied: number; campaigns: number; }

export function StatsCards({ stats }: { stats: Stats }) {
  const items = [
    { label: 'Total Leads',  value: stats.totalLeads, icon: Users,         change: '+12 today'  },
    { label: 'High Intent',  value: stats.highIntent, icon: TrendingUp,    change: '+5 today'   },
    { label: 'Replied',      value: stats.replied,    icon: MessageSquare, change: '19% rate'   },
    { label: 'Campaigns',    value: stats.campaigns,  icon: Target,        change: 'All active' },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {items.map(({ label, value, icon: Icon, change }) => (
        <div key={label} className="bg-white/[0.02] border border-white/8 rounded-2xl p-4 sm:p-5 hover:border-white/20 transition-colors">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider leading-tight">{label}</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/60" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white mb-0.5">{value.toLocaleString()}</p>
          <p className="text-xs text-gray-600">{change}</p>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;
