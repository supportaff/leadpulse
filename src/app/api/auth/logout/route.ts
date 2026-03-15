import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ success: true });
  // Clear all auth cookies
  res.cookies.delete('auth_session');
  res.cookies.delete('user_name');
  res.cookies.delete('user_email');
  // Also clear old dummy cookie in case it exists
  res.cookies.delete('dummy_auth');
  return res;
}
