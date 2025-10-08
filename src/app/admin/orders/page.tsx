import AdminNavbar from '@/components/admin-navbar';
import { OrdersContent } from '@/components/orders-content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/auth';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Orders - Admin',
};

export default async function OrdersPage() {
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
          <CardTitle className="text-2xl">Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <OrdersContent />
        </CardContent>
      </Card>
    </>
  );
}
