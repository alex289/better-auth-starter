/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import BanUserDialog from '@/components/dialogs/ban-user-dialog';
import DeleteUserDialog from '@/components/dialogs/delete-user-dialog';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { authClient } from '@/lib/auth-client';
import { useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { UserWithRole } from 'better-auth/plugins';
import {
  ClipboardCopy,
  DiamondMinus,
  DiamondPlus,
  LogOut,
  MoreHorizontal,
  RefreshCw,
  UserCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// const handleDeleteUser = async (id: string) => {
//   setIsLoading(`delete-${id}`);
//   try {
//     await client.admin.removeUser({ userId: id });
//     toast.success("User deleted successfully");
//     queryClient.invalidateQueries({
//       queryKey: ["users"],
//     });
//   } catch (error: any) {
//     toast.error(error.message || "Failed to delete user");
//   } finally {
//     setIsLoading(undefined);
//   }
// };

// const handleRevokeSessions = async (id: string) => {
//   setIsLoading(`revoke-${id}`);
//   try {
//     await client.admin.revokeUserSessions({ userId: id });
//     toast.success("Sessions revoked for user");
//   } catch (error: any) {
//     toast.error(error.message || "Failed to revoke sessions");
//   } finally {
//     setIsLoading(undefined);
//   }
// };

export const columns: ColumnDef<UserWithRole>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
  },
  {
    accessorKey: 'banned',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Banned" />
    ),
    cell: ({ row }) => {
      const user = row.original;

      if (user.banned) {
        return <Badge variant="destructive">Yes</Badge>;
      }

      return <Badge variant="outline">No</Badge>;
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const router = useRouter();
      const queryClient = useQueryClient();
      const user = row.original;

      async function impersonateUser() {
        const res = await authClient.admin.impersonateUser({ userId: user.id });

        if (res.error) {
          toast.error('Failed to impersonate user', {
            description: res.error.message,
          });
          return;
        }

        toast.success('Impersonated user');
        router.push('/dashboard');
      }

      async function setUserRole() {
        const res = await authClient.admin.setRole({
          userId: user.id,
          role: user.role === 'user' ? 'admin' : 'user',
        });

        if (res.error) {
          toast.error('Failed to set user role', {
            description: res.error.message,
          });
          return;
        }

        toast.success('User role updated');
        queryClient.invalidateQueries({
          queryKey: ['users'],
        });
      }

      async function revokeUserSessions() {
        const res = await authClient.admin.revokeUserSessions({
          userId: user.id,
        });

        if (res.error) {
          toast.error('Failed to revoke user sessions', {
            description: res.error.message,
          });
          return;
        }

        toast.success('User sessions revoked');
      }

      async function unbanUser() {
        const res = await authClient.admin.unbanUser({
          userId: user.id,
        });

        if (res.error) {
          toast.error('Failed to unban user', {
            description: res.error.message,
          });
          return;
        }

        toast.success('User unbanned');
        queryClient.invalidateQueries({
          queryKey: ['users'],
        });
      }

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(user.id);
                  toast('Copied user ID to clipboard');
                }}>
                <ClipboardCopy className="mr-2 h-4 w-4" />
                Copy user ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={async () => await impersonateUser()}>
                <UserCircle className="mr-2 h-4 w-4" />
                Impersonate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={async () => await setUserRole()}>
                {user.role === 'user' ? (
                  <>
                    <DiamondPlus className="mr-2 h-4 w-4" /> Upgrade to admin
                  </>
                ) : (
                  <>
                    <DiamondMinus className="mr-2 h-4 w-4" />
                    Downgrade to user
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => await revokeUserSessions()}>
                <LogOut className="mr-2 h-4 w-4" /> Revoke sessions
              </DropdownMenuItem>
              {user.banned ? (
                <DropdownMenuItem onClick={async () => await unbanUser()}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Unban user
                </DropdownMenuItem>
              ) : (
                <BanUserDialog userId={user.id} />
              )}
              <DeleteUserDialog userId={user.id} />
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
