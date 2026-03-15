import { NextRequest, NextResponse } from 'next/server';

const PROTECTED = ['/dashboard', '/leads', '/campaigns', '/analytics', '/billing', '/settings'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED.some(p => pathname === p || pathname.startsWith(p + '/'));
  if (!isProtected) return NextResponse.next();

  // Accept either the new real cookie or old dummy cookie (during transition)
  const session = req.cookies.get('auth_session')?.value;
  const dummy = req.cookies.get('dummy_auth')?.value;

  if (!session && dummy !== 'authenticated') {
    const loginUrl = new URL('/sign-in', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/leads/:path*', '/campaigns/:path*', '/analytics/:path*', '/billing/:path*', '/settings/:path*'],
};
