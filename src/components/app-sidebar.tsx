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
import { getInitials } from '@/lib/utils';
import { User } from 'better-auth';
import { ChevronDown, PlusCircle } from 'lucide-react';
import { useState } from 'react';
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
  organizations: [
    { slug: '1', name: 'Acme Inc', logo: 'https://example.com/logo.png' },
    { slug: '2', name: 'Globex Corp', logo: 'https://example.com/logo.png' },
    {
      slug: '3',
      name: 'Stark Industries',
      logo: 'https://example.com/logo.png',
    },
  ],
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
      title: 'Settings',
      url: '#',
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
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: User }) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [currentOrg, setCurrentOrg] = useState(data.organizations[0]!);
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex w-full items-center justify-start gap-2 px-2">
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
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
              {data.organizations.map((org) => (
                <DropdownMenuItem
                  key={org.slug}
                  className="cursor-pointer"
                  onClick={() => setCurrentOrg(org)}>
                  <Avatar className="mr-2 h-5 w-5">
                    <AvatarImage src={org.logo ?? undefined} alt={org.name} />
                    <AvatarFallback>{getInitials(org.name)}</AvatarFallback>
                  </Avatar>
                  <span>{org.name}</span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <PlusCircle className="mr-2 h-4 w-4" />
                <span>Create Organization</span>
              </DropdownMenuItem>
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
