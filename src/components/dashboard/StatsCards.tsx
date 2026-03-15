import { TrendingUp, Users, MessageSquare, Target } from 'lucide-react';

interface StatsCardsProps {
  totalLeads: number;
  highIntent: number;
  replied: number;
  campaigns: number;
}

export function StatsCards({ totalLeads, highIntent, replied, campaigns }: StatsCardsProps) {
  const stats = [
    { label: 'Total Leads', value: totalLeads, icon: Users, color: 'text-blue-400' },
    { label: 'High Intent', value: highIntent, icon: TrendingUp, color: 'text-green-400' },
    { label: 'Replied', value: replied, icon: MessageSquare, color: 'text-purple-400' },
    { label: 'Campaigns', value: campaigns, icon: Target, color: 'text-orange-400' },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">{label}</span>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;
