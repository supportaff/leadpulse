import { cn } from '@/lib/utils'
import type { IntentLevel } from '@/types'

export default function IntentBadge({ level }: { level: IntentLevel }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold',
      level === 'high'   && 'bg-green-100 text-green-700',
      level === 'medium' && 'bg-yellow-100 text-yellow-700',
      level === 'low'    && 'bg-gray-100 text-gray-500',
    )}>
      <span className={cn(
        'h-1.5 w-1.5 rounded-full',
        level === 'high'   && 'bg-green-500',
        level === 'medium' && 'bg-yellow-400',
        level === 'low'    && 'bg-gray-400',
      )} />
      {level.charAt(0).toUpperCase() + level.slice(1)} Intent
    </span>
  )
}
