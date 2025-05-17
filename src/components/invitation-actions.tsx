'use client';

import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Spinner } from './spinner';
import { Button } from './ui/button';

export default function InvitationActions({
  invitationId,
  organizationId,
}: {
  invitationId: string;
  organizationId: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<'reject' | 'accept' | null>(null);

  async function rejectInvitation() {
    setIsLoading('reject');

    const { error } = await authClient.organization.rejectInvitation({
      invitationId,
    });

    setIsLoading(null);

    if (error) {
      toast.error('Failed to reject invitation', {
        description: error.message,
      });
      return;
    }

    toast.success('Successfully rejected invitation');
    router.push('/dashboard');
  }

  async function acceptInvitation() {
    setIsLoading('accept');

    const { error } = await authClient.organization.acceptInvitation({
      invitationId,
    });

    setIsLoading(null);

    if (error) {
      toast.error('Failed to accept invitation', {
        description: error.message,
      });
      return;
    }

    await authClient.organization.setActive({
      organizationId,
    });

    toast.success('Successfully accept invitation');
    router.push('/dashboard');
  }
  return (
    <>
      <Button
        variant="outline"
        className="flex-grow"
        disabled={isLoading !== null}
        onClick={async () => await rejectInvitation()}>
        {isLoading === 'reject' ? (
          <Spinner className="text-white dark:text-black" />
        ) : null}
        Reject
      </Button>
      <Button
        className="flex-grow"
        disabled={isLoading !== null}
        onClick={async () => await acceptInvitation()}>
        {isLoading === 'accept' ? (
          <Spinner className="text-white dark:text-black" />
        ) : null}
        Accept Invitation
      </Button>
    </>
  );
}
