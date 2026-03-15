'use client';
import { Bell, LogOut, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TopBarProps {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  return (
    <header className="h-14 border-b border-white/8 bg-black flex items-center justify-between px-4 sm:px-6 gap-3">
      <button
        onClick={onMenuClick}
        className="md:hidden text-gray-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
      >
        <Menu className="w-5 h-5" />
      </button>
      <div className="flex-1" />
      <button className="text-gray-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5">
        <Bell className="w-4 h-4" />
      </button>
      <div className="w-px h-4 bg-white/10" />
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm px-2 sm:px-3 py-1.5 rounded-lg hover:bg-white/5"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </header>
  );
}

export default TopBar;
