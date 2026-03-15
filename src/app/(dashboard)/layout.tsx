import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TopBar } from '@/components/dashboard/TopBar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const auth = cookieStore.get('dummy_auth')?.value;
  if (auth !== 'authenticated') redirect('/sign-in');

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
