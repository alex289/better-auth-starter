'use client';

import { OrdersDataTable } from '@/components/orders-data-table';
import { Order } from '@/components/orders-columns';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const response = await fetch('/api/auth/polar/admin/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.result?.items || []);
      } else {
        toast.error('Failed to load orders');
      }
    } catch {
      console.error('Failed to load orders');
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="text-muted-foreground">Loading orders...</div>;
  }

  return <OrdersDataTable data={orders} />;
}
