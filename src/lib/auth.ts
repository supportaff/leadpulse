// Dummy auth helpers — replace with real Clerk calls when re-enabling
export function getDummyUserId(): string {
  return 'dummy_user_001';
}

export function getDummyUser() {
  return {
    id: 'dummy_user_001',
    email: 'admin@leadpulse.io',
    full_name: 'Admin User',
    plan: 'pro' as const,
  };
}
