'use client';

import CreateUserDialog from '@/components/dialogs/create-user-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { AllOrganizations } from '@/db/queries';
import { authClient } from '@/lib/auth-client';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryState,
} from 'nuqs';
import { organizationColumns } from './organization-columns';
import { OrganizationDataTable } from './organization-data-table';
import { userColumns } from './user-columns';
import { UserDataTable } from './user-data-table';

export default function AdminPageClient({
  organizations,
}: {
  organizations: AllOrganizations;
}) {
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

  const { data: users, isLoading: isUserLoading } = useQuery({
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
    <Tabs defaultValue="users">
      <TabsList className="mb-6">
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="organizations">Organizations</TabsTrigger>
      </TabsList>
      <TabsContent value="users">
        <div className="flex justify-end">
          <CreateUserDialog />
        </div>

        {isUserLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <UserDataTable columns={userColumns} data={users ?? []} />
        )}
      </TabsContent>
      <TabsContent value="organizations">
        <OrganizationDataTable
          columns={organizationColumns}
          data={organizations ?? []}
        />
      </TabsContent>
    </Tabs>
  );
}
