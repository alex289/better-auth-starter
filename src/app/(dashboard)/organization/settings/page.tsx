import { OrganizationSettingsContent } from '@/components/organization-settings-content';
import { auth } from '@/lib/auth';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Organization Settings',
};

export default async function OrganizationSettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect('/sign-in');
  }

  const organization = await auth.api.getFullOrganization({
    headers: await headers(),
  });

  const organizationUserRole = organization?.members.find(
    (member) => member.userId === session.user.id,
  )?.role;

  return (
    <div className="flex-1 p-6">
      {organization ? (
        <OrganizationSettingsContent
          organization={organization}
          activeUserRole={organizationUserRole ?? 'member'}
        />
      ) : (
        <div>Organization not found</div>
      )}
    </div>
  );
}
