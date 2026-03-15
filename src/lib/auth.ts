import { cookies } from 'next/headers';

export async function getSessionUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('auth_session')?.value;
  const name = cookieStore.get('user_name')?.value || 'User';
  const email = cookieStore.get('user_email')?.value || '';

  if (!userId) return null;
  return { userId, name, email };
}

// Stub used by all API routes until real DB auth is wired
// Returns a consistent dummy user ID for development
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
