'use client';

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { authClient } from '@/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const twoFactorSchema = z.object({
  totpCode: z.string().length(6).regex(/^\d+$/),
});

export default function Page() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof twoFactorSchema>>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      totpCode: '',
    },
  });

  async function onSubmit(values: z.infer<typeof twoFactorSchema>) {
    setLoading(true);
    const res = await authClient.twoFactor.verifyTotp({
      code: values.totpCode,
    });

    setLoading(false);

    if (res?.error) {
      toast.error('Failed to sign-in', {
        description: res.error.message,
      });
      return;
    }

    toast.success('Successfully verified 2fa');
    router.push('/dashboard');
  }

  return (
    <Card className="min-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">TOTP Verification</CardTitle>
        <CardDescription>
          Enter your 6-digit TOTP code to sign in.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="totpCode"
              render={({ field }) => (
                <FormItem className="justify-center">
                  <FormLabel>TOTP Code</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Spinner className="text-white dark:text-black" />
                ) : null}
                Verify
              </Button>
            </div>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          <Link href="/two-factor/otp" className="underline">
            Switch to Email Verification
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
