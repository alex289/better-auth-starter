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
import { CustomerOrder } from '@polar-sh/sdk/models/components/customerorder.js';
import { ColumnDef } from '@tanstack/react-table';
import { formatDistanceToNow } from 'date-fns';
import { ClipboardCopy, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

export const orderColumns: ColumnDef<CustomerOrder>[] = [
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
      const email = row.original.customerId;
      return <span>{email || 'N/A'}</span>;
    },
  },
  {
    accessorKey: 'productName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
    cell: ({ row }) => {
      const productName = row.original.product.name;
      return <span>{productName || 'N/A'}</span>;
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const amount = row.original.totalAmount;
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
            status === 'paid'
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
            {order.customerId && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    if (order.customerId) {
                      navigator.clipboard.writeText(order.customerId);
                      toast('Copied customer ID to clipboard');
                    }
                  }}>
                  <ClipboardCopy className="mr-2 h-4 w-4" />
                  Copy customer ID
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
