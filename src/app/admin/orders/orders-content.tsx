'use client';

import { OrdersDataTable } from '@/app/admin/orders/orders-data-table';
import { authClient } from '@/lib/auth-client';
import { useQuery } from '@tanstack/react-query';

export function OrdersContent() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      try {
        const { data: orders } = await authClient.customer.orders.list({
          query: {
            page: 1,
            limit: 10,
          },
        });

        return orders?.result.items;
      } catch {
        console.error('Failed to load orders');
      }
    },
  });

  if (isLoading) {
    return <div className="text-muted-foreground">Loading orders...</div>;
  }

  return <OrdersDataTable data={orders ?? []} />;
}
