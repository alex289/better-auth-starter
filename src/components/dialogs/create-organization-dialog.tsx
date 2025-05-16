'use client';

import { authClient } from '@/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle } from 'lucide-react';
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

const createOrganizationSchema = z.object({
  name: z.string().min(2).max(50),
  logo: z.string().max(255).optional(),
});

export default function CreateOrganizationDialog() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof createOrganizationSchema>>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: '',
      logo: '',
    },
  });

  async function onSubmit(values: z.infer<typeof createOrganizationSchema>) {
    setIsLoading(true);

    const { error, data } = await authClient.organization.create({
      name: values.name,
      slug: generateSlugFromName(values.name),
      logo: values.logo && values.logo.length > 0 ? values.logo : undefined,
    });

    setIsLoading(false);

    if (error) {
      toast.error('Failed to create organization', {
        description: error.message,
      });
      return;
    }

    await authClient.organization.setActive({
      organizationId: data.id,
    });

    setIsDialogOpen(false);
    toast.success('Organization created successfully');
    router.refresh();
  }

  const generateSlugFromName = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          <span>Create Organization</span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Organization</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid gap-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Organization" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem className="grid gap-1">
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/logo.png"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Spinner className="text-white dark:text-black" />
              ) : null}
              Create organization
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
