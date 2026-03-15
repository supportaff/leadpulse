import { NextResponse } from 'next/server';

// Clerk webhook disabled — Clerk integration removed
export async function POST() {
  return NextResponse.json({ received: true });
}
