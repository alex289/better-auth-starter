'use client';

import { authClient } from '@/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Spinner } from '../spinner';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const inviteMemberSchemaSchema = z.object({
  email: z.email(),
  role: z.enum(['admin', 'member']),
});

export default function InviteMemberDialog({
  organizationId,
  activeUserRole,
}: {
  organizationId: string;
  activeUserRole: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof inviteMemberSchemaSchema>>({
    resolver: zodResolver(inviteMemberSchemaSchema),
    defaultValues: {
      email: '',
      role: 'member' as const,
    },
  });

  async function onSubmit(values: z.infer<typeof inviteMemberSchemaSchema>) {
    setIsLoading(true);

    const { error } = await authClient.organization.inviteMember({
      email: values.email,
      role: values.role,
      organizationId,
    });

    setIsLoading(false);

    if (error) {
      toast.error('Failed to invite member', {
        description: error.message,
      });
      return;
    }

    router.refresh();
    setIsDialogOpen(false);
    toast.success('Successfully invited member');
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button disabled={activeUserRole === 'member'}>
          <Send className="mr-2 h-4 w-4" /> Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite new member</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid gap-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="max@mustermann.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Spinner className="text-white dark:text-black" />
              ) : null}
              Invite Member
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
