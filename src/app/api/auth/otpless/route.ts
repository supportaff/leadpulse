import { NextResponse } from 'next/server';

// OTPless removed — auth is now handled by Clerk
export async function POST() {
  return NextResponse.json({ error: 'OTPless removed. Use Clerk.' }, { status: 410 });
}
