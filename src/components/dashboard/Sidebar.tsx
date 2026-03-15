'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Search, Target, BarChart3, CreditCard, Settings, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/dashboard',   label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/leads',       label: 'Leads',       icon: Search },
  { href: '/campaigns',   label: 'Campaigns',   icon: Target },
  { href: '/analytics',   label: 'Analytics',   icon: BarChart3 },
  { href: '/billing',     label: 'Billing',     icon: CreditCard },
  { href: '/settings',    label: 'Settings',    icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-white">
      <div className="flex items-center gap-2 px-6 py-5 border-b">
        <Zap className="h-6 w-6 text-blue-600" />
        <span className="font-bold text-lg text-blue-600">LeadPulse</span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
              pathname === href || pathname.startsWith(href + '/')
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
