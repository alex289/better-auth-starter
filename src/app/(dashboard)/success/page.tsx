import { SuccessContent } from '@/components/success-content';
import { auth } from '@/lib/auth';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Success',
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ checkout_id?: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect('/sign-in');
  }

  const params = await searchParams;

  return (
    <div className="flex-1 p-6">
      <SuccessContent checkoutId={params.checkout_id} />
    </div>
  );
}
