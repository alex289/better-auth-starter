'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import Captcha from '@/components/captcha';
import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { convertImageToBase64 } from '@/lib/utils';

const signUpSchema = z
  .object({
    name: z.string().min(2),
    email: z.email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    image: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export default function SignUpPage() {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      image: '',
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    return file ? await convertImageToBase64(file) : '';
  };

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    setLoading(true);
    const res = await authClient.signUp.email({
      email: values.email,
      password: values.password,
      name: values.name,
      image: values.image.length > 0 ? values.image : undefined,
      fetchOptions: {
        headers: {
          'x-captcha-response': captchaToken,
        },
      },
    });

    setLoading(false);

    if (res.error) {
      toast.error('Failed to sign-up', {
        description: res.error.message,
      });
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <Card className="min-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Successfully signed up!</CardTitle>
        </CardHeader>
        <CardContent>
          Check your email for a verification link. Click the link to verify
          your email address.
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="min-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your name, email and password to create an account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid gap-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Max Mustermann" {...field} />
                  </FormControl>
                  <FormDescription>Just to display your name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              name="password"
              render={({ field }) => (
                <FormItem className="grid gap-1">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="grid gap-1">
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirm Password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="grid gap-1">
                  <FormLabel>Profile image (optional)</FormLabel>
                  <FormControl>
                    <div className="flex cursor-pointer items-center gap-2">
                      <Input
                        type="file"
                        accept="image/png, image/jpeg"
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

            <Button type="submit" disabled={loading}>
              {loading ? (
                <Spinner className="text-white dark:text-black" />
              ) : null}
              Sign-up
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link href="/sign-in" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
      <Captcha handleVerify={setCaptchaToken} />
    </Card>
  );
}
