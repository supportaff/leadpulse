'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Megaphone, BarChart2, CreditCard, Settings, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/leads', label: 'Leads', icon: Users },
  { href: '/campaigns', label: 'Campaigns', icon: Megaphone },
  { href: '/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/billing', label: 'Billing', icon: CreditCard },
  { href: '/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-60 bg-black border-r border-white/8 flex flex-col py-6 transition-transform duration-200',
        'md:static md:translate-x-0 md:flex',
        open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}>
        <div className="px-5 mb-8 flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-white tracking-tight">LeadPulse</span>
            <p className="text-xs text-gray-600 mt-0.5">Reddit Lead Intelligence</p>
          </div>
          {onClose && (
            <button onClick={onClose} className="md:hidden text-gray-500 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <nav className="flex-1 space-y-0.5 px-3">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                pathname === href || pathname.startsWith(href + '/')
                  ? 'bg-white text-black'
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-4 pt-4 border-t border-white/8">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-xs font-bold text-black shrink-0">A</div>
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-white truncate">Arun Kumar</p>
              <p className="text-xs text-gray-600">Growth plan</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
