import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/');
  }
  return (
    <div className="flex h-screen">
      <div className="m-auto max-w-sm">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
          Dashboard
        </h1>
      </div>
    </div>
  );
}
