import { auth, currentUser } from '@clerk/nextjs/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

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

// Returns real Clerk userId from session — throws if not authenticated
export async function requireUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');
  return userId;
}

// Upserts user into Supabase users table from Clerk session
export async function syncUserToSupabase() {
  const { userId } = await auth();
  if (!userId) return null;
  const user = await currentUser();
  if (!user) return null;

  const email = user.emailAddresses?.[0]?.emailAddress || '';
  const name = user.fullName || user.firstName || 'User';

  const supabase = createSupabaseServerClient();
  await supabase.from('users').upsert(
    { id: userId, email, name },
    { onConflict: 'id' }
  );
  return { userId, email, name };
}
