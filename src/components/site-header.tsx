'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { ThemeToggle } from './theme-toggle';

export function SiteHeader({
  role,
  isImpersonating,
}: {
  role?: string;
  isImpersonating?: boolean;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function stopImpersonating() {
    setIsLoading(true);

    const res = await authClient.admin.stopImpersonating();

    setIsLoading(false);

    if (res.error) {
      toast.error('Failed to stop impersonating user', {
        description: res.error.message,
      });
      return;
    }

    toast.success('Stopped impersonating user');
    router.push('/admin');
  }
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Documents</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://github.com/alex289/better-auth-starter"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground">
              GitHub
            </a>
          </Button>

          {isImpersonating ? (
            <Button onClick={stopImpersonating} disabled={isLoading}>
              Stop Impersonating
            </Button>
          ) : null}

          {role?.includes('admin') ? (
            <Button asChild>
              <Link href="/admin">Admin</Link>
            </Button>
          ) : null}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
