'use client';
import { Bell, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function TopBar() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  return (
    <header className="h-14 border-b border-gray-800 bg-gray-900 flex items-center justify-end px-6 gap-4">
      <button className="text-gray-400 hover:text-white transition-colors">
        <Bell className="w-5 h-5" />
      </button>
      <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </header>
  );
}

export default TopBar;
