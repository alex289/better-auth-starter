'use client';

import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Ban, CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Spinner } from '../spinner';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

const banSchema = z.object({
  reason: z.string(),
  expirationDate: z.date().optional(),
});

export default function BanUserDialog({ userId }: { userId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof banSchema>>({
    resolver: zodResolver(banSchema),
    defaultValues: {
      reason: '',
      expirationDate: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof banSchema>) {
    setIsLoading(true);

    const { error } = await authClient.admin.banUser({
      userId,
      banReason: values.reason.length > 0 ? values.reason : undefined,
      banExpiresIn: values.expirationDate
        ? values.expirationDate.getTime() - new Date().getTime()
        : undefined,
    });

    setIsLoading(false);

    if (error) {
      toast.error('Failed to ban user', {
        description: error.message,
      });
      return;
    }

    queryClient.invalidateQueries({
      queryKey: ['users'],
    });
    setIsBanDialogOpen(false);
    toast.success('User banned');
  }

  return (
    <Dialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Ban className="mr-2 h-4 w-4" /> Ban user
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ban User</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem className="grid gap-1">
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Input placeholder="Spamming" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expirationDate"
              render={({ field }) => (
                <FormItem className="grid gap-1">
                  <FormLabel>Expiration Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}>
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={{ before: new Date() }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Spinner className="text-white dark:text-black" />
              ) : null}
              Ban User
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
