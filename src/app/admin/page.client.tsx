'use client';

import { authClient } from '@/lib/auth-client';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryState,
} from 'nuqs';
import { columns } from './columns';
import { DataTable } from './data-table';

export default function AdminPageClient() {
  const [pageSize] = useQueryState('limit', parseAsInteger.withDefault(1000));
  const [sortBy] = useQueryState(
    'sortBy',
    parseAsString.withDefault('createdAt'),
  );
  const [sortDirection] = useQueryState(
    'sortDirection',
    parseAsStringLiteral(['asc', 'desc']).withDefault('desc'),
  );
  const [search] = useQueryState('search', parseAsString.withDefault(''));
  const [currentPage] = useQueryState('page', parseAsInteger.withDefault(1));

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const data = await authClient.admin.listUsers(
        {
          query: {
            limit: pageSize,
            sortBy,
            sortDirection,
            searchValue: search,
            offset: (currentPage - 1) * pageSize,
          },
        },
        {
          throw: true,
        },
      );
      return data?.users || [];
    },
  });

  return (
    <>
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <DataTable columns={columns} data={users ?? []} />
      )}
    </>
  );
}
