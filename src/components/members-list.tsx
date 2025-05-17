'use client';

import { MoreHorizontal, UserMinus } from 'lucide-react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { authClient } from '@/lib/auth-client';
import { FullOrganizationMember } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Spinner } from './spinner';

// TODO: Edit own role?

export function MembersList({
  members,
  activeUserRole,
}: {
  members: FullOrganizationMember[];
  activeUserRole: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);

  async function setMemberRole(
    member: FullOrganizationMember,
    newRole: 'owner' | 'admin' | 'member',
  ) {
    setIsLoading(true);

    const { error } = await authClient.organization.updateMemberRole({
      organizationId: member.organizationId,
      memberId: member.id,
      role: newRole,
    });

    setIsLoading(false);

    if (error) {
      toast.error('Failed to update member role', {
        description: error.message,
      });
      return;
    }

    toast.success('Successfully updated member role');
  }

  async function removeMember(member: FullOrganizationMember) {
    setIsLoading(true);

    const { error } = await authClient.organization.removeMember({
      organizationId: member.organizationId,
      memberIdOrEmail: member.id,
    });

    setIsLoading(false);

    if (error) {
      toast.error('Failed to delete user', {
        description: error.message,
      });
      return;
    }

    router.refresh();
    toast.success('Successfully removed member');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Members</CardTitle>
        <CardDescription>
          Manage members and their roles in your organization.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">
                  {member.user.name}
                </TableCell>
                <TableCell>{member.user.email}</TableCell>
                <TableCell>
                  <Select
                    defaultValue={member.role}
                    onValueChange={async (value) =>
                      await setMemberRole(
                        member,
                        value as 'owner' | 'admin' | 'member',
                      )
                    }
                    disabled={member.role === 'owner'}>
                    <SelectTrigger className="w-[110px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">Owner</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{member.createdAt.toLocaleDateString()}</TableCell>
                <TableCell>
                  {activeUserRole !== 'member' && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Dialog
                          open={isRemoveDialogOpen}
                          onOpenChange={setIsRemoveDialogOpen}>
                          <DialogTrigger asChild>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onSelect={(e) => e.preventDefault()}>
                              <UserMinus className="mr-2 h-4 w-4" />
                              Remove member
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Remove Member</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to remove this member from
                                the organization?
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <p className="font-medium">{member.user.name}</p>
                              <p className="text-muted-foreground text-sm">
                                {member.user.email}
                              </p>
                            </div>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                disabled={isLoading}
                                onClick={() => setIsRemoveDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                disabled={isLoading}
                                onClick={async () =>
                                  await removeMember(member)
                                }>
                                {isLoading ? (
                                  <Spinner className="text-white dark:text-black" />
                                ) : null}
                                Remove Member
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
