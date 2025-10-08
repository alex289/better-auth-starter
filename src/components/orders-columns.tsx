'use client';

import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { formatDistanceToNow } from 'date-fns';
import { ClipboardCopy, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

export interface Order {
  id: string;
  amount: number;
  currency: string;
  status: string;
  customerEmail?: string;
  productName?: string;
  createdAt: string;
  user?: {
    id: string;
    email: string;
  };
}

export const orderColumns: ColumnDef<Order>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order ID" />
    ),
    cell: ({ row }) => {
      const id = row.original.id;
      return <span className="font-mono text-xs">{id.slice(0, 8)}...</span>;
    },
  },
  {
    accessorKey: 'customerEmail',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
    cell: ({ row }) => {
      const email = row.original.customerEmail || row.original.user?.email;
      return <span>{email || 'N/A'}</span>;
    },
  },
  {
    accessorKey: 'productName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
    cell: ({ row }) => {
      const productName = row.original.productName;
      return <span>{productName || 'N/A'}</span>;
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const amount = row.original.amount;
      const currency = row.original.currency || 'USD';
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
      }).format(amount / 100);
      return <span className="font-medium">{formatted}</span>;
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          variant={
            status === 'succeeded' || status === 'paid'
              ? 'default'
              : status === 'pending'
                ? 'secondary'
                : 'destructive'
          }>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      const createdAt = new Date(row.original.createdAt);
      return (
        <span className="text-muted-foreground text-sm">
          {formatDistanceToNow(createdAt, { addSuffix: true })}
        </span>
      );
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const order = row.original;

      return (
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
                navigator.clipboard.writeText(order.id);
                toast('Copied order ID to clipboard');
              }}>
              <ClipboardCopy className="mr-2 h-4 w-4" />
              Copy order ID
            </DropdownMenuItem>
            {order.user?.id && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    if (order.user?.id) {
                      navigator.clipboard.writeText(order.user.id);
                      toast('Copied user ID to clipboard');
                    }
                  }}>
                  <ClipboardCopy className="mr-2 h-4 w-4" />
                  Copy user ID
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
