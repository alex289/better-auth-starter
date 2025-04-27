'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { convertImageToBase64 } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from 'better-auth';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Spinner } from './spinner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';

const userSettingsSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  image: z.string(),
});

// TODO: Display image state
export function SettingsContent({ user }: { user: User }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof userSettingsSchema>>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      image: user.image ?? '',
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    return file ? await convertImageToBase64(file) : '';
  };

  async function onSubmit(values: z.infer<typeof userSettingsSchema>) {
    setLoading(true);
    let res = await authClient.updateUser({
      name: values.name,
      image: values.image.length > 0 ? values.image : undefined,
    });

    if (res.error) {
      toast.error('Failed to update settings', {
        description: res.error.message,
      });
      setLoading(false);
      return;
    }

    if (values.email !== user.email) {
      res = await authClient.changeEmail({
        newEmail: values.email,
      });

      if (res.error) {
        toast.error('Failed to change email', {
          description: res.error.message,
        });
        setLoading(false);
        return;
      }

      toast.success('Email change requested. Check your inbox.');
    }

    setLoading(false);
    toast.success('Successfully updated settings');
    router.refresh();
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            This is how others will see you on the platform.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Profile image (optional)</FormLabel>
                    <FormControl>
                      <div className="flex cursor-pointer items-center gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          className="w-full"
                          onChange={async (e) =>
                            field.onChange(await handleImageChange(e))
                          }
                        />
                        {field.value && (
                          <X
                            className="cursor-pointer"
                            onClick={() => {
                              field.onChange('');
                            }}
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Max Mustermann" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
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
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={loading} className="mt-4">
                {loading ? (
                  <Spinner className="text-white dark:text-black" />
                ) : null}
                Save changes
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
