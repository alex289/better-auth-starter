'use client';

import BanUserDialog from '@/components/dialogs/ban-user-dialog';
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
import { ColumnDef } from '@tanstack/react-table';
import { UserWithRole } from 'better-auth/plugins';
import {
  ClipboardCopy,
  MoreHorizontal,
  RefreshCw,
  Trash,
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
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const router = useRouter();
      const user = row.original;

      async function impersonateUser(id: string) {
        const res = await authClient.admin.impersonateUser({ userId: id });

        if (res.error) {
          toast.error('Failed to send reset password email', {
            description: res.error.message,
          });
          return;
        }

        toast.success('Impersonated user');
        router.push('/dashboard');
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
              <DropdownMenuItem>
                <Trash className="mr-2 h-4 w-4" /> Delete user
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RefreshCw className="mr-2 h-4 w-4" /> Revoke sessions
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => await impersonateUser(user.id)}>
                <UserCircle className="mr-2 h-4 w-4" />
                Impersonate
              </DropdownMenuItem>
              {/* <DropdownMenuItem> */}
              {/* {user.banned ? (
                  <>
                    <CircleOff className="mr-2 h-4 w-4" /> Unban user
                  </>
                ) : (
                  <>
                    <Ban className="mr-2 h-4 w-4" /> Ban user
                  </>
                )} */}
              <BanUserDialog banned={user.banned ?? false} />
              {/* </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
