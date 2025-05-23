'use client';

import DeleteOrganizationDialog from '@/components/dialogs/delete-organization-dialog';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AllOrganizations } from '@/db/queries';
import { ColumnDef } from '@tanstack/react-table';
import {
  ChevronDown,
  ChevronRight,
  ClipboardCopy,
  Mail,
  MoreHorizontal,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';

export const organizationColumns: ColumnDef<AllOrganizations[0]>[] = [
  {
    id: 'expander',
    header: () => null,
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => row.toggleExpanded()}
        aria-label="Toggle details">
        {row.getIsExpanded() ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: 'slug',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Slug" />
    ),
  },
  {
    accessorKey: 'invitations',
    header: 'Invitations',
    cell: (info) => {
      const count = (info.getValue() as unknown[]).length;
      return (
        <div className="flex items-center gap-1">
          <Mail className="text-muted-foreground h-4 w-4" />
          <span>{count}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'members',
    header: 'Members',
    cell: (info) => {
      const count = (info.getValue() as unknown[]).length;
      return (
        <div className="flex items-center gap-1">
          <Users className="text-muted-foreground h-4 w-4" />
          <span>{count}</span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const organization = row.original;

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
                  navigator.clipboard.writeText(organization.id);
                  toast('Copied organization ID to clipboard');
                }}>
                <ClipboardCopy className="mr-2 h-4 w-4" />
                Copy organization ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DeleteOrganizationDialog organizationId={organization.id} />
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
