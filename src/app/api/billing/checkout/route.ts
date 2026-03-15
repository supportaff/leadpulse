import { NextResponse } from 'next/server';

// Checkout via plans removed — LeadPulse now uses wallet top-up model
// Use /api/billing/topup instead
export async function POST() {
  return NextResponse.json(
    { error: 'Plan checkout removed. Use /api/billing/topup with a packId.' },
    { status: 410 }
  );
}
