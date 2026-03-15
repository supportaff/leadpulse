'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, Megaphone, BarChart2, CreditCard, Settings, X, LogOut, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser, useClerk } from '@clerk/nextjs';
import { useState, useMemo } from 'react';

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/leads', label: 'Leads', icon: Users },
  { href: '/campaigns', label: 'Campaigns', icon: Megaphone },
  { href: '/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/billing', label: 'Billing', icon: CreditCard },
  { href: '/settings', label: 'Settings', icon: Settings },
];

function randomToken() {
  return Math.random().toString(36).slice(2, 9).toUpperCase(); // e.g. "X4K9MWQ"
}

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const router = useRouter();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  // Generate once per modal open
  const token = useMemo(() => randomToken(), [showDeleteModal]); // eslint-disable-line

  const name    = user?.fullName || user?.firstName || user?.username || 'User';
  const initial = name.charAt(0).toUpperCase();

  const handleLogout = () => signOut(() => router.push('/'));

  const openModal = () => { setInputVal(''); setError(''); setShowDeleteModal(true); };
  const closeModal = () => { setShowDeleteModal(false); setInputVal(''); setError(''); };

  const handleDelete = async () => {
    if (inputVal.trim() !== token) {
      setError('Code does not match. Please try again.');
      return;
    }
    setDeleting(true);
    try {
      await user?.delete();
      router.push('/');
    } catch (e) {
      console.error('Delete failed', e);
      setError('Failed to delete account. Please try again.');
      setDeleting(false);
    }
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={onClose} />
      )}

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-[#0a0a0a] border border-red-500/20 rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                <Trash2 className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Delete account</p>
                <p className="text-gray-500 text-xs">This is permanent and cannot be undone.</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-1">
              <p className="text-xs text-gray-400">Type this code to confirm deletion:</p>
              <p className="text-xl font-mono font-bold text-red-400 tracking-widest">{token}</p>
            </div>

            <input
              type="text"
              value={inputVal}
              onChange={e => { setInputVal(e.target.value.toUpperCase()); setError(''); }}
              placeholder="Enter code above"
              className="w-full bg-white/5 border border-white/10 text-white text-sm font-mono rounded-xl px-4 py-2.5 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-red-500/50 tracking-widest"
              autoFocus
            />

            {error && <p className="text-xs text-red-400">{error}</p>}

            <div className="flex gap-2 pt-1">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 text-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting || inputVal.trim() !== token}
                className="flex-1 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 text-sm font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {deleting ? 'Deleting...' : 'Delete forever'}
              </button>
            </div>
          </div>
        </div>
      )}

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
            <Link key={href} href={href} onClick={onClose}
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

        <div className="px-4 pt-4 border-t border-white/8 space-y-1">
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

          <button onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition text-sm">
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Log out</span>
          </button>

          <button onClick={openModal}
            className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/5 transition text-sm">
            <Trash2 className="w-4 h-4 shrink-0" />
            <span>Delete account</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
