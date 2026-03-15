import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/leads(.*)',
  '/campaigns(.*)',
  '/analytics(.*)',
  '/billing(.*)',
  '/settings(.*)',
]);

// These routes must stay public — called by external services (PayU, etc.)
const isPublicApiRoute = createRouteMatcher([
  '/api/webhooks(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicApiRoute(req)) return; // skip auth entirely
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
