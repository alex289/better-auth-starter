import { ApiKeysSettings } from '@/components/api-keys-settings';
import { auth } from '@/lib/auth';
import { Metadata } from 'next';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: 'API Keys',
};

export default async function Page() {
  const apiKeys = await auth.api.listApiKeys({
    headers: await headers(),
  });
  return (
    <div className="flex-1 p-6">
      <ApiKeysSettings apiKeys={apiKeys} />
    </div>
  );
}
