import { auth, currentUser } from '@clerk/nextjs/server';

export async function getSessionUser() {
  const { userId } = await auth();
  if (!userId) return null;
  const user = await currentUser();
  return {
    userId,
    name: user?.fullName || user?.firstName || 'User',
    email: user?.emailAddresses?.[0]?.emailAddress || '',
  };
}

// Stub used by all API routes until real DB auth is wired
export function getDummyUserId(): string {
  return 'dummy_user_001';
}

// Legacy dummy user — used by settings/dashboard until DB is wired
export function getDummyUser() {
  return {
    id: 'dummy_user_001',
    full_name: 'Arun Kumar',
    email: 'arun@example.com',
    plan: 'growth',
  };
}
