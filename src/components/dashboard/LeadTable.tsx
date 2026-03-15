import LeadCard from './LeadCard'
import type { Lead } from '@/types'

export default function LeadTable({ leads }: { leads: Lead[] }) {
  if (leads.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-white py-16 text-center">
        <p className="text-gray-400 text-sm">No leads found yet. Create a campaign and let LeadPulse scan for you!</p>
      </div>
    )
  }
  return (
    <div className="space-y-4">
      {leads.map((lead) => <LeadCard key={lead.id} lead={lead} />)}
    </div>
  )
}
