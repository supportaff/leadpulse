import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { token, userId, name, email, mobile } = body;

  if (!token || !userId) {
    return NextResponse.json({ error: 'Missing token or userId' }, { status: 400 });
  }

  // ── Step 1: Verify token with OTPless API ──────────────────────────────────
  const verifyRes = await fetch('https://auth.otpless.app/auth/v1/validate/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'clientId': process.env.OTPLESS_CLIENT_ID!,
      'clientSecret': process.env.OTPLESS_CLIENT_SECRET!,
    },
    body: JSON.stringify({ token }),
  });

  if (!verifyRes.ok) {
    return NextResponse.json({ error: 'Token verification failed' }, { status: 401 });
  }

  const verified = await verifyRes.json();
  if (verified.isTokenValid !== true) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  // ── Step 2: Upsert user in DB (stub — wire to MongoDB/Supabase later) ──────
  // TODO: Replace with real DB upsert
  // await db.users.upsert({ userId, name, email, mobile })
  console.log('OTPless verified user:', { userId, name, email, mobile });

  // ── Step 3: Set auth session cookie ───────────────────────────────────────
  const res = NextResponse.json({ success: true });
  res.cookies.set('auth_session', userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  // Keep name + email accessible client-side for UI display
  res.cookies.set('user_name', name || 'User', {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  res.cookies.set('user_email', email || mobile || '', {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
