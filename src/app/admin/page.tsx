import AdminNavbar from '@/components/admin-navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllOrganizations } from '@/db/queries';
import { auth } from '@/lib/auth';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminPageClient from './page.client';

export const metadata: Metadata = {
  title: 'Admin',
};

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

  const organizations = await getAllOrganizations();

  return (
    <>
      <AdminNavbar user={session.user} />

      <Card className="m-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminPageClient organizations={organizations} />
        </CardContent>
      </Card>
    </>
  );
}
