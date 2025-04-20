import { SettingsContent } from '@/components/settings-content';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect('/sign-in');
  }
  return (
    <div className="flex-1 p-6">
      <SettingsContent user={session.user} />
    </div>
  );
}
