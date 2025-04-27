'use client';

import { authClient } from '@/lib/auth-client';
import { useQueryClient } from '@tanstack/react-query';
import { AlertCircle, Trash } from 'lucide-react';
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

export default function DeleteUserDialog({ userId }: { userId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  async function deleteUser() {
    setIsLoading(true);

    const res = await authClient.admin.removeUser({ userId });

    setIsLoading(false);

    if (res.error) {
      toast.error('Failed to delete user', {
        description: res.error.message,
      });
      return;
    }

    queryClient.invalidateQueries({
      queryKey: ['users'],
    });
    toast.success('Successfully deleted user');
    setIsDialogOpen(false);
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Trash className="mr-2 h-4 w-4" /> Delete user
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Delete User
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="py-2">
          Are you sure you want to delete this user? This action cannot be
          undone.
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
            onClick={deleteUser}
            className="w-full sm:w-auto"
            disabled={isLoading}>
            {isLoading ? (
              <Spinner className="text-white dark:text-black" />
            ) : null}
            Delete user
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
