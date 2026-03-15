'use client';
import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

// Mount this in dashboard layout — syncs Clerk user to Supabase on first login
export function AuthSync() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;
    // Fire and forget — syncs user row to Supabase
    fetch('/api/auth/sync', { method: 'POST' }).catch(console.error);
  }, [user?.id, isLoaded]);

  return null;
}
