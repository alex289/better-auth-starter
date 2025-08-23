'use client';

import { Spinner } from '@/components/spinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { authClient } from '@/lib/auth-client';
import { getInitials } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import { Dialog as RadixDialog } from 'radix-ui';
import { useState } from 'react';
import { toast } from 'sonner';

export default function UserOrganisationSettingsContent() {
  const { data: organizations, refetch } = authClient.useListOrganizations();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function leaveOrganization(organizationId: string) {
    setIsLoading(true);

    const { error } = await authClient.organization.leave({
      organizationId,
    });

    setIsLoading(false);

    if (error) {
      toast.error('Failed to leave organization', {
        description: error.message,
      });
      return;
    }

    refetch();
    setOpen(false);
    toast.success('Left organization successfully');
  }

  return (
    <div className="flex-1 p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Your Organizations
          </h1>
        </div>

        <div className="flex flex-col space-y-4">
          {organizations?.length === 0 && (
            <div className="text-muted flex items-center justify-center rounded-lg border p-4">
              You are not a member of any organization.
            </div>
          )}

          {organizations?.map((org) => (
            <div
              key={org.id}
              className="bg-card hover:bg-accent/10 flex items-center justify-between rounded-lg border p-4 transition-colors">
              <div className="flex items-center gap-4">
                <div className="bg-muted flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={org.logo ?? undefined} alt={org.name} />
                    <AvatarFallback>{getInitials(org.name)}</AvatarFallback>
                  </Avatar>
                </div>
                <h2 className="text-lg font-medium">{org.name}</h2>
              </div>

              <Dialog open={open} onOpenChange={setOpen}>
                <RadixDialog.Trigger asChild>
                  <Button
                    variant="outline"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10">
                    Leave
                  </Button>
                </RadixDialog.Trigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <AlertCircle className="text-destructive h-5 w-5" />
                      Leave Organization
                    </DialogTitle>
                    <DialogDescription>
                      Are you sure you want to leave {org.name}? This action
                      cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                      variant="outline"
                      disabled={isLoading}
                      className="mr-4"
                      onClick={() => setOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      disabled={isLoading}
                      onClick={async () => await leaveOrganization(org.id)}>
                      {isLoading ? (
                        <Spinner className="text-white dark:text-black" />
                      ) : null}
                      Leave Organization
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
