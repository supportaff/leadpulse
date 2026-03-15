import { NextResponse } from 'next/server';

// Logout is now handled by Clerk's <UserButton /> or signOut()
// This stub exists for backward compatibility
export async function POST() {
  return NextResponse.json({ message: 'Use Clerk signOut() on the client.' });
}
