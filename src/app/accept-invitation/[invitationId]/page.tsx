import InvitationActions from '@/components/invitation-actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { auth } from '@/lib/auth';
import { getInitials } from '@/lib/utils';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Page({
  params,
}: PageProps<'/accept-invitation/[invitationId]'>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/sign-in');
  }

  const { invitationId } = await params;

  const invitation = await auth.api.getInvitation({
    headers: await headers(),
    query: {
      id: invitationId,
    },
  });

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full p-2 shadow-sm">
            <Avatar className="h-full w-full">
              <AvatarImage src={undefined} alt={invitation.organizationName} />
              <AvatarFallback>
                {getInitials(invitation.organizationName)}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-2xl">Organization Invitation</CardTitle>
          <CardDescription>
            You&apos;ve been invited to join {invitation.organizationName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
              <p className="text-sm text-slate-500">Invited by</p>
              <p className="text-medium">{invitation.inviterEmail}</p>
            </div>
          </div>
        </CardContent>
        <Separator />
        <CardFooter className="flex justify-between gap-4 p-6">
          <InvitationActions
            invitationId={invitation.id}
            organizationId={invitation.organizationId}
          />
        </CardFooter>
      </Card>
    </main>
  );
}
