'use client';
import { UserButton } from '@clerk/nextjs';
import { Bell } from 'lucide-react';

export function TopBar() {
  return (
    <header className="h-14 border-b border-gray-800 bg-gray-900 flex items-center justify-end px-6 gap-4">
      <button className="text-gray-400 hover:text-white transition-colors">
        <Bell className="w-5 h-5" />
      </button>
      <UserButton afterSignOutUrl="/" />
    </header>
  );
}

export default TopBar;
