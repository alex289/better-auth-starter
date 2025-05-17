'use client';

import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react';
import * as React from 'react';

import { NavDocuments } from '@/components/nav-documents';
import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { authClient } from '@/lib/auth-client';
import { getInitials } from '@/lib/utils';
import { User } from 'better-auth';
import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { toast } from 'sonner';
import CreateOrganizationDialog from './dialogs/create-organization-dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: IconDashboard,
    },
    {
      title: 'Lifecycle',
      url: '#',
      icon: IconListDetails,
    },
    {
      title: 'Analytics',
      url: '#',
      icon: IconChartBar,
    },
    {
      title: 'Projects',
      url: '#',
      icon: IconFolder,
    },
    {
      title: 'Team',
      url: '#',
      icon: IconUsers,
    },
  ],
  navClouds: [
    {
      title: 'Capture',
      icon: IconCamera,
      isActive: true,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
    {
      title: 'Proposal',
      icon: IconFileDescription,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
    {
      title: 'Prompts',
      icon: IconFileAi,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Organization Settings',
      url: '/organization/settings',
      icon: IconSettings,
    },
    {
      title: 'Get Help',
      url: '#',
      icon: IconHelp,
    },
    {
      title: 'Search',
      url: '#',
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: 'Data Library',
      url: '#',
      icon: IconDatabase,
    },
    {
      name: 'Reports',
      url: '#',
      icon: IconReport,
    },
    {
      name: 'Word Assistant',
      url: '#',
      icon: IconFileWord,
    },
  ],
};

export function AppSidebar({
  user,
  activeOrganizationId,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: User;
  activeOrganizationId: string | null | undefined;
}) {
  const router = useRouter();

  const { data: organizations } = authClient.useListOrganizations();
  const currentOrg = useMemo(() => {
    if (!activeOrganizationId) return null;
    return organizations?.find((org) => org.id === activeOrganizationId);
  }, [activeOrganizationId, organizations]);

  async function setActiveOrganization(organizationId: string) {
    const { error } = await authClient.organization.setActive({
      organizationId,
    });

    if (error) {
      toast.error('Failed to set active organization', {
        description: error.message,
      });
    }

    toast.success('Active organization set successfully');
    router.refresh();
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex w-full items-center justify-start gap-2 px-2">
                {currentOrg ? (
                  <>
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={currentOrg.logo ?? undefined}
                        alt={currentOrg.name}
                      />
                      <AvatarFallback>
                        {getInitials(currentOrg.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{currentOrg.name}</span>
                    <ChevronDown className="ml-auto h-4 w-4" />
                  </>
                ) : (
                  <span className="font-medium">Select Organization</span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
              {!organizations || organizations.length === 0 ? (
                <DropdownMenuItem disabled>
                  No organizations yet
                </DropdownMenuItem>
              ) : null}
              {organizations?.map((org) => (
                <DropdownMenuItem
                  key={org.slug}
                  className="cursor-pointer"
                  onClick={() => setActiveOrganization(org.id)}>
                  <Avatar className="mr-2 h-5 w-5">
                    <AvatarImage src={org.logo ?? undefined} alt={org.name} />
                    <AvatarFallback>{getInitials(org.name)}</AvatarFallback>
                  </Avatar>
                  <span>{org.name}</span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <CreateOrganizationDialog />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
