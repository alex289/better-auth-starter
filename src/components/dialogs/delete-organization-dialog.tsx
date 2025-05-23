'use client';

import { authClient } from '@/lib/auth-client';
import { AlertCircle, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Spinner } from '../spinner';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { DropdownMenuItem } from '../ui/dropdown-menu';

export default function DeleteOrganizationDialog({
  organizationId,
}: {
  organizationId: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  async function deleteOrganization() {
    setIsLoading(true);

    const res = await authClient.organization.delete({ organizationId });

    setIsLoading(false);

    if (res.error) {
      toast.error('Failed to delete organization', {
        description: res.error.message,
      });
      return;
    }

    router.refresh();
    toast.success('Successfully deleted organization');
    setIsDialogOpen(false);
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="cursor-pointer">
          <Trash className="mr-2 h-4 w-4" /> Delete organization
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Delete Organization
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="py-2">
          Are you sure you want to delete this organization? This action cannot
          be undone.
        </DialogDescription>
        <DialogFooter className="flex-col space-y-2 sm:flex-row sm:justify-end sm:space-y-0 sm:space-x-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsDialogOpen(false)}
            className="w-full sm:w-auto"
            disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={deleteOrganization}
            className="w-full sm:w-auto"
            disabled={isLoading}>
            {isLoading ? (
              <Spinner className="text-white dark:text-black" />
            ) : null}
            Delete organization
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
