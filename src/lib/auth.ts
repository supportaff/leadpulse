// Dummy auth — replace with real auth when needed
export const DUMMY_USER_ID = 'dummy_user_001';

export function getDummyUserId(): string {
  return DUMMY_USER_ID;
}

export function getDummyUser() {
  return {
    id: DUMMY_USER_ID,
    email: 'admin@leadpulse.io',
    full_name: 'Admin User',
    plan: 'pro' as const,
  };
}
