'use client';

import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Ban, CalendarIcon, CircleOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

export default function BanUserDialog({ banned }: { banned: boolean }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState<string | undefined>();
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [banForm, setBanForm] = useState({
    userId: '',
    reason: '',
    expirationDate: undefined as Date | undefined,
  });

  //   onClick={async () => {
  //     setBanForm({
  //         userId: user.id,
  //         reason: "",
  //         expirationDate: undefined,
  //     });
  //     if (user.banned) {
  //         setIsLoading(`ban-${user.id}`);
  //         await client.admin.unbanUser(
  //             {
  //                 userId: user.id,
  //             },
  //             {
  //                 onError(context) {
  //                     toast.error(
  //                         context.error.message ||
  //                             "Failed to unban user",
  //                     );
  //                     setIsLoading(undefined);
  //                 },
  //                 onSuccess() {
  //                     queryClient.invalidateQueries({
  //                         queryKey: ["users"],
  //                     });
  //                     toast.success("User unbanned successfully");
  //                 },
  //             },
  //         );
  //         queryClient.invalidateQueries({
  //             queryKey: ["users"],
  //         });
  //     } else {
  //         setIsBanDialogOpen(true);
  //     }
  // }}

  return (
    <Dialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          {banned ? (
            <>
              <CircleOff className="mr-2 h-4 w-4" /> Unban user
            </>
          ) : (
            <>
              <Ban className="mr-2 h-4 w-4" /> Ban user
            </>
          )}
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ban User</DialogTitle>
        </DialogHeader>
        <form className="space-y-4">
          <div>
            <Label htmlFor="reason">Reason</Label>
            <Input
              id="reason"
              value={banForm.reason}
              onChange={(e) =>
                setBanForm({ ...banForm, reason: e.target.value })
              }
              required
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="expirationDate">Expiration Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="expirationDate"
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !banForm.expirationDate && 'text-muted-foreground',
                  )}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {banForm.expirationDate ? (
                    format(banForm.expirationDate, 'PPP')
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={banForm.expirationDate}
                  onSelect={(date) =>
                    setBanForm({ ...banForm, expirationDate: date })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading === `ban-${banForm.userId}`}>
            {isLoading === `ban-${banForm.userId}` ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Banning...
              </>
            ) : (
              'Ban User'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
