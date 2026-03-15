'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, Megaphone, BarChart2, CreditCard, Settings, X, LogOut, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser, useClerk } from '@clerk/nextjs';
import { useState } from 'react';

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
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const name    = user?.fullName || user?.firstName || user?.username || 'User';
  const initial = name.charAt(0).toUpperCase();

  const handleLogout = () => signOut(() => router.push('/'));

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    try {
      await user?.delete();
      router.push('/');
    } catch (e) {
      console.error('Delete failed', e);
    }
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={onClose} />
      )}

      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-60 bg-black border-r border-white/8 flex flex-col py-6 transition-transform duration-200',
        'md:static md:translate-x-0 md:flex',
        open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}>
        {/* Logo */}
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

        {/* Nav */}
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

        {/* Bottom user section */}
        <div className="px-4 pt-4 border-t border-white/8 space-y-1">
          {/* User row */}
          <button
            onClick={() => openUserProfile()}
            className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/5 transition group text-left"
          >
            {user?.imageUrl
              ? <img src={user.imageUrl} className="w-7 h-7 rounded-full object-cover shrink-0" alt={name} />
              : <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-xs font-bold text-black shrink-0">{initial}</div>
            }
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-medium text-white truncate group-hover:text-gray-200">{name}</p>
              <p className="text-xs text-gray-600 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition text-sm"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Log out</span>
          </button>

          {/* Delete account */}
          <button
            onClick={handleDelete}
            className={cn(
              'w-full flex items-center gap-2.5 px-2 py-2 rounded-lg transition text-sm',
              confirmDelete
                ? 'text-red-400 bg-red-500/10 hover:bg-red-500/20'
                : 'text-gray-600 hover:text-red-400 hover:bg-red-500/5'
            )}
          >
            <Trash2 className="w-4 h-4 shrink-0" />
            <span>{confirmDelete ? 'Tap again to confirm' : 'Delete account'}</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
