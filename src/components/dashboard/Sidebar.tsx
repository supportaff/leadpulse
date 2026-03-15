'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Megaphone, BarChart2, CreditCard, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/leads', label: 'Leads', icon: Users },
  { href: '/campaigns', label: 'Campaigns', icon: Megaphone },
  { href: '/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/billing', label: 'Billing', icon: CreditCard },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-56 shrink-0 bg-black border-r border-white/8 flex flex-col py-6">
      <div className="px-5 mb-8">
        <span className="text-xl font-bold text-white tracking-tight">LeadPulse</span>
        <p className="text-xs text-gray-600 mt-0.5">Reddit Lead Intelligence</p>
      </div>
      <nav className="flex-1 space-y-0.5 px-3">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              pathname === href || pathname.startsWith(href + '/')
                ? 'bg-white text-black'
                : 'text-gray-500 hover:text-white hover:bg-white/5'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="px-4 pt-4 border-t border-white/8">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">A</div>
          <div>
            <p className="text-xs font-medium text-white">Admin User</p>
            <p className="text-xs text-gray-600">Pro plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
