import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, userId, name, email, mobile } = body;

    if (!token || !userId) {
      return NextResponse.json({ error: 'Missing token or userId' }, { status: 400 });
    }

    const clientId = process.env.OTPLESS_CLIENT_ID;
    const clientSecret = process.env.OTPLESS_CLIENT_SECRET;

    // ── Verify token with OTPless only if credentials are configured ──
    if (clientId && clientSecret) {
      try {
        const verifyRes = await fetch('https://auth.otpless.app/auth/v1/validate/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'clientId': clientId,
            'clientSecret': clientSecret,
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
      } catch (verifyErr) {
        console.error('OTPless verify error:', verifyErr);
        return NextResponse.json({ error: 'Verification service unavailable' }, { status: 503 });
      }
    } else {
      // No credentials configured — trust OTPless client-side token in dev/preview
      console.warn('OTPLESS_CLIENT_ID / OTPLESS_CLIENT_SECRET not set — skipping server-side verification');
    }

    // ── Set session cookies ─────────────────────────────────────────────
    const res = NextResponse.json({ success: true });
    const cookieOpts = {
      httpOnly: false, // needs to be readable by middleware check? No — keep false for user_name/email
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    };

    res.cookies.set('auth_session', userId, { ...cookieOpts, httpOnly: true });
    res.cookies.set('user_name', name || 'User', cookieOpts);
    res.cookies.set('user_email', email || mobile || '', cookieOpts);

    return res;
  } catch (err) {
    console.error('OTPless route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
