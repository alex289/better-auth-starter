import { SecuritySettings } from '@/components/security-settings';
import { auth } from '@/lib/auth';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Security',
};

export default async function Page() {
  const currentSession = await auth.api.getSession({
    headers: await headers(),
  });

  if (!currentSession) {
    redirect('/sign-in');
  }

  const passkeys = await auth.api.listPasskeys({
    headers: await headers(),
  });
  const sessions = await auth.api.listSessions({
    headers: await headers(),
  });

  return (
    <div className="flex-1 p-6">
      <SecuritySettings
        passkeys={passkeys}
        sessions={sessions}
        currentSession={currentSession.session}
        twoFactorEnabled={currentSession.user.twoFactorEnabled ?? false}
      />
    </div>
  );
}
