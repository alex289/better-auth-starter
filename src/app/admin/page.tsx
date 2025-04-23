import AdminNavbar from '@/components/admin-navbar';
import CreateUserDialog from '@/components/dialogs/create-user-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminPageClient from './page.client';

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect('/sign-in');
  }

  if (!session.user.role?.includes('admin')) {
    redirect('/dashboard');
  }

  return (
    <>
      <AdminNavbar user={session.user} />

      <Card className="m-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
          <CreateUserDialog />
        </CardHeader>
        <CardContent>
          <AdminPageClient />
        </CardContent>
      </Card>
    </>
  );
}
