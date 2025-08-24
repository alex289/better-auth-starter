'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Key } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { authClient } from '@/lib/auth-client';

const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  rememberMe: z.boolean(),
});

const resetPasswordSchema = z.object({
  email: z.email(),
});

function ForgotPasswordDialog({ captchaToken }: { captchaToken: string }) {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    setLoading(true);
    const { error } = await authClient.forgetPassword({
      email: values.email,
      redirectTo: '/reset-password',
      fetchOptions: {
        headers: {
          'x-captcha-response': captchaToken,
        },
      },
    });

    setLoading(false);

    if (error) {
      toast.error('Failed to send reset password email', {
        description: error.message,
      });
      return;
    }

    toast.success('Password reset email sent');
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer text-sm underline">
          Forgot your password?
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Forgot password?</DialogTitle>
          <DialogDescription>
            Enter your email address and we will send you a password reset link.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="grid gap-4">
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
            <DialogFooter>
              <Button
                disabled={loading}
                type="button"
                onClick={form.handleSubmit(onSubmit)}>
                {loading ? (
                  <Spinner className="text-white dark:text-black" />
                ) : null}
                Request password reset
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<'passkey' | 'password' | null>(null);
  const [captchaToken, setCaptchaToken] = useState('');
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  async function passkeySignIn() {
    setLoading('passkey');
    const res = await authClient.signIn.passkey();
    setLoading(null);

    if (res?.error) {
      toast.error('Failed to sign-in', {
        description: res.error.message,
      });
      return;
    }

    // Workaround: router.push makes the UserMenu not rendering at all
    window.location.href = '/dashboard';
  }

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    setLoading('password');
    const res = await authClient.signIn.email({
      email: values.email,
      password: values.password,
      rememberMe: values.rememberMe,
      fetchOptions: {
        headers: {
          'x-captcha-response': captchaToken,
        },
      },
    });
    setLoading(null);

    if (res.error) {
      toast.error('Failed to sign-in', {
        description: res.error.message,
      });
      return;
    }

    router.push('/dashboard');
  }

  return (
    <Card className="min-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>
          Enter your email and password to sign in.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
              name="password"
              render={({ field }) => (
                <FormItem className="grid gap-1">
                  <FormLabel className="flex justify-between">
                    Password{' '}
                    <ForgotPasswordDialog captchaToken={captchaToken} />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="..." type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                  <FormControl>
                    <Checkbox
                      disabled={field.disabled}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Remember me</FormLabel>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-4">
              <Button type="submit" disabled={loading === 'password'}>
                {loading === 'password' ? (
                  <Spinner className="text-white dark:text-black" />
                ) : null}
                Sign-in
              </Button>

              <Separator className="my-4" />

              <Button
                variant="outline"
                type="button"
                className="gap-2"
                disabled={loading === 'passkey'}
                onClick={async () => await passkeySignIn()}>
                {loading === 'passkey' ? (
                  <Spinner className="mr-2 h-4 w-4" />
                ) : (
                  <Key className="mr-2 h-4 w-4" />
                )}
                Sign-in with Passkey
              </Button>

              <Button
                variant="outline"
                type="button"
                className="gap-2"
                onClick={async () =>
                  await authClient.signIn.social({
                    provider: 'github',
                  })
                }>
                <svg
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_3378_20115)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.50662 0C4.07917 0 0.5 3.60555 0.5 8.06611C0.5 11.6317 2.79329 14.6498 5.9747 15.7181C6.37246 15.7984 6.51816 15.5445 6.51816 15.331C6.51816 15.144 6.50505 14.503 6.50505 13.8352C4.2778 14.316 3.81399 12.8736 3.81399 12.8736C3.45606 11.9388 2.92572 11.6985 2.92572 11.6985C2.19674 11.2044 2.97882 11.2044 2.97882 11.2044C3.78744 11.2578 4.21175 12.0324 4.21175 12.0324C4.92745 13.2609 6.08074 12.9138 6.54471 12.7001C6.61092 12.1792 6.82315 11.8187 7.0485 11.6184C5.27211 11.4314 3.40312 10.737 3.40312 7.63869C3.40312 6.7573 3.72107 6.03619 4.22486 5.47536C4.14538 5.27509 3.86693 4.44696 4.30451 3.33858C4.30451 3.33858 4.98055 3.12487 6.50488 4.16654C7.1575 3.98998 7.83054 3.90016 8.50662 3.8994C9.18266 3.8994 9.87181 3.99298 10.5082 4.16654C12.0327 3.12487 12.7087 3.33858 12.7087 3.33858C13.1463 4.44696 12.8677 5.27509 12.7882 5.47536C13.3053 6.03619 13.6101 6.7573 13.6101 7.63869C13.6101 10.737 11.7411 11.418 9.95146 11.6184C10.2432 11.8721 10.4949 12.3528 10.4949 13.114C10.4949 14.1957 10.4818 15.0638 10.4818 15.3308C10.4818 15.5445 10.6277 15.7984 11.0253 15.7182C14.2067 14.6497 16.5 11.6317 16.5 8.06611C16.5131 3.60555 12.9208 0 8.50662 0Z"
                      fill="currentColor"></path>
                  </g>
                  <defs>
                    <clipPath id="clip0_3378_20115">
                      <rect
                        width="16"
                        height="16"
                        fill="white"
                        transform="translate(0.5)"></rect>
                    </clipPath>
                  </defs>
                </svg>
                Sign in with GitHub
              </Button>
              <Button
                variant="outline"
                type="button"
                className="gap-2"
                onClick={async () =>
                  await authClient.signIn.social({
                    provider: 'google',
                  })
                }>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_3378_20108)">
                    <path
                      d="M8 6.54541V9.6436H12.3054C12.1164 10.64 11.549 11.4836 10.6981 12.0509L13.2945 14.0655C14.8072 12.6691 15.68 10.6182 15.68 8.18185C15.68 7.61459 15.6291 7.06908 15.5345 6.5455L8 6.54541Z"
                      fill="#4285F4"></path>
                    <path
                      d="M3.51576 9.52246L2.93018 9.97071L0.857422 11.5852C2.17378 14.1961 4.87176 15.9998 7.99901 15.9998C10.159 15.9998 11.9698 15.287 13.2935 14.0653L10.6972 12.0507C9.98443 12.5307 9.07533 12.8216 7.99901 12.8216C5.91902 12.8216 4.1518 11.418 3.51903 9.52708L3.51576 9.52246Z"
                      fill="#34A853"></path>
                    <path
                      d="M0.858119 4.41455C0.312695 5.49087 0 6.70543 0 7.99996C0 9.29448 0.312695 10.509 0.858119 11.5854C0.858119 11.5926 3.51998 9.51991 3.51998 9.51991C3.35998 9.03991 3.26541 8.53085 3.26541 7.99987C3.26541 7.46889 3.35998 6.95984 3.51998 6.47984L0.858119 4.41455Z"
                      fill="#FBBC05"></path>
                    <path
                      d="M7.99918 3.18545C9.17737 3.18545 10.2246 3.59271 11.061 4.37818L13.3519 2.0873C11.9628 0.792777 10.1592 0 7.99918 0C4.87193 0 2.17378 1.79636 0.857422 4.41455L3.5192 6.48001C4.15189 4.58908 5.91919 3.18545 7.99918 3.18545Z"
                      fill="#EA4335"></path>
                  </g>
                  <defs>
                    <clipPath id="clip0_3378_20108">
                      <rect width="16" height="16" fill="white"></rect>
                    </clipPath>
                  </defs>
                </svg>
                Sign in with Google
              </Button>
            </div>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
      <Captcha handleVerify={setCaptchaToken} />
    </Card>
  );
}
