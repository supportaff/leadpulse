import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_ROUTES = ['/', '/pricing', '/features', '/sign-in', '/sign-up', '/api/webhooks', '/api/cron'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow public routes, static files, api routes
  const isPublic = PUBLIC_ROUTES.some(r => pathname.startsWith(r))
    || pathname.startsWith('/_next')
    || pathname.startsWith('/api');

  if (isPublic) return NextResponse.next();

  // Check dummy auth cookie
  const auth = req.cookies.get('dummy_auth')?.value;
  if (auth === 'authenticated') return NextResponse.next();

  // Redirect to sign-in
  const signIn = new URL('/sign-in', req.url);
  signIn.searchParams.set('redirect', pathname);
  return NextResponse.redirect(signIn);
}

export const config = {
  matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)', '/(api|trpc)(.*)'],
};
