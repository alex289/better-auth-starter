'use client';

import { MoreHorizontal, RefreshCw, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { authClient } from '@/lib/auth-client';
import { FullOrganizationInvitation } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Spinner } from './spinner';

// TOOD: Only admins should invite and edit

export function InvitationsList({
  invitations,
}: {
  invitations: FullOrganizationInvitation[];
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  async function cancelInvitation(invitation: FullOrganizationInvitation) {
    setIsLoading(true);

    const { error } = await authClient.organization.cancelInvitation({
      invitationId: invitation.id,
    });

    setIsLoading(false);

    if (error) {
      toast.error('Failed to cancel invitation', {
        description: error.message,
      });
      return;
    }

    router.refresh();
    setIsCancelDialogOpen(false);
    toast.success('Successfully canceled invitation');
  }

  async function resendInvitation(invitation: FullOrganizationInvitation) {
    setIsLoading(true);

    const { error } = await authClient.organization.inviteMember({
      resend: true,
      email: invitation.email,
      role: invitation.role,
      organizationId: invitation.organizationId,
    });

    setIsLoading(false);

    if (error) {
      toast.error('Failed to resend invitation', {
        description: error.message,
      });
      return;
    }

    router.refresh();
    toast.success('Successfully resent invitation');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Invitations</CardTitle>
        <CardDescription>
          Manage pending invitations to your organization.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {invitations.length === 0 ? (
          <div className="text-muted-foreground py-6 text-center">
            No pending invitations
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Invited At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations.map((invitation) => (
                <TableRow key={invitation.id}>
                  <TableCell className="font-medium">
                    {invitation.email}
                  </TableCell>
                  <TableCell className="capitalize">
                    {invitation.role}
                  </TableCell>
                  <TableCell>
                    {new Intl.DateTimeFormat('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    }).format(invitation.expiresAt)}
                  </TableCell>
                  <TableCell className="capitalize">
                    {invitation.status}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="cursor-pointer"
                          disabled={isLoading}
                          onClick={async () =>
                            await resendInvitation(invitation)
                          }>
                          {isLoading ? (
                            <Spinner className="text-white dark:text-black" />
                          ) : (
                            <RefreshCw className="mr-2 h-4 w-4" />
                          )}
                          Resend
                        </DropdownMenuItem>
                        <Dialog
                          open={isCancelDialogOpen}
                          onOpenChange={setIsCancelDialogOpen}>
                          <DialogTrigger asChild>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onSelect={(e) => e.preventDefault()}>
                              <X className="mr-2 h-4 w-4" />
                              Cancel
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Cancel Invitation</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to cancel this invitation?
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <p className="font-medium">{invitation.email}</p>
                              <p className="text-muted-foreground text-sm">
                                Role:{' '}
                                <span className="capitalize">
                                  {invitation.role}
                                </span>
                              </p>
                            </div>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                disabled={isLoading}
                                onClick={() => setIsCancelDialogOpen(false)}>
                                Keep Invitation
                              </Button>
                              <Button
                                variant="destructive"
                                disabled={isLoading}
                                onClick={async () =>
                                  await cancelInvitation(invitation)
                                }>
                                {isLoading ? (
                                  <Spinner className="text-white dark:text-black" />
                                ) : null}
                                Cancel Invitation
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
